import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminToken, createAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }

    // Temporary: Use plain text comparison for debugging
    const isValid = password === adminPassword
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = createAdminToken()
    await createAdminSession(token)

    return NextResponse.json({ 
      success: true, 
      token 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
