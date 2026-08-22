/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف تقييم الملاحظات السحرية والتعابير الحسابية اللحظية (Magic Notes Evaluator Hook)
 * 🏛️ الدور: خطاف مشترك (Shared React Hook)
 * 📥 المستهلك: RichText, CanvasDesigner, UIDesigner, PDF, Scratchpad
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - تقييم فوري للنصوص التلقائية المنتهية بـ `=` مع عزل كلي للمستند.
 *    - دعم تحويل الوحدات والأوقات وسلاسل الحسابات الصاعدة (Sum Above).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب استهلاك المعالج مع النصوص الطويلة (Memoized Line Parsing).
 *    2. عدم تخزين القيم في المستند (Values Derived, Never Stored).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية ضد المدخلات الفارغة والنصوص غير المتناسقة.
 *    - إرجاع null بأمان عند عدم وجود نتيجة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useMemo } from 'react'
import {
  evaluateCalc,
  formatCalcVal,
  freshCalcContext,
  feedCalcLine,
  answerCalc,
  asksForAnswer,
  type UnitCalcContext,
} from '../lib-core'

export interface MagicNoteResult {
  hasAnswer: boolean
  answer: string | null
  rawInput: string
}

export function useMagicNotesEvaluator() {
  const [context, setContext] = useState<UnitCalcContext>(() => freshCalcContext())

  const resetContext = useCallback(() => {
    setContext(freshCalcContext())
  }, [])

  const evaluateLine = useCallback(
    (lineText: string, customContext?: UnitCalcContext): MagicNoteResult => {
      const trimmed = lineText.trim()
      if (!trimmed) {
        return { hasAnswer: false, answer: null, rawInput: lineText }
      }

      const activeCtx = customContext || context
      if (asksForAnswer(trimmed)) {
        const ans = answerCalc(trimmed, activeCtx)
        return {
          hasAnswer: ans !== null,
          answer: ans,
          rawInput: lineText,
        }
      }

      feedCalcLine(activeCtx, trimmed)
      return { hasAnswer: false, answer: null, rawInput: lineText }
    },
    [context]
  )

  const evaluateDocumentText = useCallback((fullText: string) => {
    const lines = fullText.split('\n')
    const ctx = freshCalcContext()
    const results: Array<{ lineNumber: number; line: string; answer: string | null }> = []

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        results.push({ lineNumber: idx + 1, line, answer: null })
        return
      }

      if (asksForAnswer(trimmed)) {
        const ans = answerCalc(trimmed, ctx)
        results.push({ lineNumber: idx + 1, line, answer: ans })
      } else {
        feedCalcLine(ctx, trimmed)
        results.push({ lineNumber: idx + 1, line, answer: null })
      }
    })

    return results
  }, [])

  return {
    evaluateLine,
    evaluateDocumentText,
    resetContext,
  }
}
