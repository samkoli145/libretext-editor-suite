/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محركات محرر الكود - تلوين نحوي + إكمال تلقائي + فحص أخطاء
 * 🏛️ الدور: محرك مشترك - مجموعة محركات لبيئة تحرير الكود
 * 📥 المستهلك: SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Engine Composition: دمج 3 محركات (Highlight, Complete, Validate)
 *    في واجهة واحدة موحدة مع cache مشترك
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التلوين يجب أن يكون سريعاً جداً (< 16ms لـ 60fps)
 *    2. الإكمال يجب أن لا يُعيق الكتابة
 *    3. الفحص يجب أن يكون في background thread
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - debounce على التلوين والفحص
 *    - cache للنتائج المتكررة
 *    - تعامل مع الكود غير المكتمل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/codeEditorEngines.ts
// ============================================================
// محركات تكميل القيم وتنسيق الشفرات البرمجية للمحررات
// ============================================================

import { HTMLParserEngine } from '../../canvas/engine/HTMLParserEngine';
import { CSSParserEngine } from '../../canvas/engine/CSSParserEngine';
import { BlockMapperEngine } from '../../canvas/engine/BlockMapperEngine';
import { SyncEngine } from '../../canvas/engine/SyncEngine';
import { AttributeCompletionEngine, attributeCompletionEngine } from './AttributeCompletionEngine';
import { ValidationEngine, validationEngine } from './ValidationEngine';

export const htmlParser = HTMLParserEngine;
export const cssParser = CSSParserEngine;
export const blockMapper = BlockMapperEngine;
export const syncEngine = SyncEngine;
export const attributeCompletion = attributeCompletionEngine;

export {
  HTMLParserEngine,
  CSSParserEngine,
  BlockMapperEngine,
  SyncEngine,
  AttributeCompletionEngine,
  attributeCompletionEngine,
  ValidationEngine,
  validationEngine,
};

export interface CompletionOption {
  label: string;
  type: 'attribute' | 'value' | 'css-property' | 'tag';
  detail?: string;
  boost?: number;
}

export class ValueCompletionEngine {
  private cssValuePresets: Record<string, string[]> = {
    display: ['flex', 'block', 'inline-block', 'grid', 'none', 'inline-flex'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    justifyContent: ['center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['center', 'flex-start', 'flex-end', 'stretch', 'baseline'],
    textAlign: ['right', 'center', 'left', 'justify'],
    fontWeight: ['400', '500', '600', '700', '800', '900', 'bold', 'normal'],
    position: ['relative', 'absolute', 'fixed', 'sticky', 'static'],
    borderRadius: ['0', '4px', '8px', '12px', '16px', '24px', '9999px'],
    color: ['#2563eb', '#1d4ed8', '#10b981', '#ffffff', '#0f172a', '#64748b'],
    backgroundColor: ['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff', '#f0fdf4', '#fefce8'],
  };

  public getValueCompletions(property: string, query: string = ''): CompletionOption[] {
    const camelProp = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const values = this.cssValuePresets[camelProp] || [];

    return values
      .filter((val) => val.toLowerCase().includes(query.toLowerCase()))
      .map((val) => ({
        label: val,
        type: 'value',
        detail: `قيمة مقترحة لـ ${property}`,
      }));
  }
}

export const valueCompletionEngine = new ValueCompletionEngine();
