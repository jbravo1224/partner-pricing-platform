import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'
import { createEmailProvider } from '@/lib/email-providers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        partner: {
          select: {
            name: true,
            slug: true,
            branding: true
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Get the latest published version of the partner
    const partnerVersion = await prisma.partnerVersion.findFirst({
      where: {
        partnerId: quote.partnerId,
        isPublished: true
      },
      orderBy: { publishedAt: 'desc' }
    })

    if (!partnerVersion) {
      return NextResponse.json({ error: 'Partner version not found' }, { status: 404 })
    }

    // Recalculate pricing with current rules
    const { calculatePricing } = await import('@/lib/pricing-engine')
    const pricingResult = calculatePricing(partnerVersion.pricingCfg, quote.inputs)

    // Update quote with new pricing
    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        subtotal: pricingResult.subtotal,
        total: pricingResult.total,
        lineItems: pricingResult.lineItems
      }
    })

    // Send email
    const emailProvider = createEmailProvider()
    const emailCfg = partnerVersion.emailCfg

    const to = emailCfg.to || []
    const cc: string[] = []

    if (emailCfg.ccDefaultSubmitter && quote.inputs.email) {
      cc.push(quote.inputs.email)
    }

    if (emailCfg.allowAdditionalCc && quote.additionalCc) {
      cc.push(quote.additionalCc)
    }

    const html = generateQuoteEmailHTML(quote.partner, pricingResult, quote.inputs, quote.id)

    await emailProvider.sendEmail(to, `Updated Quote - ${quote.partner.name}`, html, cc)

    return NextResponse.json({
      success: true,
      quote: updatedQuote,
      pricingResult
    })
  } catch (error) {
    console.error('Error resending quote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateQuoteEmailHTML(partner: any, pricingResult: any, inputs: any, quoteId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Updated Quote</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .line-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; }
        .input-section { background: #f8f9fa; padding: 15px; border-radius: 8px; }
        .input-item { margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Updated Quote - ${partner.name}</h1>
          <p>Quote ID: ${quoteId}</p>
          <p>Updated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <h2>Project Details</h2>
          <div class="input-section">
            ${Object.entries(inputs).map(([key, value]) => `
              <div class="input-item">
                <span class="label">${key}:</span> 
                <span>${Array.isArray(value) ? value.join(', ') : String(value)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <h2>Updated Pricing Breakdown</h2>
          ${pricingResult.lineItems.map((item: any) => `
            <div class="line-item">
              <span>${item.description}</span>
              <span>${pricingResult.currency} ${item.amount.toLocaleString()}</span>
            </div>
          `).join('')}
          <div class="line-item total">
            <span>Total</span>
            <span>${pricingResult.currency} ${pricingResult.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
