"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { newVerification } from "./new-verification-action";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const hasRun = useRef(false);

  const onVerify = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("رابط التفعيل مفقود");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => setError("حدث خطأ ما!"));
  }, [token, success, error]);

  useEffect(() => {
    // Guard against React 19 StrictMode double-invoke consuming the token twice.
    if (hasRun.current) return;
    hasRun.current = true;
    onVerify();
  }, [onVerify]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/loginlogo.png" alt="أبو شعالة" className="w-24 h-24 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">تفعيل البريد الإلكتروني</CardTitle>
          <CardDescription>جاري التحقق من رابط التفعيل</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-4">
          {!success && !error && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p>جاري التفعيل...</p>
            </div>
          )}
          {success && (
            <div className="flex flex-col items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
              <p className="text-center font-medium">{success}</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-2 text-destructive">
              <XCircle className="w-12 h-12" />
              <p className="text-center font-medium">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة لتسجيل الدخول
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
