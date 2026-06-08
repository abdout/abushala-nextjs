"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, MailCheck } from "lucide-react";
import { ResetSchema } from "./validation";
import { requestPasswordReset } from "./reset-action";

export const ResetForm = () => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      requestPasswordReset(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
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
          <CardTitle className="text-2xl font-bold">نسيت كلمة المرور؟</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-emerald-600 py-4">
              <MailCheck className="w-12 h-12" />
              <p className="text-center text-sm text-muted-foreground">{success}</p>
            </div>
            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                العودة لتسجيل الدخول
              </Button>
            </Link>
          </CardContent>
        ) : (
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
                {error && (
                  <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full gradient-primary hover:opacity-90"
                  disabled={isPending}
                >
                  {isPending ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
                </Button>
                <Link href="/login" className="w-full">
                  <Button variant="ghost" className="w-full gap-2" type="button">
                    <ArrowRight className="w-4 h-4" />
                    العودة لتسجيل الدخول
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};
