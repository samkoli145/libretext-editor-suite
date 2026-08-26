/**
 * 🧪 اختبارات: جسر الطبقات من الكود + اسطمبات التخطيط بمناطق
 * 🏷️ المعرف: TEST-BLK-LAYERS-LAYOUTS-001
 */

import { describe, it, expect } from 'vitest';
import {
  extractLayerTree,
  toggleLayerVisibility,
} from '../../../shared/lib-core/code-interpreter/layers-from-code';
import {
  LAYOUT_STAMPS,
  validateLayoutStamp,
  layoutToCssGrid,
} from '../../../templates/src/layout-stamps/layout-stamps';
import {
  createThemeFromColor,
  hexToHsl,
} from '../../src/engines/theme-engine';

describe('layers-from-code bridge', () => {
  const SAMPLE = `<div id="app">
  <header class="top-bar">شريط</header>
  <main class="content">المحتوى</main>
</div>`;

  it('يستخرج شجرة طبقات من كود HTML', () => {
    const layers = extractLayerTree(SAMPLE);
    expect(layers.length).toBeGreaterThanOrEqual(3);
    expect(layers[0]!.tag).toBe('div');
    expect(layers.some(l => l.label.includes('#app'))).toBe(true);
    expect(layers.some(l => l.label.includes('.top-bar'))).toBe(true);
  });

  it('كود فارغ يعطي شجرة فارغة لا خطأ', () => {
    expect(extractLayerTree('')).toEqual([]);
    expect(extractLayerTree('   ')).toEqual([]);
  });

  it('كل طبقة تحمل أسطرها وسماتها للربط بالمحرر', () => {
    const layers = extractLayerTree(SAMPLE);
    for (const layer of layers) {
      expect(layer.startLine).toBeGreaterThan(0);
      expect(layer.endLine).toBeGreaterThanOrEqual(layer.startLine);
      expect(typeof layer.attributesSummary).toBe('string');
    }
  });

  it('إخفاء طبقة يعدّل الكود بإضافة display:none', () => {
    const hidden = toggleLayerVisibility(SAMPLE, 'node-2', false);
    expect(hidden).toContain('display:none');
    // إظهارها يعيد الكود نظيفاً
    const shown = toggleLayerVisibility(hidden, 'node-2', true);
    expect(shown).not.toContain('display:none');
  });
});

describe('layout stamps (zone-based)', () => {
  it('يوفر 3 تخطيطات: أداة تصميم + تركيز برمجي + انقسام حي', () => {
    expect(LAYOUT_STAMPS.map(s => s.id)).toEqual([
      'layout-design-tool',
      'layout-code-focus',
      'layout-split-live',
    ]);
  });

  it('كل التخطيطات سليمة — المناطق تطابق الشبكة', () => {
    for (const stamp of LAYOUT_STAMPS) {
      expect(validateLayoutStamp(stamp)).toEqual({ valid: true });
    }
  });

  it('منطقة canvas وحدها تستضيف المحرر في كل التخطيطات', () => {
    for (const stamp of LAYOUT_STAMPS) {
      const editors = stamp.zones.filter(z => z.hostsEditor);
      expect(editors).toHaveLength(1);
      expect(editors[0]!.zone).toBe('canvas');
    }
  });

  it('تخطيط أداة التصميم يحتوي المناطق الست كاملة', () => {
    const designer = LAYOUT_STAMPS[0]!;
    const zones = designer.zones.map(z => z.zone);
    expect(zones).toEqual(
      expect.arrayContaining(['menubar', 'toolbar', 'canvas', 'layers', 'properties', 'statusbar']),
    );
  });

  it('يفحص عقداً مكسورة — منطقة بلا spec ترفض', () => {
    const broken = { ...LAYOUT_STAMPS[0]!, areas: ['ghost ghost ghost'] };
    expect(validateLayoutStamp(broken).valid).toBe(false);
  });

  it('يولد CSS Grid صالحاً من العقد', () => {
    const css = layoutToCssGrid(LAYOUT_STAMPS[0]!);
    expect(css).toContain('display: grid');
    expect(css).toContain('grid-template-areas');
    expect(css).toContain('"menubar menubar menubar"');
  });
});

describe('theme → layout integration', () => {
  it('ثيم مولد يمكن تمريره لسجل Monaco عبر registerDaylightTheme', async () => {
    const theme = createThemeFromColor('#0891b2');
    // فحص القيم التي سيترجمها الجسر
    expect(theme.backgroundColor).toMatch(/^#/);
    expect(hexToHsl(theme.backgroundColor).l).toBeGreaterThanOrEqual(95);
    expect(theme.primaryColor).not.toBe(theme.backgroundColor);
  });
});
