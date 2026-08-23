/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك توليد الأكواد اللحظية - Live Code Generator
 * 🏛️ الدور: محرك مشترك - تحويل عناصر الكانفا إلى React/TSX/Tailwind/HTML5/SVG
 * 📥 المستهلك: CanvasDesignerEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Format Code Generation: توليد أكواد بصيغ متعددة
 *    من عنصر الكانفا الواحد (React, Tailwind, HTML, SVG)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الكود المولد يجب أن يكون صالحاً (valid syntax)
 *    2. Tailwind classes يجب أن تكون صحيحة
 *    3. SVG يجب أن يكون آمناً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة العنصر قبل التوليد
 *    - fallback لـ div عادي
 *    - تنظيف الكود من الأخطاء البسيطة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * محرك توليد الأكواد اللحظية (React/TSX, Tailwind, HTML5, SVG)
 * /src/features/canvas-designer/codeGenerator.ts
 */

import type { CanvasElement } from './model';

/**
 * تحويل عنصر كانفا إلى كود Tailwind CSS
 */
export function elementToTailwindClasses(el: CanvasElement): string {
  const classes: string[] = ['absolute'];

  // Dimensions & Position
  classes.push(`left-[${Math.round(el.x)}px]`);
  classes.push(`top-[${Math.round(el.y)}px]`);
  classes.push(`w-[${Math.round(el.width)}px]`);
  classes.push(`h-[${Math.round(el.height)}px]`);

  // Background
  if (el.fillColor && el.fillColor !== 'transparent') {
    classes.push(`bg-[${el.fillColor}]`);
  }

  // Border
  if (el.strokeWidth && el.strokeWidth > 0 && el.strokeColor) {
    classes.push(`border-[${el.strokeWidth}px]`);
    classes.push(`border-[${el.strokeColor}]`);
    if (el.strokeStyle === 'dashed') classes.push('border-dashed');
    if (el.strokeStyle === 'dotted') classes.push('border-dotted');
  }

  // Border radius
  if (el.borderRadius) {
    classes.push(`rounded-[${el.borderRadius}px]`);
  }

  // Rotation & Opacity
  if (el.rotation) {
    classes.push(`rotate-[${Math.round(el.rotation)}deg]`);
  }
  if (el.opacity !== undefined && el.opacity < 1) {
    classes.push(`opacity-[${el.opacity}]`);
  }

  // Text alignment & color
  if (el.textColor) {
    classes.push(`text-[${el.textColor}]`);
  }
  if (el.fontSize) {
    classes.push(`text-[${el.fontSize}px]`);
  }
  if (el.textAlign === 'center') classes.push('text-center');
  if (el.textAlign === 'left') classes.push('text-left');
  if (el.textAlign === 'right') classes.push('text-right');

  // Custom tailwind classes if imported
  if (el.tailwindClasses) {
    classes.push(el.tailwindClasses);
  }

  return classes.join(' ');
}

/**
 * توليد كود React (TSX) مع Tailwind CSS لجميع عناصر الكانفا
 */
export function generateReactTsxCode(
  elements: CanvasElement[],
  componentName = 'DesignCanvasComponent',
): string {
  if (elements.length === 0) {
    return `import React from 'react';

export function ${componentName}() {
  return (
    <div className="relative w-full h-[600px] bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center text-slate-400">
      <p>لا توجد عناصر في مساحة التصميم حتى الآن.</p>
    </div>
  );
}`;
  }

  const renderElements = elements
    .map((el) => {
      const tw = elementToTailwindClasses(el);
      const tag = el.tag || (el.type === 'button' ? 'button' : 'div');
      const textContent = el.text ? `\n        <span>${el.text}</span>` : '';

      return `      {/* ${el.type.toUpperCase()}: ${el.id} */}
      <${tag}
        id="${el.id}"
        className="${tw}"
      >${textContent}
      </${tag}>`;
    })
    .join('\n\n');

  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export function ${componentName}({ className = '' }: ${componentName}Props) {
  return (
    <section className={\`relative w-full h-[720px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm \${className}\`}>
${renderElements}
    </section>
  );
}

export default ${componentName};`;
}

/**
 * توليد كود HTML5 و CSS3 القياسي
 */
export function generateHtml5Code(elements: CanvasElement[]): string {
  const elementsHtml = elements
    .map((el) => {
      const styles = [
        'position: absolute',
        `left: ${Math.round(el.x)}px`,
        `top: ${Math.round(el.y)}px`,
        `width: ${Math.round(el.width)}px`,
        `height: ${Math.round(el.height)}px`,
        el.fillColor ? `background-color: ${el.fillColor}` : '',
        el.strokeWidth
          ? `border: ${el.strokeWidth}px ${el.strokeStyle || 'solid'} ${el.strokeColor || '#cbd5e1'}`
          : '',
        el.borderRadius ? `border-radius: ${el.borderRadius}px` : '',
        el.textColor ? `color: ${el.textColor}` : '',
        el.fontSize ? `font-size: ${el.fontSize}px` : '',
        el.textAlign ? `text-align: ${el.textAlign}` : '',
        el.rotation ? `transform: rotate(${el.rotation}deg)` : '',
        el.opacity !== undefined ? `opacity: ${el.opacity}` : '',
        'box-sizing: border-box',
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'overflow: hidden',
      ]
        .filter(Boolean)
        .join('; ');

      const tag = el.tag || (el.type === 'button' ? 'button' : 'div');
      return `    <${tag} id="${el.id}" style="${styles}">
      ${el.text || ''}
    </${tag}>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مخطط الكانفا والويب المصدّر</title>
  <style>
    .canvas-container {
      position: relative;
      width: 100%;
      min-height: 720px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      font-family: 'Cairo', system-ui, sans-serif;
    }
  </style>
</head>
<body>
  <div class="canvas-container">
${elementsHtml}
  </div>
</body>
</html>`;
}

/**
 * توليد كود SVG فيكتور نقي
 */
export function generateSvgCode(elements: CanvasElement[], width = 1280, height = 720): string {
  const svgItems = elements
    .map((el) => {
      const transform = el.rotation
        ? ` transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"`
        : '';

      if (el.type === 'circle' || el.type === 'ellipse') {
        const rx = el.width / 2;
        const ry = el.height / 2;
        const cx = el.x + rx;
        const cy = el.y + ry;
        return `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${el.fillColor || 'none'}" stroke="${el.strokeColor || 'none'}" stroke-width="${el.strokeWidth || 0}" opacity="${el.opacity ?? 1}"${transform} />`;
      }

      if (el.type === 'line' || el.type === 'arrow') {
        return `  <line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y + el.height}" stroke="${el.strokeColor || '#2563eb'}" stroke-width="${el.strokeWidth || 2}"${transform} />`;
      }

      // Default Rectangular / Node
      const rect = `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.borderRadius || 0}" fill="${el.fillColor || '#ffffff'}" stroke="${el.strokeColor || '#cbd5e1'}" stroke-width="${el.strokeWidth || 1}" opacity="${el.opacity ?? 1}"${transform} />`;
      const text = el.text
        ? `  <text x="${el.x + el.width / 2}" y="${el.y + el.height / 2 + 5}" text-anchor="middle" font-size="${el.fontSize || 14}" fill="${el.textColor || '#0f172a'}" font-family="sans-serif">${el.text}</text>`
        : '';

      return `${rect}\n${text}`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
${svgItems}
</svg>`;
}
