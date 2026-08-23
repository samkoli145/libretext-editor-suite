/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [TreeNavigation.ts] منطق التنقل في الشجرة — View State
 *
 * هذا الملف يجيب: "كيف يتحرك المستخدم في الشجرة؟"
 *
 * المبدأ الحاكم (من story.ts قاعدة 1):
 * "A STEP IS DOCUMENT DATA; THE READER'S POSITION IS NOT."
 * أي مجلد مفتوح، أي ملف محدد، أين التمرير — كل هذا حالة
 * المشاهد، لا حالة المشروع. يُحفظ في localStorage (lsJson)
 * عبر الجلسات، لكنه لا يدخل الملف أبداً. مشروع يُفتح من
 * البريد يجب أن يبدو متطابقاً لمن فتحه، بغض النظر عن
 * تفضيلات من أرسله.
 *
 * نفس نمط panels.ts: applyAccordion يحفظ حالة الفتح في
 * lsJson('bento-panel-open'). هنا نحفظ حالة التوسع في
 * lsJson('bento-tree-open'). الحالة تبقى، لكنها ليست وثيقة.
 *
 * التنبيهات:
 * - التوسع/الطي لا يمس النموذج
 * - البحث يصفّي العرض، لا البيانات
 * - مسار التنقل (breadcrumb) مشتق من المحدد
 * - لوحة المفاتيح: أسهم + Enter + Escape
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { TreeNode } from './ProjectTreeModel';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الحالة — ما يتذكره الاستوديو لكل مستخدم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حالة التنقل — قابلة للتسلسل في localStorage.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * لا مسار محدد = لا حقل selected، ليس selected: null.
 */
export interface NavigationState {
  /** المسارات الموسعة */
  expanded: string[];
  /** additive: الملف المحدد حالياً */
  selected?: string;
  /** additive: استعلام البحث النشط */
  query?: string;
}

const STORAGE_KEY = 'bento-tree-open';

/**
 * قراءة الحالة من localStorage، بتسامح.
 *
 * ⚠️ مثل rowcol.ts readFrozen: حقل مضاف قد يحوي أي شيء
 * (بناء أقدم، تعديل يدوي)، والقارئ يجب أن يتعامل مع
 * اللامقروء كـ "لا حالة"، لا أن يرمي.
 */
export function readNavState(): NavigationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { expanded: [] };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const expanded = Array.isArray(parsed.expanded)
      ? (parsed.expanded.filter((x) => typeof x === 'string') as string[])
      : [];
    const state: NavigationState = { expanded };
    if (typeof parsed.selected === 'string') state.selected = parsed.selected;
    if (typeof parsed.query === 'string' && parsed.query) state.query = parsed.query;
    return state;
  } catch {
    return { expanded: [] };
  }
}

