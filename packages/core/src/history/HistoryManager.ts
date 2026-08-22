/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير تاريخ التراجع والإعادة (Undo/Redo) - History Manager
 * 🏛️ الدور: مكون مشترك - تخزين اللقطات و التنقل بين الحالات
 * 📥 المستهلك: كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Snapshot-Based History: تاريخ مبني على اللقطات
 *    مع past/future stacks و configurable limit
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحد الأقصى يجب أن يُحترم (50 افتراضياً)
 *    2. push يجب أن يمسح future
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - JSON.parse/stringify لمنع تعديل المراجع
 *    - fallback لـ null عند عدم وجود حالة سابقة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentModel } from '../types';

export interface HistoryEntry<TData = unknown> {
  timestamp: number;
  description: string;
  snapshot: DocumentModel<TData>;
}

export class HistoryManager<TData = unknown> {
  private past: HistoryEntry<TData>[] = [];
  private future: HistoryEntry<TData>[] = [];
  private limit: number;

  constructor(limit = 50) {
    this.limit = limit;
  }

  push(snapshot: DocumentModel<TData>, description = 'تعديل'): void {
    this.past.push({
      timestamp: Date.now(),
      description,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
    });
    if (this.past.length > this.limit) {
      this.past.shift();
    }
    this.future = [];
  }

  undo(current: DocumentModel<TData>): DocumentModel<TData> | null {
    if (this.past.length === 0) return null;
    const previous = this.past.pop()!;
    this.future.push({
      timestamp: Date.now(),
      description: 'حالة سابقة',
      snapshot: JSON.parse(JSON.stringify(current)),
    });
    return previous.snapshot;
  }

  redo(current: DocumentModel<TData>): DocumentModel<TData> | null {
    if (this.future.length === 0) return null;
    const next = this.future.pop()!;
    this.past.push({
      timestamp: Date.now(),
      description: 'حالة تالية',
      snapshot: JSON.parse(JSON.stringify(current)),
    });
    return next.snapshot;
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }
}
