'use client'

import { useState, useEffect } from 'react'

interface AdminSettings {
  features: {
    templatePopup: boolean
    pagePopup: boolean
    calculatorPopup: boolean
    advancedFormsTray: boolean
    ecommerceTray: boolean
    integrationsField: boolean
    customFeaturesWarning: boolean
  }
  design: {
    options: string[]
    defaultOption: string
  }
  pricing: {
    basePrice: number
    baseTemplates: number
    basePages: number
    additionalTemplatePrice: number
    additionalPagePrice: number
    formPrice: number
    advancedFormPrice: number
    calculatorPrice: number
    configuratorPrice: number
    ecommercePrice: number
    rushMultiplier: number
  }
  timeline: {
    baseTimeline: number
    mediumTimeline: number
    largeTimeline: number
    xlargeTimeline: number
    mediumThreshold: number
    largeThreshold: number
    xlargeThreshold: number
    rushMultiplier: number
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>({
    features: {
      templatePopup: true,
      pagePopup: true,
      calculatorPopup: true,
      advancedFormsTray: true,
      ecommerceTray: true,
      integrationsField: true,
      customFeaturesWarning: true
    },
    design: {
      options: ['Grey Matter', 'HDM', 'Transpose', 'Other'],
      defaultOption: 'Grey Matter'
    },
    pricing: {
      basePrice: 2500,
      baseTemplates: 1,
      basePages: 5,
      additionalTemplatePrice: 400,
      additionalPagePrice: 150,
      formPrice: 100,
      advancedFormPrice: 300,
      calculatorPrice: 500,
      configuratorPrice: 800,
      ecommercePrice: 1500,
      rushMultiplier: 1.2
    },
    timeline: {
      baseTimeline: 20,
      mediumTimeline: 30,
      largeTimeline: 45,
      xlargeTimeline: 60,
      mediumThreshold: 12,
      largeThreshold: 25,
      xlargeThreshold: 35,
      rushMultiplier: 0.7
    }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('admin-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleFeatureToggle = (feature: keyof AdminSettings['features']) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }))
  }

  const handleDesignOptionChange = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      design: {
        ...prev.design,
        options: prev.design.options.map((option, i) => i === index ? value : option)
      }
    }))
  }

  const addDesignOption = () => {
    setSettings(prev => ({
      ...prev,
      design: {
        ...prev.design,
        options: [...prev.design.options, 'New Option']
      }
    }))
  }

  const removeDesignOption = (index: number) => {
    setSettings(prev => ({
      ...prev,
      design: {
        ...prev.design,
        options: prev.design.options.filter((_, i) => i !== index)
      }
    }))
  }

  const handlePricingChange = (field: keyof AdminSettings['pricing'], value: number) => {
    setSettings(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }))
  }

  const handleTimelineChange = (field: keyof AdminSettings['timeline'], value: number) => {
    setSettings(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: value
      }
    }))
  }

  const saveSettings = () => {
    localStorage.setItem('admin-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <button
              onClick={saveSettings}
              className={`px-4 py-2 rounded-md font-medium ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Toggles */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h2>
            <div className="space-y-4">
              {Object.entries(settings.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => handleFeatureToggle(feature as keyof AdminSettings['features'])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Design Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Design Options</h2>
            <div className="space-y-3">
              {settings.design.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleDesignOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeDesignOption(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addDesignOption}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                + Add Design Option
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Option</label>
              <select
                value={settings.design.defaultOption}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  design: { ...prev.design, defaultOption: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {settings.design.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                <input
                  type="number"
                  value={settings.pricing.basePrice}
                  onChange={(e) => handlePricingChange('basePrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Templates</label>
                <input
                  type="number"
                  value={settings.pricing.baseTemplates}
                  onChange={(e) => handlePricingChange('baseTemplates', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Pages</label>
                <input
                  type="number"
                  value={settings.pricing.basePages}
                  onChange={(e) => handlePricingChange('basePages', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Template Price</label>
                <input
                  type="number"
                  value={settings.pricing.additionalTemplatePrice}
                  onChange={(e) => handlePricingChange('additionalTemplatePrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Page Price</label>
                <input
                  type="number"
                  value={settings.pricing.additionalPagePrice}
                  onChange={(e) => handlePricingChange('additionalPagePrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Price</label>
                <input
                  type="number"
                  value={settings.pricing.formPrice}
                  onChange={(e) => handlePricingChange('formPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advanced Form Price</label>
                <input
                  type="number"
                  value={settings.pricing.advancedFormPrice}
                  onChange={(e) => handlePricingChange('advancedFormPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calculator Price</label>
                <input
                  type="number"
                  value={settings.pricing.calculatorPrice}
                  onChange={(e) => handlePricingChange('calculatorPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Configurator Price</label>
                <input
                  type="number"
                  value={settings.pricing.configuratorPrice}
                  onChange={(e) => handlePricingChange('configuratorPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-commerce Price</label>
                <input
                  type="number"
                  value={settings.pricing.ecommercePrice}
                  onChange={(e) => handlePricingChange('ecommercePrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rush Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.pricing.rushMultiplier}
                  onChange={(e) => handlePricingChange('rushMultiplier', parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Timeline Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Timeline (days)</label>
                <input
                  type="number"
                  value={settings.timeline.baseTimeline}
                  onChange={(e) => handleTimelineChange('baseTimeline', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium Timeline (days)</label>
                <input
                  type="number"
                  value={settings.timeline.mediumTimeline}
                  onChange={(e) => handleTimelineChange('mediumTimeline', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Large Timeline (days)</label>
                <input
                  type="number"
                  value={settings.timeline.largeTimeline}
                  onChange={(e) => handleTimelineChange('largeTimeline', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X-Large Timeline (days)</label>
                <input
                  type="number"
                  value={settings.timeline.xlargeTimeline}
                  onChange={(e) => handleTimelineChange('xlargeTimeline', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium Threshold (pages)</label>
                <input
                  type="number"
                  value={settings.timeline.mediumThreshold}
                  onChange={(e) => handleTimelineChange('mediumThreshold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Large Threshold (pages)</label>
                <input
                  type="number"
                  value={settings.timeline.largeThreshold}
                  onChange={(e) => handleTimelineChange('largeThreshold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X-Large Threshold (pages)</label>
                <input
                  type="number"
                  value={settings.timeline.xlargeThreshold}
                  onChange={(e) => handleTimelineChange('xlargeThreshold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rush Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.timeline.rushMultiplier}
                  onChange={(e) => handleTimelineChange('rushMultiplier', parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
