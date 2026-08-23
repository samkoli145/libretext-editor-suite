/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: generate-inventory.ts
 * 📂 المسار: scripts/generate-inventory.ts
 * 🎯 الهدف الرئيسي: توليد جرد المكونات والأدوات لكل محرر (Writer/Calc/Impress/Base)
 * 📋 المعايير: تحليل الملفات المصدرية من النسخة الاحتياطية + الملفات الحالية
 * 🧪 الاختبارات: تشغيل مباشر عبر `tsx scripts/generate-inventory.ts`
 * 🏷️ المعرف: INFRA-015
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Editor Component Inventory Generator — جرد تلقائي لكل محرر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = '/home/sam2/Projects/T&R&A&S&H/0000000000000';

interface InventoryEntry {
  file: string;
  lines: number;
  description: string;
  hasUI: boolean;
  integrated: boolean;
}

interface EditorInventory {
  name: string;
  nameAr: string;
  engines: InventoryEntry[];
  components: InventoryEntry[];
  tools: InventoryEntry[];
  totalFiles: number;
  integratedCount: number;
}

function getFileLines(filePath: string): number {
  try {
    return fs.readFileSync(filePath, 'utf-8').split('\n').length;
  } catch {
    return 0;
  }
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function buildEntry(
  backupPath: string,
  localPath: string,
  desc: string,
  hasUI: boolean,
): InventoryEntry {
  const fullPath = path.join(BACKUP_DIR, backupPath);
  return {
    file: backupPath,
    lines: getFileLines(fullPath),
    description: desc,
    hasUI,
    integrated: fileExists(path.join(ROOT_DIR, localPath)),
  };
}

function generateInventoryMd(inventories: EditorInventory[]): string {
  const now = new Date().toISOString().split('T')[0];
  let md = `# 📋 جرد المكونات والأدوات لكل محرر\n\n`;
  md += `# Editor Component & Tool Inventory\n\n`;
  md += `> **تاريخ آخر تحديث:** ${now}\n`;
  md += `> **عدد المحررات:** ${inventories.length}\n\n`;
  md += `---\n\n`;

  for (const editor of inventories) {
    md += `## ${editor.nameAr} (${editor.name})\n\n`;
    md += `- **إجمالي الملفات:** ${editor.totalFiles}\n`;
    md += `- **المدمج:** ${editor.integratedCount}\n`;
    md += `- **المتبقي:** ${editor.totalFiles - editor.integratedCount}\n\n`;

    if (editor.engines.length > 0) {
      md += `### المحركات (Engines)\n\n`;
      md += `| # | الملف | الأسطر | الوصف | UI؟ | مدمج؟ |\n`;
      md += `|---|-------|--------|-------|-----|-------|\n`;
      editor.engines.forEach((e, i) => {
        md += `| ${i + 1} | \`${e.file}\` | ${e.lines} | ${e.description} | ${e.hasUI ? '⚠️' : '✅'} | ${e.integrated ? '✅' : '❌'} |\n`;
      });
      md += `\n`;
    }

    if (editor.components.length > 0) {
      md += `### المكونات (Components)\n\n`;
      md += `| # | الملف | الأسطر | الوصف | UI؟ | مدمج؟ |\n`;
      md += `|---|-------|--------|-------|-----|-------|\n`;
      editor.components.forEach((c, i) => {
        md += `| ${i + 1} | \`${c.file}\` | ${c.lines} | ${c.description} | ${c.hasUI ? '⚠️' : '✅'} | ${c.integrated ? '✅' : '❌'} |\n`;
      });
      md += `\n`;
    }

    if (editor.tools.length > 0) {
      md += `### الأدوات (Tools)\n\n`;
      md += `| # | الملف | الأسطر | الوصف | UI؟ | مدمج؟ |\n`;
      md += `|---|-------|--------|-------|-----|-------|\n`;
      editor.tools.forEach((t, i) => {
        md += `| ${i + 1} | \`${t.file}\` | ${t.lines} | ${t.description} | ${t.hasUI ? '⚠️' : '✅'} | ${t.integrated ? '✅' : '❌'} |\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
  }

  // Summary table
  md += `## ملخص التكامل\n\n`;
  md += `| المحرر | الملفات | مدمج | متبقي | النسبة |\n`;
  md += `|--------|---------|------|-------|--------|\n`;
  for (const e of inventories) {
    const pct = e.totalFiles > 0 ? Math.round((e.integratedCount / e.totalFiles) * 100) : 0;
    md += `| ${e.nameAr} | ${e.totalFiles} | ${e.integratedCount} | ${e.totalFiles - e.integratedCount} | ${pct}% |\n`;
  }

  return md;
}

function main() {
  console.log('📋 [Inventory] Generating editor component inventory...\n');

  const writer: EditorInventory = {
    name: 'Writer',
    nameAr: '📝 المحرر النصي (Writer)',
    engines: [],
    components: [],
    tools: [],
    totalFiles: 0,
    integratedCount: 0,
  };

  writer.engines = [
    buildEntry(
      'core/engines/HtmlPipelineEngine.ts',
      'packages/core/src/engines/html-pipeline.ts',
      'محرك HTML Pipeline',
      false,
    ),
    buildEntry(
      'core/engines/FileTypeDetectionEngine.ts',
      'packages/core/src/engines/file-type-detection.ts',
      'التعرف على أنواع الملفات',
      false,
    ),
    buildEntry(
      'core/engines/UnifiedIngestionPipeline.ts',
      'packages/core/src/engines/unified-ingestion.ts',
      'خط الاستيراد الموحد',
      false,
    ),
    buildEntry(
      'core/engines/ImagePipelineEngine.ts',
      'packages/core/src/engines/image-pipeline.ts',
      'محرك الصور',
      false,
    ),
    buildEntry(
      'shared/engines/ValidationEngine.ts',
      'packages/core/src/engines/validation.ts',
      'محرك الفحص والتعقيم',
      false,
    ),
    buildEntry(
      'shared/engines/MarkdownEngine.ts',
      'packages/algorithms/src/formula/markdown-engine.ts',
      'محرك Markdown',
      false,
    ),
    buildEntry(
      'shared/engines/LaTeXEngine.ts',
      'packages/algorithms/src/formula/latex-engine.ts',
      'محرك LaTeX',
      false,
    ),
  ];

  writer.tools = [
    buildEntry(
      'shared/converters/UniversalFormatConverter.ts',
      'packages/core/src/converters/universal-format-converter.ts',
      'محول التنسيقات الشامل',
      false,
    ),
    buildEntry('core/types.ts', 'packages/core/src/types.ts', 'أنواع المستندات', false),
  ];

  const calc: EditorInventory = {
    name: 'Calc',
    nameAr: '📊 جدول البيانات (Calc)',
    engines: [],
    components: [],
    tools: [],
    totalFiles: 0,
    integratedCount: 0,
  };

  calc.engines = [
    buildEntry('shared/engines/DiagramEngine.ts', '', 'محرك المخططات البيانية', false),
    buildEntry('shared/engines/MindMapEngine.ts', '', 'محرك الخرائط المفهومية', true),
  ];

  const impress: EditorInventory = {
    name: 'Impress',
    nameAr: '🎨 العرض التقديمي (Impress)',
    engines: [],
    components: [],
    tools: [],
    totalFiles: 0,
    integratedCount: 0,
  };

  impress.engines = [
    buildEntry('shared/vector-engine/snap.ts', '', 'محرك التسنين المتعدد', false),
    buildEntry('shared/vector-engine/ref_line.ts', '', 'خطوط الإرشاد الديناميكية', false),
    buildEntry('shared/vector-engine/control_handle_manager.ts', '', 'مدير مقابض التحكم', false),
    buildEntry('shared/vector-engine/AutoLayoutEngine.ts', '', 'محرك التخطيط التلقائي', false),
    buildEntry(
      'shared/vector-engine/common.ts',
      'packages/algorithms/src/vector/common.ts',
      'أدوات هندسية مشتركة',
      false,
    ),
    buildEntry(
      'canvas/engine/CoordinateSystem.ts',
      'packages/algorithms/src/vector/coordinate-system.ts',
      'نظام الإحداثيات',
      false,
    ),
    buildEntry(
      'canvas/engine/MouseAlgorithms.ts',
      'packages/algorithms/src/vector/mouse-algorithms.ts',
      'خوارزميات الفأرة',
      false,
    ),
    buildEntry(
      'canvas/engine/SmartAlignment.ts',
      'packages/algorithms/src/vector/smart-alignment.ts',
      'المحاذاة الذكية',
      false,
    ),
  ];

  const base: EditorInventory = {
    name: 'Base',
    nameAr: '🗄️ قاعدة البيانات (Base)',
    engines: [],
    components: [],
    tools: [],
    totalFiles: 0,
    integratedCount: 0,
  };

  base.tools = [
    buildEntry('shared/engines/ComponentRegistry.ts', '', 'سجل المكونات', true),
    buildEntry('shared/engines/ToolRegistry.ts', '', 'سجل الأدوات', true),
  ];

  for (const editor of [writer, calc, impress, base]) {
    editor.totalFiles = editor.engines.length + editor.components.length + editor.tools.length;
    editor.integratedCount = [...editor.engines, ...editor.components, ...editor.tools].filter(
      (e) => e.integrated,
    ).length;
  }

  const inventories = [writer, calc, impress, base];
  const md = generateInventoryMd(inventories);

  const outPath = path.join(ROOT_DIR, 'EDITOR_INVENTORY.md');
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log(`✅ EDITOR_INVENTORY.md written (${md.split('\n').length} lines)`);

  for (const e of inventories) {
    const pct = e.totalFiles > 0 ? Math.round((e.integratedCount / e.totalFiles) * 100) : 0;
    console.log(`  ${e.nameAr}: ${e.integratedCount}/${e.totalFiles} (${pct}%)`);
  }
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { main as runInventoryGenerator };
