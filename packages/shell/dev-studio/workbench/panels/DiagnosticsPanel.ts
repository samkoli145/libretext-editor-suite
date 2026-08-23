// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [DiagnosticsPanel.ts] جناح الدكتور — صمام الأمان المرئي
 *
 * هذا الجناح يعرض تقارير الدكتور ونقاط الرجوع.
 *
 * المبدأ الحاكم (من panels.ts):
 * "The panel is chrome... what is NOT visible is what the controls WRITE."
 * الجناح يعرض، لكن الرجوع يمر عبر RollbackManager — لا يعدل مباشرة.
 *
 * المبدأ الثاني (من test-dash-panels.ts):
 * "the factories are factories" — كل فعل هنا يستدعي patch factory،
 * لا يعدل الحالة. هذا ما يجعل كل رجوع قابلاً للتراجع.
 *
 * التنبيهات:
 * - الثيم الفاتح النقي: شارات ملونة على خلفية فاتحة
 * - الرجوع يستهلك اللقطة — لا رجوع مزدوج
 * - danger يحتاج قراراً صريحاً، لا يُقبل صامتاً
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import type { DoctorReport } from '../../core/DevStudioTypes';

export interface DiagnosticsOpts {
  onRollback?: (checkpointId: string) => void;
}

/**
 * جناح الدكتور.
 *
 * يعرض:
 * 1. آخر تقرير دكتور (فحوصات + حكم)
 * 2. نقاط الرجوع المتاحة
 *
 * كل رجوع يمر عبر onRollback — المنادي يطبقه عبر RollbackManager.
 */
export class DiagnosticsPanel {
  el: HTMLElement;
  private opts: DiagnosticsOpts;

  constructor(opts: DiagnosticsOpts) {
    this.opts = opts;
    this.el = document.createElement('div');
    this.el.className = 'dsw-diagnostics';
    this.draw(null, []);
  }

  /**
   * رسم الجناح.
   *
   * ⚠️ الحقول المضافة: الغياب يعني "لا".
   * تقرير بلا أخطاء لا يحمل rejectionReason.
   */
  draw(
    report: DoctorReport | null,
    checkpoints: Array<{ id: string; label: string; clean?: true }>,
  ): void {
    this.el.innerHTML = '';

    // ── تقرير الدكتور ──
    const repSection = document.createElement('div');
    repSection.className = 'dsw-section';

    if (!report) {
      repSection.textContent = 'لا تقرير بعد';
    } else {
      const verdict = this.deriveVerdict(report);
      const badge = document.createElement('span');
      badge.className = `dsw-badge ${verdict.approved ? 'dsw-ok' : 'dsw-err'}`;
      badge.textContent = verdict.approved ? '✓ معتمد' : '✗ مرفوض';
      repSection.appendChild(badge);

      const counts = document.createElement('div');
      counts.className = 'dsw-row';
      counts.textContent = `${verdict.passed} نجح · ${verdict.failed} فشل · ${verdict.warnings} تحذير`;
      repSection.appendChild(counts);

      // rejectionReason موجود فقط عند الرفض (حقل مضاف)
      if (report.rejectionReason) {
        const reason = document.createElement('div');
        reason.className = 'dsw-row';
        reason.textContent = report.rejectionReason;
        repSection.appendChild(reason);
      }
    }
    this.el.appendChild(repSection);

    // ── نقاط الرجوع ──
    const ckSection = document.createElement('div');
    ckSection.className = 'dsw-section';

    if (!checkpoints.length) {
      ckSection.textContent = 'لا نقاط رجوع';
    } else {
      for (const ck of checkpoints) {
        const row = document.createElement('div');
        row.className = 'dsw-row';

        const label = document.createElement('span');
        label.textContent = ck.label;
        // clean غير متناظر: فقط اللقطات الموافق عليها تحمله
        if (ck.clean) {
          const cleanBadge = document.createElement('span');
          cleanBadge.className = 'dsw-badge dsw-ok';
          cleanBadge.textContent = 'نظيف';
          label.appendChild(cleanBadge);
        }
        row.appendChild(label);

        const btn = document.createElement('button');
        btn.className = 'dsw-btn dsw-danger';
        btn.textContent = 'رجوع';
        btn.addEventListener('click', () => this.opts.onRollback?.(ck.id));
        row.appendChild(btn);

        ckSection.appendChild(row);
      }
    }
    this.el.appendChild(ckSection);
  }

  /**
   * اشتقاق الحكم من الفحوصات — لا يُخزن.
   * من story.ts: "DERIVED, NEVER STORED."
   */
  private deriveVerdict(report: DoctorReport): {
    passed: number;
    failed: number;
    warnings: number;
    approved: boolean;
  } {
    let passed = 0,
      failed = 0,
      warnings = 0;
    for (const c of report.checks) {
      if (c.status === 'pass') passed++;
      else if (c.status === 'fail') failed++;
      else warnings++;
    }
    return { passed, failed, warnings, approved: failed === 0 };
  }
}
