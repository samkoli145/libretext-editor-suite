/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: vite.config.ts
 * 📂 المسار: packages/playground/vite.config.ts
 * 🎯 الهدف الرئيسي: خادم تطوير الملعب — alias الحزم إلى مصادرها مباشرة
 * 🏷️ المعرف: PLAY-VITE-001
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { defineConfig } from 'vite';
import path from 'path';

const r = (p: string): string => path.resolve(__dirname, p);

export default defineConfig({
  resolve: {
    alias: {
      '@libretext/core': r('../core/src'),
      '@libretext/algorithms': r('../algorithms/src'),
      '@libretext/templates': r('../templates/src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
