"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600">أسعار العملات</h2>
          <span className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-1.5">
            آخر تحديث: {lastUpdatedLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-right font-semibold text-gray-600">العملة</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">الرمز</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">سعر الشراء</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">سعر البيع</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">آخر تحديث</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">التغيير</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  لا توجد عملات مضافة حاليًا. يرجى إضافة بيانات من لوحة التحكم.
                </TableCell>
              </TableRow>
            ) : (
              currencies.map((currency) => (
                <TableRow key={currency.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium py-4">{currency.name}</TableCell>
                  <TableCell className="text-center py-4">
                    <span className="inline-flex items-center justify-center bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">
                      {currency.code}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4 font-medium">
                    {currency.buyPrice.toFixed(2)} د.ل
                  </TableCell>
                  <TableCell className="text-center py-4 font-medium">
                    {currency.sellPrice.toFixed(2)} د.ل
                  </TableCell>
                  <TableCell className="text-center py-4 text-sm text-gray-500">
                    {mounted && currency.updatedAt ? formatDate(currency.updatedAt) : "-"}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {currency.change === 0 ? (
                      <span className="text-gray-400">-</span>
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
      </CardContent>
    </Card>
  );
}
