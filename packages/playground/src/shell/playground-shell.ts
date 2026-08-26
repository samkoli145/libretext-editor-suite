/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: playground-shell.ts
 * 📂 المسار: packages/playground/src/shell/playground-shell.ts
 * 🎯 الهدف الرئيسي: قشرة الملعب — آلة حالة للتنقل بين المحررات وإدارة اللوحات
 * 📋 المعايير: 4 محررات، لوحات (إظهار/إخفاء/تثبيت)، ثيم نشط، أوامر موجهة للمحرر
 * 🧪 الاختبارات: tests/shell.test.ts
 * 🏷️ المعرف: PLAY-SHELL-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Headless Shell State Machine — كل منطق القشرة نقي وقابل للاختبار بلا DOM:
 *    تبويبات المحررات (نمط ONLYOFFICE المفاهيمي فقط)، حالات اللوحات الثلاث
 *    (visible/hidden/pinned)، وتوجيه الأوامر للمحرر النشط عبر معالجات مسجلة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إخفاء لوحة مثبتة يفك التثبيت أولاً (لا pinned+hidden معاً).
 *    2. الأوامر لمحرك غير مسجل تسقط بأمان ولا ترمي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - المستهلك: index.ts, views/*
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** النطاقات المكتبية الأربعة = المحررات. */
export type OfficeDomain = 'writer' | 'calc' | 'impress' | 'base';

export const ALL_DOMAINS: readonly OfficeDomain[] = ['writer', 'calc', 'impress', 'base'];

/** حالة لوحة جانبية. */
export interface PanelState {
  readonly visible: boolean;
  readonly pinned: boolean;
}

/** حالة القشرة الكاملة — نقية وقابلة للتسلسل. */
export interface ShellState {
  readonly activeDomain: OfficeDomain;
  readonly panels: Readonly<Record<'layers' | 'properties', PanelState>>;
  readonly settingsOpen: boolean;
  /** مفتاح الثيم النشط (Daylight أو مولد). */
  readonly themeKey: string;
  /** لون خلفية منطقة العمل (فارغ = من الثيم). */
  readonly canvasBackground: string;
}

/** الحالة الابتدائية — Writer نشط واللوحات ظاهرة ومثبتة. */
export function createInitialShellState(): ShellState {
  return {
    activeDomain: 'writer',
    panels: {
      layers: { visible: true, pinned: true },
      properties: { visible: true, pinned: true },
    },
    settingsOpen: false,
    themeKey: 'crisp-white',
    canvasBackground: '',
  };
}

/** تبديل المحرر النشط. */
export function switchDomain(state: ShellState, domain: OfficeDomain): ShellState {
  return { ...state, activeDomain: domain, settingsOpen: false };
}

/** دورة حالة اللوحة: ظاهرة→مخفية→ظاهرة (التثبيت يُفك عند الإخفاء). */
export function togglePanel(
  state: ShellState,
  panel: 'layers' | 'properties',
): ShellState {
  const current = state.panels[panel];
  return {
    ...state,
    panels: {
      ...state.panels,
      [panel]: current.visible
        ? { visible: false, pinned: false }
        : { visible: true, pinned: current.pinned },
    },
  };
}

/** تثبيت/فك تثبيت لوحة — التثبيت يستلزم الظهور. */
export function togglePin(
  state: ShellState,
  panel: 'layers' | 'properties',
): ShellState {
  const current = state.panels[panel];
  const pinned = !current.pinned;
  return {
    ...state,
    panels: {
      ...state.panels,
      [panel]: { visible: pinned ? true : current.visible, pinned },
    },
  };
}

/** فتح/إغلاق صفحة الإعدادات. */
export function toggleSettings(state: ShellState): ShellState {
  return { ...state, settingsOpen: !state.settingsOpen };
}

/** تعيين الثيم وخلفية العمل. */
export function applyTheme(
  state: ShellState,
  themeKey: string,
  canvasBackground = '',
): ShellState {
  return { ...state, themeKey, canvasBackground };
}

/** معالج أمر محرر — تستخدمه الواجهات لربط سلوك فعلي. */
export type DomainCommandHandler = (commandId: string) => void;

/** واجهة المحرر المسجل في القشرة. */
export interface RegisteredEditor {
  readonly domain: OfficeDomain;
  readonly titleAr: string;
  readonly handleCommand: DomainCommandHandler;
}
