/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: BlockToolbar.ts
 * 📂 المسار: packages/adapters/src/react/BlockToolbar.ts
 * 🎯 الهدف الرئيسي: شريط أدوات ديناميكي لكل نوع كتلة (25 نوع) كـ HTML
 * 📋 المعايير: متوافق مع محور React القائم على innerHTML بدون اعتماديات
 * 🧪 الاختبارات: TEST-ADAP-BLOCK-TOOLBAR
 * 🏷️ المعرف: ADAP-BLOCK-TOOLBAR
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Per-Block Toolbar Config Registry + String-Based Rendering
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlockType } from '@libretext/core';

export interface ToolbarActionConfig {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
}

const TOOLBAR_CONFIG: Record<BlockType, readonly ToolbarActionConfig[]> = {
  paragraph: [
    { id: 'bold', label: 'Bold', icon: 'B' },
    { id: 'italic', label: 'Italic', icon: 'I' },
    { id: 'heading', label: 'Heading' },
  ],
  heading: [
    { id: 'level-up', label: '↑' },
    { id: 'level-down', label: '↓' },
    { id: 'to-paragraph', label: 'P' },
  ],
  table: [
    { id: 'add-row', label: '+Row' },
    { id: 'add-col', label: '+Col' },
    { id: 'delete-row', label: '-Row' },
    { id: 'delete-col', label: '-Col' },
  ],
  image: [
    { id: 'replace', label: 'Replace' },
    { id: 'crop', label: 'Crop' },
    { id: 'alt-text', label: 'Alt' },
  ],
  list: [
    { id: 'toggle-type', label: 'Type' },
    { id: 'indent', label: '→' },
    { id: 'dedent', label: '←' },
    { id: 'toggle-checked', label: '☑' },
  ],
  code_block: [
    { id: 'copy', label: 'Copy' },
    { id: 'language', label: 'Lang' },
  ],
  horizontal_rule: [
    { id: 'style', label: 'Style' },
    { id: 'color', label: 'Color' },
  ],
  blockquote: [
    { id: 'set-author', label: 'Author' },
    { id: 'set-source', label: 'Source' },
    { id: 'toggle-border', label: 'Border' },
  ],
  cell: [
    { id: 'format', label: 'Format' },
    { id: 'formula', label: 'fx' },
  ],
  shape: [
    { id: 'fill', label: 'Fill' },
    { id: 'stroke', label: 'Stroke' },
    { id: 'to-path', label: 'Path' },
  ],
  slide: [
    { id: 'layout', label: 'Layout' },
    { id: 'background', label: 'BG' },
    { id: 'duplicate', label: 'Copy' },
  ],
  database_record: [
    { id: 'add-field', label: '+Field' },
    { id: 'delete-field', label: '-Field' },
    { id: 'sort', label: 'Sort' },
  ],
  embed: [
    { id: 'change-url', label: 'URL' },
    { id: 'preview', label: 'Preview' },
  ],
  pdf: [
    { id: 'zoom-in', label: '+' },
    { id: 'zoom-out', label: '-' },
    { id: 'next-page', label: '→' },
    { id: 'prev-page', label: '←' },
  ],
  'color-picker': [
    { id: 'copy-hex', label: 'Hex' },
    { id: 'copy-rgb', label: 'RGB' },
  ],
  'icon-picker': [
    { id: 'change-icon', label: 'Icon' },
    { id: 'change-library', label: 'Lib' },
    { id: 'resize', label: 'Size' },
  ],
  'bg-color': [
    { id: 'pick-color', label: 'Pick' },
    { id: 'copy-hex', label: 'Hex' },
  ],
  'bg-image': [
    { id: 'replace', label: 'Replace' },
    { id: 'fit', label: 'Fit' },
    { id: 'opacity', label: 'Opacity' },
  ],
  gradient: [
    { id: 'add-stop', label: '+' },
    { id: 'remove-stop', label: '-' },
    { id: 'type', label: 'Type' },
  ],
  'font-picker': [
    { id: 'change-font', label: 'Font' },
    { id: 'change-size', label: 'Size' },
    { id: 'change-weight', label: 'Weight' },
  ],
  'text-styler': [
    { id: 'bold', label: 'B' },
    { id: 'italic', label: 'I' },
    { id: 'underline', label: 'U' },
    { id: 'strikethrough', label: 'S' },
    { id: 'color', label: 'Color' },
  ],
  'template-card': [
    { id: 'edit-title', label: 'Title' },
    { id: 'edit-image', label: 'Image' },
    { id: 'edit-button', label: 'Button' },
  ],
  'template-gallery': [
    { id: 'add-template', label: '+' },
    { id: 'remove-template', label: '-' },
    { id: 'reorder', label: 'Reorder' },
  ],
  math: [
    { id: 'edit-latex', label: 'LaTeX' },
    { id: 'toggle-display', label: 'Inline/Display' },
  ],
  details: [
    { id: 'edit-summary', label: 'Summary' },
    { id: 'toggle-open', label: 'Open' },
  ],
  toc: [
    { id: 'set-depth', label: 'Depth' },
    { id: 'refresh', label: 'Refresh' },
  ],
  svg_icon: [
    { id: 'pick-icon', label: 'Icon' },
    { id: 'set-color', label: 'Color' },
    { id: 'set-size', label: 'Size' },
  ],
  html_embed: [
    { id: 'edit-html', label: 'HTML' },
    { id: 'sanitize', label: 'Sanitize' },
  ],
  code_runner: [
    { id: 'run', label: '▶ Run' },
    { id: 'edit-code', label: 'Edit' },
    { id: 'set-language', label: 'Language' },
    { id: 'toggle-auto-run', label: 'Auto' },
  ],
  regex_tester: [
    { id: 'test', label: 'Test' },
    { id: 'edit-pattern', label: 'Pattern' },
    { id: 'pick-preset', label: 'Presets' },
  ],
};

export function getToolbarActions(blockType: BlockType): readonly ToolbarActionConfig[] {
  return TOOLBAR_CONFIG[blockType] ?? [];
}

export function renderBlockToolbar(blockType: BlockType): string {
  const actions = TOOLBAR_CONFIG[blockType];
  if (!actions || actions.length === 0) return '';

  const buttons = actions.map((a) => {
    const text = a.icon || a.label;
    return `<button class="lt-toolbar-btn" data-action="${a.id}" title="${a.label}" style="padding:4px 8px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;font-size:12px;color:#334155">${text}</button>`;
  }).join('');

  return `<div class="lt-block-toolbar" style="display:flex;gap:4px;padding:4px;border-top:1px solid #e2e8f0;background:#f8fafc;border-bottom-left-radius:6px;border-bottom-right-radius:6px">${buttons}</div>`;
}
