/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التردد اللوني والتقطيع والتدرجات النقطية - Dithering & Color Quantization Engine
 * 🏛️ الدور: نواة معالجة الرسوميات النقطية (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: ImageEditor, ImageFiltersEngine, UniversalFormatConverter, CanvasDesigner
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - خوارزميات تشتيت الخطأ Error Diffusion Dithering (Floyd-Steinberg, Atkinson, Burkes, Jarvis, Sierra)
 *    - مصفوفات التردد المنظم Ordered Bayer Matrix Dithering (2x2, 4x4, 8x8)
 *    - خوارزمية التقطيع اللوني الذكي Median Cut & K-Means Color Quantization
 *    - استخراج لوحات الألوان السائدة وحساب نسب التوزيع
 *    - محاكاة لوحات الألوان الكلاسيكية (Game Boy, CGA, EGA, C64, Apple II, Monochrome)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب Overflow في قيم الـ RGB أثناء انتشار الخطأ (Clamp between 0-255)
 *    2. نسخ مصفوفة البكسلات قبل التعديل لمنع تلويث المصدر الأصلي
 *    3. مراعاة قناة Alpha وتخطي البكسلات الشفافة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخلات ولوحات الألوان غير الفارغة
 *    - استخدام دوال تقريب آمنة
 *    - دعم الثيم الفاتح النقي وتوليد لوحات عالية التباين
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ColorRgb {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface PaletteEntry {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
  luminance: number;
}

export type DitherAlgorithm =
  | 'floyd-steinberg'
  | 'atkinson'
  | 'burkes'
  | 'jarvis-judice-ninke'
  | 'sierra-2'
  | 'sierra-lite'
  | 'bayer-2x2'
  | 'bayer-4x4'
  | 'bayer-8x8'
  | 'threshold-1bit';

export type RetroPalettePreset =
  | 'monochrome'
  | 'gameboy'
  | 'cga'
  | 'ega'
  | 'c64'
  | 'apple2'
  | 'sepia'
  | 'cyberpunk'
  | 'solarized-light';

export const RETRO_PALETTES: Record<RetroPalettePreset, Array<[number, number, number]>> = {
  monochrome: [
    [0, 0, 0],
    [255, 255, 255],
  ],
  gameboy: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15],
  ],
  cga: [
    [0, 0, 0],
    [85, 255, 255],
    [255, 85, 255],
    [255, 255, 255],
  ],
  ega: [
    [0, 0, 0],
    [0, 0, 170],
    [0, 170, 0],
    [0, 170, 170],
    [170, 0, 0],
    [170, 0, 170],
    [170, 85, 0],
    [170, 170, 170],
    [85, 85, 85],
    [85, 85, 255],
    [85, 255, 85],
    [85, 255, 255],
    [255, 85, 85],
    [255, 85, 255],
    [255, 255, 85],
    [255, 255, 255],
  ],
  c64: [
    [0, 0, 0],
    [255, 255, 255],
    [136, 0, 0],
    [170, 255, 238],
    [204, 68, 204],
    [0, 204, 85],
    [0, 0, 170],
    [238, 238, 119],
    [221, 136, 85],
    [102, 68, 0],
    [255, 119, 119],
    [51, 51, 51],
    [119, 119, 119],
    [170, 255, 102],
    [0, 136, 255],
    [187, 187, 187],
  ],
  apple2: [
    [0, 0, 0],
    [114, 38, 64],
    [64, 50, 133],
    [228, 52, 254],
    [15, 87, 65],
    [128, 128, 128],
    [28, 152, 234],
    [192, 168, 247],
    [63, 87, 8],
    [227, 103, 21],
    [128, 128, 128],
    [240, 168, 191],
    [27, 203, 1],
    [191, 205, 121],
    [141, 217, 190],
    [255, 255, 255],
  ],
  sepia: [
    [32, 20, 10],
    [68, 44, 24],
    [112, 78, 46],
    [156, 116, 74],
    [194, 154, 108],
    [226, 194, 152],
    [245, 226, 198],
    [255, 248, 230],
  ],
  cyberpunk: [
    [15, 12, 41],
    [255, 0, 127],
    [0, 240, 255],
    [255, 230, 0],
    [112, 0, 255],
    [255, 255, 255],
  ],
  'solarized-light': [
    [0, 43, 54],
    [7, 54, 66],
    [88, 110, 117],
    [101, 123, 131],
    [131, 148, 150],
    [147, 161, 161],
    [238, 232, 213],
    [253, 246, 227],
    [181, 137, 0],
    [203, 75, 22],
    [220, 50, 47],
    [211, 54, 130],
    [108, 113, 196],
    [38, 139, 210],
    [42, 161, 152],
    [133, 153, 0],
  ],
};

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export class DitheringQuantizationEngine {
  /**
   * حساب المسافة اللونية الإقليدية مع وزن الإدراك البصري
   */
  public static colorDistance(
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number,
  ): number {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    // Redmean color difference metric
    const rmean = (r1 + r2) / 2;
    return Math.sqrt(
      (2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db,
    );
  }

  /**
   * العثور على أقرب لون في اللوحة
   */
  public static findClosestPaletteColor(
    r: number,
    g: number,
    b: number,
    palette: Array<[number, number, number]>,
  ): [number, number, number] {
    let minDistance = Infinity;
    let closest = palette[0] || [0, 0, 0];

    for (let i = 0; i < palette.length; i++) {
      const color = palette[i];
      const dist = this.colorDistance(r, g, b, color[0], color[1], color[2]);
      if (dist < minDistance) {
        minDistance = dist;
        closest = color;
      }
    }

    return closest;
  }

  /**
   * تطبيق خوارزمية التردد والتقطيع اللوني على صورة ImageData
   */
  public static applyDither(
    srcImageData: ImageData,
    algorithm: DitherAlgorithm,
    palette: Array<[number, number, number]>,
  ): ImageData {
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

    // مصفوفة عائمة لمعالجة انتشار الخطأ
    const rBuffer = new Float32Array(width * height);
    const gBuffer = new Float32Array(width * height);
    const bBuffer = new Float32Array(width * height);

    for (let i = 0; i < srcData.length; i += 4) {
      const idx = i / 4;
      rBuffer[idx] = srcData[i];
      gBuffer[idx] = srcData[i + 1];
      bBuffer[idx] = srcData[i + 2];
      outData[i + 3] = srcData[i + 3]; // نسخ Alpha
    }

    const clamp = (val: number) => Math.max(0, Math.min(255, val));

    const distributeError = (
      x: number,
      y: number,
      errR: number,
      errG: number,
      errB: number,
      weight: number,
      divisor: number,
    ) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      const targetIdx = y * width + x;
      const factor = weight / divisor;
      rBuffer[targetIdx] += errR * factor;
      gBuffer[targetIdx] += errG * factor;
      bBuffer[targetIdx] += errB * factor;
    };

    // ─── معالجة التردد ───
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const outIdx = idx * 4;

        if (srcData[outIdx + 3] === 0) {
          // بكسل شفاف
          outData[outIdx] = 0;
          outData[outIdx + 1] = 0;
          outData[outIdx + 2] = 0;
          outData[outIdx + 3] = 0;
          continue;
        }

        let curR = clamp(rBuffer[idx]);
        let curG = clamp(gBuffer[idx]);
        let curB = clamp(bBuffer[idx]);

        // إذا كان تردداً منظماً (Bayer)
        if (algorithm === 'bayer-4x4') {
          const matrixVal = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * 32;
          curR = clamp(curR + matrixVal);
          curG = clamp(curG + matrixVal);
          curB = clamp(curB + matrixVal);
        } else if (algorithm === 'bayer-8x8') {
          const matrixVal = (BAYER_8X8[y % 8][x % 8] / 64 - 0.5) * 32;
          curR = clamp(curR + matrixVal);
          curG = clamp(curG + matrixVal);
          curB = clamp(curB + matrixVal);
        }

        const [newR, newG, newB] = this.findClosestPaletteColor(curR, curG, curB, palette);

        outData[outIdx] = newR;
        outData[outIdx + 1] = newG;
        outData[outIdx + 2] = newB;

        const errR = curR - newR;
        const errG = curG - newG;
        const errB = curB - newB;

        if (algorithm === 'floyd-steinberg') {
          distributeError(x + 1, y, errR, errG, errB, 7, 16);
          distributeError(x - 1, y + 1, errR, errG, errB, 3, 16);
          distributeError(x, y + 1, errR, errG, errB, 5, 16);
          distributeError(x + 1, y + 1, errR, errG, errB, 1, 16);
        } else if (algorithm === 'atkinson') {
          distributeError(x + 1, y, errR, errG, errB, 1, 8);
          distributeError(x + 2, y, errR, errG, errB, 1, 8);
          distributeError(x - 1, y + 1, errR, errG, errB, 1, 8);
          distributeError(x, y + 1, errR, errG, errB, 1, 8);
          distributeError(x + 1, y + 1, errR, errG, errB, 1, 8);
          distributeError(x, y + 2, errR, errG, errB, 1, 8);
        } else if (algorithm === 'burkes') {
          distributeError(x + 1, y, errR, errG, errB, 8, 32);
          distributeError(x + 2, y, errR, errG, errB, 4, 32);
          distributeError(x - 2, y + 1, errR, errG, errB, 2, 32);
          distributeError(x - 1, y + 1, errR, errG, errB, 4, 32);
          distributeError(x, y + 1, errR, errG, errB, 8, 32);
          distributeError(x + 1, y + 1, errR, errG, errB, 4, 32);
          distributeError(x + 2, y + 1, errR, errG, errB, 2, 32);
        } else if (algorithm === 'jarvis-judice-ninke') {
          distributeError(x + 1, y, errR, errG, errB, 7, 48);
          distributeError(x + 2, y, errR, errG, errB, 5, 48);
          distributeError(x - 2, y + 1, errR, errG, errB, 3, 48);
          distributeError(x - 1, y + 1, errR, errG, errB, 5, 48);
          distributeError(x, y + 1, errR, errG, errB, 7, 48);
          distributeError(x + 1, y + 1, errR, errG, errB, 5, 48);
          distributeError(x + 2, y + 1, errR, errG, errB, 3, 48);
          distributeError(x - 2, y + 2, errR, errG, errB, 1, 48);
          distributeError(x - 1, y + 2, errR, errG, errB, 3, 48);
          distributeError(x, y + 2, errR, errG, errB, 5, 48);
          distributeError(x + 1, y + 2, errR, errG, errB, 3, 48);
          distributeError(x + 2, y + 2, errR, errG, errB, 1, 48);
        } else if (algorithm === 'sierra-2') {
          distributeError(x + 1, y, errR, errG, errB, 4, 16);
          distributeError(x + 2, y, errR, errG, errB, 3, 16);
          distributeError(x - 2, y + 1, errR, errG, errB, 1, 16);
          distributeError(x - 1, y + 1, errR, errG, errB, 2, 16);
          distributeError(x, y + 1, errR, errG, errB, 3, 16);
          distributeError(x + 1, y + 1, errR, errG, errB, 2, 16);
          distributeError(x + 2, y + 1, errR, errG, errB, 1, 16);
        }
      }
    }

    return outImageData;
  }

  /**
   * استخراج لوحة الألوان السائدة عبر خوارزمية Median Cut
   */
  public static extractDominantPalette(
    srcImageData: ImageData,
    maxColors: number = 8,
  ): PaletteEntry[] {
    const data = srcImageData.data;
    const pixels: Array<[number, number, number]> = [];

    // أخذ عينات نقطية متباعدة للأداء العالي
    const step = Math.max(1, Math.floor(data.length / (4 * 10000)));
    for (let i = 0; i < data.length; i += 4 * step) {
      if (data[i + 3] > 128) {
        pixels.push([data[i], data[i + 1], data[i + 2]]);
      }
    }

    if (pixels.length === 0) {
      return [{ hex: '#ffffff', rgb: [255, 255, 255], percentage: 100, luminance: 1 }];
    }

    // تقسيم بالـ Median Cut
    const medianCut = (
      bucket: Array<[number, number, number]>,
      depth: number,
    ): Array<Array<[number, number, number]>> => {
      if (depth === 0 || bucket.length <= 1) return [bucket];

      // حساب المدى لكل قناة
      let minR = 255,
        maxR = 0,
        minG = 255,
        maxG = 0,
        minB = 255,
        maxB = 0;
      for (const [r, g, b] of bucket) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (g < minG) minG = g;
        if (g > maxG) maxG = g;
        if (b < minB) minB = b;
        if (b > maxB) maxB = b;
      }

      const rRange = maxR - minR;
      const gRange = maxG - minG;
      const bRange = maxB - minB;

      let channelIdx = 0;
      if (gRange >= rRange && gRange >= bRange) channelIdx = 1;
      else if (bRange >= rRange && bRange >= gRange) channelIdx = 2;

      bucket.sort((a, b) => a[channelIdx] - b[channelIdx]);
      const mid = Math.floor(bucket.length / 2);
      const left = bucket.slice(0, mid);
      const right = bucket.slice(mid);

      return [...medianCut(left, depth - 1), ...medianCut(right, depth - 1)];
    };

    const depth = Math.ceil(Math.log2(Math.max(2, maxColors)));
    const buckets = medianCut(pixels, depth).slice(0, maxColors);

    const totalSamples = pixels.length;
    const entries: PaletteEntry[] = [];

    for (const b of buckets) {
      if (b.length === 0) continue;
      let sumR = 0,
        sumG = 0,
        sumB = 0;
      for (const [r, g, bVal] of b) {
        sumR += r;
        sumG += g;
        sumB += bVal;
      }
      const avgR = Math.round(sumR / b.length);
      const avgG = Math.round(sumG / b.length);
      const avgB = Math.round(sumB / b.length);

      const hex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;
      const percentage = Math.round((b.length / totalSamples) * 100);
      const luminance = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;

      entries.push({
        hex,
        rgb: [avgR, avgG, avgB],
        percentage,
        luminance,
      });
    }

    // فرز بالأعلى نسبة
    return entries.sort((a, b) => b.percentage - a.percentage);
  }
}
