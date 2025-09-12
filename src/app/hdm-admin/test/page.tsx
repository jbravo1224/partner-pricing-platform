'use client'

import { useEffect, useState } from 'react'

export default function AdminTest() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const auth = localStorage.getItem('adminAuthenticated')
    setIsAuthenticated(!!(token && auth))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminAuthenticated')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p>You need to log in first.</p>
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
        <p className="mb-4">✅ Authentication is working!</p>
        <p className="mb-4">Token: {localStorage.getItem('adminToken')}</p>
        <p className="mb-4">Auth Flag: {localStorage.getItem('adminAuthenticated')}</p>
        
        <div className="space-y-2">
          <a 
            href="/admin" 
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Admin Dashboard
          </a>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
