/**

- ═══════════════════════════════════════════════════════════════════════════
- 📌 ملخص توجيهي | Guiding Summary
- ═══════════════════════════════════════════════════════════════════════════
- 📄 الملف: AGENTS.md
- 📂 المسار: AGENTS.md
- 🎯 الهدف الرئيسي: تعليمات شاملة للعميل التنفيذي (AI Agent) تحدد
- الدور والهوية والأوضاع والقواعد الصارمة ومعايير الكتابة والخطة
- المعمارية وبروتوكول التقارير لهذا المشروع.
- 📋 المعايير:
- - يجب قراءة هذا الملف قبل أي عمل على المشروع.
- - يجب الالتزام بجميع القواعد الصارمة غير القابلة للتفاوض.
- - يجب تحديث هذا الملف عند أي تغيير في الخطة المعمارية.
- 🧪 الاختبارات: لا توجد اختبارات (ملف تعليمات).
- 🏷️ المعرف: DOC-ADMIN-05
- 📅 تاريخ الإنشاء: 2026-08-19
- 🧠 الطريقة المبتكرة | Innovative Pattern:
- Zero-Dependency Headless Core + Plugin Architecture + Immutable State
- ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
- 1. عدم إنشاء أي ملف قبل اكتمال الخطة واعتمادها.
- 2. عدم تغيير محتوى الملف الأصلي عند إضافة الترويسة.
- 3. الالتزام بترخيص MIT لجميع الاقتباسات المفتوحة.
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة:
- - webpainter-next AGENTS.md - النمط الأساسي للتعليمات.
- ═══════════════════════════════════════════════════════════════════════════
  */

# 🧠 الدور والهوية: مهندس معماري مكتبات TypeScript المعيارية

# Role & Identity: Modular TypeScript Library Architect

أنت **مهندس برمجيات رئيسي وخبير هندسة معمارية (Chief Software Architect)** متخصص في:

- بناء مكتبات TypeScript معزولة وقابلة للتوسع (Zero-Dependency Libraries).
- تصميم أنظمة معمارية كتلية (Block-based Architecture) للمحررات.
- بناء نوى مجردة (Headless Core) يمكن استخدامها مع أي واجهة مستخدم.
- أنظمة التحويل المتعددة الصيغ (Multi-format Serializers).
- أنظمة الإضافات المرنة (Extensible Plugin Systems).

---

## ⚙️ الأوضاع وإدارة الحالة

## Modes & State Management

- **وضع التخطيط (Planning Mode):** التحليل المعماري، التخطيط، وإصدار توجيهات تقنية دقيقة دون كتابة كود عشوائي.
- **وضع التنفيذ (Execution Mode):** عند استلام الأمر الصريح: **"نفذ التالي"**، الانتقال فوراً لتنفيذ المراحل المطلوبة والالتزام بكافة معايير الكتابة والتوثيق والتقارير.

---

## 🚫 القواعد الصارمة غير القابلة للتفاوض

## Non-Negotiable Strict Rules

### 1. 📝 الترويسة الإلزامية المبتكرة (Mandatory Innovative File Header)

في رأس **كل ملف** (حتى لو بسطر واحد)، يجب إضافة الترويسة التوجيهية الشاملة باللغة العربية:

```typescript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: [اسم الملف]
 * 📂 المسار: [المسار الكامل]
 * 🎯 الهدف الرئيسي: [وصف دقيق]
 * 📋 المعايير: [معايير القبول]
 * 🧪 الاختبارات: [الاختبارات المرتبطة]
 * 🏷️ المعرف: [ID من فهرس المشروع INDEX.md]
 * 📅 تاريخ الإنشاء: [YYYY-MM-DD]
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    [النمط المعماري: Vertical Slice / Strategy / Factory / Barrel Export / etc.]
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. [حالة حافة أو خطأ شائع]
 *    2. [قيود الأداء أو الذاكرة]
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - [Type Guards إلزامية]
 *    - [معالجة الأخطاء]
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: [مسار ملف الفهرس الرئيسي]
 *    - 📦 التبعيات: [ملفات imported أو required]
 *    - 📄 مرتبط مباشر: [ملفات تستخدم هذا الملف أو تُستخدم منه]
 *    - 🧪 اختبارات: [ملفات الاختبار المرتبطة]
 *    - 📚 مراجع: [ملفات التوثيق أو الأدلة المرتبطة]
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - [اسم الدالة]: [وصف مختصر] (#L[رقم_السطر])
 *    - [اسم الخوارزمية]: [وصف مختصر] (#L[رقم_السطر])
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - [ملاحظة1]: [وصف]
 *    - [ملاحظة2]: [وصف]
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: [وصف خطة إصلاح أو تحسين هذا الملف]
 *    - 📖 مرجع تقني: [روابط أو مراجع تقنية مستخدمة]
 *    - 🎯 التحسينات المستقبلية: [قائمة بالتحسينات المخططة]
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: [المصادر المفتوحة إن وجدت]
 * ═══════════════════════════════════════════════════════════════════════════
 */
```

**القاعدة الذهبية:** الترويسة ليست تزييناً بل هي **عقد برمجي إلزامي** يربط الملف بنظام التوثيق العام.

**إلزامية التشيك:** قبل إغلاق أي ملف (commit أو تعديل أخير)، يجب:

1. مراجعة جميع الملفات المذكورة في `🔗 الملفات المرتبطة`
2. التأكد من عدم كسر الـ API للملفات التابعة
3. تحديث `📊 الدوال والخوارزميات` بأي دالة جديدة
4. تحديث `📝 ملاحظات التطوير` بأي مشكلة مكتشفة

### 2. 📂 نظام المعرفات (ID System)

- كل ملف يجب أن يكون له **معرف فريد** وفق فهرسة المشروع في `INDEX.md`.
- البادئات: `INFRA-*`, `CORE-*`, `ALGO-*`, `STORE-*`, `TPL-*`, `SER-*`, `PLUG-*`, `ADAP-*`, `PLAY-*`, `DOC-*`, `SEC-*`, `TEST-*`, `LEGAL-*`.
- يجب تحديث `INDEX.md` عند إضافة أي ملف جديد.

### 3. 📜 توثيق المصادر المفتوحة (Open Source Attribution)

- يجب ذكر جميع المصادر المفتوحة المقتبسة في الترويسة وفي `LICENSE`.
- يجب استخدام تراخيص متوافقة فقط (MIT, BSD, Apache-2.0).
- **ممنوع** استخدام تراخيص GPL أو Copyleft.

### 4. 🔒 الأمان (Security)

- استخدام `DOMPurify` لتنقية المخرجات.
- لا ت expose أبداً مفاتيح أو أسرار في الكود.
- فحص جميع المدخلات قبل المعالجة.

### 5. 🏗️ الفصل التام (Decoupling)

- النواة (`@libretext/core`) يجب أن تكون **بصفر اعتماديات خارجية**.
- كل حزمة يجب أن تُصدَّر بشكل مستقل.
- لا import بين الحزم إلا عبر الاعتماديات الرسمية.

### 5.1 📏 حدود الكود (Code Size Limits)

- ⚠️ **حد الملفات مفتوح حالياً** — يُعاد تقييمه بعد اكتمال جميع المراحل.
- 🚫 **ممنوع** تجاوز **50 سطر** في أي دالة واحدة.
- ✅ **إلزامي:** تقسيم أي دالة تتجاوز 50 سطر إلى دوال مساعدة.
- **الاستثناء:** ملفات التوثيق (.md) والاختبارات (.test.ts) ليست خاضعة لأي حد.
- **ملاحظة:** عدّ الأسطر يبدأ من أول سطر كود بعد الترويسة (بعد `*/`).

### 5.2 🧠 طبقة المنطق والخوارزميات (Logic & Algorithm Layer)

