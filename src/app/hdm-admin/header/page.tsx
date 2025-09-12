'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface HeaderSettings {
  logoUrl?: string
  headerBackground?: 'white' | 'dark'
  showTagline?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export default function HeaderSettings() {
  const [settings, setSettings] = useState<HeaderSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          logoUrl: data.logoUrl || '',
          headerBackground: data.headerBackground || 'white',
          showTagline: data.showTagline !== false,
          primaryColor: data.primaryColor || '#0e2c3d',
          secondaryColor: data.secondaryColor || '#5895a5'
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Save each setting individually
      const settingsToSave = [
        { key: 'logoUrl', value: settings.logoUrl },
        { key: 'headerBackground', value: settings.headerBackground },
        { key: 'showTagline', value: settings.showTagline },
        { key: 'primaryColor', value: settings.primaryColor },
        { key: 'secondaryColor', value: settings.secondaryColor }
      ]

      for (const setting of settingsToSave) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(setting)
        })
      }

      setSuccess('Header settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, we'll just store the file name/path
    // In a real implementation, you'd upload to a file storage service
    const logoUrl = `/images/${file.name}`
    setSettings(prev => ({ ...prev, logoUrl }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading header settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Header Settings</h1>
          <p className="text-gray-600">Manage your logo and header appearance across the platform</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Logo Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the URL of your logo image
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a PNG, JPG, or SVG file (recommended: 400x100px)
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showTagline || false}
                      onChange={(e) => setSettings(prev => ({ ...prev, showTagline: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Show tagline "INNOVATE. SCALE. GROW."
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Header Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Background
                  </label>
                  <select
                    value={settings.headerBackground || 'white'}
                    onChange={(e) => setSettings(prev => ({ ...prev, headerBackground: e.target.value as 'white' | 'dark' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="white">White Background</option>
                    <option value="dark">Dark Background</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={settings.primaryColor || '#0e2c3d'}
                    onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={settings.secondaryColor || '#5895a5'}
                    onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
              
              <div className={`border rounded-lg overflow-hidden ${settings.headerBackground === 'dark' ? 'bg-gray-800' : 'bg-white border-gray-200'}`}>
                <div className={`p-6 ${settings.headerBackground === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-center">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="HDM Logo"
                        className="h-12 object-contain"
                        onError={(e) => {
                          // Fallback to text if image fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" style={{color: settings.primaryColor}}>
                          HDM
                        </div>
                        <div className="text-sm font-medium" style={{color: settings.primaryColor}}>
                          HELBLING DIGITAL MEDIA
                        </div>
                        {settings.showTagline && (
                          <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{color: settings.primaryColor}}>
                            INNOVATE. SCALE. GROW.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Back to Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
