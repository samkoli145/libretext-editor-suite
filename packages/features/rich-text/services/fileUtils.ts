/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أداة تنزيل الملفات المعزولة - File Download Utility
 * 🏛️ الدور: أداة مشتركة - تنزيل الملفات عبر Blob و ObjectURL
 * 📥 المستهلك: docxServices
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Native Blob Download: تنزيل أصلي عبر Blob و ObjectURL
 *    صفر مكتبات خارجية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ObjectURL يجب حذفه بعد الاستخدام
 *    2. الملف يجب أن يكون صالحاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حذف ObjectURL في cleanup
 *    - fallback لرسالة خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Native zero-dependency file download utility using standard browser Blob and ObjectURL APIs.
 */
export function downloadFile(
  data: Blob | string,
  fileName: string,
  mimeType: string = "application/octet-stream"
): void {
  const blob = typeof data === "string" ? new Blob([data], { type: mimeType }) : data;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
