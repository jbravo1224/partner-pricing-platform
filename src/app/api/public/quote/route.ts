import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculatePricing } from '@/lib/pricing-engine'
import { createEmailProvider } from '@/lib/email-providers'

export async function POST(request: NextRequest) {
  try {
    const { partnerSlug, inputs, additionalCc } = await request.json()

    if (!partnerSlug || !inputs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get partner with published version
    const partner = await prisma.partner.findUnique({
      where: { slug: partnerSlug },
      include: {
        versions: {
          where: { isPublished: true },
          orderBy: { publishedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const publishedVersion = partner.versions[0]
    if (!publishedVersion) {
      return NextResponse.json({ error: 'Partner not published' }, { status: 404 })
    }

    // Calculate pricing
    const pricingResult = calculatePricing(publishedVersion.pricingCfg as any, inputs)

    // Save quote to database
    const quote = await prisma.quote.create({
      data: {
        partnerId: partner.id,
        partnerSlug: partner.slug,
        inputs,
        additionalCc,
        subtotal: pricingResult.subtotal,
        total: pricingResult.total,
        currency: pricingResult.currency,
        lineItems: pricingResult.lineItems as any
      }
    })

    // Send email
    try {
      await sendQuoteEmail(partner, publishedVersion, quote, pricingResult, inputs, additionalCc)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      id: quote.id,
      subtotal: pricingResult.subtotal,
      total: pricingResult.total,
      currency: pricingResult.currency,
      lineItems: pricingResult.lineItems
    })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendQuoteEmail(
  partner: any,
  version: any,
  quote: any,
  pricingResult: any,
  inputs: any,
  additionalCc?: string
) {
  const emailProvider = createEmailProvider()
  const emailCfg = version.emailCfg

  // Build recipient list
  const to = emailCfg.to || []
  const cc: string[] = []

  // Add submitter to CC if configured
  if (emailCfg.ccDefaultSubmitter && inputs.email) {
    cc.push(inputs.email)
  }

  // Add additional CC if allowed and provided
  if (emailCfg.allowAdditionalCc && additionalCc) {
    cc.push(additionalCc)
  }

  // Generate HTML email
  const html = generateQuoteEmailHTML(partner, pricingResult, inputs, quote.id)

  // Send email
  await emailProvider.sendEmail(to, `New Quote Request - ${partner.name}`, html, cc)
}

function generateQuoteEmailHTML(partner: any, pricingResult: any, inputs: any, quoteId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Quote Request</title>
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
          <h1>New Quote Request - ${partner.name}</h1>
          <p>Quote ID: ${quoteId}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
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
          <h2>Pricing Breakdown</h2>
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
