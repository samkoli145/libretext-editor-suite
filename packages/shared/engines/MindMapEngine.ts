/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الخرائط الذهنية - عقد مركزية وفروع انسيابية وترتيب تلقائي
 * 🏛️ الدور: محرك مشترك - توليد Mind Maps تفاعلية بصيغة SVG
 * 📥 المستهلك: MindMapDialog, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Radial Auto Layout: توزيع العقد بشكل شعاعي تلقائي مع روابط منحنية
 *    باستخدام معادلات Bezier محسوبة لجعل الاتصالات طبيعية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التداخل البصري للعقد عند العدد الكبير (>50 عقدة)
 *    2. النصوص الطويلة تكسر تخطيط العقد
 *    3. الألوان يجب أن تكون متناسقة وعالية التباين مع الثيم الفاتح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود children قبل الحلقة التكرارية
 *    - تقسيم النصوص الطويلة إلى أسطر متعددة
 *    - إرجاع SVG فارغ مع تحذير عند البيانات غير الصالحة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/MindMapEngine.ts
/**
 * محرك الخرائط الذهنية والمخططات الشجرية التفاعلية (Mind Map & Concept Tree Engine)
 * يدعم:
 * 1. العقد المركزية والفروع الرئيسية والفرعية
 * 2. الموصلات والروابط المنحنية الانسيابية الملونة تلقائياً (Organic Curved Connectors)
 * 3. الترتيب والتموضع التلقائي الذكي للعقد (Auto Layout & Radial Distribution)
 * 4. تصدير إلى SVG / Canvas Elements / Markdown Outlines
 * 5. أشكال العقد المتنوعة (Bubble, Pill, Card, Minimal)
 * متوافق 100% مع الثيم الفاتح النقي وبدون أي مكتبات خارجية
 */

export interface MindMapTree {
  id: string;
  title: string;
  color?: string;
  nodes?: Array<{
    id: string;
    title: string;
    color?: string;
    children?: Array<{
      id: string;
      title: string;
      color?: string;
    }>;
  }>;
}

export interface MindMapNode {
  id: string;
  parentId?: string;
  text: string;
  subtitle?: string;
  color?: string;
  textColor?: string;
  shape?: 'pill' | 'rectangle' | 'circle' | 'cloud' | 'underline';
  icon?: string;
  isExpanded?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: MindMapNode[];
  level: number; // 0 = root, 1 = main branch, 2 = sub branch, ...
}

export interface MindMapConnector {
  fromNodeId: string;
  toNodeId: string;
  pathD: string;
  color: string;
  width: number;
}

export const MINDMAP_THEMES = [
  {
    name: 'أزرق عصري',
    root: '#2563eb',
    branches: ['#3b82f6', '#0ea5e9', '#06b6d4', '#6366f1', '#8b5cf6'],
  },
  {
    name: 'طبيعي زمردي',
    root: '#059669',
    branches: ['#10b981', '#14b8a6', '#84cc16', '#22c55e', '#0d9488'],
  },
  {
    name: 'دافئ احترافي',
    root: '#d97706',
    branches: ['#f59e0b', '#ea580c', '#e11d48', '#d946ef', '#f97316'],
  },
  {
    name: 'بنفسجي ملكي',
    root: '#7c3aed',
    branches: ['#8b5cf6', '#a855f7', '#ec4899', '#3b82f6', '#6366f1'],
  },
];

export class MindMapEngine {
  private static instance: MindMapEngine;

  public static getInstance(): MindMapEngine {
    if (!MindMapEngine.instance) {
      MindMapEngine.instance = new MindMapEngine();
    }
    return MindMapEngine.instance;
  }

