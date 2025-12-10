"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

// Check if current user is admin
async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("غير مصرح لك بالوصول");
  }
  return session.user;
}

// Currency actions
export async function getCurrencies() {
  return await db.currency.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function addCurrency(data: {
  name: string;
  code: string;
  buyPrice: number;
  sellPrice: number;
}) {
  await checkAdminAuth();

  const currency = await db.currency.create({
    data: {
      name: data.name,
      code: data.code.toUpperCase(),
      buyPrice: data.buyPrice,
      sellPrice: data.sellPrice,
      change: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return currency;
}

export async function updateCurrency(
  id: string,
  data: {
    name: string;
    code: string;
    buyPrice: number;
    sellPrice: number;
  }
) {
  await checkAdminAuth();

  // Get current currency to calculate change
  const current = await db.currency.findUnique({ where: { id } });
  const change = current ? data.buyPrice - current.buyPrice : 0;

  await db.currency.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code.toUpperCase(),
      buyPrice: data.buyPrice,
      sellPrice: data.sellPrice,
      change,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCurrency(id: string) {
  await checkAdminAuth();

  await db.currency.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

// User actions
export async function getUsers() {
  await checkAdminAuth();

  return await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: UserRole) {
  const currentUser = await checkAdminAuth();

  // Count admins
  const adminCount = await db.user.count({ where: { role: "ADMIN" } });

  // Prevent removing last admin
  if (role === "USER" && adminCount <= 1) {
    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === "ADMIN") {
      throw new Error("لا يمكن حذف آخر مشرف");
    }
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin");
  return { removedSelf: userId === currentUser.id && role === "USER" };
}

export async function addAdminUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  await checkAdminAuth();

  // Check if email exists
  const existing = await db.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existing) {
    throw new Error("البريد الإلكتروني مستخدم بالفعل");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  revalidatePath("/admin");
}

// Seed default currencies
export async function seedDefaultCurrencies() {
  await checkAdminAuth();

  const count = await db.currency.count();
  if (count > 0) {
    return { message: "العملات موجودة بالفعل" };
  }

  const defaultCurrencies = [
    { name: "دولار أمريكي", code: "USD", buyPrice: 4.85, sellPrice: 4.9, change: 0 },
    { name: "يورو", code: "EUR", buyPrice: 5.2, sellPrice: 5.25, change: 0 },
    { name: "جنيه سوداني", code: "SDG", buyPrice: 0.008, sellPrice: 0.009, change: 0 },
    { name: "جنيه مصري", code: "EGP", buyPrice: 0.1, sellPrice: 0.11, change: 0 },
    { name: "ريال سعودي", code: "SAR", buyPrice: 1.29, sellPrice: 1.31, change: 0 },
    { name: "درهم إماراتي", code: "AED", buyPrice: 1.32, sellPrice: 1.34, change: 0 },
    { name: "دينار تونسي", code: "TND", buyPrice: 1.55, sellPrice: 1.58, change: 0 },
  ];

  await db.currency.createMany({
    data: defaultCurrencies,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { message: "تمت إضافة العملات الافتراضية" };
}
