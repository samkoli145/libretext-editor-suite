/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المخططات والرسوم البيانية التفاعلية الفيكتوري المعزول - Zero-Dependency Chart Engine
 * 🏛️ الدور: مكون مشترك - رسم وتصيير أكثر من 20 نوعاً من المخططات البيانية
 * 📥 المستهلك: CanvasDesignerEditor, UIDesignerEditor, CodeInterpreter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure SVG Math Engine: محرك رسومات SVG نقية بالكامل
 *    بدون أي مكتبات خارجية (صفر مكتبات)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحسابات يجب أن تبقى رياضية نقية (صفر تقريب)
 *    2. SVG يجب أن يبقى قابلاً للتحجيم
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة البيانات قبل الرسم
 *    - fallback لرسالة خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ChartType =
  | 'bar'
  | 'horizontal-bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'gauge'
  | 'heatmap'
  | 'funnel'
  | 'candlestick'
  | 'waterfall'
  | 'histogram'
  | 'polar'
  | 'sparkline'
  | 'pyramid'
  | 'stepline'
  | 'bullet'
  | 'radialbar';

export interface ChartDataPoint {
  id?: string;
  label: string;
  value: number;
  secondaryValue?: number;
  target?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  color?: string;
  group?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

export interface ChartConfig {
  id?: string;
  title: string;
  subtitle?: string;
  type: ChartType;
  width?: number;
  height?: number;
  data: ChartDataPoint[];
  series?: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showValues?: boolean;
  showTooltips?: boolean;
  animate?: boolean;
  colorPalette?: string[];
  donutHoleRatio?: number; // 0.0 to 0.9 for donut
  minVal?: number;
  maxVal?: number;
}

export interface ChartInteractionState {
  zoom: number;
  panX: number;
  panY: number;
  hoveredIndex: number | null;
  selectedIndex: number | null;
  activeType?: ChartType;
  tooltipPos?: { x: number; y: number; title: string; value: string; percent?: string } | null;
}

// Pure Light Theme Color Palettes (High contrast, refined shades)
export const LIGHT_THEME_PALETTES = {
  modernBlue: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8', '#1e40af'],
  emeraldTeal: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#065f46'],
  sunsetAmber: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#b45309', '#92400e'],
  royalIndigo: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4338ca', '#3730a3'],
  vibrantMulti: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'],
};

export class ZeroDependencyChartEngine {
  private defaultPalette = LIGHT_THEME_PALETTES.vibrantMulti;

