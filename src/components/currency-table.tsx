"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface Currency {
  id: string;
  name: string;
  code: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  updatedAt: Date | string;
  createdAt?: Date | string;
}

interface CurrencyTableProps {
  currencies: Currency[];
}

// Format date consistently to avoid hydration mismatch
function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "م" : "ص";
  const hours12 = hours % 12 || 12;
  return `${month}/${day}، ${hours12.toString().padStart(2, "0")}:${minutes} ${period}`;
}

export function CurrencyTable({ currencies }: CurrencyTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lastUpdatedLabel = (() => {
    if (!currencies.length) {
      return "لا توجد بيانات";
    }
    if (!mounted) {
      return "...";
    }

    const latest = currencies.reduce(
      (current, candidate) =>
        new Date(candidate.updatedAt) > new Date(current.updatedAt) ? candidate : current,
      currencies[0]
    );

    return formatDate(latest.updatedAt);
  })();

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-600">أسعار العملات</CardTitle>
          <Badge variant="outline" className="text-xs rounded-full">
            آخر تحديث: {lastUpdatedLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
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
                      <Badge className="font-mono bg-blue-600 text-white border-transparent">
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
                      {mounted && currency.updatedAt ? formatDate(currency.updatedAt) : "-"}
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
            الأسعار المعروضة استرشادية وقابلة للتغيير في أي وقت. للحصول على السعر الفعلي يرجى التواصل مع المكتب مباشرة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
