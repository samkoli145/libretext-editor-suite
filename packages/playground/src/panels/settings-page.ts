/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: settings-page.ts
 * 📂 المسار: packages/playground/src/panels/settings-page.ts
 * 🎯 الهدف الرئيسي: صفحة إعدادات الخلفية والثيمات (6 Daylight + طيف مولد)
 * 📋 المعايير: منطق نقي قابل للاختبار + عرض DOM اختياري
 * 🧪 الاختبارات: tests/shell.test.ts
 * 🏷️ المعرف: PLAY-PANELS-SETTINGS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Theme Gallery Model — قائمة ثيمات مركبة: الثيمات الست الرسمية +
 *    عينات من الطيف المولد، وكل عنصر يحمل مفتاحاً وألوان معاينة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: @libretext/core (DEFAULT_THEMES, createThemeFromColor)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { DEFAULT_THEMES, THEME_KEYS, createThemeFromColor } from '@libretext/core';

/** بطاقة ثيم في المعرض. */
export interface ThemeCard {
  readonly key: string;
  readonly nameAr: string;
  readonly backgroundColor: string;
  readonly primaryColor: string;
  readonly textColor: string;
  readonly generated: boolean;
}

/** بناء معرض الثيمات: 6 رسمية + 8 مولدة من الطيف. */
export function buildThemeGallery(): ThemeCard[] {
  const official: ThemeCard[] = THEME_KEYS.map(key => {
    const t = DEFAULT_THEMES[key]!;
    return {
      key,
      nameAr: t.nameAr,
      backgroundColor: t.backgroundColor,
      primaryColor: t.primaryColor,
      textColor: t.textColor,
      generated: false,
    };
  });

  const spectrumBases = ['#e11d48', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777'];
  const generated: ThemeCard[] = spectrumBases.map(base => {
    const t = createThemeFromColor(base);
    return {
      key: `gen-${base.slice(1)}`,
      nameAr: t.nameAr,
      backgroundColor: t.backgroundColor,
      primaryColor: t.primaryColor,
      textColor: t.textColor,
      generated: true,
    };
  });

  return [...official, ...generated];
}

/** خيارات خلفية منطقة العمل — تدرجات فاتحة فقط. */
export const CANVAS_BACKGROUNDS: ReadonlyArray<{ key: string; labelAr: string; css: string }> = [
  { key: 'none', labelAr: 'افتراضي (من الثيم)', css: '' },
  { key: 'pure-cloud', labelAr: 'سحاب ناصع', css: 'linear-gradient(180deg,#ffffff,#f8fafc)' },
  { key: 'morning-glow', labelAr: 'وهج الصباح', css: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
  { key: 'serene-breeze', labelAr: 'نسيم أزرق', css: 'linear-gradient(120deg,#f0f9ff,#e0f2fe)' },
  { key: 'mint-meadow', labelAr: 'نعناع وريحان', css: 'linear-gradient(160deg,#ecfdf5,#f0fdf4)' },
  { key: 'soft-lilac', labelAr: 'ليلكي هادئ', css: 'linear-gradient(135deg,#faf5ff,#f3e8ff)' },
];
