import Link from 'next/link'
import HDMLogo from '@/components/HDMLogo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <HDMLogo size="large" className="justify-center" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Partner Pricing Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional website development and digital media solutions
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="hdm-card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Partner Calculators
              </h2>
              <p className="text-gray-600 mb-6">
                Access your personalized project calculator through your partner link
              </p>
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Calculators are partner-specific. Please use the link provided by your partner to access your personalized calculator.
                  </p>
                </div>
                <Link 
                  href="/quotes"
                  className="block w-full hdm-button-primary text-center py-3 px-6 rounded-lg transition-colors"
                >
                  View My Quotes
                </Link>
              </div>
            </div>
            
            <div className="hdm-card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Admin Panel
              </h2>
              <p className="text-gray-600 mb-6">
                Manage partners, quotes, and pricing configurations
              </p>
              <Link 
                href="/admin"
                className="block w-full hdm-button-secondary text-center py-3 px-6 rounded-lg transition-colors"
              >
                Access Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
