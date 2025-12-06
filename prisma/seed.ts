import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log("Connection string:", connectionString?.substring(0, 50) + "...");

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default admin
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "Admin@gmail.com" },
    update: {},
    create: {
      email: "Admin@gmail.com",
      name: "المدير العام",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("Created admin:", admin.email);

  // Create default currencies
  const currencies = [
    { name: "دولار أمريكي", code: "USD", buyPrice: 4.85, sellPrice: 4.9 },
    { name: "يورو", code: "EUR", buyPrice: 5.2, sellPrice: 5.25 },
    { name: "جنيه سوداني", code: "SDG", buyPrice: 0.008, sellPrice: 0.009 },
    { name: "جنيه مصري", code: "EGP", buyPrice: 0.1, sellPrice: 0.11 },
    { name: "ريال سعودي", code: "SAR", buyPrice: 1.29, sellPrice: 1.31 },
    { name: "درهم إماراتي", code: "AED", buyPrice: 1.32, sellPrice: 1.34 },
    { name: "دينار تونسي", code: "TND", buyPrice: 1.55, sellPrice: 1.58 },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {
        buyPrice: currency.buyPrice,
        sellPrice: currency.sellPrice,
      },
      create: {
        ...currency,
        change: 0,
      },
    });
    console.log("Created/updated currency:", currency.code);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