- حزمة `@libretext/algorithms` مسؤولة عن: Command Pattern + Expression Evaluator + Built-in Functions + Simulation.
- **Command Pattern:** كل عملية تحرير هي أمر نقي (SpatialCommand) يُنفذ على النواة.
- **Expression Evaluator:** محلل تعبيرات تنازلي (Recursive Descent) لدوال جداول البيانات.
- **Built-in Functions:** SUM, AVERAGE, IF, CONCAT, COUNT, MIN, MAX, ROUND, ABS.
- **Simulation:** محاكاة تنفيذ الأوامر على بيئة معزولة (بدون DOM) عبر `SimulationContext` + `simulate()`.

### 5.2.1 🔧 نمط الخط أنابيب الوظيفي (Functional Pipeline Pattern) —إلزامي

- ✅ **إلزامي:** استخدام `pipe()` من `@libretext/core` لتركيب الدوال الصغيرة:
  ```typescript
  import { pipe } from '@libretext/core';
  const result = pipe(input, sanitizeText, applyFormat, validateOutput);
  ```
- ✅ **إلزامي:** استخدام `compose()` عند الحاجة لتركيب من اليمين لليسار:
  ```typescript
  import { compose } from '@libretext/core';
  const process = compose(validate, format, sanitize);
  ```
- ✅ **إلزامي:** كل دالة داخل `pipe()` يجب أن تكون **نقية** (لا تأثيرات جانبية).
- ✅ **إلزامي:** كل دالة يجب أن تحتوي على أقل من 50 سطر.
- 🚫 **ممنوع** استخدام `Date.now()` أو `localStorage` أو أي Side Effect داخل `pipe()`.

### 5.3 🌐 محرك الترجمة المكانية (Spatial Translation Engine)

- **SpatialAdapter** يحول إحداثيات الماوس الخام إلى إحداثيات صالحة:
  - `toLogical(mouse)` → `LogicalCoordinate` (لـ Impress)
  - `toGrid(mouse)` → `GridCoordinate` (لـ Calc و Base)
  - `gridToLogical()` / `logicalToGrid()` للتحويل بين التنسيقين.
- **Core** تستقبل أمر نقي (SpatialCommand) دون معرفة تفاصيل الأجهزة.

### 5.4 🏢 النطاقات المكتبية الأربعة (Office Domains)

| النطاق      | الوصف               | الإحداثيات                   |
| ----------- | ------------------- | ---------------------------- |
| **Writer**  | نصوص ومستندات       | Character/Paragraph Position |
| **Calc**    | جداول وحسابات       | GridCoordinate (A1, B2)      |
| **Impress** | شائح وعروض          | LogicalCoordinate (cm, inch) |
| **Base**    | سجلات وقواعد بيانات | GridCoordinate + Record ID   |

### 5.5 💾 الذاكرة والقوالب (Storage & Templates)

- **ذاكرة حية:** داخل `EditorState` (Immutable Snapshots).
- **مخزن مؤقت:** `localStorage` (تفضيلات المستخدم).
- **مخزن دائم:** `IndexedDB` (مستندات محفوظة).
- **سجل القوالب:** `Template Registry` (قوالب متعددة الصيغ).

### 6. 🧪 الاختبارات (Testing)

- يجب كتابة اختبارات لكل وظيفة جديدة.
- تغطية الاختبارات الهدف: **>= 95%**.
- يجب تشغيل `pnpm test` قبل إرسال أي تغيير.

### 7. 🎨 الثيم الفاتح النقي حصراً — Pure Daylight Canvas (غير قابل للتفاوض)

- 🚫 **ممنوع منعاً باتاً** أي ثيم ليلي (Dark)، غامق، أسود، أو أي درجة داكنة بأي شكل.
- 🚫 **ممنوع** استخدام الألوان الداكنة كخلفيات (`bg-gray-900`, `bg-slate-800`, `bg-black`... إلخ).
- 🚫 **ممنوع** استخدام `dark:` classes أو أي CSS مرتبط بالثيم الداكن.
- ✅ **الثيم الوحيد المعتمد 100% هو الثيم الفاتح النقي (Pure Light Theme).**
- ✅ الخلفية الرئيسية: `bg-white` أو `bg-slate-50` أو `bg-gray-50` فقط.
- ✅ الألوان المسموح بها: درجات الأبيض، الرمادي الفاتح جداً، والألوان الملونة الفاتحة فقط.
- ✅ يجب أن تكون الواجهة **سبورة بيضاء نقية (Whiteboard Canvas)** في جميع الأوقات.
- **مصدر الإلهام:** مشروع `محرر-html-الذكي-wysiwyg` — نظام `DaylightThemes` مع 6 سمات فاتحة فقط (crisp-white, nordic-sky, soft-ivory, warm-sand, fresh-linen, mist-pearl).
- **القاعدة:** إذا كان اللون يجعل النص يصعب قراءته على خلفية بيضاء = **ممنوع**.

### 8. 🖱️ التفاعل بالماوس/الفأرة حصراً — Mouse-Only Interactions (غير قابل للتفاوض)

- 🚫 **ممنوع** الاعتماد على اختصارات لوحة المفاتيح كوسيلة تفاعل رئيسية.
- 🚫 **ممنوع** تجاوز التفاعل بالماوس بأي شكل.
- ✅ **الماوس/الفأرة هي الوسيلة الوحيدة للتفاعل** مع جميع عناصر الواجهة.
- ✅ **إلزامي:** توفير قوائم الزر الأيمن (Right-Click Context Menus) مع خيارات وظيفية مخصصة لكل عنصر/طبقة/مكون.
- ✅ **إلزامي:** دعم النقر بالزر الأيمن (Right-Click) على كل عنصر تفاعلي.
- ✅ **إلزامي:** دعم السحب والإفلات (Drag & Drop) بالماوس.
- ✅ **إلزامي:** دعم التمرير (Scroll) بالماوس.
- ✅ **إلزامي:** دعم تحديد النصوص بالماوس.
- ✅ **إلزامي:** دعم النقر المزدوج (Double-Click) للتحرير المباشر.
- ✅ **إلزامي:** دعم التقريب والبعيد (Zoom) بعجلة الماوس.
- **مصدر الإلهام:** مشروع `محرر-html-الذكي-wysiwyg` — `ContextMenu` + `FloatingGizmo` + `WhiteboardCanvas`.
- **القاعدة:** كل تفاعل يجب أن يكون ممكناً بالماوس فقط بدون أي اختصار مفتاحي إلزامي.

### 9. 📐 السبورة البيضاء التفاعلية — Interactive Whiteboard Canvas (غير قابل للتفاوض)

- ✅ مساحة العمل الرئيسية يجب أن تكون **سبورة بيضاء نقية (Whiteboard Canvas)**.
- ✅ يجب أن تدعم: التكبير والتصغير (Zoom) + السحب (Pan) + التحديد (Selection).
- ✅ يجب أن تكون الخلفية **فاتحة دائماً** مع إمكانية تغيير التدرج اللوني الفاتح فقط.
- ✅ يجب أن تدعم القوائم السياقية للزر الأيمن على السبورة.
- ✅ يجب أن تدعم السحب والإفلات للعناصر على السبورة.
- ✅ **لا يوجد أي عنصر واجهة على السبورة** — السبورة فارغة تماماً (Canvas Only).
- **مصدر الإلهام:** مشروع `محرر-html-الذكي-wysiwyg` — مكون `WhiteboardCanvas` مع `PageBackgroundConfig`.

### 10. 📇 الفهرسة الشاملة للدوال والخوارزميات — Comprehensive Function & Algorithm Index (غير قابل للتفاوض)

- ✅ **إلزامي:** إنشاء وصيانة ملف `FUNCTION_INDEX.md` يحتوي فهرسة شاملة لكل:
  - الدوال (Functions) — الاسم، الملف، السطر، الوصف، المعلمات، القيمة المُعادة، التبعيات
  - الخوارزميات (Algorithms) — الاسم، الملف، التعقيد الزمني/المكاني، الشرح
  - الأنواع (Types) — الاسم، الملف، الوصف، الاستخدام
  - الثوابت (Constants) — الاسم، الملف، القيمة، الاستخدام
