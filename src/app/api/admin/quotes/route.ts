import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    console.log('Admin quotes API called')

    // Simple query to get all quotes without complex filters first
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        partnerId: true,
        partnerSlug: true,
        inputs: true,
        additionalCc: true,
        subtotal: true,
        total: true,
        currency: true,
        lineItems: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 quotes for performance
    })

    // Get partner information separately to avoid join issues
    const partnerIds = [...new Set(quotes.map(q => q.partnerId))]
    const partners = await prisma.partner.findMany({
      where: { id: { in: partnerIds } },
      select: { id: true, name: true, slug: true }
    })

    // Combine quotes with partner data
    const quotesWithPartners = quotes.map(quote => ({
      ...quote,
      partner: partners.find(p => p.id === quote.partnerId) || { name: 'Unknown', slug: 'unknown' }
    }))

    console.log(`Found ${quotesWithPartners.length} quotes`)
    return NextResponse.json(quotesWithPartners)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    
    // Return empty array instead of error to prevent UI crashes
    return NextResponse.json([])
  }
}
