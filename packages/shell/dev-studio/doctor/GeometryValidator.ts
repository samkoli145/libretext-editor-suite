/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [GeometryValidator.ts] فاحص الهندسة والأبعاد
 *
 * الميثاق: معادلة الحواف المتداخلة:
 *   Inner Radius = Outer Radius - Padding
 *
 * هذه المعادلة هي ما يجعل الزوايا المتداخلة تبدو صحيحة. إذا كان
 * outer=16 و padding=4، فيجب أن يكون inner=12. قيمة inner=16
 * (نفس outer) تجعل الزاوية الداخلية تبدو "منتفخة"؛ و inner=0
 * تجعلها حادة. كلاهما خطأ بصري لا يراه إلا المصمم.
 *
 * ماذا يفحص:
 * - معادلة الحواف المتداخلة في CSS/التعريفات
 * - الأبعاد غير الصالحة (سالبة، NaN، صفر حيث لا يجب)
 * - قيم px غير صحيحة (كسور تُضخم JSON دون فائدة بصرية)
 *
 * المبدأ (من rowcol.ts resizeColumn):
 * "widths are integers — fractional px bloat the JSON and never
 * render differently" — نفس المنطق ينطبق على نصف القطر والحشو.
 *
 * التنبيهات:
 * - الفاحص يبحث عن أنماط محددة (radius/padding declarations)
 * - الرفض يحمل القيم الفعلية للدليل
 * - تحذير (warn) للقيم المشبوهة، فشل (fail) للمعادلة المكسورة
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DoctorCheck, DevStudioPatch } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { contentsOf } from './DoctorEngine';

/**
 * The nested-radius rule, extracted from declarations. We look for a
 * triple declared together: an outer radius, a padding, and an inner
 * radius. When all three are present, the equation must hold.
 *
 * We do NOT invent an inner radius when only outer+padding exist — that
 * would be the doctor writing design intent it was not given. Absence of
 * an inner declaration means there is nothing to check.
 */
const RADIUS_RE = /(?:outer|border)-radius\s*:\s*(\d+(?:\.\d+)?)px/i;
const INNER_RE = /inner-radius\s*:\s*(\d+(?:\.\d+)?)px/i;
const PAD_RE = /padding\s*:\s*(\d+(?:\.\d+)?)px/i;

export function checkGeometry(patches: DevStudioPatch[], _project?: ProjectSurface): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  for (const { path, content } of contentsOf(patches)) {
    const lines = content.split('\n');

    let outer: number | null = null;
    let inner: number | null = null;
    let pad: number | null = null;

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      // Negative or fractional dimensions are a smell everywhere they appear.
      const negDim = line.match(/(?:width|height|radius|padding)\s*:\s*-(\d)/i);
      if (negDim) {
        checks.push({
          id: `geo-negative-${path}-${i}`,
          name: 'negative dimension',
          nameAr: 'أبعاد سالبة غير صالحة',
          category: 'geometry',
          categoryAr: 'الهندسة والرياضيات',
          status: 'fail',
          message: `${path}:${i + 1} — a negative size is not renderable`,
          messageAr: `${path}:${i + 1} — لا يمكن رسم أبعاد أو حشوات سالبة`,
        });
      }

      const fracDim = line.match(/(?:radius|padding)\s*:\s*\d+\.\d+px/i);
      if (fracDim) {
        checks.push({
          id: `geo-frac-${path}-${i}`,
          name: 'fractional px',
          nameAr: 'قيم بكسل كسرية غير مفيدة',
          category: 'geometry',
          categoryAr: 'الهندسة والرياضيات',
          status: 'warn',
          message: `${path}:${i + 1} — fractional px bloats the file and never renders differently`,
          messageAr: `${path}:${i + 1} — استخدام بكسل كسري يُضخم الملف دون أثر بصري ملموس`,
        });
      }

      const om = line.match(RADIUS_RE);
      if (om) outer = parseFloat(om[1]);
      const im = line.match(INNER_RE);
      if (im) inner = parseFloat(im[1]);
      const pm = line.match(PAD_RE);
      if (pm) pad = parseFloat(pm[1]);
    });

    // Validate the nested-radius equation when all three are present.
    if (outer !== null && inner !== null && pad !== null) {
      const expected = outer - pad;
      // float tolerance — relative epsilon
      if (Math.abs(inner - expected) > 1e-9 * Math.max(1, Math.abs(expected))) {
        checks.push({
          id: `geo-radius-${path}`,
          name: 'nested radius rule broken',
          nameAr: 'كسر معادلة الحواف المتداخلة',
          category: 'geometry',
          categoryAr: 'الهندسة والرياضيات',
          status: 'fail',
          message: `${path} — inner radius ${inner}px must equal outer(${outer}) - padding(${pad}) = ${expected}px`,
          messageAr: `${path} — نصف القطر الداخلي (${inner}px) يجب أن يساوي الخارجي (${outer}) مطروحاً منه الحشو (${pad}) = ${expected}px`,
        });
      }
    }

    // An inner radius declared WITHOUT an outer is an orphan
    if (inner !== null && outer === null) {
      checks.push({
        id: `geo-orphan-${path}`,
        name: 'inner radius without outer',
        nameAr: 'نصف قطر داخلي بدون مرجع خارجي',
        category: 'geometry',
        categoryAr: 'الهندسة والرياضيات',
        status: 'warn',
        message: `${path} — inner-radius declared but no outer-radius to derive from`,
        messageAr: `${path} — تم تعريف inner-radius دون وجود outer-radius للاشتقاق منه`,
      });
    }
  }

  if (checks.length === 0 && contentsOf(patches).length > 0) {
    checks.push({
      id: 'geo-clean',
      name: 'geometry sound',
      nameAr: 'الهندسة والأبعاد سليمة',
      category: 'geometry',
      categoryAr: 'الهندسة والرياضيات',
      status: 'pass',
      message: 'nested-radius rule holds, no negative or fractional dimensions',
      messageAr: 'معادلة الحواف المتداخلة سليمة، وخالية من الأبعاد السالبة أو الكسرية',
    });
  }

  return checks;
}

export class GeometryValidator {
  /**
   * حساب نصف القطر الداخلي طبقاً للمعادلة:
   * Inner Radius = max(0, Outer Radius - Padding)
   */
  static calculateInnerRadius(outerRadius: number, padding: number): number {
    return Math.max(0, outerRadius - padding);
  }

  static validate(content: string, filePath: string = 'inline-code'): DoctorCheck {
    const patches: DevStudioPatch[] = [
      {
        op: 'modifyFile',
        path: filePath,
        content,
        inverse: { op: 'modifyFile', path: filePath, content },
      },
    ];
    const checks = checkGeometry(patches);
    return (
      checks.find((c) => c.status === 'fail') ||
      checks[0] || {
        id: `geo-check-${filePath}`,
        name: 'Geometry Compliance Audit',
        nameAr: 'تدقيق الأبعاد والتوافق الهندسي',
        category: 'geometry',
        categoryAr: 'الهندسة والرياضيات',
        status: 'pass',
        message: `File [${filePath}] complies with all geometric constraints.`,
        messageAr: `الملف [${filePath}] متوافق مع كافة القيود الهندسية والرياضية.`,
      }
    );
  }
}
