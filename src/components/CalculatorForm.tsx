'use client'

import { useState, useEffect } from 'react'

interface CalculatorFormData {
  projectName: string
  packageSize: string
  projectDescription: string
  submittedBy: string
  submitterEmail: string
  emailCC: string
  templates: number
  pages: number
  platform: string
  ecommerce: boolean
  design: string
  forms: number
  advancedForms: number
  calculators: number
  configurators: number
  accessibility: string
  rush: boolean
  customFeatures: Array<{ name: string; price: number }>
  notes: string
}

interface PricingItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function CalculatorForm() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    projectName: '',
    packageSize: 'Simple',
    projectDescription: '',
    submittedBy: '',
    submitterEmail: '',
    emailCC: '',
    templates: 1,
    pages: 5,
    platform: 'WordPress (CMS)',
    ecommerce: false,
    design: 'HDM',
    forms: 1,
    advancedForms: 0,
    calculators: 0,
    configurators: 0,
    accessibility: 'None',
    rush: false,
    customFeatures: [],
    notes: ''
  })

  const [pricingItems, setPricingItems] = useState<PricingItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [timeline, setTimeline] = useState(30)

  // Calculate pricing when form data changes
  useEffect(() => {
    calculatePricing()
  }, [formData])

  const calculatePricing = () => {
    const items: PricingItem[] = []
    let calculatedSubtotal = 0

    // Templates
    if (formData.templates > 0) {
      items.push({
        description: `${formData.templates} template(s)`,
        quantity: formData.templates,
        unitPrice: 400,
        total: formData.templates * 400
      })
      calculatedSubtotal += formData.templates * 400
    }

    // Pages
    if (formData.pages > 0) {
      items.push({
        description: `${formData.pages} page(s)`,
        quantity: formData.pages,
        unitPrice: 150,
        total: formData.pages * 150
      })
      calculatedSubtotal += formData.pages * 150
    }

    // Platform
    const platformPrices: { [key: string]: number } = {
      'WordPress (CMS)': 800,
      'Custom CMS': 1200,
      'Static Site': 400
    }
    if (platformPrices[formData.platform]) {
      items.push({
        description: formData.platform,
        quantity: 1,
        unitPrice: platformPrices[formData.platform],
        total: platformPrices[formData.platform]
      })
      calculatedSubtotal += platformPrices[formData.platform]
    }

    // Design
    const designPrices: { [key: string]: number } = {
      'HDM': 1200,
      'Custom': 2000,
      'Template': 600
    }
    if (designPrices[formData.design]) {
      items.push({
        description: `Design (${formData.design})`,
        quantity: 1,
        unitPrice: designPrices[formData.design],
        total: designPrices[formData.design]
      })
      calculatedSubtotal += designPrices[formData.design]
    }

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

    // Apply rush discount
    const finalTotal = formData.rush ? calculatedSubtotal * 1.2 : calculatedSubtotal
    setTotal(finalTotal)

    // Calculate timeline
    const baseTimeline = 30
    const rushTimeline = formData.rush ? Math.ceil(baseTimeline * 0.7) : baseTimeline
    setTimeline(rushTimeline)
  }

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      platform: 'WordPress (CMS)',
      ecommerce: false,
      design: 'HDM',
      forms: 1,
      advancedForms: 0,
      calculators: 0,
      configurators: 0,
      accessibility: 'None',
      rush: false,
      customFeatures: [],
      notes: ''
    })
  }

  const handleSubmit = async () => {
    // TODO: Implement quote submission
    console.log('Submitting quote:', { formData, total, timeline })
  }

  const handleExport = () => {
    // TODO: Implement quote export
    console.log('Exporting quote')
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
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
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
                    <option value="HDM">HDM</option>
                    <option value="Custom">Custom</option>
                    <option value="Template">Template</option>
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

            {/* Custom Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom features</h2>
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
      </div>
    </div>
  )
}
