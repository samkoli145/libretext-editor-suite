/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تصدير وتوليد كود SVG الدلالي المتجه النقي - SVG Exporter
 * 🏛️ الدور: محرك مشترك - تحويل عناصر الكانفا إلى مستند SVG قياسي
 * 📥 المستهلك: CanvasDesignerEditor, LivePreview, Toolbar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    W3C-Compliant SVG Generator: مولد SVG متوافق مع W3C
 *    مع دعم جميع الأشكال والخطوط العربية والتدرجات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. SVG الناتج يجب أن يكون دلالياً ونظيفاً
 *    2. الخطوط العربية يجب أن تكون مناسبة
 *    3. التدرجات يجب تضمينها في <defs>
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة كل عنصر قبل التصدير
 *    - fallback لعنصر نصي
 *    - تنظيف الناتج من XSS
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement } from '../model';
import { NS } from './svgNamespaces';
import { sanitizeSvgString } from './svgSanitizer';
import { generateSvgGradientElement, LIGHT_THEME_GRADIENTS } from './svgPaint';
import {
  createPolygonPath,
  createStarPath,
  createArrowPath,
  createRectanglePath,
  createCirclePath,
  createEllipsePath,
} from './svgPathUtils';
import { CLIP_PRESETS } from './svgClipping';
import {
  generateSvgAnimationsCss,
  SVG_ANIMATION_PRESETS,
  type SvgAnimationType,
} from './svgAnimation';

export interface SvgExportOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  embedFonts?: boolean;
  title?: string;
}

/**
 * تحويل عنصر كانفا منفرد إلى وسم SVG نصي
 */
export function elementToSvgNode(element: CanvasElement): string {
  const x = element.x || 0;
  const y = element.y || 0;
  const w = Math.max(1, element.width || 100);
  const h = Math.max(1, element.height || 100);
  const rotation = element.rotation || 0;
  const fill = element.fillColor || 'transparent';
  const stroke = element.strokeColor || 'none';
  const strokeW = element.strokeWidth !== undefined ? element.strokeWidth : 0;
  const strokeStyle = element.strokeStyle;
  const dashArray =
    strokeStyle === 'dashed'
      ? ' stroke-dasharray="6,4"'
      : strokeStyle === 'dotted'
        ? ' stroke-dasharray="2,4"'
        : '';
  const transformAttr =
    rotation !== 0 ? ` transform="rotate(${rotation} ${x + w / 2} ${y + h / 2})"` : '';
  const animPreset = SVG_ANIMATION_PRESETS.find((p) => p.id === element.animation);
  const classAttr = animPreset && animPreset.cssClass ? ` class="${animPreset.cssClass}"` : '';

  switch (element.type) {
    case 'rectangle': {
      const rx = element.borderRadius || 0;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${classAttr}${transformAttr} />`;
    }

    case 'circle': {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.min(w, h) / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${classAttr}${transformAttr} />`;
    }

    case 'ellipse': {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const rx = w / 2;
      const ry = h / 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${classAttr}${transformAttr} />`;
    }

    case 'triangle': {
      const trianglePoints = [
        { x: x + w / 2, y },
        { x: x + w, y: y + h },
        { x, y: y + h },
      ];
      const pathD = createPolygonPath(trianglePoints);
      return `<path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${transformAttr} />`;
    }

    case 'star': {
      const pathD = createStarPath(x + w / 2, y + h / 2, 5, Math.min(w, h) / 2, Math.min(w, h) / 4);
      return `<path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${transformAttr} />`;
    }

    case 'diamond': {
      const diamondPoints = [
        { x: x + w / 2, y },
        { x: x + w, y: y + h / 2 },
        { x: x + w / 2, y: y + h },
        { x, y: y + h / 2 },
      ];
      const pathD = createPolygonPath(diamondPoints);
      return `<path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${transformAttr} />`;
    }

    case 'arrow': {
      const pathD = createArrowPath({ x, y: y + h / 2 }, { x: x + w, y: y + h / 2 });
      return `<path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray}${transformAttr} />`;
    }

    case 'freehand':
    case 'path': {
      const pathD = element.pathData || '';
      return `<path d="${pathD}" transform="translate(${x}, ${y})${rotation !== 0 ? ` rotate(${rotation} ${w / 2} ${h / 2})` : ''}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW || 3}" stroke-linecap="round" stroke-linejoin="round"${dashArray} />`;
    }

    case 'text':
    case 'heading':
    case 'paragraph': {
      const fontF = element.fontFamily || 'Tajawal, sans-serif';
      const fontS = element.fontSize || 16;
      const fontW = element.fontWeight || 'normal';
      const textCol = element.textColor || '#1e293b';
      const textAnchor =
        element.textAlign === 'center' ? 'middle' : element.textAlign === 'left' ? 'start' : 'end';
      const textX =
        element.textAlign === 'center'
          ? x + w / 2
          : element.textAlign === 'left'
            ? x + 10
            : x + w - 10;
      const textY = y + fontS + (h - fontS) / 2 - 2;

      return `<text x="${textX}" y="${textY}" font-family="${fontF}" font-size="${fontS}" font-weight="${fontW}" fill="${textCol}" text-anchor="${textAnchor}" dominant-baseline="middle"${transformAttr}>${element.text || ''}</text>`;
    }

    case 'image': {
      const shapeMask = element.shapeMask || 'none';
      const preset = CLIP_PRESETS.find((p) => p.id === shapeMask);
      const clipId = `clip-${element.id}`;
      const imgUrl = element.imageUrl || element.src || '';

      if (preset && shapeMask !== 'none') {
        const clipPathD = preset.generatePathD(w, h);
        return `<g${transformAttr}>\n  <defs>\n    <clipPath id="${clipId}">\n      <path d="${clipPathD}" />\n    </clipPath>\n  </defs>\n  <image x="${x}" y="${y}" width="${w}" height="${h}" href="${imgUrl}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />\n</g>`;
      }
      const rx = element.borderRadius || 0;
      return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${imgUrl}" preserveAspectRatio="xMidYMid slice"${rx > 0 ? ` rx="${rx}"` : ''}${transformAttr} />`;
    }

    default: {
      const rx = element.borderRadius || 8;
      return `<g${transformAttr}>\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dashArray} />\n</g>`;
    }
  }
}