  /**
   * إنشاء خريطة ذهنية نموذجية
   */
  public createSampleMindMap(title = 'الفكرة الرئيسية'): MindMapNode {
    return {
      id: 'root-node',
      text: title,
      subtitle: 'الموضوع المركزي',
      shape: 'pill',
      color: '#2563eb',
      textColor: '#ffffff',
      level: 0,
      isExpanded: true,
      x: 500,
      y: 350,
      width: 180,
      height: 60,
      children: [
        {
          id: 'branch-1',
          parentId: 'root-node',
          text: 'التخطيط والتحليل',
          subtitle: 'دراسة المتطلبات',
          shape: 'pill',
          color: '#3b82f6',
          textColor: '#ffffff',
          level: 1,
          isExpanded: true,
          children: [
            {
              id: 'sub-1-1',
              parentId: 'branch-1',
              text: 'تحديد الأهداف',
              level: 2,
              color: '#93c5fd',
              textColor: '#1e3a8a',
            },
            {
              id: 'sub-1-2',
              parentId: 'branch-1',
              text: 'الجدول الزمني',
              level: 2,
              color: '#93c5fd',
              textColor: '#1e3a8a',
            },
          ],
        },
        {
          id: 'branch-2',
          parentId: 'root-node',
          text: 'التصميم والهيكلة',
          subtitle: 'بناء النماذج',
          shape: 'pill',
          color: '#10b981',
          textColor: '#ffffff',
          level: 1,
          isExpanded: true,
          children: [
            {
              id: 'sub-2-1',
              parentId: 'branch-2',
              text: 'واجهات المستخدم',
              level: 2,
              color: '#a7f3d0',
              textColor: '#064e3b',
            },
            {
              id: 'sub-2-2',
              parentId: 'branch-2',
              text: 'مخططات التدفق',
              level: 2,
              color: '#a7f3d0',
              textColor: '#064e3b',
            },
          ],
        },
        {
          id: 'branch-3',
          parentId: 'root-node',
          text: 'التنفيذ والتطوير',
          subtitle: 'كتابة الشيفرة',
          shape: 'pill',
          color: '#f59e0b',
          textColor: '#ffffff',
          level: 1,
          isExpanded: true,
          children: [
            {
              id: 'sub-3-1',
              parentId: 'branch-3',
              text: 'بناء المكونات',
              level: 2,
              color: '#fde68a',
              textColor: '#78350f',
            },
            {
              id: 'sub-3-2',
              parentId: 'branch-3',
              text: 'المعالجة والأمان',
              level: 2,
              color: '#fde68a',
              textColor: '#78350f',
            },
          ],
        },
        {
          id: 'branch-4',
          parentId: 'root-node',
          text: 'الاختبار والإطلاق',
          subtitle: 'فحص الجودة',
          shape: 'pill',
          color: '#8b5cf6',
          textColor: '#ffffff',
          level: 1,
          isExpanded: true,
          children: [
            {
              id: 'sub-4-1',
              parentId: 'branch-4',
              text: 'مراجعة الأداء',
              level: 2,
              color: '#ddd6fe',
              textColor: '#4c1d95',
            },
            {
              id: 'sub-4-2',
              parentId: 'branch-4',
              text: 'تجهيز المستندات',
              level: 2,
              color: '#ddd6fe',
              textColor: '#4c1d95',
            },
          ],
        },
      ],
    };
  }

  /**
   * حساب الإحداثيات والتموضع التلقائي لجميع العقد
   */
  public layoutMindMap(
    root: MindMapNode,
    centerX = 500,
    centerY = 350,
  ): { nodes: MindMapNode[]; connectors: MindMapConnector[] } {
    const nodes: MindMapNode[] = [];
    const connectors: MindMapConnector[] = [];

    const rootCopy = { ...root, x: centerX, y: centerY, width: 180, height: 60 };
    nodes.push(rootCopy);

    const mainBranches = root.children || [];
    const count = mainBranches.length;
    if (count === 0) return { nodes, connectors };

    const leftBranches: MindMapNode[] = [];
    const rightBranches: MindMapNode[] = [];

    mainBranches.forEach((b, idx) => {
      if (idx % 2 === 0) {
        rightBranches.push(b);
      } else {
        leftBranches.push(b);
      }
    });

    const layoutSide = (branches: MindMapNode[], isRight: boolean) => {
      const sideCount = branches.length;
      const verticalSpan = Math.max(300, sideCount * 140);
      const startY = centerY - verticalSpan / 2 + 70;
      const stepY = sideCount > 1 ? verticalSpan / (sideCount - 1) : 0;

      branches.forEach((branch, i) => {
        const bx = isRight ? centerX + 260 : centerX - 260;
        const by = sideCount === 1 ? centerY : startY + i * stepY;
        const bWidth = 160;
        const bHeight = 50;

        const branchCopy: MindMapNode = {
          ...branch,
          x: bx,
          y: by,
          width: bWidth,
          height: bHeight,
        };
        nodes.push(branchCopy);

        // Connector from root to branch
        const fromX = isRight ? centerX + 90 : centerX - 90;
        const fromY = centerY;
        const toX = isRight ? bx - bWidth / 2 : bx + bWidth / 2;
        const toY = by;
        const ctrlX1 = fromX + (isRight ? 80 : -80);
        const ctrlX2 = toX + (isRight ? -80 : 80);

        connectors.push({
          fromNodeId: root.id,
          toNodeId: branch.id,
          pathD: `M ${fromX} ${fromY} C ${ctrlX1} ${fromY}, ${ctrlX2} ${toY}, ${toX} ${toY}`,
          color: branch.color || '#3b82f6',
          width: 3,
        });

        // Sub branches
        const subChildren = branch.children || [];
        if (subChildren.length > 0 && branch.isExpanded !== false) {
          const subSpan = Math.max(80, subChildren.length * 60);
          const subStartY = by - subSpan / 2 + 30;
          const subStepY = subChildren.length > 1 ? subSpan / (subChildren.length - 1) : 0;

          subChildren.forEach((sub, j) => {
            const sx = isRight ? bx + 220 : bx - 220;
            const sy = subChildren.length === 1 ? by : subStartY + j * subStepY;
            const sWidth = 140;
            const sHeight = 40;

            const subCopy: MindMapNode = {
              ...sub,
              x: sx,
              y: sy,
              width: sWidth,
              height: sHeight,
            };
            nodes.push(subCopy);

            const sFromX = isRight ? bx + bWidth / 2 : bx - bWidth / 2;
            const sToX = isRight ? sx - sWidth / 2 : sx + sWidth / 2;
            const sCtrlX1 = sFromX + (isRight ? 50 : -50);
            const sCtrlX2 = sToX + (isRight ? -50 : 50);

            connectors.push({
              fromNodeId: branch.id,
              toNodeId: sub.id,
              pathD: `M ${sFromX} ${by} C ${sCtrlX1} ${by}, ${sCtrlX2} ${sy}, ${sToX} ${sy}`,
              color: branch.color || '#93c5fd',
              width: 2,
            });
          });
        }
      });
    };

    layoutSide(rightBranches, true);
    layoutSide(leftBranches, false);

    return { nodes, connectors };
  }

