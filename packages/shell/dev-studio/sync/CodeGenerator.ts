/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [CodeGenerator.ts] مولد الكود المطابق للميثاق
 *
 * هذا الملف يجيب: "كيف نضمن أن كل ملف جديد يحمل الميثاق؟"
 *
 * المبدأ الحاكم:
 * الكود المولد يجب أن يكون مطابقاً للميثاق، لا استثناءات.
 * كل ملف يحمل:
 * - ترويسة بالعربية (ملخص توجيهي)
 * - الحقوق محفوظة 2026
 * - تنبيهات معمارية
 * - ترقيع الدوال (Error Handling)
 *
 * المبدأ الثاني (من rowcol.ts):
 * "EVERY FUNCTION HERE IS A PATCH FACTORY" — المولد لا يكتب
 * الملف مباشرة. ينتج محتوى + ترويسة، ويُمرر عبر
 * FileOperations.addFilePatch ليصبح patch قابلاً للتراجع.
 *
 * المبدأ الثالث (من test-dash-story.ts):
 * "a rig where every mutation still passes is a rig that proves
 * nothing" — المولد يرفض الترويسة الناقصة. ملف بلا حقوق
 * يُرفض، لا يُقبل.
 *
 * التنبيهات:
 * - الثيم الفاتح النقي 100% (لا ألوان داكنة في الـ CSS المولد)
 * - صفر مكتبات خارجية (لا import من node_modules غير المعتمدة)
 * - دعم الفأرة والزر الأيمن في الـ UI المولد
 * - الرفض بصوت عالٍ عند ترويسة ناقصة
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import type { ProjectSurface } from '../core/DevStudioEngine';
import type { DevStudioPatch, FileHeader } from '../core/DevStudioTypes';
import { COPYRIGHT_YEAR } from '../core/DevStudioTypes';
import { addFilePatch } from '../tree/FileOperations';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع — ما نحتاجه لتوليد ملف
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * وصف ملف لتوليده.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * ملف بلا warnings ليس له `warnings: []`، بل لا حقل أصلاً.
 */
