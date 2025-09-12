'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PartnerFormData {
  name: string
  slug: string
  branding: {
    logoUrl: string
    primaryColor: string
    secondaryColor: string
    companyName: string
    tagline: string
  }
  emailCfg: {
    fromEmail: string
    fromName: string
    subject: string
    template: string
  }
  formCfg: {
    showContactInfo: boolean
    requireContactInfo: boolean
    customFields: any[]
  }
  pricingCfg: {
    basePrice: number
    currency: string
    showBreakdown: boolean
    customPricing: any
  }
  features: {
    enabledFeatures: string[]
    customFeatures: any[]
  }
  calculatorCfg: {
    // Project Overview
    showProjectOverview: boolean
    requireProjectName: boolean
    requireProjectType: boolean
    requirePackageSize: boolean
    requireDescription: boolean
    requireContactInfo: boolean
    requireTimeline: boolean
    
    // Website Foundation
    showWebsiteFoundation: boolean
    requirePages: boolean
    requirePageComplexity: boolean
    requireTemplates: boolean
    requirePlatform: boolean
    showCustomApp: boolean
    
    // E-commerce
    showEcommerce: boolean
    requireEcommerceType: boolean
    requireProductCount: boolean
    requireCategories: boolean
    requirePaymentMethods: boolean
    requireInventory: boolean
    
    // Interactive Features
    showInteractiveFeatures: boolean
    requireDesign: boolean
    requireForms: boolean
    requireAdvancedForms: boolean
    requireCalculators: boolean
    requireConfigurators: boolean
    requireIntegrations: boolean
    
    // Additional Services
    showAdditionalServices: boolean
    requireAccessibility: boolean
    requirePerformanceOptimization: boolean
    requireDesignAndBranding: boolean
    requireContentAndMarketing: boolean
    requireCrmIntegration: boolean
    requireEmailMarketing: boolean
    requireAdvancedTracking: boolean
    requireCustomFeatures: boolean
    
    // Pricing Configuration
    pricing: {
      // Base pricing
      basePrice: number
      pagePrice: number
      templatePrice: number
      formPrice: number
      advancedFormPrice: number
      calculatorPrice: number
      configuratorPrice: number
      
      // E-commerce pricing
      ecommerceBasePrice: number
      productPrice: number
      categoryPrice: number
      paymentMethodPrice: number
      
      // Platform pricing
      wordpressPrice: number
      shopifyPrice: number
      bigcommercePrice: number
      customPrice: number
      
      // Design pricing
      basicDesignPrice: number
      standardDesignPrice: number
      customDesignPrice: number
      
      // Additional services pricing
      accessibilityBasicPrice: number
      accessibilityStandardPrice: number
      accessibilityFullPrice: number
      performanceOptimizationPrice: number
      crmIntegrationPrice: number
      emailMarketingPrice: number
      advancedTrackingPrice: number
      
      // Rush pricing multiplier
      rushMultiplier: number
    }
  }
}

