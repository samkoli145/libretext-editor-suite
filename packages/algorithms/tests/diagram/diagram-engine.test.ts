import { describe, it, expect } from 'vitest';
import { createDiagramEngine } from '../../src/diagram/diagram-engine';

describe('ALGO-037: diagram-engine', () => {
  it('adds and counts nodes', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 0, y: 0, width: 100, height: 50, label: 'A' });
    engine.addNode({ id: 'b', type: 'rect', x: 200, y: 0, width: 100, height: 50, label: 'B' });
    expect(engine.getNodeCount()).toBe(2);
  });

  it('removes node and connected edges', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 0, y: 0, width: 100, height: 50, label: 'A' });
    engine.addNode({ id: 'b', type: 'rect', x: 200, y: 0, width: 100, height: 50, label: 'B' });
    engine.addEdge({ id: 'e1', fromId: 'a', toId: 'b' });
    engine.removeNode('a');
    expect(engine.getNodeCount()).toBe(1);
    const layout = engine.toLayout();
    expect(layout.edges).toHaveLength(0);
  });

  it('toSvg generates valid SVG', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 0, y: 0, width: 100, height: 50, label: 'Start' });
    engine.addNode({ id: 'b', type: 'rect', x: 200, y: 0, width: 100, height: 50, label: 'End' });
    engine.addEdge({ id: 'e1', fromId: 'a', toId: 'b' });
    const svg = engine.toSvg();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Start');
    expect(svg).toContain('End');
  });

  it('autoLayout repositions nodes', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 500, y: 500, width: 100, height: 50, label: 'A' });
    engine.addNode({ id: 'b', type: 'rect', x: 500, y: 500, width: 100, height: 50, label: 'B' });
    engine.autoLayout();
    const layout = engine.toLayout();
    expect(layout.nodes[0]!.x).not.toBe(layout.nodes[1]!.x);
  });

  it('updateNode changes properties', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 0, y: 0, width: 100, height: 50, label: 'Old' });
    engine.updateNode('a', { label: 'New' });
    const layout = engine.toLayout();
    expect(layout.nodes[0]!.label).toBe('New');
  });

  it('clear empties everything', () => {
    const engine = createDiagramEngine();
    engine.addNode({ id: 'a', type: 'rect', x: 0, y: 0, width: 100, height: 50, label: 'A' });
    engine.clear();
    expect(engine.getNodeCount()).toBe(0);
  });
});
