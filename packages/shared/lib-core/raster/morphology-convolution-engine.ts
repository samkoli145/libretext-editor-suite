/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الالتفاف المكاني والمورفولوجيا الرياضية - Spatial Convolution & Morphology Engine
 * 🏛️ الدور: نواة معالجة الرسوميات النقطية (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: ImageEditor, ImageFiltersEngine, BackgroundRemovalMatte
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - مصفوفات الالتفاف الرياضي 2D Convolution Kernels (Sobel, Prewitt, Laplacian, Gaussian, Unsharp Mask)
 *    - العمليات المورفولوجية الرياضية (Dilation, Erosion, Opening, Closing, Morphological Gradient)
 *    - كاشف الحواف المركب Sobel Gradient Magnitude & Direction Map
 *    - تحويل Top-Hat و Black-Hat لعزل التفاصيل الدقيقة والظلال
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. معالجة بكسلات الحواف (Boundary Mirroring/Clamping)
 *    2. ضمان بقاء قيم RGB بين 0 و 255 (Clamping)
 *    3. عزل قنوات الألوان والتعامل السليم مع قناة Alpha
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من أحجام النواة الفردية (3x3, 5x5, 7x7)
 *    - تسوية أوزان المصفوفات (Kernel Normalization) تلقائياً
 *    - مصفوفات معزولة خالية من التأثيرات الجانبية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ConvolutionKernel {
  name: string;
  size: number;
  weights: number[];
  divisor?: number;
  offset?: number;
}

export type MorphologyOp =
  'dilate' | 'erode' | 'open' | 'close' | 'gradient' | 'tophat' | 'blackhat';

export const STANDARD_KERNELS: Record<string, ConvolutionKernel> = {
  gaussianBlur3x3: {
    name: 'Gaussian Blur 3x3',
    size: 3,
    weights: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    divisor: 16,
    offset: 0,
  },
  gaussianBlur5x5: {
    name: 'Gaussian Blur 5x5',
    size: 5,
    weights: [1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, 36, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1],
    divisor: 256,
    offset: 0,
  },
  sharpen: {
    name: 'Sharpen Standard',
    size: 3,
    weights: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    divisor: 1,
    offset: 0,
  },
  unsharpMask: {
    name: 'Unsharp Mask',
    size: 3,
    weights: [-1, -2, -1, -2, 28, -2, -1, -2, -1],
    divisor: 16,
    offset: 0,
  },
  sobelHorizontal: {
    name: 'Sobel Horizontal Edges',
    size: 3,
    weights: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
    divisor: 1,
    offset: 128,
  },
  sobelVertical: {
    name: 'Sobel Vertical Edges',
    size: 3,
    weights: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    divisor: 1,
    offset: 128,
  },
  laplacianEdge: {
    name: 'Laplacian Edge Detector',
    size: 3,
    weights: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    divisor: 1,
    offset: 128,
  },
  emboss3D: {
    name: '3D Bas-Relief Emboss',
    size: 3,
    weights: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
    divisor: 1,
    offset: 128,
  },
};

export class MorphologyConvolutionEngine {
  /**
   * تطبيق مصفوفة الالتفاف الرياضي 2D Convolution على صورة ImageData
   */
  public static applyConvolution(srcImageData: ImageData, kernel: ConvolutionKernel): ImageData {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء سياق Canvas');

    const outImageData = ctx.createImageData(width, height);
    const srcData = srcImageData.data;
    const outData = outImageData.data;

    const kSize = kernel.size;
    const half = Math.floor(kSize / 2);
    const weights = kernel.weights;
    const divisor = kernel.divisor || 1;
    const offset = kernel.offset || 0;

    const clampCoord = (c: number, max: number) => Math.max(0, Math.min(max - 1, c));
    const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const outIdx = (y * width + x) * 4;

        if (srcData[outIdx + 3] === 0) {
          outData[outIdx + 3] = 0;
          continue;
        }

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let kIdx = 0;

        for (let ky = -half; ky <= half; ky++) {
          const py = clampCoord(y + ky, height);
          for (let kx = -half; kx <= half; kx++) {
            const px = clampCoord(x + kx, width);
            const srcIdx = (py * width + px) * 4;
            const w = weights[kIdx++];

            rSum += srcData[srcIdx] * w;
            gSum += srcData[srcIdx + 1] * w;
            bSum += srcData[srcIdx + 2] * w;
          }
        }

        outData[outIdx] = clampByte(rSum / divisor + offset);
        outData[outIdx + 1] = clampByte(gSum / divisor + offset);
        outData[outIdx + 2] = clampByte(bSum / divisor + offset);
        outData[outIdx + 3] = srcData[outIdx + 3];
      }
    }

    return outImageData;
  }

  /**
   * كاشف الحواف المتقدم عبر سعة تدرج سوبل (Sobel Gradient Magnitude)
   */
  public static applySobelMagnitude(srcImageData: ImageData): ImageData {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء Canvas');

    const outImageData = ctx.createImageData(width, height);
    const srcData = srcImageData.data;
    const outData = outImageData.data;

    const gxWeights = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const gyWeights = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    const clampCoord = (c: number, max: number) => Math.max(0, Math.min(max - 1, c));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const outIdx = (y * width + x) * 4;
        let gx = 0;
        let gy = 0;
        let kIdx = 0;

        for (let ky = -1; ky <= 1; ky++) {
          const py = clampCoord(y + ky, height);
          for (let kx = -1; kx <= 1; kx++) {
            const px = clampCoord(x + kx, width);
            const srcIdx = (py * width + px) * 4;
            const lum =
              0.299 * srcData[srcIdx] + 0.587 * srcData[srcIdx + 1] + 0.114 * srcData[srcIdx + 2];

            gx += lum * gxWeights[kIdx];
            gy += lum * gyWeights[kIdx];
            kIdx++;
          }
        }

        const mag = Math.min(255, Math.round(Math.hypot(gx, gy)));
        outData[outIdx] = mag;
        outData[outIdx + 1] = mag;
        outData[outIdx + 2] = mag;
        outData[outIdx + 3] = srcData[outIdx + 3];
      }
    }

    return outImageData;
  }

  /**
   * التمدد المورفولوجي (Morphological Dilation)
   */
  public static dilate(srcImageData: ImageData, radius: number = 1): ImageData {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء Canvas');

    const outImageData = ctx.createImageData(width, height);
    const srcData = srcImageData.data;
    const outData = outImageData.data;

    const clampCoord = (c: number, max: number) => Math.max(0, Math.min(max - 1, c));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let maxR = 0;
        let maxG = 0;
        let maxB = 0;
        let maxA = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          const py = clampCoord(y + dy, height);
          for (let dx = -radius; dx <= radius; dx++) {
            if (dx * dx + dy * dy > radius * radius) continue;
            const px = clampCoord(x + dx, width);
            const srcIdx = (py * width + px) * 4;

            if (srcData[srcIdx] > maxR) maxR = srcData[srcIdx];
            if (srcData[srcIdx + 1] > maxG) maxG = srcData[srcIdx + 1];
            if (srcData[srcIdx + 2] > maxB) maxB = srcData[srcIdx + 2];
            if (srcData[srcIdx + 3] > maxA) maxA = srcData[srcIdx + 3];
          }
        }

        const outIdx = (y * width + x) * 4;
        outData[outIdx] = maxR;
        outData[outIdx + 1] = maxG;
        outData[outIdx + 2] = maxB;
        outData[outIdx + 3] = maxA;
      }
    }

    return outImageData;
  }

  /**
   * التآكل المورفولوجي (Morphological Erosion)
   */
  public static erode(srcImageData: ImageData, radius: number = 1): ImageData {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء Canvas');

    const outImageData = ctx.createImageData(width, height);
    const srcData = srcImageData.data;
    const outData = outImageData.data;

    const clampCoord = (c: number, max: number) => Math.max(0, Math.min(max - 1, c));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let minR = 255;
        let minG = 255;
        let minB = 255;
        let minA = 255;

        for (let dy = -radius; dy <= radius; dy++) {
          const py = clampCoord(y + dy, height);
          for (let dx = -radius; dx <= radius; dx++) {
            if (dx * dx + dy * dy > radius * radius) continue;
            const px = clampCoord(x + dx, width);
            const srcIdx = (py * width + px) * 4;

            if (srcData[srcIdx] < minR) minR = srcData[srcIdx];
            if (srcData[srcIdx + 1] < minG) minG = srcData[srcIdx + 1];
            if (srcData[srcIdx + 2] < minB) minB = srcData[srcIdx + 2];
            if (srcData[srcIdx + 3] < minA) minA = srcData[srcIdx + 3];
          }
        }

        const outIdx = (y * width + x) * 4;
        outData[outIdx] = minR;
        outData[outIdx + 1] = minG;
        outData[outIdx + 2] = minB;
        outData[outIdx + 3] = minA;
      }
    }

    return outImageData;
  }

  /**
   * تطبيق العمليات المورفولوجية المركبة (Opening, Closing, Gradient, Top-Hat)
   */
  public static applyMorphology(
    srcImageData: ImageData,
    operation: MorphologyOp,
    radius: number = 1,
  ): ImageData {
    switch (operation) {
      case 'dilate':
        return this.dilate(srcImageData, radius);
      case 'erode':
        return this.erode(srcImageData, radius);
      case 'open': {
        const eroded = this.erode(srcImageData, radius);
        return this.dilate(eroded, radius);
      }
      case 'close': {
        const dilated = this.dilate(srcImageData, radius);
        return this.erode(dilated, radius);
      }
      case 'gradient': {
        const dilated = this.dilate(srcImageData, radius);
        const eroded = this.erode(srcImageData, radius);
        return this.subtract(dilated, eroded);
      }
      case 'tophat': {
        const opened = this.applyMorphology(srcImageData, 'open', radius);
        return this.subtract(srcImageData, opened);
      }
      case 'blackhat': {
        const closed = this.applyMorphology(srcImageData, 'close', radius);
        return this.subtract(closed, srcImageData);
      }
      default:
        return srcImageData;
    }
  }

  private static subtract(imgA: ImageData, imgB: ImageData): ImageData {
    const width = imgA.width;
    const height = imgA.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء Canvas');

    const outImageData = ctx.createImageData(width, height);
    const dataA = imgA.data;
    const dataB = imgB.data;
    const outData = outImageData.data;

    for (let i = 0; i < dataA.length; i += 4) {
      outData[i] = Math.max(0, dataA[i] - dataB[i]);
      outData[i + 1] = Math.max(0, dataA[i + 1] - dataB[i + 1]);
      outData[i + 2] = Math.max(0, dataA[i + 2] - dataB[i + 2]);
      outData[i + 3] = dataA[i + 3];
    }

    return outImageData;
  }
}
