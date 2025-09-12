'use client'

import { useState, useEffect } from 'react'

interface CalculatorFormData {
  // Project Overview
  projectName: string
  projectType: string
  packageSize: string
  projectDescription: string
  submittedBy: string
  submitterEmail: string
  timeline: string
  
  // Website Foundation
  pages: number
  pageComplexity: string
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
  ecommerceType: string // 'transactional' or 'click-to-quote'
  ecommerceParams: {
    products: number
    categories: number
    paymentMethods: string[]
    inventory: boolean
  }
  
  // Interactive Features
  design: string
  forms: number
  integrations: string[]
  advancedForms: number
  advancedFormsDescription: string
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
  emailCC: string
  notes: string
}

interface PricingItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

const tooltips: Record<string, string> = {
  templates: "Number of unique page templates/designs needed for your website",
  pages: "Total number of pages on your website",
  pageComplexity: "Simple: Basic content pages. Standard: Interactive elements. Complex: Custom functionality",
  platform: "Choose the platform that best fits your needs and technical requirements",
  design: "Select from our pre-designed themes or choose custom design",
  forms: "Number of contact forms, lead capture forms, or other form types needed",
  advancedForms: "Forms with complex logic, multi-step processes, or custom validation",
  calculators: "Interactive tools that perform calculations (e.g., mortgage calculator, ROI calculator)",
  configurators: "Tools that help users configure products or services with custom options",
  accessibility: "None: Basic accessibility. Basic: WCAG 2.1 AA compliance. Full: Advanced accessibility features",
  ecommerce: "Enable e-commerce functionality for selling products or services online",
  crmIntegration: "Connect your website to CRM systems like HubSpot, Salesforce, or others",
  emailMarketing: "Set up email marketing tools and automated campaigns",
  advancedTracking: "Advanced analytics, conversion tracking, and performance monitoring",
  performanceOptimization: "Speed optimization, caching, and performance enhancements"
}

