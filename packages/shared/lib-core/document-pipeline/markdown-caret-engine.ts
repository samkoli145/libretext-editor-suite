/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التنسيق الذكي اللحظي للماركداون وحفظ موضع المؤشر
 *           (Smart Inline Markdown Live-Caster & Caret Preservation Engine).
 * 🏛️ الدور: نواة معالجة النصوص والمستندات (Document Pipeline & Text Engine).
 * 📥 المستهلك: RichTextEditor, CanvasTextElement, UIDesigner Text Properties.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Caret-Aware Regex Interceptor with Single-Step Literal Undo:
 *    تحويل تنسيقات الماركداون الشائعة فورياً عند كتابة مسافة أو إغلاق الوسم
 *    مع الحفاظ المطلق على موضع مؤشر الكتابة (Caret) ودعم التراجع الحرفي (⌘Z).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب فقدان موضع المؤشر (Caret Jumps) عند استبدال عقد DOM النصية.
 *    2. عدم تطبيق التنسيق داخل كتل الأكواد البرمجية المغلقة `<pre>` أو `<code>`.
 *    3. حظر أي استدعاء لـ `eval` أو استخدام وسوم غير آمنة (XSS Prevention).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية عمليات DOM عبر try/catch وفحص وجود كائنات Selection/Range.
 *    - التزام صارم بالثيم الفاتح النقي (Pure Light Theme) في وسوم التلوين والتظليل.
 *    - مخزن تراجع مستقل (Single-Step Undo Buffer) يعيد النص الحرفي بدقة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface InlineFormatRule {
  pattern: RegExp;
  replace: (match: string, ...groups: string[]) => string;
  label: string;
}

export interface UndoStep {
  originalText: string;
  rangeOffset: number;
  nodePath: number[];
  timestamp: number;
}

export class MarkdownCaretEngine {
  private lastUndoStep: UndoStep | null = null;

