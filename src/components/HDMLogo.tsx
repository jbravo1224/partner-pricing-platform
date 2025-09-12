import React from 'react'
import Image from 'next/image'

interface HDMLogoProps {
  size?: 'small' | 'medium' | 'large'
  showTagline?: boolean
  className?: string
}

const HDMLogo: React.FC<HDMLogoProps> = ({ 
  size = 'medium', 
  showTagline = true, 
  className = '' 
}) => {
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

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* HDM Logo Image */}
      <div className={`relative ${currentSize.logo} aspect-[4/1] flex-shrink-0`}>
        <Image
          src="/images/hdm-logo.png"
          alt="HDM Helbling Digital Media Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}

export default HDMLogo
