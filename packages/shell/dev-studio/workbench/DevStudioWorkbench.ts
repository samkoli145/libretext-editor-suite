// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [DevStudioWorkbench.ts] وعاء الاستوديو الرئيسي — يجمع الأجنحة الأربعة
 *
 * هذا الملف يجيب: "كيف تصل كل الطبقات إلى يد المستخدم؟"
 *
 * المبدأ الحاكم (من panels.ts):
 * "The panel is chrome, so almost none of it is testable and almost
 *  none of it needs to be — what is NOT visible is what the controls WRITE."
 * الواجهة ترسم، لكن كل فعل يمر عبر patch factory. هذا ما يجعل
 * كل نقرة قابلة للتراجع، وكل سحب نقطة تراجع واحدة.
 *
 * المبدأ الثاني (من story.ts قاعدة 1):
 * "A STEP IS DOCUMENT DATA; THE READER'S POSITION IS NOT."
 * أي جناح مفتوح، أي تبويب نشط — حالة المشاهد، في localStorage.
 * المشروع نفسه لا يعرف أي جناح كان مفتوحاً.
 *
 * المبدأ الثالث (من panels.css):
 * الثيم الفاتح النقي 100%. لا dark، لا theme-dark، لا light-dark().
 * هذا سطح تحرير، يتبع الغرفة فاتحة دائماً.
 * الاستثناء الوحيد: أسطح العرض التقديمي (story.css) — وليس هذا منها.
 *
 * التنبيهات:
 * - كل الأفعال عبر patch factories، لا تعديل مباشر
 * - Burst editing: دفعة إدخال = نقطة تراجع واحدة
 * - Drawers على الشاشات الصغيرة
 * - direction: ltr لأن المستند لا ينعكس أبداً (PLATFORM §8)
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import './DevStudio.css';
import { lsJson, lsSet } from './storage';
import { ProjectTreeModel } from '../tree/ProjectTreeModel';
import { TreeNavigation } from '../tree/TreeNavigation';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { ProjectTreePanel } from './panels/ProjectTreePanel';
import { TaskPanel } from './panels/TaskPanel';
import { DiagnosticsPanel } from './panels/DiagnosticsPanel';
import { MathPadPanel } from './panels/MathPadPanel';

/**
 * الأجنحة الأربعة.
 * كل جناح له عنوان ثابت — الـ accordion يحفظ حالة الفتح بالعنوان،
 * تماماً مثل applyAccordion في panels.ts.
 */
export const WINGS = ['Tree', 'Tasks', 'Doctor', 'Math'] as const;
export type Wing = (typeof WINGS)[number];

/**
 * الأجنحة المغلقة افتراضياً حتى يفتحها المستخدم.
 * نفس مبدأ CLOSED_BY_DEFAULT في panels.ts: الأقسام النادرة
 * مغلقة لتوفير المساحة، لكن العناوين تبقى مرئية دائماً
 * لتظل قابلة للاكتشاف.
 *
 * Doctor و Math مغلقان افتراضياً — المستخدم يفتحهما عند الحاجة.
 * Tree و Tasks مفتوحان — هما ما يصل إليه المستخدم أولاً.
 */
export const CLOSED_BY_DEFAULT = new Set<Wing>(['Doctor', 'Math']);

export const WING_STATE_KEY = 'devstudio-wing-open';
export const PHONE_W = 700;

export interface WorkbenchOpts {
  host: HTMLElement;
  project: ProjectSurface;
  /** callbacks تمر عبر المنادي، لا تعدل مباشرة */
  onOpenFile?: (path: string) => void;
  onRunTask?: (task: string) => void;
  onRollback?: (checkpointId: string) => void;
}

/**
 * وعاء الاستوديو.
 *
 * يجمع الأجنحة الأربعة في تخطيط مقسم:
 * - Tree على اليسار (الملاحة)
 * - Tasks في المنتصف (الأفعال)
 * - Doctor و Math على اليمين (accordion)
 *
 * على الشاشات الصغيرة (<700px) تصبح الأجنحة drawers عائمة،
 * تماماً مثل panels.css: "overlaying costs no layout width at all,
 * so the grid keeps the full screen whether a drawer is open or shut."
 */
export class DevStudioWorkbench {
  host: HTMLElement;
  project: ProjectSurface;
  opts: WorkbenchOpts;

  treeModel: ProjectTreeModel;
  treeNav: TreeNavigation;

  /** حالة فتح الأجنحة — View State، في localStorage */
  openState: Record<string, boolean> = {};

  stale = false;

  constructor(opts: WorkbenchOpts) {
    this.host = opts.host;
    this.project = opts.project;
    this.opts = opts;

    this.treeModel = new ProjectTreeModel(this.project);
    this.treeNav = new TreeNavigation();
    this.openState = lsJson<Record<string, boolean>>(WING_STATE_KEY, {});

    // المستند لا ينعكس أبداً (PLATFORM §8)
    this.host.style.direction = 'ltr';
    this.host.classList.add('dsw-root');

    this.rebuild();
  }

