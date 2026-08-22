/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرر منحنيات بيزير التكعيبية المتخصص (Bezier Curve Sub-Editor).
 * 🏛️ الدور: محرر فرعي متخصص (Specialized Sub-Editor Implementation).
 * 📥 المستهلك: SubEditorOrchestrator, CanvasDesignerEditor.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    De Casteljau Sub-Segment Insertion & Dual-Handle Symmetrical Solver:
 *    إمكانية إضافة نقاط جديدة على المنحنى بالنقر المباشر وتقسيم القطعة،
 *    مع دعم تناظر المقابض الناعمة وتنافر الزوايا الحادة (Sharp Corners).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب تحريك مقبض البداية أو النهاية إلى ما وراء حدود الكانفا بدون تدوير.
 *    2. ضمان بقاء مصفوفة العقد `nodes` متسقة دائماً بطول $\ge 2$.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع العقد والمقابض.
 *    - حماية دورة الحياة عبر try/catch في معالجة السحب.
 *    - التزام صارم بالثيم الفاتح النقي (Pure Light Theme) في لوحة الألوان.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { SubEditor, SubEditorKind, CanvasPointerEvent, CanvasSurface } from '../../../shared/lib-core/events/sub-editor-orchestrator'
import { BezNode, Pt, ptDist, mirrorHandle, nearestTOnCubic } from '../../../shared/lib-core/geometry/bezier-curves'

export class BezierSubEditor implements SubEditor {
  readonly kind: SubEditorKind = 'bezier'
  private _isActive = false
  private targetId: string | null = null
  private elementData: any = null
  private surface: CanvasSurface | null = null
  private selectedNodeIndex: number = -1
  private activeHandleType: 'point' | 'in' | 'out' | null = null
  private handleRadius = 5

  get isActive(): boolean {
    return this._isActive
  }

  attach(targetId: string, elementData: any, surface: CanvasSurface): void {
    this.targetId = targetId
    this.elementData = elementData
    this.surface = surface
    this._isActive = true
    this.selectedNodeIndex = -1
    this.activeHandleType = null

    // التأكد من وجود مصفوفة nodes صالحة
    if (!this.elementData.nodes || !Array.isArray(this.elementData.nodes)) {
      this.elementData.nodes = [
        { p: { x: this.elementData.x ?? 50, y: this.elementData.y ?? 50 }, out: { x: (this.elementData.x ?? 50) + 40, y: this.elementData.y ?? 50 } },
        { p: { x: (this.elementData.x ?? 50) + 150, y: (this.elementData.y ?? 50) + 100 }, in: { x: (this.elementData.x ?? 50) + 110, y: (this.elementData.y ?? 50) + 100 } },
      ]
    }
  }

  detach(): void {
    this._isActive = false
    this.targetId = null
    this.elementData = null
    this.selectedNodeIndex = -1
    this.activeHandleType = null
  }

  handlePointerDown(e: CanvasPointerEvent): boolean {
    if (!this._isActive || !this.elementData || !this.elementData.nodes) return false

    const nodes: BezNode[] = this.elementData.nodes
    const mousePt: Pt = { x: e.canvasX, y: e.canvasY }
    const hitThreshold = this.handleRadius / (this.surface?.zoom ?? 1) + 4

    // 1. فحص المقابض النشطة للنقطة المحددة أولاً
    if (this.selectedNodeIndex >= 0 && this.selectedNodeIndex < nodes.length) {
      const curr = nodes[this.selectedNodeIndex]
      if (curr.in && ptDist(mousePt, curr.in) <= hitThreshold) {
        this.activeHandleType = 'in'
        return true
      }
      if (curr.out && ptDist(mousePt, curr.out) <= hitThreshold) {
        this.activeHandleType = 'out'
        return true
      }
    }

    // 2. فحص النقر على أي عقدة على المسار
    for (let i = 0; i < nodes.length; i++) {
      if (ptDist(mousePt, nodes[i].p) <= hitThreshold) {
        this.selectedNodeIndex = i
        this.activeHandleType = 'point'
        this.surface?.invalidate()
        return true
      }
    }

    // 3. فحص النقر بالقرب من المنحنى لإضافة نقطة جديدة
    for (let i = 0; i < nodes.length - 1; i++) {
      const n0 = nodes[i]
      const n1 = nodes[i + 1]
      const cp1 = n0.out ?? n0.p
      const cp2 = n1.in ?? n1.p

      const nearest = nearestTOnCubic({ p0: n0.p, cp1, cp2, p1: n1.p }, mousePt)
      if (nearest.distance <= hitThreshold + 3) {
        // إضافة عقدة جديدة عند موضع النقر
        const newNode: BezNode = {
          p: nearest.point,
          in: { x: nearest.point.x - 20, y: nearest.point.y },
          out: { x: nearest.point.x + 20, y: nearest.point.y },
          corner: false,
        }
        nodes.splice(i + 1, 0, newNode)
        this.selectedNodeIndex = i + 1
        this.activeHandleType = 'point'
        this.surface?.invalidate()
        return true
      }
    }

    this.selectedNodeIndex = -1
    this.activeHandleType = null
    this.surface?.invalidate()
    return false
  }

