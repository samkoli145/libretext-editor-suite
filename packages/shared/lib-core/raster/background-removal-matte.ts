/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تفريغ الخلفيات وإزالة الألوان والنقش الشفاف - Background Removal & Matte Engine
 * 🏛️ الدور: نواة معالجة الصور النقطية المشتركة (Zero-Dependencies)
 * 📥 المستهلك: ImageEditor, ImagePipelineEngine, UnifiedImageStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Euclidean Color Distance + Smooth Feathering + Flood-fill BFS: تفريغ لوني ذكي
 *    بناءً على التسامح اللوني والنعومة الحفافية مع استخراج القناع الشفاف الشامل.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. طوفان الألوان (Flood-fill) على الصور الكبيرة يحتاج كفاءة O(N) لمنع تجمد الواجهة
 *    2. تنعيم حواف الشفافية (Feathering) يجب ألا يترك هالات بيضاء/سوداء مشوهة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من حدود الإحداثيات (Bounds checking)
 *    - التعامل الآمن مع قنوات الألفا الصفرية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export class BackgroundRemovalMatteEngine {
  /**
   * حساب المسافة اللونية الإقليدية في الفضاء اللوني RGB
   */
  public static colorDistance(c1: RGBColor, c2: RGBColor): number {
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    // مسافة مرجحة تعكس حساسية العين البشرية (Redmean metric)
    const rMean = (c1.r + c2.r) / 2;
    const rWeight = 2 + rMean / 256;
    const gWeight = 4.0;
    const bWeight = 2 + (255 - rMean) / 256;
    return Math.sqrt(rWeight * dr * dr + gWeight * dg * dg + bWeight * db * db);
  }

  /**
   * تفريغ الخلفية اللونية بناءً على لون مستهدف وتسامح ونعومة حواف
   */
  public static removeColorBackground(
    imageData: ImageData,
    targetColor: RGBColor,
    tolerance = 25, // 0 to 100
    feather = 10, // 0 to 50
  ): ImageData {
    const output = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height,
    );
    const data = output.data;

    // تطبيع التسامح اللوني إلى مسافة إقليدية (0 إلى 441 تقريباً)
    const maxDist = (tolerance / 100) * 350;
    const featherDist = (feather / 100) * 120;

    for (let i = 0; i < data.length; i += 4) {
      const currentPixel: RGBColor = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      };

      const dist = this.colorDistance(currentPixel, targetColor);

      if (dist <= maxDist) {
        // تفريغ تام
        data[i + 3] = 0;
      } else if (dist <= maxDist + featherDist && featherDist > 0) {
        // نعومة وتدرج في الشفافية (Smooth step feather)
        const alphaRatio = (dist - maxDist) / featherDist;
        const currentAlpha = data[i + 3] / 255;
        data[i + 3] = Math.round(alphaRatio * currentAlpha * 255);
      }
    }

    return output;
  }

  /**
   * استخراج الشفافية بطريقة الملء التراكمي السريع (Contiguous Flood Fill Alpha)
   * تبدأ من نقطة نقر معينة (مثل الزاوية العلوية) وتفرغ كل المساحة المتصلة
   */
  public static floodFillRemoveBackground(
    imageData: ImageData,
    startX: number,
    startY: number,
    tolerance = 20,
  ): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(new Uint8ClampedArray(imageData.data), width, height);
    const data = output.data;

    const clampX = Math.max(0, Math.min(width - 1, Math.floor(startX)));
    const clampY = Math.max(0, Math.min(height - 1, Math.floor(startY)));

    const startIdx = (clampY * width + clampX) * 4;
    const startColor: RGBColor = {
      r: data[startIdx],
      g: data[startIdx + 1],
      b: data[startIdx + 2],
    };

    const maxDist = (tolerance / 100) * 350;
    const visited = new Uint8Array(width * height);
    const queueX = new Int32Array(width * height);
    const queueY = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    queueX[tail] = clampX;
    queueY[tail] = clampY;
    tail++;
    visited[clampY * width + clampX] = 1;

    while (head < tail) {
      const cx = queueX[head];
      const cy = queueY[head];
      head++;

      const pIdx = (cy * width + cx) * 4;
      data[pIdx + 3] = 0; // تفريغ

      // فحص الجيران الأربعة
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (let n = 0; n < 4; n++) {
        const nx = neighbors[n][0];
        const ny = neighbors[n][1];

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const vIdx = ny * width + nx;
          if (visited[vIdx] === 0) {
            visited[vIdx] = 1;
            const nPixelIdx = vIdx * 4;
            const nColor: RGBColor = {
              r: data[nPixelIdx],
              g: data[nPixelIdx + 1],
              b: data[nPixelIdx + 2],
            };

            if (this.colorDistance(nColor, startColor) <= maxDist) {
              queueX[tail] = nx;
              queueY[tail] = ny;
              tail++;
            }
          }
        }
      }
    }

    return output;
  }

  /**
   * تطبيق فلتر التظليل الدائري النقي (Vignette)
   */
  public static applyVignette(
    imageData: ImageData,
    radiusRatio = 0.75,
    intensity = 0.5,
  ): ImageData {
    const output = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height,
    );
    const data = output.data;
    const w = imageData.width;
    const h = imageData.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.sqrt(cx * cx + cy * cy) * radiusRatio;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * w + x) * 4;

        if (dist > maxRadius * 0.5) {
          const factor = Math.min(1, (dist - maxRadius * 0.5) / (maxRadius * 0.5));
          const darken = 1 - factor * intensity;

          data[idx] = Math.round(data[idx] * darken);
          data[idx + 1] = Math.round(data[idx + 1] * darken);
          data[idx + 2] = Math.round(data[idx + 2] * darken);
        }
      }
    }

    return output;
  }

  /**
   * تطبيق تأثير Duotone الثنائي اللوني الراقي للثيم الفاتح
   */
  public static applyDuotone(
    imageData: ImageData,
    darkHex = '#1e3a8a',
    lightHex = '#60a5fa',
  ): ImageData {
    const output = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height,
    );
    const data = output.data;

    const parseHex = (hex: string): RGBColor => {
      const clean = hex.replace('#', '');
      return {
        r: parseInt(clean.substring(0, 2), 16) || 0,
        g: parseInt(clean.substring(2, 4), 16) || 0,
        b: parseInt(clean.substring(4, 6), 16) || 0,
      };
    };

    const dark = parseHex(darkHex);
    const light = parseHex(lightHex);

    for (let i = 0; i < data.length; i += 4) {
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      data[i] = Math.round(dark.r + lum * (light.r - dark.r));
      data[i + 1] = Math.round(dark.g + lum * (light.g - dark.g));
      data[i + 2] = Math.round(dark.b + lum * (light.b - dark.b));
    }

    return output;
  }
}
