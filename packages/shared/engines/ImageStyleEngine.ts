/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك أنماط الصور - فلاتر وتأثيرات وتنسيق صور متقدم
 * 🏛️ الدور: محرك مشترك - واجهة عالية المستوى فوق image-filters-engine
 * 📥 المستهلك: ImageEditor, ImageStyleDialog, ImagePipelineEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Filter Chain Pattern: سلسلة فلاتر قابلة للربط والتسلسل
 *    مع حفظ تاريخ التغييرات للتراجع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تطبيق فلاتر متعددة قد يسبب تشبعاً زائداً
 *    2. الأصل يجب أن يبقى غير معدّل (immutable)
 *    3. بعض الفلاتر تستنزف الذاكرة عند الصور الكبيرة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - نسخ الصورة قبل التعديل (immutable pattern)
 *    - فحص أبعاد الصورة قبل المعالجة
 *    - إرجاع الصورة الأصلية عند الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/ImageStyleEngine.ts
/**
 * محرك تنسيق وتشكيل الصور المتقدم (Advanced Image Formatting & Shape Transformer)
 * يدعم:
 * 1. تحويل وقص الصور لأشكال هندسية (Shapes & Clip-paths: Circle, Rounded, Hexagon, Star, Squircle, Diamond, Leaf, Arch, Pentagon, Octagon, Shield)
 * 2. الحواف الناعمة والتلاشي الحوافي (Soft Edges / Vignette / Feather)
 * 3. الظلال المتقدمة (Soft Elevation, Colored Ambient Glow, Deep 3D Drop Shadow)
 * 4. طبقات اللمعان والانعكاس الزجاجي الفاتح (Glassmorphism & Gloss / Luster Reflection Shine)
 * 5. طبقات الألوان والتدرجات اللونية الفاتحة (Color Overlay Layers & Multi-stop Gradients)
 * 6. الفلاتر اللونية (Brightness, Contrast, Saturation, Blur, Sepia, Grayscale)
 * متوافق 100% مع الثيم الفاتح النقي وبدون أي مكتبات خارجية
 */

export type ImageShapeType =
  | 'original'
  | 'rounded'
  | 'circle'
  | 'pill'
  | 'capsule'
  | 'squircle'
  | 'hexagon'
  | 'octagon'
  | 'diamond'
  | 'star'
  | 'shield'
  | 'badge'
  | 'leaf'
  | 'arch'
  | 'slant';

export type ShapeMaskType = ImageShapeType;

export type ShadowPreset =
  | 'none'
  | 'soft-subtle'
  | 'subtle'
  | 'elevation-md'
  | 'elevation-lg'
  | 'blue-glow'
  | 'amber-glow'
  | 'emerald-glow'
  | 'ambient-glow'
  | 'card-float'
  | 'floating-3d';

export type ShadowPresetType = ShadowPreset;

export type GlossPreset =
  | 'none'
  | 'top-shine'
  | 'diagonal-gloss'
  | 'diagonal-sweep'
  | 'radial-sheen'
  | 'glass-luster'
  | 'glass-card';

export type GlossEffectType = GlossPreset;

export interface ImageStyleOptions {
  shape?: ImageShapeType | ShapeMaskType;
  borderRadius?: number; // px
  borderWidth?: number;
  borderColor?: string;
  shadow?: ShadowPreset | ShadowPresetType;
  customShadow?: string;
  gloss?: GlossPreset | GlossEffectType;
  softEdges?: boolean; // Vignette / Feather
  softEdgeRadius?: number; // px or %
  overlayColor?: string; // hex or rgba
  overlayOpacity?: number; // 0 to 1
  gradientOverlay?: string; // linear-gradient or radial-gradient
  filters?: {
    brightness?: number; // 0 to 200%
    contrast?: number; // 0 to 200%
    saturation?: number; // 0 to 200%
    blur?: number; // px
    sepia?: number; // 0 to 100%
    grayscale?: number; // 0 to 100%
  };
  aspectRatio?: 'original' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16' | '21:9';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export class ImageStyleEngine {
  private static instance: ImageStyleEngine;

  public static getInstance(): ImageStyleEngine {
    if (!ImageStyleEngine.instance) {
      ImageStyleEngine.instance = new ImageStyleEngine();
    }
    return ImageStyleEngine.instance;
  }

