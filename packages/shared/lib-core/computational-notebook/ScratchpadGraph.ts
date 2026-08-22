/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الرسم البياني للتبعيات والترتيب الطوبولوجي وكشف الحلقات الدائرية
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency DAG & Kahn's Algorithm Engine)
 * 📥 المستهلك: ScratchpadEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    IndexedQueue (O(1) Dequeue), Kahn's Topological Sort, Forward & Reverse Dependency Maps
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المراجع الذاتية ($x = $x + 1) والحلقات المتعددة ($a -> $b -> $a) يجب كشفها بدقة (#CYCLE!).
 *    2. تجنب تسريب الذاكرة عند استدعاء BFS لجمع المتأثرين.
 *    3. عدم استخدام Array.shift() لمنع التعقيد الزمني O(N^2).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من الحلقات اللانهائية أثناء BFS عبر `visited` Set
 *    - إعادة ضبط الطوابير والقوائم فور انتهاء المعالجة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { extractVariables } from './ScratchpadParser.ts'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 Scratchpad Indexed Queue (O(1) dequeue)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class ScratchpadIndexedQueue<T> {
  private items: T[] = []
  private head = 0
  
  enqueue(item: T): void {
    this.items.push(item)
  }
  
  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined
    const item = this.items[this.head]
    this.head++
    return item
  }
  
  get size(): number {
    return Math.max(0, this.items.length - this.head)
  }
  
  isEmpty(): boolean {
    return this.head >= this.items.length
  }
  
  clear(): void {
    this.items = []
    this.head = 0
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 رسم بياني للتبعيات (Dependency Graph)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface DependencyEdge {
  from: string  // المتغير التابع
  to: string    // المتغير المعتمد عليه
}

export interface TopologicalOrder {
  order: string[]
  cycles: string[]
}

export class DependencyGraph {
  private nodes = new Set<string>()
  private edges = new Map<string, Set<string>>()  // from -> [to, ...]
  private reverseEdges = new Map<string, Set<string>>()  // to -> [from, ...]
  
  addNode(name: string): void {
    this.nodes.add(name)
    if (!this.edges.has(name)) {
      this.edges.set(name, new Set())
    }
    if (!this.reverseEdges.has(name)) {
      this.reverseEdges.set(name, new Set())
    }
  }
  
  addEdge(from: string, to: string): void {
    this.addNode(from)
    this.addNode(to)
    
    this.edges.get(from)!.add(to)
    this.reverseEdges.get(to)!.add(from)
  }
  
  removeNode(name: string): void {
    const outgoing = this.edges.get(name)
    if (outgoing) {
      for (const to of outgoing) {
        this.reverseEdges.get(to)?.delete(name)
      }
    }
    
    const incoming = this.reverseEdges.get(name)
    if (incoming) {
      for (const from of incoming) {
        this.edges.get(from)?.delete(name)
      }
    }
    
    this.nodes.delete(name)
    this.edges.delete(name)
    this.reverseEdges.delete(name)
  }
  
  getDependencies(name: string): string[] {
    return Array.from(this.edges.get(name) ?? [])
  }
  
  getDependents(name: string): string[] {
    return Array.from(this.reverseEdges.get(name) ?? [])
  }
  
  getAllNodes(): string[] {
    return Array.from(this.nodes)
  }

  getEdgesMap(): Map<string, Set<string>> {
    return this.edges
  }

  getReverseEdgesMap(): Map<string, Set<string>> {
    return this.reverseEdges
  }
  
  hasNode(name: string): boolean {
    return this.nodes.has(name)
  }
  
  get size(): number {
    return this.nodes.size
  }
  
  clear(): void {
    this.nodes.clear()
    this.edges.clear()
    this.reverseEdges.clear()
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 خوارزمية كان (Kahn's Algorithm)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function topologicalSort(graph: DependencyGraph): TopologicalOrder {
  const order: string[] = []
  const cycles: string[] = []
  
  const allNodes = graph.getAllNodes()
  const edges = graph.getEdgesMap()
  const reverseEdges = graph.getReverseEdgesMap()
  
  // in-degree: عدد المتغيرات التي يعتمد عليها هذا المتغير (incoming dependencies)
  const inDeg = new Map<string, number>()
  for (const node of allNodes) {
    inDeg.set(node, edges.get(node)?.size ?? 0)
  }
  
  // الطابور الأولي: المتغيرات التي ليس لها تبعيات (in-degree = 0)
  const queue = new ScratchpadIndexedQueue<string>()
  for (const [node, deg] of inDeg) {
    if (deg === 0) {
      queue.enqueue(node)
    }
  }
  
  // معالجة الطابور
  while (!queue.isEmpty()) {
    const node = queue.dequeue()!
    order.push(node)
    
    // تقليل in-degree للمتغيرات التي تعتمد على هذا المتغير
    const dependents = reverseEdges.get(node) ?? new Set()
    for (const dep of dependents) {
      const currentDeg = inDeg.get(dep) ?? 1
      const newDeg = currentDeg - 1
      inDeg.set(dep, newDeg)
      if (newDeg === 0) {
        queue.enqueue(dep)
      }
    }
  }
  
  // كشف الدورات (المتغيرات التي لم يصل in-degree الخاص بها إلى 0)
  for (const [node, deg] of inDeg) {
    if (deg > 0) {
      cycles.push(node)
    }
  }
  
  queue.clear()
  return { order, cycles }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 بناء الرسم البياني من التعابير
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function buildGraphFromExpressions(
  vars: Map<string, string>
): DependencyGraph {
  const graph = new DependencyGraph()
  
  for (const name of vars.keys()) {
    graph.addNode(name)
  }
  
  for (const [name, expr] of vars) {
    const deps = extractVariables(expr)
    
    for (const dep of deps) {
      if (dep === name) {
        // دورة ذاتية
        graph.addEdge(name, name)
        continue
      }
      
      if (vars.has(dep)) {
        // name يعتمد على dep (from: name, to: dep)
        graph.addEdge(name, dep)
      }
    }
  }
  
  return graph
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 إعادة الحساب التلقائي (Auto-Recompute)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function getAffectedVariables(
  graph: DependencyGraph,
  changedVar: string
): string[] {
  const affected = new Set<string>()
  const queue = new ScratchpadIndexedQueue<string>()
  
  for (const dep of graph.getDependents(changedVar)) {
    queue.enqueue(dep)
  }
  
  while (!queue.isEmpty()) {
    const node = queue.dequeue()!
    
    if (affected.has(node)) continue
    affected.add(node)
    
    for (const dep of graph.getDependents(node)) {
      if (!affected.has(dep)) {
        queue.enqueue(dep)
      }
    }
  }
  
  queue.clear()
  return Array.from(affected)
}

export function verifyTopologicalOrder(
  order: string[],
  graph: DependencyGraph
): boolean {
  const position = new Map<string, number>()
  order.forEach((node, i) => position.set(node, i))
  
  for (const node of order) {
    const pos = position.get(node)!
    const deps = graph.getDependencies(node)
    
    for (const dep of deps) {
      const depPos = position.get(dep)
      if (depPos === undefined) continue
      if (depPos >= pos) {
        return false
      }
    }
  }
  
  return true
}
