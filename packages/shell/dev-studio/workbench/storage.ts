// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [storage.ts] دوال التخزين المحلي الآمنة المعزولة
 *
 * يوفر وصولاً آمناً إلى localStorage يعمل في بيئة المتصفح وبيئة الاختبار في Node.js.
 *
 * المبدأ:
 * "A STEP IS DOCUMENT DATA; THE READER'S POSITION IS NOT."
 * حالة الواجهة (View State) تُحفظ بأمان في التخزين المحلي دون التأثير على المستند.
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

const memoryStore: Record<string, string> = {};

/** قراءة JSON آمنة من localStorage أو الذاكرة البديلة */
export function lsJson<T>(key: string, fallback: T): T {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : memoryStore[key];
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** حفظ نصي آمن في localStorage أو الذاكرة البديلة */
export function lsSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  } catch {
    memoryStore[key] = value;
  }
}
