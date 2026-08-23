/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: update-indexes.ts
 * 📂 Path: scripts/update-indexes.ts
 * 🎯 Main Goal: Comprehensive auto-indexing + Generation FUNCTION_INDEX.md + Update SystemInventory.json
 * 📋 Criteria: Scan all files (packages source), Extract functions/classes/types
 * 🧪 Tests: Run directly via `pnpm update:indexes`
 * 🏷️ ID: INFRA-014
 * 📅 Created: 2026-08-21 (Comprehensive improvement)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern | Innovative Pattern:
 *    Automated Codebase Indexer + FUNCTION_INDEX.md Generator + JSON Sync
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

interface CodeSymbol {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'constant' | 'enum';
  file: string;
  line: number;
  params?: string;
  description?: string;
}

interface PackageInfo {
  name: string;
  path: string;
  symbols: CodeSymbol[];
  fileCount: number;
  totalLines: number;
}

const SKIP_DIRS = ['node_modules', 'dist', '.git', '.cache', 'coverage', '__tests__'];
const ROOT_DIR = process.cwd();
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) &&
      !fullPath.endsWith('.test.ts')
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function extractSymbols(filePath: string): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(ROOT_DIR, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    // Functions
    const fnMatch = line.match(/^export\s+(?:async\s+)?function\s+(\w+)/);
    if (fnMatch) {
      const params = line.match(/\(([^)]*)\)/)?.[1]?.substring(0, 60) || '';
      symbols.push({
        name: fnMatch[1]!,
        type: 'function',
        file: relativePath,
        line: i + 1,
        params,
      });
      continue;
    }

    // Classes
    const classMatch = line.match(/^export\s+class\s+(\w+)/);
    if (classMatch) {
      symbols.push({ name: classMatch[1]!, type: 'class', file: relativePath, line: i + 1 });
      continue;
    }

    // Interfaces
    const intMatch = line.match(/^export\s+interface\s+(\w+)/);
    if (intMatch) {
      symbols.push({ name: intMatch[1]!, type: 'interface', file: relativePath, line: i + 1 });
      continue;
    }

    // Types
    const typeMatch = line.match(/^export\s+type\s+(\w+)/);
    if (typeMatch) {
      symbols.push({ name: typeMatch[1]!, type: 'type', file: relativePath, line: i + 1 });
      continue;
    }

    // Constants
    const constMatch = line.match(/^export\s+const\s+(\w+)/);
    if (constMatch) {
      symbols.push({ name: constMatch[1]!, type: 'constant', file: relativePath, line: i + 1 });
      continue;
    }

    // Enums
    const enumMatch = line.match(/^export\s+enum\s+(\w+)/);
    if (enumMatch) {
      symbols.push({ name: enumMatch[1]!, type: 'enum', file: relativePath, line: i + 1 });
    }
  }
  return symbols;
}

function getPackageNameFromPath(filePath: string): string {
  const parts = filePath.split(path.sep);
  const pkgIdx = parts.indexOf('packages');
  if (pkgIdx >= 0 && parts[pkgIdx + 1]) return parts[pkgIdx + 1]!;
  return 'unknown';
}

function generateFunctionIndexMd(packages: PackageInfo[]): string {
  const now = new Date().toISOString().split('T')[0];
  let totalSymbols = 0;
  for (const pkg of packages) totalSymbols += pkg.symbols.length;

  let md = `# 📇 فهرس Functions & Algorithms الشامل\n\n`;
  md += `# Comprehensive Function & Algorithm Index\n\n`;
  md += `> **تاريخ آخر Update:** ${now}\n`;
  md += `> **عدد الحزم:** ${packages.length}\n`;
  md += `> **Total العناصر المفهرسة:** ${totalSymbols} عنصر\n\n`;
  md += `---\n\n`;

  for (const pkg of packages) {
    if (pkg.symbols.length === 0) continue;
    md += `## 📦 packages/${pkg.name}\n\n`;

    // Group by file
    const byFile = new Map<string, CodeSymbol[]>();
    for (const sym of pkg.symbols) {
      const fileName = path.basename(sym.file);
      if (!byFile.has(fileName)) byFile.set(fileName, []);
      byFile.get(fileName)!.push(sym);
    }

    for (const [fileName, syms] of byFile) {
      md += `### 📁 ${fileName}\n\n`;
      md += `| # | الاسم | الType | File:سطر | Parameters |\n`;
      md += `|---|-------|-------|-----------|----------|\n`;

      syms.forEach((sym, idx) => {
        const typeEmoji =
          { function: '⚙️', class: '🏗️', interface: '📐', type: '🏷️', constant: '📌', enum: '📋' }[
            sym.type
          ] || '';
        md += `| ${idx + 1}/${syms.length} | \`${sym.name}\` | ${typeEmoji} ${sym.type} | \`${path.basename(sym.file)}:${sym.line}\` | \`${sym.params || '—'}\` |\n`;
      });
      md += `\n`;
    }
    md += `---\n\n`;
  }

  return md;
}

