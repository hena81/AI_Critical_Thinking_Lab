# نشر الموقع على SmarterASP.NET مع حفظ JSON

هذا الإصدار يحفظ بيانات الموقع على السيرفر داخل ملفات JSON في مجلد `App_Data`.

يوجد مساران للتشغيل:

- ASP.NET 4.8 عبر `api.ashx`: الأسهل، ولا يحتاج نشر `publish`.
- ASP.NET Core عبر `Program.cs`: يحتاج نشر Publish صحيح ووجود Runtime مناسب على الاستضافة.

إذا ظهر خطأ `HTTP Error 500.31 - Failed to load ASP.NET Core runtime` فاستخدم مسار ASP.NET 4.8 وارفع `api.ashx` مع `web.config` الحالي.

## الملفات المهمة

- `api.ashx`
- `web.config`
- `index.html`
- مجلد `css`
- مجلد `js`

## طريقة النشر المقترحة

1. احذف أو استبدل `web.config` القديم الخاص بـ ASP.NET Core إن كان موجودًا على الاستضافة.
2. ارفع `api.ashx` و`web.config` وملفات الموقع.
3. تأكد أن App Pool مضبوط على ASP.NET 4.8 / Integrated إن كان الخيار متاحًا.

## أين تحفظ البيانات؟

عند أول تشغيل سيُنشئ التطبيق مجلد:

`App_Data`

وبداخله:

- `users.json`
- `sessions.json`
- `settings.json`
- `customChallenges.json`

## اختبار سريع بعد النشر

افتح:

`https://your-domain.com/api.ashx/health`

إذا ظهرت:

`{"ok":true}`

فهذا يعني أن التخزين على السيرفر يعمل. بعدها جرّب إنشاء حساب جديد، ثم افتح الموقع من متصفح أو جهاز آخر وسجّل الدخول بنفس الحساب.

## الحساب الافتراضي

- اسم المستخدم: `teacher`
- كلمة المرور: `teacher123`

## ملاحظة

إذا فتحت `index.html` مباشرة أو رفعت الملفات كـ static site فقط، سيعود الموقع تلقائيًا إلى التخزين المحلي في المتصفح `IndexedDB`.
