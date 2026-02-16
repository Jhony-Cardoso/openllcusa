import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { TaxFormService, TaxFormData } from '@/lib/services/tax-form.service'

/**
 * Transforma datos planos del formulario de onboarding a la estructura
 * anidada que espera TaxFormService.
 * 
 * Onboarding envía: { llcName, llcEin, ownerName, ... }
 * TaxFormService espera: { llc: { name, ein }, owner: { name }, ... }
 */
function transformToTaxFormData(raw: any): TaxFormData {
    return {
        taxYear: raw.taxYear || String(new Date().getFullYear() - 1),
        llc: {
            name: raw.llcName || raw.llc?.name || '',
            ein: raw.llcEin || raw.llc?.ein || '',
            address: raw.llcAddress || raw.llc?.address || '',
            city: raw.llcCity || raw.llc?.city || '',
            state: raw.llcState || raw.llc?.state || '',
            zip: raw.llcZip || raw.llc?.zip || '',
            formationDate: raw.formationDate || raw.llc?.formationDate || '',
            activityCode: raw.activityCode || raw.llc?.activityCode || '454110',
            activityDescription: raw.activityDescription || raw.llc?.activityDescription || 'E-Commerce Retail',
        },
        owner: {
            name: raw.ownerName || raw.owner?.name || '',
            address: raw.ownerAddress || raw.owner?.address || '',
            city: raw.ownerCity || raw.owner?.city || '',
            country: raw.ownerCountry || raw.owner?.country || '',
            taxId: raw.ownerTaxId || raw.owner?.taxId || '',
            referenceIdType: raw.ownerReferenceIdType || raw.owner?.referenceIdType || 'Foreign Tax ID',
        },
        financials: {
            capitalContributionCash: Number(raw.capitalContributionCash ?? raw.financials?.capitalContributionCash ?? 0),
            capitalContributionProperty: Number(raw.capitalContributionProperty ?? raw.financials?.capitalContributionProperty ?? 0),
            capitalDistributionCash: Number(raw.capitalDistributionCash ?? raw.financials?.capitalDistributionCash ?? 0),
            capitalDistributionProperty: Number(raw.capitalDistributionProperty ?? raw.financials?.capitalDistributionProperty ?? 0),
            formationCost: Number(raw.formationCost ?? raw.financials?.formationCost ?? 0),
        },
        signature: {
            signerName: raw.signerName || raw.signature?.signerName || raw.ownerName || '',
            signerTitle: raw.signerTitle || raw.signature?.signerTitle || 'Member',
            signatureDate: raw.signatureDate || raw.signature?.signatureDate || new Date().toISOString().split('T')[0],
            signatureDataUrl: raw.signatureDataUrl || raw.signature?.signatureDataUrl || null,
        }
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const pedidoId = params.id
        const supabaseAdmin = createAdminClient()

        // 1. Obtener el pedido con tax_data
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedido) {
            console.error('❌ Error obteniendo pedido:', pedidoError)
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        console.log('📦 Pedido obtenido:', pedido.id)
        console.log('📄 tax_data raw:', JSON.stringify(pedido.tax_data)?.substring(0, 300))

        if (!pedido.tax_data) {
            return NextResponse.json({
                error: 'No se encontraron datos fiscales en este pedido. Verifique que el cliente completó el formulario.'
            }, { status: 400 })
        }

        // 2. Transformar datos planos → estructura anidada que espera TaxFormService
        const taxData = transformToTaxFormData(pedido.tax_data)
        console.log('📄 tax_data transformado:', JSON.stringify(taxData).substring(0, 300))

        // Validar datos mínimos
        if (!taxData.llc.name || !taxData.llc.ein) {
            return NextResponse.json({
                error: `Datos fiscales incompletos. Nombre LLC: "${taxData.llc.name}", EIN: "${taxData.llc.ein}". Pida al cliente que complete el formulario.`
            }, { status: 400 })
        }

        // 3. Generar PDF
        console.log('📄 Generando PDF...')
        const pdfBytes = await TaxFormService.generate5472Package(taxData)
        console.log('✅ PDF generado:', pdfBytes.length, 'bytes')

        // 4. Asegurar que el bucket 'documentos' existe
        const bucketName = 'documentos'
        const { data: buckets } = await supabaseAdmin.storage.listBuckets()
        const bucketExists = buckets?.some(b => b.name === bucketName)

        if (!bucketExists) {
            console.log('📦 Creando bucket "documentos"...')
            const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucketName, {
                public: false,
                fileSizeLimit: 52428800, // 50MB
            })
            if (createBucketError) {
                console.error('❌ Error creando bucket:', createBucketError)
                return NextResponse.json({
                    error: `Error creando almacenamiento: ${createBucketError.message}`
                }, { status: 500 })
            }
            console.log('✅ Bucket "documentos" creado')
        }

        // 5. Subir PDF al bucket
        const fileName = `form-5472-1120-${pedidoId}.pdf`
        const filePath = `tax-forms/${fileName}`

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from(bucketName)
            .upload(filePath, pdfBytes, {
                contentType: 'application/pdf',
                upsert: true
            })

        if (uploadError) {
            console.error('❌ Error subiendo PDF:', JSON.stringify(uploadError))
            return NextResponse.json({
                error: `Error subiendo el documento: ${uploadError.message}`
            }, { status: 500 })
        }

        console.log('✅ PDF subido:', uploadData.path)

        // 6. Obtener URL firmada (bucket privado)
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
            .storage
            .from(bucketName)
            .createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 año de validez

        const pdfUrl = signedUrlData?.signedUrl || filePath
        console.log('✅ URL generada:', pdfUrl.substring(0, 80) + '...')

        // 6. Actualizar metadata del pedido
        const currentMetadata = pedido.metadata || {}
        const { error: updateError } = await supabaseAdmin
            .from('pedidos')
            .update({
                metadata: {
                    ...currentMetadata,
                    documents: {
                        ...(currentMetadata as any)?.documents,
                        form_5472_url: pdfUrl,
                        generated_at: new Date().toISOString()
                    },
                    estado_tramitacion: 'formularios_generados'
                }
            })
            .eq('id', pedidoId)

        if (updateError) {
            console.error('❌ Error actualizando metadata:', updateError)
            return NextResponse.json({ error: 'Error actualizando el pedido' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            pdfUrl,
            message: 'Formularios generados exitosamente'
        })

    } catch (error: any) {
        console.error('❌ Error generando formularios:', error)
        return NextResponse.json({
            error: error.message || 'Error interno del servidor'
        }, { status: 500 })
    }
}
