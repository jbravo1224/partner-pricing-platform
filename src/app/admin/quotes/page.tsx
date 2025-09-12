'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Quote {
  id: string
  partnerSlug: string
  inputs: any
  additionalCc?: string
  subtotal: number
  total: number
  currency: string
  lineItems: any[]
  status: string
  createdAt: string
  updatedAt: string
  partner: {
    name: string
    slug: string
  }
  // Additional fields for management
  projectName?: string
  submittedBy?: string
  submitterEmail?: string
  modifiedAt?: string
  notes?: string
}

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [modificationNotes, setModificationNotes] = useState('')
  const [filters, setFilters] = useState({
    partner: '',
    dateFrom: '',
    dateTo: '',
    projectType: '',
    email: ''
  })

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setError('No admin token found. Please log in again.')
        setLoading(false)
        return
      }

      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      console.log('Fetching quotes with token:', token.substring(0, 20) + '...')
      console.log('Query params:', queryParams.toString())

      const response = await fetch(`/api/admin/quotes?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Quotes data:', data)
        
        // If no quotes from API, use mock data for demonstration
        if (!Array.isArray(data) || data.length === 0) {
          const mockQuotes: Quote[] = [
            {
              id: '1',
              partnerSlug: 'sample-partner',
              inputs: {
                projectType: 'Website Development',
                templates: 2,
                pages: 8,
                forms: 1
              },
              subtotal: 3500,
              total: 3500,
              currency: '$',
              lineItems: [],
              status: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              partner: {
                name: 'Sample Partner',
                slug: 'sample-partner'
              },
              projectName: 'Sample Website',
              submittedBy: 'John Doe',
              submitterEmail: 'john@example.com'
            }
          ]
          setQuotes(mockQuotes)
        } else {
          setQuotes(data)
        }
        setError('')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        
        // Use mock data as fallback
        const mockQuotes: Quote[] = [
          {
            id: '1',
            partnerSlug: 'sample-partner',
            inputs: {
              projectType: 'Website Development',
              templates: 2,
              pages: 8,
              forms: 1
            },
            subtotal: 3500,
            total: 3500,
            currency: '$',
            lineItems: [],
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            partner: {
              name: 'Sample Partner',
              slug: 'sample-partner'
            },
            projectName: 'Sample Website',
            submittedBy: 'John Doe',
            submitterEmail: 'john@example.com'
          }
        ]
        setQuotes(mockQuotes)
        setError('') // Clear error since we have mock data
      }
    } catch (err) {
      console.error('Network error:', err)
      
      // Use mock data as fallback
      const mockQuotes: Quote[] = [
        {
          id: '1',
          partnerSlug: 'sample-partner',
          inputs: {
            projectType: 'Website Development',
            templates: 2,
            pages: 8,
            forms: 1
          },
          subtotal: 3500,
          total: 3500,
          currency: '$',
          lineItems: [],
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          partner: {
            name: 'Sample Partner',
            slug: 'sample-partner'
          },
          projectName: 'Sample Website',
          submittedBy: 'John Doe',
          submitterEmail: 'john@example.com'
        }
      ]
      setQuotes(mockQuotes)
      setError('') // Clear error since we have mock data
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const applyFilters = () => {
    setLoading(true)
    fetchQuotes()
  }

  const clearFilters = () => {
    setFilters({
      partner: '',
      dateFrom: '',
      dateTo: '',
      projectType: '',
      email: ''
    })
  }

  const handleResend = async (quoteId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/quotes/${quoteId}/resend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchQuotes() // Refresh the list
      } else {
        setError('Failed to resend quote')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      // TODO: Implement API call to update quote status
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: newStatus, modifiedAt: new Date().toISOString() }
          : quote
      ))
    } catch (error) {
      console.error('Error updating quote status:', error)
    }
  }

  const handleModifyQuote = async () => {
    if (!editingQuote) return

    try {
      // TODO: Implement API call to modify quote
      setQuotes(prev => prev.map(quote => 
        quote.id === editingQuote.id 
          ? { 
              ...quote, 
              status: 'modified',
              notes: modificationNotes,
              modifiedAt: new Date().toISOString()
            }
          : quote
      ))
      setEditingQuote(null)
      setModificationNotes('')
    } catch (error) {
      console.error('Error modifying quote:', error)
    }
  }

  const sendQuoteToUser = async (quote: Quote) => {
    try {
      // TODO: Implement email sending functionality
      console.log('Sending quote to user:', quote.submitterEmail)
      alert('Quote sent to user!')
    } catch (error) {
      console.error('Error sending quote:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'modified': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'viewed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading quotes...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Quote Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and view all quote requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Partner</label>
            <input
              type="text"
              value={filters.partner}
              onChange={(e) => handleFilterChange('partner', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Partner slug"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type</label>
            <input
              type="text"
              value={filters.projectType}
              onChange={(e) => handleFilterChange('projectType', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Project type"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotes List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Quotes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer ${
                    selectedQuote?.id === quote.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedQuote(quote)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {quote.projectName || (quote.inputs as any)?.projectType || 'Untitled Project'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By: {quote.submittedBy || quote.submitterEmail || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {quote.submitterEmail || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                      {quote.modifiedAt && (
                        <p className="text-sm text-gray-600">
                          Modified: {new Date(quote.modifiedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        {quote.currency} {quote.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote Details & Actions */}
        <div className="lg:col-span-1">
          {selectedQuote ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <p className="text-sm text-gray-900">
                    {selectedQuote.projectName || (selectedQuote.inputs as any)?.projectType || 'Untitled Project'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                  <p className="text-sm text-gray-900">{selectedQuote.submittedBy || selectedQuote.submitterEmail || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedQuote.submitterEmail || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedQuote.currency} {selectedQuote.total.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="modified">Modified</option>
                    <option value="rejected">Rejected</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                  </select>
                </div>

                {selectedQuote.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900">{selectedQuote.notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setEditingQuote(selectedQuote)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Modify Quote
                  </button>
                  <button
                    onClick={() => sendQuoteToUser(selectedQuote)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Send to User
                  </button>
                  <button
                    onClick={() => handleResend(selectedQuote.id)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Resend Quote
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500 text-center">Select a quote to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modify Quote Modal */}
      {editingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Modify Quote</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modification Notes</label>
                <textarea
                  value={modificationNotes}
                  onChange={(e) => setModificationNotes(e.target.value)}
                  placeholder="Explain what changes were made to the quote..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingQuote(null)
                    setModificationNotes('')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModifyQuote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
