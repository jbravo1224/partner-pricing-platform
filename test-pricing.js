// Simple test to verify pricing calculations
// This is a simplified version of the pricing engine for testing

function evaluateExpression(expression, inputs) {
  if (typeof expression === 'number' || typeof expression === 'string') {
    return expression
  }

  if (!expression || typeof expression !== 'object') {
    return expression
  }

  const { op, args } = expression

  switch (op) {
    case 'var':
      return inputs[args[0]]
    case 'add':
      return args.reduce((sum, arg) => sum + evaluateExpression(arg, inputs), 0)
    case 'multiply':
      return args.reduce((product, arg) => product * evaluateExpression(arg, inputs), 1)
    case 'subtract':
      return evaluateExpression(args[0], inputs) - evaluateExpression(args[1], inputs)
    case 'gte':
      return evaluateExpression(args[0], inputs) >= evaluateExpression(args[1], inputs)
    case 'lte':
      return evaluateExpression(args[0], inputs) <= evaluateExpression(args[1], inputs)
    case 'gt':
      return evaluateExpression(args[0], inputs) > evaluateExpression(args[1], inputs)
    case 'lt':
      return evaluateExpression(args[0], inputs) < evaluateExpression(args[1], inputs)
    case 'eq':
      return evaluateExpression(args[0], inputs) === evaluateExpression(args[1], inputs)
    case 'length':
      const arr = evaluateExpression(args[0], inputs)
      return Array.isArray(arr) ? arr.length : 0
    case 'in':
      const value = evaluateExpression(args[0], inputs)
      const array = evaluateExpression(args[1], inputs)
      return Array.isArray(array) && array.includes(value)
    case 'case':
      for (const caseItem of args) {
        if (evaluateExpression(caseItem.condition, inputs)) {
          return evaluateExpression(caseItem.value, inputs)
        }
      }
      return 0
    default:
      return expression
  }
}

function calculatePricing(config, inputs) {
  const lineItems = []
  let subtotal = 0

  // Process regular rules first
  const regularRules = config.rules.filter(rule => rule.type !== 'multiply')
  const multiplierRules = config.rules.filter(rule => rule.type === 'multiply')

  for (const rule of regularRules) {
    let shouldApply = true
    if (rule.condition) {
      shouldApply = evaluateExpression(rule.condition, inputs)
    }

    if (shouldApply) {
      let amount = 0
      
      switch (rule.type) {
        case 'setSubtotalFromBase':
          const key = evaluateExpression(rule.value, inputs)
          amount = config.baseTable[key] || 0
          lineItems.push({ description: `Base: ${key}`, amount })
          break
          
        case 'setSubtotalFromMatrix':
          const rowKey = evaluateExpression(rule.value.row, inputs)
          const colKey = evaluateExpression(rule.value.col, inputs)
          amount = config.baseMatrix[rowKey]?.[colKey] || 0
          lineItems.push({ description: `Base: ${rowKey} × ${colKey}`, amount })
          break
          
        case 'add':
          amount = evaluateExpression(rule.value, inputs)
          lineItems.push({ description: rule.description || 'Additional charge', amount })
          break
      }
      
      subtotal += amount
    }
  }

  // Apply multipliers
  let total = subtotal
  for (const rule of multiplierRules) {
    if (evaluateExpression(rule.condition, inputs)) {
      const multiplier = evaluateExpression(rule.value, inputs)
      total = total * multiplier
      
      lineItems.push({
        description: rule.description || 'Multiplier',
        amount: total - subtotal
      })
    }
  }

  return {
    subtotal,
    total,
    currency: config.currency,
    lineItems
  }
}

// Test Cases
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

// Run tests
console.log('Running acceptance tests...\n')

// Test 1: ACME Marketing Website + CMS + 2 integrations, no rush
const test1 = calculatePricing(acmeConfig, {
  projectType: 'Marketing Website',
  cms: true,
  integrations: ['CRM', 'Analytics'],
  rush: false
})
console.log('Test 1: ACME Marketing Website + CMS + 2 integrations, no rush')
console.log(`Expected: $10,500`)
console.log(`Actual: $${test1.total.toLocaleString()}`)
console.log(`Status: ${test1.total === 10500 ? '✅ PASS' : '❌ FAIL'}`)
console.log('Line items:')
test1.lineItems.forEach(item => {
  console.log(`  - ${item.description}: $${item.amount.toLocaleString()}`)
})
console.log('')

// Test 2: ACME Web App + rush
const test2 = calculatePricing(acmeConfig, {
  projectType: 'Web App',
  cms: false,
  integrations: [],
  rush: true
})
console.log('Test 2: ACME Web App + rush')
console.log(`Expected: $25,000`)
console.log(`Actual: $${test2.total.toLocaleString()}`)
console.log(`Status: ${test2.total === 25000 ? '✅ PASS' : '❌ FAIL'}`)
console.log('Line items:')
test2.lineItems.forEach(item => {
  console.log(`  - ${item.description}: $${item.amount.toLocaleString()}`)
})
console.log('')

// Test 3: Blue Rocket Marketing Site × Standard + CMS + SEO + 3 languages + 1 integration + rush
const test3 = calculatePricing(blueRocketConfig, {
  projectType: 'Marketing Site',
  cmsTier: 'Standard',
  languages: ['English', 'Spanish', 'French'],
  integrations: ['CRM'],
  seo: true,
  rush: true
})
console.log('Test 3: Blue Rocket Marketing Site × Standard + CMS + SEO + 3 languages + 1 integration + rush')
console.log(`Expected: $18,240`)
console.log(`Actual: $${test3.total.toLocaleString()}`)
console.log(`Status: ${test3.total === 18240 ? '✅ PASS' : '❌ FAIL'}`)
console.log('Line items:')
test3.lineItems.forEach(item => {
  console.log(`  - ${item.description}: $${item.amount.toLocaleString()}`)
})
console.log('')

console.log('Acceptance tests completed!')
