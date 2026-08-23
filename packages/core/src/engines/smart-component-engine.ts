/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: smart-component-engine.ts
 * 📂 المسار: packages/core/src/engines/smart-component-engine.ts
 * 🎯 الهدف الرئيسي: محرك تجميع المكونات الذكي
 *    مع اكتشاف التبعيات وحل التعارضات تلقائياً.
 * 🏷️ المعرف: CORE-ENG-019
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface ComponentDependency {
  readonly id: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly weight: number;
}

export interface ResolveResult {
  readonly resolved: readonly string[];
  readonly conflicts: readonly string[];
  readonly missing: readonly string[];
}

function findAllRequired(
  startIds: readonly string[],
  deps: ReadonlyMap<string, ComponentDependency>,
): string[] {
  const visited = new Set<string>();
  const queue = [...startIds];
  while (queue.length > 0) {
    const id = queue.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const dep = deps.get(id);
    if (dep) {
      for (const req of dep.requires) {
        if (!visited.has(req)) queue.push(req);
      }
    }
  }
  return Array.from(visited);
}

function findConflicts(
  ids: readonly string[],
  deps: ReadonlyMap<string, ComponentDependency>,
): string[] {
  const conflicts: string[] = [];
  for (const id of ids) {
    const dep = deps.get(id);
    if (!dep) continue;
    for (const c of dep.conflicts) {
      if (ids.includes(c)) conflicts.push(`${id} conflicts with ${c}`);
    }
  }
  return conflicts;
}

function findMissing(ids: readonly string[], allIds: readonly string[]): string[] {
  return ids.filter((id) => !allIds.includes(id));
}

export function resolveComponents(
  requestedIds: readonly string[],
  allDeps: readonly ComponentDependency[],
): ResolveResult {
  const depMap = new Map(allDeps.map((d) => [d.id, d]));
  const allIds = allDeps.map((d) => d.id);
  const required = findAllRequired(requestedIds, depMap);
  return {
    resolved: required,
    conflicts: findConflicts(required, depMap),
    missing: findMissing(required, allIds),
  };
}

export function sortByIdWeight(
  deps: readonly ComponentDependency[],
): readonly ComponentDependency[] {
  return [...deps].sort((a, b) => b.weight - a.weight);
}
