import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCurrencies, getUsers } from "@/components/admin/admin-actions";

const AdminPage = async () => {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [currencies, users] = await Promise.all([
    getCurrencies(),
    getUsers(),
  ]);

  return (
    <AdminDashboard
      currentUser={session.user}
      initialCurrencies={currencies}
      initialUsers={users}
    />
  );
};

export default AdminPage;
