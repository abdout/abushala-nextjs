"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { checkEmailExists, resetPassword } from "./reset-action";

const STEP_COPY = {
  request: {
    title: "نسيت كلمة المرور؟",
    description: "أدخل بريدك الإلكتروني لاستعادة كلمة المرور",
    button: "التالي",
  },
  reset: {
    title: "إعادة تعيين كلمة المرور",
    description: "أدخل كلمة مرور جديدة",
    button: "حفظ كلمة المرور",
  },
  success: {
    title: "تم تحديث كلمة المرور",
    description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة",
    button: "تسجيل الدخول",
  },
} as const;

type ResetStep = keyof typeof STEP_COPY;

export const ResetForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<ResetStep>("request");
  const [isPending, startTransition] = useTransition();

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      checkEmailExists(email)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }
          toast.success("تم التحقق من البريد، يمكنك الآن إدخال كلمة مرور جديدة");
          setStep("reset");
        })
        .catch(() => toast.error("حدث خطأ ما!"));
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (password.length < 4) {
      toast.error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
      return;
    }

    startTransition(() => {
      resetPassword(email, password)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setStep("request");
            return;
          }
          toast.success("تم تحديث كلمة المرور بنجاح");
          setPassword("");
          setConfirmPassword("");
          setStep("success");
        })
        .catch(() => toast.error("حدث خطأ ما!"));
    });
  };

  const { title, description, button } = STEP_COPY[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src="/loginlogo.png"
              alt="أبو شعالة"
              className="w-24 h-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {step === "request" && (
          <form onSubmit={handleRequestSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="text-right"
                  disabled={isPending}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isPending}>
                {isPending ? "جاري الإرسال..." : button}
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full gap-2" type="button">
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </CardFooter>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  dir="ltr"
                  className="text-right bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="text-right"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="text-right"
                  disabled={isPending}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isPending}>
                {isPending ? "جاري الحفظ..." : button}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isPending}
                onClick={() => setStep("request")}
              >
                العودة للخطوة السابقة
              </Button>
            </CardFooter>
          </form>
        )}

        {step === "success" && (
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                تم تحديث كلمة المرور الخاصة بك بنجاح
              </p>
              <p className="text-sm text-muted-foreground">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
              </p>
            </div>
            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                {button}
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
