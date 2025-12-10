# Deploying currency-watch-ly on Namecheap (Shared Hosting)

This guide walks you through publishing the Vite/React build on a Namecheap shared hosting account that uses cPanel.

## Prerequisites

1. A Namecheap account with an active shared hosting plan (Stellar / Stellar Plus / Stellar Business).
2. The domain you want to use is already added to the hosting plan (either as the main domain, an addon domain, or a subdomain).
3. Node.js 18+ installed on your local machine so you can build the project.
4. An SFTP client (FileZilla, Cyberduck) or access to the Namecheap cPanel File Manager.

## 1. Build the production assets locally

From the project root run:

```powershell
npm install
npm run build
```

The optimized static assets will be generated under the `dist/` folder.

## 2. Package the build output

Create a zip archive of the contents of `dist/` (not the folder itself). On Windows you can select all files inside `dist`, right-click, and choose **Send to → Compressed (zipped) folder**.

Name the archive something like `currency-watch-ly.zip`.

## 3. Upload to Namecheap via cPanel

1. Log into https://cpanel.namecheap.com/ using your hosting credentials.
2. Open **File Manager**.
3. Navigate to the document root of the domain:
   - Main domain: `public_html/`
   - Addon domain: `public_html/<addon-domain>/`
   - Subdomain: `public_html/<subdomain>/`
4. (Optional but recommended) Back up any existing site files by downloading them or moving them to a subfolder.
5. Click **Upload**, choose the `currency-watch-ly.zip` archive, and wait for the upload to finish.
6. After the upload completes, select the archive in File Manager and press **Extract**. Make sure you extract the files directly into the document root so that `index.html` sits at the top level.

## 4. Configure clean URLs (optional but recommended)

Vite’s build outputs relative asset paths, so no extra configuration is needed for simple static hosting. If you want to support client-side routing (React Router) across refreshes, add an `.htaccess` rule in the same directory as `index.html`:

```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

This routes all requests back to `index.html`, allowing React Router to handle navigation while still serving assets normally.

## 5. Verify the deployment

1. Visit your domain in the browser (e.g., https://example.com).
2. Open DevTools → Network tab and ensure all assets load over HTTPS.
3. Test the login flow, admin dashboard, and navigation to confirm everything works as expected.

## 6. Automating future deploys (optional)

If you frequently update the site, consider these improvements:

- Use the Namecheap **AutoBackup** feature or your own script to snapshot the document root before each deploy.
- Store the build ZIP in a private GitHub release or cloud storage so it can be reused or rolled back quickly.
- Script the zip-and-upload process with the Namecheap SFTP credentials using tools like `scp` or `rsync`.

With these steps you can confidently publish new versions of the site to Namecheap in just a few minutes.

## Data storage notes

- المستخدمون والمشرفون والعملات جميعها تُحفظ داخل `localStorage` على المتصفح، لذلك لا تحتاج إلى أي قاعدة بيانات خارجية عندما تستضيف المشروع على Namecheap.
- يتم إنشاء حساب مشرف افتراضي تلقائيًا (`Admin@gmail.com` / `Admin123!`). إذا حذفته عن طريق الخطأ ستتم إعادة إنشائه تلقائيًا عند أول تحميل.
- كل مستخدم يقوم بالتسجيل من المتصفح نفسه سيشاهد بياناته مباشرةً بعد إعادة تحميل الصفحة، لكن البيانات لا تُشارك بين المتصفحات/الأجهزة المختلفة. لاستخدام قاعدة بيانات مشتركة لاحقًا يمكنك استبدال طبقة التخزين داخل `DataContext` بواجهة برمجية (API) مستضافة على خادم منفصل.
