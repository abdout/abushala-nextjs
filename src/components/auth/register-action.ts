"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "بيانات غير صحيحة!" };
  }

  const { email, password, name, phone } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "البريد الإلكتروني مستخدم بالفعل!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    },
  });

  return { success: "تم إنشاء الحساب بنجاح!" };
};
