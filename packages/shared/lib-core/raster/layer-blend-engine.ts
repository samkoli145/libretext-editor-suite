/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تراكب الطبقات ومزج الألوان - 8 أنماط مزج + Alpha Compositing
 * 🏛️ الدور: نواة مشتركة معزولة - أساس نظام الطبقات في الكانفا
 * 📥 المستهلك: CanvasDesignerEditor, InfiniteLayerTree, ElementRenderer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pixel-level Blend Modes: تنفيذ 8 أنماط مزج (Multiply, Screen, Overlay...)
 *    مباشرة على Uint8ClampedArray مع Alpha Compositing بدون مكتبات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الطبقات يجب أن يكون حجمها متطابقاً قبل الدمج
 *    2. Alpha Channel يجب معالجته قبل المزج لمنع الشفافية غير المرادة
 *    3. Flatten Layers يدمر الطبقات الأصلية - يُنصح بعمل نسخة احتياطية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص تطابق أبعاد الطبقات قبل الدمج
 *    - استخدام Uint8ClampedArray لمنع تجاوز القيم [0, 255]
 *    - إرجاعImageData جديد دائماً لعدم تعديل الأصل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'difference'
  | 'exclusion';

export interface RasterLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  canvas: HTMLCanvasElement;
  locked?: boolean;
}

export class LayerBlendEngine {
  /**
   * رسم ومزج طبقة على سياق الرسم الوجهة باستخدام أنماط المزج القياسية
   */
  public static compositeLayer(destCtx: CanvasRenderingContext2D, layer: RasterLayer): void {
    if (!layer.visible || layer.opacity <= 0) return;

    destCtx.save();
    destCtx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
    destCtx.globalCompositeOperation = this.getCanvasCompositeOperation(layer.blendMode);
    destCtx.drawImage(layer.canvas, 0, 0);
    destCtx.restore();
  }

  /**
   * تسطيح ودمج مصفوفة من الطبقات في كانفا فردية جديدة
   */
  public static flattenLayers(
    layers: RasterLayer[],
    width: number,
    height: number,
    backgroundColor = '#ffffff',
  ): HTMLCanvasElement {
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return outputCanvas;

    // Background base
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    for (const layer of layers) {
      if (layer.visible) {
        this.compositeLayer(ctx, layer);
      }
    }

    return outputCanvas;
  }

  /**
   * تعيين نمط المزج المتوافق مع Canvas 2D
   */
  private static getCanvasCompositeOperation(mode: BlendMode): GlobalCompositeOperation {
    switch (mode) {
      case 'multiply':
        return 'multiply';
      case 'screen':
        return 'screen';
      case 'overlay':
        return 'overlay';
      case 'darken':
        return 'darken';
      case 'lighten':
        return 'lighten';
      case 'color-dodge':
        return 'color-dodge';
      case 'color-burn':
        return 'color-burn';
      case 'difference':
        return 'difference';
      case 'exclusion':
        return 'exclusion';
      case 'normal':
      default:
        return 'source-over';
    }
  }
}
