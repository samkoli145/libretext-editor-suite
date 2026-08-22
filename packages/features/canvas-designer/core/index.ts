/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نقطة دخول موحدة لنواة رسام ومحرر SVG - SVG Core Barrel Export
 * 🏛️ الدور: Barrel Export - يُصدّر كل وحدات الحسابات والتحويلات والتطهير والتحديد
 * 📥 المستهلك: CanvasDesignerEditor, مكونات المحرر
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Library SVG Core: نواة متجهة متكاملة بدون مكتبات خارجية
 *    مع عزل تام للوحدات وقابليتها لإعادة الاستخدام
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب circular imports
 *    2. كل وحدة يجب أن تكون مستقلة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام explicit exports
 *    - تحديث هذا الملف عند إضافة وحدة جديدة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export * from './svgNamespaces';
export * from './svgMath';
export * from './svgUnits';
export * from './svgSanitizer';
export * from './svgSelection';
export * from './svgElementOperations';
export * from './svgHistory';
export * from './svgPathUtils';
export * from './svgPaint';
export * from './svgExporter';
export * from './svgPathEditor';
export * from './svgGuides';
export * from './svgClipping';
export * from './svgAnimation';
export * from './interactionEngine';
