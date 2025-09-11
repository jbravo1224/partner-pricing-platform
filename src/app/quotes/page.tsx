'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserQuote {
  id: string
  projectName: string
  total: number
  status: 'pending' | 'approved' | 'modified' | 'rejected'
  createdAt: string
  modifiedAt?: string
  notes?: string
  formData: any
}

export default function UserQuotes() {
  const [quotes, setQuotes] = useState<UserQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Get user email from localStorage or prompt for it
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
      loadUserQuotes(savedEmail)
    } else {
      const email = prompt('Please enter your email to view your quotes:')
      if (email) {
        setUserEmail(email)
        localStorage.setItem('userEmail', email)
        loadUserQuotes(email)
      }
    }
  }, [])

  const loadUserQuotes = async (email: string) => {
    try {
      // TODO: Replace with actual API call
      const mockQuotes: UserQuote[] = [
        {
          id: '1',
          projectName: 'My Website Project',
          total: 3500,
          status: 'pending',
          createdAt: new Date().toISOString(),
          formData: {
            templates: 2,
            pages: 8,
            forms: 1
          }
        },
        {
          id: '2',
          projectName: 'E-commerce Site',
          total: 5500,
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          formData: {
            templates: 3,
            pages: 15,
            ecommerce: true
          }
        }
      ]
      setQuotes(mockQuotes)
    } catch (error) {
      console.error('Error loading user quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: UserQuote['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'modified': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: UserQuote['status']) => {
    switch (status) {
      case 'pending': return 'Under Review'
      case 'approved': return 'Approved'
      case 'modified': return 'Modified by Admin'
      case 'rejected': return 'Not Approved'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your quotes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Quotes</h1>
              <p className="text-gray-600 mt-1">Email: {userEmail}</p>
            </div>
            <Link
              href="/calculator"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Quote
            </Link>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Quotes Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any quotes yet. Create your first quote to get started!
            </p>
            <Link
              href="/calculator"
              className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Quote
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{quote.projectName}</h2>
                    <p className="text-gray-600">
                      Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                    {quote.modifiedAt && (
                      <p className="text-gray-600">
                        Last Modified: {new Date(quote.modifiedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusText(quote.status)}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      ${quote.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {quote.notes && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-semibold text-blue-900 mb-2">Admin Notes:</h3>
                    <p className="text-blue-800">{quote.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Templates: {quote.formData.templates || 0}</p>
                      <p>Pages: {quote.formData.pages || 0}</p>
                      <p>Forms: {quote.formData.forms || 0}</p>
                      {quote.formData.ecommerce && <p>E-commerce: Yes</p>}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-900 mb-2">Quote ID</h3>
                    <p className="text-sm text-gray-600 font-mono">{quote.id}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-900 mb-2">Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.print()}
                        className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Print Quote
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement email functionality
                          alert('Quote details sent to your email!')
                        }}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Email Quote
                      </button>
                    </div>
                  </div>
                </div>

                {quote.status === 'modified' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-semibold text-yellow-900 mb-2">Quote Modified</h3>
                    <p className="text-yellow-800">
                      This quote has been modified by our team. Please review the changes and contact us if you have any questions.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm mb-2">
                Have questions about your quote? Our team is here to help.
              </p>
              <button
                onClick={() => {
                  // TODO: Implement contact functionality
                  alert('Contact form coming soon!')
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Create New Quote</h3>
              <p className="text-gray-600 text-sm mb-2">
                Need a quote for a different project? Start a new estimate.
              </p>
              <Link
                href="/calculator"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                New Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
