import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Always return valid for now to test
    return NextResponse.json({ valid: true, message: 'Validation endpoint working' })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
