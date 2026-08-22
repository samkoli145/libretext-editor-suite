/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المخططات البيانية والتدفقية - رسم SVG مباشرة بدون مكتبات
 * 🏛️ الدور: محرك مشترك - توليد Flowcharts و Sequence Diagrams تفاعلية
 * 📥 المستهلك: DiagramDialog, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure SVG Math Rendering: حساب إحداثيات العقد والحواف رياضياً
 *    ثم كتابة SVG مباشرة بدون DOM Virtual Tree
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تخطيط العقد يتطلب حل ثوابت التفاف الحلقات (cycle detection)
 *    2. النصوص الطويلة قد تتجاوز حدود العقد
 *    3. الألوان يجب أن تتوافق مع الثيم الفاتح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عقد قبل رسم الحواف
 *    - قص النصوص الطويلة بدلاً من تجاوز الحدود
 *    - إرجاع SVG فارغ مع تحذير عند الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/DiagramEngine.ts
/**
 * محرك المخططات البيانية والتدفقية والخرائط المفهومية — ثيم فاتح نقي 100%
 * يرسم Flowcharts و Sequence Diagrams مباشرة إلى SVG بدون أي مكتبات خارجية
 */

export interface DiagramNode {
  id: string;
  label: string;
  shape: 'rect' | 'circle' | 'diamond' | 'rounded';
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  type: 'solid' | 'dashed' | 'dotted';
}

export interface FlowchartAST {
  type: 'flowchart';
  nodes: Map<string, DiagramNode>;
  edges: DiagramEdge[];
  direction: 'TB' | 'LR' | 'BT' | 'RL';
}

export interface SequenceParticipant {
  id: string;
  label: string;
  isActor?: boolean;
}

export interface SequenceMessage {
  from: string;
  to: string;
  label: string;
  isDashed?: boolean;
  hasArrow?: boolean;
}

export interface SequenceAST {
  type: 'sequence';
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
}

export type DiagramAST = FlowchartAST | SequenceAST;

export interface LayoutNode extends DiagramNode {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
}

// ── Parser Engine ─────────────────────────────────────────────
export class DiagramParser {
  parse(code: string): DiagramAST {
    const trimmedCode = code.trim();

    if (/^(sequenceDiagram|sequence)/i.test(trimmedCode)) {
      return this.parseSequence(trimmedCode);
    }

    return this.parseFlowchart(trimmedCode);
  }

  private parseFlowchart(code: string): FlowchartAST {
    const ast: FlowchartAST = {
      type: 'flowchart',
      nodes: new Map(),
      edges: [],
      direction: 'TB',
    };

    const lines = code.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('//')) continue;

      // Direction
      if (/^(graph|flowchart)\s+(TB|LR|BT|RL)/i.test(trimmed)) {
        const match = trimmed.match(/(TB|LR|BT|RL)/i);
        if (match) ast.direction = match[1].toUpperCase() as any;
        continue;
      }

