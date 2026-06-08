import { Resend } from "resend";

// Resend client is created lazily so the app can build/boot without a key.
// Calls fail loudly (caught by the server action) only when an email is sent.
let resend: Resend | null = null;
function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured — cannot send email. Add it to the environment."
    );
  }
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

const from = () => process.env.EMAIL_FROM || "Abu Shaala <onboarding@resend.dev>";
const appUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://abushala.ly";

const wrap = (title: string, body: string) => `
  <div dir="rtl" style="font-family: Arial, Tahoma, sans-serif; background:#f7fafc; padding:24px;">
    <div style="max-width:520px; margin:0 auto; background:#fff; border-radius:12px; padding:28px; border:1px solid #e2e8f0;">
      <h2 style="color:#1a365d; margin:0 0 16px;">${title}</h2>
      ${body}
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />
      <p style="color:#94a3b8; font-size:12px; margin:0;">مكتب أبو شعالة للتحويلات المالية — مصراتة، ليبيا</p>
    </div>
  </div>
`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block; background:#1a365d; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:bold;">${label}</a>
`;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${appUrl()}/new-verification?token=${token}`;
  await getResend().emails.send({
    from: from(),
    to: email,
    subject: "تأكيد بريدك الإلكتروني — أبو شعالة",
    html: wrap(
      "تأكيد البريد الإلكتروني",
      `<p style="color:#334155; line-height:1.7;">شكرًا لتسجيلك في منصة أبو شعالة. اضغط على الزر أدناه لتفعيل حسابك:</p>
       <p style="margin:24px 0;">${button(confirmLink, "تفعيل الحساب")}</p>
       <p style="color:#64748b; font-size:13px;">إذا لم يعمل الزر، انسخ هذا الرابط في المتصفح:<br/><span dir="ltr" style="word-break:break-all;">${confirmLink}</span></p>
       <p style="color:#94a3b8; font-size:12px;">ينتهي هذا الرابط خلال ساعة واحدة. إذا لم تطلب هذا، تجاهل الرسالة.</p>`
    ),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${appUrl()}/new-password?token=${token}`;
  await getResend().emails.send({
    from: from(),
    to: email,
    subject: "إعادة تعيين كلمة المرور — أبو شعالة",
    html: wrap(
      "إعادة تعيين كلمة المرور",
      `<p style="color:#334155; line-height:1.7;">تلقينا طلبًا لإعادة تعيين كلمة مرور حسابك. اضغط على الزر أدناه لاختيار كلمة مرور جديدة:</p>
       <p style="margin:24px 0;">${button(resetLink, "إعادة تعيين كلمة المرور")}</p>
       <p style="color:#64748b; font-size:13px;">إذا لم يعمل الزر، انسخ هذا الرابط في المتصفح:<br/><span dir="ltr" style="word-break:break-all;">${resetLink}</span></p>
       <p style="color:#94a3b8; font-size:12px;">ينتهي هذا الرابط خلال ساعة واحدة. إذا لم تطلب إعادة التعيين، تجاهل الرسالة وستبقى كلمة مرورك كما هي.</p>`
    ),
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const { name, email, phone, message } = data;
  const to = process.env.CONTACT_EMAIL || "Abushaala01@gmail.com";
  await getResend().emails.send({
    from: from(),
    to,
    replyTo: email,
    subject: `رسالة جديدة من ${name} — موقع أبو شعالة`,
    html: wrap(
      "رسالة جديدة من الموقع",
      `<p><strong>الاسم:</strong> ${name}</p>
       <p><strong>البريد الإلكتروني:</strong> <span dir="ltr">${email}</span></p>
       <p><strong>رقم الهاتف:</strong> <span dir="ltr">${phone}</span></p>
       <h3 style="color:#1a365d;">الرسالة:</h3>
       <p style="background:#f7fafc; padding:15px; border-radius:8px; color:#334155; line-height:1.7;">${message}</p>`
    ),
  });
}
