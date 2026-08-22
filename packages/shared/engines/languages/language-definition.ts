/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تعريف اللغة وقدراتها - Language Definition Interface
 * 🏛️ الدور: نوع مشترك - يُعرّف الهيكل الأساسي لكل لغة مدعومة
 * 📥 المستهلك: LanguagePack, LanguageRegistry, LanguageRuntime
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Interface-First Design: تعريف الواجهة أولاً قبل التنفيذ
 *    لضمان توافق جميع حزم اللغات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل لغة جديدة يجب أن تطبق هذه الواجهة بالكامل
 *    2. المزوّدين يجب أن تكون اختيارية (optional)
 *    3. extensions يجب أن تكون فريدة بين اللغات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام Required<> للخصائص الإلزامية
 *    - إضافة Default Values للميزات الاختيارية
 *    - فحص تكرار extensions
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/language-definition.ts

import type { LocalizedString } from '../../primitives/LocalizedString';

export type LanguageId =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'markdown'
  | 'svg'
  | 'glsl'
  | 'python'
  | 'c'
  | 'cpp'
  | 'rust'
  | 'lua'
  | 'ruby'
  | 'php'
  | 'perl'
  | 'go'
  | 'gimp'
  | 'json';

export interface LanguageCapabilities {
  completion: boolean;
  diagnostics: boolean;
  formatting: boolean;
  symbols: boolean;
  classes: boolean;
  preview: boolean;
  run: boolean;
  compile: boolean;
  transpile: boolean;
  design: boolean;
}

export interface LanguageDefinition {
  id: LanguageId;
  name: LocalizedString;
  extensions: string[];
  mimeTypes?: string[];
  capabilities: LanguageCapabilities;
}
