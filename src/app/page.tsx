import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrencies } from "@/components/admin/admin-actions";
import { HomePage } from "@/components/home/home-page";

const Index = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const currencies = await getCurrencies();

  return <HomePage currencies={currencies} />;
};

export default Index;