  /**
   * إرجاع كود CSS clip-path لكل شكل هندسي
   */
  public getShapeClipPath(shape: ImageShapeType): string {
    switch (shape) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'pill':
      case 'capsule':
        return 'inset(0% round 9999px)';
      case 'squircle':
        return 'inset(0% round 24px)';
      case 'hexagon':
        return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'octagon':
        return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
      case 'diamond':
        return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'shield':
      case 'badge':
        return 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)';
      case 'leaf':
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      case 'arch':
        return 'polygon(0% 100%, 0% 30%, 50% 0%, 100% 30%, 100% 100%)';
      case 'slant':
        return 'polygon(0% 0%, 100% 8%, 100% 100%, 0% 92%)';
      case 'rounded':
      case 'original':
      default:
        return 'none';
    }
  }

  /**
   * إرجاع قيمة الظل المحسوبة
   */
  public getShadowStyle(preset: ShadowPreset, custom?: string): string {
    if (custom) return custom;
    switch (preset) {
      case 'soft-subtle':
      case 'subtle':
        return '0 2px 8px rgba(15, 23, 42, 0.06)';
      case 'elevation-md':
        return '0 8px 20px -4px rgba(15, 23, 42, 0.1), 0 4px 8px -2px rgba(15, 23, 42, 0.06)';
      case 'elevation-lg':
        return '0 16px 32px -6px rgba(15, 23, 42, 0.14), 0 8px 16px -4px rgba(15, 23, 42, 0.08)';
      case 'blue-glow':
        return '0 0 24px rgba(37, 99, 235, 0.25), 0 4px 12px rgba(37, 99, 235, 0.12)';
      case 'amber-glow':
        return '0 0 24px rgba(217, 119, 6, 0.25), 0 4px 12px rgba(217, 119, 6, 0.12)';
      case 'emerald-glow':
        return '0 0 24px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(16, 185, 129, 0.12)';
      case 'ambient-glow':
        return '0 0 28px rgba(59, 130, 246, 0.3), 0 6px 16px rgba(0, 0, 0, 0.08)';
      case 'card-float':
      case 'floating-3d':
        return '0 20px 40px -10px rgba(15, 23, 42, 0.2), 0 1px 3px rgba(15, 23, 42, 0.05)';
      case 'none':
      default:
        return 'none';
    }
  }

  /**
   * توليد شفرة CSS المجمعة
   */
  public generateContainerStyle(opts: ImageStyleOptions): React.CSSProperties {
    const style: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
    };

    if (opts.shape && opts.shape !== 'original') {
      const clip = this.getShapeClipPath(opts.shape);
      if (clip !== 'none') {
        style.clipPath = clip;
      }
    }

    if (opts.borderRadius !== undefined) {
      style.borderRadius = `${opts.borderRadius}px`;
    }

    if (opts.borderWidth && opts.borderColor) {
      style.border = `${opts.borderWidth}px solid ${opts.borderColor}`;
    }

    const shadow = this.getShadowStyle(opts.shadow || 'none', opts.customShadow);
    if (shadow !== 'none') {
      style.boxShadow = shadow;
    }

    if (opts.softEdges) {
      style.maskImage = 'radial-gradient(ellipse at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)';
      style.WebkitMaskImage = 'radial-gradient(ellipse at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)';
    }

    return style;
  }

  /**
   * توليد أنماط الفلاتر لوسم الصورة <img>
   */
  public generateImageStyle(opts: ImageStyleOptions): React.CSSProperties {
    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'block',
      objectFit: opts.objectFit || 'cover',
    };

    if (opts.aspectRatio && opts.aspectRatio !== 'original') {
      const [w, h] = opts.aspectRatio.split(':').map(Number);
      if (w && h) {
        style.aspectRatio = `${w} / ${h}`;
      }
    }

    const filterList: string[] = [];
    if (opts.filters) {
      if (opts.filters.brightness !== undefined && opts.filters.brightness !== 100) {
        filterList.push(`brightness(${opts.filters.brightness}%)`);
      }
      if (opts.filters.contrast !== undefined && opts.filters.contrast !== 100) {
        filterList.push(`contrast(${opts.filters.contrast}%)`);
      }
      if (opts.filters.saturation !== undefined && opts.filters.saturation !== 100) {
        filterList.push(`saturate(${opts.filters.saturation}%)`);
      }
      if (opts.filters.blur !== undefined && opts.filters.blur > 0) {
        filterList.push(`blur(${opts.filters.blur}px)`);
      }
      if (opts.filters.sepia !== undefined && opts.filters.sepia > 0) {
        filterList.push(`sepia(${opts.filters.sepia}%)`);
      }
      if (opts.filters.grayscale !== undefined && opts.filters.grayscale > 0) {
        filterList.push(`grayscale(${opts.filters.grayscale}%)`);
      }
    }

    if (filterList.length > 0) {
      style.filter = filterList.join(' ');
    }

    return style;
  }

  /**
   * توليد كود HTML نقي للصورة المنسقة لتضمينها في أي صفحة
   */
  public renderToHtml(src: string, alt = '', opts: ImageStyleOptions = {}): string {
    const containerStyle = this.generateContainerStyle(opts);
    const imageStyle = this.generateImageStyle(opts);

    const styleToStr = (st: React.CSSProperties): string => {
      return Object.entries(st)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
        .join('; ');
    };

    let glossLayer = '';
    if (opts.gloss === 'top-shine') {
      glossLayer = '<div style="position: absolute; top: 0; left: 0; right: 0; height: 45%; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%); pointer-events: none;"></div>';
    } else if (opts.gloss === 'diagonal-gloss' || opts.gloss === 'diagonal-sweep') {
      glossLayer = '<div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%); pointer-events: none;"></div>';
    } else if (opts.gloss === 'glass-card' || opts.gloss === 'glass-luster') {
      glossLayer = '<div style="position: absolute; inset: 0; border: 1px solid rgba(255,255,255,0.6); box-shadow: inset 0 1px 1px rgba(255,255,255,0.8); pointer-events: none;"></div>';
    }

    let colorLayer = '';
    if (opts.overlayColor && opts.overlayOpacity) {
      colorLayer = `<div style="position: absolute; inset: 0; background-color: ${opts.overlayColor}; opacity: ${opts.overlayOpacity}; pointer-events: none;"></div>`;
    } else if (opts.gradientOverlay) {
      colorLayer = `<div style="position: absolute; inset: 0; background: ${opts.gradientOverlay}; pointer-events: none;"></div>`;
    }

    return `
<div class="styled-image-wrapper" style="${styleToStr(containerStyle)}">
  <img src="${src}" alt="${alt}" style="${styleToStr(imageStyle)}" loading="lazy" />
  ${colorLayer}
  ${glossLayer}
</div>`.trim();
  }
}

export const imageStyleEngine = ImageStyleEngine.getInstance();
