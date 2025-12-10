import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useDataStore } from "@/context/DataContext";
import { ClientResponseError } from "pocketbase";

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, isAuthReady } = useDataStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (currentUser?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, isAuthReady, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      toast.success(user.role === "admin" ? "مرحبًا بالمدير! تم فتح لوحة التحكم" : "تم تسجيل الدخول بنجاح!");
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      const message = error instanceof ClientResponseError ? error.message : "تعذر تسجيل الدخول. حاول مرة أخرى.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleSubmit}>
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
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                className="text-right"
              />
            </div>
            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
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
              <Link to="/register" className="text-accent hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
