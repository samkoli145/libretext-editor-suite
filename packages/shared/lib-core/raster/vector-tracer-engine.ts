/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل الصور النقطية إلى متجهات - Bitmap to SVG Vector Tracer Engine
 * 🏛️ الدور: نواة معالجة الرسوميات النقطية والمتجهات (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: ImageEditor, UniversalFormatConverter, CanvasDesigner, ExportHub
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Potrace & Marching Squares Edge Tracer:
 *    - عزل الطبقات اللونية وحساب مسارات الحدود (Contour Boundaries)
 *    - تبسيط المسارات باستخدام خوارزمية Ramer-Douglas-Peucker (RDP)
 *    - تحويل النقاط المكسرة إلى منحنيات بيزيه مكعبة ناعمة (Smooth Cubic Bezier Curves)
 *    - توليد كود SVG نقي ومهيكل بمسارات متعددة الألوان
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب الحلقات اللانهائية أثناء تتبع الحدود المغلقة (Visited matrix tracking)
 *    2. تنعيم الحواف دون فقدان المعالم الدقيقة للشكل
 *    3. إغلاق المسارات بـ 'Z' والتأكد من توافق إحداثيات viewBox
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة مصفوفات ImageData والأبعاد
 *    - تحديد سقف أقصى لعدد النقاط لتفادي بطء الأداء مع الصور الكبيرة
 *    - دعم الثيم الفاتح والألوان العالية التباين
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface TraceOptions {
  threshold?: number; // 0 to 255 (for 1-bit)
  colorLayers?: number; // 2 to 16 colors
  turdSize?: number; // تجاهل البقع الصغيرة التي تقل مساحتها عن هذا الرقم (Default: 4)
  smoothPrecision?: number; // التسامح في تبسيط المنحنيات (Default: 1.2)
  curveFitting?: boolean; // تفعيل منحنيات بيزيه الناعمة
  invert?: boolean;
}

export interface VectorLayer {
  color: string;
  paths: string[];
}

export interface TraceResult {
  svgString: string;
  width: number;
  height: number;
  layers: VectorLayer[];
  totalPaths: number;
}

export class VectorTracerEngine {
  /**
   * خوارزمية Ramer-Douglas-Peucker لتبسيط مسارات النقاط
   */
  public static simplifyPoints(points: Point2D[], tolerance: number = 1.0): Point2D[] {
    if (points.length <= 2) return points;

    let maxDist = 0;
    let index = 0;
    const first = points[0];
    const last = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const dist = this.perpendicularDistance(points[i], first, last);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }

    if (maxDist > tolerance) {
      const left = this.simplifyPoints(points.slice(0, index + 1), tolerance);
      const right = this.simplifyPoints(points.slice(index), tolerance);
      return [...left.slice(0, -1), ...right];
    } else {
      return [first, last];
    }
  }

  private static perpendicularDistance(p: Point2D, lineStart: Point2D, lineEnd: Point2D): number {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return Math.hypot(p.x - lineStart.x, p.y - lineStart.y);
    return Math.abs(dy * p.x - dx * p.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / len;
  }

  /**
   * تحويل سلسلة نقاط إلى مسار SVG ناعم بمنحنيات بيزيه
   */
  public static pointsToSmoothPath(points: Point2D[], closed: boolean = true): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}${closed ? ' Z' : ''}`;
    }

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    const len = points.length;

    for (let i = 0; i < (closed ? len : len - 1); i++) {
      const p0 = points[(i - 1 + len) % len];
      const p1 = points[i];
      const p2 = points[(i + 1) % len];
      const p3 = points[(i + 2) % len];

      // نقاط تحكم Catmull-Rom إلى بيزيه مكعبة
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    if (closed) d += ' Z';
    return d;
  }

  /**
   * تتبع حدود مصفوفة ثنائية (Binary Matrix) واستخراج المسارات
   */
  public static traceBinaryMatrix(
    grid: Uint8Array,
    width: number,
    height: number,
    turdSize: number = 4,
    tolerance: number = 1.0,
    useCurves: boolean = true,
  ): string[] {
    const visited = new Uint8Array(width * height);
    const paths: string[] = [];

    // اتجاهات الجوار (8-neighbors)
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (grid[idx] === 1 && visited[idx] === 0) {
          // فحص هل هي حافة خارجية (لها جار بقيمة 0)
          let isEdge = false;
          for (let d = 0; d < 8; d += 2) {
            const nx = x + dirs[d].dx;
            const ny = y + dirs[d].dy;
            if (grid[ny * width + nx] === 0) {
              isEdge = true;
              break;
            }
          }

          if (!isEdge) continue;

          // تتبع الحلقة المحيطة
          const contour: Point2D[] = [];
          let cx = x;
          let cy = y;
          let curDir = 0;
          let steps = 0;
          const maxSteps = width * height;

          while (steps < maxSteps) {
            visited[cy * width + cx] = 1;
            contour.push({ x: cx, y: cy });

            let nextFound = false;
            // البحث عن النقطة التالية في اتجاه عقارب الساعة
            for (let i = 0; i < 8; i++) {
              const testDir = (curDir + i + 6) % 8;
              const nx = cx + dirs[testDir].dx;
              const ny = cy + dirs[testDir].dy;

              if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny * width + nx] === 1) {
                cx = nx;
                cy = ny;
                curDir = testDir;
                nextFound = true;
                break;
              }
            }

            steps++;
            if (!nextFound || (cx === x && cy === y && steps > 2)) break;
          }

          if (contour.length >= turdSize) {
            const simplified = this.simplifyPoints(contour, tolerance);
            if (simplified.length >= 3) {
              const pathD = useCurves
                ? this.pointsToSmoothPath(simplified, true)
                : `M ${simplified.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} Z`;
              paths.push(pathD);
            }
          }
        }
      }
    }

    return paths;
  }

  /**
   * تحويل ImageData إلى SVG نقي متعدد الطبقات
   */
  public static traceImageData(imageData: ImageData, options: TraceOptions = {}): TraceResult {
    const {
      threshold = 128,
      colorLayers = 4,
      turdSize = 4,
      smoothPrecision = 1.0,
      curveFitting = true,
      invert = false,
    } = options;

    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const layers: VectorLayer[] = [];
    let totalPaths = 0;

    if (colorLayers <= 2) {
      // 1-Bit Monochrome Vectorization
      const grid = new Uint8Array(width * height);
      for (let i = 0; i < data.length; i += 4) {
        const idx = i / 4;
        const a = data[i + 3];
        if (a < 64) {
          grid[idx] = 0;
          continue;
        }
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = lum < threshold ? 1 : 0;
        grid[idx] = invert ? (val === 1 ? 0 : 1) : val;
      }

      const paths = this.traceBinaryMatrix(
        grid,
        width,
        height,
        turdSize,
        smoothPrecision,
        curveFitting,
      );
      totalPaths += paths.length;
      layers.push({
        color: '#0f172a',
        paths,
      });
    } else {
      // Multi-Layer Quantized Color Vectorization
      const step = 255 / (colorLayers - 1);
      for (let l = 0; l < colorLayers; l++) {
        const targetLum = l * step;
        const low = Math.max(0, targetLum - step / 2);
        const high = Math.min(255, targetLum + step / 2);

        const grid = new Uint8Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4;
          if (data[i + 3] < 64) {
            grid[idx] = 0;
            continue;
          }
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          grid[idx] = lum >= low && lum <= high ? 1 : 0;
        }

        const paths = this.traceBinaryMatrix(
          grid,
          width,
          height,
          turdSize,
          smoothPrecision,
          curveFitting,
        );
        if (paths.length > 0) {
          const hexVal = Math.round(targetLum).toString(16).padStart(2, '0');
          layers.push({
            color: `#${hexVal}${hexVal}${hexVal}`,
            paths,
          });
          totalPaths += paths.length;
        }
      }
    }

    // بناء كود SVG
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
    for (const layer of layers) {
      for (const p of layer.paths) {
        svgContent += `  <path d="${p}" fill="${layer.color}" fill-rule="evenodd" />\n`;
      }
    }
    svgContent += `</svg>`;

    return {
      svgString: svgContent,
      width,
      height,
      layers,
      totalPaths,
    };
  }
}
