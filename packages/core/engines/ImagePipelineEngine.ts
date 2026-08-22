/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك معالجة الصور النقطية والمتجهة - Image Pipeline Engine
 * 🏛️ الدور: محرك مشترك - قراءة EXIF، قص، تدوير، قلب، فلاتر، تحجيم، ضغط
 * 📥 المستهلك: ImageEditor, AssetManager, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Library Image Processing: معالجة صور بدون مكتبات خارجية
 *    مع قراءة EXIF يدوية (الحالات 1-8) والتصدير بصيغ متعددة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. EXIF Orientation يجب أن يُقرأ بدقة (8 حالات)
 *    2. نسبة العرض للارتفاع يجب أن تُحافظ عليها
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الأبعاد قبل المعالجة
 *    - fallback لأبعاد افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ProcessedImageResult {
  readonly dataUrl: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly fileSize: number;
  readonly mimeType: string;
}

export interface CropRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ImageFilters {
  readonly brightness?: number; // 0-200 (100 = عادي)
  readonly contrast?: number;   // 0-200 (100 = عادي)
  readonly grayscale?: number;  // 0-100 (0 = عادي)
  readonly blur?: number;       // 0-20 (بالبكسل)
  readonly saturate?: number;   // 0-200 (100 = عادي)
  readonly saturation?: number; // Alias for saturate
  readonly sepia?: number;      // 0-100 (0 = عادي)
  readonly hueRotate?: number;  // 0-360 (درجة)
  readonly invert?: number;     // 0-100 (0 = عادي)
}

export type ImageFilterOptions = ImageFilters;

export interface ImageTransformOptions {
  readonly crop?: CropRect;
  readonly rotation?: number; // 0, 90, 180, 270
  readonly flipH?: boolean;
  readonly flipV?: boolean;
  readonly filters?: ImageFilters;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format?: 'image/jpeg' | 'image/png' | 'image/webp';
  readonly quality?: number;
}

export interface ResizeResult {
  readonly width: number;
  readonly height: number;
  readonly scale: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const SUPPORTED_IMAGE_TYPES: ReadonlySet<string> = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
]);

/**
 * قراءة اتجاه الصورة من ترويسة EXIF في ملفات JPEG يدويًا وبصفر مكتبات.
 * يُرجع قيمة Orientation من 1 إلى 8 (الافتراضي 1 = عادي).
 */
export function readJpegOrientation(buffer: ArrayBuffer): number {
  if (!buffer || buffer.byteLength < 12) return 1;

  const view = new DataView(buffer);

  // التحقق من ترويسة JPEG (0xFFD8)
  if (view.getUint16(0, false) !== 0xffd8) {
    return 1;
  }

  let offset = 2;
  const length = view.byteLength;

  while (offset < length - 2) {
    const marker = view.getUint16(offset, false);
    offset += 2;

    // علامة APP1 (0xFFE1) المخصصة لمعلومات EXIF
    if (marker === 0xffe1) {
      if (offset + 6 > length) return 1;
      const exifHeader = view.getUint32(offset + 2, false);
      if (exifHeader !== 0x45786966) {
        // ليست Exif
        return 1;
      }

      const tiffOffset = offset + 8;
      if (tiffOffset + 8 > length) return 1;

      // قراءة ترتيب البايتات (II = Little Endian, MM = Big Endian)
      const byteOrder = view.getUint16(tiffOffset, false);
      const isLittleEndian = byteOrder === 0x4949;

      const ifd0Offset = view.getUint32(tiffOffset + 4, isLittleEndian);
      const startIFD = tiffOffset + ifd0Offset;
      if (startIFD + 2 > length) return 1;

      const entryCount = view.getUint16(startIFD, isLittleEndian);

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = startIFD + 2 + i * 12;
        if (entryOffset + 12 > length) break;

        const tag = view.getUint16(entryOffset, isLittleEndian);
        // Tag 0x0112 = Orientation
        if (tag === 0x0112) {
          const orientation = view.getUint16(entryOffset + 8, isLittleEndian);
          if (orientation >= 1 && orientation <= 8) {
            return orientation;
          }
          return 1;
        }
      }
      return 1;
    } else if ((marker & 0xff00) !== 0xff00) {
      break;
    } else {
      if (offset + 2 > length) break;
      const sectionLength = view.getUint16(offset, false);
      offset += sectionLength;
    }
  }

  return 1;
}

/**
 * تطبيق مصفوفة التحويل الهندسي لـ EXIF Orientation على سياق Canvas.
 */