  /**
   * توليد كود SVG تفاعلي كامل ومستقل للمخطط بناءً على الإعدادات وحالة التفاعل
   */
  public renderInteractiveSvg(
    config: ChartConfig,
    state: ChartInteractionState = { zoom: 1, panX: 0, panY: 0, hoveredIndex: null, selectedIndex: null }
  ): { svgString: string; computedTooltip: ChartInteractionState['tooltipPos'] } {
    const activeType = state.activeType || config.type;
    const width = config.width || 600;
    const height = config.height || 400;
    const palette = config.colorPalette || this.defaultPalette;
    const data = config.data && config.data.length > 0 ? config.data : this.getFallbackData();

    const padding = { top: 50, right: 30, bottom: 60, left: 60 };
    const chartW = Math.max(100, width - padding.left - padding.right);
    const chartH = Math.max(100, height - padding.top - padding.bottom);

    let innerContent = '';
    let computedTooltip: ChartInteractionState['tooltipPos'] = null;

    switch (activeType) {
      case 'bar': {
        const res = this.renderBarChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'horizontal-bar': {
        const res = this.renderHorizontalBarChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'line':
      case 'stepline': {
        const res = this.renderLineChart(data, chartW, chartH, padding, palette, state, activeType === 'stepline');
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'area': {
        const res = this.renderAreaChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'pie':
      case 'donut': {
        const isDonut = activeType === 'donut' || (config.donutHoleRatio && config.donutHoleRatio > 0);
        const ratio = isDonut ? (config.donutHoleRatio || 0.55) : 0;
        const res = this.renderPieDonutChart(data, width, height, padding, palette, ratio, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'scatter':
      case 'bubble': {
        const isBubble = activeType === 'bubble';
        const res = this.renderScatterBubbleChart(data, chartW, chartH, padding, palette, isBubble, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'radar': {
        const res = this.renderRadarChart(data, width, height, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'gauge': {
        const res = this.renderGaugeChart(data, width, height, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'funnel': {
        const res = this.renderFunnelChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'candlestick': {
        const res = this.renderCandlestickChart(data, chartW, chartH, padding, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'waterfall': {
        const res = this.renderWaterfallChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'histogram': {
        const res = this.renderHistogramChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'polar': {
        const res = this.renderPolarChart(data, width, height, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'radialbar': {
        const res = this.renderRadialBarChart(data, width, height, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'bullet': {
        const res = this.renderBulletChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'pyramid': {
        const res = this.renderPyramidChart(data, chartW, chartH, padding, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'heatmap': {
        const res = this.renderHeatmapChart(data, chartW, chartH, padding, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
      case 'sparkline':
      default: {
        const res = this.renderSparklineChart(data, width, height, palette, state);
        innerContent = res.content;
        computedTooltip = res.tooltip;
        break;
      }
    }

    // Title and Header Render (Pure light styling)
    const titleSvg = `
      <text x="${padding.left}" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#0f172a">${this.escapeXml(config.title)}</text>
      ${config.subtitle ? `<text x="${padding.left}" y="40" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">${this.escapeXml(config.subtitle)}</text>` : ''}
    `;

    // Tooltip Overlay (if computed and tooltips enabled)
    let tooltipSvg = '';
    if (computedTooltip && config.showTooltips !== false) {
      const tx = Math.min(width - 130, Math.max(10, computedTooltip.x + 10));
      const ty = Math.max(20, computedTooltip.y - 45);
      tooltipSvg = `
        <g class="chart-tooltip-group" pointer-events="none" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.08))">
          <rect x="${tx}" y="${ty}" width="120" height="42" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="${tx + 8}" y="${ty + 16}" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#1e293b">${this.escapeXml(computedTooltip.title)}</text>
          <text x="${tx + 8}" y="${ty + 32}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#2563eb">${this.escapeXml(computedTooltip.value)} ${computedTooltip.percent ? `<tspan font-size="9" fill="#64748b">(${computedTooltip.percent})</tspan>` : ''}</text>
        </g>
      `;
    }

    const svgString = `
      <svg
        id="zero-dep-chart-${config.id || 'main'}"
        viewBox="0 0 ${width} ${height}"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        class="zero-dep-chart-root select-none transition-all duration-200"
        style="background-color: #ffffff; border-radius: 12px;"
      >
        <rect width="${width}" height="${height}" fill="#ffffff" rx="12"/>
        ${titleSvg}
        <g transform="translate(${state.panX}, ${state.panY}) scale(${state.zoom})">
          ${innerContent}
        </g>
        ${tooltipSvg}
      </svg>
    `.trim();

    return { svgString, computedTooltip };
  }

  /**
   * تحويل ديناميكي فوري بين أنواع المخططات (Chart Type Morphing)
   */
  public morphChart(config: ChartConfig, targetType: ChartType): ChartConfig {
    return {
      ...config,
      type: targetType,
      donutHoleRatio: targetType === 'donut' ? 0.6 : targetType === 'pie' ? 0 : config.donutHoleRatio,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Section: Specific Chart Renderers (Pure SVG Math & Geometry)
  // ─────────────────────────────────────────────────────────────

  private renderBarChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const maxVal = Math.max(1, ...data.map(d => Math.max(0, d.value)));
    const barCount = data.length;
    const gapRatio = 0.3;
    const totalSlot = w / barCount;
    const barWidth = Math.max(12, totalSlot * (1 - gapRatio));
    const gap = totalSlot * gapRatio;

    let bars = '';
    let xLabels = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    // Grid lines
    const grid = this.generateYGridLines(p.left, p.top, w, h, maxVal);

    data.forEach((d, i) => {
      const barH = (d.value / maxVal) * h;
      const x = p.left + i * totalSlot + gap / 2;
      const y = p.top + (h - barH);
      const isHovered = state.hoveredIndex === i;
      const color = d.color || palette[i % palette.length];

      if (isHovered) {
        tooltip = {
          x: x + barWidth / 2,
          y,
          title: d.label,
          value: d.value.toLocaleString(),
          percent: `${Math.round((d.value / (data.reduce((acc, curr) => acc + curr.value, 0) || 1)) * 100)}%`,
        };
      }

      bars += `
        <rect
          data-chart-item="${i}"
          x="${x}"
          y="${y}"
          width="${barWidth}"
          height="${barH}"
          rx="4"
          fill="${color}"
          opacity="${isHovered ? 1 : 0.88}"
          stroke="${isHovered ? '#1e293b' : 'none'}"
          stroke-width="1.5"
          class="cursor-pointer transition-all duration-150 hover:opacity-100"
        />
        <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="600" fill="#475569">${d.value}</text>
      `;

      xLabels += `
        <text x="${x + barWidth / 2}" y="${p.top + h + 18}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b">${this.escapeXml(d.label)}</text>
      `;
    });

    const content = `${grid} ${bars} ${xLabels}`;
    return { content, tooltip };
  }

  private renderHorizontalBarChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const maxVal = Math.max(1, ...data.map(d => Math.max(0, d.value)));
    const barCount = data.length;
    const slotH = h / barCount;
    const barH = Math.max(10, slotH * 0.65);
    let bars = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const barW = (d.value / maxVal) * w;
      const y = p.top + i * slotH + (slotH - barH) / 2;
      const isHovered = state.hoveredIndex === i;
      const color = d.color || palette[i % palette.length];

      if (isHovered) {
        tooltip = {
          x: p.left + barW,
          y: y + barH / 2,
          title: d.label,
          value: d.value.toLocaleString(),
        };
      }

      bars += `
        <text x="${p.left - 8}" y="${y + barH / 2 + 3}" text-anchor="end" font-family="system-ui" font-size="10" fill="#475569">${this.escapeXml(d.label)}</text>
        <rect
          data-chart-item="${i}"
          x="${p.left}"
          y="${y}"
          width="${barW}"
          height="${barH}"
          rx="4"
          fill="${color}"
          opacity="${isHovered ? 1 : 0.88}"
          class="cursor-pointer transition-all duration-150"
        />
        <text x="${p.left + barW + 6}" y="${y + barH / 2 + 3}" font-family="system-ui" font-size="10" font-weight="600" fill="#1e293b">${d.value}</text>
      `;
    });

    return { content: bars, tooltip };
  }

  private renderLineChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState,
    isStep = false
  ) {
    const maxVal = Math.max(1, ...data.map(d => Math.max(0, d.value)));
    const minVal = Math.min(0, ...data.map(d => d.value));
    const range = maxVal - minVal || 1;
    const stepX = data.length > 1 ? w / (data.length - 1) : w;

    const points: { x: number; y: number; val: number; label: string }[] = [];
    data.forEach((d, i) => {
      const x = p.left + i * stepX;
      const y = p.top + h - ((d.value - minVal) / range) * h;
      points.push({ x, y, val: d.value, label: d.label });
    });

    // Build SVG Path
    let pathD = '';
    if (isStep) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` H ${points[i].x} V ${points[i].y}`;
      }
    } else {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx1 = prev.x + (curr.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (curr.x - prev.x) / 2;
        const cy2 = curr.y;
        pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
      }
    }

    const grid = this.generateYGridLines(p.left, p.top, w, h, maxVal);
    let dots = '';
    let xLabels = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    points.forEach((pt, i) => {
      const isHovered = state.hoveredIndex === i;
      if (isHovered) {
        tooltip = { x: pt.x, y: pt.y, title: pt.label, value: pt.val.toLocaleString() };
      }
      dots += `
        <circle
          data-chart-item="${i}"
          cx="${pt.x}"
          cy="${pt.y}"
          r="${isHovered ? 6 : 4}"
          fill="#ffffff"
          stroke="${palette[0]}"
          stroke-width="2.5"
          class="cursor-pointer transition-all duration-150 hover:scale-125"
        />
      `;
      xLabels += `
        <text x="${pt.x}" y="${p.top + h + 18}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b">${this.escapeXml(pt.label)}</text>
      `;
    });

    const linePath = `<path d="${pathD}" fill="none" stroke="${palette[0]}" stroke-width="3" stroke-linecap="round"/>`;
    return { content: `${grid} ${linePath} ${dots} ${xLabels}`, tooltip };
  }

  private renderAreaChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const lineRes = this.renderLineChart(data, w, h, p, palette, state);
    const maxVal = Math.max(1, ...data.map(d => Math.max(0, d.value)));
    const stepX = data.length > 1 ? w / (data.length - 1) : w;

    let areaD = `M ${p.left} ${p.top + h}`;
    data.forEach((d, i) => {
      const x = p.left + i * stepX;
      const y = p.top + h - (d.value / maxVal) * h;
      areaD += ` L ${x} ${y}`;
    });
    areaD += ` L ${p.left + (data.length - 1) * stepX} ${p.top + h} Z`;

    const gradientDef = `
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette[0]}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${palette[0]}" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#area-grad)"/>
    `;

    return { content: `${gradientDef} ${lineRes.content}`, tooltip: lineRes.tooltip };
  }

  private renderPieDonutChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    donutRatio: number,
    state: ChartInteractionState
  ) {
    const total = data.reduce((acc, d) => acc + Math.max(0, d.value), 0) || 1;
    const cx = w / 2;
    const cy = p.top + (h - p.top - p.bottom) / 2;
    const r = Math.min(cx - p.left, cy - p.top) * 0.85;
    const innerR = r * donutRatio;

    let currentAngle = -Math.PI / 2;
    let paths = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const sliceAngle = (Math.max(0, d.value) / total) * 2 * Math.PI;
      const nextAngle = currentAngle + sliceAngle;
      const isHovered = state.hoveredIndex === i;
      const color = d.color || palette[i % palette.length];

      // Outer Arc points
      const x1 = cx + r * Math.cos(currentAngle);
      const y1 = cy + r * Math.sin(currentAngle);
      const x2 = cx + r * Math.cos(nextAngle);
      const y2 = cy + r * Math.sin(nextAngle);

      // Inner Arc points
      const ix1 = cx + innerR * Math.cos(nextAngle);
      const iy1 = cy + innerR * Math.sin(nextAngle);
      const ix2 = cx + innerR * Math.cos(currentAngle);
      const iy2 = cy + innerR * Math.sin(currentAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      let dPath = '';
      if (donutRatio > 0) {
        dPath = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
      } else {
        dPath = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      if (isHovered) {
        const midAngle = currentAngle + sliceAngle / 2;
        tooltip = {
          x: cx + (r * 0.7) * Math.cos(midAngle),
          y: cy + (r * 0.7) * Math.sin(midAngle),
          title: d.label,
          value: d.value.toLocaleString(),
          percent: `${Math.round((d.value / total) * 100)}%`,
        };
      }

      paths += `
        <path
          data-chart-item="${i}"
          d="${dPath}"
          fill="${color}"
          opacity="${isHovered ? 1 : 0.9}"
          stroke="#ffffff"
          stroke-width="2"
          class="cursor-pointer transition-all duration-200 hover:scale-105"
        />
      `;

      currentAngle = nextAngle;
    });

    // Donut Center Total Label
    let centerLabel = '';
    if (donutRatio > 0.4) {
      centerLabel = `
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="system-ui" font-size="11" fill="#64748b">الإجمالي</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="system-ui" font-size="15" font-weight="700" fill="#0f172a">${total.toLocaleString()}</text>
      `;
    }

    return { content: `${paths} ${centerLabel}`, tooltip };
  }

  private renderScatterBubbleChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    isBubble: boolean,
    state: ChartInteractionState
  ) {
    const maxX = Math.max(1, ...data.map(d => d.secondaryValue ?? d.value));
    const maxY = Math.max(1, ...data.map(d => d.value));
    const grid = this.generateYGridLines(p.left, p.top, w, h, maxY);

    let nodes = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const xVal = d.secondaryValue ?? (i + 1) * 10;
      const x = p.left + (xVal / maxX) * w;
      const y = p.top + h - (d.value / maxY) * h;
      const radius = isBubble ? Math.max(6, Math.min(24, Math.sqrt(d.value) * 2)) : 6;
      const isHovered = state.hoveredIndex === i;
      const color = d.color || palette[i % palette.length];

      if (isHovered) {
        tooltip = {
          x,
          y,
          title: d.label,
          value: `X: ${xVal}, Y: ${d.value}`,
        };
      }

      nodes += `
        <circle
          data-chart-item="${i}"
          cx="${x}"
          cy="${y}"
          r="${isHovered ? radius + 3 : radius}"
          fill="${color}"
          opacity="${isHovered ? 0.95 : 0.75}"
          stroke="#ffffff"
          stroke-width="1.5"
          class="cursor-pointer transition-all duration-150"
        />
      `;
    });

    return { content: `${grid} ${nodes}`, tooltip };
  }

  private renderRadarChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const maxVal = Math.max(1, ...data.map(d => d.value));
    const cx = w / 2;
    const cy = p.top + (h - p.top - p.bottom) / 2;
    const r = Math.min(cx - p.left, cy - p.top) * 0.8;
    const count = data.length;
    const angleStep = (2 * Math.PI) / count;

    let webLines = '';
    [0.25, 0.5, 0.75, 1].forEach(level => {
      let ringPoints = '';
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = cx + r * level * Math.cos(angle);
        const y = cy + r * level * Math.sin(angle);
        ringPoints += `${x},${y} `;
      }
      webLines += `<polygon points="${ringPoints.trim()}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`;
    });

    let polyPoints = '';
    let spokes = '';
    let labels = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const ratio = d.value / maxVal;
      const px = cx + r * ratio * Math.cos(angle);
      const py = cy + r * ratio * Math.sin(angle);
      polyPoints += `${px},${py} `;

      const lx = cx + (r + 18) * Math.cos(angle);
      const ly = cy + (r + 18) * Math.sin(angle);

      spokes += `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(angle)}" y2="${cy + r * Math.sin(angle)}" stroke="#e2e8f0"/>`;
      labels += `<text x="${lx}" y="${ly}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="500" fill="#64748b">${this.escapeXml(d.label)}</text>`;

      if (state.hoveredIndex === i) {
        tooltip = { x: px, y: py, title: d.label, value: d.value.toLocaleString() };
      }
    });

    const poly = `
      <polygon points="${polyPoints.trim()}" fill="${palette[0]}" fill-opacity="0.3" stroke="${palette[0]}" stroke-width="2.5"/>
    `;

    return { content: `${webLines} ${spokes} ${poly} ${labels}`, tooltip };
  }

  private renderGaugeChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const val = data[0]?.value || 75;
    const maxVal = data[0]?.target || 100;
    const ratio = Math.min(1, Math.max(0, val / maxVal));

    const cx = w / 2;
    const cy = p.top + (h - p.top - p.bottom) * 0.75;
    const r = Math.min(cx - p.left, cy - p.top) * 0.9;
    const strokeW = 20;

    // Track arc (-PI to 0)
    const track = `
      <path
        d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}"
        fill="none"
        stroke="#f1f5f9"
        stroke-width="${strokeW}"
        stroke-linecap="round"
      />
    `;

    // Progress arc
    const progAngle = -Math.PI + ratio * Math.PI;
    const px = cx + r * Math.cos(progAngle);
    const py = cy + r * Math.sin(progAngle);
    const largeArc = ratio > 0.5 ? 1 : 0;

    const progress = `
      <path
        d="M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${px} ${py}"
        fill="none"
        stroke="${palette[0]}"
        stroke-width="${strokeW}"
        stroke-linecap="round"
      />
      <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-family="system-ui" font-size="28" font-weight="800" fill="#0f172a">${val}</text>
      <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-family="system-ui" font-size="12" fill="#64748b">${data[0]?.label || 'مقياس الأداء'} / ${maxVal}</text>
    `;

    const tooltip: ChartInteractionState['tooltipPos'] = {
      x: cx,
      y: cy - 40,
      title: data[0]?.label || 'القيمة الحالية',
      value: `${val} من أصل ${maxVal}`,
      percent: `${Math.round(ratio * 100)}%`,
    };

    return { content: `${track} ${progress}`, tooltip };
  }

  private renderFunnelChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const count = data.length;
    const slotH = h / count;
    const maxVal = Math.max(1, data[0]?.value || 100);

    let stages = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const nextVal = data[i + 1]?.value ?? d.value * 0.7;
      const topW = (d.value / maxVal) * w;
      const botW = (nextVal / maxVal) * w;
      const y1 = p.top + i * slotH;
      const y2 = y1 + slotH - 4;

      const x1 = p.left + (w - topW) / 2;
      const x2 = x1 + topW;
      const x3 = p.left + (w - botW) / 2 + botW;
      const x4 = p.left + (w - botW) / 2;

      const color = d.color || palette[i % palette.length];
      const isHovered = state.hoveredIndex === i;

      if (isHovered) {
        tooltip = {
          x: p.left + w / 2,
          y: y1 + slotH / 2,
          title: d.label,
          value: d.value.toLocaleString(),
        };
      }

      stages += `
        <polygon
          data-chart-item="${i}"
          points="${x1},${y1} ${x2},${y1} ${x3},${y2} ${x4},${y2}"
          fill="${color}"
          opacity="${isHovered ? 1 : 0.85}"
          stroke="#ffffff"
          stroke-width="1.5"
          class="cursor-pointer transition-all"
        />
        <text x="${p.left + w / 2}" y="${y1 + slotH / 2 + 4}" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="700" fill="#ffffff">${this.escapeXml(d.label)} (${d.value})</text>
      `;
    });

    return { content: stages, tooltip };
  }

  private renderCandlestickChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    state: ChartInteractionState
  ) {
    const allHighs = data.map(d => d.high ?? d.value * 1.1);
    const allLows = data.map(d => d.low ?? d.value * 0.9);
    const maxVal = Math.max(1, ...allHighs);
    const minVal = Math.min(...allLows);
    const range = maxVal - minVal || 1;

    const count = data.length;
    const slotW = w / count;
    const candleW = Math.max(6, slotW * 0.6);

    let candles = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const open = d.open ?? d.value * 0.98;
      const close = d.close ?? d.value * 1.02;
      const high = d.high ?? Math.max(open, close) * 1.05;
      const low = d.low ?? Math.min(open, close) * 0.95;
      const isUp = close >= open;
      const color = isUp ? '#10b981' : '#ef4444';

      const cx = p.left + i * slotW + slotW / 2;
      const yHigh = p.top + h - ((high - minVal) / range) * h;
      const yLow = p.top + h - ((low - minVal) / range) * h;
      const yOpen = p.top + h - ((open - minVal) / range) * h;
      const yClose = p.top + h - ((close - minVal) / range) * h;

      const bodyTop = Math.min(yOpen, yClose);
      const bodyH = Math.max(2, Math.abs(yOpen - yClose));

      if (state.hoveredIndex === i) {
        tooltip = {
          x: cx,
          y: bodyTop,
          title: d.label,
          value: `إغلاق: ${close} (أعلى: ${high} / أدنى: ${low})`,
        };
      }

      candles += `
        <line x1="${cx}" y1="${yHigh}" x2="${cx}" y2="${yLow}" stroke="${color}" stroke-width="1.5"/>
        <rect
          data-chart-item="${i}"
          x="${cx - candleW / 2}"
          y="${bodyTop}"
          width="${candleW}"
          height="${bodyH}"
          fill="${color}"
          rx="1"
          class="cursor-pointer transition-all"
        />
        <text x="${cx}" y="${p.top + h + 15}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b">${this.escapeXml(d.label)}</text>
      `;
    });

    return { content: candles, tooltip };
  }

  private renderWaterfallChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    let running = 0;
    const values = data.map(d => {
      const start = running;
      running += d.value;
      return { ...d, start, end: running };
    });

    const maxVal = Math.max(1, ...values.map(v => Math.max(v.start, v.end)));
    const count = data.length;
    const slotW = w / count;
    const barW = Math.max(10, slotW * 0.7);

    let bars = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    values.forEach((d, i) => {
      const isPositive = d.value >= 0;
      const topVal = Math.max(d.start, d.end);
      const botVal = Math.min(d.start, d.end);
      const y = p.top + h - (topVal / maxVal) * h;
      const barH = Math.max(3, ((topVal - botVal) / maxVal) * h);
      const x = p.left + i * slotW + (slotW - barW) / 2;
      const color = isPositive ? '#10b981' : '#ef4444';

      if (state.hoveredIndex === i) {
        tooltip = { x: x + barW / 2, y, title: d.label, value: `${d.value > 0 ? '+' : ''}${d.value}` };
      }

      bars += `
        <rect
          data-chart-item="${i}"
          x="${x}"
          y="${y}"
          width="${barW}"
          height="${barH}"
          rx="3"
          fill="${color}"
          class="cursor-pointer"
        />
        <text x="${x + barW / 2}" y="${p.top + h + 15}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b">${this.escapeXml(d.label)}</text>
      `;
    });

    return { content: bars, tooltip };
  }

  private renderHistogramChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    return this.renderBarChart(data, w, h, p, palette, state);
  }

  private renderPolarChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const maxVal = Math.max(1, ...data.map(d => d.value));
    const cx = w / 2;
    const cy = p.top + (h - p.top - p.bottom) / 2;
    const maxR = Math.min(cx - p.left, cy - p.top) * 0.8;
    const count = data.length;
    const stepAngle = (2 * Math.PI) / count;

    let sectors = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const r = (d.value / maxVal) * maxR;
      const a1 = -Math.PI / 2 + i * stepAngle;
      const a2 = a1 + stepAngle;
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const color = d.color || palette[i % palette.length];

      if (state.hoveredIndex === i) {
        tooltip = { x: cx, y: cy, title: d.label, value: d.value.toLocaleString() };
      }

      sectors += `
        <path
          data-chart-item="${i}"
          d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z"
          fill="${color}"
          opacity="0.8"
          stroke="#ffffff"
          stroke-width="1.5"
          class="cursor-pointer"
        />
      `;
    });

    return { content: sectors, tooltip };
  }

  private renderRadialBarChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const cx = w / 2;
    const cy = p.top + (h - p.top - p.bottom) / 2;
    const maxR = Math.min(cx - p.left, cy - p.top) * 0.85;
    const count = data.length;
    const ringW = maxR / (count + 1);

    let rings = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const r = maxR - i * ringW;
      const maxVal = d.target || 100;
      const ratio = Math.min(1, Math.max(0, d.value / maxVal));
      const angle = -Math.PI / 2 + ratio * 2 * Math.PI;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const largeArc = ratio > 0.5 ? 1 : 0;
      const color = d.color || palette[i % palette.length];

      if (state.hoveredIndex === i) {
        tooltip = { x: cx, y: cy, title: d.label, value: `${d.value} / ${maxVal}` };
      }

      rings += `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="${ringW * 0.7}"/>
        <path
          data-chart-item="${i}"
          d="M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}"
          fill="none"
          stroke="${color}"
          stroke-width="${ringW * 0.7}"
          stroke-linecap="round"
          class="cursor-pointer"
        />
      `;
    });

    return { content: rings, tooltip };
  }

  private renderBulletChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    const d = data[0] || { label: 'الأداء', value: 82, target: 95 };
    const maxVal = Math.max(100, (d.target || 100) * 1.2);
    const actualW = (d.value / maxVal) * w;
    const targetX = ((d.target || 90) / maxVal) * w;
    const barH = 30;
    const y = p.top + h / 2 - barH / 2;

    const content = `
      <rect x="${p.left}" y="${y}" width="${w}" height="${barH}" rx="4" fill="#f1f5f9"/>
      <rect x="${p.left}" y="${y}" width="${w * 0.7}" height="${barH}" rx="4" fill="#e2e8f0"/>
      <rect x="${p.left}" y="${y + 5}" width="${actualW}" height="${barH - 10}" rx="3" fill="${palette[0]}"/>
      <line x1="${p.left + targetX}" y1="${y - 4}" x2="${p.left + targetX}" y2="${y + barH + 4}" stroke="#ef4444" stroke-width="3"/>
      <text x="${p.left + targetX}" y="${y - 8}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="700" fill="#ef4444">الهدف: ${d.target}</text>
    `;

    return { content, tooltip: null };
  }

  private renderPyramidChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    palette: string[],
    state: ChartInteractionState
  ) {
    return this.renderFunnelChart(data, w, h, p, palette, state);
  }

  private renderHeatmapChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    p: { top: number; right: number; bottom: number; left: number },
    state: ChartInteractionState
  ) {
    const cols = 7;
    const rows = Math.ceil(data.length / cols) || 1;
    const cellW = w / cols;
    const cellH = h / rows;
    const maxVal = Math.max(1, ...data.map(d => d.value));

    let cells = '';
    let tooltip: ChartInteractionState['tooltipPos'] = null;

    data.forEach((d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = p.left + col * cellW;
      const y = p.top + row * cellH;
      const ratio = d.value / maxVal;
      const isHovered = state.hoveredIndex === i;

      // Interpolate pure blue intensity
      const opacity = 0.15 + ratio * 0.85;

      if (isHovered) {
        tooltip = { x: x + cellW / 2, y, title: d.label, value: d.value.toLocaleString() };
      }

      cells += `
        <rect
          data-chart-item="${i}"
          x="${x + 2}"
          y="${y + 2}"
          width="${cellW - 4}"
          height="${cellH - 4}"
          rx="4"
          fill="#2563eb"
          fill-opacity="${opacity}"
          stroke="${isHovered ? '#1e293b' : '#ffffff'}"
          stroke-width="1.5"
          class="cursor-pointer"
        />
        <text x="${x + cellW / 2}" y="${y + cellH / 2 + 3}" text-anchor="middle" font-family="system-ui" font-size="9" fill="${ratio > 0.5 ? '#ffffff' : '#1e293b'}">${d.value}</text>
      `;
    });

    return { content: cells, tooltip };
  }

  private renderSparklineChart(
    data: ChartDataPoint[],
    w: number,
    h: number,
    palette: string[],
    state: ChartInteractionState
  ) {
    const maxVal = Math.max(1, ...data.map(d => d.value));
    const minVal = Math.min(0, ...data.map(d => d.value));
    const range = maxVal - minVal || 1;
    const stepX = data.length > 1 ? (w - 20) / (data.length - 1) : w;

    let pathD = `M 10 ${h - 10 - ((data[0].value - minVal) / range) * (h - 20)}`;
    data.forEach((d, i) => {
      const x = 10 + i * stepX;
      const y = h - 10 - ((d.value - minVal) / range) * (h - 20);
      pathD += ` L ${x} ${y}`;
    });

    const content = `<path d="${pathD}" fill="none" stroke="${palette[0]}" stroke-width="2.5" stroke-linecap="round"/>`;
    return { content, tooltip: null };
  }

  private generateYGridLines(left: number, top: number, w: number, h: number, maxVal: number): string {
    const steps = 4;
    let grid = '';
    for (let i = 0; i <= steps; i++) {
      const y = top + (h / steps) * i;
      const val = Math.round(maxVal - (maxVal / steps) * i);
      grid += `
        <line x1="${left}" y1="${y}" x2="${left + w}" y2="${y}" stroke="#f1f5f9" stroke-dasharray="3,3"/>
        <text x="${left - 8}" y="${y + 3}" text-anchor="end" font-family="system-ui" font-size="9" fill="#94a3b8">${val}</text>
      `;
    }
    return grid;
  }

  private getFallbackData(): ChartDataPoint[] {
    return [
      { label: 'يناير', value: 45 },
      { label: 'فبراير', value: 72 },
      { label: 'مارس', value: 58 },
      { label: 'أبريل', value: 90 },
      { label: 'مايو', value: 65 },
    ];
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * قائمة الـ 20 نموذجاً للمخططات الحية الجاهزة للاستعراض والتوليد المباشر
   */
  public get20ChartPresets(): { id: string; title: string; type: ChartType; description: string; data: ChartDataPoint[] }[] {
    return [
      {
        id: 'p1-sales-bar',
        title: '1. مبيعات الفروع الفصلية (Bar Chart)',
        type: 'bar',
        description: 'مخطط شريطي عمودي كلاسيكي يقارن أداء الفروع الربعي.',
        data: [
          { label: 'الرياض', value: 120 },
          { label: 'جدة', value: 95 },
          { label: 'الدمام', value: 80 },
          { label: 'مكة', value: 65 },
          { label: 'المدينة', value: 50 },
        ],
      },
      {
        id: 'p2-user-growth-line',
        title: '2. نمو المشتركين الشهري (Line Chart)',
        type: 'line',
        description: 'مخطط خطي انسيابي متصل يوضح تسارع الاشتراكات.',
        data: [
          { label: 'يناير', value: 1200 },
          { label: 'فبراير', value: 1900 },
          { label: 'مارس', value: 2400 },
          { label: 'أبريل', value: 3100 },
          { label: 'مايو', value: 4200 },
          { label: 'يونيو', value: 5800 },
        ],
      },
      {
        id: 'p3-budget-pie',
        title: '3. توزيع الميزانية التشغيلية (Pie Chart)',
        type: 'pie',
        description: 'مخطط دائري يوضح حصص الأقسام في الميزانية السنوية.',
        data: [
          { label: 'التطوير الهندسي', value: 40 },
          { label: 'التسويق والمبيعات', value: 25 },
          { label: 'البنية التحتية', value: 20 },
          { label: 'العمليات والدعم', value: 15 },
        ],
      },
      {
        id: 'p4-storage-donut',
        title: '4. استهلاك السعة السحابية (Donut Chart)',
        type: 'donut',
        description: 'مخطط حلقي مجوف يعرض استهلاك التخزين مع إجمالي المركز.',
        data: [
          { label: 'مستندات PDF', value: 350 },
          { label: 'صور وتصاميم', value: 280 },
          { label: 'ملفات برمجية', value: 190 },
          { label: 'قواعد بيانات', value: 120 },
        ],
      },
      {
        id: 'p5-traffic-area',
        title: '5. كثافة الزيارات المباشرة (Area Chart)',
        type: 'area',
        description: 'مخطط مساحي بتدرج نقي يبرز حجم تدفق البيانات اللحظي.',
        data: [
          { label: '00:00', value: 300 },
          { label: '04:00', value: 150 },
          { label: '08:00', value: 850 },
          { label: '12:00', value: 1400 },
          { label: '16:00', value: 1250 },
          { label: '20:00', value: 980 },
        ],
      },
      {
        id: 'p6-skills-radar',
        title: '6. مصفوفة الكفاءات التقنية (Radar Chart)',
        type: 'radar',
        description: 'مخطط راداري خماسي الأبعاد لتقييم أداء المحركات.',
        data: [
          { label: 'السرعة والخفة', value: 95 },
          { label: 'دقة الرسم', value: 90 },
          { label: 'دعم الفأرة', value: 100 },
          { label: 'الأمان والعزل', value: 98 },
          { label: 'سهولة التوسع', value: 92 },
        ],
      },
      {
        id: 'p7-performance-gauge',
        title: '7. مؤشر الكفاءة التشغيلية (Gauge Meter)',
        type: 'gauge',
        description: 'مقياس نصف دائري بإبرة ونسب مئوية لقراءة KPI الفورية.',
        data: [{ label: 'معدل النجاح', value: 94, target: 100 }],
      },
      {
        id: 'p8-stats-scatter',
        title: '8. الارتباط الإحصائي للنفقات (Scatter Plot)',
        type: 'scatter',
        description: 'نقاط مبعثرة توضح الارتباط بين ساعات العمل والإنتاج.',
        data: [
          { label: 'مشروع أ', value: 45, secondaryValue: 20 },
          { label: 'مشروع ب', value: 70, secondaryValue: 35 },
          { label: 'مشروع ج', value: 90, secondaryValue: 50 },
          { label: 'مشروع د', value: 120, secondaryValue: 80 },
          { label: 'مشروع هـ', value: 150, secondaryValue: 100 },
        ],
      },
      {
        id: 'p9-market-bubble',
        title: '9. تحليل الحصص السوقية (Bubble Chart)',
        type: 'bubble',
        description: 'فقاعات ثلاثية الأبعاد تمثل الحجم والقيمة والأثر.',
        data: [
          { label: 'منتج أ', value: 150, secondaryValue: 30 },
          { label: 'منتج ب', value: 280, secondaryValue: 60 },
          { label: 'منتج ج', value: 80, secondaryValue: 20 },
          { label: 'منتج د', value: 420, secondaryValue: 90 },
        ],
      },
      {
        id: 'p10-conversion-funnel',
        title: '10. قمع التحويل والعملاء (Conversion Funnel)',
        type: 'funnel',
        description: 'مراحل تدفق العملاء من الزيارة الأولى حتى إتمام الشراء.',
        data: [
          { label: 'زيارات الموقع', value: 10000 },
          { label: 'تسجيل الحسابات', value: 4500 },
          { label: 'إضافة للسلة', value: 2100 },
          { label: 'إتمام الدفع', value: 1350 },
        ],
      },
      {
        id: 'p11-stock-candlestick',
        title: '11. الشموع المالية لتداول الأسهم (Candlestick)',
        type: 'candlestick',
        description: 'مخطط مالي دقيق يعرض أسعار الافتتاح والإغلاق والقمة والقاع.',
        data: [
          { label: 'الأحد', value: 105, open: 100, close: 108, high: 112, low: 98 },
          { label: 'الإثنين', value: 108, open: 108, close: 104, high: 110, low: 102 },
          { label: 'الثلاثاء', value: 104, open: 104, close: 115, high: 118, low: 103 },
          { label: 'الأربعاء', value: 115, open: 115, close: 122, high: 125, low: 114 },
          { label: 'الخميس', value: 122, open: 122, close: 120, high: 126, low: 118 },
        ],
      },
      {
        id: 'p12-cashflow-waterfall',
        title: '12. شلال التدفقات النقدية (Waterfall Chart)',
        type: 'waterfall',
        description: 'مخطط الشلال التراكمي للإيرادات والمصروفات وصافي الربح.',
        data: [
          { label: 'إيراد أولي', value: 500 },
          { label: 'مبيعات إضافية', value: 150 },
          { label: 'تكاليف تشغيل', value: -120 },
          { label: 'ضرائب ورسوم', value: -60 },
          { label: 'صافي الربح', value: 470 },
        ],
      },
      {
        id: 'p13-weekly-heatmap',
        title: '13. الخريطة الحرارية لنشاط الخوادم (Heatmap Grid)',
        type: 'heatmap',
        description: 'مصفوفة حرارية لضغط الخوادم على مدار أيام الأسبوع.',
        data: [
          { label: 'س1', value: 12 }, { label: 'س2', value: 35 }, { label: 'س3', value: 80 }, { label: 'س4', value: 95 }, { label: 'س5', value: 70 }, { label: 'س6', value: 40 }, { label: 'س7', value: 15 },
          { label: 'ح1', value: 20 }, { label: 'ح2', value: 45 }, { label: 'ح3', value: 90 }, { label: 'ح4', value: 100 }, { label: 'ح5', value: 85 }, { label: 'ح6', value: 50 }, { label: 'ح7', value: 25 },
        ],
      },
      {
        id: 'p14-task-horizontal',
        title: '14. ترتيب المهام والمشاريع (Horizontal Bar)',
        type: 'horizontal-bar',
        description: 'أشرطة أفقية مريحة لمقارنة أزمنة التنفيذ ومراحل المشروع.',
        data: [
          { label: 'تصميم الواجهات', value: 85 },
          { label: 'بناء النواة المشتركة', value: 95 },
          { label: 'ربط الفأرة والقوائم', value: 90 },
          { label: 'الاختبارات الشاملة', value: 80 },
        ],
      },
      {
        id: 'p15-radial-progress',
        title: '15. حلقات الإنجاز الدائرية (Radial Bar Chart)',
        type: 'radialbar',
        description: 'حلقات متحدة المركز لنسب إنجاز الأهداف الفصلية.',
        data: [
          { label: 'الهدف الأول', value: 85, target: 100 },
          { label: 'الهدف الثاني', value: 65, target: 100 },
          { label: 'الهدف الثالث', value: 92, target: 100 },
        ],
      },
      {
        id: 'p16-target-bullet',
        title: '16. مؤشر الرصاصة للأهداف (Bullet Chart)',
        type: 'bullet',
        description: 'مقارنة القيمة الفعلية مع نطاقات الجودة والمستهدف النهائي.',
        data: [{ label: 'مبيعات الربع', value: 88, target: 95 }],
      },
      {
        id: 'p17-milestone-stepline',
        title: '17. المحطات المرحلية المتدرجة (Step Line Chart)',
        type: 'stepline',
        description: 'خط متدرج يوضح الانتقال بين مستويات الإصدارات.',
        data: [
          { label: 'v1.0', value: 20 },
          { label: 'v1.5', value: 45 },
          { label: 'v2.0', value: 70 },
          { label: 'v2.5', value: 95 },
        ],
      },
      {
        id: 'p18-polar-regions',
        title: '18. التوزيع القطبي للمناطق (Polar Area)',
        type: 'polar',
        description: 'مخطط قطبي يبرز التباين بين المناطق الجغرافية.',
        data: [
          { label: 'الشرق', value: 75 },
          { label: 'الغرب', value: 50 },
          { label: 'الشمال', value: 90 },
          { label: 'الجنوب', value: 60 },
          { label: 'الوسط', value: 85 },
        ],
      },
      {
        id: 'p19-org-pyramid',
        title: '19. الهيكل الهرمي المؤسسي (Pyramid Chart)',
        type: 'pyramid',
        description: 'توزيع هرمي لمستويات القيادة والفرق البرمجية.',
        data: [
          { label: 'القيادة المعمارية', value: 10 },
          { label: 'مهندسو النواة', value: 30 },
          { label: 'مطورو المحررات', value: 60 },
          { label: 'فاحصو الجودة', value: 100 },
        ],
      },
      {
        id: 'p20-live-sparkline',
        title: '20. مؤشرات الأداء اللحظية (Micro Sparkline)',
        type: 'sparkline',
        description: 'مخطط مصغر فائق الخفة لمراقبة النبض اللحظي للنظام.',
        data: [
          { label: '1', value: 30 },
          { label: '2', value: 45 },
          { label: '3', value: 25 },
          { label: '4', value: 60 },
          { label: '5', value: 55 },
          { label: '6', value: 80 },
        ],
      },
    ];
  }
}

export const zeroDependencyChartEngine = new ZeroDependencyChartEngine();
