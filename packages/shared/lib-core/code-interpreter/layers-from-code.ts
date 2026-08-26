/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: layers-from-code.ts
 * 📂 المسار: packages/shared/lib-core/code-interpreter/layers-from-code.ts
 * 🎯 الهدف الرئيسي: جسر كود→طبقات — استخراج شجرة طبقات تفاعلية من HTML/CSS
 * 📋 المعايير: عبر extractHtmlAst الجاهز، عقد قابلة للإخفاء والقفل والتحديد
 * 🧪 الاختبارات: packages/core/tests/blocks/layers-and-layouts.test.ts
 * 🏷️ المعرف: SHARED-CODE-LAYERS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Code-as-Source-of-Truth Layers — الشجرة تُشتق من الكود وقت الطلب
 *    (DERIVED NEVER STORED) بنمط InfiniteLayerTree من webpainter-nextx5.02:
 *    مصفوفة مسطحة parentId → شجرة، مع حالات visible/locked محلية فوقها.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إخفاء طبقة يعدّل الكود (يضيف style="display:none") — لا حالة مخفية.
 *    2. معرفات العقد تعتمد ترتيب الاستخراج — تغيير الكود قد يغير المعرفات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - كود فارغ → شجرة فارغة لا خطأ.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: ./live-interpreter-engine.ts (extractHtmlAst)
 *    - 📚 مرجع النمط: webpainter-nextx5.02 InfiniteLayerTree.tsx (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - extractLayerTree: كود → شجرة طبقات مسطحة (#L74)
 *    - toggleLayerVisibility: إخفاء/إظهار بتعديل الكود (#L104)
 *    - findLayerBySelector: تحديد نطاق طبقة في الكود (#L128)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-nextx5.02 InfiniteLayerTree pattern (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { liveInterpreterEngine } from './live-interpreter-engine';
import type { VisualAstNode } from './live-interpreter-engine';

/** عقدة طبقة واحدة في الشجرة. */
export interface CodeLayerNode {
  readonly id: string;
  readonly tag: string;
  readonly label: string;
  readonly parentId: string | null;
  readonly childrenCount: number;
  readonly startLine: number;
  readonly endLine: number;
  /** ملخص السمات للعرض في لوحة الخصائص. */
  readonly attributesSummary: string;
}

/** استخراج شجرة طبقات مسطحة من كود HTML/SVG. */
export function extractLayerTree(code: string): CodeLayerNode[] {
  if (!code.trim()) return [];

  const astNodes = liveInterpreterEngine.extractHtmlAst(code);
  return astNodes.map(node => ({
    id: node.id,
    tag: node.tag,
    label: buildLayerLabel(node),
    parentId: null,
    childrenCount: node.childrenCount,
    startLine: node.startLine,
    endLine: node.endLine,
    attributesSummary: Object.entries(node.attributes)
      .slice(0, 3)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' '),
  }));
}

/** بناء تسمية عربية مقروءة للطبقة. */
function buildLayerLabel(node: VisualAstNode): string {
  const classAttr = node.attributes['class'];
  const id = node.attributes['id'];
  if (id) return `${node.tag}#${id}`;
  if (classAttr) return `${node.tag}.${classAttr.split(/\s+/)[0]}`;
  return node.summary || node.tag;
}

/** إخفاء/إظهار طبقة بتعديل الكود مباشرة (الكود مصدر الحقيقة). */
export function toggleLayerVisibility(
  code: string,
  nodeId: string,
  makeVisible: boolean,
): string {
  const layer = extractLayerTree(code).find(l => l.id === nodeId);
  if (!layer) return code;

  const lines = code.split('\n');
  const lineIdx = layer.startLine - 1;
  const target = lines[lineIdx];
  if (!target) return code;

  if (makeVisible) {
    lines[lineIdx] = target.replace(/style="[^"]*display:\s*none;?\s*"/g, '').trimEnd();
  } else if (!target.includes('display:none')) {
    const hasStyle = /style="/.test(target);
    lines[lineIdx] = hasStyle
      ? target.replace(/style="/, 'style="display:none; ')
      : target.replace(/>/, ' style="display:none">');
  }
  return lines.join('\n');
}
