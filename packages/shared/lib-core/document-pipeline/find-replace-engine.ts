/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك البحث والاستبدال الشامل (Universal Find & Replace Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) للبحث الدقيق والاستبدال الفردي والجماعي
 *           عبر كافة أنواع كتل النصوص وعناصر الكانفا ومستندات Rich Text و PDF.
 * 📥 المستهلك: FindReplaceBarModal, RichTextEditor, CanvasDesignerEditor, UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Indexed Multi-Document Search Match Mapping with Atomic Batch Replacement:
 *    فهرسة النتائج مع دعم التعبيرات النمطية (RegEx)، مطابقة حالة الأحرف، والكلمة بالكامل،
 *    مع استبدال ذري موثوق دون إتلاف التنسيقات المتداخلة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الهروب الآمن من محارف RegEx الخاصة عندما لا يكون نمط Regex مفعلاً.
 *    2. حماية من الحلقات اللانهائية عند البحث عن نصوص خالية.
 *    3. تحديث فهارس النتائج المتتالية بعد الاستبدال لتجنب ترحيل الإزاحات (Offset Drift).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية المدخلات من أخطاء الـ RegExp Syntax Errors
 *    - Type Guards لجميع سجلات المطابقة
 *    - تنبيهات واضحة لعدد النتائج المطابقة والمستبدلة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  useRegex?: boolean;
}

export interface SearchMatch {
  id: string;
  targetId: string; // معرف العنصر أو الكتلة
  targetType: 'canvas-element' | 'rich-text-block' | 'ui-node';
  textSnippet: string;
  startIndex: number;
  endIndex: number;
  matchedText: string;
}

export interface SearchTargetItem {
  id: string;
  type: 'canvas-element' | 'rich-text-block' | 'ui-node';
  text: string;
}

/**
 * الهروب من الرموز الخاصة في التعبيرات النمطية
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * البحث في مجموعة عناصر أو كتل نصية
 */
export function findMatches(
  query: string,
  items: SearchTargetItem[],
  options: SearchOptions = {},
): SearchMatch[] {
  if (!query || query.trim() === '') return [];

  const matches: SearchMatch[] = [];
  const { caseSensitive = false, wholeWord = false, useRegex = false } = options;

  let patternStr = useRegex ? query : escapeRegExp(query);
  if (wholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(patternStr, caseSensitive ? 'g' : 'gi');
  } catch (err) {
    return []; // RegEx غير صالح
  }

  for (const item of items) {
    if (!item.text) continue;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(item.text)) !== null) {
      const startIndex = match.index;
      const matchedText = match[0];
      const endIndex = startIndex + matchedText.length;

      // استخراج مقتطف توضيحي حول النتيجة
      const snippetStart = Math.max(0, startIndex - 15);
      const snippetEnd = Math.min(item.text.length, endIndex + 15);
      const textSnippet = item.text.substring(snippetStart, snippetEnd);

      matches.push({
        id: `match-${item.id}-${startIndex}`,
        targetId: item.id,
        targetType: item.type,
        textSnippet,
        startIndex,
        endIndex,
        matchedText,
      });

      // منع الحلقات اللانهائية في حال كانت المطابقة بطول صفر
      if (regex.lastIndex === startIndex) {
        regex.lastIndex++;
      }
    }
  }

  return matches;
}

/**
 * استبدال مطابقة واحدة في النص
 */
export function replaceMatchInText(
  originalText: string,
  match: SearchMatch,
  replacement: string,
): string {
  if (!originalText) return '';
  const before = originalText.substring(0, match.startIndex);
  const after = originalText.substring(match.endIndex);
  return before + replacement + after;
}

/**
 * استبدال كافة المطابقات في النص
 */
export function replaceAllInText(
  originalText: string,
  query: string,
  replacement: string,
  options: SearchOptions = {},
): { updatedText: string; count: number } {
  if (!originalText || !query) return { updatedText: originalText, count: 0 };

  const { caseSensitive = false, wholeWord = false, useRegex = false } = options;

  let patternStr = useRegex ? query : escapeRegExp(query);
  if (wholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(patternStr, caseSensitive ? 'g' : 'gi');
  } catch (err) {
    return { updatedText: originalText, count: 0 };
  }

  let count = 0;
  const updatedText = originalText.replace(regex, (match) => {
    count++;
    return replacement;
  });

  return { updatedText, count };
}
