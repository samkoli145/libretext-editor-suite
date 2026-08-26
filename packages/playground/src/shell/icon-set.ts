/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: icon-set.ts
 * 📂 المسار: packages/playground/src/shell/icon-set.ts
 * 🎯 الهدف الرئيسي: أيقونات رمزية صغيرة (16px) بنمط ليبرا أوفيس — SVG مضمنة
 * 📋 المعايير: صفر اعتماديات، ألوان النطاقات الأربعة، قابلة للتلوين عبر currentColor
 * 🧪 الاختبارات: tests/shell.test.ts
 * 🏷️ المعرف: PLAY-SHELL-ICONS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Inline Symbolic Icons — نصوص SVG خام في خريطة واحدة، حجم ثابت 16px،
 *    ألوان النطاقات: Writer أزرق، Calc أخضر، Impress برتقالي، Base بنفسجي
 *    (نمط ليبرا أوفيس القياسي للتمييز البصري بين التطبيقات)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأيقونة غير المعروفة ترجع دائرة محايدة — لا undefined في DOM.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - المستهلك: shell/playground-shell.ts, views/*
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** ألوان النطاقات الأربعة — نمط ليبرا أوفيس. */
export const DOMAIN_COLORS = {
  writer: '#2a6099',
  calc: '#1e7145',
  impress: '#c05a11',
  base: '#7b3fa0',
} as const;

