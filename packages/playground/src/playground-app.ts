/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: playground-app.ts
 * 📂 المسار: packages/playground/src/playground-app.ts
 * 🎯 الهدف الرئيسي: الواجهة البصرية الحية — تجميع القشرة والأدوات والمشاهد في DOM
 * 📋 المعايير: شريط تبويبات + شريط أدوات سياقي ≤9+محجوز + لوحات قابلة للطي +
 *              لوحة أوامر بحث + صفحة إعدادات — كل التبديل بالماوس
 * 🧪 الاختبارات: المنطق مغطى؛ هذا الملف عرض فقط (jsdom اختياري)
 * 🏷️ المعرف: PLAY-APP-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    State-Diff Rendering — render() يعيد بناء الشريط واللوحات من ShellState
 *    فقط عند تغيرها (dirty flags بسيطة)، والمشاهد الأربعة تُنشأ كسولة وتُخفى
 *    لا تُهدم (حالة كل محرر حية عبر التبديل).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يتطلب DOM — mountPlayground يرمي خارج المتصفح.
 *    2. innerHTML للأيقونات آمن (نصوصنا الثابتة) — لا مدخل مستخدم فيها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - shell/*, views/*, panels/* — كل مكونات الملعب
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  createInitialShellState,
  switchDomain,
  togglePanel,
  togglePin,
  toggleSettings,
  applyTheme,
  ALL_DOMAINS,
} from './shell/playground-shell';
import type { ShellState, OfficeDomain } from './shell/playground-shell';
import { buildMenusForDomain } from './shell/menu-model';
import { createIconElement, getIcon, DOMAIN_COLORS } from './shell/icon-set';
import {
  getToolbarLayout,
  searchTools,
  getRegistryStats,
} from './shell/tool-registry';
import type { ToolEntry } from './shell/tool-registry';
import { WriterView, CalcView, ImpressView, BaseView } from './views/editor-views';
import type { RegisteredEditor } from './shell/playground-shell';
import { buildThemeGallery, CANVAS_BACKGROUNDS } from './panels/settings-page';

const DOMAIN_LABELS: Record<OfficeDomain, string> = {
  writer: 'نص',
  calc: 'بيانات',
  impress: 'عرض',
  base: 'قاعدة',
};

/** تطبيق الملعب الكامل. */
export class PlaygroundApp {
  private state: ShellState = createInitialShellState();
  private editors = new Map<OfficeDomain, RegisteredEditor>();
  private viewElements = new Map<OfficeDomain, HTMLElement>();
  private root!: HTMLElement;

  /** تركيب التطبيق في حاوية. */
  mount(container: HTMLElement): void {
    if (typeof document === 'undefined') throw new Error('يتطلب DOM');
    this.root = container;
    this.root.classList.add('lt-playground');
    this.injectStyles();
    this.root.innerHTML = `
      <div class="lt-menubar" data-zone="menubar"></div>
      <div class="lt-tabbar" data-zone="tabbar"></div>
      <div class="lt-toolbar" data-zone="toolbar"></div>
      <div class="lt-body" data-zone="body">
        <div class="lt-workarea" data-zone="canvas"></div>
        <aside class="lt-panel lt-panel-layers" data-zone="layers"></aside>
        <aside class="lt-panel lt-panel-properties" data-zone="properties"></aside>
      </div>
      <footer class="lt-statusbar" data-zone="statusbar"></footer>
      <div class="lt-palette-overlay" hidden></div>
      <div class="lt-settings-overlay" hidden></div>
    `;
    this.render();
  }

  // ── Render (state-diff مبسط: إعادة بناء كاملة للمناطق المتغيرة) ──

  private render(): void {
    this.renderTabbar();
    this.renderMenubar();
    this.renderToolbar();
    this.renderWorkarea();
    this.renderPanels();
    this.renderStatusbar();
  }

