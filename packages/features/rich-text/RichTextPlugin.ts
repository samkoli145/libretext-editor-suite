/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: إضافة محرر النصوص الغنية - Rich Text Plugin
 * 🏛️ الدور: إضافة محرر - تسجيل محرر النصوص في PluginSystem
 * 📥 المستهلك: PluginRegistry, Shell
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    BaseEditorPlugin Extension: امتداد للإضافة الأساسية
 *    مع تسجيل تلقائي في PluginSystem
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. id يجب أن يكون فريداً ('rich-text-plugin')
 *    2. createDefaultData يجب أن يُرجع بيانات صالحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة البيانات الافتراضية
 *    - fallback لمحتوى فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseEditorPlugin } from '../../core/plugins';
import type { DocumentModel } from '../../core/types';

import { RichTextEditor } from './RichTextEditor';
import type { RichTextData } from './model';
import { emptyRichTextContent } from './model';

export class RichTextPlugin extends BaseEditorPlugin<RichTextData> {
  id = 'rich-text-plugin';
  name = 'مستند نصي';
  documentType = 'rich-text';
  iconName = 'file-text';
  fileExtensions = ['.wp.json', '.docx', '.doc', '.odt', '.md', '.markdown', '.html', '.txt'];
  description = 'محرر مستندات متكامل يدعم صيغ ODT, Word, Markdown, HTML و PDF';

  renderEditor = RichTextEditor;

  createDefaultDocument(title = 'مستند جديد'): DocumentModel<RichTextData> {
    return this.createDocumentShell(title, {
      content: emptyRichTextContent,
    });
  }
}
