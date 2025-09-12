'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface PartnerConfig {
  id: string
  slug: string
  name: string
  branding: {
    logoUrl?: string
    colors?: {
      primary?: string
      secondary?: string
    }
  }
  emailCfg: {
    to: string[]
    ccDefaultSubmitter?: boolean
    allowAdditionalCc?: boolean
  }
  formCfg: any
  pricingCfg: any
  features: any
}

export default function PartnerCalculatorPage() {
  const params = useParams()
  const partnerSlug = params.partnerSlug as string
  
  const [partner, setPartner] = useState<PartnerConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await fetch(`/api/public/partner/${partnerSlug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Partner not found')
          } else {
            setError('Failed to load partner configuration')
          }
          return
        }
        
        const partnerData = await response.json()
        setPartner(partnerData)
      } catch (err) {
        console.error('Error fetching partner:', err)
        setError('Failed to load partner configuration')
      } finally {
        setLoading(false)
      }
    }

    if (partnerSlug) {
      fetchPartner()
    }
  }, [partnerSlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calculator...</p>
        </div>
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Calculator Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The requested calculator could not be found.'}
          </p>
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Partner Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {partner.branding.logoUrl && (
                <img 
                  src={partner.branding.logoUrl} 
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto"
                />
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {partner.name} - Project Calculator
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by HDM Cincinnati
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Project Quote
            </h2>
            <p className="text-gray-600">
              Fill out the form below to receive a detailed quote for your project.
            </p>
          </div>

          {/* Partner-specific calculator will be embedded here */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
              Partner-specific calculator configuration will be loaded here.
            </p>
            <p className="text-sm text-gray-500">
              Partner: {partner.name} | Slug: {partner.slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
