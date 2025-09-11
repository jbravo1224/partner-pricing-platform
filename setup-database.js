#!/usr/bin/env node

// Simple database setup script
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  try {
    // Clean up existing data
    console.log('🧹 Cleaning existing data...')
    await prisma.quote.deleteMany()
    await prisma.partnerVersion.deleteMany()
    await prisma.partner.deleteMany()
    await prisma.adminSession.deleteMany()

    // ACME Partner
    console.log('📦 Creating ACME Corporation...')
    const acmePartner = await prisma.partner.create({
      data: {
        slug: 'acme',
        name: 'ACME Corporation',
        branding: {
          logoUrl: 'https://example.com/acme-logo.png',
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#f59e0b'
          }
        },
        emailCfg: {
          to: ['sales@acme.com'],
          ccDefaultSubmitter: true,
          allowAdditionalCc: true
        },
        formCfg: {
          sections: [
            {
              title: 'Project Details',
              fields: [
                {
                  type: 'select',
                  name: 'projectType',
                  label: 'Project Type',
                  required: true,
                  options: ['Marketing Website', 'Web App', 'E-commerce']
                },
                {
                  type: 'boolean',
                  name: 'cms',
                  label: 'Content Management System',
                  required: false
                },
                {
                  type: 'multiselect',
                  name: 'integrations',
                  label: 'Integrations',
                  required: false,
                  options: ['CRM', 'Analytics', 'Payment', 'Email Marketing', 'Social Media']
                },
                {
                  type: 'boolean',
                  name: 'rush',
                  label: 'Rush Delivery (25% surcharge)',
                  required: false
                }
              ]
            }
          ]
        },
        pricingCfg: {
          currency: 'USD',
          baseTable: {
            'Marketing Website': 5000,
            'Web App': 20000,
            'E-commerce': 15000
          },
          rules: [
            {
              id: 'base',
              type: 'setSubtotalFromBase',
              value: { op: 'var', args: ['projectType'] }
            },
            {
              id: 'cms',
              type: 'add',
              condition: { op: 'var', args: ['cms'] },
              value: 2500,
              description: 'Content Management System'
            },
            {
              id: 'integrations',
              type: 'add',
              condition: { op: 'gt', args: [{ op: 'length', args: [{ op: 'var', args: ['integrations'] }] }, 0] },
              value: { op: 'multiply', args: [{ op: 'length', args: [{ op: 'var', args: ['integrations'] }] }, 1500] },
              description: 'Integrations'
            },
            {
              id: 'rush',
              type: 'multiply',
              condition: { op: 'var', args: ['rush'] },
              value: 1.25,
              description: 'Rush Delivery'
            }
          ]
        },
        features: {
          customBranding: true,
          analytics: true,
          seo: false
        }
      }
    })

    // Create published version for ACME
    await prisma.partnerVersion.create({
      data: {
        partnerId: acmePartner.id,
        version: 1,
        isDraft: false,
        isPublished: true,
        publishedAt: new Date(),
        branding: acmePartner.branding,
        emailCfg: acmePartner.emailCfg,
        formCfg: acmePartner.formCfg,
        pricingCfg: acmePartner.pricingCfg,
        features: acmePartner.features
      }
    })

    // Blue Rocket Partner
    console.log('🚀 Creating Blue Rocket Agency...')
    const blueRocketPartner = await prisma.partner.create({
      data: {
        slug: 'blue-rocket',
        name: 'Blue Rocket Agency',
        branding: {
          logoUrl: 'https://example.com/blue-rocket-logo.png',
          colors: {
            primary: '#7c3aed',
            secondary: '#1e293b',
            accent: '#06b6d4'
          }
        },
        emailCfg: {
          to: ['quotes@bluerocket.com'],
          ccDefaultSubmitter: false,
          allowAdditionalCc: true
        },
        formCfg: {
          sections: [
            {
              title: 'Project Details',
              fields: [
                {
                  type: 'select',
                  name: 'projectType',
                  label: 'Project Type',
                  required: true,
                  options: ['Marketing Site', 'Corporate Site', 'E-commerce']
                },
                {
                  type: 'select',
                  name: 'cmsTier',
                  label: 'CMS Tier',
                  required: true,
                  options: ['Basic', 'Standard', 'Premium']
                },
                {
                  type: 'multiselect',
                  name: 'languages',
                  label: 'Languages',
                  required: false,
                  options: ['English', 'Spanish', 'French', 'German', 'Italian']
                },
                {
                  type: 'multiselect',
                  name: 'integrations',
                  label: 'Integrations',
                  required: false,
                  options: ['CRM', 'Analytics', 'Payment', 'Email Marketing']
                },
                {
                  type: 'boolean',
                  name: 'seo',
                  label: 'SEO Optimization',
                  required: false
                },
                {
                  type: 'boolean',
                  name: 'rush',
                  label: 'Rush Delivery (20% surcharge)',
                  required: false
                }
              ]
            }
          ]
        },
        pricingCfg: {
          currency: 'USD',
          baseMatrix: {
            'Marketing Site': {
              'Basic': 3000,
              'Standard': 5000,
              'Premium': 8000
            },
            'Corporate Site': {
              'Basic': 5000,
              'Standard': 8000,
              'Premium': 12000
            },
            'E-commerce': {
              'Basic': 8000,
              'Standard': 12000,
              'Premium': 18000
            }
          },
          rules: [
            {
              id: 'base',
              type: 'setSubtotalFromMatrix',
              value: {
                row: { op: 'var', args: ['projectType'] },
                col: { op: 'var', args: ['cmsTier'] }
              }
            },
            {
              id: 'cms',
              type: 'add',
              condition: { op: 'var', args: ['cmsTier'] },
              value: {
                op: 'case',
                args: [
                  { condition: { op: 'eq', args: [{ op: 'var', args: ['cmsTier'] }, 'Basic'] }, value: 1500 },
                  { condition: { op: 'eq', args: [{ op: 'var', args: ['cmsTier'] }, 'Standard'] }, value: 2500 },
                  { condition: { op: 'eq', args: [{ op: 'var', args: ['cmsTier'] }, 'Premium'] }, value: 4000 }
                ]
              },
              description: 'CMS Tier'
            },
            {
              id: 'languages',
              type: 'add',
              condition: { op: 'gt', args: [{ op: 'length', args: [{ op: 'var', args: ['languages'] }] }, 1] },
              value: { op: 'multiply', args: [{ op: 'subtract', args: [{ op: 'length', args: [{ op: 'var', args: ['languages'] }] }, 1] }, 800] },
              description: 'Additional Languages'
            },
            {
              id: 'integrations',
              type: 'add',
              condition: { op: 'gt', args: [{ op: 'length', args: [{ op: 'var', args: ['integrations'] }] }, 0] },
              value: { op: 'multiply', args: [{ op: 'length', args: [{ op: 'var', args: ['integrations'] }] }, 1200] },
              description: 'Integrations'
            },
            {
              id: 'seo',
              type: 'add',
              condition: { op: 'var', args: ['seo'] },
              value: 900,
              description: 'SEO Optimization'
            },
            {
              id: 'rush',
              type: 'multiply',
              condition: { op: 'var', args: ['rush'] },
              value: 1.2,
              description: 'Rush Delivery'
            }
          ]
        },
        features: {
          customBranding: true,
          analytics: true,
          seo: true,
          multiLanguage: true
        }
      }
    })

    // Create published version for Blue Rocket
    await prisma.partnerVersion.create({
      data: {
        partnerId: blueRocketPartner.id,
        version: 1,
        isDraft: false,
        isPublished: true,
        publishedAt: new Date(),
        branding: blueRocketPartner.branding,
        emailCfg: blueRocketPartner.emailCfg,
        formCfg: blueRocketPartner.formCfg,
        pricingCfg: blueRocketPartner.pricingCfg,
        features: blueRocketPartner.features
      }
    })

    console.log('✅ Database setup completed!')
    console.log('📊 Created partners:')
    console.log('   - ACME Corporation (slug: acme)')
    console.log('   - Blue Rocket Agency (slug: blue-rocket)')
    console.log('')
    console.log('🔗 Test your application:')
    console.log('   - Admin panel: /admin (password: admin123)')
    console.log('   - ACME calculator: /p/acme')
    console.log('   - Blue Rocket calculator: /p/blue-rocket')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
