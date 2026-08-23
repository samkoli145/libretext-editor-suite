/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: generate-block.ts
 * 📂 Path: scripts/generate-block.ts
 * 🎯 Main Goal: CLI to scaffold a new block (source, styles, registry, test)
 * 📋 Criteria: --name, --domain, --traits, --dry-run
 * 🧪 Tests: Run via `pnpm generate:block`
 * 🏷️ ID: INFRA-020
 * 📅 Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern: Multi-file Coordinated Scaffolding
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

interface BlockOptions {
  name: string;
  domain: 'Writer' | 'Calc' | 'Impress' | 'Base' | 'Universal';
  traits: string[];
  dryRun: boolean;
}

function parseArgs(): BlockOptions {
  const args = process.argv.slice(2);
  let name = 'CustomBlock';
  let domain: BlockOptions['domain'] = 'Writer';
  let traits = ['Editable', 'FormattingSupport'];
  let dryRun = false;
  for (const a of args) {
    if (a.startsWith('--name=')) name = a.slice(7).trim();
    else if (a.startsWith('--domain=')) {
      const d = a.slice(9).trim();
      if (['Writer', 'Calc', 'Impress', 'Base', 'Universal'].includes(d))
        domain = d as BlockOptions['domain'];
    } else if (a.startsWith('--traits='))
      traits = a
        .slice(9)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    else if (a === '--dry-run') dryRun = true;
  }
  return { name, domain, traits, dryRun };
}

function toKebab(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
function toPascal(s: string): string {
  return s.replace(/(?:^|[-_])(\w)/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/\s+/g, '');
}

function genSource(opts: BlockOptions, kebab: string, pascal: string, date: string): string {
  return `/**
 * File: ${kebab}.ts | ID: CORE-BLK-${pascal.toUpperCase()}
 * Created: ${date} | Domain: ${opts.domain}
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

export interface ${pascal}Data {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly styles?: Record<string, string>;
  readonly metadata?: Record<string, unknown>;
}

export interface ${pascal}Block {
  readonly id: string;
  readonly type: '${kebab}';
  readonly domain: '${opts.domain}';
  readonly data: ${pascal}Data;
}

export const ${pascal}DefaultTraits = [${opts.traits.map((t) => `'${t}'`).join(', ')}] as const;

export function create${pascal}Block(id: string, data: Partial<${pascal}Data> = {}): ${pascal}Block {
  return {
    id,
    type: '${kebab}',
    domain: '${opts.domain}',
    data: { id, title: data.title || '', content: data.content || '', styles: data.styles || {}, metadata: data.metadata || {} },
  };
}
`;
}

function genStyles(pascal: string, kebab: string, date: string): string {
  return `/**
 * File: ${kebab}.styles.ts | ID: CORE-STYLE-${pascal.toUpperCase()}
 * Created: ${date} | Pure Light Theme only
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

export const ${pascal}DefaultStyles: Readonly<Record<string, string>> = Object.freeze({
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: '1px',
  borderRadius: '12px',
  color: '#0f172a',
  padding: '16px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  fontSize: '14px',
  lineHeight: '1.6',
});
`;
}

function genRegistry(opts: BlockOptions, pascal: string, kebab: string, date: string): string {
  return `/**
 * File: ${kebab}.registry.ts | ID: CORE-REG-${pascal.toUpperCase()}
 * Created: ${date}
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

export const ${pascal}RegistryEntry = {
  id: '${kebab}',
  name: '${pascal}',
  domain: '${opts.domain}',
  traits: [${opts.traits.map((t) => `'${t}'`).join(', ')}],
  hasContextMenu: true,
  hasFloatingGizmo: true,
  createdAt: '${date}',
} as const;
`;
}

function genTest(opts: BlockOptions, pascal: string, kebab: string, date: string): string {
  return `/**
 * File: ${kebab}.test.ts | ID: TEST-BLK-${pascal.toUpperCase()}
 * Created: ${date}
 * Owner: Hossam El-Din Abdel-Moaty El-Khouly - MIT License
 */

import { describe, it, expect } from 'vitest';
import { create${pascal}Block } from '../../src/blocks/${kebab}';

describe('${pascal} Block', () => {
  it('creates block with valid schema', () => {
    const block = create${pascal}Block('test-1', { title: 'test' });
    expect(block.id).toBe('test-1');
    expect(block.type).toBe('${kebab}');
    expect(block.domain).toBe('${opts.domain}');
    expect(block.data.title).toBe('test');
  });
});
`;
}

export function runGenerateBlock(): void {
  const opts = parseArgs();
  const kebab = toKebab(opts.name);
  const pascal = toPascal(opts.name);
  const date = new Date().toISOString().split('T')[0] || '2026-08-21';
  const blocksDir = path.resolve(process.cwd(), 'packages/core/src/blocks');
  const testsDir = path.resolve(process.cwd(), 'packages/core/tests/blocks');

  if (opts.dryRun) {
    console.log(`[DRY RUN] Would create:`);
    console.log(`  ${blocksDir}/${kebab}.ts`);
    console.log(`  ${blocksDir}/${kebab}.styles.ts`);
    console.log(`  ${blocksDir}/${kebab}.registry.ts`);
    console.log(`  ${testsDir}/${kebab}.test.ts`);
    return;
  }

  for (const d of [blocksDir, testsDir]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  fs.writeFileSync(
    path.join(blocksDir, `${kebab}.ts`),
    genSource(opts, kebab, pascal, date),
    'utf-8',
  );
  fs.writeFileSync(
    path.join(blocksDir, `${kebab}.styles.ts`),
    genStyles(pascal, kebab, date),
    'utf-8',
  );
  fs.writeFileSync(
    path.join(blocksDir, `${kebab}.registry.ts`),
    genRegistry(opts, pascal, kebab, date),
    'utf-8',
  );
  fs.writeFileSync(
    path.join(testsDir, `${kebab}.test.ts`),
    genTest(opts, pascal, kebab, date),
    'utf-8',
  );

  console.log(`[generate:block] Created 4 files for "${opts.name}" (${opts.domain}):`);
  console.log(`  Source:   ${blocksDir}/${kebab}.ts`);
  console.log(`  Styles:   ${blocksDir}/${kebab}.styles.ts`);
  console.log(`  Registry: ${blocksDir}/${kebab}.registry.ts`);
  console.log(`  Test:     ${testsDir}/${kebab}.test.ts`);
}

if (import.meta.url === `file://${process.argv[1]}`) runGenerateBlock();
