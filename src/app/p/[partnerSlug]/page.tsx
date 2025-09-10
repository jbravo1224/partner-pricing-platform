'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormField, FormSection } from '@/types'

interface Partner {
  id: string
  slug: string
  name: string
  branding: any
  emailCfg: any
  formCfg: {
    sections: FormSection[]
  }
  pricingCfg: any
}

export default function PartnerCalculator() {
  const params = useParams()
  const partnerSlug = params.partnerSlug as string
  
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [quoteResult, setQuoteResult] = useState<any>(null)

  useEffect(() => {
    fetchPartner()
  }, [partnerSlug])

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/public/partner/${partnerSlug}`)
      if (response.ok) {
        const data = await response.json()
        setPartner(data)
        
        // Initialize form data with default values
        const initialData: Record<string, any> = {}
        data.formCfg.sections.forEach((section: FormSection) => {
          section.fields.forEach((field: FormField) => {
            if (field.type === 'boolean') {
              initialData[field.name] = false
            } else if (field.type === 'multiselect') {
              initialData[field.name] = []
            } else {
              initialData[field.name] = ''
            }
          })
        })
        setFormData(initialData)
      } else {
        setError('Partner not found')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/public/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerSlug,
          inputs: formData
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setQuoteResult(data)
      } else {
        setError(data.error || 'Failed to generate quote')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        )
      
      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case 'multiselect':
        return (
          <div className="mt-1 space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleInputChange(field.name, [...currentValues, option])
                    } else {
                      handleInputChange(field.name, currentValues.filter((v: string) => v !== option))
                    }
                  }}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">{field.label}</span>
          </label>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading calculator...</div>
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Partner Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (quoteResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quote Generated Successfully!
              </h1>
              <p className="text-gray-600">
                Your quote has been sent to {partner.name}
              </p>
            </div>
            
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quote Summary</h2>
              <div className="space-y-4">
                {quoteResult.lineItems.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">{item.description}</span>
                    <span className="font-medium">
                      {quoteResult.currency} {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {quoteResult.currency} {quoteResult.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center">
              {partner.branding?.logoUrl && (
                <img
                  src={partner.branding.logoUrl}
                  alt={partner.name}
                  className="h-12 w-12 rounded-lg mr-4"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {partner.name} Pricing Calculator
                </h1>
                <p className="text-gray-600">
                  Get an instant quote for your project
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8">
            {partner.formCfg.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.name}>
                      {field.type !== 'boolean' && (
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Generating Quote...' : 'Get Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
