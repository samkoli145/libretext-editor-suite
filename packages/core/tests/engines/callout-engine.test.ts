import { describe, it, expect } from 'vitest';
import { renderCalloutSvg, createCallout } from '../../src/engines/callout-engine';

describe('CORE-ENG-020: callout-engine', () => {
  it('createCallout with defaults', () => {
    const cfg = createCallout('c1', 'Hello', 10, 20);
    expect(cfg.id).toBe('c1');
    expect(cfg.shape).toBe('rounded');
    expect(cfg.color).toBe('info');
    expect(cfg.hasArrow).toBe(true);
  });

  it('createCallout with overrides', () => {
    const cfg = createCallout('c2', 'Warning', 0, 0, {
      color: 'warning',
      shape: 'pill',
      hasArrow: false,
    });
    expect(cfg.color).toBe('warning');
    expect(cfg.shape).toBe('pill');
    expect(cfg.hasArrow).toBe(false);
  });

  it('renderCalloutSvg produces SVG string', () => {
    const cfg = createCallout('c3', 'Test', 0, 0, { width: 200, height: 60 });
    const svg = renderCalloutSvg(cfg);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Test');
  });

  it('renderCalloutSvg includes arrow when hasArrow', () => {
    const cfg = createCallout('c4', 'Arrow', 0, 0, { hasArrow: true, position: 'top' });
    const svg = renderCalloutSvg(cfg);
    expect(svg).toContain('<path');
  });

  it('renderCalloutSvg omits arrow when hasArrow false', () => {
    const cfg = createCallout('c5', 'NoArrow', 0, 0, { hasArrow: false });
    const svg = renderCalloutSvg(cfg);
    expect(svg.split('<path').length).toBe(1);
  });
});