/** كتابة الحالة. تبتلع أخطاء الوضع الخاص. */
export function writeNavState(state: NavigationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode */
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المنطق — يدير الحالة، لا يعدل النموذج
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مدير التنقل.
 *
 * كل دالة هنا تعيد حالة جديدة (لا تعدل)، لأن حالة التنقل
 * تُعاد رسمها من الصفر في كل إطار — نفس مبدأ select.ts
 * حيث Selection تعيد this لكن عبر نسخ واضحة.
 */
export class TreeNavigation {
  private state: NavigationState;

  constructor(state?: NavigationState) {
    this.state = state ?? readNavState();
  }

  /** الحالة الحالية (نسخة، لا مرجع). */
  get current(): NavigationState {
    return { ...this.state, expanded: [...this.state.expanded] };
  }

  /** هل المجلد موسع؟ */
  isExpanded(path: string): boolean {
    return this.state.expanded.includes(path);
  }

  /** توسيع مجلد. يعيد الحالة الجديدة. */
  expand(path: string): NavigationState {
    if (!this.isExpanded(path)) {
      this.state = { ...this.state, expanded: [...this.state.expanded, path] };
      this.persist();
    }
    return this.current;
  }

  /** طي مجلد. يعيد الحالة الجديدة. */
  collapse(path: string): NavigationState {
    this.state = {
      ...this.state,
      expanded: this.state.expanded.filter((p) => p !== path),
    };
    this.persist();
    return this.current;
  }

  /** تبديل توسيع/طي — ما تفعله نقرة على سهم المجلد. */
  toggle(path: string): NavigationState {
    return this.isExpanded(path) ? this.collapse(path) : this.expand(path);
  }

  /** تحديد ملف. يوسّع آباءه تلقائياً ليصبح مرئياً. */
  select(path: string, ancestors: string[]): NavigationState {
    const expanded = new Set(this.state.expanded);
    for (const a of ancestors) expanded.add(a);
    this.state = { ...this.state, expanded: [...expanded], selected: path };
    this.persist();
    return this.current;
  }

  /** تعيين استعلام البحث. فارغ = مسح (غياب، ليس ""). */
  setQuery(query: string): NavigationState {
    const trimmed = query.trim();
    const next = { ...this.state };
    if (trimmed) next.query = trimmed;
    else delete next.query;
    this.state = next;
    this.persist();
    return this.current;
  }

  /**
   * مسار التنقل (breadcrumb) للمحدد الحالي.
   * مشتق من المسار، لا مخزن — لأن المسار هو الحقيقة.
   */
  breadcrumb(): Array<{ name: string; path: string }> {
    if (!this.state.selected) return [];
    const parts = this.state.selected.split('/').filter(Boolean);
    const out: Array<{ name: string; path: string }> = [];
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      out.push({ name: part, path: acc });
    }
    return out;
  }

  /**
   * العقد المرئية للعرض، بالترتيب.
   *
   * الخوارزمية: عمق-أول، تُصدر فقط أبناء المجلدات الموسعة.
   * إن كان هناك استعلام بحث، تُصدر فقط المطابقات (مع آبائها
   * لتبقى ذات سياق).
   */
  visibleNodes(root: TreeNode): TreeNode[] {
    const out: TreeNode[] = [];
    const expanded = new Set(this.state.expanded);
    const query = this.state.query?.toLowerCase();

    const matches = (node: TreeNode): boolean => !query || node.name.toLowerCase().includes(query);

    const walk = (node: TreeNode, depth: number): boolean => {
      let anyVisible = false;

      if (node.kind === 'dir') {
        const children = node.children ?? [];
        for (const child of children) {
          if (walk(child, depth + 1)) anyVisible = true;
        }
        if (query) {
          if (matches(node) || anyVisible) {
            out.push(node);
            return true;
          }
          return false;
        }
        if (expanded.has(node.path) || depth <= 1 || anyVisible) {
          out.push(node);
          return true;
        }
        return false;
      } else {
        if (query) {
          if (matches(node)) {
            out.push(node);
            return true;
          }
          return false;
        }
        out.push(node);
        return true;
      }
    };

    for (const child of root.children ?? []) walk(child, 1);
    return out;
  }

  /**
   * الحركة بلوحة المفاتيح.
   *
   * ⚠️ من select.ts: "NULL IS THE IMPORTANT RETURN." — مفتاح
   * لا نملكه يعيد null، ليأخذه من يملكه. لا نبتلع المفاتيح.
   */
  handleKey(key: string, ordered: TreeNode[]): TreeNode | null {
    const current = this.state.selected;
    const idx = ordered.findIndex((n) => n.path === current);

    switch (key) {
      case 'ArrowDown':
        return ordered[Math.min(idx + 1, ordered.length - 1)] ?? null;
      case 'ArrowUp':
        return ordered[Math.max(idx - 1, 0)] ?? null;
      case 'Enter':
        return idx >= 0 ? ordered[idx] : null;
      case 'Escape':
        return null;
      default:
        return null;
    }
  }

  /** حفظ الحالة في localStorage. */
  private persist(): void {
    writeNavState(this.state);
  }

  /** إعادة تعيين (للاختبارات). */
  reset(): void {
    this.state = { expanded: [] };
    this.persist();
  }
}
