/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: src/blocks/index.ts
 * 🎯 الهدف الرئيسي: تصدير حزمة البلوكات الـ 12 المعتمدة وسجل الكتل المركزي
 * 📋 المعايير: تصدير نقي لجميع الأنواع ومصانع الكتل بدون اعتماديات خارجية
 * 🧪 الاختبارات: فحص تكامل الوحدات البرمجية
 * 🏷️ المعرف: BLK-BARREL-INDEX
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Barrel Export Architecture + Strict Re-Exports
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب التصدير المكرر للأسماء المشتركة.
 *    2. ضمان توافق الاستيراد مع مسارات @/blocks.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Named exports حصراً وتجنب export default.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/blocks/*.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - إعادة تصدير كافة المصانع والأنواع لـ 12 كتلة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

export * from './paragraph-block';
export * from './heading-block';
export * from './table-block';
export * from './image-block';
export * from './list-block';
export * from './code-block';
export * from './horizontal-rule-block';
export * from './blockquote-block';
export * from './cell-block';
export * from './shape-block';
export * from './slide-block';
export * from './database-record-block';
export * from './embed-block';
export * from './pdf-block';
export * from './color-picker-block';
export * from './icon-picker-block';
export * from './bg-color-block';
export * from './bg-image-block';
export * from './gradient-block';
export * from './font-picker-block';
export * from './text-styler-block';
export * from './template-card-block';
export * from './template-gallery-block';
export * from './block-registry';
