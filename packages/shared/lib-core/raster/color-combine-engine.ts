/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك دمج الشفافية اللونية (Color Combine Engine) — تحويل {hex, alpha}
 *           إلى أقصر CSS صالح يحفظ الشفافية، بلا DOM وصفر اعتماديات.
 * 🏛️ الدور: نواة مشتركة معزولة - أساس لوحات الخصائص وتعبئة الأشكال والتدرجات.
 * 📥 المستهلك: WorkbenchPropertiesPanel, CanvasDesignerEditor, UIDesigner, svgPaint.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Shortest-CSS Alias Strategy:
 *    (1) شفافية كاملة (a ≥ 1) → إعادة HEX كما هي (صفر تكلفة تحويل).
 *    (2) شفافية جزئية → rgba() بثلاث خانات عشرية بعد التقريب (Math.round×1000).
 *    وهو النسق "أقصر تعبير يحفظ القيمة" المستخدم في لوحات الخصائص.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. HEX المدخل قد يكون قصيراً (#rgb) — يجب توسيعه قبل التفكيك.
 *    2. alpha خارج النطاق [0,1] يجب تقييده لا إسقاطه (تجنب rgba غير صالح).
 *    3. عدم الاعتماد على إملاء حالة الحروف — التطبيع إلى سفلي قبل التحليل.
 *    4. المفتاح المميز: عند a ≥ 1 يجب إرجاع الإدخال الأصلي حرفياً (لا #RRGGBB).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard لصحة HEX (باعتبار 3/6/8 خانات).
 *    - تقييد alpha داخل [0,1] وتقريب 3 خانات عشرية.
 *    - fallback آمن: أي HEX غير صالح → '#000000'.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** واجهة لون معممة: hex + شفافية. */
export interface ColorWithAlpha {
  hex: string;
  a: number;
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function clampAlpha(a: number): number {
  if (!Number.isFinite(a)) return 1;
  return Math.min(1, Math.max(0, a));
}

/** توسيع #rgb إلى #rrggbb (تطبيع سفلي). */
function expandHex(hex: string): string {
  const h = hex.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) {
    return (
      '#' +
      h
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
    );
  }
  return h;
}

/**
 * تحويل سلسلة HEX (أو rgba()) إلى {hex, alpha} بلا DOM.
 * يعالج #rgb/#rrggbb/#rrggbbaa/rgb()/rgba()/transparent.
 */
export function parseColorHex(v: string): ColorWithAlpha {
  if (!v || typeof v !== 'string') return { hex: '#000000', a: 0 };
  const s = v.trim();

  if (s === 'transparent' || s === 'none') return { hex: '#000000', a: 0 };

  const rgba = s.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba) {
    const parts = rgba[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((x) => parseFloat(x));
    const [r, g, b] = parts;
    const a = parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1;
    if ([r, g, b].every((n) => Number.isFinite(n))) {
      const hex =
        '#' +
        [r, g, b]
          .map((n) =>
            Math.round(Math.min(Math.max(n, 0), 255))
              .toString(16)
              .padStart(2, '0'),
          )
          .join('');
      return { hex, a: clampAlpha(a) };
    }
  }

  if (HEX_RE.test(s)) {
    const expanded = expandHex(s);
    if (expanded.length === 9) {
      return { hex: expanded.slice(0, 7), a: clampAlpha(parseInt(expanded.slice(7), 16) / 255) };
    }
    return { hex: expanded, a: 1 };
  }

  return { hex: '#1E2A3A', a: 1 };
}

/**
 * {hex, a} → أقصر CSS يحفظ الشفافية.
 * عند a ≥ 1 تُعاد السلسلة الأصلية حرفياً (بلا تحويل).
 */
export function combineColor(hex: string, a: number): string {
  const alpha = clampAlpha(a);
  if (alpha >= 1) return hex;
  const expanded = expandHex(hex);
  const match = expanded.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (!match) return hex;
  const [, r, g, b] = match;
  const rDec = parseInt(r, 16);
  const gDec = parseInt(g, 16);
  const bDec = parseInt(b, 16);
  return `rgba(${rDec}, ${gDec}, ${bDec}, ${Math.round(alpha * 1000) / 1000})`;
}

/** تقييد alpha إلى [0,1] مع تقريب 3 خانات عشرية (مشترك بين الأدوات). */
export function roundAlpha(a: number): number {
  return Math.round(clampAlpha(a) * 1000) / 1000;
}

/** تحويل {hex, a} إلى كائن {r,g,b,a} صالح — لعرض قيم لوحة الخصائص. */
export function colorWithAlphaToRgba(c: ColorWithAlpha): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const expanded = expandHex(c.hex);
  const match = expanded.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (!match) return { r: 0, g: 0, b: 0, a: clampAlpha(c.a) };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
    a: clampAlpha(c.a),
  };
}
