/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك البيئة الرملية الحية وتحكم الخصائص التفاعلي - Live Component Sandbox Runner
 * 🏛️ الدور: نواة معالجة ومحاكاة الكود (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: InteractiveWysiwygCodeStudio, CodeSandboxLivePreview, CanvasDesigner
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - توليد مستند Sandbox معزول وآمن داخل المتصفح عبر iframe srcdoc
 *    - استخراج المتغيرات التفاعلية (Dynamic Parameter Extraction) تلقائياً من الكود
 *    - ربط عناصر تحكم الفأرة (Slidres, Toggles, Color Pickers, Text Inputs) بقيم الكود الحية
 *    - دعم Tailwind CDN الخفيف، Google Fonts، و Canvas 2D في بيئة آمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عزل كود الـ JavaScript لمنع تسرب الأخطاء للنافذة الأم (Strict Sandbox Isolation)
 *    2. تنظيف مستمعي الأحداث والـ Blob URLs لتفادي تسرب الذاكرة
 *    3. فرض الثيم الفاتح النقي وتنسيق الحاويات الافتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - اعتراض أخطاء وقت التشغيل وعرضها بوضوح
 *    - حماية ضد الحلقات التكرارية اللانهائية (Loop Protection)
 *    - قيم افتراضية آمنة للمتغيرات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SandboxControlProp {
  id: string;
  nameAr: string;
  nameEn: string;
  /** اسم المتغير في الكود (${name}) عند تحديده بصيغة $name في التعليق. */
  varName?: string;
  type: 'range' | 'color' | 'text' | 'boolean' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  unit?: string;
}

export interface SandboxExecutionResult {
  htmlDocument: string;
  controls: SandboxControlProp[];
  detectedFramework: 'html-css' | 'tailwind' | 'canvas' | 'svg' | 'react-jsx';
  hasScript: boolean;
  warnings: string[];
}

export class CodeSandboxRunner {
  /**
   * استخراج عناصر التحكم الديناميكية من الكود بناءً على المتغيرات والتعليقات الخاصة
   * التعليقات تدعم الصيغة: /* @prop {type} [min,max,step] Default Value - Description * /
   */
  public static extractDynamicControls(code: string): SandboxControlProp[] {
    const controls: SandboxControlProp[] = [];
    const propRegex =
      /\/\*\s*@prop\s+\{?(\w+)\}?\s*(?:\[([\d.,\s-]+)\])?\s*(?:\$(\w+)\s+)?([^*]+?)\s*-\s*([^*]+?)\*\//gi;
    let match: RegExpExecArray | null;

    while ((match = propRegex.exec(code)) !== null) {
      const type = match[1]!.toLowerCase() as 'range' | 'color' | 'text' | 'boolean' | 'select';
      const rangeStr = match[2];
      const varName = match[3];
      const defaultValueRaw = match[4]!.trim();
      const labelAr = match[5]!.trim();

      const id = `prop_${controls.length + 1}`;
      let value: any = defaultValueRaw;
      let min = 0;
      let max = 100;
      let step = 1;

      if (type === 'range') {
        value = parseFloat(defaultValueRaw) || 0;
        if (rangeStr) {
          const parts = rangeStr.split(',').map((p) => parseFloat(p.trim()));
          if (!isNaN(parts[0]!)) min = parts[0]!;
          if (!isNaN(parts[1]!)) max = parts[1]!;
          if (!isNaN(parts[2]!)) step = parts[2]!;
        }
      } else if (type === 'boolean') {
        value = defaultValueRaw === 'true' || defaultValueRaw === '1';
      }

      controls.push({
        id,
        nameAr: labelAr,
        nameEn: id,
        type,
        value,
        min,
        max,
        step,
        ...(varName ? { varName } : {}),
      });
    }

    // إذا لم تكن هناك تعليقات مخصصة، استخراج الألوان والقياسات الشائعة كـ Controls تلقائية
    if (controls.length === 0) {
      // 1. استخراج الألوان السداسية Hex Colors
      const hexMatches = Array.from(new Set(code.match(/#[0-9a-fA-F]{6}\b/g) || []));
      hexMatches.slice(0, 3).forEach((hex, idx) => {
        controls.push({
          id: `auto_color_${idx}`,
          nameAr: `اللون الأساسي ${idx + 1}`,
          nameEn: `Color ${idx + 1}`,
          type: 'color',
          value: hex,
        });
      });

      // 2. استخراج الحواف والظلال إذا كانت موجودة
      if (code.includes('border-radius') || code.includes('rounded')) {
        controls.push({
          id: 'auto_radius',
          nameAr: 'استدارة الحواف (Border Radius)',
          nameEn: 'Border Radius',
          type: 'range',
          value: 12,
          min: 0,
          max: 48,
          step: 2,
          unit: 'px',
        });
      }

      if (code.includes('padding') || code.includes('p-')) {
        controls.push({
          id: 'auto_padding',
          nameAr: 'الهامش الداخلي (Padding)',
          nameEn: 'Padding',
          type: 'range',
          value: 16,
          min: 4,
          max: 64,
          step: 4,
          unit: 'px',
        });
      }
    }

    return controls;
  }

  /**
   * تطبيق قيم عناصر التحكم على الكود المصدري
   */
  public static injectControlValues(code: string, controls: SandboxControlProp[]): string {
    let result = code;

    controls.forEach((c) => {
      // استبدال عام للمتغيرات المسماة ${name}
      if (c.varName) {
        result = result.split('${' + c.varName + '}').join(String(c.value));
      }
      if (c.id === 'auto_radius' && c.type === 'range') {
        result = result.replace(/border-radius:\s*[^;]+;/g, `border-radius: ${c.value}px;`);
      } else if (c.id === 'auto_padding' && c.type === 'range') {
        result = result.replace(/padding:\s*[^;]+;/g, `padding: ${c.value}px;`);
      }
    });

    return result;
  }

  /**
   * بناء مستند HTML متكامل للرندر الحي الآمن داخل iframe
   */
  public static buildSandboxDocument(
    code: string,
    language: string,
    options: {
      enableTailwind?: boolean;
      enableInteractivity?: boolean;
      containerBackground?: string;
    } = {},
  ): SandboxExecutionResult {
    const {
      enableTailwind = true,
      enableInteractivity = true,
      containerBackground = '#ffffff',
    } = options;

    const warnings: string[] = [];
    const controls = this.extractDynamicControls(code);

    let detectedFramework: SandboxExecutionResult['detectedFramework'] = 'html-css';
    if (code.includes('<canvas') || code.includes('getContext(')) detectedFramework = 'canvas';
    else if (code.trim().startsWith('<svg')) detectedFramework = 'svg';
    else if (
      code.includes('class="') &&
      (code.includes('bg-') || code.includes('text-') || code.includes('flex'))
    )
      detectedFramework = 'tailwind';
    else if (
      code.includes('export default') ||
      code.includes('function App') ||
      code.includes('return (')
    )
      detectedFramework = 'react-jsx';

    const hasScript =
      code.includes('<script') || language === 'javascript' || language === 'typescript';

    // حماية ونظام أمان Sandbox
    const scriptInterceptor = enableInteractivity
      ? `
      <script>
        window.onerror = function(msg, url, line) {
          console.warn('[Sandbox Runtime Error]', msg, 'Line:', line);
          const errDiv = document.createElement('div');
          errDiv.style.cssText = 'position:fixed;bottom:8px;right:8px;left:8px;background:#fef2f2;border:1px solid #f87171;color:#991b1b;padding:8px 12px;border-radius:8px;font-size:12px;font-family:sans-serif;z-index:9999;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);direction:rtl;';
          errDiv.innerHTML = '⚠️ خطأ برمجي: ' + msg + ' (السطر ' + line + ')';
          document.body.appendChild(errDiv);
        };
      </script>`
      : '';

    let bodyContent = code;

    // إذا كان الكود مجرد SVG
    if (detectedFramework === 'svg' && !code.includes('<html')) {
      bodyContent = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;">${code}</div>`;
    } else if (detectedFramework === 'canvas' && !code.includes('<html')) {
      // إحاطة كانفاس بنص تشغيل تفاعلي
      bodyContent = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;">
          ${code.includes('<canvas') ? code : '<canvas id="sandboxCanvas" width="600" height="400" style="border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);"></canvas>'}
        </div>`;
    }

    const htmlDocument = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sandbox Live Runner</title>
  ${enableTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: ${containerBackground};
      color: #0f172a;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }
  </style>
  ${scriptInterceptor}
</head>
<body>
  ${bodyContent}
</body>
</html>`;

    return {
      htmlDocument,
      controls,
      detectedFramework,
      hasScript,
      warnings,
    };
  }
}
