/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل المكونات والقوالب المشترك - 25+ فئة مكون بتصميم فاتح
 * 🏛️ الدور: محرك مشترك - قاعدة بيانات المكونات القابلة للإدراج
 * 📥 المستهلك: UIDesignerSidebar, DraggableTemplatePanel, TemplatesDialog
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component Catalog Pattern: سجل مركزي يصنف المكونات بفئاتها
 *    مع قوالب HTML/Tailwind جاهزة للإدراج المباشر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوالب يجب أن تكون متوافقة مع الثيم الفاتح
 *    2. HTML المولد يجب أن يكون صالحاً ونظيفاً
 *    3. الفئات يجب أن تبقى متسقة عبر جميع المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة فئة المكون قبل الإرجاع
 *    - تعامل مع القوالب المفقودة بقيم افتراضية
 *    - إرجاع مصفوفة فارغة بدلاً من null
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/ComponentRegistry.ts
/**
 * سجل المكونات والقوالب المشترك بتصميم فاتح نقي 100%
 * بدون أي مكتبات خارجية وبشفرات HTML/Tailwind نقية
 */

export type ComponentCategory =
  | 'headers'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'forms'
  | 'callouts'
  | 'interactive'
  | 'video'
  | 'badge'
  | 'gallery'
  | 'stats'
  | 'team'
  | 'table'
  | 'charts'
  | 'basic';

export interface RegisteredComponent {
  id: string;
  name: string;
  nameAr: string;
  category: ComponentCategory;
  categoryAr: string;
  icon: string;
  descriptionAr: string;
  templateHtml: string;
}

