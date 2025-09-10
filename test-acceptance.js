// Test script to verify acceptance criteria
// Run with: node test-acceptance.js

const { calculatePricing } = require('./src/lib/pricing-engine.ts')

// ACME Configuration
const acmeConfig = {
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
}

// Blue Rocket Configuration
const blueRocketConfig = {
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
}

// Test Cases
const testCases = [
  {
    name: 'ACME Marketing Website + CMS + 2 integrations, no rush',
    config: acmeConfig,
    inputs: {
      projectType: 'Marketing Website',
      cms: true,
      integrations: ['CRM', 'Analytics'],
      rush: false
    },
    expected: 10500
  },
  {
    name: 'ACME Web App + rush',
    config: acmeConfig,
    inputs: {
      projectType: 'Web App',
      cms: false,
      integrations: [],
      rush: true
    },
    expected: 25000
  },
  {
    name: 'Blue Rocket Marketing Site × Standard + CMS + SEO + 3 languages + 1 integration + rush',
    config: blueRocketConfig,
    inputs: {
      projectType: 'Marketing Site',
      cmsTier: 'Standard',
      languages: ['English', 'Spanish', 'French'],
      integrations: ['CRM'],
      seo: true,
      rush: true
    },
    expected: 18240
  }
]

// Run tests
console.log('Running acceptance tests...\n')

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`)
  
  try {
    const result = calculatePricing(testCase.config, testCase.inputs)
    const passed = result.total === testCase.expected
    
    console.log(`  Expected: $${testCase.expected.toLocaleString()}`)
    console.log(`  Actual:   $${result.total.toLocaleString()}`)
    console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`)
    
    if (!passed) {
      console.log(`  Line items:`)
      result.lineItems.forEach(item => {
        console.log(`    - ${item.description}: $${item.amount.toLocaleString()}`)
      })
    }
  } catch (error) {
    console.log(`  Status:   ❌ ERROR - ${error.message}`)
  }
  
  console.log('')
})

console.log('Acceptance tests completed!')
