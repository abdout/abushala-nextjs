"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/components/auth/validation";
import { getUserByEmail } from "@/components/auth/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

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