  private renderTabbar(): void {
    const bar = this.root.querySelector('[data-zone=tabbar]')!;
    bar.innerHTML = '';
    for (const domain of ALL_DOMAINS) {
      const tab = document.createElement('button');
      tab.className =
        'lt-tab' + (domain === this.state.activeDomain ? ' lt-tab-active' : '');
      tab.style.setProperty('--domain-color', DOMAIN_COLORS[domain]);
      const icon = createIconElement(domain);
      const label = document.createElement('span');
      label.textContent = DOMAIN_LABELS[domain];
      tab.append(icon, label);
      tab.onclick = () => {
        this.state = switchDomain(this.state, domain);
        this.render();
      };
      bar.appendChild(tab);
    }
  }

  private renderMenubar(): void {
    const bar = this.root.querySelector('[data-zone=menubar]')!;
    bar.innerHTML = '';
    for (const section of buildMenusForDomain(this.state.activeDomain)) {
      const btn = document.createElement('button');
      btn.className = 'lt-menu-btn';
      btn.textContent = section.labelAr;
      btn.onclick = () => this.openMenuDropdown(btn, section.actions);
      bar.appendChild(btn);
    }

    // يمين القائمة: زر الإعدادات
    const spacer = document.createElement('div');
    spacer.className = 'lt-menubar-spacer';
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'lt-menu-btn';
    settingsBtn.innerHTML = getIcon('settings');
    settingsBtn.title = 'الإعدادات والخلفية';
    settingsBtn.onclick = () => {
      this.state = toggleSettings(this.state);
      this.render();
    };
    bar.append(spacer, settingsBtn);
  }

  private openMenuDropdown(
    anchor: HTMLElement,
    actions: readonly { id: string; labelAr: string; icon?: string; separatorBefore?: boolean }[],
  ): void {
    this.closeDropdowns();
    const dd = document.createElement('div');
    dd.className = 'lt-dropdown';
    for (const action of actions) {
      if (action.separatorBefore) {
        const sep = document.createElement('hr');
        dd.appendChild(sep);
      }
      const item = document.createElement('button');
      item.className = 'lt-dropdown-item';
      if (action.icon) item.innerHTML = getIcon(action.icon);
      const label = document.createElement('span');
      label.textContent = action.labelAr;
      item.appendChild(label);
      item.onclick = () => {
        this.dispatchCommand(action.id);
        this.closeDropdowns();
      };
      dd.appendChild(item);
    }
    anchor.parentElement!.appendChild(dd);
    const rect = anchor.getBoundingClientRect();
    const parentRect = anchor.parentElement!.getBoundingClientRect();
    dd.style.top = `${rect.bottom - parentRect.top}px`;
    dd.style.right = '0';
  }

  private closeDropdowns(): void {
    this.root.querySelectorAll('.lt-dropdown').forEach(d => d.remove());
  }

  private renderToolbar(): void {
    const bar = this.root.querySelector('[data-zone=toolbar]')!;
    bar.innerHTML = '';
    const { primary, overflow, reserved } = getToolbarLayout(this.state.activeDomain);

    for (const tool of primary) {
      bar.appendChild(this.createToolButton(tool));
    }

    // خانات محجوزة شبحية
    for (const tool of reserved) {
      const ghost = document.createElement('button');
      ghost.className = 'lt-tool lt-tool-reserved';
      ghost.title = `${tool.labelAr} — ${tool.hintAr ?? 'محجوز للمستقبل'}`;
      ghost.disabled = true;
      if (tool.icon) ghost.innerHTML = getIcon(tool.icon);
      bar.appendChild(ghost);
    }

    // قائمة الفائض ⋮
    if (overflow.length > 0) {
      const more = document.createElement('button');
      more.className = 'lt-tool lt-tool-more';
      more.textContent = '⋮';
      more.title = `المزيد (${overflow.length})`;
      more.onclick = () => this.openMenuDropdown(more, overflow);
      bar.appendChild(more);
    }

    // فاصل مرن يدفع الأدوات الثابتة للطرف
    const spacer = document.createElement('div');
    spacer.className = 'lt-toolbar-spacer';
    bar.appendChild(spacer);
  }