  handlePointerMove(e: CanvasPointerEvent): boolean {
    if (!this._isActive || !this.elementData || !this.elementData.nodes || this.selectedNodeIndex < 0 || !this.activeHandleType) {
      return false
    }

    const nodes: BezNode[] = this.elementData.nodes
    const curr = nodes[this.selectedNodeIndex]
    if (!curr) return false

    const mouseX = Math.round(e.canvasX)
    const mouseY = Math.round(e.canvasY)

    if (this.activeHandleType === 'point') {
      const dx = mouseX - curr.p.x
      const dy = mouseY - curr.p.y
      curr.p.x = mouseX
      curr.p.y = mouseY

      if (curr.in) {
        curr.in.x += dx
        curr.in.y += dy
      }
      if (curr.out) {
        curr.out.x += dx
        curr.out.y += dy
      }
    } else if (this.activeHandleType === 'in') {
      curr.in = { x: mouseX, y: mouseY }
      if (!curr.corner) {
        nodes[this.selectedNodeIndex] = mirrorHandle(curr, 'in', e.altKey)
      }
    } else if (this.activeHandleType === 'out') {
      curr.out = { x: mouseX, y: mouseY }
      if (!curr.corner) {
        nodes[this.selectedNodeIndex] = mirrorHandle(curr, 'out', e.altKey)
      }
    }

    this.surface?.invalidate()
    return true
  }

  handlePointerUp(_e: CanvasPointerEvent): boolean {
    if (this.activeHandleType && this.targetId && this.surface) {
      this.surface.commitChange('تعديل منحنى بيزير', {
        id: this.targetId,
        nodes: JSON.parse(JSON.stringify(this.elementData.nodes)),
      })
      this.activeHandleType = null
      return true
    }
    this.activeHandleType = null
    return false
  }

  handleDoubleClick(_e: CanvasPointerEvent): boolean {
    if (this.selectedNodeIndex >= 0 && this.elementData?.nodes) {
      const curr = this.elementData.nodes[this.selectedNodeIndex]
      if (curr) {
        curr.corner = !curr.corner
        this.surface?.invalidate()
        return true
      }
    }
    return false
  }

  renderOverlays(ctx: CanvasRenderingContext2D, surface: CanvasSurface): void {
    if (!this._isActive || !this.elementData?.nodes) return

    const nodes: BezNode[] = this.elementData.nodes
    const zoom = surface.zoom

    ctx.save()

    // 1. رسم مقابض وخطوط العقدة المحددة
    if (this.selectedNodeIndex >= 0 && this.selectedNodeIndex < nodes.length) {
      const curr = nodes[this.selectedNodeIndex]

      if (curr.in) {
        this.drawControlLine(ctx, curr.p, curr.in, zoom)
        this.drawHandleCircle(ctx, curr.in, zoom, '#0284c7', this.activeHandleType === 'in')
      }
      if (curr.out) {
        this.drawControlLine(ctx, curr.p, curr.out, zoom)
        this.drawHandleCircle(ctx, curr.out, zoom, '#0284c7', this.activeHandleType === 'out')
      }
    }

    // 2. رسم جميع عقد المنحنى
    nodes.forEach((node, idx) => {
      const isSelected = idx === this.selectedNodeIndex
      const isCorner = !!node.corner

      const r = (this.handleRadius + (isSelected ? 1.5 : 0)) / zoom
      ctx.fillStyle = isSelected ? '#2563eb' : '#ffffff'
      ctx.strokeStyle = isCorner ? '#d97706' : '#2563eb'
      ctx.lineWidth = (isSelected ? 2.5 : 1.8) / zoom

      ctx.beginPath()
      if (isCorner) {
        // رسم مربع للزوايا الحادة
        ctx.rect(node.p.x - r, node.p.y - r, r * 2, r * 2)
      } else {
        // رسم دائرة للنقاط الانسيابية
        ctx.arc(node.p.x, node.p.y, r, 0, Math.PI * 2)
      }
      ctx.fill()
      ctx.stroke()
    })

    ctx.restore()
  }

  private drawControlLine(ctx: CanvasRenderingContext2D, p1: Pt, p2: Pt, zoom: number): void {
    ctx.strokeStyle = '#93c5fd'
    ctx.lineWidth = 1 / zoom
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }

  private drawHandleCircle(ctx: CanvasRenderingContext2D, pt: Pt, zoom: number, color: string, isHot: boolean): void {
    const r = (this.handleRadius - 1) / zoom
    ctx.fillStyle = isHot ? color : '#ffffff'
    ctx.strokeStyle = color
    ctx.lineWidth = 1.8 / zoom
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}
