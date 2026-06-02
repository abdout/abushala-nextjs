import { auth } from "@/auth";
import { getCurrencies } from "@/components/admin/admin-actions";
import { HomePage } from "@/components/home/home-page";

// Public page — anyone can view the exchange rates. Admins additionally see
// the dashboard link / logout button (resolved from the session below).
const Index = async () => {
  const session = await auth();
  const currencies = await getCurrencies();

  return <HomePage currencies={currencies} user={session?.user} />;
};

export default Index;
