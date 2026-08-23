/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الأشكال التفاعلية وصناديق الشرح - Smart Shapes Engine
 * 🏛️ الدور: نواة (Core) - مكتبة مستقلة (Zero-Dependency) لحساب هندسة الأشكال
 * 📥 المستهلك: Canvas Designer, UI Designer, Rich Text, PDF Editor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Pure Geometry Engine: محرك هندسي بحت لحساب المسارات (SVG Paths)
 *    - Orthogonal Routing: مسارات متعامدة ذكية وتفادي التقاطعات
 *    - Bezier Splines: منحنيات مرنة لصناديق الشرح
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأداء العالي عند سحب المقابض
 *    2. ضمان دقة المسارات عند التكبير والتصغير
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SmartShapesEngine {
  /**
   * حساب مسار متعامد (Orthogonal) بين نقطتين مع تفادي العوائق (تبسيط مبدئي)
   */
  public static calculateOrthogonalPath(start: Point, end: Point, cornerRadius = 8): string {
    const midX = (start.x + end.x) / 2;

    // إذا كانت المسافة الأفقية كافية
    if (Math.abs(start.x - end.x) > cornerRadius * 2) {
      // مسار متدرج أفقياً
      return `M ${start.x},${start.y} 
              L ${midX - Math.sign(midX - start.x) * cornerRadius},${start.y} 
              Q ${midX},${start.y} ${midX},${start.y + Math.sign(end.y - start.y) * cornerRadius} 
              L ${midX},${end.y - Math.sign(end.y - start.y) * cornerRadius} 
              Q ${midX},${end.y} ${midX + Math.sign(end.x - midX) * cornerRadius},${end.y} 
              L ${end.x},${end.y}`;
    }

    // Fallback: خط مباشر إذا كان التقارب كبيراً
    return `M ${start.x},${start.y} L ${end.x},${end.y}`;
  }

  /**
   * حساب منحنى بيزييه مرن للموصلات وصناديق الشرح
   */
  public static calculateBezierPath(start: Point, end: Point, controlOffset = 0.5): string {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const cp1 = { x: start.x + dx * controlOffset, y: start.y };
    const cp2 = { x: end.x - dx * controlOffset, y: end.y };

    return `M ${start.x},${start.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${end.x},${end.y}`;
  }

  /**
   * إنشاء مسار نجمي مخصص (لشارات الشرح والأختام)
   */
  public static createStarburstPath(
    cx: number,
    cy: number,
    points: number,
    outerRadius: number,
    innerRadius: number,
  ): string {
    let path = '';
    const angleStep = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep - Math.PI / 2; // يبدأ من الأعلى
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      if (i === 0) {
        path += `M ${x},${y} `;
      } else {
        path += `L ${x},${y} `;
      }
    }
    return path + 'Z';
  }

  /**
   * إنشاء مسار فقاعة محادثة ذكية (Dynamic Anchored Speech Bubble)
   */
  public static createSpeechBubblePath(bounds: Bounds, tailTip: Point, tailWidth = 20): string {
    const { x, y, width, height } = bounds;
    const r = 12; // Corner radius

    // نبسط المسار إلى مستطيل مستدير الزوايا ومدمج مع ذيل نحو tailTip
    // سنستخدم مساراً متصلاً كاملاً
    // للتبسيط في هذا الإصدار، سنعتبر الذيل يخرج دائماً من المركز السفلي
    const bottomCenter = { x: x + width / 2, y: y + height };

    return `
      M ${x + r}, ${y}
      L ${x + width - r}, ${y}
      Q ${x + width}, ${y} ${x + width}, ${y + r}
      L ${x + width}, ${y + height - r}
      Q ${x + width}, ${y + height} ${x + width - r}, ${y + height}
      
      L ${bottomCenter.x + tailWidth / 2}, ${y + height}
      L ${tailTip.x}, ${tailTip.y}
      L ${bottomCenter.x - tailWidth / 2}, ${y + height}
      
      L ${x + r}, ${y + height}
      Q ${x}, ${y + height} ${x}, ${y + height - r}
      L ${x}, ${y + r}
      Q ${x}, ${y} ${x + r}, ${y}
      Z
    `;
  }
}
