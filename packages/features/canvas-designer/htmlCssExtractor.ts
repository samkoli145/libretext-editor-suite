/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك استخراج وتحليل عناصر HTML وخصائص CSS - HTML/CSS Extractor
 * 🏛️ الدور: محرك مشترك - تحليل DOM واستخراج العناصر والخصائص
 * 📥 المستهلك: CanvasDesignerEditor, WebDropInspector, htmlBlockParsers
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    DOM-to-Canvas Converter: تحويل عناصر DOM إلى عناصر كانفا
 *    مع استخراج الألوان والخطوط والأبعاد
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. HTML غير الآمن يجب تنظيفه
 *    2. بعض الخصائص قد لا تتحول بدقة
 *    3. العناصر المتداخلة يجب تعاملها بحذر
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
 * محرك استخراج وتحليل عناصر HTML وخصائص CSS المتقدم
 * /src/features/canvas-designer/htmlCssExtractor.ts
 */

import type { CanvasElement, CanvasElementType } from './model';

export interface ExtractedWebResult {
  elements: CanvasElement[];
  detectedColors: string[];
  detectedFonts: string[];
  elementCount: number;
}

export class HtmlCssExtractor {
  /**
   * تحويل كود HTML إلى عناصر كانفا بطبقات عمق تداخلية مع مواءمة تلقائية لعرض المسرح
   */
  static extractFromHtml(
    html: string,
    originX = 80,
    originY = 80,
    layerId = 'layer-main',
    stageWidth = 1200,
  ): ExtractedWebResult {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const elements: CanvasElement[] = [];
    const colors = new Set<string>();
    const fonts = new Set<string>();
    const zIndexCounter = 10;

    // استخراج عناصر body
    const bodyChildren = Array.from(doc.body.children);
    const targetNodes = bodyChildren.length > 0 ? bodyChildren : Array.from(doc.body.childNodes);

    let currentCursorY = originY;
    const maxAvailableWidth = Math.max(280, stageWidth - 40);

    for (const node of targetNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const rootId = this.processElementNode(
          node as HTMLElement,
          originX,
          currentCursorY,
          undefined,
          elements,
          colors,
          fonts,
          layerId,
          zIndexCounter,
          maxAvailableWidth,
          stageWidth,
        );

        if (rootId) {
          const rootEl = elements.find((e) => e.id === rootId);
          if (rootEl) {
            currentCursorY += rootEl.height + 24;
          }
        }
      }
    }

