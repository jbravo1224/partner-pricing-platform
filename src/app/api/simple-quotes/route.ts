import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Simple query to get all quotes without complex relations
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        partnerSlug: true,
        total: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      count: quotes.length,
      quotes: quotes
    })
  } catch (error) {
    console.error('Simple quotes error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
      quotes: []
    }, { status: 500 })
  }
}
