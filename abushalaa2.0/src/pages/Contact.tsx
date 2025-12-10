import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتك وخدمتك
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-medium">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">أرسل لنا رسالة</h2>
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
                  className="w-full gradient-primary hover:opacity-90"
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
            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">معلومات الاتصال</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 shadow-gold">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">العنوان</h3>
                      <p className="text-muted-foreground">
                        شارع طرابلس، وسط البلد
                        <br />
                        مصراتة، ليبيا
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 shadow-gold">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">الهاتف</h3>
                      <p className="text-muted-foreground" dir="ltr">
                        +218 91 234 5678
                        <br />
                        +218 92 345 6789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 shadow-gold">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground" dir="ltr">
                        info@abushaalah.ly
                        <br />
                        support@abushaalah.ly
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-primary">ساعات العمل</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">السبت - الخميس:</span>
                    <span className="text-muted-foreground">8:00 ص - 8:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الجمعة:</span>
                    <span className="text-muted-foreground">2:00 م - 8:00 م</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps Embed */}
            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-primary">موقعنا على الخريطة</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
