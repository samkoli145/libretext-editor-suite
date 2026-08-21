/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: atomic-inventory.ts
 * 📂 Path: scripts/atomic-inventory.ts
 * 🎯 Main Goal: Atomic tagging of every file in the main project
 * 📋 Criteria: Detect duplicates, unused files, large files, gaps
 * 🧪 Tests: Run via `pnpm inventory:atomic`
 * 🏷️ ID: INFRA-016
 * 📅 Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern: Atomic Inventory + Dedup + Gap Analysis
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const ROOT = process.cwd();
const PACKAGES_DIR = path.join(ROOT, 'packages');

interface AtomicTag {
  id: string;
  pkg: string;
  sub: string;
  file: string;
  lines: number;
  hash: string;
  status: 'active' | 'duplicate' | 'unused' | 'oversized' | 'theory';
  priority: 'high' | 'medium' | 'low';
  duplicateOf?: string;
  note?: string;
}

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function getLineCount(filePath: string): number {
  return fs.readFileSync(filePath, 'utf-8').split('\n').length;
}

function getAllSourceFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) continue;
      if (entry.name.includes('.test.') || entry.name.includes('.spec.')) continue;
      if (entry.name === 'vite.config.ts' || entry.name === 'vitest.config.ts') continue;
      files.push(full);
    }
  };
  walk(PACKAGES_DIR);
  return files;
}

function isImported(filePath: string, allFiles: string[]): boolean {
  const basename = path.basename(filePath, path.extname(filePath));
  const relFromSrc = path.relative(path.join(path.dirname(filePath), '..'), filePath).replace(/\.(ts|tsx)$/, '');

  if (basename === 'index') return true;

  for (const f of allFiles) {
    if (f === filePath) continue;
    const content = fs.readFileSync(f, 'utf-8');
    // Check direct import by basename
    if (content.includes(`'./${basename}'`) || content.includes(`"./${basename}"`)) return true;
    // Check relative path import
    if (relFromSrc && content.includes(`'${relFromSrc}'`) || content.includes(`"${relFromSrc}"`)) return true;
    // Check if re-exported in index.ts
    if (f.endsWith('index.ts') && content.includes(basename)) return true;
  }
  return false;
}

function buildTags(): AtomicTag[] {
  const files = getAllSourceFiles();
  const hashMap = new Map<string, string[]>();
  const tags: AtomicTag[] = [];

  // Phase 1: Hash all files
  for (const filePath of files) {
    const hash = getFileHash(filePath);
    const existing = hashMap.get(hash) || [];
    existing.push(filePath);
    hashMap.set(hash, existing);
  }

  // Phase 2: Build tags
  for (const filePath of files) {
    const rel = path.relative(PACKAGES_DIR, filePath);
    const parts = rel.split(path.sep);
    const pkg = parts[0];
    const sub = parts.slice(1, -1).join('/');
    const file = parts[parts.length - 1];
    const hash = getFileHash(filePath);
    const lines = getLineCount(filePath);
    const imported = isImported(filePath, files);

    let status: AtomicTag['status'] = 'active';
    let priority: AtomicTag['priority'] = 'medium';
    let duplicateOf: string | undefined;
    let note: string | undefined;

    // Check duplicate
    const sameHash = hashMap.get(hash) || [];
    if (sameHash.length > 1) {
      status = 'duplicate';
      priority = 'high';
      duplicateOf = sameHash.find(f => f !== filePath);
      note = `Exact duplicate of ${path.relative(ROOT, duplicateOf || '')}`;
    }
    // Check unused
    else if (!imported) {
      status = 'unused';
      priority = 'low';
      note = 'Never imported by any other file';
    }
    // Check oversized
    else if (lines > 400) {
      status = 'oversized';
      priority = 'high';
      note = `${lines} lines — needs splitting (50 lines/function max)`;
    }

    tags.push({
      id: `${(pkg || 'UNK').toUpperCase()}-${(sub || '').replace(/\//g, '-').toUpperCase() || 'ROOT'}-${(file || 'unknown').replace(/\.(ts|tsx)$/, '').toUpperCase()}`,
      pkg: pkg || '', sub: sub || '', file: file || '', lines, hash, status, priority, duplicateOf, note,
    });
  }

  return tags;
}

