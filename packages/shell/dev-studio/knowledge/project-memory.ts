/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: project-memory.ts
 * 🎯 الهدف: ذاكرة المشروع الدائمة — تحفظ وتسترجع حالة المشروع والأحداث
 * 🏛️ الدور: شريكي الذكي الذي يتذكر كل ما حدث في المشروع
 * 🧠 الطريقة المبتكرة: JSON-based persistent memory with query API
 * ⚠️ الخطر: لا تُحذف الذاكرة إلا بأمر صريح
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ProjectSnapshot {
  readonly timestamp: number;
  readonly date: string;
  readonly sourceCount: number;
  readonly testCount: number;
  readonly testPassCount: number;
  readonly errorCount: number;
  readonly packageCount: number;
  readonly lastCommit: string;
  readonly branch: string;
}

export interface SessionEntry {
  readonly id: string;
  readonly date: string;
  readonly title: string;
  readonly tasks: string[];
  readonly filesAdded: number;
  readonly filesModified: number;
  readonly testsBefore: number;
  readonly testsAfter: number;
  readonly errorsBefore: number;
  readonly errorsAfter: number;
  readonly commitHash?: string;
  readonly lessons: string[];
}

export interface DecisionEntry {
  readonly date: string;
  readonly decision: string;
  readonly reason: string;
  readonly alternatives: string[];
}

export interface ProjectMemory {
  readonly projectName: string;
  readonly createdAt: string;
  snapshots: ProjectSnapshot[];
  sessions: SessionEntry[];
  decisions: DecisionEntry[];
  knownIssues: string[];
  architecturalRules: string[];
}

const MEMORY_FILE = '.devstudio-memory.json';

function getMemoryPath(projectRoot: string): string {
  return path.join(projectRoot, MEMORY_FILE);
}

export function loadMemory(projectRoot: string): ProjectMemory {
  const memPath = getMemoryPath(projectRoot);
  if (fs.existsSync(memPath)) {
    try {
      const raw = fs.readFileSync(memPath, 'utf-8');
      return JSON.parse(raw) as ProjectMemory;
    } catch {
      // ملف corrupted — نُعيد الذاكرة الفارغة بدلاً من crash
      return createEmptyMemory();
    }
  }
  return createEmptyMemory();
}

export function saveMemory(projectRoot: string, memory: ProjectMemory): void {
  const memPath = getMemoryPath(projectRoot);
  fs.writeFileSync(memPath, JSON.stringify(memory, null, 2), 'utf-8');
}

export function addSnapshot(projectRoot: string, snapshot: ProjectSnapshot): void {
  const memory = loadMemory(projectRoot);
  memory.snapshots.push(snapshot);
  saveMemory(projectRoot, memory);
}

export function addSession(projectRoot: string, session: SessionEntry): void {
  const memory = loadMemory(projectRoot);
  memory.sessions.push(session);
  saveMemory(projectRoot, memory);
}

export function addDecision(projectRoot: string, decision: DecisionEntry): void {
  const memory = loadMemory(projectRoot);
  memory.decisions.push(decision);
  saveMemory(projectRoot, memory);
}

export function getLatestSnapshot(projectRoot: string): ProjectSnapshot | null {
  const memory = loadMemory(projectRoot);
  return memory.snapshots.length > 0
    ? memory.snapshots[memory.snapshots.length - 1]
    : null;
}

export function getSessionCount(projectRoot: string): number {
  return loadMemory(projectRoot).sessions.length;
}

export function getTotalFilesAdded(projectRoot: string): number {
  return loadMemory(projectRoot).sessions.reduce((s, e) => s + e.filesAdded, 0);
}

function createEmptyMemory(): ProjectMemory {
  return {
    projectName: 'libretext-editor-suite',
    createdAt: new Date().toISOString(),
    snapshots: [],
    sessions: [],
    decisions: [],
    knownIssues: [],
    architecturalRules: [
      'صفر اعتماديات خارجية في النواة (Zero-Dependency Core)',
      'ثيم فاتح نقي 100% — ممنوع أي لون داكن',
      'تفاعل بالماوس حصراً — لا اختصارات إلزامية',
      'كل ملف يجب أن يكون له ترويسة توجيهية بالعربية',
      'لا تعديل مباشر — يجب المرور بـ DoctorGate أولاً',
    ],
  };
}

export function initializeMemory(projectRoot: string): ProjectMemory {
  const existing = loadMemory(projectRoot);
  if (existing.snapshots.length > 0) return existing;
  const fresh = createEmptyMemory();
  saveMemory(projectRoot, fresh);
  return fresh;
}