export function applyOrientation(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number
): void {
  switch (orientation) {
    case 2: // Flip Horizontal
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // 180 rotate
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4: // Flip Vertical
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5: // Transpose (Flip H + 90 CW)
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6: // 90 CW
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7: // Transverse (Flip V + 90 CW)
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8: // 270 CW (90 CCW)
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

/**
 * معالجة ملف صورة مرفوع واستخراج أبعاده وتصحيح اتجاه EXIF وضغطه.
 */
export async function prepareUploadedImage(
  file: File,
  opts?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
  }
): Promise<ProcessedImageResult> {
  if (!file) {
    throw new Error('[ImagePipeline] الملف غير صالح');
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type) && !/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name)) {
    throw new Error(`[ImagePipeline] نوع الصورة غير مدعوم: ${file.type}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`[ImagePipeline] حجم الصورة يتجاوز الحد الأقصى (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
  }

  // 1. قراءة ArrayBuffer لفحص EXIF Orientation
  const buffer = await file.arrayBuffer();
  const orientation = readJpegOrientation(buffer);

  // 2. تحميل كـ DataURL
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const rawW = image.naturalWidth || 400;
  const rawH = image.naturalHeight || 300;

  // عند الدوران 90 أو 270 يتبادل العرض والارتفاع
  const isSwapped = orientation >= 5 && orientation <= 8;
  const orientedW = isSwapped ? rawH : rawW;
  const orientedH = isSwapped ? rawW : rawH;

  const maxW = opts?.maxWidth || 1920;
  const maxH = opts?.maxHeight || 1080;
  const fit = resizeImageToFit(orientedW, orientedH, maxW, maxH);

  const finalW = fit.width;
  const finalH = fit.height;

  const canvas = createCanvas(finalW, finalH);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;

  if (!ctx) {
    throw new Error('[ImagePipeline] تعذر تهيئة سياق الرسم للـ Canvas');
  }

  // رسم الصورة مع تطبيق Orientation إن وجد
  if (orientation > 1) {
    ctx.save();
    applyOrientation(ctx, orientation, isSwapped ? finalH : finalW, isSwapped ? finalW : finalH);
    ctx.drawImage(image, 0, 0, isSwapped ? finalH : finalW, isSwapped ? finalW : finalH);
    ctx.restore();
  } else {
    ctx.drawImage(image, 0, 0, finalW, finalH);
  }

  const format = opts?.format || (file.type === 'image/png' ? 'image/png' : 'image/webp');
  const quality = opts?.quality ?? 0.9;
  const resultDataUrl = toDataUrl(canvas, format, quality);

  return {
    dataUrl: resultDataUrl,
    width: finalW,
    height: finalH,
    aspectRatio: finalH > 0 ? finalW / finalH : 1,
    fileSize: Math.round((resultDataUrl.length * 3) / 4),
    mimeType: format,
  };
}

/**
 * معالجة ملف صورة واستخراج خصائصه وأبعاده ونسبة عرضه لارتفاعه بأمان.
 */
export async function processImageFile(file: File): Promise<ProcessedImageResult> {
  return prepareUploadedImage(file);
}

/**
 * قص وتحويل وتطبيق مرشحات بصرية شاملة على الصورة (Transformation & Pipeline).
 */
export async function transformImage(
  source: HTMLImageElement | string,
  options: ImageTransformOptions
): Promise<ProcessedImageResult> {
  const image = typeof source === 'string' ? await loadImage(source) : source;
  const origW = image.naturalWidth || 400;
  const origH = image.naturalHeight || 300;

  // 1. حساب مستطيل المصدر
  const crop = options.crop || { x: 0, y: 0, width: origW, height: origH };
  const safeCropX = Math.max(0, Math.min(crop.x, origW - 1));
  const safeCropY = Math.max(0, Math.min(crop.y, origH - 1));
  const safeCropW = Math.max(1, Math.min(crop.width, origW - safeCropX));
  const safeCropH = Math.max(1, Math.min(crop.height, origH - safeCropY));

  // 2. التحويلات الهندسية (Rotation & Flip)
  const rotation = ((options.rotation || 0) % 360 + 360) % 360;
  const isRotated90or270 = rotation === 90 || rotation === 270;

  const targetW = isRotated90or270 ? safeCropH : safeCropW;
  const targetH = isRotated90or270 ? safeCropW : safeCropH;

  // 3. التحجيم الأقصى إن حُدد
  const maxW = options.maxWidth || 2400;
  const maxH = options.maxHeight || 2400;
  const fit = resizeImageToFit(targetW, targetH, maxW, maxH);

  const canvas = createCanvas(fit.width, fit.height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;

  if (!ctx) {
    throw new Error('[ImagePipeline] تعذر تهيئة سياق الرسم للـ Canvas');
  }

  // 4. تطبيق الفلاتر
  if (options.filters) {
    ctx.filter = buildFilterString(options.filters);
  }

  ctx.save();
  ctx.translate(fit.width / 2, fit.height / 2);

  // التدوير
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // الانعكاس
  const scaleX = options.flipH ? -1 : 1;
  const scaleY = options.flipV ? -1 : 1;
  if (scaleX !== 1 || scaleY !== 1) {
    ctx.scale(scaleX, scaleY);
  }

  // رسم الجزء المقصوص في مركز الـ Canvas
  const drawW = isRotated90or270 ? fit.height : fit.width;
  const drawH = isRotated90or270 ? fit.width : fit.height;

  ctx.drawImage(
    image,
    safeCropX,
    safeCropY,
    safeCropW,
    safeCropH,
    -drawW / 2,
    -drawH / 2,
    drawW,
    drawH
  );

  ctx.restore();

  const format = options.format || 'image/png';
  const quality = Math.max(0.1, Math.min(1, options.quality ?? 0.92));
  const resultDataUrl = toDataUrl(canvas, format, quality);

  return {
    dataUrl: resultDataUrl,
    width: fit.width,
    height: fit.height,
    aspectRatio: fit.height > 0 ? fit.width / fit.height : 1,
    fileSize: Math.round((resultDataUrl.length * 3) / 4),
    mimeType: format,
  };
}

/**
 * قص جزء من صورة باستخدام Canvas API.
 */
export async function cropImage(
  source: HTMLImageElement | string,
  cropRect: CropRect
): Promise<string> {
  const result = await transformImage(source, { crop: cropRect });
  return result.dataUrl;
}

/**
 * تطبيق مرشحات لونية وبصرية على الصورة.
 */
export async function applyImageFilter(
  source: HTMLImageElement | string,
  filters: ImageFilters
): Promise<string> {
  const result = await transformImage(source, { filters });
  return result.dataUrl;
}

/**
 * حساب أبعاد التحجيم المثالية لتناسب الحدود مع الحفاظ على النسبة الأبعاد الأصلية.
 */
export function resizeImageToFit(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): ResizeResult {
  if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    return { width: 0, height: 0, scale: 0 };
  }

  const scaleX = maxWidth / width;
  const scaleY = maxHeight / height;
  const scale = Math.min(scaleX, scaleY, 1);

  const newWidth = Math.max(1, Math.round(width * scale));
  const newHeight = Math.max(1, Math.round(height * scale));

  return {
    width: newWidth,
    height: newHeight,
    scale,
  };
}

/**
 * ضغط صورة وتقليل حجمها كـ DataURL.
 */
export async function compressImage(
  source: HTMLImageElement | string,
  quality: number = 0.85,
  format: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<string> {
  const result = await transformImage(source, { quality, format });
  return result.dataUrl;
}

/**
 * إنشاء صورة مصغرة سريعة (Thumbnail).
 */
export async function createThumbnail(
  source: HTMLImageElement | string,
  size: number = 120
): Promise<string> {
  const image = typeof source === 'string' ? await loadImage(source) : source;
  const width = image.naturalWidth || 100;
  const height = image.naturalHeight || 100;

  const { width: fitW, height: fitH } = resizeImageToFit(width, height, size, size);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;

  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const offsetX = (size - fitW) / 2;
  const offsetY = (size - fitH) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, offsetX, offsetY, fitW, fitH);

  return toDataUrl(canvas, 'image/png');
}

// ─── دوال مساعدة ──────────────────────────────────────────

function createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    return canvas;
  }
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
  }
  throw new Error('[ImagePipeline] لا تتوفر بيئة كانفا في هذا السياق');
}

function toDataUrl(canvas: HTMLCanvasElement | OffscreenCanvas, type = 'image/png', quality?: number): string {
  if ('toDataURL' in canvas && typeof (canvas as HTMLCanvasElement).toDataURL === 'function') {
    return (canvas as HTMLCanvasElement).toDataURL(type, quality);
  }
  return '';
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('[ImagePipeline] تعذر قراءة ملف الصورة'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('[ImagePipeline] مصدر الصورة فارغ'));
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('[ImagePipeline] تعذر تحميل الصورة'));
    image.src = src;
  });
}

export function buildFilterString(filters: ImageFilters): string {
  const parts: string[] = [];
  if (filters.brightness !== undefined && filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== undefined && filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  const sat = filters.saturation ?? filters.saturate;
  if (sat !== undefined && sat !== 100) parts.push(`saturate(${sat}%)`);
  if (filters.grayscale !== undefined && filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.blur !== undefined && filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.sepia !== undefined && filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.hueRotate !== undefined && filters.hueRotate > 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.invert !== undefined && filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}
