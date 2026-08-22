/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [ProjectTreeModel.ts] نموذج شجرة المشروع — البيانات، لا العرض
 *
 * هذا الملف يجيب سؤالاً واحداً: "ما هو موجود في المشروع؟"
 *
 * المبدأ الحاكم (من story.ts قاعدة 2):
 * "SERIES ARE DERIVED, NEVER STORED" — الشجرة تُشتق من الملفات
 * الفعلية في كل قراءة، لا تُخزن كنسخة. نسخة مخزنة من الشجرة
 * ستنفصل عن الحقيقة لحظة تعديل ملف خارج الاستوديو، تماماً
 * كما ينفصل رسم بياني مخزّن عن الجدول خلفه.
 *
 * المبدأ الثاني (من select.ts):
 * "A SELECTION IS DATA. Nothing here touches the DOM." — النموذج
 * يصف، والواجهة ترسم ما يقوله. هذا ما يجعل الشجرة قابلة
 * للاختبار في Node، وقابلة لإعادة الرسم دون فقدان الحالة.
 *
 * الصحة (health) تُشتق أيضاً: ملف >500 سطر = تحذير. لا نخزن
 * "هذا الملف كبير" كحقل، لأن الحجم يتغير مع كل تعديل، والحقل
 * المخزن سيكذب لحظة أن يصبح صحيحاً.
 *
 * التنبيهات:
 * - لا تعديل مباشر أبداً (مصنع تصحيحات، مبدأ rowcol.ts)
 * - الشجرة تُعاد بناءها من ProjectSurface عند الطلب
 * - العقد تحمل metadata مشتقة (الحجم، الصحة، النوع)
 * - الملف المفقود يُبلَّغ كـ missing، لا يُختلق
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { ProjectSurface } from '../core/DevStudioEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع — ما تصفه الشجرة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** نوع العقدة. ملف أو مجلد — لا شيء آخر في شجرة مشروع. */
export type TreeNodeKind = 'file' | 'dir';

/**
 * حالة صحة الملف — مشتقة، لا مخزنة.
 * healthy: دون عتبة التحذير
 * large: تجاوز عتبة الأسطر (مرشح للتفكيك)
 * missing: مُسجَّل في النموذج لكن الملف غير موجود على القرص
 */
export type NodeHealth = 'healthy' | 'large' | 'missing';

/**
 * عقدة في الشجرة.
 *
 * ⚠️ الحقول المضافة (من story.ts): الغياب يعني "لا".
 * ملف بلا تحذير ليس له `warnings: []`، بل لا حقل أصلاً.
 * هذا ما يجعل round-trip الشجرة byte-identical.
 */
export interface TreeNode {
  /** معرف فريد — المسار هو الهوية، لأن المسار لا يُعاد */
  id: string;
  name: string;
  path: string;
  kind: TreeNodeKind;
  /** additive: موجودة فقط للمجلدات */
  children?: TreeNode[];
  /** additive: موجودة فقط للملفات */
  lines?: number;
  /** additive: موجودة فقط للملفات */
  health?: NodeHealth;
}

/** واجهة توافقية للواجهات الرسومية الحالية */
export interface TreeNodeItem {
  id: string;
  name: string;
  nameAr?: string;
  path: string;
  type: 'file' | 'folder';
  category?: 'core' | 'shared' | 'features' | 'shell' | 'root';
  linesCount?: number;
  sizeKb?: number;
  status: 'healthy' | 'warning' | 'decomposed';
  children?: TreeNodeItem[];
}

/** عتبة "الملف الكبير" — مرشح للتفكيك. نفس رقم الميثاق. */
export const LARGE_FILE_LINES = 500;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// النموذج — يشتق الشجرة، لا يخزنها
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * نموذج شجرة المشروع.
 *
 * المسؤوليات:
 * 1. اشتقاق الشجرة من ProjectSurface عند الطلب
 * 2. حساب الصحة (مشتقة من عدد الأسطر)
 * 3. البحث والتصفية (تُعيد عقد، لا تعدل)
 *
 * ⚠️ لا يوجد هنا أي تعديل. كل تغيير يمر عبر FileOperations
 * كمصنع تصحيحات. النموذج يقرأ فقط.
 */
export class ProjectTreeModel {
  private project: ProjectSurface;

  constructor(project: ProjectSurface) {
    this.project = project;
  }

  /**
   * بناء الشجرة كاملة من قائمة الملفات.
   *
   * الخوارزمية:
   * 1. قراءة كل المسارات من السطح
   * 2. فرزها (يضمن أن الآباء يأتون قبل الأبناء)
   * 3. إدراج كل مسار في موقعه، منشئاً المجلدات الوسيطة
   *
   * ⚠️ الفرز ليس تجميلياً: بدون إدراج الأب قبل الابن،
   * سنحاول إضافة طفل إلى مجلد لم يُنشأ بعد.
   */
  buildTree(): TreeNode {
    const paths = this.project.listFiles().slice().sort();
    const root: TreeNode = {
      id: '',
      name: 'project',
      path: '',
      kind: 'dir',
      children: [],
    };

    for (const p of paths) {
      this.insertPath(root, p);
    }
    return root;
  }

