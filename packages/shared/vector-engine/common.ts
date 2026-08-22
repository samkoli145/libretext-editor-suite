/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات ومساعدات هندسية ورياضية موحدة - Vector Engine Common Utilities
 * 🏛️ الدور: أدوات مشتركة - دوال حساب المسافات والزوايا والتحويلات
 * 📥 المستهلك: كل ملفات shared/vector-engine والمكونات الفيكتورية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Geometry: دوال هندسية بدون أي مكتبات خارجية
 *    باستخدام Web APIs الحديثة فقط (crypto, Math, structuredClone)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ممنوع lodash أو uuid أو أي مكتبة خارجية
 *    2. debounce/throttle يجب أن يكون متوافقاً مع Disposable
 *    3. deepClone يجب أن يستخدم structuredClone
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص NaN بعد الحسابات الهندسية
 *    - fallback لـ 0 عند القسمة على صفر
 *    - تعامل مع الأبعاد الفارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerX: number;
  centerY: number;
}

export interface VectorMatrix2D {
  a: number; // Scale X
  b: number; // Shear Y
  c: number; // Shear X
  d: number; // Scale Y
  tx: number; // Translate X
  ty: number; // Translate Y
}

/**
 * توليد معرف فريد عشوائي بدون مكتبات خارجية
 */
export function generateId(prefix: string = 'vec'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().substring(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * تقييد قيمة رقمية ضمن مجال محدد
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * تحويل الدرجات إلى راديان
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * تحويل الراديان إلى درجات
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * تسوية الزاوية ضمن المجال [0, 2PI)
 */
export function normalizeAngle(radians: number): number {
  const twoPi = Math.PI * 2;
  return ((radians % twoPi) + twoPi) % twoPi;
}

/**
 * حساب المسافة الإقليدية بين نقطتين
 */
export function distance(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * حساب الزاوية بالراديان من p1 إلى p2
 */
export function angle(p1: Point2D, p2: Point2D): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * استيفاء خطي (Linear Interpolation)
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * استيفاء خطي بين نقطتين
 */
export function lerpPoint(p1: Point2D, p2: Point2D, t: number): Point2D {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  };
}

/**
 * تدوير نقطة حول مركز بزاوية معينة
 */
export function rotatePoint(p: Point2D, center: Point2D, angleRad: number): Point2D {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos),
  };
}

/**
 * حساب الصندوق المحيط بمجموعة نقاط
 */
export function getBounds(points: Point2D[]): BoundingBox {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0, centerX: 0, centerY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    x: minX,
    y: minY,
    width,
    height,
    minX,
    minY,
    maxX,
    maxY,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

/**
 * فحص ما إذا كانت نقطة داخل صندوق محيط
 */
export function isPointInBox(p: Point2D, box: BoundingBox, tolerance: number = 0): boolean {
  return (
    p.x >= box.minX - tolerance &&
    p.x <= box.maxX + tolerance &&
    p.y >= box.minY - tolerance &&
    p.y <= box.maxY + tolerance
  );
}

/**
 * فحص تقاطع صندوقين محيطين
 */
export function rectsIntersect(r1: BoundingBox, r2: BoundingBox): boolean {
  return !(r2.minX > r1.maxX || r2.maxX < r1.minX || r2.minY > r1.maxY || r2.maxY < r1.minY);
}

/**
 * استنساخ عميق للكائنات والمصفوفات بدون أي مكتبة خارجية
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj);
    } catch {
      // Fallback for non-serializable objects
    }
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * كابح التردد (Debounce) لمنع تكرار الأحداث المتسارعة
 */
export function debounce<F extends (...args: any[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<F>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * مقنن التردد (Throttle) لتقنين معالجة حركات الفأرة
 */
export function throttle<F extends (...args: any[]) => void>(func: F, limit: number): (...args: Parameters<F>) => void {
  let inThrottle = false;
  return function (...args: Parameters<F>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
