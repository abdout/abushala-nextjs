import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Plus, Trash2, RefreshCw, Users, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { useDataStore, CurrencyRecord } from "@/context/DataContext";
import { ClientResponseError } from "pocketbase";

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ar-LY", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
};

const renderCurrencyChange = (currency: CurrencyRecord) => {
  if (currency.change === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (currency.change > 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span className="font-medium">+{currency.change.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 text-red-600">
      <TrendingDown className="w-4 h-4" />
      <span className="font-medium">{currency.change.toFixed(2)}</span>
    </div>
  );
};

const AdminDashboard = () => {
  const {
    currencies,
    users,
    currentUser,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    fetchCurrencies,
    isCurrenciesLoading,
    isUsersLoading,
    register,
    updateUserRole,
  } = useDataStore();

  const [draftCurrencies, setDraftCurrencies] = useState<CurrencyRecord[]>(currencies);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ name: "", code: "", buyPrice: "", sellPrice: "" });
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    setDraftCurrencies(currencies);
  }, [currencies]);

  const adminAccounts = useMemo(() => users.filter((user) => user.role === "admin"), [users]);
  const memberAccounts = useMemo(() => users.filter((user) => user.role === "user"), [users]);

  const stats = useMemo(
    () => ({
      totalCurrencies: currencies.length,
      totalUsers: memberAccounts.length,
      totalAdmins: adminAccounts.length,
    }),
    [currencies.length, memberAccounts.length, adminAccounts.length]
  );

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const handleDraftChange = (
    id: string,
    field: "name" | "code" | "buyPrice" | "sellPrice",
    value: string
  ) => {
    setDraftCurrencies((prev) =>
      prev.map((currency) => {
        if (currency.id !== id) {
          return currency;
        }

        if (field === "name" || field === "code") {
          return { ...currency, [field]: value };
        }

        const parsed = Number(value);
        return { ...currency, [field]: Number.isNaN(parsed) ? 0 : parsed };
      })
    );
  };

  const handleSaveCurrencies = async () => {
    setIsSaving(true);
    const changes = draftCurrencies.filter((draft) => {
      const original = currencies.find((currency) => currency.id === draft.id);
      if (!original) {
        return false;
      }

      return (
        original.name !== draft.name ||
        original.code !== draft.code ||
        original.buyPrice !== draft.buyPrice ||
        original.sellPrice !== draft.sellPrice
      );
    });

    if (changes.length === 0) {
      toast.message("لا توجد تغييرات لحفظها");
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all(
        changes.map((currency) =>
          updateCurrency(currency.id, {
            name: currency.name,
            code: currency.code,
            buyPrice: currency.buyPrice,
            sellPrice: currency.sellPrice,
          })
        )
      );
      toast.success("تم حفظ أسعار العملات بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("تعذر حفظ أسعار العملات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCurrency = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newCurrency.name || !newCurrency.code) {
      toast.error("يرجى إدخال اسم العملة ورمزها");
      return;
    }

    const buyPrice = Number(newCurrency.buyPrice);
    const sellPrice = Number(newCurrency.sellPrice);
    if ([buyPrice, sellPrice].some((value) => Number.isNaN(value) || value <= 0)) {
      toast.error("سعر الشراء والبيع يجب أن يكونا أرقامًا صحيحة");
      return;
    }

    try {
      await addCurrency({
        name: newCurrency.name,
        code: newCurrency.code.toUpperCase(),
        buyPrice,
        sellPrice,
      });
      toast.success("تمت إضافة العملة الجديدة");
      setNewCurrency({ name: "", code: "", buyPrice: "", sellPrice: "" });
    } catch (error) {
      console.error(error);
      toast.error("تعذر إضافة العملة");
    }
  };

  const handleDeleteCurrency = (id: string) => {
    deleteCurrency(id)
      .then(() => toast.message("تم حذف العملة"))
      .catch((error) => {
        console.error(error);
        toast.error("تعذر حذف العملة");
      });
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await fetchCurrencies();
      toast.success("تمت مزامنة الأسعار من الخادم");
    } catch (error) {
      console.error(error);
      toast.error("تعذر تحديث الأسعار");
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddAdminAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = adminForm.name.trim();
    const trimmedEmail = adminForm.email.trim();

    if (!trimmedName || !trimmedEmail || !adminForm.password || !adminForm.confirmPassword) {
      toast.error("يرجى تعبئة جميع بيانات المشرف");
      return;
    }

    if (adminForm.password.length < 8) {
      toast.error("كلمة مرور المشرف يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setIsAddingAdmin(true);
    register({
      name: trimmedName,
      email: trimmedEmail,
      password: adminForm.password,
      confirmPassword: adminForm.confirmPassword,
      role: "admin",
    })
      .then(() => {
        toast.success("تمت إضافة مشرف جديد بنجاح");
        setAdminForm({ name: "", email: "", password: "", confirmPassword: "" });
      })
      .catch((error) => {
        const message = error instanceof ClientResponseError ? error.message : "تعذر إضافة المشرف";
        toast.error(message);
      })
      .finally(() => setIsAddingAdmin(false));
  };

  const handleRemoveAdminAccount = (id: string) => {
    if (adminAccounts.length <= 1) {
      toast.error("لا يمكن حذف آخر مشرف");
      return;
    }

    updateUserRole(id, "user")
      .then(() => {
        if (id === currentUser.id) {
          toast.message("تمت إزالة صلاحيات المشرف من حسابك");
        } else {
          toast.success("تمت إزالة صلاحيات المشرف");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("تعذر إزالة صلاحيات المشرف");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة أسعار العملات ومراجعة المستخدمين المسجلين من نفس الواجهة.</p>
          <span className="text-sm text-muted-foreground">
            مرحبًا {currentUser.name ?? currentUser.email}، يمكنك إضافة أو إزالة المشرفين والتحكم الكامل بالمنصة.
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                إجمالي العملات
              </CardTitle>
              <CardDescription>عدد العملات التي تعرض في الصفحة الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalCurrencies}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                المستخدمون المسجلون
              </CardTitle>
              <CardDescription>آخر المستخدمين الذين أنشأوا حسابًا</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalUsers}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                عدد المشرفين
              </CardTitle>
              <CardDescription>إجمالي الحسابات التي تمتلك صلاحيات الإدارة</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalAdmins}</CardContent>
          </Card>
        </div>

        <Card className="shadow-medium">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>إدارة أسعار العملات</CardTitle>
              <CardDescription>قم بتحديث الأسعار في أي وقت وسيظهر التحديث مباشرةً للمستخدمين.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={isResetting}>
                {isResetting ? "جاري التحديث..." : "مزامنة مع الخادم"}
              </Button>
              <Button onClick={handleSaveCurrencies} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  "جارٍ الحفظ..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ الكل
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العملة</TableHead>
                  <TableHead className="text-center">الرمز</TableHead>
                  <TableHead className="text-center">سعر الشراء</TableHead>
                  <TableHead className="text-center">سعر البيع</TableHead>
                  <TableHead className="text-center">آخر تحديث</TableHead>
                  <TableHead className="text-center">التغيير</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCurrenciesLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      جاري تحميل أسعار العملات...
                    </TableCell>
                  </TableRow>
                ) : draftCurrencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      لا توجد عملات. أضف عملة جديدة أدناه.
                    </TableCell>
                  </TableRow>
                ) : (
                  draftCurrencies.map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell>
                        <Input value={currency.name} onChange={(event) => handleDraftChange(currency.id, "name", event.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={currency.code}
                          onChange={(event) => handleDraftChange(currency.id, "code", event.target.value.toUpperCase())}
                          className="text-center uppercase"
                          maxLength={4}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={currency.buyPrice}
                          onChange={(event) => handleDraftChange(currency.id, "buyPrice", event.target.value)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={currency.sellPrice}
                          onChange={(event) => handleDraftChange(currency.id, "sellPrice", event.target.value)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {formatDate(currency.updatedAt)}
                      </TableCell>
                      <TableCell className="text-center">{renderCurrencyChange(currency)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCurrency(currency.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إضافة عملة جديدة</CardTitle>
            <CardDescription>املأ البيانات التالية ثم اضغط إضافة</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAddCurrency}>
              <div className="space-y-2">
                <Label htmlFor="currency-name">اسم العملة</Label>
                <Input
                  id="currency-name"
                  value={newCurrency.name}
                  onChange={(event) => setNewCurrency((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-code">رمز العملة</Label>
                <Input
                  id="currency-code"
                  value={newCurrency.code}
                  onChange={(event) => setNewCurrency((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                  maxLength={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-buy">سعر الشراء</Label>
                <Input
                  id="currency-buy"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCurrency.buyPrice}
                  onChange={(event) => setNewCurrency((prev) => ({ ...prev, buyPrice: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-sell">سعر البيع</Label>
                <Input
                  id="currency-sell"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCurrency.sellPrice}
                  onChange={(event) => setNewCurrency((prev) => ({ ...prev, sellPrice: event.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة العملة
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>إدارة المشرفين</CardTitle>
            <CardDescription>إضافة أو إزالة المشرفين الذين يمتلكون كافة الصلاحيات.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead className="text-center">تاريخ الإضافة</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        جاري تحميل حسابات المشرفين...
                      </TableCell>
                    </TableRow>
                  ) : adminAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        لا توجد حسابات مشرفين.
                      </TableCell>
                    </TableRow>
                  ) : (
                    adminAccounts.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name ?? "-"}</TableCell>
                        <TableCell dir="ltr">{admin.email}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(admin.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={admin.id === currentUser.id ? "default" : "outline"}>
                            {admin.id === currentUser.id ? "مشرف حالي" : "مشرف"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={adminAccounts.length <= 1}
                            onClick={() => handleRemoveAdminAccount(admin.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={handleAddAdminAccount}>
              <div className="space-y-2">
                <Label htmlFor="admin-name">اسم المشرف</Label>
                <Input
                  id="admin-name"
                  value={adminForm.name}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">البريد الإلكتروني</Label>
                <Input
                  id="admin-email"
                  type="email"
                  dir="ltr"
                  value={adminForm.email}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">كلمة المرور</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminForm.password}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password-confirm">تأكيد كلمة المرور</Label>
                <Input
                  id="admin-password-confirm"
                  type="password"
                  value={adminForm.confirmPassword}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Button type="submit" className="gap-2" disabled={isAddingAdmin}>
                  {isAddingAdmin ? "جاري الإضافة..." : <><Plus className="w-4 h-4" /> إضافة مشرف</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>سجل المستخدمين</CardTitle>
            <CardDescription>جميع الحسابات التي تم إنشاؤها من نموذج التسجيل</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead className="text-center">تاريخ الانضمام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isUsersLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      جاري تحميل المستخدمين...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      لا يوجد مستخدمون بعد. عند إنشاء حسابات جديدة ستظهر هنا.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name ?? "-"}</TableCell>
                      <TableCell className="text-sm" dir="ltr">
                        {user.email}
                      </TableCell>
                      <TableCell dir="ltr">{user.phone ?? "-"}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
