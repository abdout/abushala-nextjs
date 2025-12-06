import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
  password: z.string().min(1, {
    message: "كلمة المرور مطلوبة",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  }),
  name: z.string().min(1, {
    message: "الاسم مطلوب",
  }),
  phone: z.string().optional(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  }),
});
