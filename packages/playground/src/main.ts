/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: main.ts
 * 📂 المسار: packages/playground/src/main.ts
 * 🎯 الهدف الرئيسي: نقطة دخول صفحة التجربة الحية — تركيب الملعب في #app
 * 🏷️ المعرف: PLAY-MAIN-001
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { mountPlayground } from './playground-app';

const container = document.getElementById('app');
if (!container) {
  document.body.innerHTML = '<p style="color:#ef4444;padding:24px">لم يُعثر على #app</p>';
} else {
  const app = mountPlayground(container);

  // شريط تشخيصي صغير في الكونسول للمطورين
  // eslint-disable-next-line no-console
  console.log(
    '%c🧪 ملعب LibreText جاهز',
    'background:#2563eb;color:#fff;padding:4px 12px;border-radius:6px;font-size:13px',
  );
  (window as unknown as Record<string, unknown>).__playground = app;
}
