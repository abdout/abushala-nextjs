import { auth } from "@/auth";
import { ContactContent } from "./contact-content";

export default async function ContactPage() {
  const session = await auth();
  return <ContactContent user={session?.user} />;
}