export interface FileSpec {
  /** المسار الكامل */
  path: string
  /** اسم الملف بدون امتداد */
  name: string
  /** الملخص التوجيهي بالعربية */
  summaryAr: string
  /** جسم الكود */
  body: string
  /** التنبيهات المعمارية (additive) */
  warnings?: string[]
  /** توجيهات الخوارزميات (additive) */
  algorithmNotes?: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الترويسة — ما يجب أن يحمله كل ملف
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد الترويسة الإلزامية.
 *
 * ⚠️ الترويسة ليست تجميلية. هي عقد:
 * - الملخص التوجيهي يشرح ماذا يفعل الملف ولماذا
 * - الحقوق محفوظة تثبت الملكية
 * - التنبيهات تحذر القارئ التالي من الفخاخ
 *
 * الرفض بصوت عالٍ: ملخص فارغ = رفض. نفس مبدأ rowcol.ts:
 * "refusing loudly is the point."
 */
export function renderHeader(spec: FileSpec): string {
  if (!spec.summaryAr || !spec.summaryAr.trim()) {
    throw new Error(
      `[CodeGenerator] file "${spec.path}" has no Arabic summary — ` +
      `a file without a guiding summary violates the covenant`,
    );
  }
  if (!spec.name || !spec.name.trim()) {
    throw new Error(`[CodeGenerator] file "${spec.path}" has no name`);
  }
  if (!spec.body || !spec.body.trim()) {
    throw new Error(`[CodeGenerator] file "${spec.path}" has empty body`);
  }

  const lines: string[] = [
    '// SPDX-License-Identifier: MIT',
    '// Copyright (c) 2026 The Bento authors',
    '// ═══════════════════════════════════════════════════════════════',
    '// 📌 ملخص توجيهي | Guiding Summary',
    '// ═══════════════════════════════════════════════════════════════',
    `// [${spec.name}] ${spec.summaryAr}`,
  ];

  // التنبيهات المعمارية (additive: الغياب يعني "لا")
  if (spec.warnings && spec.warnings.length > 0) {
    lines.push('//');
    lines.push('// التنبيهات المعمارية:');
    for (const w of spec.warnings) {
      lines.push(`// - ${w}`);
    }
  }

  // توجيهات الخوارزميات (additive)
  if (spec.algorithmNotes && spec.algorithmNotes.trim()) {
    lines.push('//');
    lines.push('// توجيهات الخوارزميات:');
    for (const note of spec.algorithmNotes.split('\n')) {
      lines.push(`// ${note}`);
    }
  }

  lines.push('// ═══════════════════════════════════════════════════════════════');
  lines.push(`// ©️ جميع الحقوق محفوظة ©️ - ${COPYRIGHT_YEAR}`);
  lines.push('// (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)');
  lines.push('// ═══════════════════════════════════════════════════════════════');
  lines.push('');

  return lines.join('\n');
}

/**
 * التحقق من أن ترويسة ملف موجودة وصالحة.
 *
 * ⚠️ هذا الفحص هو ما يستخدمه DoctorEngine للتحقق
 * من أن كل ملف يحمل الميثاق. نفس مبدأ StructureValidator.
 */
export function validateHeaderContent(content: string): { valid: boolean; reason?: string } {
  if (!content.includes('ملخص توجيهي')) {
    return { valid: false, reason: 'missing Arabic guiding summary (ملخص توجيهي)' };
  }
  if (!content.includes('الحقوق محفوظة') && !content.includes('Copyright')) {
    return { valid: false, reason: 'missing copyright line' };
  }
  if (!/20\d{2}/.test(content)) {
    return { valid: false, reason: 'missing valid copyright year' };
  }
  return { valid: true };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التوليد — إنتاج ملف كامل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد محتوى ملف كامل: ترويسة + جسم.
 *
 * ⚠️ هذه دالة نقية: نفس المدخلات تعطي نفس المخرجات دائماً.
 * لا تعديل، لا حالة، لا آثار جانبية.
 */
export function generateFileContent(spec: FileSpec): string {
  const header = renderHeader(spec);
  return header + spec.body + '\n';
}

/**
 * توليد patch لإضافة ملف جديد.
 *
 * ⚠️ مصنع تصحيحات، لا محرر. يعيد patch يمر عبر خط الأنابيب.
 * الرفض بصوت عالٍ إذا كان الملف موجوداً مسبقاً.
 */
export function generateFilePatch(
  project: ProjectSurface,
  spec: FileSpec,
): DevStudioPatch {
  const content = generateFileContent(spec);
  const header: FileHeader = {
    summaryAr: spec.summaryAr,
    copyrightYear: COPYRIGHT_YEAR,
    ...(spec.warnings && spec.warnings.length ? { warnings: spec.warnings } : {}),
    ...(spec.algorithmNotes ? { algorithmNotes: spec.algorithmNotes } : {}),
  };
  return addFilePatch(project, spec.path, content, header);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// القوالب — توليد ملفات شائعة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد مكون React/TSX بسيط مع دعم الثيم الفاتح والزر الأيمن.
 *
 * ⚠️ القالب يطبق الميثاق تلقائياً:
 * - الثيم الفاتح النقي (var(--surface), لا ألوان داكنة)
 * - دعم الزر الأيمن (onContextMenu)
 * - direction: ltr (المستند لا ينعكس)
 */
export function componentTemplate(name: string, summaryAr: string): FileSpec {
  if (!isValidComponentName(name)) {
    throw new Error(
      `[CodeGenerator] invalid component name "${name}" — ` +
      `must start with uppercase letter and contain only letters/digits`,
    );
  }

  const body = `import React from 'react';

/**
 * ${name} — ${summaryAr}
 *
 * ⚠️ الثيم الفاتح النقي 100%: لا ألوان داكنة، لا theme-dark.
 * ⚠️ دعم الزر الأيمن إلزامي (الميثاق).
 * ⚠️ direction: ltr لأن المستند لا ينعكس أبداً.
 */
export interface ${name}Props {
  /** additive: موجودة فقط إن كانت مفيدة */
  onAction?: () => void;
}

export const ${name}: React.FC<${name}Props> = ({ onAction }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // قائمة الزر الأيمن الموحدة (الميثاق)
    if (onAction) onAction();
  };

  return (
    <div
      className="${kebabCase(name)}"
      style={{
        // الثيم الفاتح النقي: متغيرات CSS، لا ألوان صلبة داكنة
        background: 'var(--surface, #ffffff)',
        color: 'var(--ink, #1a1a1a)',
        direction: 'ltr',
      }}
      onContextMenu={handleContextMenu}
    >
      {/* محتوى المكون */}
    </div>
  );
};
`;

  return {
    path: `src/shared/components/${name}.tsx`,
    name,
    summaryAr,
    body,
    warnings: [
      'الثيم الفاتح النقي 100%: لا ألوان داكنة',
      'دعم الزر الأيمن إلزامي (الميثاق)',
      'direction: ltr لأن المستند لا ينعكس',
    ],
  };
}

/**
 * توليد محرك (Engine) بسيط بنمط Patch Factory.
 */
export function engineTemplate(name: string, summaryAr: string): FileSpec {
  if (!isValidComponentName(name)) {
    throw new Error(`[CodeGenerator] invalid engine name "${name}"`);
  }

  const body = `/**
 * ${name} — ${summaryAr}
 *
 * ⚠️ كل دالة هنا مصنع تصحيحات (Patch Factory)، لا محرر.
 * تقرأ الحالة وتعيد ما يجب أن يلتزم به المخزن — لا تكتب مباشرة.
 * نفس مبدأ rowcol.ts: "EVERY FUNCTION HERE IS A PATCH FACTORY."
 */

export interface ${name}Input {
  // المدخلات
}

export interface ${name}Output {
  // المخرجات
}

/**
 * الدالة الرئيسية.
 *
 * ⚠️ الرفض بصوت عالٍ: مدخل فاسد يرمي، لا يُقص ليصبح صالحاً.
 * نفس مبدأ rowcol.ts: "BOUNDS CLAMP, IDENTITY REFUSES."
 */
export function run${name}(input: ${name}Input): ${name}Output {
  if (!input) {
    throw new Error('[${name}] input is required');
  }
  // التنفيذ هنا
  return {} as ${name}Output;
}

/** معرَّضة للاختبارات، كما تفعل rowcol.ts. */
export const _internals = { run${name} };
`;

  return {
    path: `src/shared/lib-core/${name}.ts`,
    name,
    summaryAr,
    body,
    warnings: [
      'كل دالة مصنع تصحيحات، لا محرر',
      'الرفض بصوت عالٍ عند مدخل فاسد',
      'لا تعديل مباشر للحالة',
    ],
    algorithmNotes: 'الترتيب هو مشكلة الصحة، ليس التقييم.\nنفس مبدأ cellformula.ts.',
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// دوال مساعدة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** هل اسم المكون صالح؟ يبدأ بحرف كبير، أحرف وأرقام فقط. */
function isValidComponentName(name: string): boolean {
  return typeof name === 'string' && /^[A-Z][A-Za-z0-9]*$/.test(name);
}

/** تحويل PascalCase إلى kebab-case. */
function kebabCase(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/** معرَّضة للاختبارات، كما تفعل rowcol.ts. */
export const _codeGenInternals = {
  renderHeader,
  validateHeaderContent,
  isValidComponentName,
  kebabCase,
};

