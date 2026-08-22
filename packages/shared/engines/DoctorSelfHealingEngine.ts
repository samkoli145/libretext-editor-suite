/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: دكتور الإصلاح الذاتي، معالج الأخطاء ومكتشف المكونات والأدوات والخوارزميات
 * 🏛️ الدور: محرك تشخيصي وعلاجي موحد (Self-Healing Doctor & Discovery Engine)
 * 📥 المستهلك: SystemDoctorModal, ToolRegistry, ComponentRegistry, كافة المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Diagnostic & Self-Healing Pipeline Pattern: فحص دوري واكتشاف شواذ الواجهات
 *      والعناصر وتصحيحها ذاتياً (Auto-Heal) بدون أي تدخل يدوي مع الحفاظ التام
 *      على الثيم الفاتح النقي 100%.
 *    - Integrated Unit & Math Calculator Engine: استخدام محرك الحسابات النقي
 *      unit-calc-engine للتحقق الرياضي من أبعاد الكتل والمحاذاة وحساب الهوامش.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام المطلق بالثيم الفاتح (Pure Light Theme) وتحويل أي لون داكن/أسود فورياً.
 *    2. توليد معرفات IDs فريدة وغير مكررة لكافة العناصر المكتشفة.
 *    3. عدم استخدام eval أو new Function في أي عملية حسابية أو إصلاحية.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية كافة دوال الفحص والترقيع بـ try/catch لمنع انهيار الواجهة.
 *    - معالجة قيم NaN والحدود السالبة للأبعاد واستبدالها بالقيم الافتراضية الآمنة.
 *    - التحقق من نوع الكائنات والخصائص بواسطة Type Guards قبل التعديل.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ComponentRegistry, type RegisteredComponent } from './ComponentRegistry';
import { WEB_COMPONENT_LIBRARY, componentPresets, type WebTemplateItem, type ComponentCategory } from '../../features/canvas-designer/componentLibrary';
import { UNIFIED_TOOL_ITEMS, type UnifiedToolItem } from '../tools/unifiedTools';
import { evaluateCalc, formatCalcVal, freshCalcContext, type CalcVal, unitOf } from '../lib-core/computational-notebook/unit-calc-engine';

export type DiagnosticSeverity = 'info' | 'warning' | 'error' | 'healed';

export interface DiagnosticIssue {
  id: string;
  category: 'theme' | 'identity' | 'geometry' | 'unregistered_component' | 'unregistered_tool' | 'math_error' | 'syntax';
  titleAr: string;
  descriptionAr: string;
  severity: DiagnosticSeverity;
  targetId?: string;
  autoFixAvailable: boolean;
  fixAction?: () => boolean;
}

export interface SystemHealthReport {
  timestamp: string;
  totalComponentsScanned: number;
  totalToolsScanned: number;
  totalAlgorithmsScanned: number;
  healthScore: number; // 0 - 100
  issues: DiagnosticIssue[];
  healedCount: number;
}

export interface DiscoveredAlgorithmItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'geometry' | 'math' | 'graphics' | 'pipeline' | 'state';
  categoryAr: string;
  descriptionAr: string;
  fileSource: string;
  complexity: string;
  status: 'active' | 'integrated';
}

export class DoctorSelfHealingEngine {
  private static instance: DoctorSelfHealingEngine;

