"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/components/auth/user";

export const checkEmailExists = async (email: string) => {
  const user = await getUserByEmail(email.toLowerCase().trim());

  if (!user) {
    return { error: "لا يوجد حساب مرتبط بهذا البريد" };
  }

  return { success: true };
};

export const resetPassword = async (email: string, password: string) => {
  const user = await getUserByEmail(email.toLowerCase().trim());

  if (!user) {
    return { error: "لا يوجد حساب مرتبط بهذا البريد" };
  }

  if (password.length < 4) {
    return { error: "كلمة المرور يجب أن تكون 4 أحرف على الأقل" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  });

  return { success: "تم تحديث كلمة المرور بنجاح" };
};
