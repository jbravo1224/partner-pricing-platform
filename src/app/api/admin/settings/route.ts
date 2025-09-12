import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all global settings
    const settings = await prisma.globalSettings.findMany()
    
    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, any>)

    // Provide default values if no settings exist
    const defaultSettings = {
      logoUrl: '',
      showTagline: true,
      primaryColor: '#0e2c3d',
      secondaryColor: '#5895a5',
      headerBackground: 'white'
    }

    const mergedSettings = { ...defaultSettings, ...settingsObj }

    return NextResponse.json(mergedSettings)
  } catch (error) {
    console.error('Error fetching global settings:', error)
    
    // Return default settings if database fails
    const defaultSettings = {
      logoUrl: '',
      showTagline: true,
      primaryColor: '#0e2c3d',
      secondaryColor: '#5895a5',
      headerBackground: 'white'
    }
    
    return NextResponse.json(defaultSettings)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    // Upsert the setting
    const setting = await prisma.globalSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error saving global setting:', error)
    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}
