import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PDFGenerator, SS4Data } from '@/lib/utils/pdfGenerator'

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        // 1. Obtener pedido con metadatos completos
        const { data: pedido, error } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        const metadata = pedido.metadata || {}

        // 2. Construir dirección combinada
        const city = metadata.ss4_city || metadata.member_ciudad || ''
        const state = metadata.ss4_state || metadata.member_estado || ''
        const zip = metadata.ss4_zip || metadata.member_codigo_postal || ''
        const cityStateZip = `${city}, ${state} ${zip}`.trim().replace(/^,/, '').trim()

        // 3. Obtener firma digital si existe
        let firmaBase64 = metadata.firma_digital
        if (!firmaBase64 && metadata.firma_digital_url) {
            // TODO: Descargar de URL si es necesario
        }

        // 4. Mapear datos a SS4Data
        // SEGUIR REGLAS USUARIO: L9=Disregarded, L10=Started New, L12=December
        const ss4Data: SS4Data = {
            legalName: metadata.ss4_legal_name,
            tradeName: metadata.ss4_trade_name || '',
            executorName: metadata.member_nombre_completo || '',

            // Dirección
            mailingAddress: metadata.ss4_address || metadata.member_direccion || '',
            cityStateZip: cityStateZip,
            // L5a/b solo si es diferente (asumimos vacía si es la misma)
            streetAddress: '',
            cityStateZipForeign: '',

            county: metadata.ss4_county || `U.S.A. and ${metadata.estado_formacion || metadata.ss4_state || ''}`,
            responsiblePartyName: metadata.member_nombre_completo || '',
            responsiblePartySSN: metadata.member_tax_id_valor || '',

            isLLC: true,
            llcMemberCount: metadata.ss4_member_count || '1',
            llcOrganizedInUS: true,

            // L9a: Forzado en generador, aquí pasamos datos referenciales
            entityType: 'LLC',
            stateOfFormation: '', // L9b Eliminado por regla usuario

            // L10: Reason
            reasonForApplying: 'Started new business',
            // Campo nuevo de dashboard o default
            reasonSpecifyType: metadata.ss4_reason_specify || 'E-COMMERCE SERVICES',

            // L11: Fecha Inicio
            startDate: metadata.ss4_start_date || metadata.ss4_fecha_inicio || new Date().toLocaleDateString('en-US'),

            // L12: Closing Month (Forzado en generador a DECEMBER)
            closingMonth: 'DECEMBER',

            employeesAgricultural: '0',
            employeesHousehold: '0',
            employeesOther: '0',

            firstDateWages: 'N/A',

            principalActivity: metadata.ss4_principal_activity || 'E-COMMERCE SERVICES',
            principalProduct: metadata.ss4_principal_product || 'DIGITAL GOODS AND SERVICES',

            hasPreviousEIN: false,

            // Designee: ZARA DESIGNS LLC (Regla Usuario)
            designeeName: 'ZARA DESIGNS LLC',
            designeePhone: '307-555-0123',
            designeeAddress: '30 N Gould St Ste R, Sheridan, WY 82801',
            designeeFax: '', // Si tenéis fax fijo, ponedlo aquí

            applicantNameAndTitle: metadata.member_nombre_completo || '',
            applicantPhone: metadata.member_telefono || ''
        }

        const pdfBytes = await PDFGenerator.generarSS4(ss4Data, firmaBase64)

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="SS4_${pedido.numero_pedido}.pdf"`,
            },
        })

    } catch (error) {
        console.error('Error generando PDF:', error)
        return NextResponse.json({ error: 'Error interno generando PDF' }, { status: 500 })
    }
}
