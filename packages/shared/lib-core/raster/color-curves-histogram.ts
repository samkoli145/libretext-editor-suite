/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحليل الهيستوغرام ومنحنيات الألوان وضبط المستويات - Curves & Levels Engine
 * 🏛️ الدور: نواة معالجة الصور النقطية المشتركة (Zero-Dependencies)
 * 📥 المستهلك: ImageEditor, ImagePipelineEngine, UnifiedImageStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bezier Tone Curve Lookup Tables (LUTs): تحويل منحنيات بيزييه المكونة من نقاط
 *    تحكم إلى جدول بحث مباشر 256 قيمة O(1) لكل بكسل، مع رسم فوري للهيستوغرام
 *    (RGB + Luminance) على Canvas 2D في الثيم الفاتح النقي.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. نقاط المنحنى يجب أن تكون مرتبة تصاعدياً حسب الإحداثي X لمنع الانعكاس غير الرياضي
 *    2. حصر جميع مخرجات الألوان بين [0, 255] بدقة Clamped
 *    3. معاملات Gamma يجب ألا تساوي صفراً (حماية من القسمة على صفر)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية ضد مصفوفات البكسلات الفارغة أو ذات الأبعاد الصفرية
 *    - إنشاء جداول بحث آمنة (Default Identity LUT) في حالات الخطأ
 *    - Type Guards صارمة لجميع معلمات النقاط والمستويات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface CurvePoint {
  x: number; // 0 to 255
  y: number; // 0 to 255
}

export interface HistogramChannelData {
  counts: number[];
  maxCount: number;
  mean: number;
  median: number;
  stdDev: number;
}

export interface HistogramAnalysis {
  r: HistogramChannelData;
  g: HistogramChannelData;
  b: HistogramChannelData;
  luminance: HistogramChannelData;
  totalPixels: number;
}

export interface LevelsParams {
  blackPoint: number; // 0 to 254
  whitePoint: number; // (blackPoint + 1) to 255
  gamma: number;      // 0.1 to 5.0 (default 1.0)
  outBlack?: number;  // 0 to 255
  outWhite?: number;  // 0 to 255
}

export class ColorCurvesHistogramEngine {
  /**
   * حساب الهيستوغرام الشامل لكل قناة لونية وقناة الإضاءة (Luminance)
   */
  public static calculateHistogram(imageData: ImageData): HistogramAnalysis {
    const data = imageData.data;
    const totalPixels = imageData.width * imageData.height;

    const rCounts = new Array<number>(256).fill(0);
    const gCounts = new Array<number>(256).fill(0);
    const bCounts = new Array<number>(256).fill(0);
    const lCounts = new Array<number>(256).fill(0);

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let lSum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // صيغة ITU-R BT.601 لحساب الإضاءة البشرية
      const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

      rCounts[r]++;
      gCounts[g]++;
      bCounts[b]++;
      lCounts[lum]++;

      rSum += r;
      gSum += g;
      bSum += b;
      lSum += lum;
    }

    const buildChannelStats = (counts: number[], sum: number): HistogramChannelData => {
      let maxCount = 0;
      for (let i = 0; i < 256; i++) {
        if (counts[i] > maxCount) maxCount = counts[i];
      }

      const mean = totalPixels > 0 ? sum / totalPixels : 0;

      // حساب الوسيط
      let accumulated = 0;
      let median = 128;
      const half = totalPixels / 2;
      for (let i = 0; i < 256; i++) {
        accumulated += counts[i];
        if (accumulated >= half) {
          median = i;
          break;
        }
      }

      // حساب الانحراف المعياري
      let varianceSum = 0;
      for (let i = 0; i < 256; i++) {
        if (counts[i] > 0) {
          const diff = i - mean;
          varianceSum += diff * diff * counts[i];
        }
      }
      const stdDev = totalPixels > 0 ? Math.sqrt(varianceSum / totalPixels) : 0;

      return { counts, maxCount, mean, median, stdDev };
    };

