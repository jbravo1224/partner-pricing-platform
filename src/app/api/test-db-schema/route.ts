import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test if we can query quotes with the new schema
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        partnerId: true,
        partnerSlug: true,
        userId: true,
        submitterEmail: true,
        submitterName: true,
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
      take: 1
    })

    return NextResponse.json({
      success: true,
      schemaCompatible: true,
      quoteCount: quotes.length,
      sampleQuote: quotes[0] || null,
      message: 'Database schema is compatible'
    })
  } catch (error) {
    console.error('Schema test error:', error)
    
    // If it's a schema error, try a simpler query
    try {
      const simpleQuotes = await prisma.quote.findMany({
        select: {
          id: true,
          partnerId: true,
          partnerSlug: true,
          total: true,
          status: true,
          createdAt: true
        },
        take: 1
      })

      return NextResponse.json({
        success: true,
        schemaCompatible: false,
        quoteCount: simpleQuotes.length,
        sampleQuote: simpleQuotes[0] || null,
        message: 'Database has quotes but schema may need migration',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } catch (simpleError) {
      return NextResponse.json({
        success: false,
        schemaCompatible: false,
        quoteCount: 0,
        sampleQuote: null,
        message: 'Database connection or schema error',
        error: error instanceof Error ? error.message : 'Unknown error',
        simpleError: simpleError instanceof Error ? simpleError.message : 'Unknown simple error'
      }, { status: 500 })
    }
  }
}
