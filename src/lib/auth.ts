import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.ADMIN_PASSWORD || 'default-secret'

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD not configured')
  }
  
  return bcrypt.compare(password, adminPassword)
}

export function createAdminToken(): string {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.admin === true
  } catch {
    return false
  }
}

export async function createAdminSession(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  await prisma.adminSession.create({
    data: {
      token,
      expiresAt
    }
  })
}

export async function validateAdminSession(token: string): Promise<boolean> {
  const session = await prisma.adminSession.findUnique({
    where: { token }
  })
  
  if (!session || session.expiresAt < new Date()) {
    return false
  }
  
  return true
}

export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}
