"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";
import { getPasswordResetTokenByToken } from "@/lib/tokens";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "رابط إعادة التعيين مفقود" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "بيانات غير صحيحة!" };
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "رابط إعادة التعيين غير صالح" };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "البريد الإلكتروني غير مسجل" };
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول" };
};