function updateSystemInventory(packages: PackageInfo[]): void {
  const inventoryPath = path.join(ROOT_DIR, 'SystemInventory.json');
  if (!fs.existsSync(inventoryPath)) {
    console.warn('⚠️ SystemInventory.json not found — skipping.');
    return;
  }

  try {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

    let totalFunctions = 0,
      totalClasses = 0,
      totalInterfaces = 0,
      totalTypes = 0,
      totalConstants = 0;
    for (const pkg of packages) {
      for (const sym of pkg.symbols) {
        if (sym.type === 'function') totalFunctions++;
        else if (sym.type === 'class') totalClasses++;
        else if (sym.type === 'interface') totalInterfaces++;
        else if (sym.type === 'type' || sym.type === 'enum') totalTypes++;
        else if (sym.type === 'constant') totalConstants++;
      }
    }

    inventory.statistics = {
      totalFiles: packages.reduce((a, p) => a + p.fileCount, 0),
      totalLines: packages.reduce((a, p) => a + p.totalLines, 0),
      totalFunctions,
      totalClasses,
      totalInterfaces,
      totalTypes,
      totalConstants,
      totalPackages: packages.length,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2), 'utf-8');
    console.log('✅ SystemInventory.json updated.');
  } catch (err) {
    console.warn('⚠️ Could not update SystemInventory.json:', err);
  }
}

function main() {
  console.log('🔄 [IndexUpdater] Starting comprehensive codebase indexing...\n');

  const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((d) => {
    const p = path.join(PACKAGES_DIR, d);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'src'));
  });

  const packages: PackageInfo[] = [];

  for (const pkgName of packageDirs) {
    const srcDir = path.join(PACKAGES_DIR, pkgName, 'src');
    const files = scanDirectory(srcDir);
    const allSymbols: CodeSymbol[] = [];
    let totalLines = 0;

    for (const file of files) {
      const symbols = extractSymbols(file);
      allSymbols.push(...symbols);
      totalLines += fs.readFileSync(file, 'utf-8').split('\n').length;
    }

    packages.push({
      name: pkgName,
      path: `packages/${pkgName}`,
      symbols: allSymbols,
      fileCount: files.length,
      totalLines,
    });

    console.log(
      `  📦 ${pkgName}: ${allSymbols.length} symbols in ${files.length} files (${totalLines} lines)`,
    );
  }

  // Generate FUNCTION_INDEX.md
  console.log('\n📝 Generating FUNCTION_INDEX.md...');
  const functionIndexMd = generateFunctionIndexMd(packages);
  const functionIndexPath = path.join(ROOT_DIR, 'FUNCTION_INDEX.md');
  fs.writeFileSync(functionIndexPath, functionIndexMd, 'utf-8');
  console.log(`✅ FUNCTION_INDEX.md written (${functionIndexMd.split('\n').length} lines)`);

  // Update SystemInventory.json
  console.log('\n📊 Updating SystemInventory.json...');
  updateSystemInventory(packages);

  // Summary
  let total = 0;
  for (const pkg of packages) total += pkg.symbols.length;
  console.log(`\n✨ Done! ${packages.length} packages, ${total} symbols indexed.`);
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { main as runIndexUpdater, scanDirectory, extractSymbols };
