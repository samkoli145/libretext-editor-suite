/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحليل HTML وتحويله إلى شجرة AST - HTML Parser Engine
 * 🏛️ الدور: محرك مشترك - تحويل عناصر HTML إلى شجرة بنية مجردة
 * 📥 المستهلك: StyleExtractor, BlockMapperEngine, InfiniteLayerTree
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    HTML to AST Converter: محوّل HTML إلى شجرة AST
 *    جاهزة لإدارة الطبقات ذات العمق اللانهائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. العناصر يجب أن تحتفظ بموقعها النسبي
 *    2. الأنماط المدمجة يجب أن تُحلَّل بالكامل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع العنصر قبل التحويل
 *    - fallback لعقدة نصية بسيطة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ASTNodeAttributes {
  id?: string;
  class?: string;
  style?: string;
  src?: string;
  href?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  [key: string]: string | undefined;
}

export interface ASTStyleProperties {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'right' | 'left' | 'center' | 'justify';
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  padding?: number;
  margin?: number;
  width?: number;
  height?: number;
  opacity?: number;
  boxShadow?: string;
  rawCss?: string;
}

export interface ASTNode {
  id: string;
  tagName: string;
  nodeType: 'element' | 'text' | 'container' | 'leaf';
  textContent?: string;
  attributes: ASTNodeAttributes;
  computedStyles: ASTStyleProperties;
  dimensions: {
    width: number;
    height: number;
    estimatedX: number;
    estimatedY: number;
  };
  depth: number;
  parentId?: string;
  children: ASTNode[];
  meta: {
    isInteractive: boolean;
    isSemanticContainer: boolean;
    hasCustomStyles: boolean;
    originalHtml?: string;
  };
}

export interface ParseResult {
  rootNodes: ASTNode[];
  allNodesFlat: ASTNode[];
  detectedPalette: string[];
  detectedFonts: string[];
  totalElementsCount: number;
  maxDepth: number;
}

