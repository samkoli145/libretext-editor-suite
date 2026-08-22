/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: جسر اشتقاق الرسوم البيانية المرتبطة بالجداول والمفكرة
 *           (Linked Data-to-Chart Derivation & Sync Engine).
 * 🏛️ الدور: نواة البيانات المشتقة والربط البياني (Grid & Chart Bridge Core).
 * 📥 المستهلك: CanvasDesignerEditor, CanvasLinkedChartComponent, UIDesigner.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Rule #2 Pure Reactive Derivation:
 *    الرسم البياني لا يخزن أرقاماً مكررة؛ بل يشتق بياناته وسلاسله فورياً من
 *    خلايا الجدول أو متغيرات المفكرة الحسابية مع كشف تلقائي للنسب والتسميات.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تحويل الخلايا الفارغة أو غير الصالحة إلى أصفار وهمية (null ≠ 0).
 *    2. التعامل الذكي مع الأعمدة النصية والتاريخية كفئات (Categories/Labels).
 *    3. عزل الحسابات عن حالة العرض لضمان ثبات الترتيب عند تدوير المحاور.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع صفوف ومصفوفات البيانات الرقمية.
 *    - لوحة ألوان سيمانتية متباينة تلائم الثيم الفاتح النقي 100%.
 *    - معالجة الأخطاء الصريحة عند انعدام الأعمدة الرقمية.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ChartSeries {
  name: string
  values: (number | null)[]
  color: string
  isPercentage?: boolean
}

export interface DerivedChartData {
  categories: string[]
  series: ChartSeries[]
  title?: string
  hasPercentages: boolean
  error?: string
}

export class LinkedChartBridge {
  public static readonly CHART_PALETTE = [
    '#2563eb', // Blue
    '#059669', // Emerald
    '#d97706', // Amber
    '#7c3aed', // Violet
    '#e11d48', // Rose
    '#0891b2', // Cyan
  ]

  /**
   * اشتقاق بيانات الرسم البياني من مصفوفة ثنائية الأبعاد (جدول خلايا)
   */
  static deriveFromTableGrid(
    tableData: any[][],
    hasHeaderRow: boolean = true,
    hasHeaderColumn: boolean = true
  ): DerivedChartData {
    if (!tableData || tableData.length === 0) {
      return { categories: [], series: [], hasPercentages: false, error: 'لا توجد بيانات متاحة' }
    }

    const rowStart = hasHeaderRow ? 1 : 0
    const colStart = hasHeaderColumn ? 1 : 0

    // استخراج الفئات (Labels / Categories)
    const categories: string[] = []
    for (let r = rowStart; r < tableData.length; r++) {
      const row = tableData[r]
      const label = hasHeaderColumn && row && row[0] !== undefined ? String(row[0]) : `عنصر ${r - rowStart + 1}`
      categories.push(label)
    }

    // استخراج السلاسل (Series)
    const numCols = Math.max(...tableData.map(row => (Array.isArray(row) ? row.length : 0)))
    const seriesList: ChartSeries[] = []
    let detectedPercentage = false

    let colorIdx = 0
    for (let c = colStart; c < numCols; c++) {
      const seriesName = hasHeaderRow && tableData[0] && tableData[0][c] !== undefined
        ? String(tableData[0][c])
        : `سلسلة ${c - colStart + 1}`

      const values: (number | null)[] = []
      let isColPercent = false

      for (let r = rowStart; r < tableData.length; r++) {
        const rawVal = tableData[r] ? tableData[r][c] : null
        if (rawVal === null || rawVal === undefined || rawVal === '') {
          values.push(null)
          continue
        }

        const strVal = String(rawVal).trim()
        if (strVal.endsWith('%')) {
          isColPercent = true
          detectedPercentage = true
          const num = Number.parseFloat(strVal.slice(0, -1))
          values.push(Number.isNaN(num) ? null : num)
        } else {
          const num = Number(strVal)
          values.push(Number.isNaN(num) ? null : num)
        }
      }

      // إضافة السلسلة إذا كانت تحتوي على أرقام صالحة
      const hasAnyNumber = values.some(v => v !== null)
      if (hasAnyNumber) {
        seriesList.push({
          name: seriesName,
          values,
          color: LinkedChartBridge.CHART_PALETTE[colorIdx % LinkedChartBridge.CHART_PALETTE.length],
          isPercentage: isColPercent,
        })
        colorIdx++
      }
    }

    if (seriesList.length === 0) {
      return { categories, series: [], hasPercentages: false, error: 'لم يتم العثور على أعمدة رقمية صالحة' }
    }

    return {
      categories,
      series: seriesList,
      hasPercentages: detectedPercentage,
    }
  }

  /**
   * اشتقاق بيانات الرسم البياني من متغيرات المفكرة الحسابية
   */
  static deriveFromScratchpadVars(variables: Array<{ name: string; value: unknown; description?: string }>): DerivedChartData {
    const numericVars = variables.filter(v => typeof v.value === 'number' && Number.isFinite(v.value))

    if (numericVars.length === 0) {
      return { categories: [], series: [], hasPercentages: false, error: 'لا توجد متغيرات رقمية صالحة' }
    }

    const categories = numericVars.map(v => v.description || v.name)
    const values = numericVars.map(v => v.value as number)

    return {
      categories,
      series: [
        {
          name: 'القيمة',
          values,
          color: LinkedChartBridge.CHART_PALETTE[0],
        },
      ],
      hasPercentages: false,
    }
  }
}
