/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: محرك إعادة توجيه الموصلات التلقائي (Automatic Connector Rerouting Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) تعيد حساب نقطتَي نهاية كل موصِّل مرسى
 *           (Anchored Connector) كلما تحركت العناصر، فتحذف المراسي الميتة
 *           وتثبّت النقاط على الجانب الصريح أو أقرب حد (Auto Border Pin).
 * 📥 المستهلك: CanvasDesignerEditor, UIDesignerEditor, ElementRenderer (Re-render loop)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Derived Re-Route (Collaboration-Safe Derivation):
 *    إعادة التوجيه مشتقة لا ملتزمة — كل نسخة تحسب نفس النقطتين من صناديق
 *    العناصر الحالية، فيُمنع التخلف (Drift) بين المتعاونين ولا يلوث السجل
 *    إلا عند تغير فعلي يتجاوز 0.5px. النهاية `side` الصريحة تُثبَّت على منتصف
 *    الجانب (`sideMidpoint`)؛ وإلا فالشعاع من مركز الصندوق المعاكس يحدد أقرب
 *    نقطة حد (`borderPoint`).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المرسى الميت (عنصر محذوف) يجب إسقاطه فوراً وإلا بقي الموصل معلقاً في الفراغ.
 *    2. عند تحرير النهاية يدوياً بالفأرة يجب فصل مرساها (Detach) — لا إعادة توجيه
 *       بعد الآن — وإلا ستقاوم إعادة التوجيه سحب المستخدم.
 *    3. تغيير صندوق العنصر المرجعي فقط هو ما يستدعي إعادة الحساب (اقتران بالحركة).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards: `isConnectorShape` يتأكد من النوع/الشكل قبل المعالجة
 *    - حماية من صناديق معدومة العرض/الارتفاع (تقسيم على صفر)
 *    - عدم تكرار: يعتمد على `line-connector-geometry` لقياس هندسة الخط
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/editor/editor.ts (syncConnectors) و lineedit.ts
 * (The Bento authors, MIT). نُقل منطق إعادة التوجيه إلى نواة مشتركة قابلة
 * للاستخدام في كل المحررات.
 */

import {
  type Box,
  borderPoint,
  boxCenter,
  lineEndpoints,
  setLineEndpoints,
  sideMidpoint,
} from './line-connector-geometry';
import type { Pt } from './bezier-curves';

export type ConnectorSide = 'auto' | 'top' | 'right' | 'bottom' | 'left';

/** حارس نوع: هل القيمة جانب موصل صالح فعلاً؟ (يحمي الحدود من بيانات عشوائية) */
export function isValidConnectorSide(side: unknown): side is ConnectorSide {
  return (
    side === 'auto' || side === 'top' || side === 'right' || side === 'bottom' || side === 'left'
  );
}

export interface ConnectorAnchorRef {
  el: string;
  side?: string | ConnectorSide;
}

/** شكل قابل للربط: خط/موصِّل يحمل مرسى from/to. */
export interface ConnectorShapeLike {
  id: string;
  type: string;
  shape?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  from?: ConnectorAnchorRef | null;
  to?: ConnectorAnchorRef | null;
}

export interface ConnectorRerouteResult {
  id: string;
  changed: boolean;
  deadAnchors: Array<'from' | 'to'>;
  fromPoint?: Pt;
  toPoint?: Pt;
}

export interface ConnectorRerouteSummary {
  results: ConnectorRerouteResult[];
  changedCount: number;
}

const MOVE_EPSILON = 0.5;

/** حارس نوع: هل هذا عنصر موصل فعلي (شكل line) يحمل مراسي؟ */
export function isConnectorShape(el: unknown): el is ConnectorShapeLike {
  if (!el || typeof el !== 'object') return false;
  const c = el as ConnectorShapeLike;
  return c.type === 'shape' && c.shape === 'line' && Boolean(c.from || c.to);
}

/**
 * حساب نقطة المرسى من صندوق العنصر المرجعي: الجانب الصريح → منتصفه؛
 * وإلا فشعاع من مركز الصندوق نحو `toward` يعطي أقرب نقطة حد.
 * أي قيمة جانبية غير معروفة تُعامل كـ auto بأمان.
 */
export function computeAnchorPoint(box: Box, side: string | undefined, toward: Pt): Pt {
  if (side && isValidConnectorSide(side) && side !== 'auto') return sideMidpoint(box, side);
  return borderPoint(box, toward);
}

/**
 * إعادة توجيه موصل واحد: تنظيف المراسي الميتة ثم تثبيت النقطتين على مرسيهما
 * مع إعادة كتابة نهايتي الخط عند تغير يتجاوز 0.5px.
 * يعدّل `element` في مكانه (In-Place) ويعيد وصف النتيجة.
 */
export function rerouteConnector(
  element: ConnectorShapeLike,
  byId: Map<string, Box>,
): ConnectorRerouteResult {
  const deadAnchors: Array<'from' | 'to'> = [];

  if (element.from && !byId.has(element.from.el)) {
    delete element.from;
    deadAnchors.push('from');
  }
  if (element.to && !byId.has(element.to.el)) {
    delete element.to;
    deadAnchors.push('to');
  }
  if (!element.from && !element.to) {
    return { id: element.id, changed: false, deadAnchors };
  }

  const [a, b] = lineEndpoints(element);
  const fromBox = element.from ? (byId.get(element.from.el) ?? null) : null;
  const toBox = element.to ? (byId.get(element.to.el) ?? null) : null;

  const na = fromBox
    ? computeAnchorPoint(fromBox, element.from?.side, toBox ? boxCenter(toBox) : b)
    : a;
  const nb = toBox
    ? computeAnchorPoint(toBox, element.to?.side, fromBox ? boxCenter(fromBox) : a)
    : b;

  const changed =
    Math.hypot(na.x - a.x, na.y - a.y) > MOVE_EPSILON ||
    Math.hypot(nb.x - b.x, nb.y - b.y) > MOVE_EPSILON;

  if (changed) {
    setLineEndpoints(element, na, nb);
  }

  return { id: element.id, changed, deadAnchors, fromPoint: na, toPoint: nb };
}

/**
 * إعادة توجيه كل الموصلات في مجموعة عناصر: يبني فهرس الصناديق ثم يمرّ على
 * الموصلات المتبقية فقط ويجمع النتائج وعدد التغييرات — مشتقة وبدون تحقق DOM.
 */
export function rerouteAllConnectors(elements: ConnectorShapeLike[]): ConnectorRerouteSummary {
  const byId = new Map<string, Box>(elements.map((e) => [e.id, e]));
  const results: ConnectorRerouteResult[] = [];
  let changedCount = 0;

  for (const el of elements) {
    if (!isConnectorShape(el)) continue;
    const result = rerouteConnector(el, byId);
    results.push(result);
    if (result.changed) changedCount++;
  }

  return { results, changedCount };
}

/**
 * فصل مرسى نهاية الموصل عند سحبها يدوياً بالفأرة — تُحذف المرساة فيصبح
 * الطرف حراً ولن تخضع إعادة توجيه المستقبل (Detach on Manual Drag).
 */
export function detachConnectorAnchor(element: ConnectorShapeLike, end: 'from' | 'to'): boolean {
  if (end === 'from' && element.from) {
    delete element.from;
    return true;
  }
  if (end === 'to' && element.to) {
    delete element.to;
    return true;
  }
  return false;
}
