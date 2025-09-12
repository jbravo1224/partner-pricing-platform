'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PartnerFormData {
  name: string
  slug: string
  companyPassword: string
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
    companyPassword: '',
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Partner Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter partner company name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="partner-slug"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be used in the URL: /p/{formData.slug}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="companyPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Company Password (Optional)
              </label>
              <input
                type="password"
                id="companyPassword"
                value={formData.companyPassword}
                onChange={(e) => handleInputChange('companyPassword', e.target.value)}
                placeholder="Leave empty for open access, or set a password for company-only access"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
              <p className="mt-1 text-sm text-gray-500">
                If set, users will need this password to access the calculator. Leave empty for open access.
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
              <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                value={formData.emailCfg.fromEmail}
                onChange={(e) => handleInputChange('emailCfg.fromEmail', e.target.value)}
                placeholder="noreply@yourcompany.com"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div>
              <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                id="fromName"
                value={formData.emailCfg.fromName}
                onChange={(e) => handleInputChange('emailCfg.fromName', e.target.value)}
                placeholder="Your Company Name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.emailCfg.subject}
                onChange={(e) => handleInputChange('emailCfg.subject', e.target.value)}
                placeholder="Your Website Quote - [Project Name]"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
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

        {/* Calculator Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Calculator Configuration</h2>
          
          {/* Feature Toggles */}
          <div className="space-y-8">
            {/* Project Overview Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">1. Project Overview</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showProjectOverview"
                    checked={formData.calculatorCfg.showProjectOverview}
                    onChange={(e) => handleInputChange('calculatorCfg.showProjectOverview', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showProjectOverview" className="ml-2 block text-sm text-gray-900">
                    Show Project Overview
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireProjectName"
                    checked={formData.calculatorCfg.requireProjectName}
                    onChange={(e) => handleInputChange('calculatorCfg.requireProjectName', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireProjectName" className="ml-2 block text-sm text-gray-900">
                    Require Project Name
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireProjectType"
                    checked={formData.calculatorCfg.requireProjectType}
                    onChange={(e) => handleInputChange('calculatorCfg.requireProjectType', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireProjectType" className="ml-2 block text-sm text-gray-900">
                    Require Project Type
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePackageSize"
                    checked={formData.calculatorCfg.requirePackageSize}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePackageSize', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePackageSize" className="ml-2 block text-sm text-gray-900">
                    Require Package Size
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireDescription"
                    checked={formData.calculatorCfg.requireDescription}
                    onChange={(e) => handleInputChange('calculatorCfg.requireDescription', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireDescription" className="ml-2 block text-sm text-gray-900">
                    Require Description
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireContactInfo"
                    checked={formData.calculatorCfg.requireContactInfo}
                    onChange={(e) => handleInputChange('calculatorCfg.requireContactInfo', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireContactInfo" className="ml-2 block text-sm text-gray-900">
                    Require Contact Info
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireTimeline"
                    checked={formData.calculatorCfg.requireTimeline}
                    onChange={(e) => handleInputChange('calculatorCfg.requireTimeline', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireTimeline" className="ml-2 block text-sm text-gray-900">
                    Require Timeline
                  </label>
                </div>
              </div>
            </div>

            {/* Website Foundation Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">2. Website Foundation</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showWebsiteFoundation"
                    checked={formData.calculatorCfg.showWebsiteFoundation}
                    onChange={(e) => handleInputChange('calculatorCfg.showWebsiteFoundation', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showWebsiteFoundation" className="ml-2 block text-sm text-gray-900">
                    Show Website Foundation
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePages"
                    checked={formData.calculatorCfg.requirePages}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePages', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePages" className="ml-2 block text-sm text-gray-900">
                    Require Pages
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePageComplexity"
                    checked={formData.calculatorCfg.requirePageComplexity}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePageComplexity', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePageComplexity" className="ml-2 block text-sm text-gray-900">
                    Require Page Complexity
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireTemplates"
                    checked={formData.calculatorCfg.requireTemplates}
                    onChange={(e) => handleInputChange('calculatorCfg.requireTemplates', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireTemplates" className="ml-2 block text-sm text-gray-900">
                    Require Templates
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePlatform"
                    checked={formData.calculatorCfg.requirePlatform}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePlatform', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePlatform" className="ml-2 block text-sm text-gray-900">
                    Require Platform
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCustomApp"
                    checked={formData.calculatorCfg.showCustomApp}
                    onChange={(e) => handleInputChange('calculatorCfg.showCustomApp', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showCustomApp" className="ml-2 block text-sm text-gray-900">
                    Show Custom App Options
                  </label>
                </div>
              </div>
            </div>

            {/* E-commerce Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">3. E-commerce</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showEcommerce"
                    checked={formData.calculatorCfg.showEcommerce}
                    onChange={(e) => handleInputChange('calculatorCfg.showEcommerce', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showEcommerce" className="ml-2 block text-sm text-gray-900">
                    Show E-commerce Section
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEcommerceType"
                    checked={formData.calculatorCfg.requireEcommerceType}
                    onChange={(e) => handleInputChange('calculatorCfg.requireEcommerceType', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireEcommerceType" className="ml-2 block text-sm text-gray-900">
                    Require Store Type
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireProductCount"
                    checked={formData.calculatorCfg.requireProductCount}
                    onChange={(e) => handleInputChange('calculatorCfg.requireProductCount', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireProductCount" className="ml-2 block text-sm text-gray-900">
                    Require Product Count
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireCategories"
                    checked={formData.calculatorCfg.requireCategories}
                    onChange={(e) => handleInputChange('calculatorCfg.requireCategories', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireCategories" className="ml-2 block text-sm text-gray-900">
                    Require Categories
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePaymentMethods"
                    checked={formData.calculatorCfg.requirePaymentMethods}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePaymentMethods', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePaymentMethods" className="ml-2 block text-sm text-gray-900">
                    Require Payment Methods
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireInventory"
                    checked={formData.calculatorCfg.requireInventory}
                    onChange={(e) => handleInputChange('calculatorCfg.requireInventory', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireInventory" className="ml-2 block text-sm text-gray-900">
                    Require Inventory Management
                  </label>
                </div>
              </div>
            </div>

            {/* Interactive Features Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">4. Interactive Features</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInteractiveFeatures"
                    checked={formData.calculatorCfg.showInteractiveFeatures}
                    onChange={(e) => handleInputChange('calculatorCfg.showInteractiveFeatures', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showInteractiveFeatures" className="ml-2 block text-sm text-gray-900">
                    Show Interactive Features
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireDesign"
                    checked={formData.calculatorCfg.requireDesign}
                    onChange={(e) => handleInputChange('calculatorCfg.requireDesign', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireDesign" className="ml-2 block text-sm text-gray-900">
                    Require Design Selection
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireForms"
                    checked={formData.calculatorCfg.requireForms}
                    onChange={(e) => handleInputChange('calculatorCfg.requireForms', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireForms" className="ml-2 block text-sm text-gray-900">
                    Require Forms
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireAdvancedForms"
                    checked={formData.calculatorCfg.requireAdvancedForms}
                    onChange={(e) => handleInputChange('calculatorCfg.requireAdvancedForms', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireAdvancedForms" className="ml-2 block text-sm text-gray-900">
                    Require Advanced Forms
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireCalculators"
                    checked={formData.calculatorCfg.requireCalculators}
                    onChange={(e) => handleInputChange('calculatorCfg.requireCalculators', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireCalculators" className="ml-2 block text-sm text-gray-900">
                    Require Calculators
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireConfigurators"
                    checked={formData.calculatorCfg.requireConfigurators}
                    onChange={(e) => handleInputChange('calculatorCfg.requireConfigurators', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireConfigurators" className="ml-2 block text-sm text-gray-900">
                    Require Configurators
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireIntegrations"
                    checked={formData.calculatorCfg.requireIntegrations}
                    onChange={(e) => handleInputChange('calculatorCfg.requireIntegrations', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireIntegrations" className="ml-2 block text-sm text-gray-900">
                    Require Integrations
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Services Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">5. Additional Services</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showAdditionalServices"
                    checked={formData.calculatorCfg.showAdditionalServices}
                    onChange={(e) => handleInputChange('calculatorCfg.showAdditionalServices', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showAdditionalServices" className="ml-2 block text-sm text-gray-900">
                    Show Additional Services
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireAccessibility"
                    checked={formData.calculatorCfg.requireAccessibility}
                    onChange={(e) => handleInputChange('calculatorCfg.requireAccessibility', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireAccessibility" className="ml-2 block text-sm text-gray-900">
                    Require Accessibility
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePerformanceOptimization"
                    checked={formData.calculatorCfg.requirePerformanceOptimization}
                    onChange={(e) => handleInputChange('calculatorCfg.requirePerformanceOptimization', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requirePerformanceOptimization" className="ml-2 block text-sm text-gray-900">
                    Require Performance Optimization
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireDesignAndBranding"
                    checked={formData.calculatorCfg.requireDesignAndBranding}
                    onChange={(e) => handleInputChange('calculatorCfg.requireDesignAndBranding', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireDesignAndBranding" className="ml-2 block text-sm text-gray-900">
                    Require Design & Branding
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireContentAndMarketing"
                    checked={formData.calculatorCfg.requireContentAndMarketing}
                    onChange={(e) => handleInputChange('calculatorCfg.requireContentAndMarketing', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireContentAndMarketing" className="ml-2 block text-sm text-gray-900">
                    Require Content & Marketing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireCrmIntegration"
                    checked={formData.calculatorCfg.requireCrmIntegration}
                    onChange={(e) => handleInputChange('calculatorCfg.requireCrmIntegration', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireCrmIntegration" className="ml-2 block text-sm text-gray-900">
                    Require CRM Integration
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEmailMarketing"
                    checked={formData.calculatorCfg.requireEmailMarketing}
                    onChange={(e) => handleInputChange('calculatorCfg.requireEmailMarketing', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireEmailMarketing" className="ml-2 block text-sm text-gray-900">
                    Require Email Marketing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireAdvancedTracking"
                    checked={formData.calculatorCfg.requireAdvancedTracking}
                    onChange={(e) => handleInputChange('calculatorCfg.requireAdvancedTracking', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireAdvancedTracking" className="ml-2 block text-sm text-gray-900">
                    Require Advanced Tracking
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireCustomFeatures"
                    checked={formData.calculatorCfg.requireCustomFeatures}
                    onChange={(e) => handleInputChange('calculatorCfg.requireCustomFeatures', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireCustomFeatures" className="ml-2 block text-sm text-gray-900">
                    Require Custom Features
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Pricing Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Pricing Configuration</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Base Price
              </label>
              <input
                type="number"
                id="basePrice"
                value={formData.pricingCfg.basePrice}
                onChange={(e) => handleInputChange('pricingCfg.basePrice', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={formData.pricingCfg.currency}
                onChange={(e) => handleInputChange('pricingCfg.currency', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
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
                  Show pricing breakdown to users
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Pricing Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Detailed Pricing Configuration</h2>
          <p className="text-sm text-gray-600 mb-6">Configure custom pricing for each calculator option. Leave at 0 to disable that option.</p>
          
          <div className="space-y-8">
            {/* Base Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Base Pricing</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="pagePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Page
                  </label>
                  <input
                    type="number"
                    id="pagePrice"
                    value={formData.calculatorCfg.pricing.pagePrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.pagePrice', parseFloat(e.target.value) || 0)}
                    placeholder="50"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="templatePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Template
                  </label>
                  <input
                    type="number"
                    id="templatePrice"
                    value={formData.calculatorCfg.pricing.templatePrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.templatePrice', parseFloat(e.target.value) || 0)}
                    placeholder="200"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="formPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Form
                  </label>
                  <input
                    type="number"
                    id="formPrice"
                    value={formData.calculatorCfg.pricing.formPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.formPrice', parseFloat(e.target.value) || 0)}
                    placeholder="100"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="advancedFormPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Advanced Form
                  </label>
                  <input
                    type="number"
                    id="advancedFormPrice"
                    value={formData.calculatorCfg.pricing.advancedFormPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.advancedFormPrice', parseFloat(e.target.value) || 0)}
                    placeholder="300"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="calculatorPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Calculator
                  </label>
                  <input
                    type="number"
                    id="calculatorPrice"
                    value={formData.calculatorCfg.pricing.calculatorPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.calculatorPrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="configuratorPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Configurator
                  </label>
                  <input
                    type="number"
                    id="configuratorPrice"
                    value={formData.calculatorCfg.pricing.configuratorPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.configuratorPrice', parseFloat(e.target.value) || 0)}
                    placeholder="750"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
              </div>
            </div>

            {/* E-commerce Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">E-commerce Pricing</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="ecommerceBasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    E-commerce Base Price
                  </label>
                  <input
                    type="number"
                    id="ecommerceBasePrice"
                    value={formData.calculatorCfg.pricing.ecommerceBasePrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.ecommerceBasePrice', parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Product
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    value={formData.calculatorCfg.pricing.productPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.productPrice', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="categoryPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Category
                  </label>
                  <input
                    type="number"
                    id="categoryPrice"
                    value={formData.calculatorCfg.pricing.categoryPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.categoryPrice', parseFloat(e.target.value) || 0)}
                    placeholder="25"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="paymentMethodPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Payment Method
                  </label>
                  <input
                    type="number"
                    id="paymentMethodPrice"
                    value={formData.calculatorCfg.pricing.paymentMethodPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.paymentMethodPrice', parseFloat(e.target.value) || 0)}
                    placeholder="50"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
              </div>
            </div>

            {/* Platform Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Platform Pricing</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="wordpressPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    WordPress Price
                  </label>
                  <input
                    type="number"
                    id="wordpressPrice"
                    value={formData.calculatorCfg.pricing.wordpressPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.wordpressPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="shopifyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Shopify Price
                  </label>
                  <input
                    type="number"
                    id="shopifyPrice"
                    value={formData.calculatorCfg.pricing.shopifyPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.shopifyPrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="bigcommercePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    BigCommerce Price
                  </label>
                  <input
                    type="number"
                    id="bigcommercePrice"
                    value={formData.calculatorCfg.pricing.bigcommercePrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.bigcommercePrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="customPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Platform Price
                  </label>
                  <input
                    type="number"
                    id="customPrice"
                    value={formData.calculatorCfg.pricing.customPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.customPrice', parseFloat(e.target.value) || 0)}
                    placeholder="2000"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
              </div>
            </div>

            {/* Design Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Design Pricing</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="basicDesignPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Design Price
                  </label>
                  <input
                    type="number"
                    id="basicDesignPrice"
                    value={formData.calculatorCfg.pricing.basicDesignPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.basicDesignPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="standardDesignPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Design Price
                  </label>
                  <input
                    type="number"
                    id="standardDesignPrice"
                    value={formData.calculatorCfg.pricing.standardDesignPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.standardDesignPrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="customDesignPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Design Price
                  </label>
                  <input
                    type="number"
                    id="customDesignPrice"
                    value={formData.calculatorCfg.pricing.customDesignPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.customDesignPrice', parseFloat(e.target.value) || 0)}
                    placeholder="1500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
              </div>
            </div>

            {/* Additional Services Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Additional Services Pricing</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="accessibilityBasicPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Accessibility Price
                  </label>
                  <input
                    type="number"
                    id="accessibilityBasicPrice"
                    value={formData.calculatorCfg.pricing.accessibilityBasicPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.accessibilityBasicPrice', parseFloat(e.target.value) || 0)}
                    placeholder="200"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="accessibilityStandardPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Accessibility Price
                  </label>
                  <input
                    type="number"
                    id="accessibilityStandardPrice"
                    value={formData.calculatorCfg.pricing.accessibilityStandardPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.accessibilityStandardPrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="accessibilityFullPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Accessibility Price
                  </label>
                  <input
                    type="number"
                    id="accessibilityFullPrice"
                    value={formData.calculatorCfg.pricing.accessibilityFullPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.accessibilityFullPrice', parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="performanceOptimizationPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Optimization Price
                  </label>
                  <input
                    type="number"
                    id="performanceOptimizationPrice"
                    value={formData.calculatorCfg.pricing.performanceOptimizationPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.performanceOptimizationPrice', parseFloat(e.target.value) || 0)}
                    placeholder="300"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="crmIntegrationPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    CRM Integration Price
                  </label>
                  <input
                    type="number"
                    id="crmIntegrationPrice"
                    value={formData.calculatorCfg.pricing.crmIntegrationPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.crmIntegrationPrice', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="emailMarketingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Marketing Price
                  </label>
                  <input
                    type="number"
                    id="emailMarketingPrice"
                    value={formData.calculatorCfg.pricing.emailMarketingPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.emailMarketingPrice', parseFloat(e.target.value) || 0)}
                    placeholder="200"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="advancedTrackingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Advanced Tracking Price
                  </label>
                  <input
                    type="number"
                    id="advancedTrackingPrice"
                    value={formData.calculatorCfg.pricing.advancedTrackingPrice}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.advancedTrackingPrice', parseFloat(e.target.value) || 0)}
                    placeholder="300"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                </div>
                <div>
                  <label htmlFor="rushMultiplier" className="block text-sm font-medium text-gray-700 mb-2">
                    Rush Timeline Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="rushMultiplier"
                    value={formData.calculatorCfg.pricing.rushMultiplier}
                    onChange={(e) => handleInputChange('calculatorCfg.pricing.rushMultiplier', parseFloat(e.target.value) || 1.0)}
                    placeholder="1.5"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  />
                  <p className="mt-1 text-xs text-gray-500">1.5 = 50% markup for rush projects</p>
                </div>
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
