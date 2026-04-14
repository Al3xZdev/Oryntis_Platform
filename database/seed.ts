import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing plans
  await prisma.planConfig.deleteMany()

  // Create plans with correct credits
  const plans = [
    {
      name: 'FREE',
      monthlyCredits: 5,
      overageCredits: 10,
      maxUsers: 1,
      maxSearches: 100,
      maxAlerts: 3,
      apiAccess: false,
      prioritySupport: false,
      monthlyPrice: 0,
      yearlyPrice: 0,
    },
    {
      name: 'PRO',
      monthlyCredits: 1000,
      overageCredits: 5,
      maxUsers: 5,
      maxSearches: 10000,
      maxAlerts: 50,
      apiAccess: true,
      prioritySupport: true,
      monthlyPrice: 2999, // $29.99
      yearlyPrice: 29990, // $299.90
    },
    {
      name: 'ENTERPRISE',
      monthlyCredits: 10000,
      overageCredits: 2,
      maxUsers: 999,
      maxSearches: 999999,
      maxAlerts: 999,
      apiAccess: true,
      prioritySupport: true,
      monthlyPrice: 9999, // $99.99
      yearlyPrice: 99990, // $999.90
    },
  ]

  for (const plan of plans) {
    await prisma.planConfig.create({
      data: plan,
    })
    console.log(`✅ Created plan: ${plan.name} (${plan.monthlyCredits} credits/month)`)
  }

  console.log('🌿 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })