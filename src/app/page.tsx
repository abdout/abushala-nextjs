"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CurrencyTable from "@/components/CurrencyTable";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success("تم تحديث الأسعار بنجاح");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="gradient-hero text-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        مكتب أبو شعالة للتحويلات المالية
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-6">
                        أفضل أسعار صرف العملات الأجنبية في مصراتة - ليبيا
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={handleRefresh}
                            variant="secondary"
                            className="gap-2 shadow-gold"
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            تحديث الأسعار
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 space-y-10">
                <CurrencyTable />

                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="shadow-sm border border-border/70">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                تابعنا على تيك توك
                            </CardTitle>
                            <CardDescription>شاهد آخر التحديثات والعروض اليومية على حساب تيك توك الرسمي.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between flex-wrap gap-4">
                            <p className="text-muted-foreground">@user9alaqsa0</p>
                            <Button
                                asChild
                                variant="secondary"
                                className="gap-2"
                            >
                                <a
                                    href="https://www.tiktok.com/@user9alaqsa0?_r=1&_t=ZM-91XKJ8uAqLr"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    تابع الحساب
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border/70">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                تابعنا على فيسبوك
                            </CardTitle>
                            <CardDescription>تابع صفحتنا على فيسبوك لآخر الأخبار والتحديثات.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between flex-wrap gap-4">
                            <p className="text-muted-foreground">أبو شعالة للتحويلات</p>
                            <Button
                                asChild
                                variant="secondary"
                                className="gap-2"
                            >
                                <a
                                    href="https://www.facebook.com/profile.php?id=100063558764305"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    تابع الصفحة
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border/70">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                قناة واتساب الرسمية
                            </CardTitle>
                            <CardDescription>تابع قناة أبو شعالة للتحويلات المالية من ليبيا إلى السودان عبر واتساب.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between flex-wrap gap-4">
                            <p className="text-muted-foreground">آخر التنبيهات والأسعار أولاً بأول.</p>
                            <Button
                                asChild
                                variant="outline"
                                className="gap-2"
                            >
                                <a
                                    href="https://whatsapp.com/channel/0029VadPJD342DcgLTJfMn2x"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    انضم الآن
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Index;