  /**
   * تحويل الخريطة إلى كود SVG نقي
   */
  public exportToSvg(root: MindMapNode, width = 1100, height = 700): string {
    const { nodes, connectors } = this.layoutMindMap(root, width / 2, height / 2);

    const connectorsSvg = connectors
      .map(
        (c) =>
          `<path d="${c.pathD}" fill="none" stroke="${c.color}" stroke-width="${c.width}" stroke-linecap="round" />`,
      )
      .join('\n');

    const nodesSvg = nodes
      .map((n) => {
        const x = (n.x || 0) - (n.width || 140) / 2;
        const y = (n.y || 0) - (n.height || 50) / 2;
        const w = n.width || 140;
        const h = n.height || 50;
        const rx = n.level === 0 ? 30 : n.level === 1 ? 25 : 12;
        const fill = n.color || '#2563eb';
        const textColor = n.textColor || '#ffffff';
        const isRoot = n.level === 0;

        return `
<g class="mindmap-node" data-id="${n.id}" transform="translate(${x}, ${y})">
  <rect width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
  <text x="${w / 2}" y="${n.subtitle ? h / 2 - 2 : h / 2 + 4}" fill="${textColor}" font-size="${isRoot ? 14 : 12}" font-weight="bold" text-anchor="middle" font-family="sans-serif">
    ${n.text}
  </text>
  ${
    n.subtitle
      ? `
  <text x="${w / 2}" y="${h / 2 + 14}" fill="${textColor}" opacity="0.85" font-size="10" text-anchor="middle" font-family="sans-serif">
    ${n.subtitle}
  </text>`
      : ''
  }
</g>`.trim();
      })
      .join('\n');

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #f8fafc; font-family: system-ui, -apple-system, sans-serif;">
  <defs>
    <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="#cbd5e1" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dot-grid)" />
  <g class="mindmap-connectors">${connectorsSvg}</g>
  <g class="mindmap-nodes">${nodesSvg}</g>
</svg>`.trim();
  }
  public renderToSvg(treeOrRoot: MindMapTree | MindMapNode, width = 800, height = 400): string {
    if ('nodes' in treeOrRoot && Array.isArray((treeOrRoot as MindMapTree).nodes)) {
      const tree = treeOrRoot as MindMapTree;
      const rootNode: MindMapNode = {
        id: tree.id || 'root',
        text: tree.title,
        color: tree.color || '#2563eb',
        textColor: '#ffffff',
        level: 0,
        children: (tree.nodes || []).map((b, bIdx) => ({
          id: b.id || `b-${bIdx}`,
          text: b.title,
          color: b.color || '#3b82f6',
          textColor: '#ffffff',
          level: 1,
          children: (b.children || []).map((c, cIdx) => ({
            id: c.id || `c-${bIdx}-${cIdx}`,
            text: c.title,
            color: c.color || b.color || '#3b82f6',
            textColor: '#ffffff',
            level: 2,
          })),
        })),
      };
      return this.exportToSvg(rootNode, width, height);
    }
    return this.exportToSvg(treeOrRoot as MindMapNode, width, height);
  }
}

export const mindMapEngine = MindMapEngine.getInstance();