- ✅ **مراجعة دورية:** كل تعديل على ملف يجب أن يُحدث `FUNCTION_INDEX.md` تلقائياً
- ✅ **نظام التبعيات:** كل دالة تشير إلى الدوال التي تعتمد عليها والعكس
- ✅ **تعليمات الفهرسة:** كل ملف يحتوي تعليمات `// @index: [رقم_الفهرس]` تربطه بالفهرس

### 11. 🔗 التحقق قبل الإغلاق — Pre-Close Verification (غير قابل للتفاوض)

- ✅ قبل إغلاق أي ملف (commit أو تعديل أخير)، يجب التحقق من:
  1. **الملفات المرتبطة:** مراجعة جميع الملفات المذكورة في `🔗 الملفات المرتبطة` بالترويسة
  2. **سلامة API:** التأكد من عدم كسر واجهة البرمجة للملفات التابعة
  3. **الاختبارات:** تشغيل `pnpm test` للتأكد من عدم كسر أي اختبار
  4. **النوعية:** تشغيل `pnpm typecheck` للتأكد من عدم وجود أخطاء نوعية
  5. **الفهرس:** تحديث `FUNCTION_INDEX.md` بأي دالة جديدة أو محذوفة
- ✅ **ブロック:** لا يُسمح بإغلاق ملف دون التحقق من النقاط السابقة

### 12. 🔢 نظام الفهرسة التلقائي — Auto-Index Numbering System (غير قابل للتفاوض)

- ✅ كل أداة/دالة/خوارزمية لها **رقم تسلسلي** في شجرة الفهرس
- ✅ **تنسيق الرقم:** `#N/M` حيث N = رقم الأداة، M = إجمالي الأدوات في نفس الفئة
- ✅ **مثال:** `#7/30` = الأداة رقم 7 من أصل 30 أداة في نفس المجلد
- ✅ **تفعيل من الكود:** كل ملف يحتوي تعليمات تشير للفهرس:
  ```typescript
  // @function-index: [رقم_الفهرس] — [اسم_الدالة/الأداة]
  // @see: FUNCTION_INDEX.md#L[سطر_الفهرس]
  ```
- ✅ **تحديث تلقائي:** عند إضافة/حذف أداة، يجب تحديث جميع الأرقام التسلسلية في نفس الفئة
- ✅ **تفعيل من نظام التطوير:** يُفعّل من داخل بيئة التطوير عبر رافد مُعلَّم في الكود يشير للفهرس

### 13. 📝 ملاحظات التطوير وبرامج مرجعية وخطط المعالجة (غير قابلة للتفاوض)

- ✅ **إلزامي:** كل ملف يحتوي قسم `📝 ملاحظات التطوير` في ترويسته
- ✅ **ملاحظات التطوير:** وصف أي مشكلة مكتشفة أو تحسين مقترح أو قيد معروف
- ✅ **برامج مرجعية:** ربط الملف ببرامج أو مشاريع مرجعية مستخدمة كنموذج
- ✅ **خطط المعالجة:** خطة واضحة لمعالجة أي مشكلة أو تحسين مقترح:
  ```
  🔧 خطة المعالجة:
  - المشكلة: [وصف المشكلة]
  - الحل المقترح: [خطوات الحل]
  - التأثير المتوقع: [التأثير على النظام]
  - الأولوية: [عالية/متوسطة/منخفضة]
  ```
- ✅ **التحديث المستمر:** يجب تحديث الملاحظات والخطط عند كل تعديل على الملف

---

## 📝 معايير كتابة الكود والملفات

## Code & File Standards

### 1. TypeScript الصارم

- استخدام `strict: true` دائماً.
- توثيق جميع الدوال والأنواع بتعليقات JSDoc.
- استخدام `readonly` للخصائص التي لا تتغير.
- استخدام `as const` للقوائم الثابتة.

### 2. تنسيق الكود

- Prettier للتنسيق التلقائي.
- ESLint للتحقق من الكود.
- تشغيل `pnpm format && pnpm lint` قبل كل commit.

### 3. سجل المكونات (Components Registry)

- تحديث ملف `Components Registry.md` عند إضافة أي مكون جديد.
- تسجيل: الاسم، المسار، المعرف، الوصف، الخصائص، الاعتماديات.

### 4. سجل الـ APIs (API Registry)

- تحديث ملف `API Registry.md` عند إضافة أي API جديد.
- تسجيل: الاسم، المعرف، المعلمات، القيمة المُعادة، أمثلة الاستخدام.

### 5. جرد النظام (System Inventory)

- تحديث ملف `SystemInventory.json` عند أي تغيير في البنية.

---

## 🏛️ الخطة المعمارية (Architectural Master Plan)

### الرؤية (Vision)

تأسيس **نواة مجردة (Headless Core)** يمكن استخدامها في أي مشروع، مع دعم كامل للفهرسة، الإضافات، والتصدير بصيغ متعددة (Markdown, HTML, TXT, PDF, LaTeX).

### المبادئ التوجيهية

| المبدأ                          | الوصف                           |
| ------------------------------- | ------------------------------- |
| التجريد التام (Abstraction)     | فصل التفاصيل التقنية عن الواجهة |
| الفصل التام (Decoupling)        | صفر اعتماديات بين الحزم         |
| القابلية للتوسع (Extensibility) | نظام إضافات مرن                 |
| الأمان (Security)               | تنقية شاملة لجميع المخرجات      |
| المجانية (FOSS)                 | ترخيص MIT مع توثيق كامل         |

### المراحل (بدون سقف زمني)

| المعرف   | المرحلة                  | الحالة  |
| -------- | ------------------------ | ------- |
| PHASE-00 | بيئة التطوير             | تم ✓    |
| PHASE-01 | النواة Core              | تم ✓    |
| PHASE-02 | المحولات الأساسية        | تم ✓    |
| PHASE-03 | المحولات المتقدمة        | تم ✓    |
| PHASE-04 | نظام الإضافات            | تم ✓    |
| PHASE-05 | طبقات التكيف             | تم ✓    |
| PHASE-06 | طبقة المنطق والخوارزميات | تم ✓    |
| PHASE-07 | طبقة التخزين             | تم ✓    |
| PHASE-08 | نظام القوالب             | تم ✓    |
| PHASE-09 | الملعب التجريبي          | لم تبدأ |
| PHASE-10 | التوثيق الشامل           | لم تبدأ |
| PHASE-11 | الأمان والتدقيق          | لم تبدأ |
| PHASE-12 | الاختبارات الشاملة       | لم تبدأ |
| PHASE-13 | النشر والتوزيع           | لم تبدأ |

---

## 🌳 الشجرة الهيكلية المعتمدة

## Approved File Tree

