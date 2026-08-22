/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات التصدير والتنزيل والطباعة المشتركة - Export Utilities
 * 🏛️ الدور: مكون مشترك - downloadFile و printHtml
 * 📥 المستهلك: كل المحررات ومحركات التصدير
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Browser Download API: استخدام واجهة تنزيل المتصفح
 *    مع Blob و URL.createObjectURL
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. URL يجب أن تُحذف بعد الاستخدام (revokeObjectURL)
 *    2. MIME type يجب أن يكون صحيحاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - revokeObjectURL بعد التنزيل
 *    - fallback لـ text/plain
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * تنزيل كائن أو نص كملف إلى جهاز المستخدم
 */
export function downloadFile(content: string, fileName: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * تنزيل كائن JSON كملف منسق
 */
export function downloadJson(data: unknown, fileName: string) {
  downloadFile(JSON.stringify(data, null, 2), fileName, 'application/json');
}

/**
 * طباعة عنصر محدد أو المستند بأكمله
 */
export function triggerPrint() {
  window.print();
}