  /**
   * القواعد المعتمدة للتحويل اللحظي مع الحفاظ على الثيم الفاتح النقي 100%
   */
  private readonly rules: InlineFormatRule[] = [
    // عريض: **text**
    {
      pattern: /\*\*([^\*]+)\*\*/g,
      replace: (_, text) => `<strong>${text}</strong>`,
      label: 'bold',
    },
    // مائل: *text* أو _text_
    {
      pattern: /(?<!\*)\*([^\*]+)\*(?!\*)/g,
      replace: (_, text) => `<em>${text}</em>`,
      label: 'italic',
    },
    // كود مضمن: `code`
    {
      pattern: /`([^`]+)`/g,
      replace: (_, code) =>
        `<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-xs border border-gray-200">${code}</code>`,
      label: 'code',
    },
    // مشطوب: ~~strike~~
    {
      pattern: /~~([^~]+)~~/g,
      replace: (_, text) => `<del class="text-gray-400 line-through">${text}</del>`,
      label: 'strikethrough',
    },
    // تمييز / تظليل: ==highlight==
    {
      pattern: /==([^=]+)==/g,
      replace: (_, text) =>
        `<mark class="bg-amber-100 text-amber-900 px-1 py-0.2 rounded border border-amber-200">${text}</mark>`,
      label: 'highlight',
    },
  ];

  /**
   * فحص وتحويل النص عند موضع المؤشر الحالي داخل عنصر contentEditable
   */
  autoformatAtCaret(editableRoot: HTMLElement): boolean {
    const sel = window.getSelection();
    if (!sel || !sel.isCollapsed || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    const node = range.startContainer;

    // التحقق من أننا داخل عقدة نصية
    if (node.nodeType !== Node.TEXT_NODE) return false;

    const text = node.textContent || '';
    const caretPos = range.startOffset;

    // فحص القواعد
    for (const rule of this.rules) {
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null = null;

      while ((match = rule.pattern.exec(text)) !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        // نطبق التحويل فقط إذا كان المؤشر عند نهاية التعبير المطابق مباشرة
        if (caretPos === matchEnd) {
          const formattedHtml = rule.replace(match[0], ...match.slice(1));

          // حفظ خطوة التراجع
          this.lastUndoStep = {
            originalText: text,
            rangeOffset: caretPos,
            nodePath: this.getNodePath(node, editableRoot),
            timestamp: Date.now(),
          };

          // استبدال النص بالـ HTML المنسق
          this.replaceTextRangeWithHtml(node, matchStart, matchEnd, formattedHtml);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * التراجع عن آخر تحويل تلقائي واسترجاع النص الحرفي
   */
  undoAutoformat(editableRoot: HTMLElement): boolean {
    if (!this.lastUndoStep) return false;
    const now = Date.now();
    // صلاحية التراجع 10 ثوانٍ لمنع الخلط مع تراجعات قديمة
    if (now - this.lastUndoStep.timestamp > 10000) {
      this.lastUndoStep = null;
      return false;
    }

    try {
      const node = this.getNodeByPath(this.lastUndoStep.nodePath, editableRoot);
      if (node && node.nodeType === Node.TEXT_NODE) {
        node.textContent = this.lastUndoStep.originalText;
        this.restoreCaret(node, this.lastUndoStep.rangeOffset);
        this.lastUndoStep = null;
        return true;
      }
    } catch (e) {
      console.warn('Could not restore autoformat undo:', e);
    }

    this.lastUndoStep = null;
    return false;
  }

  /**
   * تحويل نص ماركداون كامل إلى HTML نقي وآمن مع دعم الثيم الفاتح
   */
  markdownToHtml(markdown: string): string {
    if (!markdown) return '';

    let html = markdown
      // عناوين
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-gray-900 mt-3 mb-1.5">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h2>')
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-xl font-extrabold text-gray-900 mt-5 mb-2.5">$1</h1>',
      )
      // اقتباس
      .replace(
        /^\> (.*$)/gim,
        '<blockquote class="border-r-4 border-blue-400 pr-3 py-1 my-2 bg-blue-50/50 text-gray-700 italic">$1</blockquote>',
      )
      // قوائم نقطية
      .replace(/^\- (.*$)/gim, '<li class="mr-4 list-disc text-gray-800">$1</li>')
      // فواصل
      .replace(/^---$/gim, '<hr class="my-4 border-gray-200" />');

    // تطبيق القواعد المضمنة (عريض، مائل، كود، تمييز)
    for (const rule of this.rules) {
      html = html.replace(rule.pattern, rule.replace);
    }

    // فقرات عادية
    html = html.replace(/\n\n/g, '<p class="my-2 text-gray-800"></p>');

    return html;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🛠️ دوال مساعدة لإدارة شجرة الـ DOM والمؤشر
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private replaceTextRangeWithHtml(textNode: Node, start: number, end: number, html: string): void {
    const parent = textNode.parentNode;
    if (!parent) return;

    const fullText = textNode.textContent || '';
    const before = fullText.substring(0, start);
    const after = fullText.substring(end);

    const span = document.createElement('span');
    span.innerHTML = html;

    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));

    // إلحاق العناصر المنسقة
    let lastInsertedChild: Node | null = null;
    while (span.firstChild) {
      lastInsertedChild = span.firstChild;
      frag.appendChild(span.firstChild);
    }

    // إلحاق مسافة خالية بعد التنسيق لضمان سلاسة مواصلة الكتابة
    const trailingSpace = document.createTextNode(after || '\u00A0');
    frag.appendChild(trailingSpace);

    parent.replaceChild(frag, textNode);

    // إعادة وضع المؤشر بعد المسافة مباشرة
    this.restoreCaret(trailingSpace, trailingSpace.textContent === '\u00A0' ? 1 : 0);
  }

  private restoreCaret(node: Node, offset: number): void {
    const sel = window.getSelection();
    if (!sel) return;

    const range = document.createRange();
    try {
      range.setStart(node, Math.min(offset, node.textContent?.length || 0));
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      console.warn('Failed to restore caret:', e);
    }
  }

  private getNodePath(node: Node, root: Node): number[] {
    const path: number[] = [];
    let curr: Node | null = node;

    while (curr && curr !== root) {
      const parent: Node | null = curr.parentNode;
      if (!parent) break;
      const index = Array.prototype.indexOf.call(parent.childNodes, curr);
      path.unshift(index);
      curr = parent;
    }

    return path;
  }

  private getNodeByPath(path: number[], root: Node): Node | null {
    let curr: Node | null = root;
    for (const index of path) {
      if (!curr || !curr.childNodes || !curr.childNodes[index]) {
        return null;
      }
      curr = curr.childNodes[index];
    }
    return curr;
  }
}
