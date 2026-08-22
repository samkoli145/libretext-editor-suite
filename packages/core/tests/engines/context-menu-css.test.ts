/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-css.test.ts
 * 📂 المسار: packages/core/tests/engines/context-menu-css.test.ts
 * 🎯 الهدف الرئيسي: Unit tests for CSS keyframes, theme tokens, and style generators
 * 🏷️ المعرف: TEST-CORE-ENG-023
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  CONTEXT_MENU_KEYFRAMES,
  CONTEXT_MENU_THEME,
  CONTEXT_MENU_ITEM_STYLES,
  generateContextMenuCss,
  getMenuAnimationStyle,
  getSubmenuAnimationStyle,
} from '../../src/engines/context-menu-css';

// ─── Keyframes ───

describe('CONTEXT_MENU_KEYFRAMES', () => {
  it('contains menuEnter keyframe', () => {
    expect(CONTEXT_MENU_KEYFRAMES).toContain('@keyframes menuEnter');
  });

  it('contains submenuEnter keyframe', () => {
    expect(CONTEXT_MENU_KEYFRAMES).toContain('@keyframes submenuEnter');
  });

  it('contains itemHover keyframe', () => {
    expect(CONTEXT_MENU_KEYFRAMES).toContain('@keyframes itemHover');
  });

  it('uses cubic-bezier timing in generated CSS', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('cubic-bezier');
  });
});

// ─── Theme Tokens ───

describe('CONTEXT_MENU_THEME', () => {
  it('has white background (Pure Light Theme)', () => {
    expect(CONTEXT_MENU_THEME.bg).toBe('#FFFFFF');
  });

  it('has no dark colors', () => {
    const darkColors = ['#000', '#111', '#222', '#1a1a1a', '#333'];
    for (const val of Object.values(CONTEXT_MENU_THEME)) {
      expect(darkColors).not.toContain(val.toLowerCase());
    }
  });

  it('has border color', () => {
    expect(CONTEXT_MENU_THEME.border).toBeTruthy();
  });

  it('has shadow', () => {
    expect(CONTEXT_MENU_THEME.shadow).toContain('rgba');
  });

  it('has backdrop blur', () => {
    expect(CONTEXT_MENU_THEME.backdropBlur).toContain('blur');
  });

  it('is frozen readonly', () => {
    expect(Object.isFrozen(CONTEXT_MENU_THEME)).toBe(true);
  });
});

// ─── Item Styles ───

describe('CONTEXT_MENU_ITEM_STYLES', () => {
  it('has all state styles', () => {
    expect(CONTEXT_MENU_ITEM_STYLES.default).toBeDefined();
    expect(CONTEXT_MENU_ITEM_STYLES.hover).toBeDefined();
    expect(CONTEXT_MENU_ITEM_STYLES.focus).toBeDefined();
    expect(CONTEXT_MENU_ITEM_STYLES.danger).toBeDefined();
    expect(CONTEXT_MENU_ITEM_STYLES.dangerHover).toBeDefined();
    expect(CONTEXT_MENU_ITEM_STYLES.disabled).toBeDefined();
  });

  it('danger style uses red color', () => {
    expect(CONTEXT_MENU_ITEM_STYLES.danger.color).toContain('DC2626');
  });

  it('disabled style uses light color', () => {
    expect(CONTEXT_MENU_ITEM_STYLES.disabled.color).toBeTruthy();
  });

  it('focus style uses accent color', () => {
    expect(CONTEXT_MENU_ITEM_STYLES.focus.color).toContain('1E40AF');
  });
});

// ─── CSS Generation ───

describe('generateContextMenuCss', () => {
  it('returns a non-empty string', () => {
    const css = generateContextMenuCss();
    expect(css.length).toBeGreaterThan(100);
  });

  it('contains animation property', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('animation:');
    expect(css).toContain('menuEnter');
  });

  it('contains border-radius', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('border-radius');
  });

  it('contains backdrop-filter', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('backdrop-filter');
  });

  it('uses custom selector', () => {
    const css = generateContextMenuCss('.my-menu');
    expect(css).toContain('.my-menu');
  });

  it('contains item hover styles', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('[data-menu-item]:hover');
  });

  it('contains focused state styles', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('[data-focused="true"]');
  });

  it('contains danger styles', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('[data-danger="true"]');
  });

  it('contains disabled styles', () => {
    const css = generateContextMenuCss();
    expect(css).toContain('[data-disabled="true"]');
  });
});

// ─── Animation Styles ───

describe('getMenuAnimationStyle', () => {
  it('returns animation and transformOrigin', () => {
    const style = getMenuAnimationStyle();
    expect(style.animation).toContain('menuEnter');
    expect(style.transformOrigin).toBeTruthy();
  });

  it('uses top left origin for left side', () => {
    const style = getMenuAnimationStyle('left');
    expect(style.transformOrigin).toBe('top left');
  });

  it('uses top right origin for right side', () => {
    const style = getMenuAnimationStyle('right');
    expect(style.transformOrigin).toBe('top right');
  });

  it('is frozen', () => {
    expect(Object.isFrozen(getMenuAnimationStyle())).toBe(true);
  });
});

describe('getSubmenuAnimationStyle', () => {
  it('returns submenuEnter animation', () => {
    const style = getSubmenuAnimationStyle();
    expect(style.animation).toContain('submenuEnter');
  });

  it('is frozen', () => {
    expect(Object.isFrozen(getSubmenuAnimationStyle())).toBe(true);
  });
});
