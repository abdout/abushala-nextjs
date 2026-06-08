"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

// Opt-in: only block unverified logins when explicitly enabled. This keeps
// sign-up/login working in environments where Resend isn't configured yet.
// Flip REQUIRE_EMAIL_VERIFICATION="true" once the sending domain is verified.
const requireEmailVerification =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "بيانات غير صحيحة!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "البريد الإلكتروني غير مسجل!" };
  }

  // Block unverified accounts and re-send a fresh confirmation link.
  if (requireEmailVerification && !existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    try {
      await sendVerificationEmail(verificationToken.email, verificationToken.token);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      return { error: "حسابك غير مفعّل وتعذّر إرسال رابط التفعيل حاليًا" };
    }
    return { success: "حسابك غير مفعّل. أرسلنا رابط تأكيد جديد إلى بريدك الإلكتروني" };
  }

  // Determine redirect based on user role
  let redirectTo = callbackUrl || DEFAULT_LOGIN_REDIRECT;
  if (!callbackUrl && existingUser.role === "ADMIN") {
    redirectTo = "/admin";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "بيانات الدخول غير صحيحة!" };
        default:
          return { error: "حدث خطأ ما!" };
      }
    }

    throw error;
  }
};
