import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const authError = await validateAdminAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const partner = searchParams.get('partner')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const projectType = searchParams.get('projectType')
    const email = searchParams.get('email')

    const where: any = {}

    if (partner) {
      where.partnerSlug = partner
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    if (projectType) {
      where.inputs = {
        path: ['projectType'],
        equals: projectType
      }
    }

    if (email) {
      where.inputs = {
        path: ['email'],
        string_contains: email
      }
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        partner: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
