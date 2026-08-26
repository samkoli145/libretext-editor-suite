/**
 * 🧪 اختبارات محرك Impress: الثيمات الست، القوالب، الانتقالات، التدرجات
 * 🏷️ المعرف: TEST-ENG-IMPRESS-002
 */

import { describe, it, expect } from 'vitest';
import {
  ImpressEngine,
  DEFAULT_THEMES,
  THEME_KEYS,
  SLIDE_GRADIENT_PRESETS,
} from '../../src/engines/impress-engine';

describe('Daylight themes (6)', () => {
  it('يوفر الثيمات النهارية الست كاملة', () => {
    expect(THEME_KEYS.sort()).toEqual(
      ['crisp-white', 'fresh-linen', 'mist-pearl', 'nordic-sky', 'soft-ivory', 'warm-sand'].sort(),
    );
  });

  it('كل ثيم له اسم عربي وألوان فاتحة', () => {
    for (const key of THEME_KEYS) {
      const theme = DEFAULT_THEMES[key]!;
      expect(theme.nameAr.length).toBeGreaterThan(0);
      expect(theme.backgroundColor).toMatch(/^#[F-F]/);
    }
  });

  it('ينشئ عرضاً بأي ثيم من الستة', () => {
    const engine = new ImpressEngine();
    for (const key of THEME_KEYS) {
      const pres = engine.createPresentation('اختبار', key);
      expect(pres.theme.nameAr.length).toBeGreaterThan(0);
    }
  });
});

describe('templates', () => {
  it('يوفر 6 قوالب وكلها تُنشئ شرائح مرقمة', () => {
    const engine = new ImpressEngine();
    const templates = engine.getAvailableTemplates();
    expect(templates).toHaveLength(6);

    for (const name of templates) {
      const pres = engine.createFromTemplate(name);
      expect(pres.slides.length).toBeGreaterThanOrEqual(4);
      expect(pres.slides[0]!.slideNumber).toBe(1);
    }
  });

  it('يرفض قالباً غير معروف برسالة صريحة', () => {
    const engine = new ImpressEngine();
    expect(() => engine.createFromTemplate('nonexistent')).toThrow(/Unknown template/);
  });

  it('كل قالب يستخدم ثيماً مختلفاً مناسباً', () => {
    const engine = new ImpressEngine();
    expect(engine.createFromTemplate('academic-lecture').theme.nameAr).toContain('عاجي');
    expect(engine.createFromTemplate('nature-portfolio').theme.nameAr).toContain('كتان');
  });
});

describe('transitions & gradients', () => {
  it('يعيّن انتقال شريحة ويقص المدة إلى 100-3000ms', () => {
    const engine = new ImpressEngine();
    const pres = engine.createPresentation('t');
    const slideId = pres.slides[0]!.id;

    const updated = engine.setSlideTransition(pres, slideId, { type: 'fade', duration: 99_999 });
    expect(updated.slides[0]!.transition).toEqual({ type: 'fade', duration: 3000 });

    const clampedLow = engine.setSlideTransition(pres, slideId, { type: 'zoom', duration: 5 });
    expect(clampedLow.slides[0]!.transition.duration).toBe(100);
  });

  it('يطبّق تدرجاً جاهزاً كخلفية ويتجاهل المفاتيح غير المعروفة', () => {
    const engine = new ImpressEngine();
    const pres = engine.createPresentation('g');
    const slideId = pres.slides[0]!.id;

    const withGradient = engine.setSlideGradientPreset(pres, slideId, 'morning-glow');
    expect(withGradient.slides[0]!.background.type).toBe('gradient');
    expect(withGradient.slides[0]!.background.value).toContain('#fffbeb');

    expect(engine.setSlideGradientPreset(pres, slideId, 'nope')).toBe(pres);
  });

  it('يوفر 6 تدرجات خلفية جاهزة', () => {
    expect(SLIDE_GRADIENT_PRESETS).toHaveLength(6);
  });
});
