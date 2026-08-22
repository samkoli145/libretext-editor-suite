/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-css.ts
 * 📂 المسار: packages/core/src/engines/context-menu-css.ts
 * 🎯 الهدف الرئيسي: CSS keyframes, theme tokens, and style generators for
 *    context menus — Pure Light Theme only, smooth enter animations
 * 📋 المعايير: Zero Dependency, Headless, <50 lines/function
 * 🏷️ المعرف: CORE-ENG-023
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    CSS-in-JS Generator — headless style tokens for any rendering layer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. All colors must be from Pure Daylight palette — no dark themes
 *    2. Animations use cubic-bezier(0.16, 1, 0.3, 1) for snappy feel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - All style objects are frozen readonly
 *    - No DOM access — pure data structures
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/core/src/index.ts
 *    - 📄 مرتبط: context-menu-engine.ts, context-menu-interactions.ts
 *    - 🧪 اختبارات: tests/engines/context-menu-css.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - CONTEXT_MENU_KEYFRAMES: (#L42) @keyframes CSS string
 *    - CONTEXT_MENU_THEME: (#L55) Pure Light Theme tokens
 *    - CONTEXT_MENU_ITEM_STYLES: (#L75) per-item style states
 *    - generateContextMenuCss: (#L95) full CSS injection string
 *    - getMenuAnimationStyle: (#L110) inline style for enter animation
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - Cubic bezier (0.16, 1, 0.3, 1) = fast-in, smooth-out
 *    - Scale from 0.95 to 1.0 for subtle zoom entry
 *    - Opacity from 0 to 1 for fade-in
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── Animation Keyframes ───

export const CONTEXT_MENU_KEYFRAMES = `
@keyframes menuEnter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes submenuEnter {
  0% {
    opacity: 0;
    transform: translateX(-6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes itemHover {
  0% { background-color: transparent; }
  100% { background-color: #f1f5f9; }
}
` as const;

// ─── Pure Light Theme Tokens ───

export interface ContextMenuThemeTokens {
  readonly bg: string;
  readonly surface: string;
  readonly border: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly accent: string;
  readonly danger: string;
  readonly dangerBg: string;
  readonly hoverBg: string;
  readonly focusBg: string;
  readonly focusText: string;
  readonly disabledText: string;
  readonly separator: string;
  readonly shadow: string;
  readonly backdropBlur: string;
}

export const CONTEXT_MENU_THEME: ContextMenuThemeTokens = Object.freeze({
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  accent: '#2563EB',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  hoverBg: '#F1F5F9',
  focusBg: '#EFF6FF',
  focusText: '#1E40AF',
  disabledText: '#CBD5E1',
  separator: '#E2E8F0',
  shadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
  backdropBlur: 'blur(8px)',
});

// ─── Item Style States ───

export interface ContextMenuItemStyle {
  readonly background: string;
  readonly color: string;
  readonly fontWeight: string;
}

export const CONTEXT_MENU_ITEM_STYLES = Object.freeze({
  default: Object.freeze({ background: 'transparent', color: '#0F172A', fontWeight: '400' }) as ContextMenuItemStyle,
  hover: Object.freeze({ background: '#F1F5F9', color: '#0F172A', fontWeight: '500' }) as ContextMenuItemStyle,
  focus: Object.freeze({ background: '#EFF6FF', color: '#1E40AF', fontWeight: '500' }) as ContextMenuItemStyle,
  danger: Object.freeze({ background: 'transparent', color: '#DC2626', fontWeight: '400' }) as ContextMenuItemStyle,
  dangerHover: Object.freeze({ background: '#FEF2F2', color: '#DC2626', fontWeight: '500' }) as ContextMenuItemStyle,
  disabled: Object.freeze({ background: 'transparent', color: '#CBD5E1', fontWeight: '400' }) as ContextMenuItemStyle,
});

// ─── CSS Generation ───

export function generateContextMenuCss(selector: string = '[data-context-menu]'): string {
  const t = CONTEXT_MENU_THEME;
  return `
${CONTEXT_MENU_KEYFRAMES}
${selector} {
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  max-width: 260px;
  background: ${t.bg};
  border: 1px solid ${t.border};
  border-radius: 8px;
  box-shadow: ${t.shadow};
  backdrop-filter: ${t.backdropBlur};
  padding: 4px;
  animation: menuEnter 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  outline: none;
  user-select: none;
}
${selector} [data-menu-item] {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: ${t.text};
  font-size: 12px;
  line-height: 1.4;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.1s ease, color 0.1s ease;
}
${selector} [data-menu-item]:hover {
  background: ${t.hoverBg};
}
${selector} [data-menu-item][data-focused="true"] {
  background: ${t.focusBg};
  color: ${t.focusText};
  font-weight: 500;
}
${selector} [data-menu-item][data-danger="true"] {
  color: ${t.danger};
}
${selector} [data-menu-item][data-danger="true"]:hover {
  background: ${t.dangerBg};
}
${selector} [data-menu-item][data-disabled="true"] {
  color: ${t.disabledText};
  cursor: not-allowed;
  pointer-events: none;
}
${selector} [data-menu-separator] {
  height: 1px;
  background: ${t.separator};
  margin: 4px 0;
}
${selector} [data-menu-icon] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${t.textSecondary};
}
${selector} [data-menu-label] {
  flex: 1;
  font-weight: 500;
}
${selector} [data-menu-shortcut] {
  font-size: 10px;
  color: ${t.textSecondary};
  font-family: monospace;
  letter-spacing: 0.5px;
  margin-left: 12px;
}
${selector} [data-menu-checked] {
  color: ${t.accent};
  font-weight: 700;
  margin-left: 8px;
}
`;
}

// ─── Inline Animation Style ───

export interface MenuAnimationStyle {
  readonly animation: string;
  readonly transformOrigin: string;
}

export function getMenuAnimationStyle(side: 'left' | 'right' = 'left'): MenuAnimationStyle {
  return Object.freeze({
    animation: 'menuEnter 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    transformOrigin: side === 'left' ? 'top left' : 'top right',
  });
}

export function getSubmenuAnimationStyle(): MenuAnimationStyle {
  return Object.freeze({
    animation: 'submenuEnter 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    transformOrigin: 'top left',
  });
}
