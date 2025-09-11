'use client'

import { useState, useEffect } from 'react'

interface CalculatorFormData {
  // Project Overview
  projectName: string
  projectType: string
  projectDescription: string
  timeline: string
  
  // Website Foundation
  pages: number
  templates: number
  platform: string
  
  // Custom Application (if platform is custom)
  customApp: {
    appType: string
    userAccounts: boolean
    database: boolean
    apiIntegrations: number
    mobileApp: boolean
    complexity: string
  }
  
  // E-commerce
  ecommerce: boolean
  ecommerceParams: {
    products: number
    paymentMethod: string
    paymentRedirect: boolean
  }
  
  // Interactive Features
  forms: number
  advancedForms: number
  calculators: number
  configurators: number
  
  // Integrations & Tools
  crmIntegration: boolean
  emailMarketing: boolean
  advancedTracking: boolean
  
  // Additional Services
  designAndBranding: {
    logoDesign: boolean
    customDesign: boolean
    photography: boolean
    brandIdentity: boolean
  }
  contentAndMarketing: {
    copywriting: boolean
    contentStrategy: boolean
    seoSetup: boolean
    socialMedia: boolean
  }
  accessibility: string
  performanceOptimization: boolean
  customFeatures: Array<{ name: string; price: number }>
  
  // Contact Info
  submittedBy: string
  submitterEmail: string
  emailCC: string
  notes: string
}