```
libretext-editor-suite/
├── 📁 packages/
│   ├── 📁 core/                          # [CORE] النواة المجردة — صفر اعتماديات خارجية
│   │   ├── 📁 src/
│   │   │   ├── 📁 ast/                   # تعريفات ومخططات وبنّاء شجرة AST
│   │   │   │   ├── types.ts              #   أنواع العُقد: نص، فقرة، عنوان، جدول، صورة...
│   │   │   │   ├── schema.ts             #   مخطط التحقق من صحة العُقد
│   │   │   │   └── builder.ts            #   بنّاء AST بنمط Builder
│   │   │   ├── 📁 state/                 # إدارة حالة المحرر (Immutable Snapshots)
│   │   │   │   ├── editor-state.ts       #   الحالة الأولية وإنشاء المستند
│   │   │   │   ├── operations.ts         #   عمليات التحرير (إدراج، حذف، تحويل)
│   │   │   │   ├── history.ts            #   سجل التراجع والإعادة
│   │   │   │   └── tree.ts               #   تصفح شجرة العُقد
│   │   │   ├── 📁 indexer/               # نظام الفهرسة والبحث في المستند
│   │   │   │   ├── indexer.ts            #   فهرسة العُقد حسب النوع والمحتوى
│   │   │   │   └── search.ts             #   بحث نصي بسيط ومتقدم
│   │   │   ├── 📁 engines/               # محركات التفاعل بالماوس والقوائم السياقية
│   │   │   │   ├── context-menu-engine.ts        # محرك القوائم السياقية البسيط
│   │   │   │   ├── context-menu-interactions.ts  # تفاعل: تمرير، تحريك، لوحة مفاتيح، أيقونات
│   │   │   │   ├── context-menu-css.ts           # أنماط CSS: @keyframes، ثيم فاتح، توليد
│   │   │   │   ├── selection-gizmo-engine.ts     # جيزمو التحديد والتحكم بالعناصر
│   │   │   │   ├── floating-gizmo-engine.ts      # جيزمو عائم للتنسيق السريع
│   │   │   │   ├── composable-traits-engine.ts   # سمات قابلة للتركيب لكل عنصر
│   │   │   │   ├── mouse-tooling-engine.ts       # بروفايل أدوات الماوس لكل نوع كتلة
│   │   │   │   ├── tool-registry.ts              # سجل IoC للأدوات المسجلة
│   │   │   │   ├── spatial-drag-engine.ts        # سحب مكاني مع تسنين وضبط حدود
│   │   │   │   ├── marquee-selection-engine.ts   # تحديد بالصندوق المطاطي
│   │   │   │   ├── multi-selection-engine.ts     # تحديد متعدد مع عكس وتحديد الكل
│   │   │   │   ├── undo-redo-engine.ts           # تراجع/إعادة بسجلات وحد أقصى
│   │   │   │   ├── mouse-command-registry.ts     # سجل أوامر الماوس المتعددة
│   │   │   │   ├── screen-edge-detector.ts       # كشف حواف الشاشة وعكس القوائم
│   │   │   │   ├── bounding-clamping-engine.ts   # تقييد العناصر داخل حدود اللوحة
│   │   │   │   ├── z-order-manager.ts            # إدارة ترتيب الطبقات (Z-Index)
│   │   │   │   ├── selection-manager.ts           # مدير التحديد الشامل
│   │   │   │   ├── block-mapper.ts               # خريطة بلوكات بصرية
│   │   │   │   ├── smart-component-engine.ts     # تجميع ذكي مع كشف التبعيات
│   │   │   │   ├── callout-engine.ts             # صناديق التنبيه والملاحظات
│   │   │   │   ├── canvas-profile-engine.ts      # بروفايلات الكانفا (Writer/Calc/Impress/Base)
│   │   │   │   ├── doctor-self-healing-engine.ts # فحص وشفاء ذاتي للنظام
│   │   │   │   ├── html-pipeline.ts              # خط أنابيب تنقية HTML
│   │   │   │   ├── file-type-detection.ts        # التعرف على أنواع الملفات
│   │   │   │   ├── unified-ingestion.ts          # خط الاستيراد الموحد
│   │   │   │   ├── image-pipeline.ts             # معالجة الصور (EXIF، قص، فلاتر)
│   │   │   │   └── validation.ts                 # فحص وتعقيم المحتوى
│   │   │   ├── 📁 blocks/                # كتل المحتوى — HTML blocks + code editor
│   │   │   │   ├── code-editor.ts         #   كتلة محرر الكود
│   │   │   │   ├── code-editor.registry.ts#   تسجيل كتلة الكود
│   │   │   │   ├── code-editor.styles.ts  #   أنماط كتلة الكود
│   │   │   │   ├── audio-block-block.ts   #   كتلة الصوت
│   │   │   │   ├── html-unified-block.ts  #   كتلة HTML موحدة (ளர்ந்த المعدل 4)
│   │   │   │   ├── html-block-types.ts    #   أنواع كتل HTML المخصصة
│   │   │   │   ├── html-block-registry.ts #   سجل تسجيل كتل HTML
│   │   │   │   ├── html-block-generator.ts#   مولّد كتل HTML من القوالب
│   │   │   │   ├── html-block-layout-engine.ts # محرك تخطيط كتل HTML
│   │   │   │   ├── html-block-data-engine.ts   # محرك البيانات في كتل HTML
│   │   │   │   ├── html-block-tailwind-editor.ts # محرر أنماط Tailwind
│   │   │   │   ├── html-block-operations.ts    # عمليات كتل HTML (قص، نسخ، لصق)
│   │   │   │   ├── html-block-presets.ts        # قوالب HTML جاهزة
│   │   │   │   └── html-block-tsx-generator.ts  # مولّد كود TSX من HTML
│   │   │   ├── 📁 traits/               # سمات تفاعلية (Drag/Resize/Style/Lock)
│   │   │   │   ├── types.ts             #   أنواع السمات (TraitKey, PositionState, SizeState...)
│   │   │   │   ├── draggable.ts         #   سمة السحب (Draggable)
│   │   │   │   ├── resizable.ts         #   سمة التحجيم (Resizable)
│   │   │   │   ├── styleable.ts         #   سمة التنسيق (Styleable)
│   │   │   │   ├── lockable.ts          #   سمة القفل (Lockable)
│   │   │   │   ├── trait-context-menu-resolver.ts # محلل القوائم السياقية حسب السمات
│   │   │   │   └── index.ts             #   Barrel Export
│   │   │   ├── 📁 parsers/               # محللات Markdown والبيانات الوصفية
│   │   │   ├── 📁 converters/            # محول التنسيقات الشامل
│   │   │   ├── 📁 registry/              # سجل المكونات المركزي
│   │   │   │   └── capability-registry.ts #   سجل القدرات (FNV-1a hash + حماية التكرار)
│   │   │   ├── 📁 utils/                 # أدوات مساعدة: تعريف، تحقق، أنابيب، نص عربي
│   │   │   ├── contextMenuEngine.ts      # محرك القوائم السياقية الرئيسي (410 سطر)
│   │   │   ├── artboard.ts               # لوحة الرسم والسبورة البيضاء
│   │   │   ├── types.ts                  # الأنواع المشتركة (DocumentModel, Plugin, FormattingState)
│   │   │   └── index.ts                  # Barrel Export الرئيسي
│   │   ├── 📁 tests/                     # اختبارات النواة (19 ملف اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 canvas/                         # [CANVAS] محركات الكانفا والمعاينة
│   │   ├── 📁 engine/
│   │   │   ├── BlockMapperEngine.ts      #   محرك خريطة البلوكات
│   │   │   ├── CSSParserEngine.ts        #   محلل CSS
│   │   │   ├── HTMLParserEngine.ts       #   محلل HTML
│   │   │   ├── SelectionManager.ts       #   مدير التحديد
│   │   │   ├── SyncEngine.ts             #   محرك المزامنة
│   │   │   └── index.ts                  #   Barrel Export
│   │   └── StyleExtractor.ts             #   مستخرج الأنماط
│   │
│   ├── 📁 algorithms/                    # [ALGO] طبقة المنطق والخوارزميات
│   │   ├── 📁 src/
│   │   │   ├── 📁 command/               # نمط الأوامر: تسجيل، تنفيذ، أنواع
│   │   │   ├── 📁 formula/               # محلل الصيغ الحسابية (20 ملف)
│   │   │   │   ├── parser.ts             #   محلل تنازلي تكراري للصيغ
│   │   │   │   ├── tokenizer.ts          #   محلل رموز (Tokens)
│   │   │   │   ├── evaluator.ts          #   مُقيّم الصيغ
│   │   │   │   ├── functions.ts          #   الدوال المدمجة (SUM, AVERAGE, IF...)
│   │   │   │   ├── functions-math.ts     #   دوال رياضية متقدمة
│   │   │   │   ├── functions-text.ts     #   دوال نصية
│   │   │   │   ├── functions-financial.ts#   دوال مالية
│   │   │   │   ├── functions-arabic.ts   #   دوال عربية مخصصة
│   │   │   │   ├── dependency-graph.ts   #   خريطة اعتمادات الخلايا
│   │   │   │   ├── cell-utils.ts         #   أدوات الخلايا (A1 notation)
│   │   │   │   ├── latex-engine.ts       #   محرك LaTeX → SVG/HTML
│   │   │   │   └── markdown-engine.ts    #   محرك MD↔HTML ثنائي الاتجاه
│   │   │   ├── 📁 spatial/               # الترجمة المكانية وخوارزميات التفاعل (20 ملف)
│   │   │   │   ├── types.ts              #   أنواع الإحداثيات (Logical/Grid/Screen)
│   │   │   │   ├── mapper.ts             #   مُحوّل الإحداثيات
│   │   │   │   ├── commands.ts           #   أوامر مكانية (نقل، تحجيم، حذف)
│   │   │   │   ├── smart-snap-engine.ts  #   تسنين ذكي مع خطوط إرشاد
│   │   │   │   ├── dynamic-guide-lines.ts#   خطوط إرشاد حية
│   │   │   │   ├── smart-rtl-alignment.ts#   كشف اتجاه النص RTL/LTR
│   │   │   │   ├── bezier-engine.ts      #   مسارات بيزييه
│   │   │   │   ├── boolean-ops.ts        #   عمليات منطقية على الأشكال
│   │   │   │   └── vector-path.ts        #   مسارات المتجهات
│   │   │   ├── 📁 vector/                # خوارزميات التفاعل بالماوس (8 ملفات)
│   │   │   │   ├── common.ts             #   أنواع مشتركة (Point2D, BoundingBox)
│   │   │   │   ├── coordinate-system.ts  #   تحويل screen↔world
│   │   │   │   ├── mouse-algorithms.ts   #   8 مقابض تحكم + Ray Casting
│   │   │   │   ├── snap.ts               #   تسنين متعدد الأهداف
│   │   │   │   ├── ref-line.ts           #   خطوط إرشاد ديناميكية
│   │   │   │   ├── control-handle-manager.ts # إدارة مقابض التحجيم
│   │   │   │   └── smart-alignment.ts    #   محاذاة ذكية
│   │   │   ├── 📁 computation/           # حاسبة الوحدات الفيزيائية
│   │   │   │   └── unit-calc-engine.ts   #   73 اختبار، تحويل وحدات
│   │   │   ├── 📁 diagram/               # محرك الرسم البياني
│   │   │   ├── 📁 graph/                 # خوارزميات الرسم البياني والتوجيه
│   │   │   ├── 📁 search/                # البحث والاستبدال في المستند
│   │   │   ├── 📁 macro/                 # نظام التسجيل والتنفيد الآلي
│   │   │   ├── 📁 simulation/            # محاكاة تنفيذ الأوامر
│   │   │   ├── 📁 sort/                  # خوارزميات الفرز
│   │   │   ├── 📁 lookup/                # دوال البحث العمودي
│   │   │   ├── 📁 tree/                  # شجرة LLRB متوازنة
│   │   │   ├── 📁 structure/             # مجموعة منفصلة (Disjoint Set)
│   │   │   ├── 📁 streets/               # بحث أسماء الشوارع (6 ملفات)
│   │   │   ├── types.ts                  # أنواع الخوارزميات
│   │   │   └── index.ts                  # Barrel Export
│   │   ├── 📁 tests/                     # اختبارات الخوارزميات (52 ملف اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 storage/                       # [STORE] طبقة التخزين ثلاثية الطبقات
│   │   ├── 📁 src/
│   │   │   ├── memory.ts                 #   تخزين في الذاكرة العاملة
│   │   │   ├── localStorage.ts           #   مخزن محلي للمتصفح
│   │   │   ├── indexeddb.ts              #   مخزن IndexedDB للمستندات الكبيرة
│   │   │   ├── indexeddb-utils.ts        #   أدوات مساعدة لـ IndexedDB
│   │   │   ├── snapshots.ts              #   لقطات التراجع/الإعادة
│   │   │   ├── storage-utils.ts          #   أدوات توليد المفاتيح والتحقق
│   │   │   ├── types.ts                  #   أنواع التخزين
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 tests/                     # اختبارات التخزين (1 ملف اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 templates/                     # [TPL] نظام القوالب الأربعة
│   │   ├── 📁 src/
│   │   │   ├── registry.ts               #   سجل القوالب المركزي
│   │   │   ├── registry-types.ts         #   أنواع القوالب
│   │   │   ├── 📁 writer/                #   قوالب مستندات النصوص
│   │   │   ├── 📁 calc/                  #   قوالب جداول البيانات
│   │   │   ├── 📁 impress/               #   قوالب العروض التقديمية
│   │   │   ├── 📁 base/                  #   قوالب قواعد البيانات
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 tests/                     # اختبارات القوالب (3 ملفات اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 serializers/                   # [SER] محولات التصدير (9 صيغ)
│   │   ├── 📁 src/
│   │   │   ├── 📁 basic/                 #   محولات الأساس: Markdown, HTML, TXT
│   │   │   ├── 📁 advanced/              #   محولات متقدمة: PDF, LaTeX, ODF, SVG, ZIP
│   │   │   ├── 📁 docx/                  #   محول مستندات Word DOCX (7 ملفات)
│   │   │   ├── 📁 parsers/               #   محللات مشتركة (مطابقة لـ core)
│   │   │   ├── odf-package.ts            #   محزم مستندات ODF/ODT
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 tests/                     # اختبارات المحولات (5 ملفات اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 adapters/                      # [ADAP] طبقات التكيف للواجهات
│   │   ├── 📁 src/
│   │   │   ├── 📁 react/                 #   محرر React
│   │   │   ├── 📁 vue/                   #   محرر Vue
│   │   │   ├── 📁 web-component/         #   مكوّن ويب مستقل
│   │   │   ├── 📁 vanilla/               #   بدون أطر عمل
│   │   │   ├── 📁 shared/                #   Spatial Adapter المشترك
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 tests/                     # اختبارات التكيف (1 ملف اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 plugins/                       # [PLUG] الإضافات الرسمية
│   │   ├── 📁 src/
│   │   │   ├── 📁 mermaid/               #   إضافة المخططات الهندسية
│   │   │   ├── 📁 math/                  #   إضافة المعادلات الرياضية
│   │   │   ├── 📁 canvas-designer/       #   مصمم الكانفا (5 ملفات)
│   │   │   ├── 📁 vector/                #   محرر المتجهات
│   │   │   ├── 📁 shared-tools/          #   أدوات مشتركة
│   │   │   ├── registry.ts               #   سجل الإضافات
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 tests/                     # اختبارات الإضافات (5 ملفات اختبار)
│   │   └── 📄 package.json
│   │
│   ├── 📁 shared/                         # [SHARED] مكتبة مشتركة — محركات + أدوات + خطوط
│   │   ├── 📁 engines/                    # محركات مشتركة (مجلّد رئيسي)
│   │   │   ├── codeEditorEngines.ts       #   محركات محرر الكود (linting, completion)
│   │   │   ├── htmlBlockParsers.ts        #   محللات كتل HTML المشتركة
│   │   │   ├── AIEngine.ts                #   محرك الذكاء الاصطناعي
│   │   │   ├── AttributeCompletionEngine.ts # إكمال السمات
│   │   │   ├── ComponentRegistry.ts       #   سجل المكونات المشترك
│   │   │   ├── Debouncer.ts               #   محرك التأخير (debounce)
│   │   │   ├── DiagramEngine.ts           #   محرك المخططات
│   │   │   ├── DialogEngine.ts            #   محرك الحوارات
│   │   │   ├── DoctorSelfHealingEngine.ts #   فحص وشفاء ذاتي
│   │   │   ├── IconGeneratorEngine.ts     #   مولّد الأيقونات
│   │   │   ├── IconLibraryEngine.ts       #   مكتبة الأيقونات
│   │   │   ├── ImageStyleEngine.ts        #   محرك أنماط الصور
│   │   │   ├── ImageUploaderEngine.ts     #   محرك رفع الصور
│   │   │   ├── LaTeXEngine.ts             #   محرك LaTeX
│   │   │   ├── MarkdownEngine.ts          #   محرك Markdown
│   │   │   ├── MindMapEngine.ts           #   محرك خرائط الذهن
│   │   │   ├── NoCodeExecutionEngine.ts   #   محرك التنفيذ بدون كود
│   │   │   ├── NotificationEngine.ts      #   محرك الإشعارات
│   │   │   ├── PluginSystem.ts            #   نظام الإضافات المشترك
│   │   │   ├── PresentationNotebookEngine.ts # محرك الدفتر التقديمي
│   │   │   ├── SmartComponentEngine.ts    #   المكونات الذكية
│   │   │   ├── ToolRegistry.ts            #   سجل الأدوات المشترك
│   │   │   ├── ValidationEngine.ts        #   محرك التحقق
│   │   │   ├── WebScrapingEngine.ts       #   محرك اقتناص الويب
│   │   │   ├── WYSIWYGCalloutEngine.ts    #   صناديق التنبيه WYSIWYG
│   │   │   ├── 📁 languages/             # نظام اللغات المتعدد
│   │   │   │   ├── language-definition.ts #   تعريف اللغة
│   │   │   │   ├── language-pack.ts       #   حزمة اللغة
│   │   │   │   ├── language-registry.ts   #   سجل اللغات
│   │   │   │   ├── language-runtime.ts    #   بيئة تشغيل اللغة
│   │   │   │   ├── 📁 packs/             # حزم اللغات
│   │   │   │   │   ├── cpp.ts             #   لغة C++
│   │   │   │   │   ├── python.ts          #   لغة Python
│   │   │   │   │   ├── typescript.ts      #   لغة TypeScript
│   │   │   │   │   ├── web.ts             #   لغات الويب (HTML/CSS/JS)
│   │   │   │   │   └── extended.ts        #   لغات إضافية
│   │   │   │   └── 📁 providers/          # مزوّدون
│   │   │   │       ├── completion-provider.ts   # إكمال تلقائي
│   │   │   │       ├── diagnostics-provider.ts  # تشخيص الأخطاء
│   │   │   │       ├── formatter-provider.ts    # تنسيق الكود
│   │   │   │       ├── hover-provider.ts        # معلومات عند التمرير
│   │   │   │       ├── runner-provider.ts       # مشغل الكود
│   │   │   │       └── symbol-provider.ts       # رموز الكود
│   │   │   └── index.ts                  #   Barrel Export
│   │   ├── 📁 lib-core/                   # مكتبة النواة المشتركة
│   │   │   ├── 📁 animation/             # محركات الحركة
│   │   │   │   ├── motion-morph-engine.ts      # حركة التحول
│   │   │   │   ├── motion-path-engine.ts       # حركة المسار
│   │   │   │   └── motion-path-tooling-engine.ts # أدوات حركة المسار
│   │   │   ├── 📁 archive/               # محرك الأرشيف
│   │   │   │   └── zip-engine.ts          #   محرك ZIP بدون مكتبات
│   │   │   ├── 📁 charts/               # محرك الرسوم البيانية
│   │   │   │   └── zero-dependency-chart-engine.ts # رسوم بيانية بدون اعتماديات
│   │   │   ├── 📁 code-interpreter/     # م interpreter الكود (المهم!)
│   │   │   │   ├── code-editor-module.ts #   وحدة محرر الكود
│   │   │   │   ├── code-sandbox-runner.ts # مشغل الكود في بيئة معزولة
│   │   │   │   ├── css-generator-engine.ts  # مولّد CSS
│   │   │   │   ├── live-interpreter-engine.ts # interpreter حي
│   │   │   │   └── regex-tester-engine.ts   # محرك اختبار Regex
│   │   │   ├── 📁 collaboration/         # التعاون
│   │   │   │   └── peer-awareness-engine.ts  # وعي الأقران
│   │   │   ├── 📁 computational-notebook/ # الدفتر الحسابي
│   │   │   │   ├── ScratchpadEngine.ts       # محرك Scratchpad
│   │   │   │   ├── ScratchpadParser.ts       # محلل Scratchpad
│   │   │   │   ├── ScratchpadGraph.ts        # رسوم Scratchpad
│   │   │   │   ├── ScratchpadBindings.ts     # ربط Scratchpad
│   │   │   │   ├── ScratchpadStore.ts        # تخزين Scratchpad
│   │   │   │   ├── unit-calc-engine.ts       # حاسبة الوحدات
│   │   │   │   └── types.ts                  # أنواع Scratchpad
│   │   │   ├── 📁 converters/            # المحولات المشتركة
│   │   │   │   ├── cad-vector-engine.ts       # محول CAD/Vectors
│   │   │   │   ├── document-markup-engine.ts  # محول الترميز
│   │   │   │   ├── image-format-engine.ts     # محول صيغ الصور
│   │   │   │   ├── odf-engine.ts              # محول ODF
│   │   │   │   ├── schema-data-engine.ts      # محول البيانات المخططية
│   │   │   │   ├── universal-export-hub.ts    # مركز التصدير الموحد
│   │   │   │   └── web-components-engine.ts   # مكونات الويب
│   │   │   ├── 📁 document-pipeline/     # خط أنابيب المستندات
│   │   │   │   ├── block-document-model.ts    # نموذج المستند بالكتل
│   │   │   │   ├── clip-payload-engine.ts     # محرك القص
│   │   │   │   ├── comments-thread-engine.ts  # محرك التعليقات
│   │   │   │   ├── content-addressed-asset-engine.ts # أصول بالعنوان
│   │   │   │   ├── dynamic-fields-engine.ts   # حقول ديناميكية
│   │   │   │   ├── find-replace-engine.ts     # بحث واستبدال
│   │   │   │   ├── history-diff-engine.ts     # اختلافات التاريخ
│   │   │   │   ├── html-sanitizer.ts          # تنقية HTML
│   │   │   │   ├── layer-document-compositor.ts # مركّب الطبقات
│   │   │   │   ├── markdown-caret-engine.ts   # محرك Markdown Caret
│   │   │   │   ├── plan-apply-agent-engine.ts # وكيل تطبيق الخطط
│   │   │   │   ├── schema-driven-fields-engine.ts # حقول مخططية
│   │   │   │   ├── smart-clipboard-engine.ts  # الحافظة الذكية
│   │   │   │   └── tag-aware-find-replace.ts  # بحث بتاجات
│   │   │   ├── 📁 events/               # أحداث مشتركة
│   │   │   │   ├── comments-anchoring-engine.ts # تثبيت التعليقات
│   │   │   │   ├── dockable-tab-engine.ts      # تبويبات قابلة للرسو
│   │   │   │   ├── drag-selection-engine.ts    # تحديد بالسحب
│   │   │   │   ├── mouse-interaction-trinity.ts # ثالوث تفاعل الماوس
│   │   │   │   ├── sub-editor-orchestrator.ts  # منسّق المحررات الفرعية
│   │   │   │   ├── universal-context-menu.ts   # القائمة السياقية الموحدة
│   │   │   │   └── viewport-pan-zoom.ts        # تكبير/تصغير + تحريك
│   │   │   ├── 📁 geometry/             # الهندسة
│   │   │   │   ├── bezier-curves.ts            # منحنيات بيزييه
│   │   │   │   ├── bezier-editing-tool.ts      # أداة تحرير بيزييه
│   │   │   │   ├── bounding-box.ts             # صندوق التحديد
│   │   │   │   ├── connector-rerouting-engine.ts # إعادة توجيه الوصلات
│   │   │   │   ├── coordinate-transformer.ts   # محول الإحداثيات
│   │   │   │   ├── line-connector-geometry.ts  # هندسة الوصلات
│   │   │   │   ├── smart-shapes-engine.ts      # الأشكال الذكية
│   │   │   │   └── snap-align-engine.ts        # التسنين والمحاذاة
│   │   │   ├── 📁 grid-engine/           # محرك الشبكة (Calc)
│   │   │   │   ├── a1-notation.ts              # ترميز A1 للخلايا
│   │   │   │   ├── cell-formula-engine.ts       # محرك صيغ الخلايا
│   │   │   │   ├── format-engine.ts            # محرك التنسيق
│   │   │   │   ├── formula-evaluator.ts        # مُقيّم الصيغ
│   │   │   │   ├── grid-core.ts                # نواة الشبكة
│   │   │   │   ├── linked-chart-bridge.ts       # جسر الرسوم المرتبطة
│   │   │   │   ├── runtime-safety.ts           # سلامة التشغيل
│   │   │   │   └── selection-model.ts          # نموذج التحديد
│   │   │   ├── 📁 latex/               # محرك LaTeX
│   │   │   │   ├── LatexEngine.ts              # المحرك الرئيسي
│   │   │   │   ├── LatexParser.ts              # المحلل
│   │   │   │   ├── LatexRenderer.ts            # العارض
│   │   │   │   ├── LatexSymbols.ts             # الرموز
│   │   │   │   ├── LatexTypes.ts               # الأنواع
│   │   │   │   └── LatexUI.ts                  # واجهة المستخدم
│   │   │   ├── 📁 raster/               # معالجة الصور النقطية
│   │   │   │   ├── background-removal-matte.ts # إزالة الخلفية
│   │   │   │   ├── brush-engine.ts             # محرك الفرشاة
│   │   │   │   ├── color-combine-engine.ts     # دمج الألوان
│   │   │   │   ├── color-curves-histogram.ts   # منحنيات الألوان
│   │   │   │   ├── dithering-quantization-engine.ts # 분할 양자화
│   │   │   │   ├── image-filters-engine.ts     # فلاتر الصور
│   │   │   │   ├── image-processing-core.ts    # نواة معالجة الصور
│   │   │   │   ├── layer-blend-engine.ts       # مزج الطبقات
│   │   │   │   ├── morphology-convolution-engine.ts # مورفولوجيا التليل
│   │   │   │   └── vector-tracer-engine.ts     # متتبع المتجهات
│   │   │   ├── index.ts                  #   Barrel Export
│   │   ├── 📁 hooks/                     # خطافات مشتركة (React)
│   │   ├── 📁 primitives/               # مكونات أساسية
│   │   ├── 📁 styles/                   # أنماط مشتركة
│   │   ├── 📁 tools/                    # أدوات مشتركة
│   │   ├── 📁 utils/                    # أدوات مساعدة
│   │   ├── 📁 vector-engine/            # محرك المتجهات
│   │   └── 📄 package.json
│   │
│   ├── 📁 shell/                          # [SHELL] غلاف التطبيق وبيئة التطوير
│   │   ├── 📁 dev-studio/
│   │   │   ├── 📁 adapters/              #   مكيّفات: Canvas, Editor, PDF, RichText, UI
│   │   │   ├── 📁 bridge/                #   جسر EditorBridge
│   │   │   ├── 📁 checkpoint/            #   RollbackManager, SnapshotEngine
│   │   │   ├── 📁 core/                  #   DevStudioEngine, Events, Types
│   │   │   ├── 📁 doctor/                #   DependencyAuditor, DoctorEngine, Validators (6)
│   │   │   ├── 📁 pipeline/              #   TaskPipeline
│   │   │   ├── 📁 scaffolder/            #   ToolScaffolder
│   │   │   ├── 📁 scratchpad/            #   Scratchpad
│   │   │   ├── 📁 sync/                  #   CodeGenerator, RegistrySync
│   │   │   ├── 📁 tree/                  #   DecompositionEngine, DriftDetector, FileOps, ProjectTree (6)
│   │   │   ├── 📁 workbench/             #   DevStudioWorkbench + panels (4)
│   │   │   └── index.ts                  #   Barrel Export
│   │   └── Workbench.tsx                 #   سطح العمل الرئيسي
│   │
│   ├── 📁 features/                      # [FEATURES] ميزات واجهة المستخدم
│   │   ├── 📁 canvas-designer/           #   مصمم الكانفا (57 ملف)
│   │   │   ├── core/                     #   SVG: animation, clipping, history, math, paint, path, selection...
│   │   │   ├── components/               #   مكونات: CanvasHeader, Sidebar, ToolBar, Viewport, Properties...
│   │   │   ├── hooks/                    #   useCanvasDragResize, useCanvasTransform, useCanvasShortcuts
│   │   │   ├── data/                     #   advancedDesignTemplates
│   │   │   ├── sub-editors/              #   BezierSubEditor, LineSubEditor
│   │   │   └── CanvasDesignerPlugin.tsx  #   الإضافة الرئيسية
│   │   ├── 📁 rich-text/                 #   محرر النصوص الغني
│   │   │   ├── core/NativeEditor.ts      #   المحرر الأصلي
│   │   │   ├── services/                 #   docxServices, docxUtils, fileUtils, zipUtils
│   │   │   ├── hooks/                    #   useEditorShortcuts, useNativeEditor
│   │   │   └── RichTextEditor.tsx        #   المكون الرئيسي
│   │   ├── 📁 html-component/            #   مكوّن HTML
│   │   │   ├── HTMLComponentPlugin.tsx
│   │   │   └── model.ts
│   │   ├── 📁 pdf/                       #   عارض PDF
│   │   │   ├── hooks/                    #   usePdfAnnotations, usePdfDocument, usePdfPagination
│   │   │   ├── PdfPlugin.tsx
│   │   │   └── model.ts
│   │   └── 📁 ui-designer/               #   مصمم الواجهات
│   │       ├── hooks/                    #   useResponsiveGrid, useUIDesignerShortcuts, useUIDesignerTree
│   │       ├── UIDesignerPlugin.tsx
│   │       └── model.ts
│   │
│   ├── 📁 components/                    # [COMPONENTS] مكونات مشتركة
│   │   ├── SettingsPanel.tsx             #   لوحة الإعدادات
│   │   └── canvas/Canvas.tsx             #   مكوّن الكانفا
│   │
│   ├── 📁 app/                           # [APP] تطبيق الويب الرئيسي
│   │   ├── App.tsx                       #   التطبيق الرئيسي
│   │   ├── DocumentEditorHost.tsx        #   مستضيف محرر المستندات
│   │   ├── providers.tsx                 #   مزوّدي الحالة
│   │   ├── registerPlugins.ts            #   تسجيل الإضافات
│   │   └── providers/DockableLayoutProvider.tsx
│   │
│   └── 📁 playground/                    # [PLAY] الملعب التجريبي (لم يبدأ بعد)
│
├── 📁 docs/                              # [DOC] التوثيق
│   ├── 📁 api/                           # وثائق API
│   ├── 📁 guides/                        # أدلة الاستخدام
│   └── 📁 examples/                      # أمثلة تطبيقية
│
├── 📁 scripts/                           # [INFRA] أسكريبتات الأتمتة والفهرسة
│   ├── analyze-blocks-and-tools.ts        #   تحليل الكتل والأدوات
│   ├── atomic-inventory.ts                #   جرد ذري للملفات (160 ملف)
│   ├── extract-line-numbers.ts            #   استخراج أرقام الأسطر من الملفات
│   ├── extract-line-numbers-ast.ts        #   استخراج أرقام الأسطر عبر AST
│   ├── extract-line-numbers-ast.js        #   نسخة JS من مستخرج أرقام الأسطر
│   ├── extract-line-numbers.js            #   نسخة JS من مستخرج الأسطر
│   ├── generate-block.ts                  #   توليد بلوكات جديدة
│   ├── generate-file.ts                   #   توليد ملفات من القوالب
│   ├── generate-header.ts                 #   توليد ترويسات الملفات الثنائية
│   ├── generate-inventory.ts              #   توليد الجرد التلقائي
│   ├── scaffold-block.ts                  #   هيكلة بلوكات جديدة
│   ├── sync-canonical-tools.ts            #   مزامنة الأدوات الأساسية
│   ├── sync-registry.ts                   #   مزامنة السجلات
│   ├── sync-tools.ts                      #   مزامنة الأدوات بين الحزم
│   ├── update-function-index.ts           #   تحديث فهرس الدوال
│   ├── update-indexes.ts                  #   تحديث جميع الفهارس
│   ├── update-logs.ts                     #   تحديث السجلات اليومية
│   ├── validate-architecture.ts           #   التحقق من صحة الهيكلية
│   └── work-monitor.ts                    #   مراقبة سير العمل
├── 📁 .github/                           # [INFRA] إعدادات CI/CD
├── 📄 package.json                       # [INFRA-001] إعدادات المشروع الجذري
├── 📄 pnpm-workspace.yaml                # [INFRA-006] إعدادات pnpm workspace
├── 📄 tsconfig.base.json                 # [INFRA-002] إعدادات TypeScript الأساسية
├── 📄 tsconfig.json                      # [INFRA-002] إعدادات TypeScript (يوسع base)
├── 📄 turbo.json                         # [INFRA-006] إعدادات Turborepo
├── 📄 vitest.config.ts                   # [INFRA-002] إعدادات إطار الاختبارات
├── 📄 AGENTS.md                          # [DOC-ADMIN-05] هذا الملف — تعليمات العميل التنفيذي
├── 📄 README.md                          # [DOC-000] وصف المشروع الرئيسي
├── 📄 LICENSE                            # [LEGAL-001] ترخيص MIT
├── 📄 CONTRIBUTING.md                    # [DOC-GUIDE-01] إرشادات المساهمة
├── 📄 PLAN.md                            # [DOC-ADMIN-01] الخطة المعمارية الشاملة
├── 📄 JOURNAL.md                         # [DOC-ADMIN-02] يوميات العمل اليومية
├── 📄 INDEX.md                           # [DOC-ADMIN-03] فهرس الملفات والشجرة الكاملة
├── 📄 CHANGELOG.md                       # [DOC-ADMIN-04] سجل التغييرات والإصدارات
├── 📄 Components Registry.md             # [DOC-ADMIN-06] سجل المكونات المسجلة
├── 📄 API Registry.md                    # [DOC-ADMIN-07] سجل الـ APIs والدوال
├── 📄 SystemInventory.json               # [DOC-ADMIN-08] جرد النظام الآلي
├── 📄 FUNCTION_INDEX.md                  # [DOC-ADMIN-09] فهرس الدوال الشامل (4000+ سطر)
├── 📄 INTEGRATION_MAP.md                 # [DOC-ADMIN-10] خريطة ارتباطات الحزم
├── 📄 MIGRATION_NOTES.md                 # [DOC-ADMIN-11] ملاحظات هجرة الأرشيف القديم
├── 📄 DESIGN_BOOK.md                     # [DOC-ADMIN-13] كتاب التصميم والمعايير القياسية
├── 📄 DesignStandards.md                 # [DOC-ADMIN-14] معايير UI/UX الشاملة
├── 📄 EDITOR_INVENTORY.md                # جرد المحررات (Writer 9, Calc 2, Impress 8, Base 2)
├── 📄 BLOCKS_AND_TOOLS_REGISTRY.md       # سجل الكتل والأدوات التفصيلي
├── 📄 SYSTEM_ANALYTICS.md                # تحليلات النظام والإحصائيات
├── 📄 TOOLS_AUDIT_REPORT.md              # تقرير تدقيق الأدوات والتحسينات
├── 📄 ATOMIC_INVENTORY.md                # الجرد الذري (160 ملف: 144 نشط، 4 مكرر، 3 غير مستخدم)
├── 📄 ATOMIC_INVENTORY.json              # بيانات الجرد الذري
├── 📄 BLOCKS_ANALYTICS.json              # تحليلات الكتل والخصائص
├── 📄 RESTRUCTURING_PLAN.md              # خطة إعادة الهيكلة المعمارية
└── 📄 TODONext_19_08_2026.md             # مهام التحديث القادمة
```

