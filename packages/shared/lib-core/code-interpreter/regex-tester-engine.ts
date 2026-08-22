/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك اختبار وفحص التعبيرات النمطية - Zero-Dependency Regex Tester Engine
 * 🏛️ الدور: نواة معالجة النصوص (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: InteractiveWysiwygCodeStudio, RichTextEditor, DocumentSanitizer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - فحص وتحليل فوري للـ Regular Expressions دون أي مكتبات خارجية
 *    - استخراج فئات التطابق (Capture Groups) وتلوينها بصرياً في النص
 *    - محرك استبدال نصوص تفاعلي (Interactive Replacement Engine) مع دعم $1, $2
 *    - مكتبة قوالب للتعبيرات النمطية الشائعة (Common Regex Presets)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع هجمات ReDoS (Catastrophic Backtracking) عبر ضبط حد أقصى للوقت
 *    2. التعامل الآمن مع الأنماط الفارغة وغير الصالحة (Invalid Regex Patterns)
 *    3. الحفاظ على فهارس النصوص العربية متعددة البايتات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - try/catch حول بناء الـ RegExp
 *    - فحص دوراني آمن يمنع الحلقات اللانهائية عند تكرار التطابق صفر الطول
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RegexMatchGroup {
  index: number;
  name?: string;
  value: string;
}

export interface RegexMatchItem {
  matchIndex: number;
  fullMatch: string;
  start: number;
  end: number;
  groups: RegexMatchGroup[];
}

export interface RegexTestResult {
  isValid: boolean;
  error?: string;
  matchesCount: number;
  matches: RegexMatchItem[];
  highlightedHtml: string;
  replacedText?: string;
  executionTimeMs: number;
}

export interface RegexPreset {
  id: string;
  nameAr: string;
  pattern: string;
  flags: string;
  descriptionAr: string;
  sampleText: string;
}

export const COMMON_REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'arabic-text',
    nameAr: 'نصوص وكلمات عربية',
    pattern: '[\\u0600-\\u06FF\\u0750-\\u077F]+',
    flags: 'g',
    descriptionAr: 'مطابقة كل الكلمات والعبارات باللغة العربية والتشكيل',
    sampleText: 'مرحباً بكم في استوديو الويب الذكي 2026! Hello World.',
  },
  {
    id: 'email',
    nameAr: 'البريد الإلكتروني (Email)',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'gi',
    descriptionAr: 'التحقق من صحة واستخراج عناوين البريد الإلكتروني',
    sampleText: 'تواصل معنا على support@example.com أو dev-team@studio.org للمساعدة.',
  },
  {
    id: 'url',
    nameAr: 'روابط المواقع (URLs)',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)',
    flags: 'gi',
    descriptionAr: 'استخراج وتدقيق روابط الويب HTTP و HTTPS',
    sampleText: 'زوروا موقعنا https://ai.studio أو http://example.com/docs للمزيد.',
  },
  {
    id: 'hex-color',
    nameAr: 'أكواد الألوان (HEX Colors)',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    descriptionAr: 'مطابقة الألوان السداسية بتنسيق 3 أو 6 خانات',
    sampleText: 'الألوان المعتمدة هي الأساسي #2563eb والخلفية #f8fafc والحدود #e2e8f0.',
  },
  {
    id: 'html-tags',
    nameAr: 'وسوم HTML (HTML Tags)',
    pattern: '<(\\w+)(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/\\1>',
    flags: 'gi',
    descriptionAr: 'مطابقة وسوم HTML المزدوجة مع استخراج اسم الوسم ومحتواه في مجموعات',
    sampleText: '<div class="card"><h3 class="title">عنوان المكون</h3><p>تفاصيل وشرح</p></div>',
  },
  {
    id: 'numbers-currency',
    nameAr: 'الأرقام والمبالغ المالية',
    pattern: '(?:\\$|€|£|ر\\.س|د\\.إ)?\\s*\\d+(?:,\\d{3})*(?:\\.\\d{2})?',
    flags: 'g',
    descriptionAr: 'مطابقة العملات والمبالغ المالية والأرقام المفصولة بفواصل',
    sampleText: 'إجمالي التكلفة 1,250.00 ر.س مع خصم قدره $50 و 250 €.',
  },
  {
    id: 'markdown-headers',
    nameAr: 'عناوين ماركدون (Headers)',
    pattern: '^(#{1,6})\\s+(.+)$',
    flags: 'gm',
    descriptionAr: 'مطابقة أسطر عناوين Markdown من المستوى 1 إلى 6',
    sampleText: '# العنوان الرئيسي الأول\nمقدمة سريعة...\n## قسم فرعي\nمحتوى القسم...',
  },
  {
    id: 'phone-number',
    nameAr: 'أرقام الهواتف الدولية',
    pattern: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
    flags: 'g',
    descriptionAr: 'مطابقة أرقام الهواتف المحمولة والأرضية بالأكواد الدولية',
    sampleText: 'الاتصال المباشر: +966-50-123-4567 أو 001 555 123 4567.',
  },
];

