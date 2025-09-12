import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing settings API...')
    
    // Test database connection
    const settings = await prisma.globalSettings.findMany()
    console.log('Found settings:', settings)
    
    return NextResponse.json({
      success: true,
      settings,
      count: settings.length
    })
  } catch (error) {
    console.error('Error in test-settings:', error)
    return NextResponse.json(
      { 
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
