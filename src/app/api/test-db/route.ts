import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const partnerCount = await prisma.partner.count()
    const quoteCount = await prisma.quote.count()
    
    // Get first few partners
    const partners = await prisma.partner.findMany({
      take: 3,
      select: {
        id: true,
        slug: true,
        name: true
      }
    })
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      partnerCount,
      quoteCount,
      samplePartners: partners
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      database: 'disconnected'
    }, { status: 500 })
  }
}
