"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Navbar, { type NavbarUser } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProfileSchema, ChangePasswordSchema } from "@/components/auth/validation";
import { updateProfile, changePassword } from "./settings-actions";
import { Save, KeyRound } from "lucide-react";

interface SettingsFormProps {
  user: NavbarUser & { id?: string; name?: string | null; phone?: string | null; email?: string | null };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isProfilePending, startProfile] = useTransition();
  const [isPasswordPending, startPassword] = useTransition();

  const profileForm = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone ?? "",
    },
  });

  const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });

  const onProfileSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startProfile(() => {
      updateProfile(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) toast.success(data.success);
        })
        .catch(() => toast.error("حدث خطأ ما!"));
    });
  };

  const onPasswordSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startPassword(() => {
      changePassword(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            passwordForm.reset();
          }
        })
        .catch(() => toast.error("حدث خطأ ما!"));
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar user={user} />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6 max-w-3xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">إعدادات الحساب</h1>
          <p className="text-muted-foreground">قم بتحديث بياناتك الشخصية وكلمة المرور.</p>
        </div>

        {/* Profile */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>الاسم ورقم الهاتف المرتبط بحسابك.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <Input value={user.email ?? ""} disabled dir="ltr" className="text-right bg-muted" />
                  <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني.</p>
                </div>
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isProfilePending} placeholder="أدخل اسمك الكامل" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isProfilePending}
                          placeholder="0912345678"
                          type="tel"
                          dir="ltr"
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isProfilePending}>
                    {isProfilePending ? "جاري الحفظ..." : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
            <CardDescription>أدخل كلمة المرور الحالية ثم كلمة المرور الجديدة.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الحالية</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPasswordPending} type="password" placeholder="••••••••" dir="ltr" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPasswordPending} type="password" placeholder="••••••••" dir="ltr" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPasswordPending} type="password" placeholder="••••••••" dir="ltr" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isPasswordPending}>
                    {isPasswordPending ? "جاري الحفظ..." : <><KeyRound className="w-4 h-4" /> تغيير كلمة المرور</>}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
