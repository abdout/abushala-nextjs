import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">مكتب أبو شعالة</h3>
            <p className="text-sm text-primary-foreground/80">
              مكتب موثوق للتحويلات المالية وصرف العملات الأجنبية في مصراتة، ليبيا.
              نقدم أفضل الأسعار وأسرع الخدمات.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                <span>مصراتة، ليبيا</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span dir="ltr">+218918239656</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span dir="ltr">info@abushaalah.ly</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">ساعات العمل</h3>
            <div className="space-y-2 text-sm">
              <p>السبت - االجمعة: 9:00 ص - 9:00 م</p>

            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm">
          <p className="text-primary-foreground/60">
            جميع الحقوق محفوظة © {new Date().getFullYear()} مكتب أبو شعالة للتحويلات المالية
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
