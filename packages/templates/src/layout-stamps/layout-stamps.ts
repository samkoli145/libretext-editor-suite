/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: layout-stamps.ts
 * 📂 المسار: packages/templates/src/layout-stamps/layout-stamps.ts
 * 🎯 الهدف الرئيسي: اسطمبات تخطيط واجهات مقسّمة لمناطق (قوائم/عمل/طبقات/خصائص)
 * 📋 المعايير: CSS Grid Areas، كل ختم يعرّف مناطقه وأحجامها وربطها بمحرر الكود
 * 🧪 الاختبارات: packages/core/tests/blocks/layers-and-layouts.test.ts
 * 🏷️ المعرف: TPL-LAYOUT-STAMPS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zone-Based Layout Contracts — كل تخطيط عقد بيانات: مناطق مسماة بأحجام
 *    قابلة للرسو (نمط DockablePanelContainer من webpainter-nextx5.02)، ومنطقة
 *    canvas تحمل editorId لربط محرر الكود/الكانفاس بها.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. gridTemplateAreas يجب أن يتطابق مع أسماء zones وإلا انهيار التخطيط.
 *    2. أحجام النسب المئوية يجب أن مجموعها ≤ 100% لكل اتجاه.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - validateLayoutStamp: فحص تطابق المناطق مع الشبكة (#L150).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/templates/src/index.ts
 *    - 📚 مرجع النمط: webpainter-nextx5.02 DockablePanelContainer (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - LAYOUT_STAMPS: كتالوج التخطيطات (#L86)
 *    - validateLayoutStamp: فحص سلامة العقد (#L150)
 *    - layoutToCssGrid: توليد CSS Grid من التعريف (#L170)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-nextx5.02 DockablePanelContainer (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** المناطق القياسية القابلة للرسو. */
export type LayoutZone =
  | 'menubar'
  | 'toolbar'
  | 'canvas'
  | 'layers'
  | 'properties'
  | 'statusbar';

/** منطقة واحدة في عقد التخطيط. */
export interface LayoutZoneSpec {
  readonly zone: LayoutZone;
  /** عرض/ارتفاع المنطقة — px أو %. */
  readonly size: string;
  readonly collapsible: boolean;
  /** هل تستضيف هذه المنطقة محرر كود؟ (للربط الآلي) */
  readonly hostsEditor?: boolean;
}

/** عقد تخطيط كامل. */
export interface LayoutStamp {
  readonly id: string;
  readonly nameAr: string;
  readonly descriptionAr: string;
  /** صفوف الشبكة بنفس ترتيب grid-template-rows. */
  readonly rows: readonly string[];
  /** أعمدة الشبكة بنفس ترتيب grid-template-columns. */
  readonly columns: readonly string[];
  /** خريطة المناطق — كل سلسلة صف مثل "menubar menubar menubar". */
  readonly areas: readonly string[];
  readonly zones: readonly LayoutZoneSpec[];
}

const DESIGNER_ZONES: readonly LayoutZoneSpec[] = [
  { zone: 'menubar', size: '40px', collapsible: false },
  { zone: 'toolbar', size: '48px', collapsible: true },
  { zone: 'canvas', size: '1fr', collapsible: false, hostsEditor: true },
  { zone: 'layers', size: '260px', collapsible: true },
  { zone: 'properties', size: '240px', collapsible: true },
  { zone: 'statusbar', size: '28px', collapsible: false },
];

/** كتالوج اسطمبات التخطيط الجاهزة. */
export const LAYOUT_STAMPS: readonly LayoutStamp[] = [
  {
    id: 'layout-design-tool',
    nameAr: 'أداة تصميم كاملة',
    descriptionAr: 'قوائم + شريط أدوات + كانفاس + طبقات + خصائص + شريط حالة',
    rows: ['40px', '48px', '1fr', '28px'],
    columns: ['1fr', '260px', '240px'],
    areas: ['menubar menubar menubar', 'toolbar toolbar toolbar', 'canvas layers properties', 'statusbar statusbar statusbar'],
    zones: DESIGNER_ZONES,
  },
  {
    id: 'layout-code-focus',
    nameAr: 'تركيز برمجي',
    descriptionAr: 'محرر كود واسع مع شجرة طبقات يسار وشريط حالة',
    rows: ['40px', '1fr', '28px'],
    columns: ['220px', '1fr'],
    areas: ['menubar menubar', 'layers canvas', 'statusbar statusbar'],
    zones: [
      { zone: 'menubar', size: '40px', collapsible: false },
      { zone: 'layers', size: '220px', collapsible: true },
      { zone: 'canvas', size: '1fr', collapsible: false, hostsEditor: true },
      { zone: 'statusbar', size: '28px', collapsible: false },
    ],
  },
  {
    id: 'layout-split-live',
    nameAr: 'انقسام حي',
    descriptionAr: 'كود يمين ومعاينة حية يسار — للتعلم التفاعلي',
    rows: ['40px', '1fr', '28px'],
    columns: ['1fr', '1fr'],
    areas: ['menubar menubar', 'canvas layers', 'statusbar statusbar'],
    zones: [
      { zone: 'menubar', size: '40px', collapsible: false },
      { zone: 'canvas', size: '1fr', collapsible: false, hostsEditor: true },
      { zone: 'layers', size: '1fr', collapsible: false },
      { zone: 'statusbar', size: '28px', collapsible: false },
    ],
  },
];

/** فحص سلامة عقد التخطيط — المناطق في areas تغطي كل zones. */
export function validateLayoutStamp(stamp: LayoutStamp): {
  valid: boolean;
  error?: string;
} {
  const declared = new Set(stamp.zones.map(z => z.zone));
  const used = new Set<string>();

  for (const row of stamp.areas) {
    for (const name of row.trim().split(/\s+/)) {
      if (!declared.has(name as LayoutZone)) {
        return { valid: false, error: `Area "${name}" has no zone spec` };
      }
      used.add(name);
    }
  }

  for (const zone of declared) {
    if (!used.has(zone)) return { valid: false, error: `Zone "${zone}" unused in areas` };
  }
  return { valid: true };
}

/** توليد CSS Grid كامل من عقد التخطيط. */
export function layoutToCssGrid(stamp: LayoutStamp): string {
  return [
    `display: grid;`,
    `grid-template-rows: ${stamp.rows.join(' ')};`,
    `grid-template-columns: ${stamp.columns.join(' ')};`,
    `grid-template-areas: ${stamp.areas.map(a => `"${a}"`).join(' ')};`,
    `height: 100%; width: 100%;`,
  ].join('\n');
}
