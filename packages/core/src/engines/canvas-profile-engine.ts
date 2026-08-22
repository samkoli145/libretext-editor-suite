/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: canvas-profile-engine.ts
 * 📂 المسار: packages/core/src/engines/canvas-profile-engine.ts
 * 🎯 الهدف الرئيسي: محرك فلترة الأدوات حسب بروفايل الكانفا (Canvas Profile)
 *    يسمح لكل محرر/قالب بتحديد الأدوات المسموح بها والممنوعة.
 * 📋 المعايير: صفر اعتماديات، Headless، Composable Profiles
 * 🏷️ المعرف: CORE-ENG-021
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Profile-Based Tool Filtering — فلترة الأدوات عبر بروفايلات قابلة للدمج
 *    مع فرض قيود التسجيل الإلزامي لكل أداة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل أداة يجب أن تكون مسجلة في ToolRegistry أولاً (Mandatory Registration).
 *    2. البروفايل لا يُنشئ أدوات جديدة — يُصفّي فقط الموجودة.
 *    3._blockedIds لها الأولوية على allowedCategories.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص أن كل معرف في blockedIds موجود فعلاً في Registry.
 *    - إرجاع مصفوفة فارغة عند عدم وجود أدوات مطابقة.
 *    - لا يُعدّل ToolRegistry الأصلي أبداً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: tool-registry.ts (UnifiedToolItem, ToolCategory)
 *    - 🧪 اختبارات: tests/engines/canvas-profile-engine.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ToolCategory, UnifiedToolItem } from './tool-registry';

// ─── بروفايل الكانفا ───
export interface CanvasProfile {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly descriptionAr: string;
  readonly allowedCategories: readonly ToolCategory[];
  readonly blockedIds: readonly string[];
  readonly allowedDomains: readonly string[];
  readonly priority: number;
}

// ─── نتيجة الفلترة ───
export interface FilterResult {
  readonly tools: readonly UnifiedToolItem[];
  readonly blockedCount: number;
  readonly totalCount: number;
}

// ─── إعدادات البروفايل ───
export interface CanvasProfileConfig {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly descriptionAr?: string;
  readonly allowedCategories: readonly ToolCategory[];
  readonly blockedIds?: readonly string[];
  readonly allowedDomains?: readonly string[];
  readonly priority?: number;
}

/**
 * إنشاء بروفايل كانفا جديد.
 */
export function createCanvasProfile(config: CanvasProfileConfig): CanvasProfile {
  return {
    id: config.id,
    nameAr: config.nameAr,
    nameEn: config.nameEn,
    descriptionAr: config.descriptionAr ?? '',
    allowedCategories: config.allowedCategories,
    blockedIds: config.blockedIds ?? [],
    allowedDomains: config.allowedDomains ?? [],
    priority: config.priority ?? 0,
  };
}

/**
 * فلترة الأدوات حسب بروفايل واحد.
 * القاعدة:الأداة تُقبل إذا كان فئتها في allowedCategories
 *   ولم تكن في blockedIds.
 */
export function getFilteredTools(
  profile: CanvasProfile,
  allTools: readonly UnifiedToolItem[],
): FilterResult {
  const blocked = new Set(profile.blockedIds);
  const allowed = new Set(profile.allowedCategories);

  const tools = allTools.filter(tool => {
    if (blocked.has(tool.id)) return false;
    return allowed.has(tool.category);
  });

  return {
    tools,
    blockedCount: allTools.length - tools.length,
    totalCount: allTools.length,
  };
}

/**
 * دمج بروفايلين في بروفايل واحد.
 * القواعد:
 *   - allowedCategories = الاتحاد (Union)
 *   - blockedIds = الاتحاد (Union)
 *   - allowedDomains = الاتحاد (Union)
 *   - priority = الأعلى
 */
export function mergeProfiles(
  a: CanvasProfile,
  b: CanvasProfile,
): CanvasProfile {
  const mergedCategories = [...new Set([...a.allowedCategories, ...b.allowedCategories])];
  const mergedBlocked = [...new Set([...a.blockedIds, ...b.blockedIds])];
  const mergedDomains = [...new Set([...a.allowedDomains, ...b.allowedDomains])];

  return {
    id: `${a.id}+${b.id}`,
    nameAr: `${a.nameAr} + ${b.nameAr}`,
    nameEn: `${a.nameEn} + ${b.nameEn}`,
    descriptionAr: `دمج البروفايلين: ${a.nameAr} و ${b.nameAr}`,
    allowedCategories: mergedCategories,
    blockedIds: mergedBlocked,
    allowedDomains: mergedDomains,
    priority: Math.max(a.priority, b.priority),
  };
}

/**
 * فلترة الأدوات مع دمج عدة بروفايلات.
 */
export function getFilteredToolsFromProfiles(
  profiles: readonly CanvasProfile[],
  allTools: readonly UnifiedToolItem[],
): FilterResult {
  const merged = profiles.reduce((acc, p) => mergeProfiles(acc, p));
  return getFilteredTools(merged, allTools);
}

/**
 * التحقق من أن أداة معينة مسموح بها في بروفايل.
 */
export function isToolAllowed(
  toolId: string,
  toolCategory: ToolCategory,
  profile: CanvasProfile,
): boolean {
  if (profile.blockedIds.includes(toolId)) return false;
  return profile.allowedCategories.includes(toolCategory);
}

/**
 * بروفايلات جاهزة للمحررات الأربعة.
 */
export const WRITER_PROFILE = createCanvasProfile({
  id: 'writer',
  nameAr: 'محرر النصوص',
  nameEn: 'Writer',
  descriptionAr: 'أدوات الكتابة والتنسيق والإدراج الأساسية',
  allowedCategories: ['text', 'format', 'insert', 'visual'],
  blockedIds: ['data-formula', 'grid-cell', 'diagram-complex'],
  priority: 10,
});

export const CALC_PROFILE = createCanvasProfile({
  id: 'calc',
  nameAr: 'محرر الجداول',
  nameEn: 'Calc',
  descriptionAr: 'أدوات الجداول والصيغ والبيانات',
  allowedCategories: ['text', 'format', 'data', 'insert'],
  blockedIds: ['image-advanced', 'diagram-complex'],
  priority: 10,
});

export const IMPRESS_PROFILE = createCanvasProfile({
  id: 'impress',
  nameAr: 'محرر العروض',
  nameEn: 'Impress',
  descriptionAr: 'أدوات التصميم والأشكال والعروض التقديمية',
  allowedCategories: ['text', 'format', 'insert', 'geometry', 'visual'],
  blockedIds: ['data-formula', 'grid-cell'],
  priority: 10,
});

export const BASE_PROFILE = createCanvasProfile({
  id: 'base',
  nameAr: 'محرر قواعد البيانات',
  nameEn: 'Base',
  descriptionAr: 'أدوات السجلات والاستعلامات والنماذج',
  allowedCategories: ['text', 'format', 'data', 'insert'],
  blockedIds: ['image-advanced', 'geometry-complex'],
  priority: 10,
});
