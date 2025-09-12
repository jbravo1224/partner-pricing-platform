import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    await prisma.$connect()
    
    // Test if we can query the quotes table
    const quoteCount = await prisma.quote.count()
    
    // Test if we can query the partners table
    const partnerCount = await prisma.partner.count()
    
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      connected: true,
      quoteCount,
      partnerCount,
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Connection test error:', error)
    
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      // Ignore disconnect errors
    }

    return NextResponse.json({
      success: false,
      connected: false,
      quoteCount: 0,
      partnerCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 })
  }
}
