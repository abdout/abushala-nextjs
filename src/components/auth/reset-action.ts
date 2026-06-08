"use server";

import * as z from "zod";
import { ResetSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

// Generic confirmation shown regardless of whether the email exists — this
// prevents attackers from enumerating registered accounts via the reset form.
const GENERIC_SUCCESS =
  "إذا كان هذا البريد مسجلاً لدينا، فسنرسل إليه رابط إعادة تعيين كلمة المرور";

export const requestPasswordReset = async (
  values: z.infer<typeof ResetSchema>
) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "البريد الإلكتروني غير صحيح" };
  }

  const email = validatedFields.data.email.toLowerCase().trim();
  const existingUser = await getUserByEmail(email);

  // Only send when the account actually exists, but never reveal that fact.
  if (existingUser) {
    const resetToken = await generatePasswordResetToken(email);
    try {
      await sendPasswordResetEmail(resetToken.email, resetToken.token);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return { error: "تعذر إرسال البريد حاليًا. حاول مرة أخرى لاحقًا" };
    }
  }

  return { success: GENERIC_SUCCESS };
};
