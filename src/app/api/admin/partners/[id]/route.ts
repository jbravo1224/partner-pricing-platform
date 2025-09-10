import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const data = await request.json()
    
    const partner = await prisma.partner.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        name: data.name,
        branding: data.branding,
        emailCfg: data.emailCfg,
        formCfg: data.formCfg,
        pricingCfg: data.pricingCfg,
        features: data.features
      }
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    await prisma.partner.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
