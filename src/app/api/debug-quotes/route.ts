import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const quoteCount = await prisma.quote.count()
    
    // Get all quotes with basic info
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        partnerSlug: true,
        total: true,
        status: true,
        createdAt: true,
        partner: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      quoteCount,
      quotes,
      message: `Found ${quoteCount} quotes in database`
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      quoteCount: 0,
      quotes: []
    }, { status: 500 })
  }
}