/**
 * توليد ملف SVG كامل
 */
export function exportCanvasToSvg(
  elements: CanvasElement[],
  options: SvgExportOptions = {},
): string {
  const width = options.width || 1200;
  const height = options.height || 800;
  const bgColor = options.backgroundColor || '#ffffff';
  const title = options.title || 'تصميم محرر الكانفا المتجه';

  // Sort by zIndex
  const sorted = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Gradients in defs
  const gradientsXml = LIGHT_THEME_GRADIENTS.map((g) => generateSvgGradientElement(g)).join('\n');

  // Animations CSS in defs
  const usedAnimations = elements.map((e) => e.animation as SvgAnimationType).filter(Boolean);
  const animationsCss = generateSvgAnimationsCss(usedAnimations);

  // Nodes
  const nodesXml = sorted.map((el) => `  ${elementToSvgNode(el)}`).join('\n');

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${NS.SVG}" xmlns:xlink="${NS.XLINK}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" dir="rtl">
  <title>${title}</title>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&amp;family=Tajawal:wght@400;500;700&amp;display=swap');
      text { font-family: 'Tajawal', 'Cairo', sans-serif; }
${animationsCss}
    </style>
${gradientsXml}
  </defs>
  <!-- Background Canvas Stage -->
  <rect width="100%" height="100%" fill="${bgColor}" />
  <!-- Canvas Elements -->
${nodesXml}
</svg>`;

  return sanitizeSvgString(svgContent);
}

/**
 * تحويل كود SVG إلى رابط تنزيل Data URI
 */
export function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

/**
 * تنزيل كود SVG كملف في المتصفح بنقرة بالفأرة
 */
export function downloadSvgFile(svgString: string, filename: string = 'canvas-design.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
