"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتك وخدمتك
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-orange-600">أرسل لنا رسالة</h2>

              {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  تم إرسال رسالتك بنجاح! سنتواصل معك قريباً
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 text-orange-600">معلومات الاتصال</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">العنوان</h3>
                      <p className="text-gray-600">
                        شارع طرابلس، وسط البلد
                        <br />
                        مصراتة، ليبيا
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">الهاتف</h3>
                      <p className="text-gray-600" dir="ltr">
                        +218 91 234 5678
                        <br />
                        +218 92 345 6789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600" dir="ltr">
                        info@abushala.ly
                        <br />
                        support@abushala.ly
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">ساعات العمل</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">السبت - الخميس:</span>
                    <span className="text-gray-600">8:00 ص - 8:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الجمعة:</span>
                    <span className="text-gray-600">2:00 م - 8:00 م</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps Embed */}
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">موقعنا على الخريطة</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d837.4736954730473!2d15.099524!3d32.3782717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13a14d4edebd2123%3A0x1c6f983e55cd9053!2z2KPYqNmI2LTYudin2YTZhyDZhNmE2K7Yr9mF2KfYqiDYp9mE2LnYp9mF2Kk!5e0!3m2!1sar!2sly!4v1234567890123!5m2!1sar!2sly"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع مكتب أبو شعالة"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
