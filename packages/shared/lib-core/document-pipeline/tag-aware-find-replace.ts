/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: محرك بحث/استبدال واعٍ بوسوم HTML (Tag-Aware Find & Replace)
 *           يتجاهل نصوص الوسوم والخصائص ويقتصر على فقرات النص الحقيقية.
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Engine) داخل document-pipeline.
 * 📥 المستهلك: FindReplaceBarModal, RichTextEditor, tag-aware find UI
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Single-Traversal Contract: كلتا الدالتين مبنيّتان على عبور واحد
 *    `mapTextChunks` (وسم وسمٌ بشقٍّ نصي) — فالتعريف الوحيد لـ"أين يمكن أن
 *    توجد مطابقة" مشترك، والعد لا يستطيع أن يعدّ ما لا يستبدله أبداً.
 *    `wid<b>get </b>` تُقرأ كلمةً واحدةً لكنها شقّان: العد شقٌّ والاستبدال
 *    كذلك، فلا فرق بين الرقم المعروض وعدد التغييرات.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تطابق غير حساس لحالة الأحرف في الاستبدال يطابق العد — استبدال حساس
 *       خلف عدّ غير حساس يعدّ 14 ويبدّل 9 بصمت.
 *    2. لا استخدام لـ `textOf()` لاستخراج النص للعد — سيقول "3 موجودة"
 *       ثم يغيّر اثنتين.
 *    3. وسم بلا `>` لاحق أو نص قبل أول `<` يُعالَج كشق نصي عادي (لا حلقات).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - `html`/`needle` معدومة ⇒ عد 0 وعودة النص كما هو.
 *    - الوسم نفسه يُمرَّر دون مساس (شوافذ الاستبدال داخل الشق النصي فقط).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/spaces/findreplace.ts (The Bento authors, MIT).
 */

/**
 * امشِ نصوص سلسلة inline-html شقاً بشقٍّ، مع تطبيق دالة على كل شق نصي.
 *
 * "التعريف الوحيد لمكان المطابقة"، مشترك بين العدّ والاستبدال بحيث لا
 * يختلفان أبداً.
 */
function mapTextChunks(html: string, fn: (chunk: string) => string): string {
  const out: string[] = []
  let i = 0
  while (i < html.length) {
    const lt = html.indexOf('<', i)
    const chunk = lt < 0 ? html.slice(i) : html.slice(i, lt)
    out.push(fn(chunk))
    if (lt < 0) break
    const gt = html.indexOf('>', lt)
    if (gt < 0) {
      out.push(html.slice(lt))
      break
    }
    out.push(html.slice(lt, gt + 1)) // الوسم نفسه، دون مساس
    i = gt + 1
  }
  return out.join('')
}

/** كم مرة سيُستبدل `needle` فعلياً داخل هذه الكتلة. */
export function countOutsideTags(html: string | undefined, needle: string): number {
  if (!html || !needle) return 0
  const lowerNeedle = needle.toLowerCase()
  let n = 0
  mapTextChunks(html, (chunk) => {
    const lower = chunk.toLowerCase()
    for (let from = 0; ; ) {
      const at = lower.indexOf(lowerNeedle, from)
      if (at < 0) return chunk
      n++
      from = at + needle.length
    }
  })
  return n
}

/** استبدال `needle` بـ `withText` داخل الشقوق النصية فقط، دون المساس بالوسوم. */
export function replaceOutsideTags(html: string, needle: string, withText: string): string {
  if (!needle) return html
  const lowerNeedle = needle.toLowerCase()
  return mapTextChunks(html, (chunk) => {
    const lower = chunk.toLowerCase()
    let out = ''
    let from = 0
    for (;;) {
      const at = lower.indexOf(lowerNeedle, from)
      if (at < 0) {
        out += chunk.slice(from)
        return out
      }
      out += chunk.slice(from, at) + withText
      from = at + needle.length
    }
  })
}

/** واجهة موحدة: استبدال داخل كتلة HTML وإرجاع العدد الفعلي للتغييرات. */
export function replaceInHtmlBlock(
  html: string | undefined,
  needle: string,
  withText: string
): { html: string; count: number } {
  if (!html) return { html: html ?? '', count: 0 }
  const count = countOutsideTags(html, needle)
  return count === 0 ? { html, count: 0 } : { html: replaceOutsideTags(html, needle, withText), count }
}
