'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface HDMLogoProps {
  size?: 'small' | 'medium' | 'large'
  showTagline?: boolean
  className?: string
}

interface LogoSettings {
  logoUrl?: string
  showTagline?: boolean
  primaryColor?: string
  secondaryColor?: string
}

const HDMLogo: React.FC<HDMLogoProps> = ({ 
  size = 'medium', 
  showTagline = true, 
  className = '' 
}) => {
  const [settings, setSettings] = useState<LogoSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          logoUrl: data.logoUrl,
          showTagline: data.showTagline !== false,
          primaryColor: data.primaryColor || '#0e2c3d',
          secondaryColor: data.secondaryColor || '#5895a5'
        })
      }
    } catch (error) {
      console.error('Error loading logo settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    small: {
      container: 'gap-2',
      logo: 'h-6',
      main: 'text-lg',
      subtitle: 'text-xs',
      tagline: 'text-xs'
    },
    medium: {
      container: 'gap-3',
      logo: 'h-8',
      main: 'text-2xl',
      subtitle: 'text-sm',
      tagline: 'text-xs'
    },
    large: {
      container: 'gap-4',
      logo: 'h-12',
      main: 'text-4xl',
      subtitle: 'text-lg',
      tagline: 'text-sm'
    }
  }

  const currentSize = sizeClasses[size]

  if (loading) {
    return (
      <div className={`flex items-center ${currentSize.container} ${className}`}>
        <div className={`${currentSize.logo} bg-gray-200 rounded animate-pulse`}></div>
      </div>
    )
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {settings.logoUrl ? (
        <div className={`relative ${currentSize.logo} aspect-[4/1] flex-shrink-0`}>
          <Image
            src={settings.logoUrl}
            alt="HDM Helbling Digital Media Logo"
            fill
            className="object-contain"
            priority
            onError={() => {
              // Fallback to text if image fails to load
              setSettings(prev => ({ ...prev, logoUrl: undefined }))
            }}
          />
        </div>
      ) : (
        <div className="text-center">
          <div className={`${currentSize.main} font-bold mb-1`} style={{color: settings.primaryColor}}>
            HDM
          </div>
          <div className={`${currentSize.subtitle} font-medium`} style={{color: settings.primaryColor}}>
            HELBLING DIGITAL MEDIA
          </div>
          {(showTagline && settings.showTagline) && (
            <div className={`${currentSize.tagline} font-semibold uppercase tracking-wider mt-1`} style={{color: settings.primaryColor}}>
              INNOVATE. SCALE. GROW.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HDMLogo
