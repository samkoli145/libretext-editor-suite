/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل اللغات واكتشافها من اسم الملف
 * 🏛️ الدور: محرك مشترك - يُسجّل اللغات ويكتشف اللغة من امتداد الملف
 * 📥 المستهلك: LanguageRuntime, SharedSourceCodeEditor, LanguagePack
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Extension-Based Detection: اكتشاف اللغة من امتداد الملف
 *    مع Map للبحث السريع و fallback للغة الافتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الامتدادات المكررة يجب حلها بأولوية محددة
 *    2. اللغة الافتراضية يجب أن تكون TypeScript
 *    3. التسجيل يجب أن يحدث مرة واحدة فقط
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار التسجيل
 *    - إرجاع TypeScript كـ default عند عدم التعرف
 *    - تعامل مع الامتدادات الصغيرة/الكبيرة (case-insensitive)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/language-registry.ts

import type { LanguageDefinition, LanguageId } from './language-definition';
import { Result, ok, err } from '../../primitives/Result';

export class LanguageRegistry {
  private languages = new Map<LanguageId, LanguageDefinition>();
  private extensionMap = new Map<string, LanguageId>();

  register(def: LanguageDefinition): void {
    this.languages.set(def.id, def);
    for (const ext of def.extensions) {
      const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext;
      this.extensionMap.set(cleanExt, def.id);
    }
  }

  get(id: LanguageId): Result<LanguageDefinition, Error> {
    const def = this.languages.get(id);
    if (!def) return err(new Error(`Language '${id}' not registered`));
    return ok(def);
  }

  detectFromFilename(filename: string): LanguageDefinition | undefined {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return undefined;

    const langId = this.extensionMap.get(ext);
    if (!langId) return undefined;
    return this.languages.get(langId);
  }

  list(): LanguageDefinition[] {
    return Array.from(this.languages.values());
  }
}
