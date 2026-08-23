/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل الأدوات المركزي الموحد - Unified Tool Registry
 * 🏛️ الدور: محرك مشترك - مصدر الحقيقة الشامل لكل الأدوات في المحررات الأربعة
 * 📥 المستهلك: SharedRibbonBar, UnifiedToolboxBlock, useToolRegistry, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Single Source of Truth: سجل مركزي يضمن ظهور نفس الأدوات في كل المحررات
 *    مع دعم الفئات والأيقونات والأحداث والاختصارات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأدوات يجب أن تظهر في كل المحررات الأربعة (قاعدة AGENTS.md)
 *    2. IDs يجب أن تكون فريدة (لا تكرار)
 *    3. الفئات يجب أن تبقى متسقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار IDs عند التسجيل
 *    - إرجاع أداة افتراضية عند عدم الوجود
 *    - تسجيل ذكي (lazy) لتجنب التعارض
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { latexEngine } from '../engines/LaTeXEngine';
import { dialogEngine } from '../engines/DialogEngine';
import { UNIFIED_TOOL_ITEMS, type UnifiedToolItem, type ToolCategory } from './unifiedTools';
import {
  WEB_COMPONENT_LIBRARY,
  getAllWebComponents,
  type WebTemplateItem,
} from '../../features/canvas-designer/componentLibrary';
import { rerouteAllConnectors } from '../lib-core/geometry/connector-rerouting-engine';
import {
  clampPopoverToViewport,
  formatRelativeTime,
  resolveCommentMarker,
  suggestCommentAnchor,
} from '../lib-core/events/comments-anchoring-engine';
import {
  curveBoundsForNodes,
  insertBezierNodeAt,
  markBezierNode,
  normalizeBezierNodes,
  toggleBezierNodeCorner,
} from '../lib-core/geometry/bezier-editing-tool';
import {
  classifyHybridWaypoints,
  hybridWaypointsToPath,
  nudgeWaypointSpeed,
  resolveEffectiveWaypoints,
  setWaypointSpeed,
} from '../lib-core/animation/motion-path-tooling-engine';
import {
  parseClip,
  sanitizeElementLike,
  serializeElements,
  serializeSlides,
} from '../lib-core/document-pipeline/clip-payload-engine';
import {
  colorWithAlphaToRgba,
  combineColor,
  parseColorHex,
  roundAlpha,
} from '../lib-core/raster/color-combine-engine';

/**
 * تصنيفات أدوات LaTeX والرياضيات المجمعة
 */
export interface LatexSymbolItem {
  id: string;
  name: string;
  nameAr: string;
  latex: string;
  symbol: string;
  category:
    'greek' | 'operators' | 'relations' | 'structures' | 'calculus' | 'matrices' | 'physics-math';
  categoryAr: string;
  example?: string;
}

export interface LatexFormulaPreset {
  id: string;
  title: string;
  titleAr: string;
  code: string;
  category: 'algebra' | 'calculus' | 'geometry' | 'physics' | 'statistics';
  categoryAr: string;
  descriptionAr: string;
}

export interface ArithmeticToolItem {
  id: string;
  nameAr: string;
  nameEn: string;
  formulaTemplate: string;
  descriptionAr: string;
  calculate: (inputs: number[]) => { result: number; stepLatex: string; resultLatex: string };
}

export interface EditorExecutionContext {
  editorType: 'rich-text' | 'canvas' | 'ui-page' | 'pdf' | string;
  services?: any;
  richEditor?: any;
  canvasStore?: any;
  insertHtml?: (html: string) => void;
  insertCanvasElement?: (element: any) => void;
}

export class ToolRegistry {
  private static instance: ToolRegistry;

  // 1. Unified Tool Items Cache
  private tools: Map<string, UnifiedToolItem> = new Map();

