# AsbiMart — রিয়েল Auth0, Google OAuth, Facebook OAuth ও Email/SMS OTP সেটআপ গাইড

আসবিমার্ট ব্যাকএন্ডে (`backend/auth-services.js` ও `backend/server.js`) সম্পূর্ণ রিয়েল OAuth 2.0 (Auth0, Google, Facebook) এবং OTP ভেরিফিকেশন ইঞ্জিন যুক্ত করা হয়েছে। এখন শুধু নিচের ফ্রি API কীগুলো `backend/.env` ফাইলে বসিয়ে সার্ভার রিস্টার্ট করলেই সবগুলো লাইভ কাজ করবে!

---

## ০. রিয়েল Auth0 Universal Login চালু করা (ফ্রি — ২ মিনিট)

1. [Auth0 ড্যাশবোর্ড](https://manage.auth0.com/)-এ বিনামূল্যে একটি অ্যাকাউন্ট তৈরি করো অথবা সাইন ইন করো।
2. **Applications → Applications → Create Application** ক্লিক করো:
   - Name: `AsbiMart Web`
   - Application Type: **Regular Web Application**
3. অ্যাপ্লিকেশন তৈরির পর **Settings** ট্যাবে গিয়ে নিচের ফিল্ডগুলো কনফিগার করো:
   - **Allowed Callback URLs:**
     `http://localhost:5000/api/auth/auth0/callback, https://asbimart.pages.dev/api/auth/auth0/callback, https://asbimart-production.up.railway.app/api/auth/auth0/callback`
   - **Allowed Logout URLs:**
     `http://localhost:5000, https://asbimart.pages.dev, https://asbimart-production.up.railway.app`
   - **Allowed Web Origins:**
     `http://localhost:5000, https://asbimart.pages.dev, https://asbimart-production.up.railway.app`
4. নিচে স্ক্রল করে **Save Changes** ক্লিক করো।
5. একই পেজের ওপর থেকে **Domain**, **Client ID**, এবং **Client Secret** কপি করে `backend/.env` ফাইলে বসাও:
   ```env
   AUTH0_DOMAIN=তোমার_অ্যাথা_ডোমেন (যেমন: dev-xyz.us.auth0.com)
   AUTH0_CLIENT_ID=তোমার_ক্লায়েন্ট_আইডি
   AUTH0_CLIENT_SECRET=তোমার_ক্লায়েন্ট_সিক্রেট
   ```
6. সার্ভার রিস্টার্ট করলেই গ্রাহক সরাসরি Auth0 Universal Login দিয়ে সুরক্ষিতভাবে সাইন ইন করতে পারবেন!

---

## ১. রিয়েল Google অ্যাকাউন্ট লগইন চালু করা (ফ্রি — ৩ মিনিট)

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)-এ গিয়ে একটি নতুন প্রজেক্ট তৈরি করো (যেমন: `AsbiMart`)।
2. বাম মেনু থেকে **APIs & Services → OAuth consent screen**-এ গিয়ে **External** সিলেক্ট করো, অ্যাপের নাম `AsbiMart` ও তোমার ইমেইল `asby056@gmail.com` দিয়ে সেভ করো।
3. **Credentials → + CREATE CREDENTIALS → OAuth client ID** ক্লিক করো:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5000`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
4. তৈরি হওয়া **Client ID** ও **Client Secret** কপি করে `backend/.env` ফাইলে বসাও:
   ```env
   GOOGLE_CLIENT_ID=তোমার_ক্লায়েন্ট_আইডি
   GOOGLE_CLIENT_SECRET=তোমার_ক্লায়েন্ট_সিক্রেট
   ```
5. সার্ভার রিস্টার্ট করলেই **Google** বাটনে ক্লিক করলে তোমার ডিভাইস/ব্রাউজারের আসল সব গুগল অ্যাকাউন্টের তালিকা দেখাবে!

---

## ২. রিয়েল Facebook অ্যাকাউন্ট লগইন চালু করা (ফ্রি — ৩ মিনিট)

1. [Meta for Developers](https://developers.facebook.com/apps/)-এ গিয়ে **Create App → Consumer / Authenticate and request data from users with Facebook Login** সিলেক্ট করো।
2. **Facebook Login → Settings**-এ গিয়ে **Valid OAuth Redirect URIs**-এ বসাও:
   `http://localhost:5000/api/auth/facebook/callback`
3. **App Settings → Basic** থেকে **App ID** ও **App Secret** কপি করে `backend/.env`-এ বসাও:
   ```env
   FACEBOOK_APP_ID=তোমার_ফেসবুক_অ্যাপ_আইডি
   FACEBOOK_APP_SECRET=তোমার_ফেসবুক_অ্যাপ_সিক্রেট
   ```

---

## ৩. রিয়েল Gmail / Email OTP চালু করা (ফ্রি — ২ মিনিট)

1. তোমার Gmail অ্যাকাউন্টে (`asby056@gmail.com`) **2-Step Verification** চালু করো।
2. [Google App Passwords](https://myaccount.google.com/apppasswords) পেজে গিয়ে অ্যাপের নাম `AsbiMart OTP` দিয়ে একটি **১৬ অক্ষরের App Password** তৈরি করো।
3. `backend/.env` ফাইলে বসাও (কোনো স্পেস ছাড়া):
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=asby056@gmail.com
   SMTP_PASS=তোমার_১৬_অক্ষরের_অ্যাপ_পাসওয়ার্ড
   ```
4. সার্ভার রিস্টার্ট করলেই নতুন অ্যাকাউন্ট খোলার সময় ইউজারের আসল জিমেইল ইনবক্সে ব্র্যান্ডেড ৬-ডিজিটের OTP কোড চলে যাবে!

---

## ৪. বাংলাদেশি মোবাইল নম্বরে রিয়েল SMS OTP চালু করা (ঐচ্ছিক)

বাংলাদেশে যেকোনো SMS গেটওয়ে (যেমন **BulkSMSBD** বা **GreenWeb**) থেকে API Key ও Sender ID নিয়ে `backend/.env`-এ বসাও:
```env
SMS_PROVIDER=bulksmsbd
SMS_API_URL=http://bulksmsbd.net/api/smsapi
SMS_API_KEY=তোমার_এসএমএস_এপিআই_কী
SMS_SENDER_ID=তোমার_সেন্ডার_আইডি
```

---

> **গুরুত্বপূর্ণ:** `backend/.env` ফাইলে কীগুলো বসানোর পর `start-asbimart.bat` অথবা সার্ভারটি একবার রিস্টার্ট করবে।
