import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordValue: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  })
}
