import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CurrencyTable } from "@/components/currency-table";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const dynamic = "force-dynamic";

async function getCurrencies() {
  try {
    const currencies = await db.currency.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return currencies;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const session = await auth();
  const currencies = await getCurrencies();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={session?.user} />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            مكتب أبو شعالة للتحويلات المالية
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-6">
            أفضل أسعار صرف العملات الأجنبية في مصراتة - ليبيا
          </p>
          <a
            href="#currencies"
            className="inline-flex items-center gap-2 bg-gray-700/60 hover:bg-gray-700/80 border border-white/30 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث الأسعار
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-10">
        <div id="currencies">
          <CurrencyTable currencies={currencies} />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
