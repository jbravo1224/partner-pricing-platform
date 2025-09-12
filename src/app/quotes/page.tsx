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
      if (email && email.trim()) {
        setUserEmail(email)
        localStorage.setItem('userEmail', email)
        loadUserQuotes(email)
      } else {
        // User cancelled or entered empty email, redirect back to home
        setLoading(false)
        window.location.href = '/'
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
        }
      ]
      setQuotes(mockQuotes)
    } catch (error) {
      console.error('Error loading user quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async (quote: UserQuote) => {
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      
      // Type assertion for jsPDF
      const doc = new (jsPDF as any)()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Header with Logo
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(14, 44, 61) // HDM Primary color #0e2c3d
      doc.text('HDM', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(14, 44, 61) // HDM Primary color #0e2c3d
      doc.text('HELBLING DIGITAL MEDIA', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      
      doc.setFontSize(8)
      doc.setTextColor(14, 44, 61) // HDM Primary color #0e2c3d
      doc.text('INNOVATE. SCALE. GROW.', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Quote title
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0) // Black
      doc.text('Website Quote', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 12

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Client: ${userEmail}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      // Quote Details
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(quote.projectName, 20, yPosition)
      yPosition += 12

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Quote ID: ${quote.id}`, 20, yPosition)
      yPosition += 8
      doc.text(`Submitted: ${new Date(quote.createdAt).toLocaleDateString()}`, 20, yPosition)
      yPosition += 8
      doc.text(`Status: ${quote.status}`, 20, yPosition)
      yPosition += 15

      // Project Details
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Project Details', 20, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Templates: ${quote.formData.templates || 0}`, 20, yPosition)
      yPosition += 8
      doc.text(`Pages: ${quote.formData.pages || 0}`, 20, yPosition)
      yPosition += 8
      doc.text(`Forms: ${quote.formData.forms || 0}`, 20, yPosition)
      if (quote.formData.ecommerce) {
        doc.text('E-commerce: Yes', 20, yPosition)
        yPosition += 8
      }
      yPosition += 15

      // Total
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total: $${quote.total.toLocaleString()}`, 20, yPosition)
      yPosition += 20

      // Footer
      const footerY = pageHeight - 30
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(14, 44, 61) // HDM Primary color #0e2c3d
      doc.text('HDM HELBLING DIGITAL MEDIA | Website Development & Design', pageWidth / 2, footerY, { align: 'center' })
      doc.setTextColor(0, 0, 0) // Black
      doc.text('Email: john@hdmcincy.com | Phone: 513-668-7344', pageWidth / 2, footerY + 8, { align: 'center' })
      doc.text('This quote is valid for 30 days from the date of generation.', pageWidth / 2, footerY + 16, { align: 'center' })

      // Save the PDF
      doc.save(`quote-${quote.id}-${quote.projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold mb-1" style={{color: '#0e2c3d'}}>HDM</div>
              <div className="text-sm font-medium" style={{color: '#0e2c3d'}}>HELBLING DIGITAL MEDIA</div>
              <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{color: '#0e2c3d'}}>INNOVATE. SCALE. GROW.</div>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="hdm-card p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Quotes</h1>
                <p className="text-gray-600 mt-1">Email: {userEmail}</p>
              </div>
              <Link
                href="/calculator"
                className="hdm-button-primary px-4 py-2 rounded-md transition-colors"
              >
                Create New Quote
              </Link>
            </div>
          </div>

          {quotes.length === 0 ? (
            <div className="hdm-card p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No Quotes Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't submitted any quotes yet. Create your first quote to get started!
              </p>
              <Link
                href="/calculator"
                className="inline-flex px-6 py-3 hdm-button-primary rounded-md transition-colors"
              >
                Create Your First Quote
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {quotes.map((quote) => (
                <div key={quote.id} className="hdm-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{quote.projectName}</h2>
                      <p className="text-gray-600">
                        Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        ${quote.total.toLocaleString()}
                      </p>
                      <button
                        onClick={() => generatePDF(quote)}
                        className="mt-2 px-3 py-1 hdm-button-primary text-sm rounded-md transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
