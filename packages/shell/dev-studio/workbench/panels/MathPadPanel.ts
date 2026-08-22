// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [MathPadPanel.ts] لوحة الحاسبة والمفكرة الرياضية
 *
 * جناح الحاسبة والمتغيرات المشتقة لحظياً.
 *
 * المبدأ:
 * "SERIES ARE DERIVED, NEVER STORED"
 * التعبيرات الرياضية تحسب قيمها دائماً ولا تخزن القيم المحسوبة.
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

export interface MathPadOpts {
  onCompute?: (expr: string) => void;
}

export class MathPadPanel {
  el: HTMLElement;
  private opts: MathPadOpts;

  constructor(opts: MathPadOpts) {
    this.opts = opts;
    this.el = document.createElement('div');
    this.el.className = 'dsw-math-panel';
    this.render();
  }

  render(): void {
    this.el.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'dsw-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g. width * 2 + 10';
    input.style.width = '100%';
    row.appendChild(input);

    const calcBtn = document.createElement('button');
    calcBtn.className = 'dsw-btn';
    calcBtn.textContent = 'حساب';
    calcBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        this.opts.onCompute?.(input.value.trim());
      }
    });
    row.appendChild(calcBtn);

    this.el.appendChild(row);

    const desc = document.createElement('div');
    desc.className = 'dsw-row';
    desc.style.fontSize = '11px';
    desc.style.color = 'var(--muted, #666)';
    desc.textContent = '📐 الحساب لحظي، لا تخزين للقيم المشتقة (Derived Never Stored)';
    this.el.appendChild(desc);
  }
}
