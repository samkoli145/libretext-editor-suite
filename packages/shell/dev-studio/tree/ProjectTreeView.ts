/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [ProjectTreeView.ts] سطح تصفح الشجرة — الواجهة الواقعية
 *
 * هذا الملف هو ما يجعل الشجرة قابلة للاستخدام، لا مجرد
 * بيانات. من ملاحظة المستخدم: "الوصول للملف يكون سهل".
 *
 * القدرات الثمانية (من التحليل):
 * 1. نقرة واحدة   → تحديد + معاينة
 * 2. نقرة مزدوجة  → فتح الملف في المحرر المناسب
 * 3. زر أيمن 🖱️    → قائمة سياق (فتح، تعديل، تفكيك، حذف، نسخ)
 * 4. بحث/فلتر     → وصول فوري
 * 5. Breadcrumb    → معرفة الموقع
 * 6. شارات الصحة   → دكتور النظام مرئي في كل عقدة
 * 7. لوحة المفاتيح → أسهم + Enter + Escape
 * 8. حفظ التوسع    → عبر lsJson (نمط panels.ts)
 *
 * المبدأ الحاكم (من panels.ts):
 * "The panel is chrome... What is NOT visible is what the
 *  controls WRITE." — الواجهة ترسم، لكن كل فعل يمر عبر
 * FileOperations كمصنع تصحيحات، عبر خط الأنابيب. الواجهة
 * لا تعدل مباشرة أبداً.
 *
 * الثيم (من الميثاق + story.css):
 * فاتح نقي 100%. لا dark، لا theme-dark، لا light-dark().
 * هذا سطح تحرير، يتبع الغرفة فاتحة دائماً. (أسطح العرض
 * التقديمي فقط هي الداكنة، وهذا ليس منها.)
 *
 * التنبيهات:
 * - كل الأفعال عبر callbacks، لا تعديل مباشر
 * - قائمة الزر الأيمن موحدة (SharedContextMenu)
 * - شارة الصحة: أخضر=healthy، أصفر=large، أحمر=missing
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { TreeNode } from './ProjectTreeModel';
import { ProjectTreeModel, LARGE_FILE_LINES } from './ProjectTreeModel';
import type { NavigationState } from './TreeNavigation';
import { TreeNavigation } from './TreeNavigation';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الـ callbacks — ما تفعله الواجهة عبر المنادي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * أفعال الواجهة. كل فعل يمر عبر المنادي إلى خط الأنابيب.
 * الواجهة لا تعدل — فقط تطلب.
 */
export interface TreeActions {
  /** فتح ملف في المحرر المناسب */
  open(path: string): void;
  /** طلب تعديل ملف */
  edit(path: string): void;
  /** طلب تفكيك ملف */
  decompose(path: string): void;
  /** طلب حذف ملف */
  remove(path: string): void;
  /** نسخ المسار للحافظة */
  copyPath(path: string): void;
  /** معاينة ملف (نقرة واحدة) */
  preview(path: string): void;
}

/** خيارات العرض. */
export interface TreeViewOpts {
  host: HTMLElement;
  model: ProjectTreeModel;
  nav: TreeNavigation;
  actions: TreeActions;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// العرض
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * سطح تصفح الشجرة.
 *
 * يبني DOM من الشجرة + حالة التنقل، ويعيد بناءه عند أي
 * تغيير. نفس نمط panels.ts: rebuild() على كل حدث.
 */
export class ProjectTreeView {
  private host: HTMLElement;
  private model: ProjectTreeModel;
  private nav: TreeNavigation;
  private actions: TreeActions;
  private root: TreeNode;

  constructor(opts: TreeViewOpts) {
    this.host = opts.host;
    this.model = opts.model;
    this.nav = opts.nav;
    this.actions = opts.actions;
    this.root = this.model.buildTree();
    this.render();
  }

  /** إعادة البناء — عند أي تغيير في النموذج أو التنقل. */
  refresh(): void {
    this.root = this.model.buildTree();
    this.render();
  }

  /** الرسم الفعلي. */
  private render(): void {
    this.host.innerHTML = '';
    this.host.classList.add('ptv-root');
    // الثيم الفاتح النقي: direction ltr لأن المحتوى وثيقة
    this.host.style.direction = 'ltr';

    // شريط البحث
    this.host.appendChild(this.buildSearchBar());

    // Breadcrumb
    this.host.appendChild(this.buildBreadcrumb());

    // قائمة العقد المرئية
    const list = document.createElement('div');
    list.className = 'ptv-list';
    const visible = this.nav.visibleNodes(this.root);
    for (const node of visible) {
      list.appendChild(this.buildRow(node));
    }
    this.host.appendChild(list);
  }

  /** شريط البحث — يصفّي العرض، لا البيانات. */
  private buildSearchBar(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'ptv-search';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'بحث في الشجرة…';
    input.value = this.nav.current.query ?? '';
    input.addEventListener('input', () => {
      this.nav.setQuery(input.value);
      this.render();
    });
    wrap.appendChild(input);
    return wrap;
  }

