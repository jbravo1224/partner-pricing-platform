import { NextResponse } from 'next/server'

export async function GET() {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  return NextResponse.json({
    adminPasswordSet: !!adminPassword,
    adminPasswordValue: adminPassword ? '***SET***' : 'NOT SET',
    adminPasswordLength: adminPassword ? adminPassword.length : 0,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('ADMIN')),
    message: 'Debug info for admin login'
  })
}
