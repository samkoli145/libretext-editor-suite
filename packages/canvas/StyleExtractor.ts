/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: استخراج أنماط CSS وتحويلها لمخططات JSON للطبقات اللانهائية
 * 🏛️ الدور: مكون مشترك - استخراج الأنماط البصرية من HTML
 * 📥 المستهلك: CanvasDesignerEditor, InfiniteLayerTree
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    CSS to JSON Schema Converter: محوّل أنماط CSS إلى مخططات JSON
 *    مع دعم الأبعاد والموقع والألوان والتأثيرات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأنماط المدمجة يجب أن تُحلَّل بدقة
 *    2. الأبعاد يجب أن تتوافق مع Canvas
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع العنصر قبل الاستخراج
 *    - fallback لقيم افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { HTMLParserEngine, type ASTNode, type ASTStyleProperties } from './engine/HTMLParserEngine';
import type { CanvasElement } from '../features/canvas-designer/model';

export interface ExtractedStyleSchema {
  id: string;
  tagName: string;
  type: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visual: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    borderRadius?: number;
    textColor?: string;
    fontSize?: number;
    textAlign?: 'right' | 'left' | 'center' | 'justify';
    opacity?: number;
    shadow?: string;
  };
  layout: {
    depth: number;
    parentId?: string;
    childrenCount: number;
    isFlex: boolean;
    flexDirection?: 'row' | 'column';
  };
  tailwindClasses: string[];
  rawInlineStyles: string;
}

export class StyleExtractor {
  /**
   * استخراج وتوليد عناصر الكانفا الكاملة من نص HTML
   */
  static extractFromHtml(
    html: string,
    originX = 100,
    originY = 100,
    layerId = 'layer-main'
  ): {
    elements: CanvasElement[];
    schemas: ExtractedStyleSchema[];
    palette: string[];
    fonts: string[];
  } {
    const parseResult = HTMLParserEngine.parseToAST(html, originX, originY, layerId);
    const schemas: ExtractedStyleSchema[] = [];
    const elements: CanvasElement[] = [];

    // تحويل عقد AST المسطحة إلى عناصر كانفا ومخططات JSON
    parseResult.allNodesFlat.forEach((node, index) => {
      const schema = this.nodeToSchema(node);
      schemas.push(schema);

      const canvasEl = this.schemaToCanvasElement(schema, node, layerId, index + 1);
      elements.push(canvasEl);
    });

    return {
      elements,
      schemas,
      palette: parseResult.detectedPalette,
      fonts: parseResult.detectedFonts,
    };
  }

  /**
   * تحويل عقدة AST إلى مخطط أنماط JSON
   */
  static nodeToSchema(node: ASTNode): ExtractedStyleSchema {
    const s = node.computedStyles;
    const tailwindClasses = this.generateTailwindClasses(s, node.tagName);

    return {
      id: node.id,
      tagName: node.tagName,
      type: this.mapTagToCanvasType(node.tagName),
      rect: {
        x: node.dimensions.estimatedX,
        y: node.dimensions.estimatedY,
        width: node.dimensions.width,
        height: node.dimensions.height,
      },
      visual: {
        fillColor: s.backgroundColor || (node.nodeType === 'container' ? '#ffffff' : undefined),
        strokeColor: s.borderColor || (node.nodeType === 'container' ? '#e2e8f0' : undefined),
        strokeWidth: s.borderWidth ?? (node.nodeType === 'container' ? 1 : 0),
        borderRadius: s.borderRadius ?? (node.nodeType === 'container' ? 8 : 4),
        textColor: s.color || '#0f172a',
        fontSize: s.fontSize || 14,
        textAlign: s.textAlign || 'right',
        opacity: s.opacity ?? 1,
        shadow: s.boxShadow,
      },
      layout: {
        depth: node.depth,
        parentId: node.parentId,
        childrenCount: node.children.length,
        isFlex: s.display === 'flex',
        flexDirection: s.flexDirection,
      },
      tailwindClasses,
      rawInlineStyles: s.rawCss || '',
    };
  }

  /**
   * تحويل المخطط إلى عنصر كانفا متوافق مع نظام الطبقات اللانهائي
   */
  private static schemaToCanvasElement(
    schema: ExtractedStyleSchema,
    node: ASTNode,
    layerId: string,
    zIndex: number
  ): CanvasElement {
    return {
      id: schema.id,
      type: schema.type as any,
      x: schema.rect.x,
      y: schema.rect.y,
      width: schema.rect.width,
      height: schema.rect.height,
      zIndex,
      layerId,
      parentId: schema.layout.parentId,
      fillColor: schema.visual.fillColor,
      strokeColor: schema.visual.strokeColor,
      strokeWidth: schema.visual.strokeWidth,
      borderRadius: schema.visual.borderRadius,
      text: node.textContent,
      textColor: schema.visual.textColor,
      fontSize: schema.visual.fontSize,
      textAlign: schema.visual.textAlign === 'justify' ? 'center' : schema.visual.textAlign,
      opacity: schema.visual.opacity,
      tag: schema.tagName,
      tailwindClasses: schema.tailwindClasses.join(' '),
      htmlContent: node.meta.originalHtml,
    };
  }

  private static mapTagToCanvasType(tagName: string): string {
    switch (tagName) {
      case 'button':
        return 'button';
      case 'input':
      case 'textarea':
      case 'select':
        return 'input';
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'span':
      case 'a':
        return 'text';
      case 'img':
        return 'image';
      case 'header':
      case 'nav':
      case 'section':
      case 'article':
      case 'div':
      case 'form':
      case 'table':
        return 'container';
      default:
        return 'rectangle';
    }
  }

  private static generateTailwindClasses(styles: ASTStyleProperties, tagName: string): string[] {
    const classes: string[] = [];

    if (styles.display === 'flex') classes.push('flex');
    if (styles.flexDirection === 'column') classes.push('flex-col');
    if (styles.alignItems) classes.push(`items-${styles.alignItems}`);
    if (styles.justifyContent) classes.push(`justify-${styles.justifyContent}`);

    if (styles.borderRadius) {
      if (styles.borderRadius >= 16) classes.push('rounded-2xl');
      else if (styles.borderRadius >= 12) classes.push('rounded-xl');
      else if (styles.borderRadius >= 8) classes.push('rounded-lg');
      else classes.push('rounded-md');
    }

    if (styles.borderWidth) classes.push('border');
    if (styles.boxShadow) classes.push('shadow-sm');

    if (['h1', 'h2', 'h3'].includes(tagName)) {
      classes.push('font-bold');
      if (tagName === 'h1') classes.push('text-2xl');
      else if (tagName === 'h2') classes.push('text-xl');
      else classes.push('text-lg');
    }

    return classes;
  }
}
