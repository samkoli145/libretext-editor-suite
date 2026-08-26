/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/index.ts
 * 🎯 الهدف الرئيسي: تصدير نظام القوالب (Barrel Export)
 * 🏷️ المعرف: TPL-006
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { templateRegistry } from './registry';
import { getWriterTemplates } from './writer';
import { calcTemplates } from './calc';
import { impressTemplates } from './impress';
import { baseTemplates } from './base';

// تسجيل القوالب الافتراضية
[...getWriterTemplates(), ...calcTemplates, ...impressTemplates, ...baseTemplates].forEach((t) => {
  templateRegistry.register(t);
});

export * from './registry';
export * from './writer';
export * from './calc';
export * from './impress';
export * from './base';
export * from './code-stamps/code-stamps';
export * from './layout-stamps/layout-stamps';
