import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create or update default admin (idempotent — safe to re-run against prod)
  const adminEmail = "admin@abushala.ly";
  const adminPassword = "123456";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "المدير العام",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin ready: admin@abushala.ly / 123456");

  // Create default currencies
  const currencyCount = await prisma.currency.count();

  if (currencyCount === 0) {
    await prisma.currency.createMany({
      data: [
        { name: "دولار أمريكي", code: "USD", buyPrice: 4.85, sellPrice: 4.9, change: 0 },
        { name: "يورو", code: "EUR", buyPrice: 5.2, sellPrice: 5.25, change: 0 },
        { name: "جنيه سوداني", code: "SDG", buyPrice: 0.008, sellPrice: 0.009, change: 0 },
        { name: "جنيه مصري", code: "EGP", buyPrice: 0.1, sellPrice: 0.11, change: 0 },
        { name: "ريال سعودي", code: "SAR", buyPrice: 1.29, sellPrice: 1.31, change: 0 },
        { name: "درهم إماراتي", code: "AED", buyPrice: 1.32, sellPrice: 1.34, change: 0 },
        { name: "دينار تونسي", code: "TND", buyPrice: 1.55, sellPrice: 1.58, change: 0 },
      ],
    });
    console.log("✅ Default currencies created");
  } else {
    console.log("ℹ️ Currencies already exist");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