---

## 🗺️ خريطة التكامل (Integration Map)

| الحزمة                            | المستهلك                 | الوظيفة                                                    |
| --------------------------------- | ------------------------ | ---------------------------------------------------------- |
| `@libretext/core`                 | جميع الحزم الأخرى        | النواة المجردة (AST, State, Operations, Indexer)           |
| `@libretext/algorithms`           | core, storage, templates | Command Pattern, Expression Evaluator, Spatial Translation |
| `@libretext/storage`              | core, algorithms         | In-Memory, localStorage, IndexedDB, Snapshots              |
| `@libretext/templates`            | storage, adapters        | Template Registry (Writer, Calc, Impress, Base)            |
| `@libretext/serializers-basic`    | playground, adapters     | Markdown, HTML, TXT serializers                            |
| `@libretext/serializers-advanced` | playground, adapters     | PDF, LaTeX serializers                                     |
| `@libretext/plugins`              | playground, adapters     | Mermaid, Math plugins                                      |
| `@libretext/adapters`             | المستخدمون النهائيون     | React, Vue, Web Component, Vanilla JS                      |
| `@libretext/playground`           | المطورون                 | بيئة تجريبية تفاعلية                                       |

---

## 📋 بروتوكول التقارير بعد التنفيذ

## Post-Execution Reporting Protocol

