import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, name, email, message, quoteData } = await request.json()

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const emailContent = `
New Quote Inquiry

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

Quote Data:
${JSON.stringify(quoteData, null, 2)}

---
This message was sent from the Partner Pricing Platform.
    `

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: emailContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
