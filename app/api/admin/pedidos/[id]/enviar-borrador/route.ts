import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { TaxFormService, TaxFormData } from '@/lib/services/tax-form.service'
import { EmailService } from '@/lib/services/email.service'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Transforma datos planos del formulario de onboarding a la estructura
 * anidada que espera TaxFormService.
 * (Misma lógica que en generar-formularios-fiscales/route.ts)
 */
function transformToTaxFormData(raw: any): TaxFormData {
    return {
        taxYear: raw.taxYear || String(new Date().getFullYear() - 1),
        assistedFilling: !!raw.assistedFilling,
        llc: {
            name: raw.llcName || raw.llc?.name || '',
            ein: raw.llcEin || raw.llc?.ein || '',
            address: raw.llcAddress || raw.llc?.address || '',
            city: raw.llcCity || raw.llc?.city || '',
            state: raw.llcState || raw.llc?.state || '',
            zip: raw.llcZip || raw.llc?.zip || '',
            addressRoom: raw.llcAddressRoom || raw.llc?.addressRoom || '',
            formationDate: raw.formationDate || raw.llc?.formationDate || '',
            einAlternate: raw.llcEinAlternate || raw.llc?.einAlternate || '',
            countryOfIncorporation: raw.llcCountryOfIncorporation || raw.llc?.countryOfIncorporation || 'United States',
            taxResidenceCountries: raw.llcTaxResidenceCountries || raw.llc?.taxResidenceCountries || '',
            activityCode: raw.llcActivityCode || raw.llc?.activityCode || '454110',
            activityDescription: raw.llcActivityDescription || raw.llc?.activityDescription || 'E-Commerce Retail',
            isForeignOwnedDE: raw.isForeignOwnedDE ?? raw.llc?.isForeignOwnedDE ?? true,
            soleOwnerName: raw.soleOwnerName || raw.llc?.soleOwnerName || raw.ownerName || '',
            soleOwnerEin: raw.soleOwnerEin || raw.llc?.soleOwnerEin || '',
            soleOwnerReferenceId: raw.soleOwnerReferenceId || raw.llc?.soleOwnerReferenceId || raw.ownerTaxId || '',
            isDirectOwner: raw.isDirectOwner ?? raw.llc?.isDirectOwner ?? true,
            isOwnerUSPerson: raw.isOwnerUSPerson ?? raw.llc?.isOwnerUSPerson ?? false,
            isOwnerForeignPerson: raw.isOwnerForeignPerson ?? raw.llc?.isOwnerForeignPerson ?? true,
            totalAssets: Number(raw.totalAssets ?? raw.llc?.totalAssets ?? 0),
            hasRelatedPartyTransactions: raw.hasRelatedPartyTransactions ?? raw.llc?.hasRelatedPartyTransactions ?? true,
            isInitialReturn: raw.isInitialReturn ?? raw.llc?.isInitialReturn ?? (() => {
                const taxYear = String(raw.taxYear || new Date().getFullYear() - 1)
                const formDate = raw.formationDate || raw.llc?.formationDate || ''
                return formDate.includes(taxYear)
            })(),
        },
        owner: {
            name: raw.ownerName || raw.owner?.name || '',
            address: raw.ownerAddress || raw.owner?.address || '',
            city: raw.ownerCity || raw.owner?.city || '',
            country: raw.ownerCountry || raw.owner?.country || '',
            taxId: raw.ownerTaxId || raw.owner?.taxId || '',
            referenceIdType: raw.ownerReferenceIdType || raw.owner?.referenceIdType || 'Foreign Tax ID',
            businessCountries: raw.ownerBusinessCountries || raw.owner?.businessCountries || '',
            taxResidenceCountries: raw.ownerTaxResidenceCountries || raw.owner?.taxResidenceCountries || '',
            ownershipType: raw.ownershipType || raw.owner?.ownershipType || 'Direct',
        },
        relatedParty: {
            name: raw.relatedPartyName || raw.relatedParty?.name || raw.ownerName || '',
            address: raw.relatedPartyAddress || raw.relatedParty?.address || raw.ownerAddress || '',
            city: raw.relatedPartyCity || raw.relatedParty?.city || raw.ownerCity || '',
            country: raw.relatedPartyCountry || raw.relatedParty?.country || raw.ownerCountry || '',
            taxId: raw.relatedPartyTaxId || raw.relatedParty?.taxId || raw.ownerTaxId || '',
            referenceIdType: raw.relatedPartyReferenceIdType || raw.relatedParty?.referenceIdType || raw.ownerReferenceIdType || 'Foreign Tax ID',
            businessCountries: raw.relatedPartyBusinessCountries || raw.relatedParty?.businessCountries || raw.ownerBusinessCountries || '',
            taxResidenceCountries: raw.relatedPartyTaxResidenceCountries || raw.relatedParty?.taxResidenceCountries || raw.ownerTaxResidenceCountries || '',
            relationship: raw.relatedPartyRelationship || raw.relatedParty?.relationship || '25% Foreign Shareholder',
            ownershipType: raw.relatedPartyOwnershipType || raw.relatedParty?.ownershipType || raw.ownershipType || 'Direct',
            isUSPerson: raw.isRelatedPartyUSPerson ?? raw.relatedParty?.isUSPerson ?? false,
        },
        financials: {
            capitalContributionCash: Number(raw.capitalContributionCash ?? raw.financials?.capitalContributionCash ?? 0),
            capitalContributionProperty: Number(raw.capitalContributionProperty ?? raw.financials?.capitalContributionProperty ?? 0),
            capitalDistributionCash: Number(raw.capitalDistributionCash ?? raw.financials?.capitalDistributionCash ?? 0),
            capitalDistributionProperty: Number(raw.capitalDistributionProperty ?? raw.financials?.capitalDistributionProperty ?? 0),
            formationCost: Number(raw.formationCost ?? raw.financials?.formationCost ?? 0),
            transactions: raw.transactions || raw.financials?.transactions || [],
        },
        additionalInfo: {
            hasTradeOrBusiness: raw.hasTradeOrBusiness ?? raw.additionalInfo?.hasTradeOrBusiness ?? false,
            isDisregardedEntity: raw.isDisregardedEntity ?? raw.additionalInfo?.isDisregardedEntity ?? true,
        },
        additionalQuestions: {
            importGoods: raw.paidInterestToRelatedParty ?? raw.additionalQuestions?.importGoods ?? false,
            documentWarehouse: raw.paidRentsToRelatedParty ?? raw.additionalQuestions?.documentWarehouse ?? false,
            foreignParentCSA: raw.hasCostSharingArrangements ?? raw.additionalQuestions?.foreignParentCSA ?? false,
            interestRoyaltyDeduction: raw.paidRoyaltiesToRelatedParty ?? raw.additionalQuestions?.interestRoyaltyDeduction ?? false,
            fdiiDeduction: raw.paidServicesToRelatedParty ?? raw.additionalQuestions?.fdiiDeduction ?? false,
            safeHavenInterest: raw.receivedServicesFromRelatedParty ?? raw.additionalQuestions?.safeHavenInterest ?? false,
            safeHavenOutsideRange: raw.safeHavenOutsideRange ?? raw.additionalQuestions?.safeHavenOutsideRange ?? false,
            coveredDebtInstrument: raw.hasOtherTransactions ?? raw.additionalQuestions?.coveredDebtInstrument ?? false,
        },
        baseErosion: {
            csaParticipant: raw.isBaseErosionTaxpayer ?? raw.baseErosion?.csaParticipant ?? false,
            csaBefore2009: raw.csaBefore2009 ?? raw.baseErosion?.csaBefore2009 ?? false,
            stockBasedCompensation: raw.stockBasedCompensation ?? raw.baseErosion?.stockBasedCompensation ?? false,
        },
        signature: {
            signerName: raw.signerName || raw.signature?.signerName || raw.ownerName || '',
            signerTitle: raw.signerTitle || raw.signature?.signerTitle || 'Member',
            signatureDate: raw.signatureDate || raw.signature?.signatureDate || new Date().toISOString().split('T')[0],
            signatureDataUrl: raw.signatureDataUrl || raw.signature?.signatureDataUrl || null,
        }
    }
}

