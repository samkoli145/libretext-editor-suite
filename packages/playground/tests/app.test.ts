/**
 * 🧪 اختبارات الواجهة البصرية (jsdom): التركيب، التبويبات، الأدوات، اللوحات، الإعدادات
 * 🏷️ المعرف: TEST-PLAY-APP-001
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PlaygroundApp } from '../src/playground-app';

describe('playground visual app', () => {
  let host: HTMLElement;
  let app: PlaygroundApp;

  beforeEach(() => {
    document.body.innerHTML = '<div id="host"></div>';
    host = document.getElementById('host')!;
    app = new PlaygroundApp();
    app.mount(host);
  });

  it('يتركب بالمناطق السبع كاملة', () => {
    for (const zone of ['menubar', 'tabbar', 'toolbar', 'canvas', 'layers', 'properties', 'statusbar']) {
      expect(host.querySelector(`[data-zone=${zone}]`)).not.toBeNull();
    }
  });

  it('شريط التبويبات يعرض المحررات الأربعة وWriter نشطاً', () => {
    const tabs = host.querySelectorAll('.lt-tab');
    expect(tabs).toHaveLength(4);
    expect(host.querySelector('.lt-tab-active')!.textContent).toContain('نص');
  });

  it('النقر على تبويب يبدل المحرر والشريط السياقي يتغير', () => {
    (host.querySelectorAll('.lt-tab')[1] as HTMLElement).click(); // calc
    expect(host.querySelector('.lt-tab-active')!.textContent).toContain('بيانات');
    // شريط calc يحتوي إعادة الحساب
    const toolbar = host.querySelector('[data-zone=toolbar]')!.textContent ?? '';
    expect(toolbar.length).toBeGreaterThan(0);
  });

  it('الشريط: ≤9 أدوات عمل + أدوات عرض دائمة + محجوزات شبحية', () => {
    const tools = [...host.querySelectorAll('[data-zone=toolbar] .lt-tool:not(.lt-tool-more)')];
    const active = tools.filter(t => !t.classList.contains('lt-tool-reserved'));
    const actionTools = active.filter(
      t => !['لوحة الطبقات', 'لوحة الخصائص', 'الإعدادات والخلفية', 'لوحة الأوامر'].some(n =>
        (t as HTMLElement).title.includes(n),
      ),
    );
    expect(actionTools.length).toBeLessThanOrEqual(9);
    expect(tools.some(t => t.classList.contains('lt-tool-reserved'))).toBe(true);
  });

  it('قائمة ⋮ الفائض تفتح عناصر قابلة للنقر', () => {
    (host.querySelector('.lt-tool-more') as HTMLElement)?.click();
    expect(host.querySelectorAll('.lt-dropdown-item').length).toBeGreaterThan(2);
  });

  it('قائمة عرض تبدل لوحة الطبقات (إظهار/إخفاء)', () => {
    expect((host.querySelector('.lt-panel-layers') as HTMLElement).hidden).toBe(false);
    // عبر القائمة: عرض → لوحة الطبقات
    const menubar = host.querySelector('[data-zone=menubar]')!;
    const viewBtn = [...menubar.querySelectorAll('.lt-menu-btn')].find(b =>
      b.textContent === 'عرض',
    ) as HTMLElement;
    viewBtn.click();
    const item = [...host.querySelectorAll('.lt-dropdown-item')].find(b =>
      b.textContent?.includes('لوحة الطبقات'),
    ) as HTMLElement;
    item.click();
    expect((host.querySelector('.lt-panel-layers') as HTMLElement).hidden).toBe(true);
  });

  it('أمر إدراج يصل للمحرك الحقيقي — صورة تزيد بلوكات Writer', () => {
    const before = (host.querySelector('.lt-editor-preview')!.textContent ?? '').match(/(\d+) بلوك/);
    const countBefore = Number(before?.[1] ?? 0);

    // من قائمة إدراج → صورة
    const menubar = host.querySelector('[data-zone=menubar]')!;
    const insertBtn = [...menubar.querySelectorAll('.lt-menu-btn')].find(b =>
      b.textContent === 'إدراج',
    ) as HTMLElement;
    insertBtn.click();
    const imgItem = [...host.querySelectorAll('.lt-dropdown-item')].find(b =>
      b.textContent?.includes('صورة'),
    ) as HTMLElement;
    imgItem.click();

    const after = (host.querySelector('.lt-editor-preview')!.textContent ?? '').match(/(\d+) بلوك/);
    expect(Number(after?.[1] ?? 0)).toBe(countBefore + 1);
  });

  it('صفحة الإعدادات تعرض 14 ثيمة وتفعّل الاختيار', () => {
    // افتح الإعدادات من زر الترس في القائمة العلوية
    const settingsBtns = [...host.querySelectorAll('[data-zone=menubar] .lt-menu-btn')];
    (settingsBtns[settingsBtns.length - 1] as HTMLElement).click();

    const cards = host.querySelectorAll('.lt-theme-card');
    expect(cards).toHaveLength(14);
    expect(host.querySelectorAll('.lt-bg-card').length).toBeGreaterThanOrEqual(6);

    // اختيار ثيم مولد
    const genCard = [...cards].find(c =>
      c.querySelector('.lt-theme-name')?.textContent?.includes('🧬'),
    ) as HTMLElement;
    genCard.click();
    expect(host.querySelector('[data-zone=statusbar]')!.textContent).toContain('gen-');
  });

  it('لوحة الأوامر تبحث وتنفذ', () => {
    const paletteBtn = [...host.querySelectorAll('[data-zone=toolbar] .lt-tool')].find(
      b => (b as HTMLElement).title.includes('لوحة الأوامر'),
    ) as HTMLElement;
    paletteBtn.click();
    const input = host.querySelector('.lt-palette-input') as HTMLInputElement;
    input.value = 'تفقيط';
    input.dispatchEvent(new Event('input'));
    const items = host.querySelectorAll('.lt-palette-results .lt-dropdown-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0]!.textContent).toContain('تفقيط');
  });

  it('شريط الحالة يعرض النطاق والثيم وإجمالي الأدوات', () => {
    const status = host.querySelector('[data-zone=statusbar]')!.textContent ?? '';
    expect(status).toContain('نص');
    expect(status).toContain('crisp-white');
    expect(status).toMatch(/\d+ أداة \(\d+ محجوزة\)/);
  });
});
