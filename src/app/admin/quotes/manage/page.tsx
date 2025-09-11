'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Quote {
  id: string
  projectName: string
  submittedBy: string
  submitterEmail: string
  total: number
  status: 'pending' | 'approved' | 'modified' | 'rejected'
  createdAt: string
  modifiedAt?: string
  notes?: string
  formData: any
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [modificationNotes, setModificationNotes] = useState('')

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      // TODO: Replace with actual API call
      const mockQuotes: Quote[] = [
        {
          id: '1',
          projectName: 'Sample Website',
          submittedBy: 'John Doe',
          submitterEmail: 'john@example.com',
          total: 3500,
          status: 'pending',
          createdAt: new Date().toISOString(),
          formData: {
            templates: 2,
            pages: 8,
            forms: 1
          }
        }
      ]
      setQuotes(mockQuotes)
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (quoteId: string, newStatus: Quote['status']) => {
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

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'modified': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading quotes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
            <Link
              href="/admin/quotes"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Quotes
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quotes List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
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
                        <h3 className="text-lg font-medium text-gray-900">{quote.projectName}</h3>
                        <p className="text-sm text-gray-600">By: {quote.submittedBy}</p>
                        <p className="text-sm text-gray-600">Email: {quote.submitterEmail}</p>
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
                          ${quote.total.toLocaleString()}
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <p className="text-sm text-gray-900">{selectedQuote.projectName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                    <p className="text-sm text-gray-900">{selectedQuote.submittedBy}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedQuote.submitterEmail}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total</label>
                    <p className="text-lg font-semibold text-gray-900">${selectedQuote.total.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedQuote.status}
                      onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value as Quote['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="modified">Modified</option>
                      <option value="rejected">Rejected</option>
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
                      onClick={() => window.print()}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Print Quote
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
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
    </div>
  )
}
