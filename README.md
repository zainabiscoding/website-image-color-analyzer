# 🎨 Palettee - الطيف اللوني

> أداة ويب لتحليل الألوان وتوليد لوحات ألوان متناسقة من الصور

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-purple.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-yellow.svg)](https://vitejs.dev/)

## 📖 نظرة عامة

**Palettee** (الطيف اللوني) هي أداة ويب متقدمة لاستخراج الألوان من الصور وتوليد لوحات ألوان متناسقة. تساعد المصممين والمطورين على اكتشاف أنظمة ألوان جديدة وإعادة استخدامها في مشاريعهم.

✨ **المميزات الرئيسية:**
- 🌍 **دعم ثنائي اللغة**: عربي وإنجليزي مع تبديل فوري
- 🎨 **استخراج ذكي للألوان**: خوارزمية متقدمة لتحليل الصور
- 🔄 **توليد تنويعات**: 6 أنماط تناغم مختلفة (دافئ، بارد، حديث، طبيعي، متشابه، متكامل)
- 👁️ **معاينة حية**: شاهد الألوان في سياق تصميم موقع ويب
- 📋 **نسخ وتصدير**: CSS، JSON، أو نسخ فردي
- 🎲 **ثيمات عشوائية**: واجهة متغيرة مع كل ضغطة
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة
- ♿ **فحص التباين**: تحذيرات WCAG للتباين

## 🚀 التقنيات المستخدمة

- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - للكتابة الآمنة
- **Vite** - أداة البناء السريعة
- **Tailwind CSS 4** - للتصميم
- **Canvas API** - لمعالجة الصور
- **Lucide React** - للأيقونات
- **Google Fonts** - Caveat (إنجليزي) و Tajawal (عربي)

## 📦 التثبيت والتشغيل

### المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn أو pnpm

### خطوات التشغيل

```bash
# استنساخ المستودع
git clone https://github.com/zainabiscoding/palettee.git
cd palettee

# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev

# بناء نسخة الإنتاج
npm run build

# معاينة نسخة الإنتاج
npm run preview
```

## 🎯 كيفية الاستخدام

### 1. استخراج الألوان من صورة

1. اضغط على منطقة الرفع أو اسحب وأفلت صورة
2. انتظر حتى تكتمل عملية التحليل
3. ستظهر الألوان المستخرجة مع قيم HEX و RGB

### 2. توليد لوحات بديلة

- بعد استخراج الألوان، ستظهر 6 لوحات مولدة تلقائياً
- كل لوحة تمثل نمط تناغم مختلف
- اضغط على أي لوحة لمعاينتها

### 3. المعاينة الحية

- اضغط على زر "معاينة" لأي لوحة
- شاهد كيف تبدو الألوان في تصميم موقع ويب
- بدّل بين عرض الديكتوب والجوال

### 4. التصدير والنسخ

- **نسخ فردي**: اضغط على أي لون لنسخ قيمته
- **نسخ الكل**: انسخ جميع الألوان دفعة واحدة
- **تصدير CSS**: احصل على متغيرات CSS جاهزة
- **تصدير JSON**: احصل على بيانات الألوان بصيغة JSON

## 🏗️ هيكل المشروع

```
palettee/
├── src/
│   ├── components/         # مكونات React
│   │   ├── Header.tsx      # الهيدر مع أزرار التحكم
│   │   ├── ImageUpload.tsx # منطقة رفع الصور
│   │   ├── PaletteDisplay.tsx    # عرض اللوحة المستخرجة
│   │   ├── GeneratedPalettes.tsx # اللوحات المولدة
│   │   ├── PalettePreview.tsx    # المعاينة الحية
│   │   ├── ColorSwatch.tsx       # عرض اللون الفردي
│   │   └── LoadingState.tsx      # حالة التحميل
│   ├── utils/              # الأدوات المساعدة
│   │   ├── colorUtils.ts         # تحويلات الألوان
│   │   ├── colorExtraction.ts    # استخراج الألوان
│   │   ├── paletteGeneration.ts  # توليد اللوحات
│   │   ├── exportUtils.ts        # أدوات التصدير
│   │   └── translations.ts       # الترجمات
│   ├── types/              # تعريفات TypeScript
│   │   └── index.ts
│   ├── App.tsx             # المكون الرئيسي
│   ├── main.tsx            # نقطة الدخول
│   └── index.css           # الأنماط العامة
├── public/                 # الملفات العامة
├── index.html              # HTML الرئيسي
├── vite.config.ts          # إعدادات Vite
├── tailwind.config.js      # إعدادات Tailwind
├── tsconfig.json           # إعدادات TypeScript
└── package.json            # إعدادات المشروع
```

## 🎨 أنماط التوليد

| النمط | الوصف |
|------|-------|
| **Warm & Soft** | ألوان دافئة وناعمة |
| **Cool & Calm** | ألوان باردة وهادئة |
| **Modern & High Contrast** | تباين عالي وحديث |
| **Natural & Earthy** | ألوان طبيعية وترابية |
| **Analogous** | ألوان متجاورة في عجلة الألوان |
| **Complementary** | ألوان متكاملة ومتقابلة |

## 🌍 دعم اللغات

- **الإنجليزية**: واجهة كاملة بخط Caveat
- **العربية**: واجهة كاملة بخط Tajawal مع دعم RTL

## 🎨 المميزات التفاعلية

### زر Random
- يولد ثيم لوني جديد للواجهة بالكامل
- 8 ثيمات مختلفة للاختيار
- تغيير سلس مع انتقالات

### زر Colors
- يعرض تفاصيل الألوان الحالية
- HEX values لكل لون
- يتفاعل مع تغييرات الثيم

## 📱 التوافق

- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🤝 المساهمة

المساهمات مرحب بها! إذا كان لديك اقتراح:

1. Fork المشروع
2. أنشئ فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح تحت رخصة MIT.

## 👩‍💻 المطور

**zainabiscoding**

Made with ♥ by zainabiscoding

---

<div align="center">

**استمتع بإنشاء لوحات ألوان رائعة!** 🎨✨

[⭐ Star هذا المشروع](https://github.com/zainabiscoding/palettee) إذا أعجبك!

</div>
