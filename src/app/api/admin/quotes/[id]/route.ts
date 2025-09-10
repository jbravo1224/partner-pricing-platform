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
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        partner: {
          select: {
            name: true,
            slug: true,
            branding: true
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error fetching quote:', error)
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
    
    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: data.status
      }
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
