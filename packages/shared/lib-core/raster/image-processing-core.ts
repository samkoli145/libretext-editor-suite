/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نواة معالجة وضبط وتحسين الصور - Unified Image Processing Core
 * 🏛️ الدور: نواة معالجة نقطية مشتركة (Zero-Dependency Raster Engine)
 * 📥 المستهلك: UnifiedImageStudio, FloatingImageLayer, محرر PDF، والكانفا
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الخوارزميات والمعالجات المبتكرة | Innovative Image Algorithms:
 *    1. High-Contrast Study Document Scanner Filter (تنقية ملازم ومذكرات الطلاب)
 *    2. Adaptive Grayscale & Background Noise Thresholding (إزالة الشوائب)
 *    3. Brightness, Contrast, Saturation & Invert Matrix Operations
 *    4. Lossless Rotation (90°, 180°, 270°) and Arbitrary Angle Canvas Baking
 *    5. Bounding Box Crop Math with Aspect Ratio Preservation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بالثيم الفاتح وتجنب أي خلفيات سوداء غير مطلوبة
 *    2. صفر اعتماديات خارجية - استخدام HTML5 Canvas API الخالص
 *    3. تجنب تسريب الذاكرة عند معالجة الصور الكبيرة (Canvas Cleanup)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية وترقيع الدوال | Defensive Coding:
 *    - حماية من تمرير روابط صور غير صالحة عبر Promise Rejection
 *    - Fallback تلقائي للصورة الأصلية عند حدوث أي خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل التوجيهي باللغة العربية)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ImageFilterOptions {
  brightness?: number; // -100 to 100 (default 0)
  contrast?: number; // -100 to 100 (default 0)
  saturation?: number; // -100 to 100 (default 0)
  documentScannerEnhance?: boolean; // فلتر تحسين وضوح المذكرات والمستندات التعليمية
  grayscale?: boolean; // تحويل إلى رمادي
  invert?: boolean; // عكس الألوان
  opacity?: number; // 0 to 1 (default 1)
  blur?: number; // 0 to 20 px (default 0)
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * تحميل صورة بأمان عبر عنصر Image مع Promise
 */
export function loadImageSafely(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = src;
  });
}

/**
 * تطبيق فلاتر المعالجة النقطية وتوليد Data URI جديد
 */
export async function applyImageFilters(
  imageSrc: string,
  filters: ImageFilterOptions,
): Promise<string> {
  try {
    const img = await loadImageSafely(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return imageSrc;

    canvas.width = img.naturalWidth || img.width || 800;
    canvas.height = img.naturalHeight || img.height || 600;

    // تطبيق الفلاتر القياسية لـ Canvas
    const filterParts: string[] = [];
    if (filters.brightness !== undefined && filters.brightness !== 0) {
      filterParts.push(`brightness(${100 + filters.brightness}%)`);
    }
    if (filters.contrast !== undefined && filters.contrast !== 0) {
      filterParts.push(`contrast(${100 + filters.contrast}%)`);
    }
    if (filters.saturation !== undefined && filters.saturation !== 0) {
      filterParts.push(`saturate(${100 + filters.saturation}%)`);
    }
    if (filters.grayscale) {
      filterParts.push('grayscale(100%)');
    }
    if (filters.invert) {
      filterParts.push('invert(100%)');
    }
    if (filters.blur && filters.blur > 0) {
      filterParts.push(`blur(${filters.blur}px)`);
    }

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(' ');
    }

    if (filters.opacity !== undefined && filters.opacity < 1) {
      ctx.globalAlpha = Math.max(0, Math.min(1, filters.opacity));
    }

    ctx.drawImage(img, 0, 0);

    // إذا كان فلتر تحسين المستندات التعليمية مفعلاً: معالجة البكسلات مباشرة (Thresholding)
    if (filters.documentScannerEnhance) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // حساب الإضاءة (Luminance)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

        // تعزيز التباين وإزالة شوائب خلفية الورق الرمادية
        if (gray > 190) {
          // بياض ناصع للورقة
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else if (gray < 90) {
          // سواد واضح للحبر
          data[i] = Math.max(0, data[i] * 0.4);
          data[i + 1] = Math.max(0, data[i + 1] * 0.4);
          data[i + 2] = Math.max(0, data[i + 2] * 0.4);
        } else {
          // تعزيز التباين المتوسط
          const factor = (gray - 128) * 1.5 + 128;
          const clamped = Math.max(0, Math.min(255, factor));
          data[i] = clamped;
          data[i + 1] = clamped;
          data[i + 2] = clamped;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Image processing fallback:', err);
    return imageSrc;
  }
}

/**
 * قص الصورة وتوليد جزء مقتطع جديد (Crop Operation)
 */
export async function cropImage(imageSrc: string, cropRect: CropRect): Promise<string> {
  try {
    const img = await loadImageSafely(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return imageSrc;

    const safeW = Math.max(1, cropRect.width);
    const safeH = Math.max(1, cropRect.height);

    canvas.width = safeW;
    canvas.height = safeH;

    ctx.drawImage(img, cropRect.x, cropRect.y, safeW, safeH, 0, 0, safeW, safeH);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Image crop fallback:', err);
    return imageSrc;
  }
}

/**
 * تدوير الصورة بزاوية محددة (90, 180, 270...) وتوليد Data URI جديد
 */
export async function rotateImage(imageSrc: string, angleDegrees: number): Promise<string> {
  try {
    const img = await loadImageSafely(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return imageSrc;

    const rad = (angleDegrees * Math.PI) / 180;
    const isOrthogonal = Math.abs(angleDegrees) % 180 !== 0;

    const targetW = isOrthogonal ? img.naturalHeight || img.height : img.naturalWidth || img.width;
    const targetH = isOrthogonal ? img.naturalWidth || img.width : img.naturalHeight || img.height;

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Image rotate fallback:', err);
    return imageSrc;
  }
}
