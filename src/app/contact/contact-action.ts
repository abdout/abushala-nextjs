"use server";

import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, phone, message } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "Abushaala01@gmail.com",
    replyTo: email,
    subject: `رسالة جديدة من ${name} - موقع أبو شعالة`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1a365d;">رسالة جديدة من موقع أبو شعالة</h2>
        <hr style="border: 1px solid #e2e8f0;" />
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>رقم الهاتف:</strong> ${phone}</p>
        <hr style="border: 1px solid #e2e8f0;" />
        <h3>الرسالة:</h3>
        <p style="background: #f7fafc; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "فشل في إرسال الرسالة" };
  }
}