  /** مسار التنقل — مشتق من المحدد. */
  private buildBreadcrumb(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'ptv-breadcrumb';
    const crumbs = this.nav.breadcrumb();
    if (!crumbs.length) {
      wrap.textContent = '—';
      return wrap;
    }
    for (let i = 0; i < crumbs.length; i++) {
      const crumb = crumbs[i];
      const span = document.createElement('span');
      span.className = 'ptv-crumb';
      span.textContent = crumb.name;
      span.addEventListener('click', () => {
        // نقرة على breadcrumb تحدد المجلد
        this.nav.select(crumb.path, crumbs.slice(0, i).map((c) => c.path));
        this.render();
      });
      wrap.appendChild(span);
      if (i < crumbs.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'ptv-sep';
        sep.textContent = '/';
        wrap.appendChild(sep);
      }
    }
    return wrap;
  }

  /** صف عقدة واحدة — مع الأيقونة، الاسم، شارة الصحة. */
  private buildRow(node: TreeNode): HTMLElement {
    const row = document.createElement('div');
    row.className = 'ptv-row';
    row.dataset.path = node.path;

    const enriched = node.kind === 'file' ? this.model.enrich(node) : node;

    // سهم المجلد (إن كان مجلداً)
    if (node.kind === 'dir') {
      const arrow = document.createElement('span');
      arrow.className = 'ptv-arrow' + (this.nav.isExpanded(node.path) ? ' open' : '');
      arrow.textContent = '▶';
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nav.toggle(node.path);
        this.render();
      });
      row.appendChild(arrow);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'ptv-spacer';
      row.appendChild(spacer);
    }

    // الاسم
    const name = document.createElement('span');
    name.className = 'ptv-name';
    name.textContent = node.name;
    row.appendChild(name);

    // شارة الصحة (للملفات فقط)
    if (node.kind === 'file' && enriched.health) {
      const badge = document.createElement('span');
      badge.className = `ptv-badge ptv-${enriched.health}`;
      badge.textContent = enriched.health === 'large'
        ? `${enriched.lines}⚠`
        : enriched.health === 'missing' ? '✗' : '';
      if (enriched.health === 'large') {
        badge.title = `تجاوز ${LARGE_FILE_LINES} سطر — مرشح للتفكيك`;
      } else if (enriched.health === 'missing') {
        badge.title = 'ملف مفقود';
      }
      row.appendChild(badge);
    }

    // التمييز إن كان محدداً
    if (this.nav.current.selected === node.path) {
      row.classList.add('ptv-selected');
    }

    // ── التفاعلات ──
    // نقرة واحدة: تحديد + معاينة
    row.addEventListener('click', () => {
      const ancestors = this.ancestorsOf(node.path);
      this.nav.select(node.path, ancestors);
      if (node.kind === 'file') this.actions.preview(node.path);
      this.render();
    });

    // نقرة مزدوجة: فتح
    row.addEventListener('dblclick', () => {
      if (node.kind === 'file') this.actions.open(node.path);
      else this.nav.toggle(node.path);
      this.render();
    });

    // زر أيمن: قائمة سياق (إلزامي من الميثاق)
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(node, e.clientX, e.clientY);
    });

    return row;
  }

  /** آباء مسار — للتوسيع التلقائي عند التحديد. */
  private ancestorsOf(path: string): string[] {
    const parts = path.split('/').filter(Boolean);
    const out: string[] = [];
    let acc = '';
    for (let i = 0; i < parts.length - 1; i++) {
      acc = acc ? `${acc}/${parts[i]}` : parts[i];
      out.push(acc);
    }
    return out;
  }

  /**
   * قائمة السياق — الزر الأيمن.
   *
   * ⚠️ إلزامية من الميثاق: "دعم الماوس (with right-click
   * functionality and options)". كل عقدة لها قائمة.
   */
  private showContextMenu(node: TreeNode, x: number, y: number): void {
    // إزالة أي قائمة سابقة
    document.querySelector('.ptv-ctx')?.remove();

    const menu = document.createElement('div');
    menu.className = 'ptv-ctx';
    menu.style.position = 'fixed';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const items: Array<{ label: string; act: () => void; show: boolean }> = [
      { label: 'فتح', act: () => this.actions.open(node.path), show: node.kind === 'file' },
      { label: 'تعديل', act: () => this.actions.edit(node.path), show: node.kind === 'file' },
      { label: 'تفكيك', act: () => this.actions.decompose(node.path), show: node.kind === 'file' },
      { label: 'نسخ المسار', act: () => this.actions.copyPath(node.path), show: true },
      { label: 'حذف', act: () => this.actions.remove(node.path), show: node.kind === 'file' },
    ];

    for (const item of items) {
      if (!item.show) continue;
      const el = document.createElement('div');
      el.className = 'ptv-ctx-item';
      el.textContent = item.label;
      el.addEventListener('click', () => {
        item.act();
        menu.remove();
      });
      menu.appendChild(el);
    }

    document.body.appendChild(menu);

    // إغلاق عند النقر خارجها
    const onDocClick = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', onDocClick);
      }
    };
    setTimeout(() => document.addEventListener('click', onDocClick), 0);
  }
}
