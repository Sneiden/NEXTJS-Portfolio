import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import * as bcrypt from 'bcrypt'

// Read and validate environment variables
const DATABASE_URL: string | undefined = process.env.DATABASE_URL
const ADMIN_EMAIL: string | undefined = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD: string | undefined = process.env.ADMIN_PASSWORD
const ADMIN_NAME: string = process.env.ADMIN_NAME ?? 'Admin'

if (!DATABASE_URL) {
  throw new Error('❌ DATABASE_URL must be set in backend/.env')
}
if (!ADMIN_EMAIL) {
  throw new Error('❌ ADMIN_EMAIL must be set in backend/.env')
}
if (!ADMIN_PASSWORD) {
  throw new Error('❌ ADMIN_PASSWORD must be set in backend/.env')
}

// Reassign as explicit string type after validation
// TypeScript loses narrowing inside async functions — this guarantees the type
const dbUrl: string = DATABASE_URL
const adminEmail: string = ADMIN_EMAIL
const adminPassword: string = ADMIN_PASSWORD

const pool = new Pool({ connectionString: dbUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main(): Promise<void> {
  const hashedPassword: string = await bcrypt.hash(adminPassword, 10)

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: 'admin',
    },
  })

  console.log(`✅ user seeded: ${user.email}`)
  console.log(`📧 Email: ${user.email}`)
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (error: Error): Promise<void> => {
    console.error('❌ Seed failed:', error)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })