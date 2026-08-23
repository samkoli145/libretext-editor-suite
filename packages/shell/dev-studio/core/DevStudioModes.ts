/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: DevStudioModes.ts
 * 📂 المسار: packages/shell/dev-studio/core/DevStudioModes.ts
 * 🎯 الهدف: نظام الأوضاع السبعة — كل وضع يحدد صلاحيات القراءة/الكتابة
 * 🏷️ المعرف: PLUG-MODES
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type DevStudioMode =
  | 'planning' | 'execution' | 'force' | 'comparison'
  | 'debug' | 'review' | 'refactor';

export interface ModeConfig {
  readonly mode: DevStudioMode;
  readonly label: string;
  readonly risk: 'safe' | 'caution' | 'danger';
  readonly canWrite: boolean;
  readonly canExecuteShell: boolean;
  readonly description: string;
}

const MODE_CONFIGS: Record<DevStudioMode, ModeConfig> = {
  planning:    { mode: 'planning',    label: 'تخطيط',       risk: 'safe',   canWrite: false, canExecuteShell: false, description: 'استكشاف وتحليل — قراءة فقط' },
  execution:   { mode: 'execution',   label: 'تنفيذ',       risk: 'caution', canWrite: true,  canExecuteShell: true,  description: 'تنفيذ التعديلات مع تأكيد' },
  force:       { mode: 'force',       label: 'إجبار',       risk: 'danger', canWrite: true,  canExecuteShell: true,  description: 'أوامر نظام حرجة — تأكيد مطلوب' },
  comparison:  { mode: 'comparison',  label: 'مقارنة',      risk: 'safe',   canWrite: false, canExecuteShell: false, description: 'مقارنة الإصدارات والحلول' },
  debug:       { mode: 'debug',       label: 'تصحيح',       risk: 'safe',   canWrite: true,  canExecuteShell: true,  description: 'عزل الأخطاء وتجربة الإصلاحات' },
  review:      { mode: 'review',      label: 'مراجعة',      risk: 'safe',   canWrite: false, canExecuteShell: false, description: 'التحقق من المعايير والمواصفات' },
  refactor:    { mode: 'refactor',    label: 'إعادة هيكلة', risk: 'caution', canWrite: true,  canExecuteShell: true,  description: 'تحسين بدون تغيير الوظيفة' },
};

let currentMode: DevStudioMode = 'planning';

export function getCurrentMode(): DevStudioMode {
  return currentMode;
}

export function setMode(mode: DevStudioMode): void {
  currentMode = mode;
}

export function getModeConfig(mode: DevStudioMode): ModeConfig {
  return { ...MODE_CONFIGS[mode] };
}

export function getAllModes(): readonly ModeConfig[] {
  return Object.values(MODE_CONFIGS);
}
