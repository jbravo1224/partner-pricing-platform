import { PricingConfig, PricingResult, LineItem } from '@/types'

export class PricingEngine {
  private config: PricingConfig
  private inputs: Record<string, any>

  constructor(config: PricingConfig, inputs: Record<string, any>) {
    this.config = config
    this.inputs = inputs
  }

  calculate(): PricingResult {
    const lineItems: LineItem[] = []
    let subtotal = 0

    // Process rules in order, but handle multipliers separately
    const regularRules = this.config.rules.filter(rule => rule.type !== 'multiply')
    const multiplierRules = this.config.rules.filter(rule => rule.type === 'multiply')

    // Process regular rules first
    for (const rule of regularRules) {
      const result = this.processRule(rule)
      if (result) {
        lineItems.push(result)
        subtotal += result.amount
      }
    }

    // Apply multipliers to the subtotal
    let total = subtotal
    for (const rule of multiplierRules) {
      if (this.checkCondition(rule.condition)) {
        const multiplier = this.evaluateExpression(rule.value)
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
      currency: this.config.currency,
      lineItems
    }
  }

  private processRule(rule: any): LineItem | null {
    switch (rule.type) {
      case 'setSubtotalFromBase':
        return this.setSubtotalFromBase(rule)
      case 'setSubtotalFromMatrix':
        return this.setSubtotalFromMatrix(rule)
      case 'add':
        return this.addAmount(rule)
      case 'multiply':
        return this.multiplyAmount(rule)
      default:
        return null
    }
  }

  private setSubtotalFromBase(rule: any): LineItem | null {
    if (!this.config.baseTable) return null
    
    const key = this.evaluateExpression(rule.value)
    const amount = this.config.baseTable[key] || 0
    
    return {
      description: `Base: ${key}`,
      amount
    }
  }

  private setSubtotalFromMatrix(rule: any): LineItem | null {
    if (!this.config.baseMatrix) return null
    
    const rowKey = this.evaluateExpression(rule.value?.row || '')
    const colKey = this.evaluateExpression(rule.value?.col || '')
    
    const amount = this.config.baseMatrix[rowKey]?.[colKey] || 0
    
    return {
      description: `Base: ${rowKey} × ${colKey}`,
      amount
    }
  }

  private addAmount(rule: any): LineItem | null {
    if (!this.checkCondition(rule.condition)) return null
    
    const amount = this.evaluateExpression(rule.value)
    
    return {
      description: rule.description || 'Additional charge',
      amount
    }
  }

  private multiplyAmount(rule: any): LineItem | null {
    if (!this.checkCondition(rule.condition)) return null
    
    const multiplier = this.evaluateExpression(rule.value)
    // This would typically multiply the current subtotal
    // For now, we'll return a line item with the multiplier
    return {
      description: rule.description || 'Multiplier',
      amount: multiplier
    }
  }

  private checkCondition(condition: any): boolean {
    if (!condition) return true
    
    return this.evaluateExpression(condition)
  }

  private evaluateExpression(expression: any): any {
    if (typeof expression === 'number' || typeof expression === 'string') {
      return expression
    }

    if (!expression || typeof expression !== 'object') {
      return expression
    }

    const { op, args } = expression

    switch (op) {
      case 'var':
        return this.getVariable(args[0])
      case 'add':
        return args.reduce((sum: number, arg: any) => sum + this.evaluateExpression(arg), 0)
      case 'multiply':
        return args.reduce((product: number, arg: any) => product * this.evaluateExpression(arg), 1)
      case 'subtract':
        return this.evaluateExpression(args[0]) - this.evaluateExpression(args[1])
      case 'gte':
        return this.evaluateExpression(args[0]) >= this.evaluateExpression(args[1])
      case 'lte':
        return this.evaluateExpression(args[0]) <= this.evaluateExpression(args[1])
      case 'gt':
        return this.evaluateExpression(args[0]) > this.evaluateExpression(args[1])
      case 'lt':
        return this.evaluateExpression(args[0]) < this.evaluateExpression(args[1])
      case 'eq':
        return this.evaluateExpression(args[0]) === this.evaluateExpression(args[1])
      case 'length':
        const arr = this.evaluateExpression(args[0])
        return Array.isArray(arr) ? arr.length : 0
      case 'in':
        const value = this.evaluateExpression(args[0])
        const array = this.evaluateExpression(args[1])
        return Array.isArray(array) && array.includes(value)
      case 'case':
        for (const caseItem of args) {
          if (this.evaluateExpression(caseItem.condition)) {
            return this.evaluateExpression(caseItem.value)
          }
        }
        return 0
      default:
        return expression
    }
  }

  private getVariable(name: string): any {
    return this.inputs[name]
  }
}

export function calculatePricing(config: PricingConfig, inputs: Record<string, any>): PricingResult {
  const engine = new PricingEngine(config, inputs)
  return engine.calculate()
}
