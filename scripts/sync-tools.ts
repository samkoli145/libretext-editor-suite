/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: sync-tools.ts
 * 📂 Path: scripts/sync-tools.ts
 * 🎯 Main Goal: Audit block tools vs canonical registry, generate TOOLS_AUDIT_REPORT.md
 * 📋 Criteria: Cross-domain tool reconciliation + visual matrix
 * 🧪 Tests: Run via `pnpm sync:tools`
 * 🏷️ ID: INFRA-023
 * 📅 Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern: Cross-Domain Tool Registry Reconciliation
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

const BLOCKS_DATA = [
  { id: 'paragraph', name: 'Paragraph', domain: 'Writer', category: 'Text', tools: ['Bold', 'Italic', 'Underline', 'Color', 'Align', 'Indent'] },
  { id: 'heading', name: 'Heading H1-H6', domain: 'Writer', category: 'Text', tools: ['HeadingLevel', 'AutoNumber', 'Anchor'] },
  { id: 'table', name: 'Table', domain: 'Universal', category: 'Data', tools: ['InsertRow', 'InsertCol', 'DeleteRow', 'DeleteCol', 'MergeCells', 'SplitCell'] },
  { id: 'cell', name: 'Calc Cell', domain: 'Calc', category: 'Data', tools: ['FormulaEditor', 'NumberFormat', 'ConditionalFormat', 'TextWrap'] },
  { id: 'shape', name: 'Vector Shape', domain: 'Impress', category: 'Visual', tools: ['ResizeHandles', 'RotateHandle', 'FillColor', 'Snap', 'AlignSmart'] },
  { id: 'slide', name: 'Slide', domain: 'Impress', category: 'Layout', tools: ['LayoutPicker', 'Background', 'PresenterNotes', 'Reorder', 'Transitions'] },
  { id: 'database_record', name: 'Record', domain: 'Base', category: 'Data', tools: ['RecordForm', 'FieldConfig', 'SortFilter', 'RelationLink'] },
  { id: 'math', name: 'Math LaTeX', domain: 'Universal', category: 'Plugin', tools: ['SymbolPalette', 'LaTeXEditor', 'DisplayMode'] },
  { id: 'mermaid', name: 'Mermaid', domain: 'Universal', category: 'Plugin', tools: ['DiagramEditor', 'TypeSelector', 'ExportSVG'] },
];

const CANONICAL_TOOLS: Record<string, string[]> = {
  TextFormatting: ['Bold', 'Italic', 'Underline', 'Color', 'Align', 'Indent', 'ClearFormat'],
  StructureAndHeading: ['HeadingLevel', 'AutoNumber', 'Anchor', 'CollapseExpand'],
  TableGrid: ['InsertRow', 'InsertCol', 'DeleteRow', 'DeleteCol', 'MergeCells', 'SplitCell', 'Sort'],
  CalcSpreadsheet: ['FormulaEditor', 'NumberFormat', 'ConditionalFormat', 'TextWrap', 'TracePrecedents'],
  SpatialTransform: ['ResizeHandles', 'RotateHandle', 'FillColor', 'Snap', 'AlignSmart', 'ZOrder'],
  SlidePresentation: ['LayoutPicker', 'Background', 'PresenterNotes', 'Reorder', 'Transitions'],
  DatabaseRecord: ['RecordForm', 'FieldConfig', 'SortFilter', 'RelationLink', 'ValidationRules'],
  PluginsAndAddons: ['SymbolPalette', 'LaTeXEditor', 'DisplayMode', 'DiagramEditor', 'TypeSelector', 'ExportSVG', 'Zoom'],
  ClipboardAndLifecycle: ['Cut', 'Copy', 'Paste', 'Duplicate', 'Delete'],
};

export function runSyncTools(): void {
  console.log('[sync:tools] Auditing block tools vs canonical registry...\n');

  const domainStats: Record<string, { blocks: number; tools: number; list: string[] }> = {};
  const allTools = new Set<string>();

  for (const b of BLOCKS_DATA) {
    const st = domainStats[b.domain];
    if (st) {
      st.blocks++;
      st.tools += b.tools.length;
      st.list.push(...b.tools);
    }
    b.tools.forEach(t => allTools.add(t));
  }

  console.log('Domain Distribution:');
  for (const [d, s] of Object.entries(domainStats)) {
    console.log(`  ${d.padEnd(10)}: ${s.blocks} blocks, ${s.tools} tools`);
  }

  const date = new Date().toISOString().split('T')[0];
  let md = `# Tools Audit Report\n\n> Date: ${date} | ID: INFRA-023\n\n`;
  md += `## Domain Distribution\n\n| Domain | Blocks | Tools | Sample Tools |\n|--------|--------|-------|-------------|\n`;
  for (const [d, s] of Object.entries(domainStats)) {
    md += `| **${d}** | ${s.blocks} | ${s.tools} | ${s.list.slice(0, 3).join(', ')}... |\n`;
  }
  md += `\n## Block Details\n\n| Block | Domain | Category | Tools |\n|-------|--------|----------|-------|\n`;
  for (const b of BLOCKS_DATA) {
    md += `| \`${b.id}\` | ${b.domain} | ${b.category} | ${b.tools.join(', ')} |\n`;
  }
  md += `\n## Canonical Tool Packages\n\n`;
  for (const [pkg, tools] of Object.entries(CANONICAL_TOOLS)) {
    md += `### ${pkg} (${tools.length})\n`;
    tools.forEach(t => { md += `- ${allTools.has(t) ? '[USED]' : '[AVAIL]'} ${t}\n`; });
    md += `\n`;
  }
  md += `## Recommendations\n\n`;
  md += `1. Use ComposableTraitsEngine for new blocks to auto-generate context menus\n`;
  md += `2. Enable ClipboardAndLifecycle for all blocks without exception\n`;
  md += `3. Add CollapseExpand for headings and TracePrecedents for cells in next update\n`;

  fs.writeFileSync(path.resolve(process.cwd(), 'TOOLS_AUDIT_REPORT.md'), md, 'utf-8');
  console.log(`\nTOOLS_AUDIT_REPORT.md written`);
  console.log('[sync:tools] Done');
}

import.meta.url === `file://${process.argv[1]}` && runSyncTools();
