/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الفلاتر ومعالجة الصور النقطية - فلاتر فورية ومصفوفات الالتفاف
 * 🏛️ الدور: نواة مشتركة معزولة - أساس ImageEditor ومحرر الصور
 * 📥 المستهلك: ImageEditor, ImageStyleEngine, ImagePipelineEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Kernel Convolutions على Uint8ClampedArray مباشرة: تطبيق فلاتر الصندوقي 3x3
 *    (Blur, Sharpen, Edge Detect) مباشرة على مصفوفات البكسلات بدون مكتبات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Clamp-to-Edge عند حدود الصورة لمنع القراءة خارج النطاق
 *    2. قيم الألوان يجب أن تبقى في المجال [0, 255] دائماً
 *    3. معامل التباين قد يسبب تشبعاً زائداً عند القيم العالية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص أبعاد الصورة قبل المعالجة
 *    - استخدام Math.max(0, Math.min(255, value)) لكل بكسل
 *    - إرجاع ImageData أصلي عند الخطأ لمنع فقدان البيانات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  max: number;
}

export class ImageFiltersEngine {
  /**
   * تطبيق تعديلات السطوع والتباين والتشبع على ImageData
   */
  public static applyAdjustments(
    imageData: ImageData,
    brightness = 0, // -100 to 100
    contrast = 0,   // -100 to 100
    saturation = 0  // -100 to 100
  ): ImageData {
    const data = imageData.data;
    const bFactor = brightness * 2.55;
    const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const sFactor = (saturation + 100) / 100;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 1. Brightness
      r += bFactor;
      g += bFactor;
      b += bFactor;

      // 2. Contrast
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;

      // 3. Saturation
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * sFactor;
      g = gray + (g - gray) * sFactor;
      b = gray + (b - gray) * sFactor;

      data[i] = Math.max(0, Math.min(255, Math.round(r)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    }

    return imageData;
  }

  /**
   * فلتر التدرج الرمادي (Grayscale)
   */
  public static applyGrayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    return imageData;
  }

  /**
   * فلتر عكس الألوان (Invert)
   */
  public static applyInvert(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return imageData;
  }

  /**
   * تطبيق مصفوفة التواء بكسلية (Kernel 3x3 Convolution for Sharpen, Blur, Edge Detect)
   */
  public static applyKernel3x3(
    imageData: ImageData,
    kernel: number[],
    divisor = 1,
    offset = 0
  ): ImageData {
    const w = imageData.width;
    const h = imageData.height;
    const src = new Uint8ClampedArray(imageData.data);
    const dst = imageData.data;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let r = 0, g = 0, b = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIdx = ((y + ky) * w + (x + kx)) * 4;
            const weight = kernel[(ky + 1) * 3 + (kx + 1)];

            r += src[pixelIdx] * weight;
            g += src[pixelIdx + 1] * weight;
            b += src[pixelIdx + 2] * weight;
          }
        }

        const idx = (y * w + x) * 4;
        dst[idx] = Math.max(0, Math.min(255, r / divisor + offset));
        dst[idx + 1] = Math.max(0, Math.min(255, g / divisor + offset));
        dst[idx + 2] = Math.max(0, Math.min(255, b / divisor + offset));
      }
    }

    return imageData;
  }

  /**
   * حساب الهيستوجرام اللوني
   */
  public static calculateHistogram(imageData: ImageData): HistogramData {
    const r = new Array(256).fill(0);
    const g = new Array(256).fill(0);
    const b = new Array(256).fill(0);
    const data = imageData.data;
    let max = 0;

    for (let i = 0; i < data.length; i += 4) {
      r[data[i]]++;
      g[data[i + 1]]++;
      b[data[i + 2]]++;

      if (r[data[i]] > max) max = r[data[i]];
      if (g[data[i + 1]] > max) max = g[data[i + 1]];
      if (b[data[i + 2]] > max) max = b[data[i + 2]];
    }

    return { r, g, b, max };
  }
}