  private createToolButton(tool: ToolEntry): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'lt-tool';
    btn.title = tool.hintAr ? `${tool.labelAr} — ${tool.hintAr}` : tool.labelAr;
    if (tool.icon) btn.innerHTML = getIcon(tool.icon);
    else btn.textContent = tool.labelAr.slice(0, 2);
    btn.onclick = () => this.dispatchCommand(tool.id);
    return btn;
  }

  /** توجيه أمر: محرر نشط أولاً، ثم أوامر القشرة. */
  private dispatchCommand(commandId: string): void {
    // أوامر القشرة
    switch (commandId) {
      case 'toggle-layers':
        this.state = togglePanel(this.state, 'layers');
        this.render();
        return;
      case 'toggle-properties':
        this.state = togglePanel(this.state, 'properties');
        this.render();
        return;
      case 'pin-panels': {
        const panel = this.state.panels.layers.pinned ? 'layers' : 'properties';
        this.state = togglePin(this.state, panel);
        this.render();
        return;
      }
      case 'open-settings':
        this.state = toggleSettings(this.state);
        this.render();
        return;
      case 'command-palette':
        this.openPalette();
        return;
      case 'apply-theme':
        this.state = toggleSettings(this.state);
        this.render();
        return;
    }

    // أوامر المحرر النشط
    const editor = this.getOrCreateEditor(this.state.activeDomain);
    editor.handleCommand(commandId);
    this.renderWorkarea();
    this.renderStatusbar();
  }

  // ── المشاهد الأربعة (كسولية، تُخفى لا تُهدم) ──

  private getOrCreateEditor(domain: OfficeDomain): RegisteredEditor {
    let editor = this.editors.get(domain);
    if (!editor) {
      switch (domain) {
        case 'writer': editor = new WriterView(); break;
        case 'calc': editor = new CalcView(); break;
        case 'impress': editor = new ImpressView(this.state.themeKey); break;
        case 'base': editor = new BaseView(); break;
      }
      this.editors.set(domain, editor!);
    }
    return editor!;
  }

  private renderWorkarea(): void {
    const area = this.root.querySelector('[data-zone=canvas]')!;
    area.innerHTML = '';

    if (this.state.settingsOpen) {
      area.appendChild(this.buildSettingsPage());
      return;
    }

    const domain = this.state.activeDomain;
    // إعادة بناء دائماً — حالة المحرر قد تكون تغيرت بأمر
    const viewEl = this.buildEditorPreview(domain);
    this.viewElements.set(domain, viewEl);
    area.appendChild(viewEl);
  }

  /** معاينة نصية-بصرية لحالة كل محرر (بدون Monaco — لاحقاً). */
  private buildEditorPreview(domain: OfficeDomain): HTMLElement {
    const el = document.createElement('div');
    el.className = 'lt-editor-preview';
    const editor = this.getOrCreateEditor(domain);

    if (editor instanceof WriterView) {
      el.innerHTML = `<h3>📄 ${editor.titleAr}</h3>
        <p class="lt-muted">${editor.doc.blocks.length} بلوكاً — العنوان: ${escapeHtml(editor.doc.title)}</p>`;
    } else if (editor instanceof CalcView) {
      const computed = editor.recalculate();
      let rowsHtml = '';
      for (const [addr, raw] of editor.cells) {
        const value = computed.has(addr) ? String(computed.get(addr)) : raw;
        rowsHtml += `<tr><td class="lt-cell-addr">${addr}</td><td>${escapeHtml(raw)}</td><td class="lt-cell-value">${escapeHtml(value)}</td></tr>`;
      }
      el.innerHTML = `<h3>📊 ${editor.titleAr}</h3>
        <table class="lt-calc-table"><thead><tr><th>الخلية</th><th>المعادلة/المدخل</th><th>القيمة</th></tr></thead><tbody>${rowsHtml}</tbody></table>`;
    } else if (editor instanceof ImpressView) {
      const slides = editor.pres.slides
        .map(s => `<div class="lt-slide-thumb"><strong>${s.slideNumber}</strong><span>${s.layout}</span></div>`)
        .join('');
      el.innerHTML = `<h3>🖼️ ${editor.titleAr} — ${editor.pres.theme.nameAr}</h3>
        <p class="lt-muted">الثيم: ${escapeHtml(editor.pres.theme.name)} | الانتقال: ${editor.pres.slides[0]?.transition.type}</p>
        <div class="lt-slides-strip">${slides}</div>`;
    } else if (editor instanceof BaseView) {
      const tables = editor.db.tables
        .map(t => `<li>${escapeHtml(t.name)} — ${t.columns.length} أعمدة، ${t.records.length} سجلات</li>`)
        .join('');
      el.innerHTML = `<h3>🗄️ ${editor.titleAr}: ${escapeHtml(editor.db.name)}</h3><ul>${tables}</ul>`;
    }
    return el;
  }

  // ── اللوحات الجانبية ──

  private renderPanels(): void {
    const layers = this.root.querySelector('.lt-panel-layers')!;
    const props = this.root.querySelector('.lt-panel-properties')!;

    this.applyPanelState(layers as HTMLElement, this.state.panels.layers.visible, '🗂️ الطبقات', [
      'اكتشف الطبقات من الكود تلقائياً',
      '(extractLayerTree — جاهز للربط بمحرر الكود)',
    ]);
    this.applyPanelState(props as HTMLElement, this.state.panels.properties.visible, '⚙️ الخصائص', [
      'خصائص العنصر المحدد',
      '(تظهر هنا عند التحديد)',
    ]);
  }

  private applyPanelState(el: HTMLElement, visible: boolean, title: string, hints: string[]): void {
    el.hidden = !visible;
    if (!visible) return;
    el.innerHTML = `<header><strong>${title}</strong></header>` +
      hints.map(h => `<p class="lt-muted">${h}</p>`).join('');
  }

  // ── شريط الحالة ──

  private renderStatusbar(): void {
    const bar = this.root.querySelector('[data-zone=statusbar]')!;
    const stats = getRegistryStats();
    bar.innerHTML = `
      <span>${DOMAIN_LABELS[this.state.activeDomain]}</span>
      <span>•</span>
      <span>الثيم: ${this.state.themeKey}</span>
      <span class="lt-statusbar-spacer"></span>
      <span>${stats.total} أداة (${stats.reserved} محجوزة)</span>`;
  }

  // ── لوحة الأوامر ──

  private openPalette(): void {
    const overlay = this.root.querySelector('.lt-palette-overlay') as HTMLElement;
    overlay.hidden = false;
    overlay.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'lt-palette-box';
    const input = document.createElement('input');
    input.placeholder = 'ابحث في كل الأدوات…';
    input.className = 'lt-palette-input';
    const results = document.createElement('div');
    results.className = 'lt-palette-results';

    const paintResults = (): void => {
      results.innerHTML = '';
      for (const tool of searchTools(input.value).slice(0, 20)) {
        const item = document.createElement('button');
        item.className = 'lt-dropdown-item' + (tool.reserved ? ' lt-item-reserved' : '');
        const label = document.createElement('span');
        label.textContent = `${tool.reserved ? '🔒 ' : ''}${tool.labelAr}`;
        const hint = document.createElement('small');
        hint.textContent = tool.hintAr ?? tool.id;
        item.append(label, hint);
        item.onclick = () => {
          if (!tool.reserved) this.dispatchCommand(tool.id);
          overlay.hidden = true;
        };
        results.appendChild(item);
      }
    };
    input.oninput = paintResults;
    paintResults();

    overlay.onclick = e => {
      if (e.target === overlay) overlay.hidden = true;
    };
    box.append(input, results);
    overlay.appendChild(box);
    input.focus();
  }

  // ── صفحة الإعدادات ──

  private buildSettingsPage(): HTMLElement {
    const page = document.createElement('div');
    page.className = 'lt-settings-page';

    const gallery = buildThemeGallery();
    const themesHtml = gallery
      .map(
        t => `
        <button class="lt-theme-card${t.key === this.state.themeKey ? ' lt-theme-active' : ''}" data-theme-key="${t.key}">
          <span class="lt-theme-swatch" style="background:${t.backgroundColor};border-color:${t.primaryColor}">
            <b style="color:${t.primaryColor}">أب</b>
          </span>
          <span class="lt-theme-name">${t.generated ? '🧬 ' : ''}${t.nameAr}</span>
        </button>`,
      )
      .join('');

    const bgsHtml = CANVAS_BACKGROUNDS.map(
      bg => `
      <button class="lt-bg-card${bg.key === (this.state.canvasBackground || 'none') ? ' lt-theme-active' : ''}" data-bg-css="${bg.css}">
        <span class="lt-bg-swatch" style="background:${bg.css || '#fff'};border:1px solid #e2e8f0"></span>
        <span>${bg.labelAr}</span>
      </button>`,
    ).join('');

    page.innerHTML = `
      <h2>⚙️ الإعدادات والخلفية</h2>
      <section><h3>الثيمات (${gallery.length})</h3><div class="lt-theme-grid">${themesHtml}</div></section>
      <section><h3>خلفية منطقة العمل</h3><div class="lt-bg-grid">${bgsHtml}</div></section>
      <button class="lt-btn-close">إغلاق</button>
    `;

    page.querySelectorAll('[data-theme-key]').forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        this.state = applyTheme(this.state, (btn as HTMLElement).dataset.themeKey!, this.state.canvasBackground);
        this.render();
      };
    });
    page.querySelectorAll('[data-bg-css]').forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        this.state = applyTheme(this.state, this.state.themeKey, (btn as HTMLElement).dataset.bgCss ?? '');
        this.render();
      };
    });
    (page.querySelector('.lt-btn-close') as HTMLElement).onclick = () => {
      this.state = toggleSettings(this.state);
      this.render();
    };
    return page;
  }

  // ── الأنماط ──

  private injectStyles(): void {
    if (document.getElementById('lt-playground-styles')) return;
    const style = document.createElement('style');
    style.id = 'lt-playground-styles';
    style.textContent = PLAYGROUND_CSS;
    document.head.appendChild(style);
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** نقطة دخول مختصرة. */
export function mountPlayground(container: HTMLElement): PlaygroundApp {
  const app = new PlaygroundApp();
  app.mount(container);
  return app;
}

const PLAYGROUND_CSS = `
.lt-playground{display:flex;flex-direction:column;height:100%;min-height:600px;background:#f8fafc;color:#0f172a;font-family:system-ui;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;direction:rtl}
.lt-playground button{cursor:pointer;font-family:inherit}
.lt-menubar{display:flex;align-items:center;gap:4px;padding:4px 10px;background:#fff;border-bottom:1px solid #e2e8f0;position:relative}
.lt-menubar-spacer{flex:1}
.lt-menu-btn{border:none;background:none;padding:6px 12px;border-radius:8px;font-size:13px;color:#334155}
.lt-menu-btn:hover{background:#f1f5f9}
.lt-tabbar{display:flex;gap:6px;padding:6px 10px;background:#fff;border-bottom:1px solid #e2e8f0}
.lt-tab{display:flex;align-items:center;gap:6px;border:1px solid #e2e8f0;background:#f8fafc;padding:6px 14px;border-radius:10px 10px 0 0;font-size:13px;color:#475569;border-bottom:none}
.lt-tab-active{background:#fff;color:var(--domain-color);font-weight:700;box-shadow:inset 0 -2px 0 var(--domain-color)}
.lt-toolbar{display:flex;align-items:center;gap:4px;padding:6px 10px;background:#fff;border-bottom:1px solid #e2e8f0;position:relative}
.lt-toolbar-spacer{flex:1}
.lt-tool{display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;border:none;background:none;border-radius:8px;padding:4px}
.lt-tool:hover{background:#eff6ff}
.lt-tool-reserved{opacity:.35;border:1px dashed #cbd5e1}
.lt-tool-more{font-weight:900;color:#64748b}
.lt-body{display:flex;flex:1;min-height:0}
.lt-workarea{flex:1;overflow:auto;padding:16px}
.lt-panel{width:240px;background:#fff;border-right:1px solid #e2e8f0;padding:12px;font-size:13px}
.lt-panel-properties{border-right:none;border-left:1px solid #e2e8f0;width:220px}
.lt-panel header{padding-bottom:8px;margin-bottom:8px;border-bottom:1px solid #f1f5f9}
.lt-statusbar{display:flex;gap:8px;align-items:center;padding:4px 12px;background:#fff;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b}
.lt-statusbar-spacer{flex:1}
.lt-dropdown{position:absolute;top:100%;right:0;min-width:200px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,.1);padding:6px;z-index:50}
.lt-dropdown-item{display:flex;align-items:center;gap:8px;width:100%;text-align:right;border:none;background:none;padding:7px 10px;border-radius:7px;font-size:13px;color:#334155}
.lt-dropdown-item:hover{background:#f1f5f9}
.lt-dropdown-item small{margin-inline-start:auto;color:#94a3b8;font-size:10px}
.lt-dropdown hr{border:none;border-top:1px solid #f1f5f9;margin:4px 0}
.lt-editor-preview h3{margin:0 0 8px}
.lt-muted{color:#94a3b8;font-size:12px}
.lt-calc-table{border-collapse:collapse;font-size:13px;width:100%;max-width:560px}
.lt-calc-table th,.lt-calc-table td{border:1px solid #e2e8f0;padding:6px 10px;text-align:right}
.lt-cell-addr{background:#f1f5f9;font-family:monospace;font-weight:700}
.lt-cell-value{color:#1e7145;font-weight:600}
.lt-slides-strip{display:flex;gap:10px;flex-wrap:wrap}
.lt-slide-thumb{width:110px;height:70px;border:1px solid #e2e8f0;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;font-size:11px;color:#64748b}
.lt-slide-thumb strong{color:#c05a11;font-size:18px}
.lt-palette-overlay,.lt-settings-overlay{position:fixed;inset:0;background:rgba(15,23,42,.25);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding-top:80px}
.lt-palette-box{width:min(520px,92vw);background:#fff;border-radius:14px;box-shadow:0 16px 48px rgba(15,23,42,.2);overflow:hidden}
.lt-palette-input{width:100%;border:none;border-bottom:1px solid #f1f5f9;padding:14px 16px;font-size:15px;outline:none;font-family:inherit}
.lt-palette-results{max-height:320px;overflow:auto;padding:6px}
.lt-item-reserved{opacity:.5}
.lt-settings-page{max-width:720px;margin:0 auto;width:100%}
.lt-settings-page h2{margin-top:0}
.lt-theme-grid,.lt-bg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.lt-theme-card,.lt-bg-card{display:flex;flex-direction:column;align-items:center;gap:6px;border:1px solid #e2e8f0;background:#fff;border-radius:12px;padding:12px;font-size:12px}
.lt-theme-active{outline:2px solid #2563eb}
.lt-theme-swatch{width:64px;height:44px;border-radius:8px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:16px}
.lt-bg-swatch{width:64px;height:40px;border-radius:8px}
.lt-btn-close{margin-top:16px;padding:8px 24px;border:none;border-radius:10px;background:#2563eb;color:#fff;font-size:14px}
`;
