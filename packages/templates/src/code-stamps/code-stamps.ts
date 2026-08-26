/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-stamps.ts
 * 📂 المسار: packages/templates/src/code-stamps/code-stamps.ts
 * 🎯 الهدف الرئيسي: مكتبة اسطمبات كود جاهزة (HTML/TSX/Electron) للملعب التجريبي
 * 📋 المعايير: نطاق 'code' في TemplateRegistry، كل ختم بمعرف فريد ومحتوى كامل
 * 🧪 الاختبارات: packages/templates/tests/code-stamps.test.ts
 * 🏷️ المعرف: TPL-CODE-STAMPS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Data-Driven Stamp Catalog — الأختام بيانات نقية (content = source string)
 *    تُسجَّل في السجل الرسمي فتورث البحث والتصفية والأحداث مجاناً.
 *    بنية Electron مستوحاة من CodeEngineer/src/electron (MIT).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المحتوى نصوص خام داخل template literals — احذر backticks متداخلة.
 *    2. أختام TSX تعمل مع مترجم __jsx shim لا React الحقيقي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - registerCodeStamps() تتحقق من التكرار وتتجاهله بأمان.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/templates/src/index.ts
 *    - 📦 التبعيات: ../registry.ts, ../registry-types.ts
 *    - 🧪 اختبارات: packages/templates/tests/code-stamps.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - CODE_STAMPS: كتالوج الأختام الثابت (#L60)
 *    - registerCodeStamps: تسجيل النطاق والأختام (#L210)
 *    - getStampsByLang: تصفية باللغة (#L228)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: CodeEngineer electron structure (MIT), Bento Slides aesthetics
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { TemplateRegistry } from '../registry';
import type { Template } from '../registry-types';

/** ختم كود — قالب محتواه مصدر برمجي خام. */
export interface CodeStamp extends Template<string> {
  readonly domain: 'code';
  readonly category: 'html' | 'tsx' | 'electron' | 'typescript';
  /** لغة المصدر — تُمرر لمحرر الكود عند الفتح. */
  readonly language: string;
}

const HTML_LANDING = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><title>صفحة هبوط</title>
<style>
  body{font-family:system-ui;margin:0;background:#f8fafc;color:#0f172a}
  .hero{text-align:center;padding:80px 20px;background:linear-gradient(135deg,#eff6ff,#fff)}
  .btn{background:#3b82f6;color:#fff;border:none;padding:12px 32px;border-radius:10px;font-size:16px;cursor:pointer}
</style></head>
<body>
  <section class="hero">
    <h1>منتجك القادم يبدأ هنا</h1>
    <p>صفحة هبوط عربية نظيفة وجاهزة للتخصيص</p>
    <button class="btn" onclick="alert('مرحباً!')">ابدأ الآن</button>
  </section>
</body></html>`;

const HTML_DASHBOARD = [
  '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px;background:#f1f5f9;min-height:200px">',
  ...[
    ['المبيعات', '12.4K', '#059669'],
    ['المستخدمون', '842', '#2563eb'],
    ['الطلبات', '317', '#d97706'],
  ].map(
    ([label, value, color]) =>
      '<div style="background:#fff;border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.06)">' +
      '<div style="color:#64748b;font-size:13px">' + label + '</div>' +
      '<div style="font-size:28px;font-weight:700;color:' + color + '">' + value + '</div>' +
      '</div>',
  ),
  '</div>',
].join('\n');

const TSX_COMPONENT = `interface CardProps {
  title: string;
  count: number;
  accent?: string;
}

/** بطاقة إحصائية — مكوّن TSX يعمل مع jsx shim المدمج. */
function StatCard({ title, count, accent = '#2563eb' }: CardProps) {
  return (
    <div style={{ padding: 20, borderRadius: 14, background: '#fff' }}>
      <h3 style={{ color: '#64748b', fontSize: 13 }}>{title}</h3>
      <strong style={{ color: accent, fontSize: 26 }}>{count}</strong>
    </div>
  );
}

console.log(StatCard({ title: 'المستخدمون', count: 842 }));`;

const ELECTRON_MAIN = `// العملية الرئيسية — بنية مستوحاة من CodeEngineer/src/electron (MIT)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile('renderer/index.html');
}

ipcMain.handle('app:version', () => app.getVersion());
app.whenReady().then(createWindow);`;

const ELECTRON_PRELOAD = `// جسر آمن بين العمليتين — contextIsolation مفعّل
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('native', {
  version: () => ipcRenderer.invoke('app:version'),
});`;

/** كتالوج الأختام الجاهزة. */
export const CODE_STAMPS: readonly CodeStamp[] = [
  {
    id: 'code-html-landing',
    name: 'صفحة هبوط عربية',
    domain: 'code',
    category: 'html',
    description: 'صفحة هبوط RTL كاملة بخط نظام وتدرج فاتح',
    language: 'html',
    content: HTML_LANDING,
  },
  {
    id: 'code-html-dashboard',
    name: 'لوحة مؤشرات',
    domain: 'code',
    category: 'html',
    description: 'شبكة بطاقات إحصائية ثلاثية بظلال ناعمة',
    language: 'html',
    content: HTML_DASHBOARD,
  },
  {
    id: 'code-tsx-stat-card',
    name: 'مكوّن TSX: بطاقة إحصائية',
    domain: 'code',
    category: 'tsx',
    description: 'مكوّن TypeScript تفاعلي مع props مطبوعة',
    language: 'tsx',
    content: TSX_COMPONENT,
  },
  {
    id: 'code-electron-main',
    name: 'Electron: العملية الرئيسية',
    domain: 'code',
    category: 'electron',
    description: 'نافذة رئيسية آمنة مع IPC handler',
    language: 'javascript',
    content: ELECTRON_MAIN,
  },
  {
    id: 'code-electron-preload',
    name: 'Electron: جسر Preload',
    domain: 'code',
    category: 'electron',
    description: 'contextBridge آمن مع contextIsolation',
    language: 'javascript',
    content: ELECTRON_PRELOAD,
  },
];

/** تسجيل نطاق code وأختامه في السجل — يتجاهل المكرر بأمان. */
export function registerCodeStamps(registry: TemplateRegistry<string>): number {
  if (!registry.hasDomain('code')) registry.registerDomain('code');

  let registered = 0;
  for (const stamp of CODE_STAMPS) {
    if (registry.get(stamp.id) !== null) continue;
    registry.register(stamp);
    registered++;
  }
  return registered;
}

/** تصفية الأختام باللغة/الفئة. */
export function getStampsByLang(lang: CodeStamp['category']): CodeStamp[] {
  return CODE_STAMPS.filter(s => s.category === lang);
}
