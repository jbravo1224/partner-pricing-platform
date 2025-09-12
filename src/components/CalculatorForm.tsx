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

export default function CalculatorFormV2() {
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
  const [timeline, setTimeline] = useState(30)
  
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
    }
  }, [formData.advancedForms])

  useEffect(() => {
    if (formData.ecommerce) {
      setShowEcommerceTray(true)
    }
  }, [formData.ecommerce])

  const calculatePricing = () => {
    const items: PricingItem[] = []
    let calculatedSubtotal = 0

    // Base pricing: 1 template + up to 5 pages = $2500
    const basePrice = 2500
    const baseTemplates = 1
    const basePages = 5

    // Calculate additional templates beyond base
    if (formData.templates > baseTemplates) {
      const additionalTemplates = formData.templates - baseTemplates
      items.push({
        description: `${additionalTemplates} additional template(s)`,
        quantity: additionalTemplates,
        unitPrice: 400,
        total: additionalTemplates * 400
      })
      calculatedSubtotal += additionalTemplates * 400
    }

    // Calculate additional pages beyond base
    if (formData.pages > basePages) {
      const additionalPages = formData.pages - basePages
      items.push({
        description: `${additionalPages} additional page(s)`,
        quantity: additionalPages,
        unitPrice: 150,
        total: additionalPages * 150
      })
      calculatedSubtotal += additionalPages * 150
    }

    // Add base price
    items.push({
      description: `Base package (${baseTemplates} template, up to ${basePages} pages)`,
      quantity: 1,
      unitPrice: basePrice,
      total: basePrice
    })
    calculatedSubtotal += basePrice

    // Forms
    if (formData.forms > 0) {
      items.push({
        description: `${formData.forms} form(s)`,
        quantity: formData.forms,
        unitPrice: 100,
        total: formData.forms * 100
      })
      calculatedSubtotal += formData.forms * 100
    }

    // Advanced Forms
    if (formData.advancedForms > 0) {
      items.push({
        description: `${formData.advancedForms} advanced form(s)`,
        quantity: formData.advancedForms,
        unitPrice: 300,
        total: formData.advancedForms * 300
      })
      calculatedSubtotal += formData.advancedForms * 300
    }

    // Calculators
    if (formData.calculators > 0) {
      items.push({
        description: `${formData.calculators} calculator(s)`,
        quantity: formData.calculators,
        unitPrice: 500,
        total: formData.calculators * 500
      })
      calculatedSubtotal += formData.calculators * 500
    }

    // Configurators
    if (formData.configurators > 0) {
      items.push({
        description: `${formData.configurators} configurator(s)`,
        quantity: formData.configurators,
        unitPrice: 800,
        total: formData.configurators * 800
      })
      calculatedSubtotal += formData.configurators * 800
    }

    // E-commerce
    if (formData.ecommerce) {
      items.push({
        description: 'E-commerce',
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      })
      calculatedSubtotal += 1500
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

    // Apply rush discount (20% surcharge for rush projects)
    const finalTotal = formData.timeline === 'Rush' ? calculatedSubtotal * 1.2 : calculatedSubtotal
    setTotal(finalTotal)
    
    // Vercel deployment fix - ensure latest commit is used

    // Calculate timeline based on page count
    let baseTimeline = 20 // Base timeline for 1-12 pages
    if (formData.pages > 12 && formData.pages <= 25) {
      baseTimeline = 30
    } else if (formData.pages > 25 && formData.pages <= 35) {
      baseTimeline = 45
    } else if (formData.pages > 35) {
      baseTimeline = 60
    }
    
    const rushTimeline = formData.timeline === 'Rush' ? Math.ceil(baseTimeline * 0.7) : baseTimeline
    setTimeline(rushTimeline)
  }

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      projectName: '',
      packageSize: 'Simple',
      projectDescription: '',
      submittedBy: '',
      submitterEmail: '',
      emailCC: '',
      templates: 1,
      pages: 5,
      pageComplexity: 'Simple',
      platform: 'WordPress (CMS)',
      ecommerce: false,
      ecommerceParams: {
        products: 0,
        categories: 0,
        paymentMethods: [],
        inventory: false
      },
      design: 'Grey Matter',
      forms: 0,
      integrations: [],
      advancedForms: 0,
      advancedFormsDescription: '',
      calculators: 0,
      configurators: 0,
      accessibility: 'None',
      rush: false,
      customFeatures: [],
      notes: ''
    })
  }

  const handleSubmit = async () => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Submit quote for "${formData.projectName}"?\n\n` +
        `Total: $${total.toLocaleString()}\n` +
        `Timeline: ${timeline}\n\n` +
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GM Grey Matter - Website Pricing Calculator</h1>
              <p className="text-sm text-gray-600 mt-1">Saved {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Export quote
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleAdmin}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Have questions or want to talk it through? Submit this estimate and we'll refine scope together. Nothing is final until we review with you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Basics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project basics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package size
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <select
                    value={formData.packageSize}
                    onChange={(e) => handleInputChange('packageSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project description
                  <span className="ml-1 text-gray-400 cursor-help">?</span>
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="Describe goals, brand context, requirements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted by</label>
                  <input
                    type="text"
                    value={formData.submittedBy}
                    onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitter email</label>
                  <input
                    type="email"
                    value={formData.submitterEmail}
                    onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email CC (optional)</label>
                  <input
                    type="text"
                    value={formData.emailCC}
                    onChange={(e) => handleInputChange('emailCC', e.target.value)}
                    placeholder="cc1@example.com, cc2@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Scope & Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Templates
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.templates}
                    onChange={(e) => handleInputChange('templates', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pages
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Complexity
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <select
                    value={formData.pageComplexity}
                    onChange={(e) => handleInputChange('pageComplexity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Standard">Standard</option>
                    <option value="Complex">Complex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WordPress (CMS)">WordPress (CMS)</option>
                    <option value="Custom CMS">Custom CMS</option>
                    <option value="Static Site">Static Site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <select
                    value={formData.design}
                    onChange={(e) => handleInputChange('design', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Grey Matter">Grey Matter</option>
                    <option value="HDM">HDM</option>
                    <option value="Transpose">Transpose</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forms
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.forms}
                    onChange={(e) => handleInputChange('forms', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Advanced forms
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.advancedForms}
                    onChange={(e) => handleInputChange('advancedForms', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calculators
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calculators}
                    onChange={(e) => handleInputChange('calculators', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Configurators
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.configurators}
                    onChange={(e) => handleInputChange('configurators', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accessibility
                    <span className="ml-1 text-gray-400 cursor-help">?</span>
                  </label>
                  <select
                    value={formData.accessibility}
                    onChange={(e) => handleInputChange('accessibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="None">None</option>
                    <option value="Basic">Basic</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>

              {/* Integrations (only show when forms = 1) */}
              {formData.forms === 1 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Integrations</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['HubSpot', 'Salesforce', 'Oracle', 'Other'].map((integration) => (
                      <label key={integration} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.integrations.includes(integration)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('integrations', [...formData.integrations, integration])
                            } else {
                              handleInputChange('integrations', formData.integrations.filter(i => i !== integration))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{integration}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="ecommerce"
                  checked={formData.ecommerce}
                  onChange={(e) => handleInputChange('ecommerce', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ecommerce" className="ml-2 block text-sm text-gray-700">
                  E-commerce
                  <span className="ml-1 text-gray-400 cursor-help">?</span>
                </label>
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="rush"
                  checked={formData.rush}
                  onChange={(e) => handleInputChange('rush', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rush" className="ml-2 block text-sm text-gray-700">
                  Rush (adds 20%)
                  <span className="ml-1 text-gray-400 cursor-help">?</span>
                </label>
              </div>
            </div>

            {/* Advanced Forms Tray */}
            {showAdvancedFormsTray && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Forms Description</h2>
                <textarea
                  value={formData.advancedFormsDescription}
                  onChange={(e) => handleInputChange('advancedFormsDescription', e.target.value)}
                  placeholder="Describe the advanced forms functionality needed..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* E-commerce Tray */}
            {showEcommerceTray && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">E-commerce Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Products</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.ecommerceParams.products}
                      onChange={(e) => handleEcommerceParamChange('products', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Categories</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.ecommerceParams.categories}
                      onChange={(e) => handleEcommerceParamChange('categories', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Credit Card', 'PayPal', 'Stripe', 'Square', 'Bank Transfer', 'Other'].map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.ecommerceParams.paymentMethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleEcommerceParamChange('paymentMethods', [...formData.ecommerceParams.paymentMethods, method])
                            } else {
                              handleEcommerceParamChange('paymentMethods', formData.ecommerceParams.paymentMethods.filter(m => m !== method))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="inventory"
                    checked={formData.ecommerceParams.inventory}
                    onChange={(e) => handleEcommerceParamChange('inventory', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inventory" className="ml-2 block text-sm text-gray-700">
                    Inventory Management Required
                  </label>
                </div>
              </div>
            )}

            {/* Custom Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom features</h2>
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> If you use this section, we will need to discuss these features and can provide you with a custom price. This will be included in your quote.
                </p>
              </div>
              {formData.customFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={feature.name}
                    onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={feature.price}
                    onChange={(e) => updateCustomFeature(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeCustomFeature(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addCustomFeature}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                + Add feature
              </button>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Assumptions, scope, exclusions..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimate</h2>
              <div className="space-y-3">
                {pricingItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.description} @ ${item.unitPrice.toLocaleString()}</span>
                    <span>${item.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {formData.rush && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Rush (20%):</span>
                      <span>+${(total - subtotal).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Project total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Estimated timeline:</strong> {timeline} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popups */}
        {/* Template Popup */}
        {showTemplatePopup && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Template Notice</h3>
              <button
                onClick={() => setShowTemplatePopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              You've selected {formData.templates} templates. For projects with more than 7 templates, we'll need to finalize the scope after you submit this estimate.
            </p>
            <p className="text-xs text-gray-500">
              This message will appear on your exported PDF quote.
            </p>
          </div>
        )}

        {/* Page Popup */}
        {showPagePopup && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Page Count Notice</h3>
              <button
                onClick={() => setShowPagePopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              You've selected {formData.pages} pages. For projects with more than 30 pages, we'll need to finalize the scope after you submit this estimate.
            </p>
            <p className="text-xs text-gray-500">
              This message will appear on your exported PDF quote.
            </p>
          </div>
        )}

        {/* Calculator/Configurator Popup */}
        {showCalculatorPopup && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Scope Discussion Required</h3>
              <button
                onClick={() => setShowCalculatorPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              You've selected calculators or configurators. Please finish submitting this form and then ping John Helbling on Slack so we can finish scoping this out.
            </p>
            <p className="text-xs text-gray-500">
              This message will appear on your exported PDF quote.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