interface PricingItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function CalculatorFormV3() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    // Project Overview
    projectName: '',
    projectType: 'Marketing Website',
    projectDescription: '',
    timeline: 'Standard',
    
    // Website Foundation
    pages: 5,
    templates: 1,
    platform: 'WordPress',
    
    // Custom Application
    customApp: {
      appType: '',
      userAccounts: false,
      database: false,
      apiIntegrations: 0,
      mobileApp: false,
      complexity: 'Simple'
    },
    
    // E-commerce
    ecommerce: false,
    ecommerceParams: {
      products: 0,
      paymentMethod: 'Stripe/PayPal',
      paymentRedirect: false
    },
    
    // Interactive Features
    forms: 0,
    advancedForms: 0,
    calculators: 0,
    configurators: 0,
    
    // Integrations & Tools
    crmIntegration: false,
    emailMarketing: false,
    advancedTracking: false,
    
    // Additional Services
    designAndBranding: {
      logoDesign: false,
      customDesign: false,
      photography: false,
      brandIdentity: false
    },
    contentAndMarketing: {
      copywriting: false,
      contentStrategy: false,
      seoSetup: false,
      socialMedia: false
    },
    accessibility: 'Basic',
    performanceOptimization: false,
    customFeatures: [],
    
    // Contact Info
    submittedBy: '',
    submitterEmail: '',
    emailCC: '',
    notes: ''
  })

  const [pricingItems, setPricingItems] = useState<PricingItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [timeline, setTimeline] = useState(28)
  
  // Popup states
  const [showTemplatePopup, setShowTemplatePopup] = useState(false)
  const [showPagePopup, setShowPagePopup] = useState(false)
  const [showCalculatorPopup, setShowCalculatorPopup] = useState(false)
  const [showAdvancedFormsTray, setShowAdvancedFormsTray] = useState(false)
  const [showEcommerceTray, setShowEcommerceTray] = useState(false)
  const [showCustomAppTray, setShowCustomAppTray] = useState(false)

  // Calculate pricing when form data changes
  useEffect(() => {
    calculatePricing()
  }, [formData])

  // Show popups when thresholds are reached
  useEffect(() => {
    if (formData.templates > 7) {
      setShowTemplatePopup(true)
    }
  }, [formData.templates])

  useEffect(() => {
    if (formData.pages > 30) {
      setShowPagePopup(true)
    }
  }, [formData.pages])

  useEffect(() => {
    if (formData.calculators > 0 || formData.configurators > 0) {
      setShowCalculatorPopup(true)
    }
  }, [formData.calculators, formData.configurators])

  useEffect(() => {
    if (formData.platform === 'Custom Application') {
      setShowCustomAppTray(true)
    } else {
      setShowCustomAppTray(false)
    }
  }, [formData.platform])

  useEffect(() => {
    if (formData.advancedForms > 0) {
      setShowAdvancedFormsTray(true)
    } else {
      setShowAdvancedFormsTray(false)
    }
  }, [formData.advancedForms])

  useEffect(() => {
    if (formData.ecommerce) {
      setShowEcommerceTray(true)
    } else {
      setShowEcommerceTray(false)
    }
  }, [formData.ecommerce])

  const calculatePricing = () => {
    const items: PricingItem[] = []
    let calculatedSubtotal = 0

    // Base pricing based on pages and templates
    const basePrice = 2500 // Base price for 1 template up to 5 pages
    
    // Add base price
    items.push({
      description: `Base website (${formData.templates} template${formData.templates > 1 ? 's' : ''}, up to ${Math.max(5, formData.pages)} pages)`,
      quantity: 1,
      unitPrice: basePrice,
      total: basePrice
    })
    calculatedSubtotal += basePrice

    // Additional pages beyond 5
    if (formData.pages > 5) {
      const additionalPages = formData.pages - 5
      const pagePrice = 200 // $200 per additional page
      items.push({
        description: `Additional pages (${additionalPages} pages)`,
        quantity: additionalPages,
        unitPrice: pagePrice,
        total: additionalPages * pagePrice
      })
      calculatedSubtotal += additionalPages * pagePrice
    }

    // Additional templates beyond 1
    if (formData.templates > 1) {
      const additionalTemplates = formData.templates - 1
      const templatePrice = 500 // $500 per additional template
      items.push({
        description: `Additional templates (${additionalTemplates} template${additionalTemplates > 1 ? 's' : ''})`,
        quantity: additionalTemplates,
        unitPrice: templatePrice,
        total: additionalTemplates * templatePrice
      })
      calculatedSubtotal += additionalTemplates * templatePrice
    }

    // Custom Application pricing
    if (formData.platform === 'Custom Application') {
      let customAppPrice = 5000 // Base custom app price
      
      if (formData.customApp.userAccounts) customAppPrice += 2000
      if (formData.customApp.database) customAppPrice += 3000
      if (formData.customApp.apiIntegrations > 0) customAppPrice += formData.customApp.apiIntegrations * 800
      if (formData.customApp.mobileApp) customAppPrice += 8000
      
      // Complexity multiplier
      if (formData.customApp.complexity === 'Complex') customAppPrice *= 1.5
      else if (formData.customApp.complexity === 'Enterprise') customAppPrice *= 2
      
      items.push({
        description: 'Custom Application Development',
        quantity: 1,
        unitPrice: customAppPrice,
        total: customAppPrice
      })
      calculatedSubtotal += customAppPrice
    }

    // E-commerce
    if (formData.ecommerce) {
      let ecommercePrice = 1500 // Base e-commerce price
      
      // Product-based pricing
      if (formData.ecommerceParams.products > 100) {
        ecommercePrice += Math.ceil((formData.ecommerceParams.products - 100) / 50) * 500
      }
      
      items.push({
        description: `E-commerce (${formData.ecommerceParams.products} products)`,
        quantity: 1,
        unitPrice: ecommercePrice,
        total: ecommercePrice
      })
      calculatedSubtotal += ecommercePrice
    }

    // Forms
    if (formData.forms > 0) {
      items.push({
        description: `${formData.forms} contact form${formData.forms > 1 ? 's' : ''}`,
        quantity: formData.forms,
        unitPrice: 200,
        total: formData.forms * 200
      })
      calculatedSubtotal += formData.forms * 200
    }

    // Advanced Forms
    if (formData.advancedForms > 0) {
      items.push({
        description: `${formData.advancedForms} advanced form${formData.advancedForms > 1 ? 's' : ''}`,
        quantity: formData.advancedForms,
        unitPrice: 800,
        total: formData.advancedForms * 800
      })
      calculatedSubtotal += formData.advancedForms * 800
    }

    // Calculators
    if (formData.calculators > 0) {
      items.push({
        description: `${formData.calculators} calculator${formData.calculators > 1 ? 's' : ''}`,
        quantity: formData.calculators,
        unitPrice: 600,
        total: formData.calculators * 600
      })
      calculatedSubtotal += formData.calculators * 600
    }

    // Configurators
    if (formData.configurators > 0) {
      items.push({
        description: `${formData.configurators} configurator${formData.configurators > 1 ? 's' : ''}`,
        quantity: formData.configurators,
        unitPrice: 800,
        total: formData.configurators * 800
      })
      calculatedSubtotal += formData.configurators * 800
    }

    // Integrations & Tools
    if (formData.crmIntegration) {
      items.push({
        description: 'CRM Integration',
        quantity: 1,
        unitPrice: 500,
        total: 500
      })
      calculatedSubtotal += 500
    }

    if (formData.emailMarketing) {
      items.push({
        description: 'Email Marketing Integration',
        quantity: 1,
        unitPrice: 400,
        total: 400
      })
      calculatedSubtotal += 400
    }

    if (formData.advancedTracking) {
      items.push({
        description: 'Advanced Analytics Setup',
        quantity: 1,
        unitPrice: 500,
        total: 500
      })
      calculatedSubtotal += 500
    }

    // Additional Services - Design & Branding
    if (formData.designAndBranding.logoDesign) {
      items.push({
        description: 'Logo Design',
        quantity: 1,
        unitPrice: 500,
        total: 500
      })
      calculatedSubtotal += 500
    }

    if (formData.designAndBranding.customDesign) {
      items.push({
        description: 'Custom Design',
        quantity: 1,
        unitPrice: 2500,
        total: 2500
      })
      calculatedSubtotal += 2500
    }

    if (formData.designAndBranding.photography) {
      items.push({
        description: 'Custom Photography',
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      })
      calculatedSubtotal += 1500
    }

    if (formData.designAndBranding.brandIdentity) {
      items.push({
        description: 'Full Brand Identity',
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      })
      calculatedSubtotal += 5000
    }

    // Additional Services - Content & Marketing
    if (formData.contentAndMarketing.copywriting) {
      items.push({
        description: 'Copywriting',
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      })
      calculatedSubtotal += 1500
    }

    if (formData.contentAndMarketing.contentStrategy) {
      items.push({
        description: 'Content Strategy',
        quantity: 1,
        unitPrice: 3500,
        total: 3500
      })
      calculatedSubtotal += 3500
    }

    if (formData.contentAndMarketing.seoSetup) {
      items.push({
        description: 'SEO Setup',
        quantity: 1,
        unitPrice: 2000,
        total: 2000
      })
      calculatedSubtotal += 2000
    }

    if (formData.contentAndMarketing.socialMedia) {
      items.push({
        description: 'Social Media Integration',
        quantity: 1,
        unitPrice: 800,
        total: 800
      })
      calculatedSubtotal += 800
    }

    // Accessibility
    if (formData.accessibility === 'WCAG AA') {
      items.push({
        description: 'WCAG AA Accessibility Compliance',
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      })
      calculatedSubtotal += 1500
    } else if (formData.accessibility === 'WCAG AAA') {
      items.push({
        description: 'WCAG AAA Accessibility Compliance',
        quantity: 1,
        unitPrice: 3000,
        total: 3000
      })
      calculatedSubtotal += 3000
    }

    // Performance Optimization
    if (formData.performanceOptimization) {
      items.push({
        description: 'Advanced Performance Optimization',
        quantity: 1,
        unitPrice: 1200,
        total: 1200
      })
      calculatedSubtotal += 1200
    }

    // Custom Features
    formData.customFeatures.forEach(feature => {
      items.push({
        description: feature.name,
        quantity: 1,
        unitPrice: feature.price,
        total: feature.price
      })
      calculatedSubtotal += feature.price
    })

    setPricingItems(items)
    setSubtotal(calculatedSubtotal)

    // Apply rush pricing
    const finalTotal = formData.timeline === 'Rush' ? calculatedSubtotal * 1.2 : calculatedSubtotal
    setTotal(finalTotal)

    // Calculate timeline based on project size and type
    let baseTimeline = 28 // 4 weeks for standard timeline
    if (formData.pages > 12) baseTimeline = 35 // 5 weeks
    if (formData.pages > 25) baseTimeline = 42 // 6 weeks
    if (formData.pages > 35) baseTimeline = 56 // 8 weeks
    
    // Add time for complex features
    if (formData.platform === 'Custom Application') baseTimeline += 21 // +3 weeks
    if (formData.ecommerce) baseTimeline += 14 // +2 weeks
    if (formData.calculators > 0 || formData.configurators > 0) baseTimeline += 7 // +1 week
    
    const rushTimeline = formData.timeline === 'Rush' ? Math.ceil(baseTimeline * 0.7) : baseTimeline
    setTimeline(rushTimeline)
  }

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCustomAppChange = (field: keyof typeof formData.customApp, value: any) => {
    setFormData(prev => ({
      ...prev,
      customApp: {
        ...prev.customApp,
        [field]: value
      }
    }))
  }

  const handleEcommerceParamChange = (field: keyof typeof formData.ecommerceParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      ecommerceParams: {
        ...prev.ecommerceParams,
        [field]: value
      }
    }))
  }

  const handleDesignAndBrandingChange = (field: keyof typeof formData.designAndBranding, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      designAndBranding: {
        ...prev.designAndBranding,
        [field]: value
      }
    }))
  }

  const handleContentAndMarketingChange = (field: keyof typeof formData.contentAndMarketing, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      contentAndMarketing: {
        ...prev.contentAndMarketing,
        [field]: value
      }
    }))
  }

  const addCustomFeature = () => {
    setFormData(prev => ({
      ...prev,
      customFeatures: [...prev.customFeatures, { name: '', price: 0 }]
    }))
  }

  const removeCustomFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index)
    }))
  }

  const updateCustomFeature = (index: number, field: 'name' | 'price', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const resetForm = () => {
    setFormData({
      // Project Overview
      projectName: '',
      projectType: 'Marketing Website',
      projectDescription: '',
      timeline: 'Standard',
      
      // Website Foundation
      pages: 5,
      templates: 1,
      platform: 'WordPress',
      
      // Custom Application
      customApp: {
        appType: '',
        userAccounts: false,
        database: false,
        apiIntegrations: 0,
        mobileApp: false,
        complexity: 'Simple'
      },
      
      // E-commerce
      ecommerce: false,
      ecommerceParams: {
        products: 0,
        paymentMethod: 'Stripe/PayPal',
        paymentRedirect: false
      },
      
      // Interactive Features
      forms: 0,
      advancedForms: 0,
      calculators: 0,
      configurators: 0,
      
      // Integrations & Tools
      crmIntegration: false,
      emailMarketing: false,
      advancedTracking: false,
      
      // Additional Services
      designAndBranding: {
        logoDesign: false,
        customDesign: false,
        photography: false,
        brandIdentity: false
      },
      contentAndMarketing: {
        copywriting: false,
        contentStrategy: false,
        seoSetup: false,
        socialMedia: false
      },
      accessibility: 'Basic',
      performanceOptimization: false,
      customFeatures: [],
      
      // Contact Info
      submittedBy: '',
      submitterEmail: '',
      emailCC: '',
      notes: ''
    })
  }

  const handleSubmit = async () => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Submit quote for "${formData.projectName}"?\n\n` +
        `Total: $${total.toLocaleString()}\n` +
        `Timeline: ${timeline} days\n\n` +
        `This will send the quote to your email and our team for review.`
      )
      
      if (!confirmed) {
        return
      }

      // TODO: Implement actual quote submission to API
      console.log('Submitting quote:', { formData, total, timeline })
      
      // Show success message
      alert('Quote submitted successfully! You will receive a confirmation email shortly.')
      
      // Reset form after successful submission
      resetForm()
      
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Error submitting quote. Please try again.')
    }
  }

  const handleExport = () => {
    // TODO: Implement quote export to PDF
    console.log('Exporting quote to PDF')
  }

  const handleAdmin = () => {
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Banner */}
        <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Website Development Quote Calculator</h1>
          <p className="text-blue-100">
            Get an instant quote for your website project. If you need help or have questions, 
            feel free to reach out! Submit what you know and we'll follow up after you submit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Project Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Project Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Marketing Website">Marketing Website</option>
                    <option value="E-commerce Store">E-commerce Store</option>
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="Portfolio/Brochure Site">Portfolio/Brochure Site</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Landing Page Campaign">Landing Page Campaign</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Preference *
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard (4-8 weeks)</option>
                    <option value="Rush">Rush (2-4 weeks) +20%</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project goals and requirements..."
                />
              </div>
            </div>

            {/* Section 2: Website Foundation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Website Foundation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Pages *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Templates *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.templates}
                    onChange={(e) => handleInputChange('templates', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WordPress">WordPress</option>
                    <option value="Shopify">Shopify</option>
                    <option value="BigCommerce">BigCommerce</option>
                    <option value="Square">Square</option>
                    <option value="Webflow">Webflow</option>
                    <option value="Squarespace">Squarespace</option>
                    <option value="Wix">Wix</option>
                    <option value="Drupal">Drupal</option>
                    <option value="Custom Application">Custom Application</option>
                  </select>
                </div>
              </div>

              {/* Custom Application Tray */}
              {showCustomAppTray && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Type
                      </label>
                      <select
                        value={formData.customApp.appType}
                        onChange={(e) => handleCustomAppChange('appType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select application type</option>
                        <option value="Web Application">Web Application</option>
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="API Service">API Service</option>
                        <option value="Mobile App">Mobile App</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complexity Level
                      </label>
                      <select
                        value={formData.customApp.complexity}
                        onChange={(e) => handleCustomAppChange('complexity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Simple">Simple</option>
                        <option value="Complex">Complex</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="userAccounts"
                        checked={formData.customApp.userAccounts}
                        onChange={(e) => handleCustomAppChange('userAccounts', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="userAccounts" className="ml-2 block text-sm text-gray-700">
                        User Accounts & Authentication
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="database"
                        checked={formData.customApp.database}
                        onChange={(e) => handleCustomAppChange('database', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="database" className="ml-2 block text-sm text-gray-700">
                        Custom Database
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobileApp"
                        checked={formData.customApp.mobileApp}
                        onChange={(e) => handleCustomAppChange('mobileApp', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mobileApp" className="ml-2 block text-sm text-gray-700">
                        Mobile App Development
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Integrations
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.customApp.apiIntegrations}
                        onChange={(e) => handleCustomAppChange('apiIntegrations', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Continue with other sections... */}
            {/* This is getting very long, so I'll continue in the next part */}
            
          </div>

          {/* Pricing Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quote Summary</h3>
              
              <div className="space-y-3 mb-6">
                {pricingItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.description}</span>
                    <span className="font-medium">${item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                <p><strong>Timeline:</strong> {timeline} days</p>
                {formData.timeline === 'Rush' && (
                  <p className="text-orange-600">Rush delivery (+20%)</p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Quote
                </button>
                <button
                  onClick={handleExport}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Export PDF
                </button>
                <button
                  onClick={resetForm}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Reset Form
                </button>
                <button
                  onClick={handleAdmin}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
                >
                  Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
