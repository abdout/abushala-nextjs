"use server";

import { sendContactEmail as sendContactEmailViaResend } from "@/lib/mail";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    await sendContactEmailViaResend(data);
    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: "فشل في إرسال الرسالة" };
  }
}
