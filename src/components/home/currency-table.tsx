"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface Currency {
  id: string;
  name: string;
  code: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CurrencyTableProps {
  currencies: Currency[];
}

const formatUpdatedAt = (value: Date | string) =>
  new Date(value).toLocaleString("ar-LY", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    // Pin the timezone so SSR (server TZ) and the client (browser TZ) render
    // identical text — otherwise React throws a hydration mismatch (#418)
    // which can swallow the first click on nav links.
    timeZone: "Africa/Tripoli",
  });

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) {
    return <span className="text-muted-foreground">-</span>;
  }
  const isUp = change > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <div className={`flex items-center justify-center gap-1 ${isUp ? "text-green-600" : "text-red-600"}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isUp ? "+" : ""}
        {change.toFixed(2)}
      </span>
    </div>
  );
}

export function CurrencyTable({ currencies }: CurrencyTableProps) {
  const lastUpdatedLabel = useMemo(() => {
    if (!currencies.length) {
      return "لا توجد بيانات";
    }

    const latest = currencies.reduce(
      (current, candidate) =>
        new Date(candidate.updatedAt) > new Date(current.updatedAt) ? candidate : current,
      currencies[0]
    );

    return formatUpdatedAt(latest.updatedAt);
  }, [currencies]);

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold">أسعار العملات</CardTitle>
          <Badge variant="outline" className="text-xs">
            آخر تحديث: {lastUpdatedLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {currencies.length === 0 ? (
          <div className="rounded-lg border border-border py-8 text-center text-muted-foreground">
            لا توجد عملات مضافة حاليًا. يرجى إضافة بيانات من لوحة التحكم.
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards (below sm) */}
            <div className="space-y-3 sm:hidden">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="rounded-lg border border-border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{currency.name}</span>
                    <Badge variant="secondary" className="font-mono">
                      {currency.code}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-md bg-muted/40 py-2">
                      <p className="text-xs text-muted-foreground mb-1">سعر الشراء</p>
                      <p className="font-semibold text-primary">{currency.buyPrice.toFixed(2)} د.ل</p>
                    </div>
                    <div className="rounded-md bg-muted/40 py-2">
                      <p className="text-xs text-muted-foreground mb-1">سعر البيع</p>
                      <p className="font-semibold text-primary">{currency.sellPrice.toFixed(2)} د.ل</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {currency.updatedAt ? formatUpdatedAt(currency.updatedAt) : "-"}
                    </span>
                    <ChangeIndicator change={currency.change} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table (sm and up), horizontally scrollable as a fallback */}
            <div className="hidden sm:block rounded-lg border border-border overflow-x-auto">
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
                  {currencies.map((currency) => (
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
                        {currency.updatedAt ? formatUpdatedAt(currency.updatedAt) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <ChangeIndicator change={currency.change} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            الأسعار المعروضة استرشادية وقابلة للتغيير في أي وقت. للحصول على السعر الفعلي يرجى التواصل مع المكتب مباشرة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
