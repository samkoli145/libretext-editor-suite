import { describe, it, expect } from 'vitest';
import {
  detectTextDirection,
  getElementDirection,
  smartAlignByDirection,
} from '../../src/spatial/smart-rtl-alignment';

describe('ALGO-033: smart-rtl-alignment', () => {
  it('detects RTL text', () => {
    expect(detectTextDirection('مرحبا بالعالم')).toBe('rtl');
  });

  it('detects LTR text', () => {
    expect(detectTextDirection('Hello World')).toBe('ltr');
  });

  it('returns ltr for empty text', () => {
    expect(detectTextDirection()).toBe('ltr');
  });

  it('getElementDirection returns rtl for Arabic content', () => {
    const el = {
      id: '1',
      type: 'paragraph' as const,
      domain: 'Writer' as const,
      name: 'test',
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      zIndex: 0,
      contentData: { text: 'نص عربي' },
    };
    expect(getElementDirection(el)).toBe('rtl');
  });

  it('smartAlignByDirection moves RTL elements to right', () => {
    const elements = [
      {
        id: '1',
        type: 'paragraph' as const,
        domain: 'Writer' as const,
        name: 'test',
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        zIndex: 0,
        direction: 'rtl' as const,
      },
    ];
    const result = smartAlignByDirection(elements, ['1'], 800, 'rtl');
    expect(result[0]!.x).toBeGreaterThan(600);
  });

  it('smartAlignByDirection moves LTR elements to left', () => {
    const elements = [
      {
        id: '1',
        type: 'paragraph' as const,
        domain: 'Writer' as const,
        name: 'test',
        x: 700,
        y: 0,
        width: 100,
        height: 50,
        zIndex: 0,
        direction: 'ltr' as const,
      },
    ];
    const result = smartAlignByDirection(elements, ['1'], 800, 'ltr');
    expect(result[0]!.x).toBeLessThanOrEqual(24);
  });
});