/**
 * POST /api/admin/pedidos/[id]/enviar-borrador
 *
 * Genera el PDF del borrador fiscal y lo envía por email al cliente.
 * Opcionalmente acepta { notasAdmin: string } en el body.
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: pedidoId } = await params
        const supabaseAdmin = createAdminClient()

        // Parsear body opcional (notas admin)
        let notasAdmin: string | undefined
        try {
            const body = await req.json()
            notasAdmin = body?.notasAdmin || undefined
        } catch {
            // body vacío es OK
        }

        // 1. Obtener el pedido con tax_data y datos del cliente
        const { data, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single()

        const pedido = data as any

        if (pedidoError || !pedido) {
            console.error('❌ Error obteniendo pedido:', pedidoError)
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        if (!pedido.tax_data) {
            return NextResponse.json({
                error: 'No se encontraron datos fiscales en este pedido.'
            }, { status: 400 })
        }

        // 2. Transformar datos y validar mínimos
        const taxData = transformToTaxFormData(pedido.tax_data)

        if (!taxData.llc.name || !taxData.llc.ein) {
            return NextResponse.json({
                error: `Datos fiscales incompletos. Nombre LLC: "${taxData.llc.name}", EIN: "${taxData.llc.ein}".`
            }, { status: 400 })
        }

        // 3. Generar PDF en memoria
        console.log('📄 Generando PDF borrador para envío por email...')
        const pdfBytes = await TaxFormService.generate5472Package(taxData)
        console.log('✅ PDF generado:', pdfBytes.length, 'bytes')

        // 4. Obtener email del cliente vía Clerk
        let clienteEmail: string = ''
        let clienteNombre: string = pedido.tax_data?.ownerName || pedido.tax_data?.llcName || 'Cliente'
        const clienteClerkId: string = pedido.user_id || pedido.clerk_user_id || ''

        if (clienteClerkId) {
            try {
                const clerk = await clerkClient()
                const clerkUser = await clerk.users.getUser(clienteClerkId)
                clienteEmail = clerkUser.emailAddresses?.[0]?.emailAddress || ''
                const firstName = clerkUser.firstName || ''
                const lastName = clerkUser.lastName || ''
                if (firstName || lastName) {
                    clienteNombre = `${firstName} ${lastName}`.trim()
                }
            } catch (clerkError) {
                console.warn('⚠️ No se pudo obtener usuario de Clerk:', clerkError)
            }
        }

        // Fallback: intentar obtener email desde metadata del pedido
        if (!clienteEmail) {
            clienteEmail = pedido.metadata?.cliente_email
                || pedido.customer_email
                || pedido.email
                || ''
        }

        if (!clienteEmail) {
            return NextResponse.json({
                error: 'No se encontró el email del cliente. Verifica que el pedido tiene un usuario vinculado.'
            }, { status: 400 })
        }

        console.log(`📧 Enviando borrador a: ${clienteEmail}`)

        // 5. Enviar email con PDF adjunto
        const numeroPedido = String(pedido.numero_pedido || pedido.id || pedidoId).substring(0, 8).toUpperCase()
        const emailResult = await EmailService.enviarBorradorFiscal({
            to: clienteEmail,
            nombreUsuario: clienteNombre,
            pedidoId,
            numeroPedido,
            taxYear: taxData.taxYear,
            llcName: taxData.llc.name,
            pdfBytes,
            notasAdmin,
        })

        if (!emailResult.success) {
            return NextResponse.json({
                error: 'El PDF fue generado pero hubo un error al enviar el email. Verifica la configuración de Resend.'
            }, { status: 500 })
        }

        // 6. Registrar el envío en metadata del pedido
        const currentMetadata = pedido.metadata || {}
        await (supabaseAdmin.from('pedidos') as any).update({
            metadata: {
                ...currentMetadata,
                borrador_enviado_at: new Date().toISOString(),
                borrador_enviado_a: clienteEmail,
                borrador_notas: notasAdmin || null,
            }
        }).eq('id', pedidoId)

        console.log('✅ Borrador enviado y registrado en metadata.')

        return NextResponse.json({
            success: true,
            message: `Borrador enviado correctamente a ${clienteEmail}`,
            emailId: (emailResult.data as any)?.id,
        })

    } catch (error: any) {
        console.error('❌ Error enviando borrador fiscal:', error)
        return NextResponse.json({
            error: error.message || 'Error interno del servidor'
        }, { status: 500 })
    }
}
