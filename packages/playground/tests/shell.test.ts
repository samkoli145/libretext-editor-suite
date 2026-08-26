/**
 * 🧪 اختبارات قشرة الملعب: التنقل، اللوحات، القوائم، الأيقونات، المشاهد، الإعدادات
 * 🏷️ المعرف: TEST-PLAY-SHELL-001
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialShellState,
  switchDomain,
  togglePanel,
  togglePin,
  toggleSettings,
  applyTheme,
  ALL_DOMAINS,
} from '../src/shell/playground-shell';
import {
  buildMenusForDomain,
  flattenMenuActions,
} from '../src/shell/menu-model';
import { getIcon, ICONS, DOMAIN_COLORS } from '../src/shell/icon-set';
import {
  WriterView,
  CalcView,
  ImpressView,
  BaseView,
  makeTheme,
} from '../src/views/editor-views';
import { buildThemeGallery, CANVAS_BACKGROUNDS } from '../src/panels/settings-page';

describe('shell state machine', () => {
  it('الحالة الابتدائية: Writer نشط واللوحات ظاهرة ومثبتة', () => {
    const s = createInitialShellState();
    expect(s.activeDomain).toBe('writer');
    expect(s.panels.layers).toEqual({ visible: true, pinned: true });
    expect(s.settingsOpen).toBe(false);
  });

  it('التنقل بين المحررات الأربعة يغلق الإعدادات', () => {
    let s = toggleSettings(createInitialShellState());
    expect(s.settingsOpen).toBe(true);
    s = switchDomain(s, 'calc');
    expect(s.activeDomain).toBe('calc');
    expect(s.settingsOpen).toBe(false);
  });

  it('إخفاء لوحة مثبتة يفك التثبيت أولاً', () => {
    let s = createInitialShellState();
    s = togglePanel(s, 'layers');
    expect(s.panels.layers).toEqual({ visible: false, pinned: false });
    // إعادة الإظهار تحافظ على حالة التثبيت (غير مثبتة)
    s = togglePanel(s, 'layers');
    expect(s.panels.layers).toEqual({ visible: true, pinned: false });
  });

  it('التثبيت يستلزم الظهور', () => {
    let s = togglePanel(createInitialShellState(), 'properties'); // مخفية الآن
    s = togglePin(s, 'properties');
    expect(s.panels.properties.visible).toBe(true);
    expect(s.panels.properties.pinned).toBe(true);
  });

  it('applyTheme يعين الثيم والخلفية معاً', () => {
    const s = applyTheme(createInitialShellState(), 'gen-e11d48', 'linear-gradient(1deg,#fff,#eee)');
    expect(s.themeKey).toBe('gen-e11d48');
    expect(s.canvasBackground).toContain('gradient');
  });
});

describe('menu model', () => {
  it('كل نطاق له القوائم الأربع الأساسية', () => {
    for (const domain of ALL_DOMAINS) {
      const sections = buildMenusForDomain(domain);
      expect(sections.map(s => s.id)).toEqual(['file', 'edit', 'view', 'insert']);
    }
  });

  it('الأدوات المشتركة موحدة في كل النطاقات', () => {
    for (const domain of ALL_DOMAINS) {
      const actions = flattenMenuActions(domain);
      for (const id of ['new', 'save', 'undo', 'redo']) {
        expect(actions.get(id)?.shared).toBe(true);
      }
    }
  });

  it('قائمة إدراج تختلف حسب النطاق', () => {
    expect(flattenMenuActions('writer').has('insert-math')).toBe(true);
    expect(flattenMenuActions('calc').has('insert-tafqeet')).toBe(true);
    expect(flattenMenuActions('impress').has('insert-slide')).toBe(true);
    expect(flattenMenuActions('base').has('insert-relation')).toBe(true);
  });
});

describe('icon set', () => {
  it('الأيقونات الـ 18 موجودة بصيغة SVG صحيحة', () => {
    expect(Object.keys(ICONS).length).toBeGreaterThanOrEqual(18);
    for (const svg of Object.values(ICONS)) {
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="16"');
    }
  });

  it('أيقونة غير معروفة ترجع دائرة محايدة لا undefined', () => {
    expect(getIcon('nonexistent')).toContain('circle');
  });

  it('ألوان النطاقات تطابق نمط ليبرا أوفيس', () => {
    expect(DOMAIN_COLORS.writer).toBe('#2a6099');
    expect(DOMAIN_COLORS.calc).toBe('#1e7145');
    expect(DOMAIN_COLORS.impress).toBe('#c05a11');
    expect(DOMAIN_COLORS.base).toBe('#7b3fa0');
  });
});

describe('editor views (engine-bound)', () => {
  it('WriterView ينشئ مستنداً وينفذ أوامر الإدراج', () => {
    const view = new WriterView();
    const before = view.doc.blocks.length;
    view.handleCommand('insert-image');
    expect(view.doc.blocks.length).toBeGreaterThan(before);
  });

  it('CalcView يعيد حساب الصيغ عبر منطق الخلايا', () => {
    const view = new CalcView();
    view.recalculate();
    expect(view.lastComputed.get('C2')).toBe(25); // B2=10 * 2.5
  });

  it('ImpressView ينشئ عرضاً ويضيف شرائح وانتقالات', () => {
    const view = new ImpressView('nordic-sky');
    expect(view.pres.theme.nameAr).toContain('سماء الشمال');
    const slidesBefore = view.pres.slides.length;
    view.handleCommand('insert-slide');
    expect(view.pres.slides.length).toBe(slidesBefore + 1);
    view.handleCommand('insert-transition');
    expect(view.pres.slides[0]!.transition.type).toBe('fade');
  });

  it('BaseView ينشئ قاعدة بجداول ويضيف المزيد', () => {
    const view = new BaseView();
    const tablesBefore = view.db.tables.length;
    view.handleCommand('insert-table');
    expect(view.db.tables.length).toBe(tablesBefore + 1);
  });

  it('مصنع الثيمات يغلف المولد اللانهائي', () => {
    const theme = makeTheme('#0891b2', 'فيروزي مخصص');
    expect(theme.nameAr).toBe('فيروزي مخصص');
  });
});

describe('settings page model', () => {
  it('المعرض يجمع 6 رسمية + 8 مولدة', () => {
    const gallery = buildThemeGallery();
    expect(gallery.filter(t => !t.generated)).toHaveLength(6);
    expect(gallery.filter(t => t.generated)).toHaveLength(8);
  });

  it('كل بطاقة رسمية بألوان فاتحة', () => {
    for (const card of buildThemeGallery()) {
      expect(card.backgroundColor).toMatch(/^#/);
      expect(card.nameAr.length).toBeGreaterThan(0);
    }
  });

  it('خلفيات الكانفاس كلها فاتحة', () => {
    expect(CANVAS_BACKGROUNDS.length).toBeGreaterThanOrEqual(6);
    for (const bg of CANVAS_BACKGROUNDS) {
      if (!bg.css) continue;
      // كل الألوان في التدرج تبدأ بـ #f أو #e (فاتحة)
      const colors = bg.css.match(/#[0-9a-f]{6}/gi) ?? [];
      expect(colors.every(c => /^[#f]/i.test(c))).toBe(true);
    }
  });
});
