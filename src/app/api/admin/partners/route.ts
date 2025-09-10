import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const partners = await prisma.partner.findMany({
      include: {
        versions: {
          orderBy: { version: 'desc' }
        },
        _count: {
          select: { quotes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const data = await request.json()
    
    const partner = await prisma.partner.create({
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

    // Create initial draft version
    await prisma.partnerVersion.create({
      data: {
        partnerId: partner.id,
        version: 1,
        isDraft: true,
        isPublished: false,
        branding: partner.branding as any,
        emailCfg: partner.emailCfg as any,
        formCfg: partner.formCfg as any,
        pricingCfg: partner.pricingCfg as any,
        features: partner.features as any
      }
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
