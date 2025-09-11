import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    return NextResponse.json({ 
      message: 'Debug endpoint working',
      token: token || 'no token',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}