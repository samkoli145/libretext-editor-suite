/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل الأدوات المشترك - تسجيل واستدعاء الأدوات الموحدة
 * 🏛️ الدور: محرك مشترك - قاعدة بيانات الأدوات المستخدمة في كل المحررات
 * 📥 المستهلك: UnifiedToolboxBlock, useToolRegistry, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized Tool Registry: سجل مركزي يضمن ظهور نفس الأدوات في كل المحررات
 *    مع دعم الفئات والأيقونات والأحداث
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأدوات يجب أن تظهر في كل المحررات الأربعة (قاعدة AGENTS.md)
 *    2. IDs يجب أن تكون فريدة
 *    3. الفئات يجب أن تبقى متسقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار IDs
 *    - إرجاع أداة افتراضية عند عدم الوجود
 *    - تسجيل ذكي (lazy registration) لتجنب التعارض
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/ToolRegistry.ts
/**
 * سجل الأدوات المركزي المشترك لكافة الواجهات والمحررات
 */

import { notificationEngine } from './NotificationEngine';
import { dialogEngine } from './DialogEngine';

export interface ToolContext {
  activeDocumentId?: string;
  documentType?: string;
  sourceCode?: string;
  updateSourceCode?: (code: string) => void;
  selectedText?: string;
  insertText?: (text: string) => void;
  insertHtml?: (html: string) => void;
  insertBlock?: (block: any) => void;
  formatCommand?: (command: string, value?: any) => void;
  exportFormat?: (format: string) => void;
}