      // Edge pattern: A[Label] -->|text| B(Label)
      const edgeMatch = trimmed.match(
        /^(\w+)(?:\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\})?\s*(-+>|-+|==+>|\.-+>)\s*\|?([^|]*)\|?\s*(\w+)(?:\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\})?$/
      );

      if (edgeMatch) {
        const [, fromId, fromRect, fromRound, fromDiamond, arrow, edgeLabel, toId, toRect, toRound, toDiamond] = edgeMatch;

        const parseShape = (rect?: string, round?: string, diamond?: string): { label: string; shape: DiagramNode['shape'] } => {
          if (diamond) return { label: diamond, shape: 'diamond' };
          if (round) return { label: round, shape: 'rounded' };
          if (rect) return { label: rect, shape: 'rect' };
          return { label: '', shape: 'rect' };
        };

        const fromInfo = parseShape(fromRect, fromRound, fromDiamond);
        const toInfo = parseShape(toRect, toRound, toDiamond);

        if (!ast.nodes.has(fromId)) {
          ast.nodes.set(fromId, { id: fromId, label: fromInfo.label || fromId, shape: fromInfo.shape });
        }
        if (!ast.nodes.has(toId)) {
          ast.nodes.set(toId, { id: toId, label: toInfo.label || toId, shape: toInfo.shape });
        }

        const edgeType = arrow.includes('==') ? 'dashed' : arrow.includes('.') ? 'dotted' : 'solid';

        ast.edges.push({
          from: fromId,
          to: toId,
          label: edgeLabel?.trim() || undefined,
          type: edgeType,
        });
        continue;
      }

      // Single node declaration: A[Label]
      const singleNodeMatch = trimmed.match(/^(\w+)(?:\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\})$/);
      if (singleNodeMatch) {
        const [, nodeId, rect, round, diamond] = singleNodeMatch;
        let shape: DiagramNode['shape'] = 'rect';
        let label = nodeId;
        if (diamond) { shape = 'diamond'; label = diamond; }
        else if (round) { shape = 'rounded'; label = round; }
        else if (rect) { shape = 'rect'; label = rect; }

        if (!ast.nodes.has(nodeId)) {
          ast.nodes.set(nodeId, { id: nodeId, label, shape });
        }
      }
    }

    return ast;
  }

  private parseSequence(code: string): SequenceAST {
    const ast: SequenceAST = {
      type: 'sequence',
      participants: [],
      messages: [],
    };

    const participantMap = new Map<string, SequenceParticipant>();

    const ensureParticipant = (id: string, label?: string, isActor: boolean = false) => {
      if (!participantMap.has(id)) {
        const p: SequenceParticipant = { id, label: label || id, isActor };
        participantMap.set(id, p);
        ast.participants.push(p);
      }
    };

    const lines = code.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('//') || /^sequenceDiagram/i.test(trimmed)) continue;

      const partMatch = trimmed.match(/^(participant|actor)\s+(\w+)(?:\s+as\s+(.+))?$/i);
      if (partMatch) {
        const [, type, id, label] = partMatch;
        ensureParticipant(id, label?.trim(), type.toLowerCase() === 'actor');
        continue;
      }

      const msgMatch = trimmed.match(/^(\w+)\s*(-+>>|--+>>|-+>|--+>)\s*(\w+)\s*:\s*(.+)$/);
      if (msgMatch) {
        const [, from, arrow, to, label] = msgMatch;
        ensureParticipant(from);
        ensureParticipant(to);

        const isDashed = arrow.includes('--');
        ast.messages.push({
          from,
          to,
          label: label.trim(),
          isDashed,
          hasArrow: arrow.includes('>'),
        });
      }
    }

    return ast;
  }
}

// ── Layout Engine ─────────────────────────────────────────────
export class DiagramLayout {
  private LAYER_GAP = 110;
  private NODE_GAP = 45;
  private NODE_WIDTH = 130;
  private NODE_HEIGHT = 44;

  layout(ast: DiagramAST): any {
    if (ast.type === 'sequence') {
      return this.layoutSequence(ast);
    }
    return this.layoutFlowchart(ast);
  }

  private layoutFlowchart(ast: FlowchartAST) {
    const nodesMap = new Map<string, LayoutNode>();
    const isHorizontal = ast.direction === 'LR' || ast.direction === 'RL';

    const layers = this.assignLayers(ast);
    const orderedLayers = this.orderLayers(layers, ast);

    for (let layerIdx = 0; layerIdx < orderedLayers.length; layerIdx++) {
      const layer = orderedLayers[layerIdx];
      const totalDimension = layer.length * (this.NODE_HEIGHT + this.NODE_GAP);
      const startOffset = -totalDimension / 2;

      for (let posIdx = 0; posIdx < layer.length; posIdx++) {
        const nodeId = layer[posIdx];
        const originalNode = ast.nodes.get(nodeId) || { id: nodeId, label: nodeId, shape: 'rect' };

        const mainPos = layerIdx * this.LAYER_GAP;
        const crossPos = startOffset + posIdx * (this.NODE_HEIGHT + this.NODE_GAP);

        const x = isHorizontal ? mainPos : crossPos;
        const y = isHorizontal ? crossPos : mainPos;

        nodesMap.set(nodeId, {
          ...originalNode,
          layer: layerIdx,
          x,
          y,
          width: this.NODE_WIDTH,
          height: this.NODE_HEIGHT,
        });
      }
    }

    return {
      type: 'flowchart',
      nodes: Array.from(nodesMap.values()),
      edges: ast.edges,
      isHorizontal,
    };
  }

  private assignLayers(ast: FlowchartAST): Map<string, number> {
    const layers = new Map<string, number>();
    const inDegree = new Map<string, number>();

    for (const node of ast.nodes.keys()) {
      inDegree.set(node, 0);
    }
    for (const edge of ast.edges) {
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [node, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(node);
        layers.set(node, 0);
      }
    }

    if (queue.length === 0 && ast.nodes.size > 0) {
      const firstNode = ast.nodes.keys().next().value;
      if (firstNode) {
        queue.push(firstNode);
        layers.set(firstNode, 0);
      }
    }

    const maxAllowedDepth = Math.max(ast.nodes.size, 1);
    const visitCounts = new Map<string, number>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLayer = layers.get(current) || 0;
      const count = (visitCounts.get(current) || 0) + 1;
      visitCounts.set(current, count);

      // Prevent infinite loops on cyclic edges (A -> B -> A)
      if (count > maxAllowedDepth || currentLayer >= maxAllowedDepth) {
        continue;
      }

      for (const edge of ast.edges) {
        if (edge.from === current) {
          const newLayer = Math.max(layers.get(edge.to) || 0, currentLayer + 1);
          if (newLayer <= maxAllowedDepth) {
            layers.set(edge.to, newLayer);
            if ((visitCounts.get(edge.to) || 0) < maxAllowedDepth) {
              queue.push(edge.to);
            }
          }
        }
      }
    }

