import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/components/auth/user";
import { SettingsForm } from "@/components/settings/settings-form";

const SettingsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  return (
    <SettingsForm
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: session.user.role,
      }}
    />
  );
};

export default SettingsPage;