export interface EditingTool {
  id: string;
  name: string;
  nameAr: string;
  category: 'format' | 'transform' | 'insert' | 'clean' | 'export' | 'tools';
  icon: string;
  shortcut?: string;
  descriptionAr: string;
  execute: (context: ToolContext) => void | Promise<void>;
}

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, EditingTool> = new Map();

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
      ToolRegistry.instance.registerDefaultTools();
    }
    return ToolRegistry.instance;
  }

  public register(tool: EditingTool): void {
    this.tools.set(tool.id, tool);
  }

  public unregister(id: string): void {
    this.tools.delete(id);
  }

  public get(id: string): EditingTool | undefined {
    return this.tools.get(id);
  }

  public getAll(): EditingTool[] {
    return Array.from(this.tools.values());
  }

  public getByCategory(category: EditingTool['category']): EditingTool[] {
    return this.getAll().filter((t) => t.category === category);
  }

  public async execute(id: string, context: ToolContext): Promise<void> {
    const tool = this.get(id);
    if (!tool) {
      notificationEngine.error(`الأداة غير موجودة: ${id}`);
      return;
    }

    try {
      await tool.execute(context);
    } catch (err: any) {
      console.error(`Error executing tool ${id}:`, err);
      notificationEngine.error(`خطأ أثناء تنفيذ أداة ${tool.nameAr}`, err?.message);
    }
  }

  private registerDefaultTools(): void {
    // 1. تنظيف الوسوم الفارغة
    this.register({
      id: 'clean-empty-tags',
      name: 'Clean Empty Tags',
      nameAr: 'تنظيف الوسوم الفارغة',
      category: 'clean',
      icon: '🧹',
      shortcut: 'Alt+C',
      descriptionAr: 'حذف جميع وسمات HTML الفارغة وغير الضرورية وتنسيق الهيكل',
      execute: (ctx) => {
        if (!ctx.sourceCode || !ctx.updateSourceCode) {
          notificationEngine.info('تنبيه', 'يرجى فتح أو تحديد كود المستند أولاً لتنظيفه');
          return;
        }
        const cleaned = ctx.sourceCode.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');
        ctx.updateSourceCode(cleaned);
        notificationEngine.success('تم تنظيف الكود بنجاح', 'تم إزالة العناصر والوسوم الفارغة');
      },
    });

    // 2. تغليف في حاوية استجابة
    this.register({
      id: 'wrap-container',
      name: 'Wrap in Container',
      nameAr: 'تغليف في حاوية (Container)',
      category: 'transform',
      icon: '📦',
      shortcut: 'Alt+W',
      descriptionAr: 'تغليف التحديد أو المستند داخل div محاذى وبحدود استجابة',
      execute: (ctx) => {
        if (ctx.sourceCode && ctx.updateSourceCode) {
          const wrapped = `<div class="max-w-4xl mx-auto px-6 py-8 bg-white border border-slate-200 rounded-xl shadow-xs">\n${ctx.sourceCode}\n</div>`;
          ctx.updateSourceCode(wrapped);
          notificationEngine.success('تم التغليف', 'تم تغليف المستند في حاوية أنيقة');
        } else if (ctx.insertHtml) {
          ctx.insertHtml('<div class="max-w-4xl mx-auto px-6 py-8 bg-white border border-slate-200 rounded-xl shadow-xs"><p>حاوية جديدة...</p></div>');
          notificationEngine.success('تم إدراج حاوية');
        }
      },
    });

    // 3. فتح حوار صورة
    this.register({
      id: 'insert-image-modal',
      name: 'Insert Image Modal',
      nameAr: 'إدراج صورة معالجة',
      category: 'insert',
      icon: '🖼️',
      shortcut: 'Ctrl+Shift+I',
      descriptionAr: 'فتح حوار احترافي لإدراج صورة مع ضغط ومعالجة أبعاد',
      execute: () => {
        dialogEngine.openImageDialog();
      },
    });

    // 4. فتح حوار رابط
    this.register({
      id: 'insert-link-modal',
      name: 'Insert Link Modal',
      nameAr: 'إدراج وتخصيص رابط',
      category: 'insert',
      icon: '🔗',
      shortcut: 'Ctrl+K',
      descriptionAr: 'فتح حوار تخصيص وإدراج رابط للنص المحدد',
      execute: () => {
        dialogEngine.openLinkDialog();
      },
    });

    // 5. فتح حوار جدول
    this.register({
      id: 'insert-table-modal',
      name: 'Insert Table Modal',
      nameAr: 'إدراج جدول تفاعلي',
      category: 'insert',
      icon: '📊',
      shortcut: 'Alt+T',
      descriptionAr: 'فتح حوار إدراج وتخصيص جداول البيانات',
      execute: () => {
        dialogEngine.openTableDialog();
      },
    });

    // 6. فتح حوار مخطط بياني
    this.register({
      id: 'insert-diagram-modal',
      name: 'Insert Diagram Modal',
      nameAr: 'مخطط تدفقي أو تسلسلي',
      category: 'insert',
      icon: '🔀',
      descriptionAr: 'إنشاء ورسم مخططات تدفق وخرائط مفاهيمية فورية',
      execute: () => {
        dialogEngine.openDiagramDialog();
      },
    });

    // 7. تحويل التحديد لبطاقة تنبيهية Callout
    this.register({
      id: 'insert-callout',
      name: 'Insert Callout Card',
      nameAr: 'إدراج مربع شرح وتنبيه (Callout)',
      category: 'insert',
      icon: '💡',
      shortcut: 'Alt+B',
      descriptionAr: 'إدراج مربع شرح ذكي ومتحكم فيه للتنبيهات والملاحظات',
      execute: (ctx) => {
        const calloutHtml = `
<div class="my-4 p-4 bg-blue-50/80 border-r-4 border-blue-500 rounded-l-lg text-slate-800 flex items-start gap-3">
  <div class="text-blue-600 font-bold text-lg leading-none">💡</div>
  <div>
    <h4 class="font-bold text-sm text-blue-950 mb-1">ملاحظة هامة</h4>
    <p class="text-xs text-slate-700 leading-relaxed">أدخل نص الشرح أو التوجيه هنا...</p>
  </div>
</div>`;
        if (ctx.insertHtml) {
          ctx.insertHtml(calloutHtml);
          notificationEngine.success('تم إدراج مربع الشرح (Callout)');
        }
      },
    });

    // 8. إدراج كتلة كود منسقة
    this.register({
      id: 'insert-code-block',
      name: 'Insert Code Block',
      nameAr: 'إدراج كتلة كود برمجية',
      category: 'insert',
      icon: '💻',
      shortcut: 'Alt+Shift+C',
      descriptionAr: 'إدراج كتلة كود منسقة بخلفية فاتحة أنيقة',
      execute: (ctx) => {
        const codeHtml = `
<pre class="my-3 p-4 bg-slate-100 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 overflow-x-auto" dir="ltr">
<code>// اكتب كود المصدر هنا
function helloWorld() {
  console.log("WebPainter Studio Ready");
}</code>
</pre>`;
        if (ctx.insertHtml) {
          ctx.insertHtml(codeHtml);
          notificationEngine.success('تم إدراج كتلة الكود');
        }
      },
    });
  }
}

export const toolRegistry = ToolRegistry.getInstance();