export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, RegisteredComponent> = new Map();

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
      ComponentRegistry.instance.registerDefaults();
    }
    return ComponentRegistry.instance;
  }

  public register(comp: RegisteredComponent): void {
    this.components.set(comp.id, comp);
  }

  public get(id: string): RegisteredComponent | undefined {
    return this.components.get(id);
  }

  public getAll(): RegisteredComponent[] {
    return Array.from(this.components.values());
  }

  public getByCategory(category: ComponentCategory): RegisteredComponent[] {
    return this.getAll().filter((c) => c.category === category);
  }

  public search(query: string): RegisteredComponent[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.getAll().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.descriptionAr.includes(q) ||
        c.categoryAr.includes(q)
    );
  }

  private registerDefaults(): void {
    // 1. Clean Light Navbar
    this.register({
      id: 'header-clean-light',
      name: 'Clean Light Navbar',
      nameAr: 'شريط ترويسة وتنقل علوي فاتح',
      category: 'headers',
      categoryAr: 'الترويسات وشريط التنقل',
      icon: '🧭',
      descriptionAr: 'شريط علوي يحتوي على الشعار، روابط الأقسام، وزر الإجراء السريع',
      templateHtml: `
<header class="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-xl shadow-xs my-4">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">⚡</div>
    <span class="font-extrabold text-slate-800 text-base">ستوديو التصميم الذكي</span>
  </div>
  <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
    <a href="#" class="hover:text-blue-600 transition-colors">الرئيسية</a>
    <a href="#" class="hover:text-blue-600 transition-colors">الميزات</a>
    <a href="#" class="hover:text-blue-600 transition-colors">القوالب</a>
    <a href="#" class="hover:text-blue-600 transition-colors">الأسعار</a>
  </nav>
  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors">
    ابدأ الآن مجاناً
  </button>
</header>`.trim(),
    });

    // 2. Hero Section Light
    this.register({
      id: 'hero-light-gradient',
      name: 'Hero Light Section',
      nameAr: 'قسم الترحيب والبطولة الفاتح',
      category: 'hero',
      categoryAr: 'أقسام الترحيب (Hero)',
      icon: '🚀',
      descriptionAr: 'ترويسة رئيسية مع عنوان عريض، شارة ذكية، وفقرة مع أزرار دعوة للإجراء',
      templateHtml: `
<section class="w-full py-12 px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border border-blue-100 rounded-2xl my-4 text-center shadow-xs">
  <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-4">
    <span>✨ الإصدار الأحدث من بيئة العمل</span>
  </div>
  <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
    صمم واجهاتك ووثق شروحاتك باحترافية
  </h1>
  <p class="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
    أدوات متكاملة تدعم التحرير المباشر والمخططات الفيكتورية ومربعات الشرح التفاعلية مع دعم السحب والإفلات الكامل.
  </p>
  <div class="flex items-center justify-center gap-3">
    <button class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
      ابدأ الإنشاء الآن
    </button>
    <button class="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
      مشاهدة القوالب
    </button>
  </div>
</section>`.trim(),
    });

    // 3. Features 3-Column Light
    this.register({
      id: 'features-3col-light',
      name: 'Features 3-Card Grid',
      nameAr: 'شبكة الميزات الثلاثية الفاتحة',
      category: 'features',
      categoryAr: 'الميزات والخصائص',
      icon: '✨',
      descriptionAr: 'ثلاث بطاقات لعرض الميزات مع خلفيات بيضاء نظيفة وأيقونات ملونة وحدود ناعمة',
      templateHtml: `
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-blue-400 transition-all">
    <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mb-3">⚡</div>
    <h3 class="text-sm font-bold text-slate-800 mb-1.5">سرعة فائقة واستجابة فورية</h3>
    <p class="text-xs text-slate-500 leading-relaxed">تحرير مرئي WYSIWYG متزامن بنسبة 100% بدون أي تأخير.</p>
  </div>
  <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-400 transition-all">
    <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg mb-3">🛡️</div>
    <h3 class="text-sm font-bold text-slate-800 mb-1.5">أمان وموثوقية المعالجة</h3>
    <p class="text-xs text-slate-500 leading-relaxed">معالجة وتصدير متكامل للمستندات والملفات دون الاعتماد على خدمات خارجية.</p>
  </div>
  <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-purple-400 transition-all">
    <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold text-lg mb-3">🎨</div>
    <h3 class="text-sm font-bold text-slate-800 mb-1.5">تكامل بصري وشروحات</h3>
    <p class="text-xs text-slate-500 leading-relaxed">أدوات توضيح وموصلات ذكية تساعدك على بناء دلائل مستخدم تفاعلية.</p>
  </div>
</div>`.trim(),
    });

    // 4. Interactive Callout & Explanation Block
    this.register({
      id: 'callout-step-guide',
      name: 'Interactive Step Guide',
      nameAr: 'مربع شرح تفاعلي مع ترقيم الخطوات',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '💡',
      descriptionAr: 'مربع شرح أنيق مع شارة ترقيم ومؤشر توجيه للنصوص والعناصر',
      templateHtml: `
<div class="p-4 bg-blue-50/60 border-2 border-blue-500 rounded-xl my-4 shadow-xs relative">
  <div class="flex items-center gap-2 mb-2">
    <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
    <h4 class="text-xs font-bold text-blue-900">خطوة توضيحية: انقر هنا لبدء التحرير</h4>
  </div>
  <p class="text-xs text-slate-600 leading-relaxed mr-8">
    يمكنك استخدام أدوات الفأرة مباشرة لسحب العناصر وتعديل أبعادها أو إضافة أسهم وموصلات للشرح.
  </p>
</div>`.trim(),
    });

    // 5. Pricing Table Light
    this.register({
      id: 'pricing-card-light',
      name: 'Pricing Card Light',
      nameAr: 'بطاقة خطة الأسعار الفاتحة',
      category: 'pricing',
      categoryAr: 'خطط الأسعار',
      icon: '💎',
      descriptionAr: 'بطاقة عرض اشتراك واضحة ومقنعة مع تفاصيل الخطة وزر الاشتراك',
      templateHtml: `
<div class="max-w-sm mx-auto p-6 bg-white border-2 border-blue-600 rounded-2xl shadow-xs my-6 text-right">
  <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-full mb-3">الأكثر طلباً</span>
  <h3 class="text-lg font-black text-slate-900">الباقة الاحترافية الشاملة</h3>
  <div class="my-4 flex items-baseline gap-1">
    <span class="text-3xl font-extrabold text-blue-600">$29</span>
    <span class="text-xs text-slate-400">/ شهرياً</span>
  </div>
  <ul class="space-y-2.5 text-xs text-slate-600 my-5">
    <li class="flex items-center gap-2"><span class="text-blue-600 font-bold">✓</span> كافة أدوات المحرر ومربعات الشرح</li>
    <li class="flex items-center gap-2"><span class="text-blue-600 font-bold">✓</span> تصدير بصيغ PDF و HTML و Markdown و TSX</li>
    <li class="flex items-center gap-2"><span class="text-blue-600 font-bold">✓</span> دعم الرسوم الفيكتورية والمخططات المتجهة</li>
  </ul>
  <button class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
    اشترك في الباقة الآن
  </button>
</div>`.trim(),
    });

    // 6. Contact Form Light
    this.register({
      id: 'contact-form-light',
      name: 'Contact Form Light',
      nameAr: 'نموذج اتصال فاتح ومنظم',
      category: 'forms',
      categoryAr: 'النماذج والمدخلات',
      icon: '✉️',
      descriptionAr: 'نموذج تواصل عصري يتضمن الاسم، البريد، وحقل الرسالة مع زر الإرسال',
      templateHtml: `
<div class="max-w-md mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-xs my-6">
  <h3 class="text-base font-bold text-slate-900 mb-1">تواصل مع فريق الدعم</h3>
  <p class="text-xs text-slate-500 mb-4">يسعدنا تلقي استفساراتك واقتراحاتك في أي وقت.</p>
  <form class="space-y-3">
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">الاسم الكامل</label>
      <input type="text" placeholder="محمد علي" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
      <input type="email" placeholder="name@domain.com" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">الرسالة</label>
      <textarea rows="3" placeholder="اكتب تفاصيل طلبك أو استفسارك هنا..." class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"></textarea>
    </div>
    <button type="button" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors">
      إرسال الرسالة
    </button>
  </form>
</div>`.trim(),
    });
    // --- NEW SMART SHAPES & CALLOUTS ---
    this.register({
      id: 'smart-callout-1',
      name: 'Dynamic Speech Bubble',
      nameAr: 'صندوق تلميح مع ذيل (Speech Bubble)',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '💬',
      descriptionAr: 'صندوق نصي مع ذيل موجه للتلميحات والملاحظات',
      templateHtml: `
<div class="relative w-64 p-4 bg-white border-2 border-blue-500 rounded-2xl shadow-md text-center m-6">
  <span class="text-sm font-bold text-slate-800">هذا تلميح ذكي يوضح نقطة معينة.</span>
  <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-500 transform rotate-45"></div>
</div>`.trim(),
    });

    this.register({
      id: 'smart-callout-2',
      name: 'Rich Status Card',
      nameAr: 'بطاقة تنبيه وإرشاد (Status Callout)',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '📢',
      descriptionAr: 'بطاقة ملونة لعرض معلومات أو تحذيرات',
      templateHtml: `
<div class="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl shadow-sm w-[250px] m-4">
  <h4 class="font-bold text-sm mb-1 flex items-center gap-2"><span>ℹ️</span>تنبيه النظام</h4>
  <p class="text-xs opacity-90">يرجى التحقق من المدخلات قبل المتابعة للتأكد من صحة البيانات.</p>
</div>`.trim(),
    });

    this.register({
      id: 'smart-callout-3',
      name: 'Step-by-step Banner',
      nameAr: 'شريط خطوات تتابعي',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '🔢',
      descriptionAr: 'شريط يعرض مساراً أو خطوات تتابعية مرقمة',
      templateHtml: `
<div class="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm m-4 overflow-hidden">
  <div class="flex items-center gap-2">
    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
    <span class="text-sm font-bold text-slate-700">التحضير</span>
  </div>
  <div class="w-8 h-0.5 bg-slate-200"></div>
  <div class="flex items-center gap-2">
    <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">2</span>
    <span class="text-sm font-bold text-slate-900">التنفيذ</span>
  </div>
  <div class="w-8 h-0.5 bg-slate-200"></div>
  <div class="flex items-center gap-2 opacity-50">
    <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
    <span class="text-sm font-bold text-slate-500">النهاية</span>
  </div>
</div>`.trim(),
    });

    this.register({
      id: 'smart-callout-4',
      name: 'Elevated Blockquote',
      nameAr: 'مربع اقتباس وتوثيق مرجعي',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '❝',
      descriptionAr: 'مربع أنيق للاقتباسات مع علامة تنصيص بارزة',
      templateHtml: `
<div class="relative w-[300px] p-5 bg-slate-50 border-r-4 border-slate-800 rounded-l-xl m-4">
  <span class="text-4xl text-slate-300 font-serif absolute top-2 right-2">"</span>
  <p class="text-sm text-slate-700 leading-relaxed relative z-10 font-serif italic mt-2">التصميم ليس فقط ما يبدو عليه الشيء، بل كيف يعمل أيضاً.</p>
  <div class="text-[10px] font-bold text-slate-500 mt-3 relative z-10">المصدر: توثيقات التصميم 2026</div>
</div>`.trim(),
    });

    this.register({
      id: 'smart-shape-5',
      name: 'Starburst Badge',
      nameAr: 'شارة نجمية متعددة الرؤوس',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '💥',
      descriptionAr: 'شارة دائرية مميزة لعروض الخصومات والميزات الجديدة',
      templateHtml: `
<div class="relative w-24 h-24 flex items-center justify-center m-4 cursor-pointer hover:scale-105 transition-transform">
  <div class="absolute inset-0 bg-amber-500 transform rotate-45 rounded-lg shadow-sm"></div>
  <div class="absolute inset-0 bg-amber-500 transform rotate-[22.5deg] rounded-lg shadow-sm"></div>
  <div class="absolute inset-0 bg-amber-500 transform rotate-[67.5deg] rounded-lg shadow-sm"></div>
  <div class="absolute inset-0 bg-amber-500 rounded-lg shadow-sm"></div>
  <div class="relative z-10 font-black text-white text-lg drop-shadow-md border-2 border-white/20 rounded-full w-16 h-16 flex items-center justify-center bg-amber-500">جديد</div>
</div>`.trim(),
    });

    this.register({
      id: 'smart-shape-6',
      name: 'Keyboard Shortcut Chip',
      nameAr: 'شريط اختصارات لوحة المفاتيح',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '⌨️',
      descriptionAr: 'تصميم يحاكي أزرار لوحة المفاتيح لشرح الاختصارات',
      templateHtml: `
<div class="flex items-center gap-1.5 p-2 m-4 bg-slate-50 border border-slate-200 rounded-lg w-fit">
  <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-700 shadow-[0_2px_0_rgba(203,213,225,1)]">Ctrl</kbd>
  <span class="text-slate-400 text-xs font-bold">+</span>
  <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-700 shadow-[0_2px_0_rgba(203,213,225,1)]">Shift</kbd>
  <span class="text-slate-400 text-xs font-bold">+</span>
  <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-700 shadow-[0_2px_0_rgba(203,213,225,1)]">K</kbd>
</div>`.trim(),
    });

    this.register({
      id: 'smart-shape-7',
      name: 'Segmented Capsule',
      nameAr: 'حاوية الكبسولة المجزأة',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '💊',
      descriptionAr: 'شكل كبسولي مقسم داخلياً للخيارات',
      templateHtml: `
<div class="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner w-fit m-4">
  <button class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-sm">الخيار 1</button>
  <button class="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">الخيار 2</button>
  <button class="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">الخيار 3</button>
</div>`.trim(),
    });

    this.register({
      id: 'smart-shape-8',
      name: 'Collapsible Accordion',
      nameAr: 'أكورديون توضيحي قابل للطي',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '🔽',
      descriptionAr: 'صندوق قابل للطي لعرض تفاصيل إضافية بدون تشويش',
      templateHtml: `
<details class="w-[300px] m-4 bg-white border border-slate-200 rounded-xl shadow-sm group">
  <summary class="px-4 py-3 font-bold text-sm text-slate-800 cursor-pointer list-none flex justify-between items-center group-open:border-b border-slate-100">
    <span>تفاصيل إضافية هامة</span>
    <span class="text-blue-500 transform group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <div class="p-4 text-xs text-slate-600 leading-relaxed bg-slate-50/50 rounded-b-xl">
    هذا النص مخفي افتراضياً ويظهر عند النقر لتوفير المساحة وتجنب التشويش البصري على واجهة المستخدم.
  </div>
</details>`.trim(),
    });

    this.register({
      id: 'smart-shape-9',
      name: '2x2 Matrix Grid',
      nameAr: 'مصفوفة التحليل الرباعي 2x2',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '⊞',
      descriptionAr: 'مصفوفة من 4 أقسام للشروحات والمقارنات',
      templateHtml: `
<div class="w-[400px] h-[300px] grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-slate-100 rounded-2xl m-4 relative border border-slate-200">
  <div class="absolute top-1/2 left-0 right-0 h-px bg-slate-300"></div>
  <div class="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300"></div>
  <div class="bg-white/80 p-3 rounded-xl flex flex-col justify-center items-center text-center shadow-sm">
    <div class="font-bold text-emerald-600 text-sm mb-1">مرتفع / إيجابي</div>
    <div class="text-[10px] text-slate-500">منطقة الأولوية القصوى</div>
  </div>
  <div class="bg-white/80 p-3 rounded-xl flex flex-col justify-center items-center text-center shadow-sm">
    <div class="font-bold text-blue-600 text-sm mb-1">مرتفع / سلبي</div>
    <div class="text-[10px] text-slate-500">يتطلب خطة معالجة</div>
  </div>
  <div class="bg-white/80 p-3 rounded-xl flex flex-col justify-center items-center text-center shadow-sm">
    <div class="font-bold text-amber-600 text-sm mb-1">منخفض / إيجابي</div>
    <div class="text-[10px] text-slate-500">مكاسب سريعة</div>
  </div>
  <div class="bg-white/80 p-3 rounded-xl flex flex-col justify-center items-center text-center shadow-sm">
    <div class="font-bold text-rose-600 text-sm mb-1">منخفض / سلبي</div>
    <div class="text-[10px] text-slate-500">تجاهل في المرحلة الحالية</div>
  </div>
</div>`.trim(),
    });

    this.register({
      id: 'smart-shape-10',
      name: 'Annotated Code Snippet',
      nameAr: 'بطاقة الكود المصغر المفسرة',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '📝',
      descriptionAr: 'مربع كود منسق مع هوامش مخصصة للشرح',
      templateHtml: `
<div class="w-[450px] m-4 bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 text-left" dir="ltr">
  <div class="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-700">
    <div class="w-3 h-3 rounded-full bg-rose-500"></div>
    <div class="w-3 h-3 rounded-full bg-amber-500"></div>
    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
    <span class="text-[10px] text-slate-400 font-mono ml-2">app.tsx</span>
  </div>
  <div class="p-4 relative">
    <pre class="text-xs text-slate-300 font-mono leading-relaxed">
<span class="text-purple-400">export function</span> <span class="text-blue-400">App</span>() {
  <span class="text-purple-400">return</span> (
    <span class="text-slate-400">&lt;</span><span class="text-rose-400">Workbench</span> <span class="text-slate-400">/&gt;</span>
  );
}</pre>
    <div class="absolute right-4 top-8 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg backdrop-blur-sm" dir="rtl">
      <div class="text-[10px] font-bold text-blue-300 flex items-center gap-1">
        <span>←</span> <span>نقطة دخول التطبيق الرئيسية</span>
      </div>
    </div>
  </div>
</div>`.trim(),
    });

    // Smart Shape 11: Interactive Flow Connector Node
    this.register({
      id: 'smart-shape-11',
      name: 'Flow Connector Node',
      nameAr: 'عقدة موصل تدفقي ذكية',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '🔗',
      descriptionAr: 'عقدة تدفق مع نقاط ربط مغناطيسية وأسهم توجيهية',
      templateHtml: `
<div class="w-[280px] p-4 bg-white border border-blue-200 rounded-xl shadow-md m-4 flex items-center gap-3 relative">
  <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">⚡</div>
  <div>
    <h4 class="font-bold text-sm text-slate-800 m-0">معالجة الحدث</h4>
    <p class="text-xs text-slate-500 m-0 mt-0.5">تنفيذ الطلب عبر النواة الموجهة</p>
  </div>
  <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow">→</div>
</div>`.trim(),
    });

    // Smart Shape 12: Metric Counter Badge
    this.register({
      id: 'smart-shape-12',
      name: 'Metric Counter Badge',
      nameAr: 'شارة عداد المقاييس الإحصائية',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '📊',
      descriptionAr: 'بطاقة عرض إحصائية مع نسبة نمو وتسمية',
      templateHtml: `
<div class="w-[220px] p-4 bg-white border border-slate-200 rounded-xl shadow-sm m-4">
  <div class="text-xs text-slate-500 font-semibold mb-1">إجمالي التفاعلات</div>
  <div class="flex items-baseline justify-between">
    <span class="text-2xl font-black text-slate-900">24,892</span>
    <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.4%</span>
  </div>
</div>`.trim(),
    });

    // Smart Shape 13: Tabbed Explanation Container
    this.register({
      id: 'smart-shape-13',
      name: 'Tabbed Explanation Container',
      nameAr: 'حاوية تبويبات الشرح التفاعلي',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '📑',
      descriptionAr: 'حاوية متعددة التبويبات لعرض سيناريوهات متعددة',
      templateHtml: `
<div class="w-[360px] bg-white border border-slate-200 rounded-xl shadow-sm m-4 overflow-hidden">
  <div class="flex bg-slate-50 border-b border-slate-200 p-1 gap-1">
    <button class="px-3 py-1.5 bg-white text-blue-600 font-bold text-xs rounded-lg shadow-sm">السيناريو أ</button>
    <button class="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg">السيناريو ب</button>
    <button class="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg">السيناريو ج</button>
  </div>
  <div class="p-4 text-xs text-slate-600 leading-relaxed">
    يعرض هذا التبويب تفاصيل السيناريو الأول مع إمكانية التبديل الفوري لرؤية الفروق المعمارية بدقة.
  </div>
</div>`.trim(),
    });

    // Smart Shape 14: Multi-Column Comparison Box
    this.register({
      id: 'smart-shape-14',
      name: 'Multi-Column Comparison Box',
      nameAr: 'صندوق مقارنة متعدد الأعمدة',
      category: 'features',
      categoryAr: 'عرض الميزات والخدمات',
      icon: '⚖️',
      descriptionAr: 'مقارنة مباشرة بين النظام القديم والمنظومة الجديدة',
      templateHtml: `
<div class="w-[500px] grid grid-cols-2 gap-4 m-4">
  <div class="p-4 bg-rose-50/50 border border-rose-200 rounded-xl">
    <h4 class="font-bold text-xs text-rose-700 mb-2">❌ الأسلوب التقليدي</h4>
    <ul class="text-xs text-slate-600 space-y-1 pl-4 list-disc">
      <li>تبعيات خارجية معقدة</li>
      <li>ثيمات داكنة ثقيلة ومزعجة</li>
      <li>بطء في الاستجابة</li>
    </ul>
  </div>
  <div class="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
    <h4 class="font-bold text-xs text-emerald-700 mb-2">✅ المنظومة المعمارية الجديدة</h4>
    <ul class="text-xs text-slate-600 space-y-1 pl-4 list-disc">
      <li>بدون تبعيات خارجية (Zero-Deps)</li>
      <li>ثيم فاتح نقي 100% لراحة العين</li>
      <li>استجابة فورية ونقاء كامل</li>
    </ul>
  </div>
</div>`.trim(),
    });

    // Smart Shape 15: Floating Tooltip Card
    this.register({
      id: 'smart-shape-15',
      name: 'Floating Tooltip Card',
      nameAr: 'بطاقة تلميح وإيضاح عائمة',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '💬',
      descriptionAr: 'تلميح تفاعلي منبثق لتسليط الضوء على العناصر الهامة',
      templateHtml: `
<div class="w-[260px] p-3 bg-slate-900 text-white rounded-xl shadow-xl m-4 relative text-xs leading-relaxed" dir="rtl">
  <div class="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
    <span>💡</span> <span>تلميح معماري هام</span>
  </div>
  <p class="text-slate-300 m-0 text-[11px]">يمكنك النقر بزر الماوس الأيمن في أي مكان لفتح السبورة البيضاء التفاعلية.</p>
  <div class="absolute -bottom-2 right-6 w-3 h-3 bg-slate-900 transform rotate-45"></div>
</div>`.trim(),
    });

    // Smart Shape 16: Interactive Dropzone Box
    this.register({
      id: 'smart-shape-16',
      name: 'Interactive Dropzone Box',
      nameAr: 'منطقة إسقاط محتوى تفاعلية',
      category: 'forms',
      categoryAr: 'النماذج والإدخال',
      icon: '📥',
      descriptionAr: 'صندوق سحب وإفلات الملفات والعناصر مع معاينة بصرية',
      templateHtml: `
<div class="w-[340px] p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/30 text-center m-4 hover:bg-blue-50/60 transition-colors cursor-pointer">
  <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl">📁</div>
  <h4 class="font-bold text-sm text-slate-800 mb-1">اسحب الملفات هنا أو انقر للاختيار</h4>
  <p class="text-xs text-slate-500 m-0">يدعم HTML, JSON, Markdown, و PNG</p>
</div>`.trim(),
    });

    // Smart Shape 17: Timeline Milestone Node
    this.register({
      id: 'smart-shape-17',
      name: 'Timeline Milestone Node',
      nameAr: 'عقدة إنجاز خط زمني تفاعلي',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '⏳',
      descriptionAr: 'نقطة في مسار زمني مع حالة إنجاز وأيقونة مخصصة',
      templateHtml: `
<div class="w-[320px] flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm m-4">
  <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm flex-shrink-0">✓</div>
  <div>
    <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">المرحلة الثالثة مكتملة</div>
    <h4 class="font-bold text-sm text-slate-800 m-0 mb-1">إطلاق محرك التعاون والتحصين</h4>
    <p class="text-xs text-slate-500 m-0 leading-relaxed">تم إنجاز كامل متطلبات التحصين ومعالجة الأحداث بكفاءة عالية.</p>
  </div>
</div>`.trim(),
    });

    // Smart Shape 18: Toggleable Annotation Badge
    this.register({
      id: 'smart-shape-18',
      name: 'Toggleable Annotation Badge',
      nameAr: 'شارة توضيحية متحكم بها',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '🏷️',
      descriptionAr: 'شارة نقطية لتوضيح جزء معين من الواجهة',
      templateHtml: `
<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full shadow-sm m-4">
  <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
  <span class="text-xs font-bold text-amber-800">تنبيه: عنصر تفاعلي نشط</span>
</div>`.trim(),
    });

    // Smart Shape 19: Resizable Media Frame
    this.register({
      id: 'smart-shape-19',
      name: 'Resizable Media Frame',
      nameAr: 'إطار وسائط مرن لعرض المعاينات',
      category: 'video',
      categoryAr: 'الوسائط والفيديو',
      icon: '🖼️',
      descriptionAr: 'إطار أنيق لعرض الرسوم التوضيحية أو الشاشات',
      templateHtml: `
<div class="w-[380px] bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden m-4">
  <div class="h-40 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm border-b border-slate-200">
    معاينة الرسم التوضيحي أو الشاشة
  </div>
  <div class="p-3 bg-white flex justify-between items-center text-xs text-slate-600">
    <span class="font-bold">مخطط النظام المعماري</span>
    <span class="bg-slate-100 px-2 py-0.5 rounded text-[10px]">1200 × 800</span>
  </div>
</div>`.trim(),
    });

    // Smart Shape 20: Warning Alert Banner
    this.register({
      id: 'smart-shape-20',
      name: 'Warning Alert Banner',
      nameAr: 'شريط تنبيه تحذيري',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '⚠️',
      descriptionAr: 'تنبيه بتصميم فاتح أنيق مع أيقونة مميزة وإطار دلالي',
      templateHtml: `
<div class="w-[380px] p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 m-4">
  <span class="text-amber-600 text-lg">⚠️</span>
  <div>
    <h4 class="font-bold text-xs text-amber-900 m-0 mb-1">تنبيه هام للمطورين</h4>
    <p class="text-[11px] text-amber-800 m-0 leading-relaxed">تأكد من مطابقة الأنواع والتزام الثيم الفاتح النقي في كافة التعديلات القادمة.</p>
  </div>
</div>`.trim(),
    });

    // Smart Shape 21: Success Confirmation Box
    this.register({
      id: 'smart-shape-21',
      name: 'Success Confirmation Box',
      nameAr: 'صندوق تأكيد النجاح',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '✅',
      descriptionAr: 'بطاقة نجاح خضراء فاتحة لإظهار اكتمال العمليات',
      templateHtml: `
<div class="w-[380px] p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 m-4">
  <span class="text-emerald-600 text-lg">✅</span>
  <div>
    <h4 class="font-bold text-xs text-emerald-900 m-0 mb-1">تمت العملية بنجاح</h4>
    <p class="text-[11px] text-emerald-800 m-0 leading-relaxed">تم تحديث المكونات والتحقق من سلامة الأكواد البرمجية بنسبة 100%.</p>
  </div>
</div>`.trim(),
    });

    // Smart Shape 22: Step-by-Step Guidance Card
    this.register({
      id: 'smart-shape-22',
      name: 'Step-by-Step Guidance Card',
      nameAr: 'بطاقة خطوات الإرشاد التسلسلي',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '🔢',
      descriptionAr: 'عنصر خطوات مرقمة تفاعلي للشروحات التعليمية',
      templateHtml: `
<div class="w-[360px] p-4 bg-white border border-slate-200 rounded-xl shadow-sm m-4 space-y-3">
  <div class="flex items-center gap-3">
    <div class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</div>
    <span class="text-xs font-bold text-slate-800">اختر الكتلة أو القالب المناسب من القائمة</span>
  </div>
  <div class="flex items-center gap-3">
    <div class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</div>
    <span class="text-xs font-bold text-slate-800">اسحب أو انقر لإضافته إلى منطقة العمل</span>
  </div>
  <div class="flex items-center gap-3">
    <div class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</div>
    <span class="text-xs font-bold text-slate-800">عدّل الخصائص وصدر الكود النظيف فورياً</span>
  </div>
</div>`.trim(),
    });

    // Smart Shape 23: Feature Highlight Pill
    this.register({
      id: 'smart-shape-23',
      name: 'Feature Highlight Pill',
      nameAr: 'كبسولة تمييز الميزات',
      category: 'badge',
      categoryAr: 'الشارات والعلامات',
      icon: '🌟',
      descriptionAr: 'كبسولة أنيقة لتسليط الضوء على ميزة رئيسية',
      templateHtml: `
<div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl shadow-sm m-4">
  <span class="text-blue-600 font-bold text-sm">⚡</span>
  <div class="text-xs">
    <span class="font-bold text-blue-900">ميزة حصرية:</span>
    <span class="text-blue-700 ml-1">توليد أكواد متزامنة بلا حدود</span>
  </div>
</div>`.trim(),
    });

    // Smart Shape 24: Interactive Feedback Widget
    this.register({
      id: 'smart-shape-24',
      name: 'Interactive Feedback Widget',
      nameAr: 'أداة تقييم وتغذية راجعة تفاعلية',
      category: 'interactive',
      categoryAr: 'عناصر تفاعلية',
      icon: '⭐',
      descriptionAr: 'واجهة تقييم سريعة مع أيقونات تعبيرية',
      templateHtml: `
<div class="w-[280px] p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center m-4">
  <h4 class="font-bold text-xs text-slate-800 mb-2">كيف تقيم جودة الشرح الحالي؟</h4>
  <div class="flex justify-center gap-3 text-xl mb-3 cursor-pointer">
    <span class="hover:scale-125 transition-transform">😞</span>
    <span class="hover:scale-125 transition-transform">😐</span>
    <span class="hover:scale-125 transition-transform">😊</span>
    <span class="hover:scale-125 transition-transform">🤩</span>
  </div>
  <span class="text-[10px] text-slate-400">انقر للتقييم الفوري</span>
</div>`.trim(),
    });

    // Smart Shape 25: WYSIWYG Sticky Note
    this.register({
      id: 'smart-shape-25',
      name: 'WYSIWYG Sticky Note',
      nameAr: 'ملاحظة لاصقة صفراء تفاعلية',
      category: 'callouts',
      categoryAr: 'الشروحات والتوضيحات',
      icon: '📌',
      descriptionAr: 'ملاحظة لاصقة بتصميم فاتح لتدوين الأفكار والملاحظات السريعة',
      templateHtml: `
<div class="w-[240px] p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-md m-4 transform -rotate-1 hover:rotate-0 transition-transform">
  <div class="font-bold text-xs text-amber-900 mb-1 flex items-center justify-between">
    <span>📌 ملاحظة سريعة</span>
    <span class="text-[10px] text-amber-700 font-normal">منذ دقيقة</span>
  </div>
  <p class="text-xs text-amber-800 m-0 leading-relaxed font-sans">
    تأكد من مراجعة سجل المكونات والخوارزميات قبل اعتماد التعديلات النهائية.
  </p>
</div>`.trim(),
    });

  }
}

export const componentRegistry = ComponentRegistry.getInstance();
// adding shapes to registry