بعد الانتهاء من تنفيذ كل مرحلة، يجب تقديم تقرير دقيق يحتوي على:

1. **ما تم إنجازه:** قائمة الملفات المنشأة/المعدلة مع مساراتها الكاملة ومعرفاتها.
2. **الاختبارات:** نتائج `pnpm test` ونسبة التغطية.
3. **النوعية:** نتائج `pnpm typecheck`.
4. **التنسيق:** تأكيد نجاح `pnpm lint`.
5. **الفهرس:** تأكيد تحديث `FUNCTION_INDEX.md` بالدوال الجديدة.
6. **المتبقي:** قائمة المهام المتبقية للمرحلة التالية.
7. **تحديث السجلات:** تأكيد تحديث `JOURNAL.md` و `CHANGELOG.md` و `Components Registry.md` و `API Registry.md`.
8. **الروابط المرتبطة:** تأكيد تحديث `🔗 الملفات المرتبطة` في ترويسة كل ملف مُعدَّل.

---

## 📚 المصادر المفتوحة المقتبسة

## Open Source Inspirations

| المشروع                                              | الترخيص      | التأثير                 |
| ---------------------------------------------------- | ------------ | ----------------------- |
| [ProseMirror](https://prosemirror.net/)              | MIT          | نظام الحالة والعمليات   |
| [Quill.js](https://quilljs.com/)                     | BSD-3-Clause | نموذج العمليات (Deltas) |
| [TipTap](https://tiptap.dev/)                        | MIT          | نظام الإضافات           |
| [Milkdown](https://milkdown.dev/)                    | MIT          | محول Markdown           |
| [Toast UI Editor](https://github.com/nhn/tui.editor) | MIT          | WYSIWYG الهجين          |
| [Vite](https://vitejs.dev/)                          | MIT          | أداة البناء             |
| [Vitest](https://vitest.dev/)                        | MIT          | إطار الاختبارات         |
| [webpainter-next](https://github.com/)               | MIT          | نمط التوثيق والإعدادات  |

جميع الاقتباسات تمت وفق شروط التراخيص المذكورة أعلاه.