function generateReport(tags: AtomicTag[]): string {
  const now = new Date().toISOString().split('T')[0];
  const active = tags.filter(t => t.status === 'active');
  const duplicates = tags.filter(t => t.status === 'duplicate');
  const unused = tags.filter(t => t.status === 'unused');
  const oversized = tags.filter(t => t.status === 'oversized');

  let md = `# 🏷️ Atomic Inventory — جرد ذري شامل\n\n`;
  md += `> **تاريخ آخر تحديث:** ${now}\n`;
  md += `> **إجمالي الملفات:** ${tags.length}\n`;
  md += `> **نشط:** ${active.length} | **مكرر:** ${duplicates.length} | **غير مستخدم:** ${unused.length} | **كبير:** ${oversized.length}\n\n`;
  md += `---\n\n`;

  if (duplicates.length > 0) {
    md += `## 🔴 المكرر (Duplicates) — ${duplicates.length} ملف\n\n`;
    md += `| الملف | الأسطر | مكرر من |\n|-------|--------|--------|\n`;
    for (const t of duplicates) {
      md += `| \`${t.pkg}/${t.sub}/${t.file}\` | ${t.lines} | \`${t.duplicateOf ? path.relative(PACKAGES_DIR, t.duplicateOf) : '?'}\` |\n`;
    }
    md += `\n`;
  }

  if (unused.length > 0) {
    md += `## 🟡 غير مستخدم (Unused) — ${unused.length} ملف\n\n`;
    md += `| الملف | الأسطر | السبب |\n|-------|--------|-------|\n`;
    for (const t of unused) {
      md += `| \`${t.pkg}/${t.sub}/${t.file}\` | ${t.lines} | ${t.note} |\n`;
    }
    md += `\n`;
  }

  if (oversized.length > 0) {
    md += `## 🟠 كبير (Oversized >400 lines) — ${oversized.length} ملف\n\n`;
    md += `| الملف | الأسطر | ملاحظة |\n|-------|--------|--------|\n`;
    for (const t of oversized) {
      md += `| \`${t.pkg}/${t.sub}/${t.file}\` | ${t.lines} | ${t.note} |\n`;
    }
    md += `\n`;
  }

  md += `## 🟢 نشط (Active) — ${active.length} ملف\n\n`;
  md += `| الملف | الأسطر | الأولوية |\n|-------|--------|----------|\n`;
  for (const t of active) {
    md += `| \`${t.pkg}/${t.sub}/${t.file}\` | ${t.lines} | ${t.priority} |\n`;
  }

  return md;
}

function generateJson(tags: AtomicTag[]): string {
  return JSON.stringify({
    generated: new Date().toISOString(),
    total: tags.length,
    summary: {
      active: tags.filter(t => t.status === 'active').length,
      duplicate: tags.filter(t => t.status === 'duplicate').length,
      unused: tags.filter(t => t.status === 'unused').length,
      oversized: tags.filter(t => t.status === 'oversized').length,
    },
    tags,
  }, null, 2);
}

function main() {
  console.log('🏷️  [AtomicInventory] Scanning all source files...\n');
  const tags = buildTags();

  const report = generateReport(tags);
  fs.writeFileSync(path.join(ROOT, 'ATOMIC_INVENTORY.md'), report, 'utf-8');
  console.log(`✅ ATOMIC_INVENTORY.md written (${report.split('\n').length} lines)`);

  const json = generateJson(tags);
  fs.writeFileSync(path.join(ROOT, 'ATOMIC_INVENTORY.json'), json, 'utf-8');
  console.log(`✅ ATOMIC_INVENTORY.json written`);

  const active = tags.filter(t => t.status === 'active').length;
  const dup = tags.filter(t => t.status === 'duplicate').length;
  const unused = tags.filter(t => t.status === 'unused').length;
  const big = tags.filter(t => t.status === 'oversized').length;
  console.log(`\n📊 Summary: ${tags.length} total | ${active} active | ${dup} duplicates | ${unused} unused | ${big} oversized`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
