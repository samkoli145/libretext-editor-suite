/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: scaffold-block.ts
 * 📂 Path: scripts/scaffold-block.ts
 * 🎯 Main Goal: Block & Tool Scaffolder CLI — generates block code + test
 * 📋 Criteria: --name, --domain, --traits, --dry-run
 * 🧪 Tests: Run via `pnpm scaffold:block`
 * 🏷️ ID: INFRA-021
 * 📅 Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern: Composable Block Scaffolding Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

interface ScaffoldOpts {
  name: string;
  domain: 'Writer' | 'Calc' | 'Impress' | 'Base';
  traits: string[];
  dryRun: boolean;
}

function parseArgs(): ScaffoldOpts {
  const args = process.argv.slice(2);
  let name = 'CustomBlock';
  let domain: ScaffoldOpts['domain'] = 'Writer';
  let traits = ['TextFormatting'];
  let dryRun = false;
  for (const a of args) {
    if (a.startsWith('--name=')) name = a.slice(7).trim();
    else if (a.startsWith('--domain=')) { const d = a.slice(9).trim(); if (['Writer','Calc','Impress','Base'].includes(d)) domain = d as ScaffoldOpts['domain']; }
    else if (a.startsWith('--traits=')) traits = a.slice(9).split(',').map(t => t.trim()).filter(Boolean);
    else if (a === '--dry-run') dryRun = true;
  }
  return { name, domain, traits, dryRun };
}

function toKebab(s: string): string { return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase(); }
function toPascal(s: string): string { return s.replace(/(?:^|[-_])(\w)/g, (_, c) => c ? c.toUpperCase() : '').replace(/\s+/g, ''); }

function genBlockCode(opts: ScaffoldOpts, kebab: string, pascal: string, date: string): string {
  return `/**
 * File: ${kebab}-block.ts | ID: CORE-BLK-${pascal.toUpperCase()}
 * Created: ${date} | Domain: ${opts.domain}
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

export interface ${pascal}Data {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface ${pascal}Node {
  readonly id: string;
  readonly type: '${kebab}';
  readonly data: ${pascal}Data;
}

export function create${pascal}Node(id: string, data: Partial<${pascal}Data> = {}): ${pascal}Node {
  return { id, type: '${kebab}', data: { id, title: data.title || '', content: data.content || '', metadata: data.metadata || {} } };
}
`;
}

function genTestCode(opts: ScaffoldOpts, kebab: string, pascal: string, date: string): string {
  return `/**
 * File: ${kebab}-block.test.ts | ID: TEST-BLK-${pascal.toUpperCase()}
 * Created: ${date}
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

import { describe, it, expect } from 'vitest';
import { create${pascal}Node } from '../../src/blocks/${kebab}-block';

describe('${pascal} Block', () => {
  it('creates node with valid schema', () => {
    const node = create${pascal}Node('n1', { title: 'test' });
    expect(node.id).toBe('n1');
    expect(node.type).toBe('${kebab}');
    expect(node.data.title).toBe('test');
  });
});
`;
}

export function runScaffolder(): void {
  const opts = parseArgs();
  const kebab = toKebab(opts.name);
  const pascal = toPascal(opts.name);
  const date = new Date().toISOString().split('T')[0] || '2026-08-21';
  const blocksDir = path.resolve(process.cwd(), 'packages/core/src/blocks');
  const testsDir = path.resolve(process.cwd(), 'packages/core/tests/blocks');

  if (opts.dryRun) {
    console.log(`[DRY RUN] Would create:`);
    console.log(`  ${blocksDir}/${kebab}-block.ts`);
    console.log(`  ${testsDir}/${kebab}-block.test.ts`);
    return;
  }

  for (const d of [blocksDir, testsDir]) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

  fs.writeFileSync(path.join(blocksDir, `${kebab}-block.ts`), genBlockCode(opts, kebab, pascal, date), 'utf-8');
  fs.writeFileSync(path.join(testsDir, `${kebab}-block.test.ts`), genTestCode(opts, kebab, pascal, date), 'utf-8');

  console.log(`[scaffold:block] Created 2 files for "${opts.name}" (${opts.domain}):`);
  console.log(`  Block: ${blocksDir}/${kebab}-block.ts`);
  console.log(`  Test:  ${testsDir}/${kebab}-block.test.ts`);
  console.log(`  Traits: ${opts.traits.join(', ')}`);
}

import.meta.url === `file://${process.argv[1]}` && runScaffolder();
