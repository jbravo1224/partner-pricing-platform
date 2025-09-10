import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'

export async function POST(
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

    // Find the previous published version
    const publishedVersions = partner.versions.filter(v => v.isPublished)
    if (publishedVersions.length < 2) {
      return NextResponse.json({ error: 'No previous version to rollback to' }, { status: 400 })
    }

    const currentVersion = publishedVersions[0]
    const previousVersion = publishedVersions[1]

    // Unpublish current version
    await prisma.partnerVersion.update({
      where: { id: currentVersion.id },
      data: {
        isPublished: false
      }
    })

    // Publish previous version
    const rolledBackVersion = await prisma.partnerVersion.update({
      where: { id: previousVersion.id },
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    })

    return NextResponse.json(rolledBackVersion)
  } catch (error) {
    console.error('Error rolling back partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
