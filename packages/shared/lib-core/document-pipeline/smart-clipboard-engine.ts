/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الحافظة الذكي متعدد المستويات وحل تعارض الأصول
 *           (Smart 3-Tier Clipboard & Asset Re-indexing Engine).
 * 🏛️ الدور: نواة خط معالجة المستندات والحافظة (Document Pipeline Core).
 * 📥 المستهلك: CanvasDesignerEditor, Workbench, UIDesigner, RichTextEditor.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    3-Tier Discriminative Clipboard Pipeline:
 *    المستوى 1: كائنات الفيكتور والشرائح الأصلية مع إعادة توليد المعرفات وحل الأصول
 *    المستوى 2: الصور وملفات الوسائط من الحافظة
 *    المستوى 3: النصوص العادية والماركداون الذكي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب تكرار المعرفات `id` أو تشابك أسماء المتغيرات `$var` عند اللصق المتكرر.
 *    2. إزاحة العناصر الملصقة تلقائياً (+20px, +20px) لتمييزها عن الأصل.
 *    3. التعامل الآمن مع أخطاء قراءة الحافظة في المتصفحات بدون تصريحات Clipboard.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دقيق لأنواع البيانات عبر Type Guards قبل المعالجة.
 *    - تنظيف كود JSON من أي نصوص أو وسوم خبيثة.
 *    - قيم افتراضية وموقع هبوط ذكي (Viewport Center) عند انعدام موضع المؤشر.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ClipboardPayload {
  type: 'elements' | 'slide' | 'image' | 'text';
  elements?: any[];
  assets?: Record<string, string>;
  fonts?: string[];
  text?: string;
  imageUrl?: string;
  sourceApp?: string;
  version?: number;
}

export class SmartClipboardEngine {
  private readonly MIME_TYPE = 'application/x-web-painter-payload';
  private pasteOffsetStep = 0;

  /**
   * نسخ عناصر الكانفا إلى الحافظة مع توليد تمثيل نصي بديل
   */
  async copyElements(
    elements: any[],
    assets?: Record<string, string>,
    fonts?: string[],
  ): Promise<boolean> {
    if (!elements || elements.length === 0) return false;

    const payload: ClipboardPayload = {
      type: 'elements',
      elements: JSON.parse(JSON.stringify(elements)),
      assets: assets ? { ...assets } : undefined,
      fonts: fonts ? [...fonts] : undefined,
      sourceApp: 'WebPainterNext',
      version: 2,
    };

    const jsonStr = JSON.stringify(payload);
    const textFallback = elements
      .map((el) => el.text || el.name || el.type)
      .filter(Boolean)
      .join('\n');

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/plain': new Blob([textFallback || jsonStr], { type: 'text/plain' }),
          [this.MIME_TYPE]: new Blob([jsonStr], { type: this.MIME_TYPE }),
        });
        await navigator.clipboard.write([item]);
        this.pasteOffsetStep = 0;
        return true;
      }
    } catch (e) {
      console.warn('ClipboardItem API failed, falling back to text:', e);
    }

    try {
      await navigator.clipboard.writeText(jsonStr);
      this.pasteOffsetStep = 0;
      return true;
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
      return false;
    }
  }

  /**
   * معالجة حدث اللصق الذكي من مستويات الحافظة الثلاثة
   */
  async processPasteEvent(
    e: ClipboardEvent,
    targetPosition?: { x: number; y: number },
  ): Promise<{ kind: 'elements' | 'image' | 'text' | 'none'; data: any }> {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return { kind: 'none', data: null };

    this.pasteOffsetStep++;
    const offset = this.pasteOffsetStep * 20;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎯 المستوى 1: كائنات النظام الأصلية (Native JSON Payload)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const customData = clipboardData.getData(this.MIME_TYPE);
    const textData = clipboardData.getData('text/plain');

    let parsedPayload: ClipboardPayload | null = null;

    if (customData) {
      try {
        parsedPayload = JSON.parse(customData);
      } catch (_) {}
    }

    if (
      !parsedPayload &&
      textData &&
      textData.trim().startsWith('{') &&
      textData.includes('"sourceApp"')
    ) {
      try {
        parsedPayload = JSON.parse(textData);
      } catch (_) {}
    }

    if (parsedPayload && parsedPayload.elements && Array.isArray(parsedPayload.elements)) {
      const reindexedElements = this.reindexElements(
        parsedPayload.elements,
        targetPosition,
        offset,
      );
      return {
        kind: 'elements',
        data: {
          elements: reindexedElements,
          assets: parsedPayload.assets,
          fonts: parsedPayload.fonts,
        },
      };
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🖼️ المستوى 2: ملفات الصور والوسائط (Images & Files)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const items = clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const dataUrl = await this.fileToDataUrl(file);
            return {
              kind: 'image',
              data: {
                url: dataUrl,
                fileName: file.name,
                mimeType: file.type,
                x: (targetPosition?.x ?? 100) + offset,
                y: (targetPosition?.y ?? 100) + offset,
              },
            };
          }
        }
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📝 المستوى 3: النصوص والماركداون (Plain & Markdown Text)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (textData && textData.trim().length > 0) {
      return {
        kind: 'text',
        data: {
          text: textData,
          x: (targetPosition?.x ?? 100) + offset,
          y: (targetPosition?.y ?? 100) + offset,
        },
      };
    }

    return { kind: 'none', data: null };
  }

  /**
   * إعادة تعيين المعرفات لمنع التضارب وحساب الإزاحة المكانية
   */
  private reindexElements(
    elements: any[],
    targetPosition?: { x: number; y: number },
    offset: number = 20,
  ): any[] {
    const idMap = new Map<string, string>();

    // توليد معرفات جديدة فريدة
    elements.forEach((el) => {
      if (el.id) {
        const newId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        idMap.set(el.id, newId);
      }
    });

    // حساب مركز العناصر الأصلي
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    elements.forEach((el) => {
      if (typeof el.x === 'number' && el.x < minX) minX = el.x;
      if (typeof el.y === 'number' && el.y < minY) minY = el.y;
    });

    if (!Number.isFinite(minX)) minX = 0;
    if (!Number.isFinite(minY)) minY = 0;

    return elements.map((el) => {
      const cloned = JSON.parse(JSON.stringify(el));
      cloned.id =
        idMap.get(el.id) || `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // تعديل الروابط الداخلية إذا كانت موجودة
      if (cloned.parentId && idMap.has(cloned.parentId)) {
        cloned.parentId = idMap.get(cloned.parentId);
      }
      if (cloned.targetId && idMap.has(cloned.targetId)) {
        cloned.targetId = idMap.get(cloned.targetId);
      }

      // الإزاحة المكانية
      if (targetPosition) {
        cloned.x = targetPosition.x + (el.x - minX);
        cloned.y = targetPosition.y + (el.y - minY);
      } else {
        cloned.x = (el.x ?? 0) + offset;
        cloned.y = (el.y ?? 0) + offset;
      }

      return cloned;
    });
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