  // سجل الخوارزميات والمعادلات المكتشفة في النظام
  private algorithmsCatalog: DiscoveredAlgorithmItem[] = [
    {
      id: 'alg-kahn-topo-sort',
      nameAr: 'الفرز الطوبولوجي لكاهن (Kahn Topological Sort)',
      nameEn: "Kahn's Topological Sort",
      category: 'math',
      categoryAr: 'الرياضيات والتسلسل',
      descriptionAr: 'اشتقاق العلاقات التبعية للمتغيرات وحل المعادلات الرياضية بدون حلقات تكرار مفرغة (#CYCLE!).',
      fileSource: 'src/shared/lib-core/computational-notebook/ScratchpadGraph.ts',
      complexity: 'O(V + E)',
      status: 'active',
    },
    {
      id: 'alg-unit-calc-descent',
      nameAr: 'محرك حساب وتحويل الوحدات (Unit Calculus Engine)',
      nameEn: 'Recursive Descent Unit Calculus',
      category: 'math',
      categoryAr: 'الحسابات الهندسية',
      descriptionAr: 'تحليل وحساب التعبيرات الرياضية والوحدات الفيزيائية والحسابية اللحظية بصفر اعتماديات.',
      fileSource: 'src/shared/lib-core/computational-notebook/unit-calc-engine.ts',
      complexity: 'O(N)',
      status: 'active',
    },
    {
      id: 'alg-snap-align-guides',
      nameAr: 'المحاذاة المغناطيسية وخطوط الإرشاد الذكية',
      nameEn: 'Magnetic Snap & Guide Alignment',
      category: 'geometry',
      categoryAr: 'الهندسة والكانفا',
      descriptionAr: 'حساب المسافات والإسقاطات النقطية لمحاذاة العناصر مع المراكز والحواف وأبعاد الكانفا بدقة 1px.',
      fileSource: 'src/shared/lib-core/geometry/snap-align-engine.ts',
      complexity: 'O(N)',
      status: 'active',
    },
    {
      id: 'alg-bezier-subdivision',
      nameAr: 'تقسيم ورسم منحنيات بيزييه (Bezier Curves)',
      nameEn: 'Cubic & Quadratic Bezier Subdivider',
      category: 'geometry',
      categoryAr: 'الهندسة والرسوم المتجهة',
      descriptionAr: 'حساب مسارات المنحنيات ومقابض التحكم التفاعلية ونقاط الارتكاز بالأبعاد الدقيقة.',
      fileSource: 'src/shared/lib-core/geometry/bezier-curves.ts',
      complexity: 'O(Steps)',
      status: 'active',
    },
    {
      id: 'alg-bounding-box-inner-radius',
      nameAr: 'حساب الأبعاد والـ Nested Border Radius الرياضي',
      nameEn: 'Nested Border Radius Math & Bounding Box',
      category: 'geometry',
      categoryAr: 'الهندسة والتخطيط',
      descriptionAr: 'حساب نصف القطر الداخلي هندسياً: (Inner Radius = Outer Radius - Padding) لمنع تشوه الحواف.',
      fileSource: 'src/shared/lib-core/geometry/bounding-box.ts',
      complexity: 'O(1)',
      status: 'active',
    },
    {
      id: 'alg-zip-deflate-crc32',
      nameAr: 'محرك ضغط الأرشيف CRC32 و ZIP النقي',
      nameEn: 'Pure Zero-Dep ZIP & ODF Packager',
      category: 'pipeline',
      categoryAr: 'معالجة وتصدير المستندات',
      descriptionAr: 'توليد وتصدير ملفات ODT, DOCX, EPUB محلياً بصفر مكتبات مع حساب CRC32 الدقيق.',
      fileSource: 'src/shared/lib-core/archive/zip-engine.ts',
      complexity: 'O(DataSize)',
      status: 'active',
    },
    {
      id: 'alg-jpeg-exif-orientation',
      nameAr: 'محلل تدوير الصور وقراءة EXIF النقي',
      nameEn: 'Pure JPEG EXIF Orientation Decoder',
      category: 'graphics',
      categoryAr: 'معالجة الصور والرسوم',
      descriptionAr: 'قراءة علامات التدوير 1-8 من وسوم APP1 الثنائية وتصحيح اتجاه الصور بدون أي حزم خارجية.',
      fileSource: 'src/core/engines/ImagePipelineEngine.ts',
      complexity: 'O(1)',
      status: 'active',
    },
    {
      id: 'alg-color-palette-extractor',
      nameAr: 'خوارزمية استخراج لوحة الألوان الفاتحة النقية',
      nameEn: 'Pure Light Palette Extractor',
      category: 'graphics',
      categoryAr: 'معالجة الصور والرسوم',
      descriptionAr: 'تكميم الألوان في مصفوفة البكسل واشتقاق 6 درجات لونية متوافقة مع الثيم الفاتح النقي.',
      fileSource: 'src/core/engines/ImagePipelineEngine.ts',
      complexity: 'O(Pixels)',
      status: 'active',
    },
  ];

  private constructor() {}

