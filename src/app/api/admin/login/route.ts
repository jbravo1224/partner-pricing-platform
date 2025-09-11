import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Simple password check - no complex dependencies
    const isValid = password === 'admin123'
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Return success with a simple token
    return NextResponse.json({ 
      success: true, 
      token: 'admin-authenticated-' + Date.now()
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