  /**
   * إعادة البناء.
   *
   * ⚠️ من panels.ts: نحترم حقلاً مركزاً عليه المستخدم.
   * إعادة البناء أثناء الكتابة تمزق الحقل من تحت يده.
   * بدلاً من ذلك، نؤجل (stale) ونلحق عند فقدان التركيز.
   */
  rebuild(force = false): void {
    if (!force && this.isActiveEditFocus()) {
      this.stale = true;
      return;
    }
    this.stale = false;

    this.host.innerHTML = '';
    this.host.appendChild(this.buildWing('Tree', () => this.buildTreePanel()));
    this.host.appendChild(this.buildWing('Tasks', () => this.buildTaskPanel()));
    this.host.appendChild(this.buildWing('Doctor', () => this.buildDiagnosticsPanel()));
    this.host.appendChild(this.buildWing('Math', () => this.buildMathPadPanel()));

    this.applyDrawers();
  }

  /**
   * هل المستخدم في منتصف تحرير في حقل ستقطعه إعادة البناء؟
   * نفس منطق isActiveEditFocus في panels.ts:
   * الحقول النصية والرقمية تؤجل، الحقول المنفصلة (أزرار، قوائم)
   * تلتزم ذرياً فتُعاد البناء فوراً.
   */
  isActiveEditFocus(): boolean {
    if (typeof document === 'undefined') return false;
    const a = document.activeElement as HTMLElement | null;
    if (!a || !this.host.contains(a)) return false;
    if (a.tagName === 'TEXTAREA' || a.isContentEditable) return true;
    if (a.tagName === 'INPUT') {
      const t = (a as HTMLInputElement).type;
      return t !== 'checkbox' && t !== 'radio' && t !== 'button';
    }
    return false;
  }

  /**
   * بناء جناح واحد كـ accordion section.
   *
   * من panels.ts applyAccordion: العنوان يجمع أشقاءه التاليين
   * في جسم قابل للطي. حالة الفتح محفوظة بالعنوان.
   */
  buildWing(name: Wing, buildBody: () => HTMLElement): HTMLElement {
    const wing =
      typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
    if (!wing.style) return wing;

    wing.className = 'dsw-wing';
    wing.dataset.wing = name;

    const header = document.createElement('div');
    header.className = 'dsw-wing-head';
    header.textContent = name;
    wing.appendChild(header);

    const body = document.createElement('div');
    body.className = 'dsw-wing-body';
    body.appendChild(buildBody());
    wing.appendChild(body);

    const isOpen = this.openState[name] ?? !CLOSED_BY_DEFAULT.has(name);
    if (!isOpen) {
      wing.classList.add('dsw-shut');
      body.style.display = 'none';
    }

    header.addEventListener('click', () => {
      const nowShut = wing.classList.toggle('dsw-shut');
      body.style.display = nowShut ? 'none' : '';
      this.openState[name] = !nowShut;
      lsSet(WING_STATE_KEY, JSON.stringify(this.openState));
    });

    return wing;
  }

  /**
   * على الشاشات الصغيرة، الأجنحة تصبح drawers عائمة.
   *
   * ⚠️ من panels.css: "699 and not 700, because panels.ts tests
   * `vw < PHONE_W` with PHONE_W = 700 — so 700 is a DESKTOP there.
   * Breakpoints that mean the same thing have to BE the same number."
   *
   * نستخدم PHONE_W - 1 هنا لنفس السبب: 700 هو desktop، 699 هو phone.
   */
  applyDrawers(): void {
    if (typeof window === 'undefined') return;
    const isPhone = window.innerWidth < PHONE_W;
    this.host.classList.toggle('dsw-phone', isPhone);
  }

  // ── الأجنحة ────────────────────────────────────────────────

  buildTreePanel(): HTMLElement {
    const panel = new ProjectTreePanel({
      model: this.treeModel,
      nav: this.treeNav,
      onOpen: (path) => this.opts.onOpenFile?.(path),
    });
    return panel.el;
  }

  buildTaskPanel(): HTMLElement {
    const panel = new TaskPanel({
      onRun: (task) => this.opts.onRunTask?.(task),
    });
    return panel.el;
  }

  buildDiagnosticsPanel(): HTMLElement {
    const panel = new DiagnosticsPanel({
      onRollback: (id) => this.opts.onRollback?.(id),
    });
    return panel.el;
  }

  buildMathPadPanel(): HTMLElement {
    const panel = new MathPadPanel({});
    return panel.el;
  }

  /** إعادة البناء عند تغيير خارجي. */
  refresh(): void {
    this.rebuild(true);
  }
}

/** تثبيت الاستوديو على عنصر في الصفحة. يعيد detach للتناسق. */
export function installDevStudio(opts: WorkbenchOpts): () => void {
  const wb = new DevStudioWorkbench(opts);
  const onResize = () => wb.refresh();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onResize);
    }
    opts.host.innerHTML = '';
  };
}
