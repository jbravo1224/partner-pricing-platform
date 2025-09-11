import { NextResponse } from 'next/server'

export async function GET() {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  return NextResponse.json({
    hasAdminPassword: !!adminPassword,
    adminPasswordLength: adminPassword?.length || 0,
    adminPasswordStart: adminPassword?.substring(0, 10) || 'not set',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('ADMIN'))
  })
}
