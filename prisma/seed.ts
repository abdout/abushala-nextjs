import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const adminEmail = "admin@abushala.ly";
  const adminPassword = "admin1234";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "المدير العام",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin created: admin@abushala.ly / admin1234");
  } else {
    console.log("ℹ️ Admin already exists");
  }

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
