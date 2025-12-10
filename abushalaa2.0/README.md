# Welcome to your Lovable project

## Project info

Admin@gmail.com
Admin123!

**URL**: https://lovable.dev/projects/5df48eee-d042-4b1e-af5b-c8915b2c344a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5df48eee-d042-4b1e-af5b-c8915b2c344a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5df48eee-d042-4b1e-af5b-c8915b2c344a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Admin dashboard & data management

- Visit `/admin` from the navigation bar to open the dashboard.
- The default super admin credentials are `Admin@gmail.com` / `Admin123!`. Sign in with them through `/login` and you will be redirected to the dashboard.
- Once an admin session is active, the **لوحة التحكم** link and the logout button become visible in the navbar; non-admin visitors cannot access the route directly.
- Use the **إدارة أسعار العملات** table to edit existing rows, then press **حفظ الكل** to push the changes to the public table on the home page.
- Add completely new currencies with the form underneath the table or reset everything back to the seeded defaults via **استعادة الافتراضي**.
- The change column is filled automatically: كل مرة تحدّث سعر الشراء، يتم حساب فرق اليوم الجديد عن السعر المخزن من اليوم السابق وعرضه مباشرة للزوار.
- The **إدارة المشرفين** section lets an authenticated admin add new admins or delete existing ones (while ensuring at least one admin remains). Every admin account has full dashboard permissions immediately.
- Every registration submitted through `/register` is stored locally and listed inside the **سجل المستخدمين** table so you always see who signed up last.
- Currency data, admin accounts، وحالات تسجيل الدخول كلها محفوظة داخل `localStorage`، ما يجعل التطبيق يعمل بالكامل على الاستضافة الثابتة (مثل Namecheap) بدون أي خدمات إضافية.
- يوجد حساب مشرف افتراضي دائمًا (`Admin@gmail.com` / `Admin123!`) ويتم إنشاء حساب آخر تلقائيًا إن لم يكن هناك أي حساب إداري نشط.
- نموذج "نسيت كلمة المرور" يربط التحقق بالبريد الإلكتروني مع خطوة تعيين كلمة مرور جديدة مباشرةً، ويقوم بتحديث كلمة المرور المخزنة محليًا مع التحقق من الحد الأدنى للطول والتطابق.

## Social media

- TikTok: https://www.tiktok.com/@user9alaqsa0?_r=1&_t=ZM-91XKJ8uAqLr – تابع أحدث الفيديوهات من لوحة التحكم مباشرة عبر قسم "تابعنا على تيك توك" في الصفحة الرئيسية.
- WhatsApp channel: https://whatsapp.com/channel/0029VadPJD342DcgLTJfMn2x – رابط الانضمام يظهر أيضًا في الصفحة الرئيسية ضمن قسم قنوات التواصل.

## Deployment reference

- Detailed steps for publishing the production build on Namecheap (cPanel) are documented in `guide.md`.
