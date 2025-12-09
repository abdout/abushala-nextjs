import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "الموثوقية والأمان",
      description: "نوفر خدمات تحويل آمنة وموثوقة بأعلى معايير الجودة",
    },
    {
      icon: Award,
      title: "أفضل الأسعار",
      description: "نقدم أفضل أسعار صرف العملات في السوق الليبي",
    },
    {
      icon: Clock,
      title: "خدمة سريعة",
      description: "نضمن سرعة في التنفيذ وإنجاز معاملاتك في أقل وقت",
    },
    {
      icon: Users,
      title: "خبرة طويلة",
      description: "سنوات من الخبرة في مجال التحويلات المالية والصرافة",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            مكتب أبو شعالة للتحويلات المالية - شريكك الموثوق في مصراتة
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* About Text */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="shadow-medium">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">نبذة عن المكتب</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  مكتب أبو شعالة للتحويلات المالية هو أحد المكاتب الرائدة في مجال صرف العملات
                  والتحويلات المالية في مدينة مصراتة، ليبيا. نفخر بتقديم خدماتنا لعملائنا الكرام
                  منذ سنوات عديدة بكل احترافية وشفافية.
                </p>
                <p>
                  نحرص على تقديم أفضل أسعار الصرف في السوق مع ضمان سرعة وأمان في جميع المعاملات.
                  فريقنا المتخصص على استعداد دائم لخدمتكم وتلبية احتياجاتكم المالية.
                </p>
                <p>
                  نؤمن بأهمية بناء علاقات طويلة الأمد مع عملائنا، لذلك نسعى دائماً لتحقيق رضاهم
                  من خلال الشفافية والمصداقية في جميع تعاملاتنا.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full gradient-accent flex items-center justify-center mb-4 shadow-gold">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Services Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="shadow-medium">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary text-center">خدماتنا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-bold text-lg mb-2">صرف العملات الأجنبية</h3>
                  <p className="text-sm text-muted-foreground">
                    نوفر خدمة صرف جميع العملات الأجنبية الرئيسية مقابل الدينار الليبي
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-bold text-lg mb-2">التحويلات المالية</h3>
                  <p className="text-sm text-muted-foreground">
                    تحويلات سريعة وآمنة داخل ليبيا وخارجها
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-bold text-lg mb-2">استشارات مالية</h3>
                  <p className="text-sm text-muted-foreground">
                    نقدم استشارات حول أفضل أوقات الصرف وحركة العملات
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-bold text-lg mb-2">خدمة متابعة الأسعار</h3>
                  <p className="text-sm text-muted-foreground">
                    تحديث مستمر للأسعار على مدار اليوم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