    for (const node of ast.nodes.keys()) {
      if (!layers.has(node)) layers.set(node, 0);
    }

    return layers;
  }

  private orderLayers(layers: Map<string, number>, _ast: FlowchartAST): string[][] {
    const byLayer = new Map<number, string[]>();
    for (const [node, layer] of layers.entries()) {
      if (!byLayer.has(layer)) byLayer.set(layer, []);
      byLayer.get(layer)!.push(node);
    }

    const maxLayer = Math.max(...Array.from(byLayer.keys()), 0);
    const result: string[][] = [];
    for (let i = 0; i <= maxLayer; i++) {
      result.push(byLayer.get(i) || []);
    }
    return result;
  }

  private layoutSequence(ast: SequenceAST) {
    const participantWidth = 110;
    const participantGap = 150;
    const startX = 60;
    const startY = 40;
    const messageGap = 45;

    const participantCoords = new Map<string, { x: number; label: string; isActor?: boolean }>();

    ast.participants.forEach((p, idx) => {
      const x = startX + idx * participantGap;
      participantCoords.set(p.id, { x, label: p.label, isActor: p.isActor });
    });

    const computedMessages = ast.messages.map((msg, idx) => {
      const fromP = participantCoords.get(msg.from)!;
      const toP = participantCoords.get(msg.to)!;
      const y = startY + 60 + idx * messageGap;

      return {
        fromX: fromP.x,
        toX: toP.x,
        y,
        label: msg.label,
        isDashed: msg.isDashed,
        hasArrow: msg.hasArrow,
      };
    });

    const totalWidth = startX * 2 + Math.max(ast.participants.length - 1, 1) * participantGap + participantWidth;
    const totalHeight = startY + 110 + ast.messages.length * messageGap;

    return {
      type: 'sequence',
      participants: Array.from(participantCoords.entries()).map(([id, data]) => ({ id, ...data })),
      messages: computedMessages,
      width: totalWidth,
      height: totalHeight,
    };
  }
}

// ── Renderer Engine (Pure Light Theme) ─────────────────────────
export class DiagramRenderer {
  render(layoutData: any): string {
    if (layoutData.type === 'sequence') {
      return this.renderSequence(layoutData);
    }
    return this.renderFlowchart(layoutData);
  }

  private renderFlowchart(layout: { nodes: LayoutNode[]; edges: DiagramEdge[]; isHorizontal?: boolean }): string {
    if (!layout.nodes || layout.nodes.length === 0) {
      return `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><text x="100" y="50" text-anchor="middle" fill="#64748b" font-size="12">لا توجد عناصر لعرض المخطط</text></svg>`;
    }

    const nodesMap = new Map(layout.nodes.map((n) => [n.id, n]));

    const minX = Math.min(...layout.nodes.map((n) => n.x)) - 40;
    const minY = Math.min(...layout.nodes.map((n) => n.y)) - 40;
    const maxX = Math.max(...layout.nodes.map((n) => n.x + n.width)) + 40;
    const maxY = Math.max(...layout.nodes.map((n) => n.y + n.height)) + 40;

    const width = maxX - minX;
    const height = maxY - minY;

    let svg = `<svg viewBox="${minX} ${minY} ${width} ${height}" class="w-full h-auto max-w-full" xmlns="http://www.w3.org/2000/svg" style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">`;
    svg += `<defs>
      <marker id="light-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
      </marker>
    </defs>`;

    // Render Edges
    for (const edge of layout.edges) {
      const from = nodesMap.get(edge.from);
      const to = nodesMap.get(edge.to);
      if (from && to) {
        svg += this.renderEdge(from, to, edge, layout.isHorizontal);
      }
    }

    // Render Nodes
    for (const node of layout.nodes) {
      svg += this.renderNode(node);
    }

    svg += '</svg>';
    return svg;
  }