const wrap = (body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">${body}</svg>`;

/** خريطة الأيقونات الرمزية. */
export const ICONS: Record<string, string> = {
  // ── المحررات الأربعة ──
  writer: wrap(
    `<rect x="3" y="1.5" width="10" height="13" rx="1.5" fill="#fff" stroke="${DOMAIN_COLORS.writer}" stroke-width="1.2"/>
     <path d="M5 4.5h6M5 6.5h6M5 8.5h4" stroke="${DOMAIN_COLORS.writer}" stroke-width="1.1" stroke-linecap="round"/>`,
  ),
  calc: wrap(
    `<rect x="2" y="2" width="12" height="12" rx="1.5" fill="#fff" stroke="${DOMAIN_COLORS.calc}" stroke-width="1.2"/>
     <path d="M2 6h12M6.5 2v12M2 10h12M10.5 6v6" stroke="${DOMAIN_COLORS.calc}" stroke-width="1"/>`,
  ),
  impress: wrap(
    `<rect x="1.5" y="3" width="13" height="9" rx="1" fill="#fff" stroke="${DOMAIN_COLORS.impress}" stroke-width="1.2"/>
     <path d="M8 12v2M5.5 14h5" stroke="${DOMAIN_COLORS.impress}" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M4 6l3 2-3 2z" fill="${DOMAIN_COLORS.impress}"/>`,
  ),
  base: wrap(
    `<ellipse cx="8" cy="3.5" rx="5.5" ry="2" fill="#fff" stroke="${DOMAIN_COLORS.base}" stroke-width="1.2"/>
     <path d="M2.5 3.5v9c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2v-9" fill="#fff" stroke="${DOMAIN_COLORS.base}" stroke-width="1.2"/>
     <path d="M2.5 8c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2" stroke="${DOMAIN_COLORS.base}" stroke-width="1"/>`,
  ),

  // ── أدوات مشتركة ──
  save: wrap(
    `<path d="M2.5 2.5h9L14 5v8.5a1 1 0 01-1 1H3a1 1 0 01-1-1v-10a1 1 0 011-1z" fill="#fff" stroke="#475569" stroke-width="1.2"/>
     <rect x="5" y="2.5" width="5" height="4" rx=".5" fill="#94a3b8"/><rect x="4.5" y="9" width="7" height="5" fill="#e2e8f0"/>`,
  ),
  undo: wrap(
    `<path d="M6 3L2.5 6.5 6 10V7.5c3.5 0 6 1.5 7 4.5.5-5-3-8-7-8V3z" fill="#475569"/>`,
  ),
  redo: wrap(
    `<path d="M10 3l3.5 3.5L10 10V7.5c-3.5 0-6 1.5-7 4.5-.5-5 3-8 7-8V3z" fill="#475569"/>`,
  ),
  bold: wrap(
    `<text x="8" y="12.5" text-anchor="middle" font-family="serif" font-weight="900" font-size="13" fill="#334155">B</text>`,
  ),
  italic: wrap(
    `<text x="8" y="12.5" text-anchor="middle" font-family="serif" font-style="italic" font-size="13" fill="#334155">I</text>`,
  ),
  underline: wrap(
    `<text x="8" y="11.5" text-anchor="middle" font-family="serif" font-size="12" fill="#334155">U</text>
     <path d="M4 13.5h8" stroke="#334155" stroke-width="1.4" stroke-linecap="round"/>`,
  ),
  'list-bullet': wrap(
    `<circle cx="3.5" cy="4" r="1.3" fill="#475569"/><circle cx="3.5" cy="8" r="1.3" fill="#475569"/><circle cx="3.5" cy="12" r="1.3" fill="#475569"/>
     <path d="M6.5 4h7M6.5 8h7M6.5 12h7" stroke="#64748b" stroke-width="1.3" stroke-linecap="round"/>`,
  ),
  table: wrap(
    `<rect x="2" y="2.5" width="12" height="11" rx="1" fill="#fff" stroke="#475569" stroke-width="1.2"/>
     <path d="M2 6h12M2 9.5h12M6 2.5v11M10 2.5v11" stroke="#64748b" stroke-width="1"/>`,
  ),
  image: wrap(
    `<rect x="2" y="3" width="12" height="10" rx="1" fill="#fff" stroke="#475569" stroke-width="1.2"/>
     <circle cx="5.5" cy="6.5" r="1.3" fill="#f59e0b"/>
     <path d="M3 12l3.5-4 2.5 2.5L11.5 8l2 4z" fill="#34d399"/>`,
  ),
  settings: wrap(
    `<circle cx="8" cy="8" r="2.2" fill="none" stroke="#475569" stroke-width="1.3"/>
     <path d="M8 1.8v2.4M8 11.8v2.4M1.8 8h2.4M11.8 8h2.4M3.6 3.6l1.7 1.7M10.7 10.7l1.7 1.7M12.4 3.6l-1.7 1.7M5.3 10.7l-1.7 1.7" stroke="#475569" stroke-width="1.3" stroke-linecap="round"/>`,
  ),
  pin: wrap(
    `<path d="M9.5 1.5l5 5-2 1-1.5 3.5-4-4L3 8.5l1.5-2 5-5z" fill="#475569"/>
     <path d="M6 10l-4 4" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/>`,
  ),
  eye: wrap(
    `<path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" fill="#fff" stroke="#475569" stroke-width="1.2"/>
     <circle cx="8" cy="8" r="2" fill="#2563eb"/>`,
  ),
  'eye-off': wrap(
    `<path d="M1.5 8S4 3.5 8 3.5c1.2 0 2.3.4 3.2 1M14.5 8S12 12.5 8 12.5c-1.2 0-2.3-.4-3.2-1" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
     <path d="M2 14L14 2" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round"/>`,
  ),
  play: wrap(`<path d="M4.5 2.5l9 5.5-9 5.5z" fill="#059669"/>`),
  layers: wrap(
    `<path d="M8 1.5l6.5 3.5L8 8.5 1.5 5z" fill="#818cf8"/>
     <path d="M1.5 8L8 11.5 14.5 8" fill="none" stroke="#6366f1" stroke-width="1.3"/>
     <path d="M1.5 11L8 14.5 14.5 11" fill="none" stroke="#a5b4fc" stroke-width="1.3"/>`,
  ),
};

/** جلب أيقونة بأمان — غير معروفة → دائرة محايدة. */
export function getIcon(name: string): string {
  return ICONS[name] ?? wrap(`<circle cx="8" cy="8" r="5" fill="#cbd5e1"/>`);
}

/** إنشاء عنصر أيقونة جاهز للإدراج. */
export function createIconElement(name: string, title?: string): HTMLElement {
  if (typeof document === 'undefined') {
    throw new Error('createIconElement requires DOM');
  }
  const span = document.createElement('span');
  span.className = 'lt-icon';
  span.innerHTML = getIcon(name);
  if (title) span.title = title;
  return span;
}
