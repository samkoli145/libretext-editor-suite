/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: diagram-engine.ts
 * 📂 المسار: packages/algorithms/src/diagram/diagram-engine.ts
 * 🎯 الهدف الرئيسي: محرك رسومات SVG المتجهية للمخططات
 *    مع دعم العقد والحواف والتخطيط الأوتوماتيكي.
 * 🏷️ المعرف: ALGO-037
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface DiagramNode {
  readonly id: string;
  readonly type: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly label: string;
  readonly color?: string;
}

export interface DiagramEdge {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly label?: string;
  readonly style?: 'solid' | 'dashed' | 'dotted';
}

export interface DiagramLayout {
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly viewBox: string;
}

function centerOf(node: DiagramNode): { x: number; y: number } {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}

function pathBetween(from: DiagramNode, to: DiagramNode): string {
  const fc = centerOf(from);
  const tc = centerOf(to);
  const mx = (fc.x + tc.x) / 2;
  return `M ${fc.x} ${fc.y} Q ${mx} ${fc.y} ${tc.x} ${tc.y}`;
}

function calcViewBox(nodes: readonly DiagramNode[]): string {
  if (nodes.length === 0) return '0 0 100 100';
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + n.width > maxX) maxX = n.x + n.width;
    if (n.y + n.height > maxY) maxY = n.y + n.height;
  }
  const pad = 40;
  return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
}

function layoutTree(nodes: readonly DiagramNode[], gap = 60): readonly DiagramNode[] {
  if (nodes.length === 0) return [];
  const sorted = [...nodes].sort((a, b) => a.y - b.y);
  return sorted.map((n, i) => ({ ...n, x: i * (n.width + gap), y: n.y }));
}

export function createDiagramEngine() {
  let nodes: DiagramNode[] = [];
  let edges: DiagramEdge[] = [];

  function addNode(node: DiagramNode): void { nodes = [...nodes, node]; }
  function addEdge(edge: DiagramEdge): void { edges = [...edges, edge]; }
  function removeNode(id: string): void { nodes = nodes.filter(n => n.id !== id); edges = edges.filter(e => e.fromId !== id && e.toId !== id); }
  function updateNode(id: string, props: Partial<Pick<DiagramNode, 'x' | 'y' | 'width' | 'height' | 'label' | 'color'>>): void {
    nodes = nodes.map(n => n.id === id ? { ...n, ...props } : n);
  }
  function autoLayout(): DiagramLayout {
    const laid = layoutTree(nodes);
    nodes = [...laid];
    return toLayout();
  }
  function toLayout(): DiagramLayout {
    return { nodes, edges, viewBox: calcViewBox(nodes) };
  }
  function toSvg(): string {
    const layout = toLayout();
    const lines = [`<svg viewBox="${layout.viewBox}" xmlns="http://www.w3.org/2000/svg">`];
    for (const e of layout.edges) {
      const from = layout.nodes.find(n => n.id === e.fromId);
      const to = layout.nodes.find(n => n.id === e.toId);
      if (from && to) {
        const dash = e.style === 'dashed' ? ' stroke-dasharray="6 4"' : e.style === 'dotted' ? ' stroke-dasharray="2 4"' : '';
        lines.push(`  <path d="${pathBetween(from, to)}" fill="none" stroke="#64748b" stroke-width="2"${dash}/>`);
      }
    }
    for (const n of layout.nodes) {
      const fill = n.color || '#f8fafc';
      lines.push(`  <rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="${fill}" stroke="#94a3b8"/>`);
      lines.push(`  <text x="${n.x + n.width / 2}" y="${n.y + n.height / 2 + 4}" text-anchor="middle" font-size="14" fill="#1e293b">${n.label}</text>`);
    }
    lines.push('</svg>');
    return lines.join('\n');
  }
  function clear(): void { nodes = []; edges = []; }
  function getNodeCount(): number { return nodes.length; }

  return { addNode, addEdge, removeNode, updateNode, autoLayout, toLayout, toSvg, clear, getNodeCount };
}
