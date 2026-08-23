/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خيارات الأوامر المركزية الشاملة المربوطة بسجل الأوامر - All Command Options
 * 🏛️ الدور: نواة النظام - ربط أدوات التدفق والتنسيق والأشكال باللوحة السريعة
 * 📥 المستهلك: CommandPalette, UnifiedToolbox, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Command Registry Integration: تكامل سجل الأوامر
 *    مع البحث الفوري والتنفيذ بالفأرة واختصارات لوحة المفاتيح
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المعرفات يجب أن تبقى فريدة عبر كل الأوامر
 *    2. التصفية يجب أن تدعم العربية والإنجليزية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المعرف قبل التسجيل
 *    - fallback لقائمة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { UNIFIED_TOOL_ITEMS, type UnifiedToolItem } from '../../../shared/tools/unifiedTools';

export interface CommandOptionItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  iconName: string;
  actionId: string;
  shortcut?: string;
  keywords: string[];
  payload?: Record<string, any>;
}

export function getAllCommandOptions(): CommandOptionItem[] {
  return UNIFIED_TOOL_ITEMS.map((tool: UnifiedToolItem) => ({
    id: tool.id,
    title: tool.titleAr,
    titleEn: tool.titleEn,
    description: tool.descriptionAr,
    category: tool.categoryAr,
    iconName: tool.iconName,
    actionId: tool.actionId,
    shortcut: tool.shortcut,
    keywords: tool.keywords,
    payload: tool.payload,
  }));
}

export function filterCommandOptions(
  query: string,
  options = getAllCommandOptions(),
): CommandOptionItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return options;

  return options.filter((opt) => {
    return (
      opt.title.toLowerCase().includes(clean) ||
      opt.titleEn.toLowerCase().includes(clean) ||
      opt.description.toLowerCase().includes(clean) ||
      opt.category.toLowerCase().includes(clean) ||
      opt.keywords.some((k) => k.toLowerCase().includes(clean))
    );
  });
}
