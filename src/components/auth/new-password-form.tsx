"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NewPasswordSchema } from "./validation";
import { newPassword } from "./new-password-action";
import { ArrowRight } from "lucide-react";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
          if (data?.success) form.reset();
        })
        .catch(() => setError("حدث خطأ ما!"));
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/loginlogo.png" alt="أبو شعالة" className="w-24 h-24 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">كلمة مرور جديدة</CardTitle>
          <CardDescription>أدخل كلمة المرور الجديدة لحسابك</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || !!success}
                        placeholder="••••••••"
                        type="password"
                        dir="ltr"
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || !!success}
                        placeholder="••••••••"
                        type="password"
                        dir="ltr"
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/15 p-3 rounded-md text-emerald-600 text-sm text-center">
                  {success}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {!success && (
                <Button
                  type="submit"
                  className="w-full gradient-primary hover:opacity-90"
                  disabled={isPending}
                >
                  {isPending ? "جاري الحفظ..." : "حفظ كلمة المرور"}
                </Button>
              )}
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full gap-2" type="button">
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
