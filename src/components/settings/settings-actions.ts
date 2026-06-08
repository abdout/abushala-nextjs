"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getUserById } from "@/components/auth/user";
import { ProfileSchema, ChangePasswordSchema } from "@/components/auth/validation";

export async function updateProfile(values: z.infer<typeof ProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "غير مصرح لك" };
  }

  const parsed = ProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "بيانات غير صحيحة" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone },
  });

  revalidatePath("/settings");
  return { success: "تم تحديث بياناتك بنجاح" };
}

export async function changePassword(values: z.infer<typeof ChangePasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "غير مصرح لك" };
  }

  const parsed = ChangePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "بيانات غير صحيحة" };
  }

  const user = await getUserById(session.user.id);
  if (!user || !user.password) {
    return { error: "لا يمكن تغيير كلمة المرور لهذا الحساب" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "تم تغيير كلمة المرور بنجاح" };
}
