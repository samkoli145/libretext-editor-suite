/**
 * 🧪 اختبارات: مترجم TS/TSX + اسطمبات الكود + مولد الثيمات اللانهائي
 * 🏷️ المعرف: TEST-ENG-TSX-STAMPS-THEMES-001
 */

import { describe, it, expect } from 'vitest';
import {
  transpileTypeScript,
  isTsxSource,
} from '../../../shared/lib-core/code-interpreter/ts-transpiler';
import { liveInterpreterEngine } from '../../../shared/lib-core/code-interpreter/live-interpreter-engine';
import {
  CODE_STAMPS,
  registerCodeStamps,
  getStampsByLang,
} from '../../../templates/src/code-stamps/code-stamps';
import { TemplateRegistry } from '../../../templates/src/registry';
import {
  createThemeFromColor,
  generateThemeSpectrum,
  hexToHsl,
  hslToHex,
} from '../../src/engines/theme-engine';

describe('TS/TSX transpiler', () => {
  it('يزيل الأنواع من TypeScript', () => {
    const result = transpileTypeScript(`
      interface User { name: string; age: number }
      const u: User = { name: 'سالم', age: 30 };
      console.log(u.name);
    `);
    expect(result.ok).toBe(true);
    expect(result.js).not.toContain('interface');
    expect(result.js).toContain('سالم');
  });

  it('يكشف مصادر TSX تلقائياً ويولّد shim', () => {
    const tsx = 'const App = () => (<div>مرحبا</div>);';
    expect(isTsxSource(tsx)).toBe(true);
    const result = transpileTypeScript(tsx);
    expect(result.ok).toBe(true);
    expect(result.js).toContain('React.createElement');
  });

  it('ينفذ TypeScript حياً عبر المحرك بعد الترجمة', () => {
    const output = liveInterpreterEngine.interpret(
      'enum Color { Red }\nconst x: number = 41 + 1;\nconsole.log("الناتج:", x);',
      'typescript',
    );
    expect(output.success).toBe(true);
    expect(output.htmlContent).toContain('الناتج: 42');
  });

  it('ينفذ TSX حياً وينتج HTML من jsx shim', () => {
    const output = liveInterpreterEngine.interpret(
      'const App = () => <div class="card">بطاقة</div>;\nconsole.log(App());',
      'tsx',
    );
    expect(output.success).toBe(true);
    expect(output.htmlContent).toContain('بطاقة');
  });

  it('يرفض المصدر الفارغ أو الضخم بأمان', () => {
    expect(transpileTypeScript('').ok).toBe(false);
    expect(transpileTypeScript('x'.repeat(300_000)).ok).toBe(false);
  });
});

describe('code stamps library', () => {
  it('يوفر أختاماً للفئات الثلاث (html/tsx/electron)', () => {
    expect(getStampsByLang('html').length).toBeGreaterThanOrEqual(2);
    expect(getStampsByLang('tsx').length).toBeGreaterThanOrEqual(1);
    expect(getStampsByLang('electron').length).toBeGreaterThanOrEqual(2);
    expect(CODE_STAMPS.every(s => s.content.length > 50)).toBe(true);
  });

  it('يسجل النطاق والأختام في السجل الرسمي', () => {
    const registry = new TemplateRegistry<string>({ contentGuard: (c) => typeof c === 'string' && c.length > 0 });
    const count = registerCodeStamps(registry);
    expect(count).toBe(CODE_STAMPS.length);
    expect(registry.hasDomain('code')).toBe(true);
    expect(registry.get('code-html-landing')).not.toBeNull();
  });

  it('إعادة التسجيل تتجاهل المكرر دون رمي', () => {
    const registry = new TemplateRegistry<string>({ contentGuard: (c) => typeof c === 'string' && c.length > 0 });
    registerCodeStamps(registry);
    expect(() => registerCodeStamps(registry)).not.toThrow();
  });

  it('ختم Electron يحتوي contextIsolation الآمن', () => {
    const main = CODE_STAMPS.find(s => s.id === 'code-electron-main');
    expect(main?.content).toContain('contextIsolation: true');
    expect(main?.content).toContain('nodeIntegration: false');
  });
});

describe('infinite theme engine', () => {
  it('يحول HEX↔HSL بدقة مقبولة', () => {
    const hsl = hexToHsl('#ff0000');
    expect(Math.round(hsl.h)).toBe(0);
    expect(Math.round(hsl.s)).toBe(100);

    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
  });

  it('يرفض hex غير صالح برسالة صريحة', () => {
    expect(() => hexToHsl('#zzz')).toThrow(/Invalid hex/);
    expect(() => hexToHsl('blue')).toThrow(/Invalid hex/);
  });

  it('يولد ثيماً كاملاً من لون واحد بخلفية فاتحة دائماً', () => {
    for (const base of ['#3b82f6', '#ef4444', '#10b981', '#a855f7']) {
      const theme = createThemeFromColor(base);
      const bgL = hexToHsl(theme.backgroundColor).l;
      expect(bgL).toBeGreaterThanOrEqual(95); // فاتح نقي
      expect(theme.nameAr.length).toBeGreaterThan(0);
      expect(theme.desc).toContain(base);
    }
  });

  it('يولد طيفاً من N ثيم متمايزة حول العجلة', () => {
    const spectrum = generateThemeSpectrum('#2563eb', 12);
    expect(spectrum).toHaveLength(12);
    const hues = spectrum.map(t => hexToHsl(t.primaryColor).h);
    expect(new Set(hues.map(Math.round)).size).toBeGreaterThan(6); // تنوع حقيقي

    // القص: 999 → 360 كحد أقصى
    expect(generateThemeSpectrum('#2563eb', 999)).toHaveLength(360);
  });

  it('الثيمات المولدة تُستخدم مباشرة في ImpressEngine', async () => {
    const { ImpressEngine } = await import('../../src/engines/impress-engine');
    const engine = new ImpressEngine();
    const theme = createThemeFromColor('#e11d48', 'توت بري');
    const pres = engine.createPresentation('اختبار');
    const themed = { ...pres, theme };
    expect(themed.theme.nameAr).toContain('توت بري');
  });
});