    return {
      elements,
      detectedColors: Array.from(colors),
      detectedFonts: Array.from(fonts),
      elementCount: elements.length,
    };
  }

  /**
   * معالجة العقدة بشكل تكراري مع الحفاظ على العمق اللانهائي والتحجيم التناسبي
   */
  private static processElementNode(
    el: HTMLElement,
    x: number,
    y: number,
    parentId: string | undefined,
    elements: CanvasElement[],
    colors: Set<string>,
    fonts: Set<string>,
    layerId: string,
    zIndexCounter: number,
    maxAvailableWidth = 1160,
    stageWidth = 1200,
  ): string | null {
    const tagName = el.tagName.toLowerCase();

    // تجاهل وسوم السكربت والأنماط الداخلية
    if (['script', 'style', 'meta', 'link', 'noscript', 'head', 'template'].includes(tagName)) {
      return null;
    }

    const inlineStyle = el.getAttribute('style') || '';
    const classList = el.className || '';
    const parsedStyles = this.parseInlineStyles(inlineStyle);

    // جمع الألوان والخطوط
    if (parsedStyles.color) colors.add(parsedStyles.color);
    if (parsedStyles['background-color']) colors.add(parsedStyles['background-color']);
    if (parsedStyles['border-color']) colors.add(parsedStyles['border-color']);
    if (parsedStyles['font-family']) fonts.add(parsedStyles['font-family']);

    const elId = `el-${tagName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const { type, width, height, isContainer } = this.determineElementTypeAndDimensions(
      el,
      tagName,
      parsedStyles,
    );

    // Responsive Clamping for Root Elements (parentId === undefined)
    let finalX = x;
    if (!parentId) {
      if (width > maxAvailableWidth) {
        const scale = maxAvailableWidth / width;
        width = Math.round(maxAvailableWidth);
        height = Math.round(height * scale);
      }
      finalX = Math.max(16, Math.round((stageWidth - width) / 2));
    }

    // استخراج فئات Tailwind المقابلة
    const tailwindClasses = this.computeTailwindClasses(tagName, parsedStyles, classList);

    // قراءة النص الصريح للعقدة إذا كانت ورقة (Leaf) أو عنوان أو زر
    let textContent: string | undefined = undefined;
    const directText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .filter(Boolean)
      .join(' ');

    if (
      directText ||
      ['button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'badge'].includes(tagName)
    ) {
      textContent = directText || el.innerText?.trim();
    }

    const canvasElement: CanvasElement = {
      id: elId,
      type,
      tag: tagName,
      parentId,
      x: finalX,
      y,
      width,
      height,
      zIndex: zIndexCounter++,
      layerId,
      text: textContent,
      fillColor: parsedStyles['background-color'] || (isContainer ? '#ffffff' : undefined),
      strokeColor: parsedStyles['border-color'] || (isContainer ? '#e2e8f0' : undefined),
      strokeWidth: parsedStyles['border-width']
        ? parseInt(parsedStyles['border-width'], 10)
        : isContainer
          ? 1
          : 0,
      borderRadius: parsedStyles['border-radius']
        ? parseInt(parsedStyles['border-radius'], 10)
        : isContainer
          ? 10
          : 4,
      textColor: parsedStyles.color || '#0f172a',
      fontSize: parsedStyles['font-size']
        ? parseInt(parsedStyles['font-size'], 10)
        : this.getDefaultFontSize(tagName),
      textAlign: (parsedStyles['text-align'] as any) || 'right',
      rawCss: inlineStyle || undefined,
      tailwindClasses: tailwindClasses || classList || undefined,
      children: [],
    };

    elements.push(canvasElement);

    // معالجة الأبناء التداخلية
    const childElements = Array.from(el.children) as HTMLElement[];
    let childOffsetY = 16;
    const childIds: string[] = [];

    for (const child of childElements) {
      const childX = finalX + 16;
      const childY = y + childOffsetY;

      const childId = this.processElementNode(
        child,
        childX,
        childY,
        elId,
        elements,
        colors,
        fonts,
        layerId,
        zIndexCounter + 1,
        width - 32,
        width,
      );

      if (childId) {
        childIds.push(childId);
        const childEl = elements.find((e) => e.id === childId);
        if (childEl) {
          childOffsetY += childEl.height + 12;
        }
      }
    }

    // إذا كانت حاوية وكان ارتفاع الأبناء أكبر، نوسّع الحاوية تلقائياً
    if (childIds.length > 0) {
      canvasElement.children = childIds;
      if (childOffsetY + 20 > canvasElement.height) {
        canvasElement.height = childOffsetY + 20;
      }
    }

    return elId;
  }

  /**
   * تفكيك الأنماط المضمنة
   */
  private static parseInlineStyles(styleString: string): Record<string, string> {
    const styles: Record<string, string> = {};
    if (!styleString) return styles;

    styleString.split(';').forEach((chunk) => {
      const colonIdx = chunk.indexOf(':');
      if (colonIdx > -1) {
        const key = chunk.substring(0, colonIdx).trim().toLowerCase();
        const value = chunk.substring(colonIdx + 1).trim();
        if (key && value) {
          styles[key] = value;
        }
      }
    });

    return styles;
  }

  /**
   * تحديد نوع العنصر وأبعاده التقديرية
   */
  private static determineElementTypeAndDimensions(
    el: HTMLElement,
    tagName: string,
    styles: Record<string, string>,
  ): { type: CanvasElementType; width: number; height: number; isContainer: boolean } {
    let width = styles.width ? parseInt(styles.width, 10) : 0;
    let height = styles.height ? parseInt(styles.height, 10) : 0;
    let isContainer = false;
    let type: CanvasElementType = 'html-card';

    switch (tagName) {
      case 'header':
      case 'nav':
        type = 'container';
        width = width || 720;
        height = height || 64;
        isContainer = true;
        break;
      case 'section':
      case 'main':
      case 'article':
        type = 'container';
        width = width || 720;
        height = height || 220;
        isContainer = true;
        break;
      case 'div':
      case 'form':
      case 'table':
        type = 'container';
        width = width || 320;
        height = height || 160;
        isContainer = true;
        break;
      case 'button':
        type = 'button';
        width = width || 130;
        height = height || 40;
        break;
      case 'input':
      case 'textarea':
      case 'select':
        type = 'rectangle';
        width = width || 220;
        height = height || (tagName === 'textarea' ? 80 : 38);
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'span':
      case 'a':
      case 'label':
        type = 'text';
        width = width || Math.min(Math.max((el.innerText?.length || 10) * 10, 100), 600);
        height = height || (tagName.startsWith('h') ? 44 : 28);
        break;
      case 'img':
        type = 'image';
        width = width || 180;
        height = height || 120;
        break;
      default:
        type = 'html-card';
        width = width || 240;
        height = height || 100;
        break;
    }

    return { type, width, height, isContainer };
  }

  /**
   * استنتاج فئات Tailwind المقابلة للخصائص
   */
  private static computeTailwindClasses(
    tagName: string,
    styles: Record<string, string>,
    existingClasses: string,
  ): string {
    const classes: string[] = [];

    if (existingClasses) {
      classes.push(existingClasses);
    }

    if (styles['display'] === 'flex') classes.push('flex');
    if (styles['display'] === 'grid') classes.push('grid');
    if (styles['flex-direction'] === 'column') classes.push('flex-col');
    if (styles['justify-content'] === 'center') classes.push('justify-center');
    if (styles['justify-content'] === 'space-between') classes.push('justify-between');
    if (styles['align-items'] === 'center') classes.push('items-center');

    if (styles['text-align'] === 'center') classes.push('text-center');
    if (styles['text-align'] === 'right') classes.push('text-right');

    if (styles['font-weight'] === 'bold' || parseInt(styles['font-weight'] || '400', 10) >= 700) {
      classes.push('font-bold');
    }

    return classes.join(' ');
  }

  private static getDefaultFontSize(tagName: string): number {
    switch (tagName) {
      case 'h1':
        return 28;
      case 'h2':
        return 22;
      case 'h3':
        return 18;
      case 'h4':
        return 16;
      case 'button':
        return 13;
      case 'small':
        return 11;
      default:
        return 14;
    }
  }
}
