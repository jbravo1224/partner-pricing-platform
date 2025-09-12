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

    console.log('Admin quotes API called with filters:', { partner, dateFrom, dateTo, projectType, email })

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

    console.log('Database query where clause:', where)

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

    console.log(`Found ${quotes.length} quotes`)
    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
