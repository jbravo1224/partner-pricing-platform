import { NextRequest, NextResponse } from 'next/server'

export async function validateAdminAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  // Simple token validation - just check if it starts with 'admin-authenticated'
  const isValid = token.startsWith('admin-authenticated')
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  return null // No error, continue
}
