import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Partner Pricing Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-tenant pricing calculator platform
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
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
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Quotes
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Admin Panel
              </h2>
              <p className="text-gray-600 mb-6">
                Manage partners, quotes, and pricing configurations
              </p>
              <Link 
                href="/admin"
                className="block w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors"
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