// Tooltip Component
const Tooltip = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <div className="relative inline-block">
      <span
        className="ml-1 text-gray-400 cursor-help hover:text-gray-600"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ?
      </span>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 max-w-xs">
          <div className="whitespace-normal">
            {children}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default function CalculatorFormV2() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    // Project Overview
    projectName: '',
    projectType: 'Marketing Website',
    packageSize: 'Simple',
    projectDescription: '',
    submittedBy: '',
    submitterEmail: '',
    timeline: 'Standard',
    
    // Website Foundation
    pages: 5,
    pageComplexity: 'Simple',
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
      ecommerceType: 'transactional',
      ecommerceParams: {
        products: 0,
        categories: 0,
        paymentMethods: [],
        inventory: false
      },
    
    // Interactive Features
    design: 'Grey Matter',
    forms: 0,
    integrations: [],
    advancedForms: 0,
    advancedFormsDescription: '',
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
  const [showCalculatorTray, setShowCalculatorTray] = useState(false)
  const [showConfiguratorTray, setShowConfiguratorTray] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [showQuoteSuccessPopup, setShowQuoteSuccessPopup] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Calculate pricing when form data changes
  useEffect(() => {
    calculatePricing()
  }, [formData])

  // Load saved email information on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('partner-pricing-email')
    const savedName = localStorage.getItem('partner-pricing-name')
    if (savedEmail || savedName) {
      setFormData(prev => ({
        ...prev,
        submitterEmail: savedEmail || '',
        submittedBy: savedName || ''
      }))
    }
  }, [])

  // Save email information when it changes
  useEffect(() => {
    if (formData.submitterEmail) {
      localStorage.setItem('partner-pricing-email', formData.submitterEmail)
    }
    if (formData.submittedBy) {
      localStorage.setItem('partner-pricing-name', formData.submittedBy)
    }
  }, [formData.submitterEmail, formData.submittedBy])

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
    if (formData.calculators > 0) {
      setShowCalculatorTray(true)
    } else {
      setShowCalculatorTray(false)
    }
  }, [formData.calculators])

  useEffect(() => {
    if (formData.configurators > 0) {
      setShowConfiguratorTray(true)
    } else {
      setShowConfiguratorTray(false)
    }
  }, [formData.configurators])

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
      projectType: 'Website',
      packageSize: 'Simple',
      projectDescription: '',
      submittedBy: '',
      submitterEmail: '',
      timeline: 'Standard',
      emailCC: '',
      templates: 1,
      pages: 5,
      pageComplexity: 'Simple',
      platform: 'WordPress (CMS)',
      customApp: {
        appType: '',
        userAccounts: false,
        database: false,
        apiIntegrations: 0,
        mobileApp: false,
        complexity: 'Simple'
      },
      ecommerce: false,
      ecommerceType: 'transactional',
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
      crmIntegration: false,
      emailMarketing: false,
      advancedTracking: false,
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
      accessibility: 'None',
      performanceOptimization: false,
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
      
      // Show success popup with contact form
      setShowQuoteSuccessPopup(true)
      
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

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Send contact form to john@hdmcincy.com
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'john@hdmcincy.com',
          subject: 'New Quote Inquiry',
          name: contactFormData.name,
          email: contactFormData.email,
          message: contactFormData.message,
          quoteData: formData
        }),
      })

      if (response.ok) {
        alert('Message sent successfully! John will get back to you soon.')
        setShowQuoteSuccessPopup(false)
        setContactFormData({ name: '', email: '', message: '' })
      } else {
        alert('Error sending message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending contact form:', error)
      alert('Error sending message. Please try again.')
    }
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Project Overview</h2>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Website Foundation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Templates
                    <Tooltip id="templates">{tooltips.templates}</Tooltip>
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
                    <Tooltip id="pages">{tooltips.pages}</Tooltip>
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
                    <Tooltip id="pageComplexity">{tooltips.pageComplexity}</Tooltip>
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
                    <Tooltip id="platform">{tooltips.platform}</Tooltip>
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
              </div>

              {/* Calculator Tray */}
              {showCalculatorTray && (
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculator Details</h3>
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Calculators require additional scoping to determine complexity and functionality. 
                      Please describe what type of calculator you need and we will provide a detailed quote during the project planning phase.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your calculator needs:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Mortgage calculator, ROI calculator, pricing calculator, etc. Please describe the inputs, calculations, and outputs needed."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Configurator Tray */}
              {showConfiguratorTray && (
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurator Details</h3>
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Configurators require additional scoping to determine complexity and functionality. 
                      Please describe what type of configurator you need and we will provide a detailed quote during the project planning phase.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your configurator needs:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Product configurator, service configurator, custom quote builder, etc. Please describe the options, rules, and outputs needed."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

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
              <div className="mt-2">
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline
                </label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Standard">Standard (6-8 weeks)</option>
                  <option value="Rush">Rush (4-6 weeks, +20%)</option>
                </select>
              </div>
            </div>

            {/* 3. E-commerce */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">3. E-commerce</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ecommerce"
                  checked={formData.ecommerce}
                  onChange={(e) => {
                    handleInputChange('ecommerce', e.target.checked)
                    setShowEcommerceTray(e.target.checked)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ecommerce" className="ml-2 block text-sm text-gray-700">
                  E-commerce
                  <Tooltip id="ecommerce">{tooltips.ecommerce}</Tooltip>
                </label>
              </div>
            </div>

            {/* 4. Interactive Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Interactive Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design
                    <Tooltip id="design">{tooltips.design}</Tooltip>
                  </label>
                  <select
                    value={formData.design}
                    onChange={(e) => handleInputChange('design', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Grey Matter">Grey Matter</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forms
                    <Tooltip id="forms">{tooltips.forms}</Tooltip>
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
                    Advanced Forms
                    <Tooltip id="advancedForms">{tooltips.advancedForms}</Tooltip>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.advancedForms}
                    onChange={(e) => {
                      handleInputChange('advancedForms', parseInt(e.target.value) || 0)
                      setShowAdvancedFormsTray(parseInt(e.target.value) > 0)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calculators
                    <Tooltip id="calculators">{tooltips.calculators}</Tooltip>
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
                    <Tooltip id="configurators">{tooltips.configurators}</Tooltip>
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
                    <Tooltip id="accessibility">{tooltips.accessibility}</Tooltip>
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
                
                {/* E-commerce Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ecommerceType"
                        value="transactional"
                        checked={formData.ecommerceType === 'transactional'}
                        onChange={(e) => handleInputChange('ecommerceType', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <strong>Transactional Store</strong> - Full e-commerce with payment processing and order fulfillment
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ecommerceType"
                        value="click-to-quote"
                        checked={formData.ecommerceType === 'click-to-quote'}
                        onChange={(e) => handleInputChange('ecommerceType', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <strong>Click-to-Quote</strong> - Product showcase with quote request functionality
                      </span>
                    </label>
                  </div>
                </div>

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
                
                {/* Payment Processor Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> We can discuss payment processor options and integration methods during the project planning phase to ensure the best solution for your needs.
                  </p>
                </div>
              </div>
            )}

            {/* Custom Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Additional Services</h2>
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> If you use this section, we will need to discuss these features and can provide you with a custom price. This will be included in your quote.
                </p>
              </div>

              {/* Technical Services */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Technical Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="crmIntegration"
                      checked={formData.crmIntegration}
                      onChange={(e) => handleInputChange('crmIntegration', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="crmIntegration" className="ml-2 block text-sm text-gray-700">
                      CRM Integration
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailMarketing"
                      checked={formData.emailMarketing}
                      onChange={(e) => handleInputChange('emailMarketing', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailMarketing" className="ml-2 block text-sm text-gray-700">
                      Email Marketing Setup
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="advancedTracking"
                      checked={formData.advancedTracking}
                      onChange={(e) => handleInputChange('advancedTracking', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="advancedTracking" className="ml-2 block text-sm text-gray-700">
                      Advanced Analytics & Tracking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="performanceOptimization"
                      checked={formData.performanceOptimization}
                      onChange={(e) => handleInputChange('performanceOptimization', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="performanceOptimization" className="ml-2 block text-sm text-gray-700">
                      Performance Optimization
                    </label>
                  </div>
                </div>
              </div>

              {/* Design & Branding Services */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Design & Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="logoDesign"
                      checked={formData.designAndBranding.logoDesign}
                      onChange={(e) => handleInputChange('designAndBranding', { ...formData.designAndBranding, logoDesign: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="logoDesign" className="ml-2 block text-sm text-gray-700">
                      Logo Design
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="customDesign"
                      checked={formData.designAndBranding.customDesign}
                      onChange={(e) => handleInputChange('designAndBranding', { ...formData.designAndBranding, customDesign: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="customDesign" className="ml-2 block text-sm text-gray-700">
                      Custom Design
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="photography"
                      checked={formData.designAndBranding.photography}
                      onChange={(e) => handleInputChange('designAndBranding', { ...formData.designAndBranding, photography: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="photography" className="ml-2 block text-sm text-gray-700">
                      Photography
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="brandIdentity"
                      checked={formData.designAndBranding.brandIdentity}
                      onChange={(e) => handleInputChange('designAndBranding', { ...formData.designAndBranding, brandIdentity: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="brandIdentity" className="ml-2 block text-sm text-gray-700">
                      Brand Identity
                    </label>
                  </div>
                </div>
              </div>

              {/* Content & Marketing Services */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Content & Marketing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="copywriting"
                      checked={formData.contentAndMarketing.copywriting}
                      onChange={(e) => handleInputChange('contentAndMarketing', { ...formData.contentAndMarketing, copywriting: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="copywriting" className="ml-2 block text-sm text-gray-700">
                      Copywriting
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="contentStrategy"
                      checked={formData.contentAndMarketing.contentStrategy}
                      onChange={(e) => handleInputChange('contentAndMarketing', { ...formData.contentAndMarketing, contentStrategy: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="contentStrategy" className="ml-2 block text-sm text-gray-700">
                      Content Strategy
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="seoSetup"
                      checked={formData.contentAndMarketing.seoSetup}
                      onChange={(e) => handleInputChange('contentAndMarketing', { ...formData.contentAndMarketing, seoSetup: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="seoSetup" className="ml-2 block text-sm text-gray-700">
                      SEO Setup
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="socialMedia"
                      checked={formData.contentAndMarketing.socialMedia}
                      onChange={(e) => handleInputChange('contentAndMarketing', { ...formData.contentAndMarketing, socialMedia: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="socialMedia" className="ml-2 block text-sm text-gray-700">
                      Social Media Setup
                    </label>
                  </div>
                </div>
              </div>

              {/* Custom Features */}
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Custom Features</h3>
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
                  {formData.timeline === 'Rush' && (
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

        {/* Quote Success Popup with Contact Form */}
        {showQuoteSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quote Submitted Successfully!</h3>
                <button
                  onClick={() => setShowQuoteSuccessPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Thank you for your interest! John will review your quote and get back to you soon. 
                You can also send him a message directly below.
              </p>
              
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    placeholder="Any additional questions or details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuoteSuccessPopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
