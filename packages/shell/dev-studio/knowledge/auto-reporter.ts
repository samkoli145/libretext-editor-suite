/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: auto-reporter.ts
 * 🎯 الهدف: تقرير تلقائي — يكتب JOURNAL.md و CHANGELOG.md بعد كل مهمة
 * 🏛️ الدور: كاتب التقارير الذكي الذي يوفر ساعات التوثيق اليدوي
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { SessionEntry } from './project-memory';

function appendToFile(filePath: string, content: string): void {
  if (!fs.existsSync(filePath)) return;
  fs.appendFileSync(filePath, '\n' + content, 'utf-8');
}

function prependToFile(filePath: string, marker: string, content: string): void {
  if (!fs.existsSync(filePath)) return;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const idx = fileContent.indexOf(marker);
  if (idx === -1) return;
  const newContent = fileContent.slice(0, idx) + content + '\n' + fileContent.slice(idx);
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

export function generateJournalEntry(
  projectRoot: string,
  session: SessionEntry,
  lessons: string[]
): string {
  const lines = [
    `---`,
    ``,
    `## ${session.date} (DevStudio Auto-Report)`,
    ``,
    `### ${session.title}`,
    ``,
    `#### المهام المنجزة`,
    ...session.tasks.map(t => `- ${t}`),
    ``,
    `#### الإحصائيات`,
    `| المؤشر | قبل | بعد | التغيير |`,
    `|--------|------|------|---------|`,
    `| ملفات مصدر | - | ${session.filesModified} | ${session.filesAdded > 0 ? '+' + session.filesAdded : session.filesAdded} |`,
    `| اختبارات ناجحة | ${session.testsBefore} | ${session.testsAfter} | ${session.testsAfter - session.testsBefore >= 0 ? '+' : ''}${session.testsAfter - session.testsBefore} |`,
    `| أخطاء TypeScript | ${session.errorsBefore} | ${session.errorsAfter} | ${session.errorsAfter - session.errorsBefore} |`,
  ];

  if (session.commitHash) {
    lines.push('', `#### Git`, `\`${session.commitHash}\``);
  }

  if (lessons.length > 0) {
    lines.push('', `#### الدروس المستفادة`, ...lessons.map(l => `1. ${l}`));
  }

  const entry = lines.join('\n');
  const journalPath = path.join(projectRoot, 'JOURNAL.md');
  appendToFile(journalPath, entry);

  return entry;
}

export function generateChangelogEntry(
  projectRoot: string,
  version: string,
  title: string,
  items: string[]
): string {
  const lines = [
    ``,
    `## [${version}] - ${new Date().toISOString().split('T')[0]}`,
    `### Added`,
    ...items.map(i => `- ${i}`),
  ];

  const entry = lines.join('\n');
  const changelogPath = path.join(projectRoot, 'CHANGELOG.md');
  const marker = '## [لم يُصدر بعد]';
  prependToFile(changelogPath, marker, entry);

  return entry;
}

export function createSession(
  title: string,
  tasks: string[],
  filesAdded: number,
  filesModified: number,
  testsBefore: number,
  testsAfter: number,
  errorsBefore: number,
  errorsAfter: number,
  commitHash?: string,
  lessons: string[] = []
): SessionEntry {
  return {
    id: `session-${Date.now().toString(36)}`,
    date: new Date().toISOString().split('T')[0],
    title,
    tasks,
    filesAdded,
    filesModified,
    testsBefore,
    testsAfter,
    errorsBefore,
    errorsAfter,
    commitHash,
    lessons,
  };
}