  // 2. LaTeX Symbols Library
  private latexSymbols: LatexSymbolItem[] = [
    // Greek Letters
    {
      id: 'sym-alpha',
      name: 'alpha',
      nameAr: 'ألفا',
      latex: '\\alpha',
      symbol: 'α',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-beta',
      name: 'beta',
      nameAr: 'بيتا',
      latex: '\\beta',
      symbol: 'β',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-gamma',
      name: 'gamma',
      nameAr: 'غاما',
      latex: '\\gamma',
      symbol: 'γ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-delta',
      name: 'delta',
      nameAr: 'دلتا',
      latex: '\\delta',
      symbol: 'δ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-epsilon',
      name: 'epsilon',
      nameAr: 'إبسيلون',
      latex: '\\epsilon',
      symbol: 'ε',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-theta',
      name: 'theta',
      nameAr: 'ثيتا',
      latex: '\\theta',
      symbol: 'θ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-lambda',
      name: 'lambda',
      nameAr: 'لامدا',
      latex: '\\lambda',
      symbol: 'λ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-mu',
      name: 'mu',
      nameAr: 'ميو',
      latex: '\\mu',
      symbol: 'μ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-pi',
      name: 'pi',
      nameAr: 'باي (ط)',
      latex: '\\pi',
      symbol: 'π',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-sigma',
      name: 'sigma',
      nameAr: 'سيغما',
      latex: '\\sigma',
      symbol: 'σ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-phi',
      name: 'phi',
      nameAr: 'فاي',
      latex: '\\phi',
      symbol: 'φ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-omega',
      name: 'omega',
      nameAr: 'أوميغا',
      latex: '\\omega',
      symbol: 'ω',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-cap-delta',
      name: 'Delta',
      nameAr: 'دلتا الكبيرة',
      latex: '\\Delta',
      symbol: 'Δ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-cap-sigma',
      name: 'Sigma',
      nameAr: 'سيغما الكبيرة',
      latex: '\\Sigma',
      symbol: 'Σ',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },
    {
      id: 'sym-cap-omega',
      name: 'Omega',
      nameAr: 'أوميغا الكبيرة',
      latex: '\\Omega',
      symbol: 'Ω',
      category: 'greek',
      categoryAr: 'الحروف الإغريقية',
    },

    // Operators & Calculations
    {
      id: 'sym-pm',
      name: 'plus-minus',
      nameAr: 'زائد أو ناقص',
      latex: '\\pm',
      symbol: '±',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-times',
      name: 'times',
      nameAr: 'ضرب',
      latex: '\\times',
      symbol: '×',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-div',
      name: 'divide',
      nameAr: 'قسمة',
      latex: '\\div',
      symbol: '÷',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-cdot',
      name: 'dot',
      nameAr: 'نقطة ضرب',
      latex: '\\cdot',
      symbol: '·',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-sqrt',
      name: 'sqrt',
      nameAr: 'جذر تربيعي',
      latex: '\\sqrt{x}',
      symbol: '√x',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-infinity',
      name: 'infinity',
      nameAr: 'ما لا نهاية',
      latex: '\\infty',
      symbol: '∞',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-partial',
      name: 'partial',
      nameAr: 'تفاضل جزئي',
      latex: '\\partial',
      symbol: '∂',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },
    {
      id: 'sym-nabla',
      name: 'nabla',
      nameAr: 'المؤثر التدرجي',
      latex: '\\nabla',
      symbol: '∇',
      category: 'operators',
      categoryAr: 'العمليات الحسابية',
    },

    // Relations & Logic
    {
      id: 'sym-leq',
      name: 'less-equal',
      nameAr: 'أصغر من أو يساوي',
      latex: '\\leq',
      symbol: '≤',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-geq',
      name: 'greater-equal',
      nameAr: 'أكبر من أو يساوي',
      latex: '\\geq',
      symbol: '≥',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-neq',
      name: 'not-equal',
      nameAr: 'لا يساوي',
      latex: '\\neq',
      symbol: '≠',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-approx',
      name: 'approx',
      nameAr: 'يساوي تقريباً',
      latex: '\\approx',
      symbol: '≈',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-equiv',
      name: 'equiv',
      nameAr: 'تطابق',
      latex: '\\equiv',
      symbol: '≡',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-in',
      name: 'in',
      nameAr: 'ينتمي إلى',
      latex: '\\in',
      symbol: '∈',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-subset',
      name: 'subset',
      nameAr: 'مجموعة جزئية',
      latex: '\\subset',
      symbol: '⊂',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-cup',
      name: 'union',
      nameAr: 'اتحاد',
      latex: '\\cup',
      symbol: '∪',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },
    {
      id: 'sym-cap',
      name: 'intersection',
      nameAr: 'تقاطع',
      latex: '\\cap',
      symbol: '∩',
      category: 'relations',
      categoryAr: 'العلاقات والمقارنات',
    },

    // Math Structures
    {
      id: 'str-frac',
      name: 'fraction',
      nameAr: 'كسر اعتيادي',
      latex: '\\frac{a}{b}',
      symbol: 'a/b',
      category: 'structures',
      categoryAr: 'البنى الرياضية والكسور',
      example: '\\frac{x+1}{x-1}',
    },
    {
      id: 'str-sqrt-n',
      name: 'sqrt-n',
      nameAr: 'جذر نوني',
      latex: '\\sqrt[n]{x}',
      symbol: 'ⁿ√x',
      category: 'structures',
      categoryAr: 'البنى الرياضية والكسور',
      example: '\\sqrt[3]{8}',
    },
    {
      id: 'str-pow',
      name: 'power',
      nameAr: 'أس وقوة',
      latex: 'x^{n}',
      symbol: 'xⁿ',
      category: 'structures',
      categoryAr: 'البنى الرياضية والكسور',
      example: 'e^{x}',
    },
    {
      id: 'str-sub',
      name: 'subscript',
      nameAr: 'دليل سفلي',
      latex: 'x_{i}',
      symbol: 'xᵢ',
      category: 'structures',
      categoryAr: 'البنى الرياضية والكسور',
      example: 'a_{n}',
    },
    {
      id: 'str-pow-sub',
      name: 'pow-sub',
      nameAr: 'أس مع دليل سفلي',
      latex: 'x_{i}^{2}',
      symbol: 'xᵢ²',
      category: 'structures',
      categoryAr: 'البنى الرياضية والكسور',
    },

    // Calculus
    {
      id: 'str-int',
      name: 'integral',
      nameAr: 'تكامل غير محدد',
      latex: '\\int f(x)\\,dx',
      symbol: '∫',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
    },
    {
      id: 'str-int-def',
      name: 'def-integral',
      nameAr: 'تكامل محدد بحدود',
      latex: '\\int_{a}^{b} f(x)\\,dx',
      symbol: '∫ₐᵇ',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
    },
    {
      id: 'str-sum',
      name: 'summation',
      nameAr: 'مجموع متسلسل',
      latex: '\\sum_{i=1}^{n} x_i',
      symbol: '∑',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
    },
    {
      id: 'str-prod',
      name: 'product',
      nameAr: 'جداء متسلسل',
      latex: '\\prod_{i=1}^{n} x_i',
      symbol: '∏',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
    },
    {
      id: 'str-lim',
      name: 'limit',
      nameAr: 'نهاية دالة',
      latex: '\\lim_{x \\to a} f(x)',
      symbol: 'lim',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
    },

    // Matrices
    {
      id: 'str-mat-2x2',
      name: 'matrix-2x2',
      nameAr: 'مصفوفة 2×2',
      latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
      symbol: '[2×2]',
      category: 'matrices',
      categoryAr: 'المصفوفات والمتجهات',
    },
    {
      id: 'str-mat-3x3',
      name: 'matrix-3x3',
      nameAr: 'مصفوفة 3×3',
      latex: '\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix}',
      symbol: '[3×3]',
      category: 'matrices',
      categoryAr: 'المصفوفات والمتجهات',
    },
  ];

