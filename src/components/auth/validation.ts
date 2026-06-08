import * as z from "zod";

// Libyan mobile numbers: optional +218 / 218 / 0 prefix, then 9 followed by
// 8 digits (e.g. 0912345678, +218912345678). Spaces/dashes stripped upstream.
const libyanPhone = z
  .string()
  .min(1, { message: "رقم الهاتف مطلوب" })
  .regex(/^(\+?218|0)?9\d{8}$/, {
    message: "رقم هاتف ليبي غير صحيح (مثال: 0912345678)",
  });

export const LoginSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
  password: z.string().min(1, {
    message: "كلمة المرور مطلوبة",
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "البريد الإلكتروني مطلوب",
    }),
    password: z.string().min(6, {
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    }),
    confirmPassword: z.string().min(1, {
      message: "تأكيد كلمة المرور مطلوب",
    }),
    name: z.string().min(1, {
      message: "الاسم مطلوب",
    }),
    phone: libyanPhone,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
});

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    }),
    confirmPassword: z.string().min(1, {
      message: "تأكيد كلمة المرور مطلوب",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

// Account settings — profile fields the user can self-edit.
export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  phone: libyanPhone,
});

// Account settings — change password (requires the current password).
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة" }),
    password: z.string().min(6, {
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    }),
    confirmPassword: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
