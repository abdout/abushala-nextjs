import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Mail } from "lucide-react";
import { useDataStore } from "@/context/DataContext";

const STEP_COPY = {
  request: {
    title: "نسيت كلمة المرور؟",
    description: "أدخل بريدك الإلكتروني لاستعادة كلمة المرور",
    button: "إرسال رابط الاستعادة",
  },
  reset: {
    title: "إعادة تعيين كلمة المرور",
    description: "أدخل كلمة مرور جديدة لتأمين حسابك",
    button: "حفظ كلمة المرور الجديدة",
  },
  success: {
    title: "تم تحديث كلمة المرور",
    description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة",
    button: "العودة لتسجيل الدخول",
  },
} as const;

type ResetStep = keyof typeof STEP_COPY;

const simulateDelay = (ms = 800) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const PASSWORD_MIN_LENGTH = 6;

const ForgotPassword = () => {
  const { users, resetUserPassword } = useDataStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ResetStep>("request");

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = users.some((user) => user.email.trim().toLowerCase() === normalizedEmail);

    if (!userExists) {
      toast.error("لا يوجد حساب مرتبط بهذا البريد");
      setIsLoading(false);
      return;
    }

    await simulateDelay();
    toast.success("تم التحقق من البريد، يمكنك الآن إدخال كلمة مرور جديدة");
    setStep("reset");
    setIsLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      toast.error(`كلمة المرور يجب أن تكون ${PASSWORD_MIN_LENGTH} أحرف على الأقل`);
      return;
    }

    setIsLoading(true);
    await simulateDelay();

    const result = await resetUserPassword(email, password);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.error ?? "حدث خطأ أثناء تحديث كلمة المرور");
      setStep("request");
      return;
    }

    toast.success("تم تحديث كلمة المرور بنجاح");
    setPassword("");
    setConfirmPassword("");
    setStep("success");
  };

  const { title, description, button } = STEP_COPY[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 shadow-gold">
            <Mail className="w-8 h-8 text-accent" />
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isLoading}>
                {isLoading ? "جاري الإرسال..." : button}
              </Button>
              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full gap-2">
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : button}
              </Button>
              <Button type="button" variant="ghost" className="w-full" disabled={isLoading} onClick={() => setStep("request")}>
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
            <Link to="/login" className="w-full block">
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

export default ForgotPassword;