  /** إدراج مسار واحد، منشئاً المجلدات الوسيطة عند الحاجة. */
  private insertPath(root: TreeNode, path: string): void {
    const parts = path.split('/').filter(Boolean);
    let current = root;
    let acc = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      acc = acc ? `${acc}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (!current.children) current.children = [];

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          id: acc,
          name: part,
          path: acc,
          kind: isLast ? this.kindOf(acc) : 'dir',
        };
        current.children.push(child);
      }

      // إن كانت العقدة وُجدت كمجلد لكن المسار يقول إنها ملف،
      // فهذا تعارض هوية — نرفض بصوت عالٍ (مبدأ rowcol.ts).
      if (isLast && child.kind !== this.kindOf(acc)) {
        throw new Error(
          `[ProjectTreeModel] identity conflict at "${acc}": ` +
          `node is ${child.kind} but path says ${this.kindOf(acc)}`,
        );
      }

      if (!isLast) {
        if (child.kind !== 'dir') {
          throw new Error(
            `[ProjectTreeModel] "${acc}" is a file but has children`,
          );
        }
        current = child;
      }
    }
  }

  /** هل المسار ملف أم مجلد؟ الامتداد يقرر. */
  private kindOf(path: string): TreeNodeKind {
    return /\.[a-z0-9]+$/i.test(path) ? 'file' : 'dir';
  }

  /**
   * إثراء عقدة ملف ببيانات مشتقة: عدد الأسطر والصحة.
   *
   * ⚠️ تُقرأ من القرص في كل استدعاء — لأن الحجم يتغير.
   * التخزين المؤقت هنا كذب مؤجل.
   */
  enrich(node: TreeNode): TreeNode {
    if (node.kind !== 'file') return node;

    const content = this.project.readFile(node.path);
    if (content === null) {
      // ملف مسجل لكنه غير موجود — نبلّغ، لا نختلق
      return { ...node, health: 'missing' };
    }

    const lines = content.split('\n').length;
    const health: NodeHealth = lines > LARGE_FILE_LINES ? 'large' : 'healthy';
    return { ...node, lines, health };
  }

  /**
   * البحث في الشجرة — يُعيد العقد المطابقة، لا يعدل شيئاً.
   *
   * المطابقة على الاسم، حساسة لحالة الأحرف اختيارياً.
   * المجلد المطابق يُعاد هو أيضاً، لأن المستخدم قد يبحث عن مجلد.
   */
  search(root: TreeNode, query: string, caseSensitive = false): TreeNode[] {
    const q = caseSensitive ? query : query.toLowerCase();
    const out: TreeNode[] = [];

    const walk = (node: TreeNode): void => {
      const name = caseSensitive ? node.name : node.name.toLowerCase();
      if (name.includes(q)) out.push(node);
      for (const child of node.children ?? []) walk(child);
    };
    walk(root);
    return out;
  }

  /**
   * كل الملفات الكبيرة — مدخلات محرك التفكيك.
   * مشتقة في كل قراءة، لأن ملفاً يُفكك الآن يجب أن يختفي من
   * هذه القائمة فور حفظ التفكيك.
   */
  largeFiles(root: TreeNode): TreeNode[] {
    const out: TreeNode[] = [];
    const walk = (node: TreeNode): void => {
      if (node.kind === 'file') {
        const enriched = this.enrich(node);
        if (enriched.health === 'large') out.push(enriched);
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(root);
    return out;
  }

  /** إيجاد عقدة بمسارها. null إن لم توجد — لا استثناء. */
  find(root: TreeNode, path: string): TreeNode | null {
    if (root.path === path) return root;
    for (const child of root.children ?? []) {
      const found = this.find(child, path);
      if (found) return found;
    }
    return null;
  }

  /** شجرة استعراضية متوافقة مع لوحات العرض الثابتة عند الحاجة */
  static getMasterTree(): TreeNodeItem[] {
    return [
      {
        id: 'tree-core',
        name: 'core',
        nameAr: 'نواة النظام والعقود',
        path: 'src/core',
        type: 'folder',
        category: 'core',
        status: 'healthy',
        children: [
          { id: 'f-contracts', name: 'contracts.ts', nameAr: 'عقود المحركات', path: 'src/core/contracts.ts', type: 'file', category: 'core', status: 'healthy', linesCount: 95, sizeKb: 3.2 },
          { id: 'f-engines', name: 'engines.ts', nameAr: 'محركات النظام', path: 'src/core/engines.ts', type: 'file', category: 'core', status: 'healthy', linesCount: 140, sizeKb: 5.1 }
        ]
      },
      {
        id: 'tree-shared',
        name: 'shared',
        nameAr: 'الطبقة والمكتبة المشتركة (Zero-Deps)',
        path: 'src/shared',
        type: 'folder',
        category: 'shared',
        status: 'healthy',
        children: [
          {
            id: 'tree-lib-core',
            name: 'lib-core',
            nameAr: 'المكتبة المعزولة المركزية',
            path: 'src/shared/lib-core',
            type: 'folder',
            category: 'shared',
            status: 'healthy',
            children: [
              { id: 'f-zip', name: 'zip-engine.ts', nameAr: 'محرك الأرشيف النقي', path: 'src/shared/lib-core/archive/zip-engine.ts', type: 'file', category: 'shared', status: 'healthy', linesCount: 220, sizeKb: 8.4 },
              { id: 'f-unit-calc', name: 'unit-calc-engine.ts', nameAr: 'محرك الحسابات والوحدات', path: 'src/shared/lib-core/computational-notebook/unit-calc-engine.ts', type: 'file', category: 'shared', status: 'healthy', linesCount: 310, sizeKb: 12.1 },
              { id: 'f-doctor-eng', name: 'DoctorSelfHealingEngine.ts', nameAr: 'دكتور الإصلاح الذاتي', path: 'src/shared/engines/DoctorSelfHealingEngine.ts', type: 'file', category: 'shared', status: 'healthy', linesCount: 380, sizeKb: 14.5 }
            ]
          },
          {
            id: 'tree-tools',
            name: 'tools',
            nameAr: 'منظومة الأدوات الموحدة',
            path: 'src/shared/tools',
            type: 'folder',
            category: 'shared',
            status: 'healthy',
            children: [
              { id: 'f-unified-tools', name: 'unifiedTools.ts', nameAr: 'الأدوات الموحدة الـ 160+', path: 'src/shared/tools/unifiedTools.ts', type: 'file', category: 'shared', status: 'healthy', linesCount: 450, sizeKb: 18.2 },
              { id: 'f-tool-registry', name: 'ToolRegistry.ts', nameAr: 'سجل الأدوات الشامل', path: 'src/shared/tools/ToolRegistry.ts', type: 'file', category: 'shared', status: 'healthy', linesCount: 905, sizeKb: 51.2 }
            ]
          }
        ]
      },
      {
        id: 'tree-features',
        name: 'features',
        nameAr: 'المحررات التخصصية الأربعة',
        path: 'src/features',
        type: 'folder',
        category: 'features',
        status: 'healthy',
        children: [
          { id: 'f-canvas', name: 'canvas-designer', nameAr: 'محرر الكانفا والمخططات', path: 'src/features/canvas-designer', type: 'folder', category: 'features', status: 'healthy' },
          { id: 'f-ui-des', name: 'ui-designer', nameAr: 'مصمم واجهات وتطبيقات الويب', path: 'src/features/ui-designer', type: 'folder', category: 'features', status: 'healthy' },
          { id: 'f-rich-txt', name: 'rich-text', nameAr: 'محرر المستندات والنصوص الغنية', path: 'src/features/rich-text', type: 'folder', category: 'features', status: 'healthy' },
          { id: 'f-pdf', name: 'pdf', nameAr: 'استوديو ومحرر ملفات PDF', path: 'src/features/pdf', type: 'folder', category: 'features', status: 'healthy' }
        ]
      },
      {
        id: 'tree-shell',
        name: 'shell / dev-studio',
        nameAr: 'استوديو التطوير الرئيسي الاستثنائي',
        path: 'src/shell/dev-studio',
        type: 'folder',
        category: 'shell',
        status: 'healthy',
        children: [
          { id: 'f-dev-engine', name: 'DevStudioEngine.ts', nameAr: 'المحرك الأوركسترالي', path: 'src/shell/dev-studio/core/DevStudioEngine.ts', type: 'file', category: 'shell', status: 'healthy', linesCount: 160, sizeKb: 6.2 },
          { id: 'f-dev-doctor', name: 'DoctorEngine.ts', nameAr: 'صمام أمان الدكتور', path: 'src/shell/dev-studio/doctor/DoctorEngine.ts', type: 'file', category: 'shell', status: 'healthy', linesCount: 110, sizeKb: 4.8 },
          { id: 'f-dev-snap', name: 'SnapshotEngine.ts', nameAr: 'محرك اللقطات والرجوع', path: 'src/shell/dev-studio/checkpoint/SnapshotEngine.ts', type: 'file', category: 'shell', status: 'healthy', linesCount: 90, sizeKb: 3.9 }
        ]
      }
    ];
  }
}
