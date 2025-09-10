import { EmailProvider } from '@/types'

export class PostmarkProvider implements EmailProvider {
  private client: any

  constructor(apiKey: string) {
    // In a real implementation, you'd import and initialize Postmark client
    this.client = { apiKey }
  }

  async sendEmail(to: string[], subject: string, html: string, cc?: string[]): Promise<void> {
    // Mock implementation - replace with actual Postmark API call
    console.log('Sending email via Postmark:', { to, subject, cc })
    console.log('HTML content:', html)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

export class SMTPProvider implements EmailProvider {
  private config: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }

  constructor(config: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }) {
    this.config = config
  }

  async sendEmail(to: string[], subject: string, html: string, cc?: string[]): Promise<void> {
    // Mock implementation - replace with actual Nodemailer
    console.log('Sending email via SMTP:', { to, subject, cc, config: this.config })
    console.log('HTML content:', html)
    
    // Simulate SMTP send
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

export function createEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'smtp'
  
  if (provider === 'postmark') {
    const apiKey = process.env.POSTMARK_KEY
    if (!apiKey) {
      console.log('POSTMARK_KEY not found, using mock email')
      return new MockEmailProvider()
    }
    return new PostmarkProvider(apiKey)
  }
  
  if (provider === 'smtp') {
    const config = {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
      }
    }
    return new SMTPProvider(config)
  }
  
  // Fallback to mock provider
  return new MockEmailProvider()
}

// Mock email provider for testing
class MockEmailProvider implements EmailProvider {
  async sendEmail(to: string[], subject: string, html: string, cc?: string[]): Promise<void> {
    console.log('Mock email sent:', { to, subject, cc })
    console.log('HTML content:', html)
    
    // Simulate email send
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}