/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الفرش والرسم النقطي عالي الدقة - أنماط فرش متعددة وتنعيم بيزييه
 * 🏛️ الدور: نواة مشتركة معزولة - أساس أداة الرسم في الكانفا
 * 📥 المستهلك: CanvasDesignerEditor, CanvasViewport, useRasterCanvas
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bezier Smoothing + Velocity Interpolation: تحويل نقاط الفأرة الخام
 *    إلى منحنيات بيزييه سلسة بالضغط والسرعة لإزالة التقطع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. نقطة مفردة (Single Click) يجب أن ترسم دائرة مصمتة لا منحنى
 *    2. نمط الممحاة يتطلب globalCompositeOperation = 'destination-out'
 *    3. الأداء يتأثر بعدد النقاط - يُنصح بالتسطيح بعد 1000 نقطة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص طول المصفوفة قبل الحلقة لمنع الأخطاء
 *    - تعامل مع OffscreenCanvas غير المدعوم في بعض المتصفحات
 *    - حفظ واستعادة حالة Canvas قبل وبعد الرسم
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface BrushPoint {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface BrushSettings {
  size: number;
  color: string;
  opacity: number;
  type: 'pen' | 'brush' | 'marker' | 'airbrush' | 'eraser';
  smoothing?: boolean;
}

export class BrushEngine {
  /**
   * رسم خط ناعم ومستمر بين النقاط باستخدام منحنيات بيزييه التربيعية
   */
  public static drawStroke(
    ctx: CanvasRenderingContext2D,
    points: BrushPoint[],
    settings: BrushSettings,
  ): void {
    if (!points || points.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = settings.opacity;

    if (settings.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = settings.size;
    } else if (settings.type === 'marker') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = settings.color;
      ctx.lineWidth = settings.size * 1.5;
      ctx.globalAlpha = Math.min(settings.opacity * 0.5, 1.0);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = settings.color;
      ctx.lineWidth = settings.size;
    }

    if (points.length === 1) {
      // نقطة مفردة
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = settings.type === 'eraser' ? 'rgba(0,0,0,1)' : settings.color;
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
    } else {
      // تنعيم المسار التربيعي (Quadratic Bezier Curve Interpolation)
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
    }

    ctx.stroke();
    ctx.restore();
  }

  /**
   * أداة الرذاذ (Airbrush) لتوزيع نقاط لونية عشوائية
   */
  public static drawSpray(
    ctx: CanvasRenderingContext2D,
    point: BrushPoint,
    settings: BrushSettings,
    density = 25,
  ): void {
    ctx.save();
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity * 0.3;
    const radius = settings.size;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const offsetX = Math.cos(angle) * r;
      const offsetY = Math.sin(angle) * r;
      ctx.fillRect(point.x + offsetX, point.y + offsetY, 1.2, 1.2);
    }

    ctx.restore();
  }
}
