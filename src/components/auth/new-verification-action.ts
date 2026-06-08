"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/components/auth/user";
import { getVerificationTokenByToken } from "@/lib/tokens";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "رابط التفعيل غير صالح أو مستخدم من قبل" };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "انتهت صلاحية رابط التفعيل. يرجى إنشاء رابط جديد" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "البريد الإلكتروني غير مسجل" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: "تم تفعيل بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول" };
};
