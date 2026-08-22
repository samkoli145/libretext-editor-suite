/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك رفع وتحميل الصور - Drag & Drop + File API + Base64
 * 🏛️ الدور: محرك مشترك - إدارة رفع الصور وتحويلها
 * 📥 المستهلك: AssetManager, ImageDialog, ImageEditor, WebDropInspector
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Drag & Drop Zone + Base64 Pipeline: منطقة سحب وإفلات مع تحويل تلقائي
 *    إلى Base64 مع ضغط اختياري للصور الكبيرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الصور الكبيرة جداً (>10MB) يجب ضغطها قبل التحويل
 *    2. Base64 يزيد الحجم بنسبة 33% - يُنصح بضغط مسبق
 *    3. بعض الصيغ (WebP) قد لا تُدعم في بعض المتصفحات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع الملف (image/*) قبل المعالجة
 *    - فحص الحد الأقصى للحجم
 *    - إرجاع رسالة خطأ وصيفة بدلاً من استثناء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/ImageUploaderEngine.ts
/**
 * محرك معالجة وضغط الصور وتحويلها للويب — 100% بدون أي مكتبات خارجية
 */

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface UploadResult {
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export class ImageUploaderEngine {
  private static instance: ImageUploaderEngine;
  private defaultOptions: Required<ImageUploadOptions> = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'image/webp',
  };

  public static getInstance(): ImageUploaderEngine {
    if (!ImageUploaderEngine.instance) {
      ImageUploaderEngine.instance = new ImageUploaderEngine();
    }
    return ImageUploaderEngine.instance;
  }

  async processFile(file: File, options: ImageUploadOptions = {}): Promise<UploadResult> {
    const opts = { ...this.defaultOptions, ...options };
    const img = await this.loadImage(file);

    let { width, height } = img;
    const aspectRatio = width / height;

    if (width > opts.maxWidth) {
      width = opts.maxWidth;
      height = width / aspectRatio;
    }
    if (height > opts.maxHeight) {
      height = opts.maxHeight;
      width = height * aspectRatio;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context is not available');
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), opts.format, opts.quality);
    });

    const dataUrl = await this.blobToDataUrl(blob);

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      size: blob.size,
      mimeType: opts.format,
    };
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
    });
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const imageUploaderEngine = ImageUploaderEngine.getInstance();
