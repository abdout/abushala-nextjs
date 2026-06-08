"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "بيانات غير صحيحة!" };
  }

  const { email: rawEmail, password, name, phone } = validatedFields.data;
  const email = rawEmail.toLowerCase().trim();
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
      // emailVerified stays null until the user clicks the verification link.
    },
  });

  // Issue a verification token and email it. If email delivery fails we still
  // keep the account but tell the user we couldn't send the link.
  const verificationToken = await generateVerificationToken(email);
  try {
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      success:
        "تم إنشاء حسابك، لكن تعذر إرسال رسالة التفعيل حاليًا. تواصل معنا أو حاول تسجيل الدخول لإعادة الإرسال.",
    };
  }

  return {
    success: "تم إنشاء حسابك! تحقق من بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.",
  };
};
