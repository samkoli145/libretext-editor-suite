/**
 * 🧪 اختبارات حصر الأدوات: المواضع الأربعة، حد الشريط، المحجوزات، البحث
 * 🏷️ المعرف: TEST-PLAY-TOOLS-001
 */

import { describe, it, expect } from 'vitest';
import {
  TOOL_REGISTRY,
  MAX_TOOLBAR_TOOLS,
  getToolsForDomain,
  getToolbarLayout,
  getContextTools,
  searchTools,
  getRegistryStats,
} from '../src/shell/tool-registry';
import { ALL_DOMAINS } from '../src/shell/playground-shell';

describe('tool registry inventory', () => {
  it('الحصر يغطي أكثر من 50 أداة فعلية', () => {
    const stats = getRegistryStats();
    expect(stats.total).toBeGreaterThanOrEqual(50);
    expect(stats.reserved).toBeGreaterThanOrEqual(6);
  });

  it('كل أداة لها نطاق واحد على الأقل وموضع صالح', () => {
    for (const tool of TOOL_REGISTRY) {
      expect(tool.domains.length).toBeGreaterThan(0);
      expect(['toolbar', 'overflow', 'context', 'palette']).toContain(tool.placement);
      expect(tool.labelAr.length).toBeGreaterThan(0);
    }
  });

  it('كل النطاقات مغطاة بأدوات', () => {
    for (const domain of ALL_DOMAINS) {
      expect(getToolsForDomain(domain).length).toBeGreaterThan(8);
    }
  });
});

describe('toolbar layout (anti-crowding)', () => {
  it('أدوات العمل ≤9 + أدوات العرض معفاة دائماً', () => {
    for (const domain of ALL_DOMAINS) {
      const { primary } = getToolbarLayout(domain);
      const actionTools = primary.filter(t => t.group !== 'view');
      expect(actionTools.length).toBeLessThanOrEqual(MAX_TOOLBAR_TOOLS);
      // مفاتيح اللوحات ظاهرة دائماً
      expect(primary.some(t => t.id === 'toggle-layers')).toBe(true);
      expect(primary.some(t => t.id === 'command-palette')).toBe(true);
    }
  });

  it('المحجوزات تُلحق بنهاية الشريط خارج الحد', () => {
    const { primary, reserved } = getToolbarLayout('writer');
    expect(reserved.length).toBeGreaterThan(0);
    expect(reserved.every(t => t.reserved)).toBe(true);
    // لا تداخل بين الفعلي والمحجوز
    const primaryIds = new Set(primary.map(t => t.id));
    expect(reserved.every(t => !primaryIds.has(t.id))).toBe(true);
  });

  it('الفائض يستقبل تجاوز الحد + أدوات overflow', () => {
    const { primary, overflow } = getToolbarLayout('writer');
    expect(overflow.length).toBeGreaterThan(3);
    const allIds = new Set([...primary, ...overflow].map(t => t.id));
    // كل أداة writer غير السياقية وغير اللوحية موجودة في أساسي أو فائض
    for (const tool of getToolsForDomain('writer')) {
      if (tool.placement === 'context' || tool.placement === 'palette') continue;
      if (tool.reserved) continue;
      expect(allIds.has(tool.id)).toBe(true);
    }
  });

  it('قائمة السياق لكل نطاق قد تكون فارغة لكن معرفة', () => {
    expect(getContextTools('writer').length).toBeGreaterThanOrEqual(3);
    expect(getContextTools('impress').length).toBeGreaterThanOrEqual(1);
  });
});

describe('reserved slots (future-proofing)', () => {
  it('6 محجوزات موزعة: AI + تعاون + ماكرو + رسوم + PDF + إصدارات', () => {
    const reservedIds = TOOL_REGISTRY.filter(t => t.reserved).map(t => t.id);
    expect(reservedIds).toEqual(
      expect.arrayContaining([
        'reserved-ai-assist',
        'reserved-collab',
        'reserved-macro',
        'reserved-charts',
        'reserved-pdf-export',
        'reserved-version-history',
      ]),
    );
  });

  it('كل محجوزة تحمل تلميحاً يوضح مصدرها الجاهز', () => {
    for (const tool of TOOL_REGISTRY.filter(t => t.reserved)) {
      expect(tool.hintAr).toContain('محجوز');
    }
  });

  it('البحث يشمل المحجوزات (شفافية كاملة)', () => {
    expect(searchTools('مساعد').some(t => t.id === 'reserved-ai-assist')).toBe(true);
  });
});

describe('command palette search', () => {
  it('يبحث بالاسم العربي والمعرف والتلميح', () => {
    expect(searchTools('حفظ').some(t => t.id === 'save')).toBe(true);
    expect(searchTools('tafqeet').some(t => t.id === 'tafqeet')).toBe(true);
    expect(searchTools('recalculateAll').some(t => t.id === 'recalculate')).toBe(true);
  });

  it('بحث فارغ يعيد الكل، ولا نتائج = قائمة فارغة', () => {
    expect(searchTools('').length).toBe(TOOL_REGISTRY.length);
    expect(searchTools('xyz-not-found')).toHaveLength(0);
  });
});