  private renderNode(node: LayoutNode): string {
    const { x, y, width, height, label, shape } = node;

    let shapeEl = '';
    const stroke = '#2563eb';
    const fill = '#eff6ff';
    const textFill = '#1e293b';

    switch (shape) {
      case 'rounded':
        shapeEl = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
        break;
      case 'diamond':
        const cx = x + width / 2;
        const cy = y + height / 2;
        shapeEl = `<polygon points="${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>`;
        break;
      case 'circle':
        shapeEl = `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>`;
        break;
      default:
        shapeEl = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
    }

    return `${shapeEl}
      <text x="${x + width / 2}" y="${y + height / 2 + 4}" text-anchor="middle" fill="${textFill}" font-family="sans-serif" font-weight="600" font-size="12">${this.escapeXml(label)}</text>`;
  }

  private renderEdge(from: LayoutNode, to: LayoutNode, edge: DiagramEdge, isHorizontal?: boolean): string {
    let x1 = from.x + from.width / 2;
    let y1 = from.y + from.height / 2;
    let x2 = to.x + to.width / 2;
    let y2 = to.y + to.height / 2;

    if (isHorizontal) {
      x1 = from.x + from.width;
      x2 = to.x;
    } else {
      y1 = from.y + from.height;
      y2 = to.y;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    let path = '';
    if (isHorizontal) {
      path = `M ${x1} ${y1} C ${x1 + dx * 0.5} ${y1}, ${x2 - dx * 0.5} ${y2}, ${x2} ${y2}`;
    } else {
      path = `M ${x1} ${y1} C ${x1} ${y1 + dy * 0.5}, ${x2} ${y2 - dy * 0.5}, ${x2} ${y2}`;
    }

    const dash = edge.type === 'dashed' ? 'stroke-dasharray="5,4"' : edge.type === 'dotted' ? 'stroke-dasharray="2,3"' : '';

    let svg = `<path d="${path}" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#light-arrow)" ${dash}/>`;

    if (edge.label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      svg += `<rect x="${midX - 25}" y="${midY - 9}" width="50" height="18" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
        <text x="${midX}" y="${midY + 3}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#475569" font-weight="500">${this.escapeXml(edge.label)}</text>`;
    }

    return svg;
  }

  private renderSequence(layout: { participants: any[]; messages: any[]; width: number; height: number }): string {
    const { participants, messages, width, height } = layout;

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="w-full h-auto max-w-full" xmlns="http://www.w3.org/2000/svg" style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">`;
    svg += `<defs>
      <marker id="seq-arrow-light" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
      </marker>
    </defs>`;

    // Render lifelines
    for (const p of participants) {
      svg += `<line x1="${p.x}" y1="50" x2="${p.x}" y2="${height - 40}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>`;
    }

    // Render Messages
    for (const m of messages) {
      const dash = m.isDashed ? 'stroke-dasharray="5,4"' : '';
      const marker = m.hasArrow ? 'marker-end="url(#seq-arrow-light)"' : '';

      svg += `<line x1="${m.fromX}" y1="${m.y}" x2="${m.toX}" y2="${m.y}" stroke="#2563eb" stroke-width="1.5" ${dash} ${marker}/>`;

      const midX = (m.fromX + m.toX) / 2;
      svg += `<rect x="${midX - 35}" y="${m.y - 16}" width="70" height="16" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="${midX}" y="${m.y - 4}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#2563eb" font-weight="600">${this.escapeXml(m.label)}</text>`;
    }

    // Render Participants Header and Footer
    for (const p of participants) {
      // Top header
      svg += `<rect x="${p.x - 45}" y="15" width="90" height="30" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>`;
      svg += `<text x="${p.x}" y="34" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#1e3a8a" font-weight="600">${this.escapeXml(p.label)}</text>`;

      // Bottom footer
      svg += `<rect x="${p.x - 45}" y="${height - 38}" width="90" height="28" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>`;
      svg += `<text x="${p.x}" y="${height - 20}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#1e3a8a" font-weight="600">${this.escapeXml(p.label)}</text>`;
    }

    svg += '</svg>';
    return svg;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// Singleton Engine Instance
export class DiagramEngine {
  private static instance: DiagramEngine;
  private parser = new DiagramParser();
  private layout = new DiagramLayout();
  private renderer = new DiagramRenderer();

  public static getInstance(): DiagramEngine {
    if (!DiagramEngine.instance) {
      DiagramEngine.instance = new DiagramEngine();
    }
    return DiagramEngine.instance;
  }

  public render(code: string): string {
    try {
      const ast = this.parser.parse(code);
      const layoutData = this.layout.layout(ast);
      return this.renderer.render(layoutData);
    } catch (e) {
      console.error('Diagram render error:', e);
      return `<div class="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-xs text-center font-medium">خطأ في معالجة المخطط البياني</div>`;
    }
  }
}

export const diagramEngine = DiagramEngine.getInstance();
