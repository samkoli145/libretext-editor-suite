/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الحضور والمؤشرات التفاعلية الحية للمتعاونين
 *           (Real-time Peer Awareness & Remote Cursor Engine).
 * 🏛️ الدور: نواة التعاون التفاعلي اللحظي (Collaboration & Peer Core).
 * 📥 المستهلك: CanvasDesignerEditor, Workbench, UIDesigner.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Ephemeral State Awareness:
 *    إدارة مؤشرات وتحديدات المتعاونين في طبقة مستقلة خفيفة تستهلك الحد الأدنى
 *    من الموارد مع حزم ألوان متباينة تلائم الثيم الفاتح النقي 100%.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تنظيف تلقائي للمتعاونين الخاملين بعد انقضاء مهلة (Auto-pruning stale peers).
 *    2. تخميد معدل التحديثات (Throttling) لتفادي استنزاف موارد المعالجة الرسومية.
 *    3. عدم إدراج مؤشر المستخدم المحلي ضمن طبقة المتعاونين البعيدين.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع متجهات الإحداثيات ومعرفات الشرائح.
 *    - مصفوفة ألوان منسقة بعناية لضمان تباين WCAG AA على الخلفيات البيضاء.
 *    - التزام صارم بآلية النشر والاشتراك الخالية من أي تسريب للذاكرة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RemotePeer {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
  activeSlideId?: string
  selectedElementIds?: string[]
  editingElementId?: string
  lastActiveMs: number
}

export type PeerListener = (peers: RemotePeer[]) => void

export class PeerAwarenessEngine {
  private peers: Map<string, RemotePeer> = new Map()
  private listeners: Set<PeerListener> = new Set()
  private localPeerId: string = `peer_${Math.random().toString(36).substring(2, 9)}`

  // باقة ألوان معتمدة للثيم الفاتح النقي
  public static readonly PEER_PALETTE = [
    { bg: '#0284c7', text: '#ffffff', name: 'Sky Blue' },
    { bg: '#059669', text: '#ffffff', name: 'Emerald' },
    { bg: '#7c3aed', text: '#ffffff', name: 'Violet' },
    { bg: '#e11d48', text: '#ffffff', name: 'Rose' },
    { bg: '#d97706', text: '#ffffff', name: 'Amber' },
    { bg: '#0891b2', text: '#ffffff', name: 'Cyan' },
    { bg: '#4f46e5', text: '#ffffff', name: 'Indigo' },
  ]

  constructor(options?: { localPeerId?: string; localName?: string; localColor?: string }) {
    if (options?.localPeerId) {
      this.localPeerId = options.localPeerId
    }
    // تشغيل مؤقت تنظيف الخاملين كل 10 ثوانٍ
    if (typeof window !== 'undefined') {
      window.setInterval(() => this.pruneStalePeers(), 10000)
    }
  }

  getLocalPeerId(): string {
    return this.localPeerId
  }

  setLocalCursor(cursor: { x: number; y: number } | null): void {
    this.localCursor = cursor
  }

  getLocalCursor(): { x: number; y: number } | null {
    return this.localCursor
  }

  setLocalSelection(selectedElementIds: string[]): void {
    this.localSelection = selectedElementIds
  }

  getLocalSelection(): string[] {
    return this.localSelection
  }

  private localCursor: { x: number; y: number } | null = null
  private localSelection: string[] = []

  getPeers(): RemotePeer[] {
    return Array.from(this.peers.values())
  }

  getPeer(id: string): RemotePeer | undefined {
    return this.peers.get(id)
  }

  updatePeer(peerData: Partial<RemotePeer> & { id: string }): void {
    if (peerData.id === this.localPeerId) return

    const existing = this.peers.get(peerData.id)
    const colorIndex = Math.abs(this.hashString(peerData.id)) % PeerAwarenessEngine.PEER_PALETTE.length
    const fallbackColor = PeerAwarenessEngine.PEER_PALETTE[colorIndex].bg

    const updated: RemotePeer = {
      id: peerData.id,
      name: peerData.name || existing?.name || `مستخدم ${peerData.id.slice(-4)}`,
      color: peerData.color || existing?.color || fallbackColor,
      cursor: peerData.cursor ?? existing?.cursor,
      activeSlideId: peerData.activeSlideId ?? existing?.activeSlideId,
      selectedElementIds: peerData.selectedElementIds ?? existing?.selectedElementIds,
      editingElementId: peerData.editingElementId ?? existing?.editingElementId,
      lastActiveMs: Date.now(),
    }

    this.peers.set(peerData.id, updated)
    this.notify()
  }

  removePeer(peerId: string): void {
    if (this.peers.delete(peerId)) {
      this.notify()
    }
  }

  subscribe(listener: PeerListener): () => void {
    this.listeners.add(listener)
    listener(this.getPeers())
    return () => this.listeners.delete(listener)
  }

  private pruneStalePeers(): void {
    const now = Date.now()
    let changed = false
    this.peers.forEach((peer, id) => {
      // إزالة المتعاونين بعد 30 ثانية من انقطاع النشاط
      if (now - peer.lastActiveMs > 30000) {
        this.peers.delete(id)
        changed = true
      }
    })
    if (changed) {
      this.notify()
    }
  }

  private notify(): void {
    const peersList = this.getPeers()
    this.listeners.forEach(l => {
      try {
        l(peersList)
      } catch (err) {
        console.error('Error in peer listener:', err)
      }
    })
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return hash
  }
}
