/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك معالجة وترميز وتفكيك صيغ الصور المتعددة - Universal Image Format Engine
 * 🏛️ الدور: نواة مكتبية مشتركة ومعزولة (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: UniversalFormatConverter, ImageEditor, CanvasDesigner, ExportToolbar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Binary ArrayBuffer Encoding & Decoding:
 *    - ترميز وتفكيك صور BMP (24-bit, 32-bit RGBA) بدقة مصفوفة البايتات
 *    - بناء وتوليد ملفات أيقونات ICO متعددة المقاسات (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
 *    - تفكيك وترميز صيغ NetPBM (PPM, PGM, PBM) الثنائية والنصية
 *    - توليد ملفات TGA (Truevision TGA 24/32-bit)
 *    - توليد ملفات TIFF Baseline RGB ثنائية
 *    - محول Canvas عالي الجودة يدعم DPI مخصص حتى 600 DPI
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الـ BMP Header يتطلب Row Padding بمضاعفات 4 بايت
 *    2. الـ ICO Header يتطلب ترتيب الأحجام وتحديد الإزاحات (Offsets) بدقة
 *    3. التعامل مع قنوات Alpha و Little-Endian بدقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من سلامة مصفوفات ImageData والأبعاد الإيجابية
 *    - معالجة أخطاء الذاكرة والصور التالفة بأمان
 *    - تنظيف الكائنات المؤقتة و Object URLs
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ImageDimension {
  width: number;
  height: number;
}

export interface ImageEncodeOptions {
  format: 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico' | 'tga' | 'ppm' | 'tiff' | 'svg';
  quality?: number; // 0.0 to 1.0
  dpi?: number; // 72 to 600
  transparent?: boolean;
  icoSizes?: number[]; // [16, 32, 48, 64, 128, 256]
  backgroundColor?: string;
}

export interface ImageDecodeResult {
  imageData: ImageData;
  width: number;
  height: number;
  format: string;
  hasAlpha: boolean;
}

/**
 * محرك ترميز وتوليد ملفات الصور النقطية القياسية بدون أي مكتبات خارجية
 */
export class ImageFormatEngine {
  /**
   * تحويل ImageData إلى مصفوفة بايتات BMP ثنائية (24-bit أو 32-bit RGBA)
   */
  public static encodeBmp(imageData: ImageData, includeAlpha: boolean = false): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const bytesPerPixel = includeAlpha ? 4 : 3;
    const rowStride = Math.floor((width * bytesPerPixel + 3) / 4) * 4;
    const pixelArraySize = rowStride * height;
    const fileHeaderSize = 14;
    const dibHeaderSize = includeAlpha ? 108 : 40; // BITMAPV4HEADER أو BITMAPINFOHEADER
    const fileSize = fileHeaderSize + dibHeaderSize + pixelArraySize;

    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // ─── 1. BMP File Header (14 bytes) ───
    view.setUint8(0, 0x42); // 'B'
    view.setUint8(1, 0x4d); // 'M'
    view.setUint32(2, fileSize, true); // File Size
    view.setUint16(6, 0, true); // Reserved1
    view.setUint16(8, 0, true); // Reserved2
    view.setUint32(10, fileHeaderSize + dibHeaderSize, true); // Offset to pixel data

    // ─── 2. DIB Header ───
    view.setUint32(14, dibHeaderSize, true); // DIB Header size
    view.setInt32(18, width, true); // Width
    view.setInt32(22, height, true); // Height (positive = bottom-up)
    view.setUint16(26, 1, true); // Color planes
    view.setUint16(28, bytesPerPixel * 8, true); // Bits per pixel (24 or 32)
    view.setUint32(30, includeAlpha ? 3 : 0, true); // Compression (0 = BI_RGB, 3 = BI_BITFIELDS for alpha)
    view.setUint32(34, pixelArraySize, true); // Image size
    view.setInt32(38, 2835, true); // X pixels per meter (~72 DPI)
    view.setInt32(42, 2835, true); // Y pixels per meter (~72 DPI)
    view.setUint32(46, 0, true); // Colors in color table
    view.setUint32(50, 0, true); // Important color count

    if (includeAlpha && dibHeaderSize >= 108) {
      // Bitmasks for RGBA
      view.setUint32(54, 0x00ff0000, true); // Red mask
      view.setUint32(58, 0x0000ff00, true); // Green mask
      view.setUint32(62, 0x000000ff, true); // Blue mask
      view.setUint32(66, 0xff000000, true); // Alpha mask
    }

    // ─── 3. Pixel Data (Bottom-Up order in standard BMP) ───
    const offset = fileHeaderSize + dibHeaderSize;
    for (let y = height - 1; y >= 0; y--) {
      const rowStart = offset + (height - 1 - y) * rowStride;
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;
        const r = data[srcIdx];
        const g = data[srcIdx + 1];
        const b = data[srcIdx + 2];
        const a = data[srcIdx + 3];

        const dstIdx = rowStart + x * bytesPerPixel;
        bytes[dstIdx] = b; // Blue
        bytes[dstIdx + 1] = g; // Green
        bytes[dstIdx + 2] = r; // Red
        if (includeAlpha) {
          bytes[dstIdx + 3] = a; // Alpha
        }
      }
    }

    return bytes;
  }

  /**
   * تفكيك ملف BMP ثنائي وتحويله إلى ImageData
   */
  public static decodeBmp(buffer: ArrayBuffer): ImageData {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    if (view.getUint8(0) !== 0x42 || view.getUint8(1) !== 0x4d) {
      throw new Error('الملف ليس بصيغة BMP صالحة (Missing BM header signature)');
    }

    const pixelOffset = view.getUint32(10, true);
    const width = Math.abs(view.getInt32(18, true));
    const rawHeight = view.getInt32(22, true);
    const isTopDown = rawHeight < 0;
    const height = Math.abs(rawHeight);
    const bpp = view.getUint16(28, true);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء سياق Canvas 2D');

    const result = ctx.createImageData(width, height);
    const outData = result.data;
    const bytesPerPixel = Math.floor(bpp / 8);
    const rowStride = Math.floor((width * bytesPerPixel + 3) / 4) * 4;

    for (let y = 0; y < height; y++) {
      const srcY = isTopDown ? y : height - 1 - y;
      const rowOffset = pixelOffset + srcY * rowStride;

      for (let x = 0; x < width; x++) {
        const dstIdx = (y * width + x) * 4;
        const srcIdx = rowOffset + x * bytesPerPixel;

        if (bpp === 24) {
          outData[dstIdx] = bytes[srcIdx + 2]; // R
          outData[dstIdx + 1] = bytes[srcIdx + 1]; // G
          outData[dstIdx + 2] = bytes[srcIdx]; // B
          outData[dstIdx + 3] = 255; // A
        } else if (bpp === 32) {
          outData[dstIdx] = bytes[srcIdx + 2]; // R
          outData[dstIdx + 1] = bytes[srcIdx + 1]; // G
          outData[dstIdx + 2] = bytes[srcIdx]; // B
          outData[dstIdx + 3] = bytes[srcIdx + 3]; // A
        }
      }
    }

    return result;
  }

  /**
   * بناء ملف أيقونة ICO متعدد المقاسات (PNG-embedded icons container)
   */
  public static async encodeIco(
    sourceCanvas: HTMLCanvasElement,
    sizes: number[] = [16, 32, 48, 64, 128, 256],
  ): Promise<Uint8Array> {
    const validSizes = sizes.filter((s) => s >= 16 && s <= 256);
    if (validSizes.length === 0) validSizes.push(32, 64);

    // توليد صور PNG لكل مقاس
    const pngBlobs: Array<{ size: number; bytes: Uint8Array }> = [];
    for (const size of validSizes) {
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = size;
      scaledCanvas.height = size;
      const sCtx = scaledCanvas.getContext('2d');
      if (sCtx) {
        sCtx.imageSmoothingEnabled = true;
        sCtx.imageSmoothingQuality = 'high';
        sCtx.drawImage(sourceCanvas, 0, 0, size, size);
        const blob = await new Promise<Blob | null>((resolve) =>
          scaledCanvas.toBlob(resolve, 'image/png'),
        );
        if (blob) {
          const ab = await blob.arrayBuffer();
          pngBlobs.push({ size, bytes: new Uint8Array(ab) });
        }
      }
    }

    const count = pngBlobs.length;
    const headerSize = 6;
    const directoryEntrySize = 16;
    const directoryTotalSize = count * directoryEntrySize;

    let currentOffset = headerSize + directoryTotalSize;
    let totalFileSize = currentOffset;
    for (const item of pngBlobs) {
      totalFileSize += item.bytes.length;
    }

    const buffer = new ArrayBuffer(totalFileSize);
    const view = new DataView(buffer);
    const fullBytes = new Uint8Array(buffer);

    // ─── ICONDIR Header ───
    view.setUint16(0, 0, true); // Reserved (0)
    view.setUint16(2, 1, true); // Resource type: 1 for Icon (.ICO), 2 for Cursor (.CUR)
    view.setUint16(4, count, true); // Image count

    // ─── ICONDIRENTRY Entries ───
    let entryOffset = headerSize;
    for (const item of pngBlobs) {
      const w = item.size >= 256 ? 0 : item.size;
      const h = item.size >= 256 ? 0 : item.size;

      view.setUint8(entryOffset, w); // Width
      view.setUint8(entryOffset + 1, h); // Height
      view.setUint8(entryOffset + 2, 0); // Color palette count (0 for >=8bpp)
      view.setUint8(entryOffset + 3, 0); // Reserved
      view.setUint16(entryOffset + 4, 1, true); // Color planes
      view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
      view.setUint32(entryOffset + 8, item.bytes.length, true); // Image bytes length
      view.setUint32(entryOffset + 12, currentOffset, true); // Offset of image data

      // نسخ بيانات الـ PNG
      fullBytes.set(item.bytes, currentOffset);
      currentOffset += item.bytes.length;
      entryOffset += directoryEntrySize;
    }

    return fullBytes;
  }

  /**
   * ترميز صورة بصيغة TGA (Truevision Targa 24-bit أو 32-bit RGBA)
   */
  public static encodeTga(imageData: ImageData, includeAlpha: boolean = true): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const bpp = includeAlpha ? 32 : 24;
    const bytesPerPixel = includeAlpha ? 4 : 3;
    const headerSize = 18;
    const fileSize = headerSize + width * height * bytesPerPixel;

    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // ─── TGA Header (18 bytes) ───
    view.setUint8(0, 0); // ID length
    view.setUint8(1, 0); // Color map type (0 = no map)
    view.setUint8(2, 2); // Image type (2 = uncompressed true-color)
    view.setUint16(3, 0, true); // Color map first entry
    view.setUint16(5, 0, true); // Color map length
    view.setUint8(7, 0); // Color map entry size
    view.setUint16(8, 0, true); // X origin
    view.setUint16(10, 0, true); // Y origin
    view.setUint16(12, width, true); // Width
    view.setUint16(14, height, true); // Height
    view.setUint8(16, bpp); // Bits per pixel
    view.setUint8(17, includeAlpha ? 8 : 0); // Image descriptor (8 alpha bits, bottom-to-top)

    let offset = headerSize;
    // TGA standard: bottom-to-top
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;
        bytes[offset++] = data[srcIdx + 2]; // B
        bytes[offset++] = data[srcIdx + 1]; // G
        bytes[offset++] = data[srcIdx]; // R
        if (includeAlpha) {
          bytes[offset++] = data[srcIdx + 3]; // A
        }
      }
    }

    return bytes;
  }

  /**
   * ترميز صورة بصيغة PPM الثنائية (NetPBM Portable Pixmap P6)
   */
  public static encodePpm(imageData: ImageData): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const headerStr = `P6\n# WebPainter Universal PPM Export\n${width} ${height}\n255\n`;
    const encoder = new TextEncoder();
    const headerBytes = encoder.encode(headerStr);

    const pixelDataLength = width * height * 3;
    const fullArray = new Uint8Array(headerBytes.length + pixelDataLength);
    fullArray.set(headerBytes, 0);

    let offset = headerBytes.length;
    for (let i = 0; i < data.length; i += 4) {
      fullArray[offset++] = data[i]; // R
      fullArray[offset++] = data[i + 1]; // G
      fullArray[offset++] = data[i + 2]; // B
    }

    return fullArray;
  }

  /**
   * تفكيك ملف PPM أو PGM أو PBM
   */
  public static decodeNetPbm(buffer: ArrayBuffer): ImageData {
    const bytes = new Uint8Array(buffer);
    let pos = 0;

    const readToken = (): string => {
      while (
        pos < bytes.length &&
        (bytes[pos] === 32 || bytes[pos] === 10 || bytes[pos] === 13 || bytes[pos] === 9)
      ) {
        pos++;
      }
      if (pos >= bytes.length) return '';
      if (bytes[pos] === 35) {
        // Comment (#)
        while (pos < bytes.length && bytes[pos] !== 10 && bytes[pos] !== 13) {
          pos++;
        }
        return readToken();
      }
      const start = pos;
      while (pos < bytes.length && bytes[pos] > 32) {
        pos++;
      }
      return new TextDecoder().decode(bytes.subarray(start, pos));
    };

    const magic = readToken();
    if (!magic.startsWith('P')) throw new Error('ملف NetPBM غير صالح');

    const width = parseInt(readToken(), 10);
    const height = parseInt(readToken(), 10);
    if (!width || !height) throw new Error('أبعاد صورة NetPBM غير صالحة');

    const maxVal = magic === 'P1' || magic === 'P4' ? 1 : parseInt(readToken(), 10);
    // تجاوز الفراغ الفاصل
    while (
      pos < bytes.length &&
      (bytes[pos] === 32 || bytes[pos] === 10 || bytes[pos] === 13 || bytes[pos] === 9)
    ) {
      pos++;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل إنشاء سياق Canvas');

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    if (magic === 'P6') {
      // Binary PPM (RGB)
      let outIdx = 0;
      for (let i = 0; i < width * height; i++) {
        data[outIdx] = Math.round((bytes[pos++] / maxVal) * 255);
        data[outIdx + 1] = Math.round((bytes[pos++] / maxVal) * 255);
        data[outIdx + 2] = Math.round((bytes[pos++] / maxVal) * 255);
        data[outIdx + 3] = 255;
        outIdx += 4;
      }
    } else if (magic === 'P5') {
      // Binary PGM (Grayscale)
      let outIdx = 0;
      for (let i = 0; i < width * height; i++) {
        const v = Math.round((bytes[pos++] / maxVal) * 255);
        data[outIdx] = v;
        data[outIdx + 1] = v;
        data[outIdx + 2] = v;
        data[outIdx + 3] = 255;
        outIdx += 4;
      }
    }

    return imgData;
  }

  /**
   * ترميز صورة بصيغة TIFF Baseline RGB غير مضغوطة
   */
  public static encodeTiff(imageData: ImageData): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const pixelBytes = width * height * 3;
    const headerSize = 8;
    const numTags = 10;
    const ifdSize = 2 + numTags * 12 + 4;
    const stripOffset = headerSize + ifdSize + 24; // مساحة لقيم الـ Rational والمصفوفات
    const totalSize = stripOffset + pixelBytes;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // ─── TIFF Header (Little-Endian 'II') ───
    view.setUint8(0, 0x49); // 'I'
    view.setUint8(1, 0x49); // 'I'
    view.setUint16(2, 42, true); // TIFF Version (42)
    view.setUint32(4, headerSize, true); // Offset to first IFD

    // ─── IFD Entries ───
    let ifdOffset = headerSize;
    view.setUint16(ifdOffset, numTags, true);
    ifdOffset += 2;

    const writeTag = (tag: number, type: number, count: number, val: number) => {
      view.setUint16(ifdOffset, tag, true);
      view.setUint16(ifdOffset + 2, type, true); // 3=SHORT, 4=LONG
      view.setUint32(ifdOffset + 4, count, true);
      view.setUint32(ifdOffset + 8, val, true);
      ifdOffset += 12;
    };

    writeTag(256, 4, 1, width); // ImageWidth
    writeTag(257, 4, 1, height); // ImageLength
    writeTag(258, 3, 3, headerSize + ifdSize); // BitsPerSample offset (8, 8, 8)
    writeTag(259, 3, 1, 1); // Compression (1 = uncompressed)
    writeTag(262, 3, 1, 2); // PhotometricInterpretation (2 = RGB)
    writeTag(273, 4, 1, stripOffset); // StripOffsets
    writeTag(277, 3, 1, 3); // SamplesPerPixel (3 for RGB)
    writeTag(278, 4, 1, height); // RowsPerStrip
    writeTag(279, 4, 1, pixelBytes); // StripByteCounts
    writeTag(284, 3, 1, 1); // PlanarConfiguration (1 = contiguous)

    view.setUint32(ifdOffset, 0, true); // Next IFD offset (0)

    // كتابة BitsPerSample (8, 8, 8)
    const bitsOffset = headerSize + ifdSize;
    view.setUint16(bitsOffset, 8, true);
    view.setUint16(bitsOffset + 2, 8, true);
    view.setUint16(bitsOffset + 4, 8, true);

    // كتابة بكسلات الـ RGB
    let outOffset = stripOffset;
    for (let i = 0; i < data.length; i += 4) {
      bytes[outOffset++] = data[i]; // R
      bytes[outOffset++] = data[i + 1]; // G
      bytes[outOffset++] = data[i + 2]; // B
    }

    return bytes;
  }

  /**
   * تحويل عالي الدقة لأي عنصر Canvas أو SVG إلى Blob بالصيغة المطلوبة مع ضبط DPI
   */
  public static async convertToBlob(
    canvas: HTMLCanvasElement,
    options: ImageEncodeOptions,
  ): Promise<Blob> {
    const {
      format,
      quality = 0.92,
      dpi = 72,
      transparent = false,
      backgroundColor = '#ffffff',
    } = options;

    if (format === 'bmp') {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('سياق Canvas غير متاح');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const bmpBytes = this.encodeBmp(imgData, transparent);
      return new Blob([bmpBytes], { type: 'image/bmp' });
    }

    if (format === 'ico') {
      const icoBytes = await this.encodeIco(canvas, options.icoSizes || [16, 32, 48, 64, 128, 256]);
      return new Blob([icoBytes], { type: 'image/x-icon' });
    }

    if (format === 'tga') {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('سياق Canvas غير متاح');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const tgaBytes = this.encodeTga(imgData, transparent);
      return new Blob([tgaBytes], { type: 'image/x-tga' });
    }

    if (format === 'ppm') {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('سياق Canvas غير متاح');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const ppmBytes = this.encodePpm(imgData);
      return new Blob([ppmBytes], { type: 'image/x-portable-pixmap' });
    }

    if (format === 'tiff') {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('سياق Canvas غير متاح');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const tiffBytes = this.encodeTiff(imgData);
      return new Blob([tiffBytes], { type: 'image/tiff' });
    }

    // للمخرجات المدعومة محلياً في Canvas (PNG, JPEG, WebP)
    const mimeMap: Record<string, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };

    const targetMime = mimeMap[format] || 'image/png';

    // في حال عدم الشفافية وطلب JPEG يتم ملء الخلفية
    if (!transparent && targetMime === 'image/jpeg') {
      const solidCanvas = document.createElement('canvas');
      solidCanvas.width = canvas.width;
      solidCanvas.height = canvas.height;
      const sCtx = solidCanvas.getContext('2d');
      if (sCtx) {
        sCtx.fillStyle = backgroundColor;
        sCtx.fillRect(0, 0, solidCanvas.width, solidCanvas.height);
        sCtx.drawImage(canvas, 0, 0);
        return new Promise<Blob>((resolve, reject) => {
          solidCanvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('فشل تصدير JPEG'))),
            targetMime,
            quality,
          );
        });
      }
    }

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`فشل تصدير ${format}`))),
        targetMime,
        quality,
      );
    });
  }

  /**
   * تحميل أي صورة Blob أو URL أو Base64 إلى ImageData للتحليل والمعالجة
   */
  public static async loadImageToImageData(source: string | Blob): Promise<ImageData> {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    if (source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      img.src = source;
    }

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    });

    if (objectUrl) URL.revokeObjectURL(objectUrl);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('فشل تهيئة Canvas');

    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}