export class HTMLParserEngine {
  /**
   * تحويل سلسلة HTML إلى شجرة AST متكاملة
   */
  static parseToAST(
    html: string,
    initialX = 100,
    initialY = 100,
    layerId = 'layer-main',
  ): ParseResult {
    const parser = new DOMParser();
    const cleanHtml = this.sanitizeHtml(html);
    const doc = parser.parseFromString(cleanHtml, 'text/html');

    const palette = new Set<string>();
    const fonts = new Set<string>();
    const allNodesFlat: ASTNode[] = [];
    let maxDepth = 0;

    const bodyChildren = Array.from(doc.body.children);
    const rootElements =
      bodyChildren.length > 0
        ? bodyChildren
        : Array.from(doc.body.childNodes).filter((n) => n.nodeType === Node.ELEMENT_NODE);

    let currentCursorY = initialY;
    const rootNodes: ASTNode[] = [];

    rootElements.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const ast = this.traverseDOM(
          node as HTMLElement,
          0,
          undefined,
          initialX,
          currentCursorY,
          palette,
          fonts,
          allNodesFlat,
        );

        if (ast) {
          rootNodes.push(ast);
          currentCursorY += ast.dimensions.height + 24;
          if (ast.depth > maxDepth) maxDepth = ast.depth;
        }
      }
    });

    return {
      rootNodes,
      allNodesFlat,
      detectedPalette: Array.from(palette),
      detectedFonts: Array.from(fonts),
      totalElementsCount: allNodesFlat.length,
      maxDepth,
    };
  }

  /**
   * استعراض عناصر DOM تكرارياً لبناء عقد AST
   */
  private static traverseDOM(
    el: HTMLElement,
    currentDepth: number,
    parentId: string | undefined,
    x: number,
    y: number,
    palette: Set<string>,
    fonts: Set<string>,
    allNodesFlat: ASTNode[],
  ): ASTNode | null {
    const tagName = el.tagName.toLowerCase();

    // تجاهل الوسوم غير الرسومية
    if (['script', 'style', 'meta', 'link', 'noscript', 'head', 'template'].includes(tagName)) {
      return null;
    }

    const nodeId = `ast-${tagName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const attributes = this.extractAttributes(el);
    const computedStyles = this.parseStyles(el.getAttribute('style') || '', attributes.class || '');

    // جمع الألوان والخطوط
    if (computedStyles.color) palette.add(computedStyles.color);
    if (computedStyles.backgroundColor) palette.add(computedStyles.backgroundColor);
    if (computedStyles.borderColor) palette.add(computedStyles.borderColor);

    const isSemanticContainer = this.checkIsContainer(tagName, computedStyles);
    const isInteractive = ['button', 'input', 'a', 'select', 'textarea'].includes(tagName);

    // استخراج النص المباشر
    const directText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .filter(Boolean)
      .join(' ');

    const nodeType = isSemanticContainer ? 'container' : isInteractive ? 'element' : 'leaf';

    const { width, height } = this.estimateDimensions(tagName, computedStyles, el.innerText || '');

    const astNode: ASTNode = {
      id: nodeId,
      tagName,
      nodeType,
      textContent:
        directText ||
        (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'button', 'span', 'badge'].includes(tagName)
          ? el.innerText?.trim()
          : undefined),
      attributes,
      computedStyles,
      dimensions: {
        width,
        height,
        estimatedX: x,
        estimatedY: y,
      },
      depth: currentDepth,
      parentId,
      children: [],
      meta: {
        isInteractive,
        isSemanticContainer,
        hasCustomStyles: Boolean(attributes.style || attributes.class),
        originalHtml: el.outerHTML,
      },
    };

    allNodesFlat.push(astNode);

    // معالجة الأبناء التداخلية لعمق لانهائي
    const childElements = Array.from(el.children) as HTMLElement[];
    let childOffsetY = 16;

    for (const child of childElements) {
      const childX = x + 16;
      const childY = y + childOffsetY;

      const childAst = this.traverseDOM(
        child,
        currentDepth + 1,
        nodeId,
        childX,
        childY,
        palette,
        fonts,
        allNodesFlat,
      );

      if (childAst) {
        astNode.children.push(childAst);
        childOffsetY += childAst.dimensions.height + 12;
      }
    }

    // توسيع ارتفاع الحاوية إذا كانت الأبناء أكبر
    if (astNode.children.length > 0 && childOffsetY + 16 > astNode.dimensions.height) {
      astNode.dimensions.height = childOffsetY + 16;
    }

    return astNode;
  }

  /**
   * استخراج سمات العنصر
   */
  private static extractAttributes(el: HTMLElement): ASTNodeAttributes {
    const attrs: ASTNodeAttributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  /**
   * تحليل أنماط CSS المدمجة
   */
  private static parseStyles(styleStr: string, classStr: string): ASTStyleProperties {
    const styles: ASTStyleProperties = {
      rawCss: styleStr,
    };

    if (!styleStr) return styles;

    const declarations = styleStr.split(';');
    for (const decl of declarations) {
      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) continue;

      const prop = decl.slice(0, colonIndex).trim().toLowerCase();
      const val = decl.slice(colonIndex + 1).trim();

      switch (prop) {
        case 'color':
          styles.color = val;
          break;
        case 'background-color':
        case 'background':
          styles.backgroundColor = val;
          break;
        case 'border-color':
          styles.borderColor = val;
          break;
        case 'border-width':
          styles.borderWidth = parseInt(val, 10) || 1;
          break;
        case 'border-radius':
          styles.borderRadius = parseInt(val, 10) || 6;
          break;
        case 'font-size':
          styles.fontSize = parseInt(val, 10) || 14;
          break;
        case 'font-weight':
          styles.fontWeight = val;
          break;
        case 'text-align':
          styles.textAlign = (val as any) || 'right';
          break;
        case 'display':
          styles.display = val;
          break;
        case 'flex-direction':
          styles.flexDirection = val === 'column' ? 'column' : 'row';
          break;
        case 'justify-content':
          styles.justifyContent = val;
          break;
        case 'align-items':
          styles.alignItems = val;
          break;
        case 'width':
          styles.width = parseInt(val, 10);
          break;
        case 'height':
          styles.height = parseInt(val, 10);
          break;
        case 'opacity':
          styles.opacity = parseFloat(val) || 1;
          break;
        case 'box-shadow':
          styles.boxShadow = val;
          break;
      }
    }

    return styles;
  }

  /**
   * تقدير الأبعاد التلقائية
   */
  private static estimateDimensions(
    tagName: string,
    styles: ASTStyleProperties,
    innerText: string,
  ): { width: number; height: number } {
    let width = styles.width || 0;
    let height = styles.height || 0;

    switch (tagName) {
      case 'header':
      case 'nav':
        width = width || 740;
        height = height || 64;
        break;
      case 'section':
      case 'main':
      case 'article':
        width = width || 740;
        height = height || 220;
        break;
      case 'div':
      case 'form':
      case 'table':
        width = width || 320;
        height = height || 160;
        break;
      case 'button':
        width = width || 130;
        height = height || 40;
        break;
      case 'input':
        width = width || 220;
        height = height || 38;
        break;
      case 'textarea':
        width = width || 260;
        height = height || 80;
        break;
      case 'h1':
        width = width || Math.min(Math.max(innerText.length * 14, 120), 680);
        height = height || 48;
        break;
      case 'h2':
      case 'h3':
        width = width || Math.min(Math.max(innerText.length * 12, 100), 640);
        height = height || 38;
        break;
      case 'p':
      case 'span':
      case 'a':
        width = width || Math.min(Math.max(innerText.length * 9, 80), 600);
        height = height || 28;
        break;
      case 'img':
        width = width || 180;
        height = height || 120;
        break;
      default:
        width = width || 200;
        height = height || 80;
        break;
    }

    return { width, height };
  }

  private static checkIsContainer(tagName: string, styles: ASTStyleProperties): boolean {
    if (
      ['div', 'section', 'header', 'nav', 'footer', 'main', 'article', 'form', 'aside'].includes(
        tagName,
      )
    ) {
      return true;
    }
    if (styles.display === 'flex' || styles.display === 'grid') {
      return true;
    }
    return false;
  }

  private static sanitizeHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
  }
}
