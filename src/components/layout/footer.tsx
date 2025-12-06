import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-amber-400">مكتب أبو شعالة</h3>
            <p className="text-sm text-gray-300">
              مكتب موثوق للتحويلات المالية وصرف العملات الأجنبية في مصراتة، ليبيا.
              نقدم أفضل الأسعار وأسرع الخدمات.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-amber-400">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>مصراتة، ليبيا</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-amber-400" />
                <span dir="ltr">+218918239656</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-amber-400" />
                <span dir="ltr">info@abushala.ly</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-amber-400">ساعات العمل</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>السبت - الجمعة: 9:00 ص - 9:00 م</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p className="text-gray-400">
            جميع الحقوق محفوظة © {new Date().getFullYear()} مكتب أبو شعالة للتحويلات المالية
          </p>
        </div>
      </div>
    </footer>
  );
}
