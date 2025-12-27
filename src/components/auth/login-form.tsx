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
import { LoginSchema } from "./validation";
import { login } from "./login-action";
import { LogIn } from "lucide-react";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "البريد الإلكتروني مستخدم مع مزود آخر!"
    : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
        })
        .catch(() => {
          // Redirect throws an error - this is expected, ignore it
        });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src="/loginlogo.png"
              alt="Login Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="example@email.com"
                        type="email"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
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
              <div className="text-left">
                <Link
                  href="/reset"
                  className="text-sm text-accent hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {(error || urlError) && (
                <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm text-center">
                  {error || urlError}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/15 p-3 rounded-md text-emerald-500 text-sm text-center">
                  {success}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90"
                disabled={isPending}
              >
                {isPending ? (
                  "جاري التحميل..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="text-accent hover:underline font-medium">
                  إنشاء حساب جديد
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