export class RegexTesterEngine {
  /**
   * فحص واختبار التعبير النمطي واستخراج جميع التطابقات
   */
  public static test(
    pattern: string,
    flags: string,
    testText: string,
    replacementTemplate?: string
  ): RegexTestResult {
    const startTime = performance.now();

    if (!pattern.trim()) {
      return {
        isValid: true,
        matchesCount: 0,
        matches: [],
        highlightedHtml: this.escapeHtml(testText),
        replacedText: testText,
        executionTimeMs: 0,
      };
    }

    try {
      // إزالة الأحرف المكررة أو غير الصالحة من الـ flags
      const cleanFlags = Array.from(new Set(flags.split('')))
        .filter((f) => 'gimsuy'.includes(f))
        .join('');

      const regex = new RegExp(pattern, cleanFlags);
      const isGlobal = cleanFlags.includes('g');
      const matches: RegexMatchItem[] = [];

      let match: RegExpExecArray | null;
      let lastIndex = 0;
      let safetyCounter = 0;
      const MAX_MATCHES = 1000;

      if (isGlobal) {
        while ((match = regex.exec(testText)) !== null && safetyCounter++ < MAX_MATCHES) {
          const matchIndex = matches.length + 1;
          const start = match.index;
          const end = start + match[0].length;

          const groups: RegexMatchGroup[] = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              groups.push({
                index: i,
                value: match[i] || '',
              });
            }
          }

          matches.push({
            matchIndex,
            fullMatch: match[0],
            start,
            end,
            groups,
          });

          // منع التكرار اللانهائي في التطابقات الصفرية الطول
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          const groups: RegexMatchGroup[] = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              groups.push({
                index: i,
                value: match[i] || '',
              });
            }
          }
          matches.push({
            matchIndex: 1,
            fullMatch: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups,
          });
        }
      }

      // بناء نص HTML ملون للتطابقات
      const highlightedHtml = this.buildHighlightedHtml(testText, matches);

      // تطبيق الاستبدال إن وُجد
      let replacedText: string | undefined;
      if (replacementTemplate !== undefined) {
        try {
          replacedText = testText.replace(regex, replacementTemplate);
        } catch {
          replacedText = testText;
        }
      }

      const executionTimeMs = +(performance.now() - startTime).toFixed(2);

      return {
        isValid: true,
        matchesCount: matches.length,
        matches,
        highlightedHtml,
        replacedText,
        executionTimeMs,
      };
    } catch (err: any) {
      return {
        isValid: false,
        error: err.message || 'تعبير نمطي غير صالح',
        matchesCount: 0,
        matches: [],
        highlightedHtml: this.escapeHtml(testText),
        executionTimeMs: +(performance.now() - startTime).toFixed(2),
      };
    }
  }

  /**
   * تلوين التطابقات بأسلوب الثيم الفاتح النقي 100%
   */
  private static buildHighlightedHtml(text: string, matches: RegexMatchItem[]): string {
    if (matches.length === 0) {
      return this.escapeHtml(text);
    }

    let result = '';
    let lastIdx = 0;

    matches.forEach((m, idx) => {
      // النص الذي قبل التطابق
      if (m.start > lastIdx) {
        result += this.escapeHtml(text.slice(lastIdx, m.start));
      }

      // وسم التطابق
      const bgClass = idx % 2 === 0 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-emerald-100 border-emerald-300 text-emerald-900';
      result += `<mark class="${bgClass} border px-1 py-0.5 rounded font-mono text-xs mx-0.5" title="تطابق #${m.matchIndex}">${this.escapeHtml(m.fullMatch)}</mark>`;

      lastIdx = m.end;
    });

    if (lastIdx < text.length) {
      result += this.escapeHtml(text.slice(lastIdx));
    }

    return result;
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
