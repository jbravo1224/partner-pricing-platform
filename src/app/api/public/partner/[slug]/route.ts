import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Find the partner by slug
    const partner = await prisma.partner.findUnique({
      where: { slug },
      include: {
        versions: {
          where: { isPublished: true },
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Get the latest published version
    const publishedVersion = partner.versions[0]
    if (!publishedVersion) {
      return NextResponse.json({ error: 'No published version found' }, { status: 404 })
    }

    // Return partner data with published configuration
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
