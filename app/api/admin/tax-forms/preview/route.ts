
import { NextResponse } from 'next/server'
import { TaxFormService } from '@/lib/services/tax-form.service'

export async function GET() {
    try {
        const sampleData = {
            taxYear: '2024',
            llc: {
                name: 'Ejemplo LLC',
                ein: '12-3456789',
                address: '123 Main St',
                city: 'Sheridan',
                state: 'WY',
                zip: '82801',
                formationDate: '01/15/2024',
                activityDescription: 'E-Commerce Retail',
                activityCode: '454110'
            },
            owner: {
                name: 'Juan Pérez',
                address: 'Calle Falsa 123',
                city: 'Madrid',
                country: 'Spain',
                taxId: '12345678Z', // DNI
                referenceIdType: 'Foreign Tax ID' as const
            },
            financials: {
                capitalContributionCash: 1000.00,
                capitalContributionProperty: 0.00,
                capitalDistributionCash: 500.00,
                capitalDistributionProperty: 0.00,
                formationCost: 250.00
            }
        }

        const pdfBytes = await TaxFormService.generate5472Package(sampleData)
        const buffer = Buffer.from(pdfBytes)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="Form5472_Draft.pdf"',
            },
        })

    } catch (error) {
        console.error('Error generando preview fiscal:', error)
        return NextResponse.json({ error: 'Error generando preview fiscal' }, { status: 500 })
    }
}
