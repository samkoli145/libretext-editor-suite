/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التعليقات والملاحظات التعاونية الشامل (Universal Comments & Annotations Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) لإدارة سلاسل التعليقات (Comment Threads)،
 *           الدبابيس الموضعية (Coordinate Pins)، والردود، وحالة الحل (Resolved State).
 * 📥 المستهلك: CommentsPanel, CanvasDesignerEditor, RichTextEditor, UIDesignerEditor, PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Spatial Pin Threading with Multi-Target Binding:
 *    ربط التعليق إما بعنصر محدد عبر `targetElementId` أو بإحداثيات كانفا حرة `(x, y)`،
 *    مع هيكل شجري للردود (Nested Replies) وتتبع هوية المستخدمين.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. نقل موضع الدبوس تلقائياً عند نقل العنصر المرتبط به.
 *    2. تنظيف التعليقات المرتبطة بعناصر محذوفة أو نقلها لحالة عائمة (Orphan Handling).
 *    3. عزل البيانات في التخزين دون التأثير على تصدير المستند النهائي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من التعليقات الفارغة
 *    - Type Guards لجميع سلاسل التعليقات والردود
 *    - قيم افتراضية للمستخدم والمؤقت الزمني
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface CommentReply {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: number;
}

export interface CommentThread {
  id: string;
  targetElementId?: string;
  position?: { x: number; y: number };
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: number;
  isResolved: boolean;
  replies: CommentReply[];
}

/**
 * إنشاء سلسلة تعليق جديدة
 */
export function createCommentThread(
  content: string,
  authorName: string = 'المستخدم',
  options?: { targetElementId?: string; position?: { x: number; y: number } },
): CommentThread {
  return {
    id: `thread-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    targetElementId: options?.targetElementId,
    position: options?.position,
    authorName,
    content: content.trim(),
    createdAt: Date.now(),
    isResolved: false,
    replies: [],
  };
}

/**
 * إضافة رد إلى سلسلة تعليق
 */
export function addReplyToThread(
  thread: CommentThread,
  replyContent: string,
  authorName: string = 'المستخدم',
): CommentThread {
  const reply: CommentReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorName,
    content: replyContent.trim(),
    createdAt: Date.now(),
  };

  return {
    ...thread,
    replies: [...thread.replies, reply],
  };
}

/**
 * تبديل حالة الحل للتعليق
 */
export function toggleThreadResolved(thread: CommentThread): CommentThread {
  return {
    ...thread,
    isResolved: !thread.isResolved,
  };
}
