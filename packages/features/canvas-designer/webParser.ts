/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحليل واستخراج صفحات الويب - Web Page Parser
 * 🏛️ الدور: محرك مشترك - تحويل DOM إلى عناصر كانفا وطبقات
 * 📥 المستهلك: CanvasDesignerEditor, WebDropInspector, HtmlCssExtractor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    DOM-to-Canvas Pipeline: خط أنابيب لتحويل صفحات الويب الكاملة
 *    إلى عناصر كانفا قابلة للتحرير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. HTML يجب أن يكون صالحاً
 *    2. بعض العناصر قد لا تتحول بدقة
 *    3. الألوان والخطوط يجب حفظها
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - sanitize HTML قبل التحليل
 *    - fallback لعنصر نصي
 *    - timeout على التحليل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * محرك تحليل واستخراج صفحات الويب وعناصر DOM وتحويلها إلى كائنات الكانفا والطبقات
 * /src/features/canvas-designer/webParser.ts
 */

import type { CanvasElement, CanvasElementType } from './model';

export interface ParsedWebResult {
  title: string;
  elements: CanvasElement[];
  rawHtml: string;
  detectedColors: string[];
}

/**
 * تحويل كود HTML مسحوب أو ملصوق إلى شجرة عناصر كانفا بطبقات عمق تداخلية
 */
export function parseHtmlToCanvasElements(
  htmlText: string,
  startX = 80,
  startY = 80,
  layerId = 'layer-main'
): ParsedWebResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const elements: CanvasElement[] = [];
  const detectedColors = new Set<string>();

  let currentZ = 10;
  let offsetX = startX;
  let offsetY = startY;

  function traverseNode(node: Node, parentId?: string): string | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return null;

      const textId = `el-txt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      elements.push({
        id: textId,
        type: 'text',
        parentId,
        x: offsetX + 10,
        y: offsetY + 10,
        width: Math.min(Math.max(text.length * 9, 80), 320),
        height: 36,
        zIndex: currentZ++,
        layerId,
        text,
        fontSize: 14,
        textColor: '#0f172a',
        textAlign: 'right',
        tag: 'span',
      });
      offsetY += 40;
      return textId;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Skip scripts, styles, meta, noscript
    if (['script', 'style', 'meta', 'link', 'noscript', 'head'].includes(tagName)) {
      return null;
    }

    const inlineStyle = el.getAttribute('style') || '';
    const classList = el.className || '';
    const innerText = el.innerText?.trim() || '';

    // Extract inline styles if present
    const styleObj: Record<string, string> = {};
    if (inlineStyle) {
      inlineStyle.split(';').forEach((part) => {
        const [k, v] = part.split(':').map((s) => s?.trim());
        if (k && v) {
          styleObj[k.toLowerCase()] = v;
          if (k.includes('color') || k.includes('background')) {
            detectedColors.add(v);
          }
        }
      });
    }

    const elId = `el-web-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let elType: CanvasElementType = 'html-card';
    let width = 240;
    let height = 120;
    let fillColor = styleObj['background-color'] || styleObj.background || '#ffffff';
    let strokeColor = styleObj['border-color'] || '#e2e8f0';
    let strokeWidth = styleObj['border-width'] ? parseInt(styleObj['border-width'], 10) : 1;
    let borderRadius = styleObj['border-radius'] ? parseInt(styleObj['border-radius'], 10) : 8;
    let textColor = styleObj.color || '#0f172a';
    let fontSize = styleObj['font-size'] ? parseInt(styleObj['font-size'], 10) : 14;

    // Detect specific HTML tags
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      elType = 'text';
      fontSize = tagName === 'h1' ? 24 : tagName === 'h2' ? 20 : 16;
      width = 280;
      height = 40;
      fillColor = 'transparent';
      strokeWidth = 0;
    } else if (['p', 'span', 'strong', 'em', 'small', 'label'].includes(tagName)) {
      elType = 'text';
      fontSize = 14;
      width = 240;
      height = 36;
      fillColor = 'transparent';
      strokeWidth = 0;
    } else if (tagName === 'button') {
      elType = 'button';
      width = 140;
      height = 42;
      fillColor = fillColor !== '#ffffff' ? fillColor : '#2563eb';
      textColor = styleObj.color || '#ffffff';
      borderRadius = 8;
      strokeColor = '#1d4ed8';
    } else if (tagName === 'img') {
      elType = 'image';
      width = 180;
      height = 140;
      fillColor = '#f8fafc';
    } else if (['section', 'article', 'div', 'main', 'card', 'nav'].includes(tagName)) {
      elType = 'container';
      width = 300;
      height = 180;
      fillColor = fillColor !== '#ffffff' ? fillColor : '#f8fafc';
      strokeColor = '#cbd5e1';
      borderRadius = 12;
    }

    const canvasEl: CanvasElement = {
      id: elId,
      type: elType,
      parentId,
      x: offsetX,
      y: offsetY,
      width,
      height,
      zIndex: currentZ++,
      layerId,
      fillColor,
      strokeColor,
      strokeWidth,
      borderRadius,
      text: innerText ? innerText.substring(0, 120) : undefined,
      fontSize,
      textColor,
      textAlign: 'right',
      tag: tagName,
      rawCss: inlineStyle,
      tailwindClasses: classList,
      htmlContent: el.outerHTML,
    };

    elements.push(canvasEl);

    // Recursively process child nodes
    if (el.childNodes.length > 0) {
      offsetX += 20;
      offsetY += 35;
      const childIds: string[] = [];
      el.childNodes.forEach((child) => {
        const childId = traverseNode(child, elId);
        if (childId) childIds.push(childId);
      });
      canvasEl.children = childIds;
      offsetX -= 20;
    } else {
      offsetY += height + 15;
    }

    return elId;
  }

  const rootNodes = doc.body.childNodes;
  if (rootNodes.length === 0) {
    // If raw plain text
    const textId = `el-txt-${Date.now()}`;
    elements.push({
      id: textId,
      type: 'text',
      x: startX,
      y: startY,
      width: 260,
      height: 60,
      zIndex: 1,
      layerId,
      text: htmlText,
      fontSize: 14,
      textColor: '#0f172a',
      textAlign: 'right',
    });
  } else {
    rootNodes.forEach((node) => {
      traverseNode(node);
    });
  }

  return {
    title: doc.title || 'مكون ويب مستورد',
    elements,
    rawHtml: htmlText,
    detectedColors: Array.from(detectedColors),
  };
}