    return {
      r: buildChannelStats(rCounts, rSum),
      g: buildChannelStats(gCounts, gSum),
      b: buildChannelStats(bCounts, bSum),
      luminance: buildChannelStats(lCounts, lSum),
      totalPixels,
    };
  }

  /**
   * إنشاء جدول بحث LUT أحادي من نقاط منحنى نغمي (Tone Curve)
   */
  public static generateCurveLUT(points: CurvePoint[]): Uint8Array {
    const lut = new Uint8Array(256);

    // التحقق الدفاعي وتطبيع النقاط
    const sorted = [...points]
      .filter((p) => typeof p.x === 'number' && typeof p.y === 'number')
      .sort((a, b) => a.x - b.x);

    if (sorted.length === 0) {
      for (let i = 0; i < 256; i++) lut[i] = i;
      return lut;
    }

    // ضمان وجود نقطة البداية والنهاية
    if (sorted[0].x > 0) {
      sorted.unshift({ x: 0, y: sorted[0].y });
    }
    if (sorted[sorted.length - 1].x < 255) {
      sorted.push({ x: 255, y: sorted[sorted.length - 1].y });
    }

    // استكمال خطي سلس بين النقاط (Linear & Hermite-Spline Fallback)
    for (let i = 0; i < 256; i++) {
      // إيجاد الشريحة المناسبة
      let p0 = sorted[0];
      let p1 = sorted[sorted.length - 1];

      for (let j = 0; j < sorted.length - 1; j++) {
        if (i >= sorted[j].x && i <= sorted[j + 1].x) {
          p0 = sorted[j];
          p1 = sorted[j + 1];
          break;
        }
      }

      if (p1.x === p0.x) {
        lut[i] = Math.max(0, Math.min(255, Math.round(p0.y)));
      } else {
        const t = (i - p0.x) / (p1.x - p0.x);
        // نعومة التدرج باستخدام Smoothstep
        const smoothT = t * t * (3 - 2 * t);
        const yVal = p0.y + smoothT * (p1.y - p0.y);
        lut[i] = Math.max(0, Math.min(255, Math.round(yVal)));
      }
    }

    return lut;
  }

  /**
   * تطبيق منحنيات الألوان (RGB أو القنوات الفردية) على مصفوفة بكسلات
   */
  public static applyCurves(
    imageData: ImageData,
    rgbPoints?: CurvePoint[],
    rPoints?: CurvePoint[],
    gPoints?: CurvePoint[],
    bPoints?: CurvePoint[]
  ): ImageData {
    const output = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );
    const data = output.data;

    const rgbLUT = rgbPoints && rgbPoints.length >= 2 ? this.generateCurveLUT(rgbPoints) : null;
    const rLUT = rPoints && rPoints.length >= 2 ? this.generateCurveLUT(rPoints) : null;
    const gLUT = gPoints && gPoints.length >= 2 ? this.generateCurveLUT(gPoints) : null;
    const bLUT = bPoints && bPoints.length >= 2 ? this.generateCurveLUT(bPoints) : null;

    if (!rgbLUT && !rLUT && !gLUT && !bLUT) {
      return output;
    }

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // تطبيق قنوات الألوان الفردية أولاً
      if (rLUT) r = rLUT[r];
      if (gLUT) g = gLUT[g];
      if (bLUT) b = bLUT[b];

      // تطبيق المنحنى الشامل
      if (rgbLUT) {
        r = rgbLUT[r];
        g = rgbLUT[g];
        b = rgbLUT[b];
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return output;
  }

  /**
   * تطبيق ضبط المستويات (Levels: Black point, Mid-tone Gamma, White point)
   */
  public static applyLevels(imageData: ImageData, params: LevelsParams): ImageData {
    const output = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );
    const data = output.data;

    const inBlack = Math.max(0, Math.min(254, params.blackPoint));
    const inWhite = Math.max(inBlack + 1, Math.min(255, params.whitePoint));
    const gamma = Math.max(0.05, Math.min(5.0, params.gamma || 1.0));
    const outBlack = Math.max(0, Math.min(255, params.outBlack ?? 0));
    const outWhite = Math.max(0, Math.min(255, params.outWhite ?? 255));

    // إنشاء جدول مستويات سريع
    const levelsLUT = new Uint8Array(256);
    const invGamma = 1 / gamma;
    const inRange = inWhite - inBlack;
    const outRange = outWhite - outBlack;

    for (let i = 0; i < 256; i++) {
      if (i <= inBlack) {
        levelsLUT[i] = outBlack;
      } else if (i >= inWhite) {
        levelsLUT[i] = outWhite;
      } else {
        const norm = (i - inBlack) / inRange;
        const gammaCorrected = Math.pow(norm, invGamma);
        const mapped = outBlack + gammaCorrected * outRange;
        levelsLUT[i] = Math.max(0, Math.min(255, Math.round(mapped)));
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = levelsLUT[data[i]];
      data[i + 1] = levelsLUT[data[i + 1]];
      data[i + 2] = levelsLUT[data[i + 2]];
    }

    return output;
  }

  /**
   * رسم مخطط الهيستوغرام اللحظي على عنصر Canvas 2D بتصميم فاتح أنيق
   */
  public static drawHistogram(
    canvas: HTMLCanvasElement,
    analysis: HistogramAnalysis,
    mode: 'luminance' | 'rgb' | 'all' = 'all'
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // خلفية بيضاء نقية مع خطوط شبكية ناعمة
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 64; x < 256; x += 64) {
      const px = (x / 256) * width;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    const drawCurve = (counts: number[], maxVal: number, strokeColor: string, fillColor: string) => {
      if (maxVal <= 0) return;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const normalized = counts[i] / maxVal;
        const y = height - normalized * (height - 6);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      ctx.fillStyle = fillColor;
      ctx.fill();

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    if (mode === 'luminance' || mode === 'all') {
      drawCurve(
        analysis.luminance.counts,
        analysis.luminance.maxCount,
        'rgba(71, 85, 105, 0.8)',
        'rgba(148, 163, 184, 0.2)'
      );
    }

    if (mode === 'rgb' || mode === 'all') {
      // Red
      drawCurve(
        analysis.r.counts,
        analysis.r.maxCount,
        'rgba(239, 68, 68, 0.7)',
        'rgba(239, 68, 68, 0.1)'
      );
      // Green
      drawCurve(
        analysis.g.counts,
        analysis.g.maxCount,
        'rgba(34, 197, 94, 0.7)',
        'rgba(34, 197, 94, 0.1)'
      );
      // Blue
      drawCurve(
        analysis.b.counts,
        analysis.b.maxCount,
        'rgba(59, 130, 246, 0.7)',
        'rgba(59, 130, 246, 0.1)'
      );
    }
  }
}
