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

    // Get the latest version
    const latestVersion = partner.versions[0]
    if (!latestVersion) {
      return NextResponse.json({ error: 'No versions found' }, { status: 400 })
    }

    // Unpublish all other versions
    await prisma.partnerVersion.updateMany({
      where: {
        partnerId: params.id,
        isPublished: true
      },
      data: {
        isPublished: false
      }
    })

    // Publish the latest version
    const publishedVersion = await prisma.partnerVersion.update({
      where: { id: latestVersion.id },
      data: {
        isDraft: false,
        isPublished: true,
        publishedAt: new Date()
      }
    })

    return NextResponse.json(publishedVersion)
  } catch (error) {
    console.error('Error publishing partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