export default function NewPartnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    slug: '',
    branding: {
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      companyName: '',
      tagline: ''
    },
    emailCfg: {
      fromEmail: '',
      fromName: '',
      subject: 'Your Website Quote',
      template: ''
    },
    formCfg: {
      showContactInfo: true,
      requireContactInfo: true,
      customFields: []
    },
    pricingCfg: {
      basePrice: 0,
      currency: 'USD',
      showBreakdown: true,
      customPricing: {}
    },
    features: {
      enabledFeatures: [],
      customFeatures: []
    },
    calculatorCfg: {
      // Project Overview
      showProjectOverview: true,
      requireProjectName: true,
      requireProjectType: true,
      requirePackageSize: true,
      requireDescription: true,
      requireContactInfo: true,
      requireTimeline: true,
      
      // Website Foundation
      showWebsiteFoundation: true,
      requirePages: true,
      requirePageComplexity: true,
      requireTemplates: true,
      requirePlatform: true,
      showCustomApp: true,
      
      // E-commerce
      showEcommerce: true,
      requireEcommerceType: true,
      requireProductCount: true,
      requireCategories: true,
      requirePaymentMethods: true,
      requireInventory: true,
      
      // Interactive Features
      showInteractiveFeatures: true,
      requireDesign: true,
      requireForms: true,
      requireAdvancedForms: true,
      requireCalculators: true,
      requireConfigurators: true,
      requireIntegrations: true,
      
      // Additional Services
      showAdditionalServices: true,
      requireAccessibility: true,
      requirePerformanceOptimization: true,
      requireDesignAndBranding: true,
      requireContentAndMarketing: true,
      requireCrmIntegration: true,
      requireEmailMarketing: true,
      requireAdvancedTracking: true,
      requireCustomFeatures: true,
      
      // Pricing Configuration
      pricing: {
        // Base pricing
        basePrice: 0,
        pagePrice: 50,
        templatePrice: 200,
        formPrice: 100,
        advancedFormPrice: 300,
        calculatorPrice: 500,
        configuratorPrice: 750,
        
        // E-commerce pricing
        ecommerceBasePrice: 1000,
        productPrice: 5,
        categoryPrice: 25,
        paymentMethodPrice: 50,
        
        // Platform pricing
        wordpressPrice: 0,
        shopifyPrice: 500,
        bigcommercePrice: 500,
        customPrice: 2000,
        
        // Design pricing
        basicDesignPrice: 0,
        standardDesignPrice: 500,
        customDesignPrice: 1500,
        
        // Additional services pricing
        accessibilityBasicPrice: 200,
        accessibilityStandardPrice: 500,
        accessibilityFullPrice: 1000,
        performanceOptimizationPrice: 300,
        crmIntegrationPrice: 500,
        emailMarketingPrice: 200,
        advancedTrackingPrice: 300,
        
        // Rush pricing multiplier
        rushMultiplier: 1.5
      }
    }
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PartnerFormData] as any || {}),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    handleInputChange('name', name)
    if (!formData.slug) {
      handleInputChange('slug', generateSlug(name))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newPartner = await response.json()
        router.push('/admin')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create partner')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Partner</h1>
          <p className="mt-2 text-sm text-gray-700">
            Set up a new partner configuration and pricing calculator
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Back to Partners
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Partner Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be used in the URL: /p/{formData.slug}
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Branding & Visual Identity</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Branding Inputs */}
            <div className="space-y-6">
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logoUrl"
                  value={formData.branding.logoUrl}
                  onChange={(e) => handleInputChange('branding.logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload your logo to a hosting service and paste the URL here
                </p>
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.branding.companyName}
                  onChange={(e) => handleInputChange('branding.companyName', e.target.value)}
                  placeholder="Your Company Name"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
              </div>
              
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  value={formData.branding.tagline}
                  onChange={(e) => handleInputChange('branding.tagline', e.target.value)}
                  placeholder="Your company tagline or slogan"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handleInputChange('branding.primaryColor', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handleInputChange('branding.primaryColor', e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => handleInputChange('branding.secondaryColor', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => handleInputChange('branding.secondaryColor', e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Calculator Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  {/* Header Preview */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {formData.branding.logoUrl ? (
                        <img
                          src={formData.branding.logoUrl}
                          alt="Logo"
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-600">Logo</span>
                        </div>
                      )}
                      <div>
                        <h1 className="text-lg font-bold" style={{ color: formData.branding.primaryColor }}>
                          {formData.branding.companyName || 'Your Company'}
                        </h1>
                        {formData.branding.tagline && (
                          <p className="text-sm text-gray-600">{formData.branding.tagline}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Button */}
                  <button
                    className="px-4 py-2 rounded-md text-white text-sm font-medium"
                    style={{ backgroundColor: formData.branding.primaryColor }}
                  >
                    Sample Button
                  </button>
                  
                  {/* Color Swatches */}
                  <div className="mt-4 flex space-x-2">
                    <div className="text-xs">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: formData.branding.primaryColor }}
                      ></div>
                      <span className="text-gray-500">Primary</span>
                    </div>
                    <div className="text-xs">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: formData.branding.secondaryColor }}
                      ></div>
                      <span className="text-gray-500">Secondary</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>This preview shows how your branding will appear in the calculator header and interface.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Email Configuration</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                value={formData.emailCfg.fromEmail}
                onChange={(e) => handleInputChange('emailCfg.fromEmail', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                From Name
              </label>
              <input
                type="text"
                id="fromName"
                value={formData.emailCfg.fromName}
                onChange={(e) => handleInputChange('emailCfg.fromName', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.emailCfg.subject}
                onChange={(e) => handleInputChange('emailCfg.subject', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Form Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showContactInfo"
                checked={formData.formCfg.showContactInfo}
                onChange={(e) => handleInputChange('formCfg.showContactInfo', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showContactInfo" className="ml-2 block text-sm text-gray-900">
                Show contact information fields
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireContactInfo"
                checked={formData.formCfg.requireContactInfo}
                onChange={(e) => handleInputChange('formCfg.requireContactInfo', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireContactInfo" className="ml-2 block text-sm text-gray-900">
                Require contact information
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing Configuration</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                Base Price
              </label>
              <input
                type="number"
                id="basePrice"
                value={formData.pricingCfg.basePrice}
                onChange={(e) => handleInputChange('pricingCfg.basePrice', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                value={formData.pricingCfg.currency}
                onChange={(e) => handleInputChange('pricingCfg.currency', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showBreakdown"
                  checked={formData.pricingCfg.showBreakdown}
                  onChange={(e) => handleInputChange('pricingCfg.showBreakdown', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showBreakdown" className="ml-2 block text-sm text-gray-900">
                  Show pricing breakdown
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Partner'}
          </button>
        </div>
      </form>
    </div>
  )
}
