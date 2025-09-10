import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSession } from './auth'

export async function validateAdminAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const isValid = await validateAdminSession(token)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  return null // No error, continue
}
