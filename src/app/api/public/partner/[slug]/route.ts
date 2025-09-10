import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { slug: params.slug },
      include: {
        versions: {
          where: { isPublished: true },
          orderBy: { publishedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const publishedVersion = partner.versions[0]
    if (!publishedVersion) {
      return NextResponse.json({ error: 'Partner not published' }, { status: 404 })
    }

    // Return partner with published version data
    return NextResponse.json({
      id: partner.id,
      slug: partner.slug,
      name: partner.name,
      branding: publishedVersion.branding,
      emailCfg: publishedVersion.emailCfg,
      formCfg: publishedVersion.formCfg,
      pricingCfg: publishedVersion.pricingCfg,
      features: publishedVersion.features
    })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