  public static getInstance(): DoctorSelfHealingEngine {
    if (!DoctorSelfHealingEngine.instance) {
      DoctorSelfHealingEngine.instance = new DoctorSelfHealingEngine();
    }
    return DoctorSelfHealingEngine.instance;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🩺 1. الفحص الشامل وتشخيص النظام (Comprehensive Health Scan)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public runDiagnostics(contextElements?: any[]): SystemHealthReport {
    const issues: DiagnosticIssue[] = [];
    const registry = ComponentRegistry.getInstance();
    const registeredComponents = registry.getAll();
    let healedCount = 0;

    // 1. فحص المكونات المسجلة في القوالب مقابل سجل المكونات المركزي
    WEB_COMPONENT_LIBRARY.forEach((template) => {
      const exists = registry.get(template.id);
      if (!exists) {
        issues.push({
          id: `unreg-tmpl-${template.id}`,
          category: 'unregistered_component',
          titleAr: `مكون غير مسجل في السجل المركزي: ${template.nameAr}`,
          descriptionAr: `القالب ${template.name} موجود في مكتبة الكانفا لكنه غير مدرج في سجل المكونات الموحد.`,
          severity: 'warning',
          targetId: template.id,
          autoFixAvailable: true,
          fixAction: () => {
            this.registerTemplateIntoRegistry(template);
            return true;
          },
        });
      }
    });

    // 2. فحص مسبقات المكونات (componentPresets)
    componentPresets.forEach((preset) => {
      const exists = registry.get(preset.id);
      if (!exists) {
        issues.push({
          id: `unreg-preset-${preset.id}`,
          category: 'unregistered_component',
          titleAr: `مسبقة غير مفهرسة: ${preset.nameAr}`,
          descriptionAr: `المسبقة ${preset.name} بحاجة للإدراج في الفهرس الموحد.`,
          severity: 'info',
          targetId: preset.id,
          autoFixAvailable: true,
          fixAction: () => {
            registry.register({
              id: preset.id,
              name: preset.name,
              nameAr: preset.nameAr,
              category: (preset.category as any) || 'callouts',
              categoryAr: 'مسبقات التصميم',
              icon: preset.icon,
              descriptionAr: preset.nameAr,
              templateHtml: '',
            });
            return true;
          },
        });
      }
    });

    // 3. فحص الأدوات الموحدة وتكاملها
    UNIFIED_TOOL_ITEMS.forEach((tool) => {
      if (!tool.id || !tool.titleAr) {
        issues.push({
          id: `invalid-tool-${tool.id || 'unknown'}`,
          category: 'unregistered_tool',
          titleAr: `أداة غير مكتملة المواصفات: ${tool.id}`,
          descriptionAr: 'الأداة تفتقر للمعرف الفريد أو الاسم العربي المعتمد.',
          severity: 'error',
          targetId: tool.id,
          autoFixAvailable: false,
        });
      }
    });

    // 4. فحص عناصر الكانفا/المستندات الحية (إن وجدت) للتأكد من خلوها من الألوان الداكنة والحدود المعطوبة
    if (contextElements && Array.isArray(contextElements)) {
      contextElements.forEach((el, idx) => {
        // فحص الثيم الداكن الممنوع
        if (this.hasDarkThemeViolation(el)) {
          issues.push({
            id: `theme-violation-${el.id || idx}`,
            category: 'theme',
            titleAr: `انتهاك الثيم الفاتح في العنصر: ${el.id || `#${idx}`}`,
            descriptionAr: 'العنصر يحتوي على ألوان داكنة/سوداء محظورة تخالف معيار الثيم الفاتح النقي 100%.',
            severity: 'error',
            targetId: el.id,
            autoFixAvailable: true,
            fixAction: () => {
              this.sanitizeElementTheme(el);
              return true;
            },
          });
        }

        // فحص الـ ID المفقود أو غير الصالح
        if (!el.id || typeof el.id !== 'string') {
          issues.push({
            id: `missing-id-${idx}`,
            category: 'identity',
            titleAr: `عنصر يفتقر لمعرف فريد (ID): عنصر #${idx}`,
            descriptionAr: 'العنصر لا يحمل معرف ID صالح مما يؤثر على دقة التحديد وسجل التاريخ والتراجع.',
            severity: 'warning',
            autoFixAvailable: true,
            fixAction: () => {
              el.id = `el-auto-healed-${Date.now()}-${idx}`;
              return true;
            },
          });
        }

        // فحص الأبعاد الهندسية السالبة أو NaN
        if (el.width !== undefined && (isNaN(el.width) || el.width <= 0)) {
          issues.push({
            id: `invalid-width-${el.id || idx}`,
            category: 'geometry',
            titleAr: `عرض غير صالح في العنصر: ${el.id || `#${idx}`}`,
            descriptionAr: `قيمة العرض الحالية (${el.width}) غير صالحة وتسبب تشوه مسرح العمل.`,
            severity: 'warning',
            targetId: el.id,
            autoFixAvailable: true,
            fixAction: () => {
              el.width = 240;
              return true;
            },
          });
        }

        if (el.height !== undefined && (isNaN(el.height) || el.height <= 0)) {
          issues.push({
            id: `invalid-height-${el.id || idx}`,
            category: 'geometry',
            titleAr: `ارتفاع غير صالح في العنصر: ${el.id || `#${idx}`}`,
            descriptionAr: `قيمة الارتفاع الحالية (${el.height}) غير صالحة.`,
            severity: 'warning',
            targetId: el.id,
            autoFixAvailable: true,
            fixAction: () => {
              el.height = 160;
              return true;
            },
          });
        }
      });
    }

    // حساب مؤشر صحة النظام
    const errorWeight = issues.filter((i) => i.severity === 'error').length * 15;
    const warningWeight = issues.filter((i) => i.severity === 'warning').length * 5;
    const healthScore = Math.max(0, Math.min(100, 100 - errorWeight - warningWeight));

    return {
      timestamp: new Date().toISOString(),
      totalComponentsScanned: registeredComponents.length + WEB_COMPONENT_LIBRARY.length,
      totalToolsScanned: UNIFIED_TOOL_ITEMS.length,
      totalAlgorithmsScanned: this.algorithmsCatalog.length,
      healthScore,
      issues,
      healedCount,
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🩹 2. المعالج والإصلاح الذاتي الشامل (Auto-Heal All)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public autoHealAll(contextElements?: any[]): { success: boolean; healedCount: number; report: SystemHealthReport } {
    const report = this.runDiagnostics(contextElements);
    let healed = 0;

    report.issues.forEach((issue) => {
      if (issue.autoFixAvailable && issue.fixAction) {
        try {
          const ok = issue.fixAction();
          if (ok) {
            healed++;
            issue.severity = 'healed';
            issue.descriptionAr += ' (✓ تم الإصلاح الذاتي بنجاح)';
          }
        } catch (e) {
          console.error(`[DoctorSelfHealingEngine] فشل معالجة الخطأ ${issue.id}:`, e);
        }
      }
    });

    report.healedCount = healed;
    report.healthScore = Math.min(100, report.healthScore + healed * 10);

    return {
      success: true,
      healedCount: healed,
      report,
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 3. علاج وتنقية الثيم الفاتح النقي (Pure Light Theme Sanitizer)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public hasDarkThemeViolation(element: any): boolean {
    if (!element) return false;
    const json = JSON.stringify(element).toLowerCase();
    const darkPatterns = [
      '#000000',
      '#111827',
      '#0f172a',
      '#1e293b',
      '#000',
      '#111',
      'rgb(0,0,0)',
      'rgb(0, 0, 0)',
      'black',
      'bg-slate-900',
      'bg-gray-900',
      'bg-black',
      'dark:',
    ];

    // استثناء النصوص السوداء المقبولة ذات التباين الواضح
    return darkPatterns.some((pattern) => {
      if (json.includes(`background-color:${pattern}`) || json.includes(`background:${pattern}`) || json.includes(`"backgroundcolor":"${pattern}"`)) {
        return true;
      }
      return false;
    });
  }

  public sanitizeElementTheme(element: any): void {
    if (!element) return;

    if (element.styles) {
      if (this.isDarkColor(element.styles.backgroundColor)) {
        element.styles.backgroundColor = '#ffffff';
      }
      if (this.isDarkColor(element.styles.borderColor)) {
        element.styles.borderColor = '#e2e8f0';
      }
      if (!element.styles.color || element.styles.color === '#ffffff') {
        element.styles.color = '#0f172a';
      }
    }

    if (typeof element.content === 'string') {
      element.content = this.sanitizeHtmlStringColors(element.content);
    }
  }

  public sanitizeHtmlStringColors(html: string): string {
    if (!html) return '';
    return html
      .replace(/background-color:\s*(#000000|#111827|#1e293b|#0f172a|#000|#111|black)/gi, 'background-color: #ffffff')
      .replace(/background:\s*(#000000|#111827|#1e293b|#0f172a|#000|#111|black)/gi, 'background: #f8fafc')
      .replace(/color:\s*(#ffffff|#fff|white);/gi, 'color: #0f172a;');
  }

  private isDarkColor(color?: string): boolean {
    if (!color) return false;
    const c = color.trim().toLowerCase();
    return (
      c === '#000000' ||
      c === '#000' ||
      c === '#111827' ||
      c === '#1e293b' ||
      c === '#0f172a' ||
      c === 'black' ||
      c.includes('rgb(0,0,0)') ||
      c.includes('rgb(0, 0, 0)')
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🧮 4. الحاسبة الهندسية الذكية المدمجة (Integrated Unit Calculator)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * تقييم التعبيرات الرياضية والهندسية وحساب المقاسات والوحدات اللحظية
   * مثال: "760px - 2 * 32px", "50m + 200cm in m", "1280 / (16/9)"
   */
  public calculateGeometryOrUnit(expression: string): {
    resultFormatted: string;
    rawVal: CalcVal | null;
    explanationAr: string;
    isFiniteNumber: boolean;
  } {
    if (!expression || !expression.trim()) {
      return {
        resultFormatted: '0',
        rawVal: null,
        explanationAr: 'يرجى إدخال تعبير رياضي أو هندسي لحسابه.',
        isFiniteNumber: false,
      };
    }

    try {
      const ctx = freshCalcContext();
      const val = evaluateCalc(expression, ctx);

      if (val && Number.isFinite(val.n)) {
        const formatted = formatCalcVal(val, 'ar-EG');
        let explanation = `النتيجة المحسوبة بدقة صفرية الاعتماديات: ${formatted}`;

        if (val.u) {
          explanation += ` (الوحدة: ${val.u})`;
        }

        return {
          resultFormatted: formatted,
          rawVal: val,
          explanationAr: explanation,
          isFiniteNumber: true,
        };
      }

      // دعم المعادلات التخطيطية المباشرة (مثل 1280 / (16/9) أو نسب الأبعاد)
      const sanitized = expression.replace(/px|pt|em|rem/gi, '').trim();
      const fallbackVal = evaluateCalc(sanitized, ctx);
      if (fallbackVal && Number.isFinite(fallbackVal.n)) {
        return {
          resultFormatted: `${Math.round(fallbackVal.n * 100) / 100}px`,
          rawVal: fallbackVal,
          explanationAr: `تم حساب البعد الهندسي: ${fallbackVal.n}px`,
          isFiniteNumber: true,
        };
      }

      return {
        resultFormatted: 'تعبير غير صالح',
        rawVal: null,
        explanationAr: 'لم نتمكن من تحليل التعبير. تأكد من صحة الصيغة الرياضية مثل: 1200 - 2 * 32',
        isFiniteNumber: false,
      };
    } catch (e) {
      return {
        resultFormatted: 'خطأ في الحساب',
        rawVal: null,
        explanationAr: `حدث خطأ أثناء تقييم التعبير: ${String(e)}`,
        isFiniteNumber: false,
      };
    }
  }

  /**
   * حساب نصف القطر الداخلي هندسياً بناءً على قاعدة Nested Radius
   * Rule: Inner Radius = Outer Radius - Padding
   */
  public calculateNestedRadius(outerRadius: number, padding: number): number {
    return Math.max(0, outerRadius - padding);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔍 5. مكتشف الخوارزميات والأدوات الموحدة (Algorithms & Tools Catalog)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public getAlgorithmsCatalog(): DiscoveredAlgorithmItem[] {
    return [...this.algorithmsCatalog];
  }

  public searchAlgorithms(query: string): DiscoveredAlgorithmItem[] {
    if (!query) return this.algorithmsCatalog;
    const q = query.toLowerCase();
    return this.algorithmsCatalog.filter(
      (alg) =>
        alg.nameAr.toLowerCase().includes(q) ||
        alg.nameEn.toLowerCase().includes(q) ||
        alg.descriptionAr.toLowerCase().includes(q) ||
        alg.categoryAr.toLowerCase().includes(q)
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📥 6. إدراج المكونات المكتشفة في السجل المركزي
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public registerTemplateIntoRegistry(template: WebTemplateItem): boolean {
    try {
      const registry = ComponentRegistry.getInstance();
      const def: RegisteredComponent = {
        id: template.id,
        name: template.name,
        nameAr: template.nameAr,
        category: (template.category as any) || 'callouts',
        categoryAr: template.categoryAr,
        icon: template.icon,
        descriptionAr: template.descriptionAr,
        templateHtml: template.templateHtml,
      };

      registry.register(def);
      return true;
    } catch (e) {
      console.error(`[DoctorSelfHealingEngine] فشل تسجيل المكون ${template.id}:`, e);
      return false;
    }
  }

  /**
   * تسجيل كافة قوالب الويب الـ 23 دفعة واحدة في السجل الموحد
   */
  public syncAllWebTemplatesToRegistry(): number {
    let synced = 0;
    WEB_COMPONENT_LIBRARY.forEach((template) => {
      if (this.registerTemplateIntoRegistry(template)) {
        synced++;
      }
    });
    return synced;
  }
}

export const doctorEngine = DoctorSelfHealingEngine.getInstance();