  // 3. Ready Math & Physics Formulas Presets
  private formulaPresets: LatexFormulaPreset[] = [
    {
      id: 'f-quadratic',
      title: 'Quadratic Equation',
      titleAr: 'حل المعادلة التربيعية (القانون العام)',
      code: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      category: 'algebra',
      categoryAr: 'الجبر والحساب',
      descriptionAr: 'حساب جذور المعادلة التربيعية ax² + bx + c = 0',
    },
    {
      id: 'f-pythagoras',
      title: 'Pythagorean Theorem',
      titleAr: 'مبرهنة فيثاغورس الهندسية',
      code: 'a^2 + b^2 = c^2',
      category: 'geometry',
      categoryAr: 'الهندسة والقياس',
      descriptionAr: 'العلاقة بين أضلاع المثلث القائم الزاوية',
    },
    {
      id: 'f-euler',
      title: "Euler's Identity",
      titleAr: 'متطابقة أويلر الجمالية',
      code: 'e^{i\\pi} + 1 = 0',
      category: 'algebra',
      categoryAr: 'الجبر والحساب',
      descriptionAr: 'تربط أهم 5 ثوابت رياضية في معادلة واحدة (e, i, π, 1, 0)',
    },
    {
      id: 'f-calculus-fund',
      title: 'Fundamental Theorem of Calculus',
      titleAr: 'النظرية الأساسية للتفاضل والتكامل',
      code: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
      descriptionAr: 'حساب التكامل المحدد عبر الدالة الأصلية F(x)',
    },
    {
      id: 'f-sum-squares',
      title: 'Sum of Squares',
      titleAr: 'مجموع مربعات الأعداد المتتالية',
      code: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
      category: 'algebra',
      categoryAr: 'الجبر والحساب',
      descriptionAr: 'صيغة مجموع أول n مربعاً صحيحاً',
    },
    {
      id: 'f-trig-limit',
      title: 'Trigonometric Limit',
      titleAr: 'نهاية الدالة المثلثية الشهيرة',
      code: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
      category: 'calculus',
      categoryAr: 'التفاضل والتكامل',
      descriptionAr: 'الأساس لحساب مشتقات الدوال المثلثية',
    },
    {
      id: 'f-gaussian',
      title: 'Gaussian Normal Distribution',
      titleAr: 'دالة التوزيع الطبيعي الغاوصي',
      code: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}',
      category: 'statistics',
      categoryAr: 'الإحصاء والاحتمالات',
      descriptionAr: 'منحنى الجرس للتوزيع الاحتمالي القياسي',
    },
    {
      id: 'f-einstein',
      title: 'Mass-Energy Equivalence',
      titleAr: 'تكافؤ الكتلة والطاقة (أينشتاين)',
      code: 'E = m c^2',
      category: 'physics',
      categoryAr: 'الفيزياء والعلوم',
      descriptionAr: 'قانون النسبية الخاصة لتحول الكتلة إلى طاقة',
    },
    {
      id: 'f-circle-area',
      title: 'Area of Circle',
      titleAr: 'مساحة الدائرة الدقيقة',
      code: 'A = \\pi r^2',
      category: 'geometry',
      categoryAr: 'الهندسة والقياس',
      descriptionAr: 'حساب مساحة قرص دائري بمعلومية نصف القطر r',
    },
  ];

  // 4. Arithmetic Tools (العمليات الحسابية الآلية)
  private arithmeticTools: ArithmeticToolItem[] = [
    {
      id: 'calc-sum',
      nameAr: 'حساب المجموع التراكمي',
      nameEn: 'Sum Calculation',
      formulaTemplate: 'A + B',
      descriptionAr: 'جمع قيمتين أو أكثر مع توليد صياغة رياضية منسقة',
      calculate: (nums) => {
        const sum = nums.reduce((a, b) => a + b, 0);
        const step = nums.join(' + ');
        return {
          result: sum,
          stepLatex: `${step} = ${sum}`,
          resultLatex: `\\sum = ${sum}`,
        };
      },
    },
    {
      id: 'calc-avg',
      nameAr: 'حساب المتوسط الحسابي',
      nameEn: 'Average Calculation',
      formulaTemplate: '\\frac{\\sum x_i}{n}',
      descriptionAr: 'حساب الوسط الحسابي لمجموعة أرقام',
      calculate: (nums) => {
        if (!nums.length) return { result: 0, stepLatex: '0', resultLatex: '0' };
        const sum = nums.reduce((a, b) => a + b, 0);
        const avg = sum / nums.length;
        return {
          result: avg,
          stepLatex: `\\bar{x} = \\frac{${nums.join(' + ')}}{${nums.length}} = \\frac{${sum}}{${nums.length}} = ${avg.toFixed(2)}`,
          resultLatex: `\\bar{x} = ${avg.toFixed(2)}`,
        };
      },
    },
    {
      id: 'calc-percent',
      nameAr: 'حساب النسبة المئوية',
      nameEn: 'Percentage Ratio',
      formulaTemplate: '\\frac{Part}{Whole} \\times 100\\%',
      descriptionAr: 'حساب نسبة الجزء من الكل',
      calculate: (nums) => {
        const part = nums[0] || 0;
        const whole = nums[1] || 1;
        const pct = (part / whole) * 100;
        return {
          result: pct,
          stepLatex: `P = \\frac{${part}}{${whole}} \\times 100\\% = ${pct.toFixed(1)}\\%`,
          resultLatex: `${pct.toFixed(1)}\\%`,
        };
      },
    },
  ];

  private constructor() {
    this.initializeTools();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  private initializeTools() {
    UNIFIED_TOOL_ITEMS.forEach((tool) => {
      this.tools.set(tool.id, tool);
    });
  }

  /**
   * استرجاع جميع الأدوات الموحدة
   */
  public getAllTools(): UnifiedToolItem[] {
    return Array.from(this.tools.values());
  }

  /**
   * استرجاع الأدوات حسب الفئة المحددة
   */
  public getToolsByCategory(category: ToolCategory): UnifiedToolItem[] {
    return this.getAllTools().filter((t) => t.category === category);
  }

  /**
   * استرجاع الفئات المتاحة في السجل
   */
  public getCategories(): ToolCategory[] {
    return Array.from(new Set(this.getAllTools().map((t) => t.category)));
  }

  /**
   * استرجاع أداة بالمعرّف
   */
  public getTool(id: string): UnifiedToolItem | undefined {
    return this.tools.get(id);
  }

  /**
   * الحصول على مكتبة رموز LaTeX
   */
  public getLatexSymbols(category?: LatexSymbolItem['category']): LatexSymbolItem[] {
    if (!category) return this.latexSymbols;
    return this.latexSymbols.filter((s) => s.category === category);
  }

  /**
   * الحصول على قوالب وصيغ LaTeX الجاهزة
   */
  public getFormulaPresets(category?: LatexFormulaPreset['category']): LatexFormulaPreset[] {
    if (!category) return this.formulaPresets;
    return this.formulaPresets.filter((f) => f.category === category);
  }

  /**
   * الحصول على أدوات العمليات الحسابية
   */
  public getArithmeticTools(): ArithmeticToolItem[] {
    return this.arithmeticTools;
  }

  /**
   * الحصول على كتل الويب والتدفق الـ 23 وقوالب المكونات
   */
  public getFlowComponents(): WebTemplateItem[] {
    return WEB_COMPONENT_LIBRARY;
  }

  /**
   * تصيير كود LaTeX إلى كود HTML جاهز للإدراج في أي محرر
   */
  public renderLatexHtml(code: string, isBlock = true): string {
    return latexEngine.renderToHtml(code, isBlock);
  }

  /**
   * تصيير كود LaTeX إلى كود SVG نقي
   */
  public renderLatexSvg(code: string, isBlock = true): string {
    return latexEngine.renderToSvg(code, isBlock);
  }

  /**
   * تنفيذ أداة موحدة وتوجيهها للمحرر النشط
   */
  public executeTool(toolId: string, context: EditorExecutionContext): boolean {
    const tool = this.tools.get(toolId);
    if (!tool) return false;

    const { editorType, richEditor, services, insertHtml, insertCanvasElement } = context;

    switch (tool.actionId) {
      case 'format:bold':
        if (richEditor) richEditor.chain().focus().toggleBold().run();
        return true;

      case 'format:italic':
        if (richEditor) richEditor.chain().focus().toggleItalic().run();
        return true;

      case 'format:underline':
        if (richEditor) richEditor.chain().focus().toggleUnderline().run();
        return true;

      case 'format:align-right':
        if (richEditor) richEditor.chain().focus().setTextAlign('right').run();
        return true;

      case 'format:align-center':
        if (richEditor) richEditor.chain().focus().setTextAlign('center').run();
        return true;

      case 'format:align-left':
        if (richEditor) richEditor.chain().focus().setTextAlign('left').run();
        return true;

      case 'history:undo':
        if (richEditor) richEditor.chain().focus().undo().run();
        else if (services?.events) services.events.emit('editor:undo');
        return true;

      case 'history:redo':
        if (richEditor) richEditor.chain().focus().redo().run();
        else if (services?.events) services.events.emit('editor:redo');
        return true;

      case 'canvas:add-element':
        if (editorType === 'canvas' && insertCanvasElement) {
          insertCanvasElement(tool.payload);
        } else if (editorType === 'rich-text' && insertHtml) {
          if (tool.payload?.templateId) {
            const allTpls = getAllWebComponents();
            const found = allTpls.find((t) => t.id === tool.payload?.templateId);
            if (found) {
              insertHtml(found.templateHtml);
              return true;
            }
          }
          // توريث كتل الكانفا للـ Rich Text كمكونات HTML مهيأة وفاتحة
          const blockHtml = this.generateHtmlForFlowType(tool.payload?.type);
          insertHtml(blockHtml);
        }
        return true;

      case 'latex:insert-symbol': {
        const symbolLatex = tool.payload?.symbol || '\\alpha';
        const rendered = this.renderLatexHtml(symbolLatex, false);
        if (editorType === 'rich-text' && insertHtml) {
          insertHtml(` ${rendered} `);
        } else if (editorType === 'canvas' && insertCanvasElement) {
          insertCanvasElement({
            type: 'latex-equation',
            latex: symbolLatex,
            content: symbolLatex,
          });
        }
        return true;
      }

      case 'latex:insert-preset': {
        const presetId = tool.payload?.presetId || 'f-pythagoras';
        const preset = this.formulaPresets.find((p) => p.id === presetId) || this.formulaPresets[0];
        const rendered = this.renderLatexHtml(preset.code, true);
        if (editorType === 'rich-text' && insertHtml) {
          insertHtml(rendered);
        } else if (editorType === 'canvas' && insertCanvasElement) {
          insertCanvasElement({
            type: 'latex-equation',
            latex: preset.code,
            title: preset.titleAr,
            content: preset.code,
          });
        }
        return true;
      }

      case 'latex:insert-structure':
      case 'latex:insert-matrix': {
        const latexCode = tool.payload?.latex || '\\frac{a}{b}';
        const rendered = this.renderLatexHtml(latexCode, true);
        if (editorType === 'rich-text' && insertHtml) {
          insertHtml(rendered);
        } else if (editorType === 'canvas' && insertCanvasElement) {
          insertCanvasElement({
            type: 'latex-equation',
            latex: latexCode,
            content: latexCode,
          });
        }
        return true;
      }

      case 'latex:run-calc': {
        const calcId = tool.payload?.calcId || 'calc-sum';
        const calcTool =
          this.arithmeticTools.find((c) => c.id === calcId) || this.arithmeticTools[0];
        const defaultInputs = [10, 20, 30];
        const calcRes = calcTool.calculate(defaultInputs);
        const rendered = this.renderLatexHtml(calcRes.stepLatex, true);
        if (editorType === 'rich-text' && insertHtml) {
          insertHtml(rendered);
        } else if (editorType === 'canvas' && insertCanvasElement) {
          insertCanvasElement({
            type: 'latex-equation',
            latex: calcRes.stepLatex,
            content: calcRes.stepLatex,
          });
        }
        return true;
      }

      case 'dialog:computational-scratchpad':
        dialogEngine.openComputationalScratchpad(tool.payload);
        return true;

      case 'dialog:system-doctor':
        dialogEngine.openSystemDoctor(tool.payload || { elements: context?.canvasStore?.elements });
        return true;

      case 'dialog:dev-studio':
        dialogEngine.openDevStudio(tool.payload);
        return true;

      // ─── New Code_X3 Editor Tool Suite: محركات النواة المشتركة ───
      case 'tool:comment-pin': {
        // دبوس تعليق ذكي: يفعّل المحرر وضع التعليق عبر الحدث ويمرّر أدوات
        // التثبيت الثلاثي (عنصر/نقطة/شريحة) وتثبيت النافذة داخل مجال الرؤية.
        const commentHelpers = {
          suggestCommentAnchor,
          resolveCommentMarker,
          clampPopoverToViewport,
          formatRelativeTime,
        };
        if (services?.events) {
          services.events.emit('tool:comment-pin', {
            toolId,
            tool,
            helpers: commentHelpers,
            elements: context?.canvasStore?.elements,
            slide: context?.canvasStore?.slide,
          });
        }
        return true;
      }

      case 'tool:connector-reroute': {
        // إعادة توجيه تلقائية للموصلات المرساة على عناصر الكانفا الحالية.
        const elements: Array<{
          id: string;
          type: string;
          shape?: string;
          x: number;
          y: number;
          w: number;
          h: number;
          rotation?: number;
          from?: { el: string; side?: string };
          to?: { el: string; side?: string };
        }> = Array.isArray(context?.canvasStore?.elements) ? context.canvasStore.elements : [];
        const summary = rerouteAllConnectors(elements);
        if (services?.events) {
          services.events.emit('tool:connector-reroute', { toolId, tool, summary });
        }
        return true;
      }

      case 'tool:bezier-split': {
        // تقسيم الشرائح على المنحنى: يمرّر عمليات الإدراج بحفظ الشكل
        // (De Casteljau) وتصنيف الزوايا وحساب الحدود الهندسية الحقيقية.
        const bezierHelpers = {
          insertBezierNodeAt,
          markBezierNode,
          toggleBezierNodeCorner,
          curveBoundsForNodes,
          normalizeBezierNodes,
        };
        if (services?.events) {
          services.events.emit('tool:bezier-split', {
            toolId,
            tool,
            helpers: bezierHelpers,
            elements: context?.canvasStore?.elements,
          });
        }
        return true;
      }

      case 'tool:motion-speeds': {
        // نقاط تثبيت هجينة AUTO/MANUAL مع سرعات لكل نقطة (1:1).
        const motionHelpers = {
          classifyHybridWaypoints,
          resolveEffectiveWaypoints,
          hybridWaypointsToPath,
          setWaypointSpeed,
          nudgeWaypointSpeed,
        };
        if (services?.events) {
          services.events.emit('tool:motion-speeds', { toolId, tool, helpers: motionHelpers });
        }
        return true;
      }

      case 'tool:clip-payload': {
        // حمولة القصاصات الذكية: تسلسل العناصر/الشرائح (Serialize) مع إعادة
        // بناء غير الموثوق (Sanitize/Parse) — كلها بلا DOM في النواة المعزولة.
        const elements = Array.isArray(context?.canvasStore?.elements)
          ? context.canvasStore.elements
          : [];
        const clipHelpers = {
          serializeElements: (
            els?: unknown[],
            assets?: Record<string, string>,
            fonts?: unknown[],
          ) => serializeElements((els as any) ?? elements, assets, fonts as any),
          serializeSlides,
          parseClip,
          sanitizeElementLike,
        };
        if (services?.events) {
          services.events.emit('tool:clip-payload', {
            toolId,
            tool,
            helpers: clipHelpers,
            elements,
          });
        }
        return true;
      }

      case 'tool:color-alpha': {
        // دمج الشفافية اللونية: أقصر CSS يحفظ alpha بلا DOM — يمرّر أدوات
        // التحليل (parseColorHex) والدمج (combineColor) والتحويل إلى RGBA.
        const colorHelpers = {
          combineColor,
          parseColorHex,
          roundAlpha,
          colorWithAlphaToRgba,
        };
        if (services?.events) {
          services.events.emit('tool:color-alpha', { toolId, tool, helpers: colorHelpers });
        }
        return true;
      }

      default:
        if (tool.actionId.startsWith('dialog:')) {
          const dialogName = tool.actionId.replace('dialog:', '') as any;
          dialogEngine.openDialog(dialogName, tool.payload);
          return true;
        }
        if (services?.events) {
          services.events.emit('tool:executed', { toolId, tool, context });
        }
        return true;
    }
  }

  /**
   * توليد كود HTML منسق وثيم فاتح لأي نوع من الكتل التدفقية الـ 23
   * لضمان مشاركتها وإدراجها السلس في محرر النصوص الغنية ومصمم الواجهات
   */
  public generateHtmlForFlowType(type?: string): string {
    if (!type) return '';

    // البحث أولاً في مكتبة القوالب الجاهزة
    const templateMatch = WEB_COMPONENT_LIBRARY.find(
      (t) => t.category === type || t.id.includes(type),
    );
    if (templateMatch) {
      return templateMatch.templateHtml;
    }

    switch (type) {
      case 'navbar':
        return `
<header class="my-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between" dir="rtl">
  <div class="font-bold text-base text-blue-600 flex items-center gap-2">🚀 الشعار الرئيسي</div>
  <nav class="flex gap-4 text-xs font-semibold text-slate-600">
    <a href="#" class="hover:text-blue-600">الرئيسية</a>
    <a href="#" class="hover:text-blue-600">الميزات</a>
    <a href="#" class="hover:text-blue-600">اتصل بنا</a>
  </nav>
  <button class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700">ابدأ الآن</button>
</header>`.trim();

      case 'hero':
        return `
<section class="my-4 p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3" dir="rtl">
  <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full">✨ تصميم فاتح حديث</span>
  <h1 class="text-2xl font-black text-slate-900 leading-tight">عنوان رئيسي جذاب وجريء</h1>
  <p class="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">فقرة ترحيبية تشرح قيمة المنتج والخدمة بوضوح متناهٍ وخط مريح للعين.</p>
  <div class="flex items-center justify-center gap-3 pt-2">
    <button class="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-blue-700">ابدأ مجاناً</button>
    <button class="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50">اكتشف المزيد</button>
  </div>
</section>`.trim();

      case 'features':
        return `
<div class="my-4 grid grid-cols-3 gap-3" dir="rtl">
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
    <div class="text-lg">⚡</div>
    <h3 class="font-bold text-xs text-slate-800">سرعة فائقة</h3>
    <p class="text-[11px] text-slate-500">أداء لحظي سلس وبناء خفيف دون مكتبات ثقيلة.</p>
  </div>
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
    <div class="text-lg">🎨</div>
    <h3 class="font-bold text-xs text-slate-800">تصميم فاتح نقي</h3>
    <p class="text-[11px] text-slate-500">تباين ألوان مثالي وراحة بصرية متكاملة.</p>
  </div>
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
    <div class="text-lg">🔒</div>
    <h3 class="font-bold text-xs text-slate-800">أمان وحفظ تلقائي</h3>
    <p class="text-[11px] text-slate-500">حفظ محلي فوري واسترجاع للمستندات في أي وقت.</p>
  </div>
</div>`.trim();

      case 'pricing':
        return `
<div class="my-4 grid grid-cols-2 gap-4 max-w-lg mx-auto" dir="rtl">
  <div class="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
    <h3 class="font-bold text-sm text-slate-800">الباقة الأساسية</h3>
    <div class="text-2xl font-black text-slate-900">0$ <span class="text-xs font-normal text-slate-500">/شهرياً</span></div>
    <ul class="text-xs text-slate-600 space-y-1.5">
      <li>✓ كافة أدوات الرسم والكانفا</li>
      <li>✓ محرر LaTeX مدمج</li>
      <li>✓ تصدير PDF وصور</li>
    </ul>
    <button class="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-200">اختيار</button>
  </div>
  <div class="p-5 bg-blue-50/60 border-2 border-blue-500 rounded-xl space-y-3 shadow-xs relative">
    <span class="absolute -top-2.5 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">الأكثر شعبية</span>
    <h3 class="font-bold text-sm text-blue-950">الباقة الاحترافية</h3>
    <div class="text-2xl font-black text-blue-900">19$ <span class="text-xs font-normal text-slate-500">/شهرياً</span></div>
    <ul class="text-xs text-slate-700 space-y-1.5">
      <li>✓ تصدير أكواد React و Tailwind</li>
      <li>✓ مكتبة قوالب غير محدودة</li>
      <li>✓ دعم فني أولوية</li>
    </ul>
    <button class="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700">اشتراك فوري</button>
  </div>
</div>`.trim();

      case 'faq':
        return `
<div class="my-4 space-y-2" dir="rtl">
  <div class="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
    <h4 class="font-bold text-xs text-slate-800">هل يمكن استخدام المحرر دون لوحة مفاتيح؟</h4>
    <p class="text-[11px] text-slate-600">نعم، تم تصميم كل وظيفة ومقبض ليعمل بالفأرة 100% بنقرات وسحب مباشر.</p>
  </div>
  <div class="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
    <h4 class="font-bold text-xs text-slate-800">كيف أشارك كتل الكانفا مع محرر النصوص؟</h4>
    <p class="text-[11px] text-slate-600">عبر سجل الأدوات الموحد، يمكنك النقر على أي كتلة لإدراجها فورياً في أي مستند نشط.</p>
  </div>
</div>`.trim();

      case 'testimonials':
        return `
<div class="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2" dir="rtl">
  <p class="text-xs italic text-slate-700 font-serif">"محرر متكامل وسلس، أدوات LaTeX وتصميم الكانفا توفر ساعات من العمل اليدوي."</p>
  <div class="flex items-center gap-2 pt-1 border-t border-slate-200">
    <span class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">س</span>
    <span class="text-xs font-bold text-slate-800">سامر المهندس</span>
    <span class="text-[10px] text-slate-400">— مصمم واجهات</span>
  </div>
</div>`.trim();

      case 'cta':
        return `
<div class="my-4 p-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-center space-y-3" dir="rtl">
  <h3 class="text-lg font-black">جاهز للبدء في مشروعك القادم؟</h3>
  <p class="text-xs text-blue-100 max-w-md mx-auto">انضم لآلاف المطورين والمصممين وابنِ مستنداتك وواجهاتك باحترافية.</p>
  <button class="bg-white text-blue-700 px-5 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-50">ابدأ مجاناً الآن</button>
</div>`.trim();

      case 'card':
        return `
<div class="my-3 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2" dir="rtl">
  <h4 class="font-bold text-xs text-slate-800">عنوان البطاقة التوضيحية</h4>
  <p class="text-[11px] text-slate-600">نص محتوى البطاقة مع تنسيق فاتح وظل خفيف جداً.</p>
</div>`.trim();

      case 'divider':
        return `<hr class="my-4 border-t border-slate-200" />`;

      // ─── كتل ونماذج إدارة صفحات الموقع والتنقل ───
      case 'page-tree':
      case 'site-tree':
        return `
<div class="my-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3" dir="rtl">
  <div class="flex items-center justify-between pb-2 border-b border-slate-100">
    <div class="flex items-center gap-2">
      <span class="p-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">📁 شجرة صفحات الموقع</span>
      <span class="text-xs font-bold text-slate-800">هيكل التنقل النموذجي</span>
    </div>
    <span class="text-[10px] text-slate-400 font-mono">5 صفحات نشطة</span>
  </div>
  <div class="space-y-1.5 text-xs">
    <div class="p-2 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between">
      <span class="font-bold text-blue-900">🏠 الصفحة الرئيسية (Home)</span>
      <span class="text-[10px] font-mono text-blue-600">/</span>
    </div>
    <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between pr-6">
      <span class="font-medium text-slate-700">⚡ الميزات والخدمات (Features)</span>
      <span class="text-[10px] font-mono text-slate-500">/features</span>
    </div>
    <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between pr-6">
      <span class="font-medium text-slate-700">💳 خطط الأسعار (Pricing)</span>
      <span class="text-[10px] font-mono text-slate-500">/pricing</span>
    </div>
    <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between pr-6">
      <span class="font-medium text-slate-700">👥 من نحن (About Us)</span>
      <span class="text-[10px] font-mono text-slate-500">/about</span>
    </div>
    <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between pr-6">
      <span class="font-medium text-slate-700">📞 اتصل بنا (Contact)</span>
      <span class="text-[10px] font-mono text-slate-500">/contact</span>
    </div>
  </div>
</div>`.trim();

      case 'navbar-tree':
        return `
<header class="my-4 p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between" dir="rtl">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">و</div>
    <span class="font-bold text-sm text-slate-900">منصة الويب النموذجية</span>
  </div>
  <nav class="flex items-center gap-4 text-xs font-semibold text-slate-600">
    <a href="/" class="text-blue-600 font-bold hover:text-blue-700">الرئيسية</a>
    <a href="/features" class="hover:text-blue-600">الميزات</a>
    <a href="/pricing" class="hover:text-blue-600">الأسعار</a>
    <a href="/about" class="hover:text-blue-600">من نحن</a>
    <a href="/contact" class="hover:text-blue-600">اتصل بنا</a>
  </nav>
  <div class="flex items-center gap-2">
    <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-2xs">دخول</button>
  </div>
</header>`.trim();

      case 'breadcrumbs':
        return `
<nav aria-label="مسار التنقل" class="my-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2" dir="rtl">
  <a href="/" class="hover:text-blue-600 font-medium">الرئيسية</a>
  <span class="text-slate-400">/</span>
  <a href="/features" class="hover:text-blue-600 font-medium">الأقسام</a>
  <span class="text-slate-400">/</span>
  <span class="text-slate-900 font-bold">الصفحة الحالية</span>
</nav>`.trim();

      case 'page-cards':
        return `
<div class="my-4 grid grid-cols-3 gap-3" dir="rtl">
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-blue-300 transition-colors">
    <span class="text-lg">📄</span>
    <h4 class="font-bold text-xs text-slate-800">الصفحة الرئيسية</h4>
    <p class="text-[11px] text-slate-500">نظرة عامة على الموقع وواجهة الاستقبال.</p>
    <span class="text-[10px] text-blue-600 font-bold block pt-1">انتقال للصفحة ←</span>
  </div>
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-blue-300 transition-colors">
    <span class="text-lg">⚡</span>
    <h4 class="font-bold text-xs text-slate-800">الميزات والخدمات</h4>
    <p class="text-[11px] text-slate-500">استعراض كافة الخصائص والمحركات الذكية.</p>
    <span class="text-[10px] text-blue-600 font-bold block pt-1">انتقال للصفحة ←</span>
  </div>
  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-blue-300 transition-colors">
    <span class="text-lg">💎</span>
    <h4 class="font-bold text-xs text-slate-800">باقات الاشتراك</h4>
    <p class="text-[11px] text-slate-500">خطط الأسعار والتراخيص والتكاملات.</p>
    <span class="text-[10px] text-blue-600 font-bold block pt-1">انتقال للصفحة ←</span>
  </div>
</div>`.trim();

      case 'page-settings':
        return `
<div class="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-right" dir="rtl">
  <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
    <span class="font-bold text-xs text-slate-800">⚙️ إعدادات وبيانات الصفحة الوصفية (Meta)</span>
    <span class="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">SEO & Config</span>
  </div>
  <div class="grid grid-cols-2 gap-2 text-xs">
    <div><strong class="text-slate-500 text-[10px] block">عنوان الصفحة:</strong> <span class="font-semibold text-slate-800">الرئيسية - ستوديو التصميم</span></div>
    <div><strong class="text-slate-500 text-[10px] block">المسار (Slug):</strong> <span class="font-mono text-blue-600">/home</span></div>
    <div><strong class="text-slate-500 text-[10px] block">الاتجاه اللغوي:</strong> <span class="font-semibold text-slate-800">RTL (العربية)</span></div>
    <div><strong class="text-slate-500 text-[10px] block">الثيم البصري:</strong> <span class="font-semibold text-emerald-700">فاتح نقي 100%</span></div>
  </div>
</div>`.trim();

      // ─── كتل ونماذج العروض التقديمية والشرائح ───
      case 'slide-hero':
        return `
<div class="my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]" dir="rtl">
  <header class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
    <span class="font-bold text-blue-600">ستوديو العروض التقديمية 🚀</span>
    <span>شريحة 1 من 5</span>
  </header>
  <main class="py-8 text-center space-y-3">
    <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full">عرض تقديمي نموذجي</span>
    <h1 class="text-2xl font-black text-slate-900">مقدمة المشروع والابتكار التقني</h1>
    <p class="text-sm text-slate-600 max-w-lg mx-auto">استعراض متكامل للمحركات الفاتحة النقية والعمل الكامل بالفأرة دون لوحة مفاتيح.</p>
  </main>
  <footer class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
    <span>إعداد: فريق التطوير</span>
    <span>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</span>
  </footer>
</div>`.trim();

      case 'slide-single':
        return `
<div class="my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]" dir="rtl">
  <header class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
    <span class="font-bold text-slate-800">الأهداف الاستراتيجية</span>
    <span>شريحة 2 من 5</span>
  </header>
  <main class="py-6 space-y-3">
    <h2 class="text-lg font-bold text-slate-900">محاور التطوير والمبادئ الحاكمة</h2>
    <ul class="space-y-2 text-xs text-slate-700 list-disc pr-5 leading-relaxed">
      <li><strong>صفر مكتبات خارجية:</strong> بناء ذاتي لكافة المحركات الرياضية والبصرية.</li>
      <li><strong>التحكم بالفأرة فقط:</strong> مقابض تحجيم وقوائم سياقية ذكية وتعديل بنقرات سهلة.</li>
      <li><strong>الثيم الفاتح النقي:</strong> راحة بصرية فائقة وتباين ألوان متزن 100%.</li>
    </ul>
  </main>
  <footer class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
    <span>ستوديو التصميم الذكي</span>
    <span>صفحة 2</span>
  </footer>
</div>`.trim();

      case 'slide-two-col':
        return `
<div class="my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]" dir="rtl">
  <header class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
    <span class="font-bold text-slate-800">المقارنة التقنية</span>
    <span>شريحة 3 من 5</span>
  </header>
  <main class="py-6 grid grid-cols-2 gap-4">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
      <h3 class="font-bold text-xs text-blue-900">النمط التقليدي</h3>
      <p class="text-[11px] text-slate-600">اعتماد كثيف على مكتبات خارجية، ثيمات داكنة عشوائية، واشتراط لوحة المفاتيح.</p>
    </div>
    <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
      <h3 class="font-bold text-xs text-blue-900">النمط المعياري الجديد ✨</h3>
      <p class="text-[11px] text-slate-700">خوارزميات نقية، ثيم فاتح منضبط، وتحكم كامل وسلس بالفأرة 100%.</p>
    </div>
  </main>
  <footer class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
    <span>تحليل مقارن</span>
    <span>صفحة 3</span>
  </footer>
</div>`.trim();

      case 'slide-split-code':
        return `
<div class="my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]" dir="rtl">
  <header class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
    <span class="font-bold text-slate-800">الشيفرة البرمجية والتنفيذ</span>
    <span>شريحة 4 من 5</span>
  </header>
  <main class="py-6 space-y-3 text-right">
    <h3 class="font-bold text-xs text-slate-800">دالة الحساب والتحويل الرياضي</h3>
    <pre class="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 overflow-x-auto leading-relaxed select-all" dir="ltr"><code>function calculateRatio(a: number, b: number): number {
  return (a / b) * 100;
}</code></pre>
    <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
      <span>▶ نتيجة التنفيذ:</span>
      <span class="font-mono">calculateRatio(50, 200) = 25% (ناجح ✓)</span>
    </div>
  </main>
  <footer class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
    <span>التحقق البرمجي</span>
    <span>صفحة 4</span>
  </footer>
</div>`.trim();

      case 'slide-math':
        return `
<div class="my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]" dir="rtl">
  <header class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
    <span class="font-bold text-slate-800">النماذج والمعادلات العلمية</span>
    <span>شريحة 5 من 5</span>
  </header>
  <main class="py-6 text-center space-y-4">
    <h3 class="font-bold text-xs text-slate-800">الصيغ الرياضية الأساسية</h3>
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 inline-block shadow-2xs" dir="ltr">
      x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad \\text{و} \\quad E = mc^2
    </div>
    <blockquote class="p-3 border-r-4 border-amber-400 bg-amber-50/60 rounded-l-lg text-xs text-slate-700 italic max-w-md mx-auto text-right">
      "الرياضيات هي مفتاح فهم الطبيعة وقوانين الفيزياء."
    </blockquote>
  </main>
  <footer class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
    <span>المعادلات والرموز</span>
    <span>صفحة 5</span>
  </footer>
</div>`.trim();

      case 'presenter-tip':
        return `
<div class="my-3 p-4 bg-blue-50/70 border-r-4 border-blue-600 rounded-l-xl shadow-2xs text-right" dir="rtl">
  <div class="flex items-center gap-2 mb-1">
    <span>💡</span>
    <strong class="text-xs font-bold text-blue-900">ملاحظة العارض التوجيهية (Presenter Note)</strong>
  </div>
  <p class="text-xs text-slate-700 leading-relaxed pr-6 m-0">تأكد من إبراز النقاط الأساسية والتفاعل مع الجمهور عند الانتقال للشريحة التالية.</p>
</div>`.trim();

      case 'presenter-quote':
        return `
<blockquote class="my-4 p-4 border-r-4 border-amber-500 bg-amber-50/50 rounded-l-xl shadow-2xs text-right" dir="rtl">
  <strong class="block text-xs font-bold text-amber-900 mb-1">اقتباس ملهم</strong>
  <p class="text-xs text-slate-700 italic leading-relaxed m-0">"البساطة هي قمة التطور والجمال المعماري."</p>
</blockquote>`.trim();

      case 'process':
      case 'decision':
      case 'start':
      case 'end':
      case 'database':
        return `
<div contenteditable="true" style="margin:0.75rem 0;padding:1rem;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:0.5rem;font-size:0.75rem;font-weight:500;color:#334155;" dir="rtl">
  كتلة ويب تدفقية: ${type} (قابلة للتحرير المباشر)
</div>`.trim();

      // ─── أشكال فيكتورية (vector-shapes) ───
      case 'rectangle':
        return `<div contenteditable="true" style="display:inline-block;width:150px;height:100px;background-color:#f8fafc;border:2px solid #3b82f6;border-radius:0px;margin:8px;padding:10px;text-align:center;color:#0f172a;"><p>مستطيل</p></div>`.trim();

      case 'circle':
        return `<div contenteditable="true" style="display:inline-flex;align-items:center;justify-content:center;width:110px;height:110px;background-color:#f8fafc;border:2px solid #3b82f6;border-radius:50%;margin:8px;text-align:center;color:#0f172a;"><p>دائرة</p></div>`.trim();

      case 'diamond':
        return `<div style="display:inline-block;margin:8px;width:120px;height:100px;"><svg viewBox="0 0 100 100" style="width:100%;height:100%;"><polygon points="50 5, 95 50, 50 95, 5 50" fill="#f8fafc" stroke="#3b82f6" stroke-width="2" /></svg></div>`.trim();

      case 'triangle':
        return `<div style="display:inline-block;margin:8px;width:120px;height:100px;text-align:center;"><svg viewBox="0 0 100 85" style="width:100%;height:100%;"><polygon points="50 5, 95 80, 5 80" fill="#f8fafc" stroke="#3b82f6" stroke-width="2" /></svg></div>`.trim();

      case 'star':
        return `<div style="display:inline-block;margin:8px;width:120px;height:100px;"><svg viewBox="0 0 100 100" style="width:100%;height:100%;"><polygon points="50 5, 62 38, 97 38, 68 59, 79 92, 50 72, 21 92, 32 59, 3 38, 38 38" fill="#f8fafc" stroke="#3b82f6" stroke-width="2" /></svg></div>`.trim();

      case 'hexagon':
        return `<div style="display:inline-block;margin:8px;width:120px;height:100px;"><svg viewBox="0 0 100 100" style="width:100%;height:100%;"><polygon points="25 5, 75 5, 95 50, 75 95, 25 95, 5 50" fill="#f8fafc" stroke="#3b82f6" stroke-width="2" /></svg></div>`.trim();

      case 'connector':
        return `<div contenteditable="true" style="margin:10px 0;width:100%;"><svg viewBox="0 0 100 20" style="width:100%;height:24px;"><line x1="0" y1="10" x2="95" y2="10" stroke="#3b82f6" stroke-width="2" /><polygon points="100 10, 88 4, 88 16" fill="#3b82f6" /></svg></div>`.trim();

      default:
        return `<div class="my-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700" dir="rtl">كتلة ويب تدفقية: ${type}</div>`;
    }
  }
}

export const toolRegistry = ToolRegistry.getInstance();
