"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useDataStore } from "@/context/DataContext";

const CurrencyTable = () => {
  const { currencies } = useDataStore();

  const lastUpdatedLabel = useMemo(() => {
    if (!currencies.length) {
      return "لا توجد بيانات";
    }

    const latest = currencies.reduce(
      (current, candidate) =>
        new Date(candidate.updatedAt) > new Date(current.updatedAt) ? candidate : current,
      currencies[0]
    );

    return new Date(latest.updatedAt).toLocaleString("ar-LY", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  }, [currencies]);

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">أسعار العملات</CardTitle>
          <Badge variant="outline" className="text-xs">
            آخر تحديث: {lastUpdatedLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right font-bold">العملة</TableHead>
                <TableHead className="text-center font-bold">الرمز</TableHead>
                <TableHead className="text-center font-bold">سعر الشراء</TableHead>
                <TableHead className="text-center font-bold">سعر البيع</TableHead>
                <TableHead className="text-center font-bold">آخر تحديث</TableHead>
                <TableHead className="text-center font-bold">التغيير</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    لا توجد عملات مضافة حاليًا. يرجى إضافة بيانات من لوحة التحكم.
                  </TableCell>
                </TableRow>
              ) : (
                currencies.map((currency) => (
                  <TableRow key={currency.id} className="hover:bg-muted/30 transition-smooth">
                    <TableCell className="font-medium">{currency.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {currency.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-primary">
                      {currency.buyPrice.toFixed(2)} د.ل
                    </TableCell>
                    <TableCell className="text-center font-semibold text-primary">
                      {currency.sellPrice.toFixed(2)} د.ل
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {currency.updatedAt ? new Date(currency.updatedAt).toLocaleString("ar-LY", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      }) : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {currency.change === 0 ? (
                        <span className="text-muted-foreground">-</span>
                      ) : currency.change > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+{currency.change.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-medium">{currency.change.toFixed(2)}</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ الأسعار المعروضة استرشادية وقابلة للتغيير في أي وقت. للحصول على السعر الفعلي يرجى التواصل مع المكتب مباشرة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyTable;
