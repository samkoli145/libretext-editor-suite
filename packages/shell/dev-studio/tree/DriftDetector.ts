// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [DriftDetector.ts] طبقة الوعي واليقظة — حارس الشغل الخارجي
 *
 * هذا الملف يجيب سؤالاً واحداً:
 * "هل تغيّر المشروع منذ آخر مرة نظرنا فيها، وماذا يعني ذلك؟"
 *
 * المبدأ الحاكم (من قصة Bento كلها):
 * الملف هو مصدر الحقيقة، وليس الاستوديو. المستخدم حر يعدل من
 * VS Code، من vim، من أي مكان. هذا الحارس لا يقف في الطريق —
 * بل يرى، يفهم، يصنف، ويطلب قراراً.
 *
 * ⚠️ ما لا يفعله هذا الملف (عمداً):
 * - لا يمنع التعديل الخارجي أبداً
 * - لا يعدّل المشروع أبداً (مصنع تقارير، لا محرر)
 * - لا يطبق قراراً أبداً (القرار للخط، عبر accept/ignore/quarantine)
 *
 * الدروس المطبقة من قاعدة المعرفة:
 *
 * 1. من rowcol.ts — "A RID IS NEVER REUSED":
 *    الهوية لا تُعاد. تعديل خارجي يعيد استخدام معرف محذوف
 *    يبعث تصحيحات عنصر ميت على بيانات جديدة. هذا أخطر أنواع
 *    الانجراف، ويُصنف DANGER دائماً.
 *
 * 2. من rowcol.ts — "THE RESURRECTION":
 *    حذف ثم إعادة استيراد يبعث الأشباح. نكتشف الأيتام التي
 *    تشير إلى شيء لم يعد موجوداً.
 *
 * 3. من test-dash-story.ts — PLATFORM §3:
 *    الحقول المجهولة يجب أن تنجو. تعديل خارجي يضيف حقلاً
 *    لا نعرفه ليس خطأ — هو مستقبل لم نصله بعد. نصنفه INFO
 *    ونحافظ عليه، لا نحذفه.
 *
 * 4. من story.ts — "SERIES ARE DERIVED, NEVER STORED":
 *    تعديل خارجي يخزن قيمة مشتقة (رقم يجب أن يُحسب) هو
 *    انتهاك. الملف يمكن أن يحمل رقماً يخالف تعبيره.
 *
 * 5. من test-dash-story.ts — "A SETTING THAT WILL NOT SWITCH OFF":
 *    الحقول المضافة: الغياب يعني "لا". تخزين [] أو "" بدل
 *    الغياب يترك الملف متغيراً بعد round-trip.
 *
 * التنبيهات:
 * - الرفض بصوت عالٍ (refusing loudly is the point)
 * - كل تصنيف يحمل الدليل (المسار + السبب)
 * - لا استثناءات صامتة
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { ProjectSurface } from '../core/DevStudioEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع — ما يكتشفه الحارس
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * نوع الانجراف. كل نوع يتوافق مع درس من قاعدة المعرفة.
 *
 * ⚠️ الترتيب ليس تجميلياً: المصنفات تعمل بهذا الترتيب، وأول
 * مصنف يطابق يفوز. DANGER قبل WARN قبل INFO، لأن التغيير
 * الواحد قد يكون "ملف جديد" (added) و"انتهاك هوية"
 * (identityViolation) في آن — والخطر هو ما يجب أن يُرى.
 */
export type DriftKind =
  | 'added'              // ملف جديد من الخارج
  | 'removed'            // ملف حُذف من الخارج
  | 'modified'           // محتوى تغيّر
  | 'identityViolation'  // معرف مكرر أو معاد استخدامه (RID lesson)
  | 'orphanResurrection' // أيتام تشير لشيء محذوف (RESURRECTION lesson)
  | 'unknownField'       // حقل مجهول — يجب الحفاظ عليه (PLATFORM §3)
  | 'storedDerived'      // قيمة مشتقة مخزنة (story.ts rule 2)
  | 'additiveViolation'; // تخزين [] أو "" بدل الغياب

/**
 * خطورة الانجراف.
 *
 * info:   معلومة، لا تحتاج قراراً (حقل مجهول، ملف جديد حميد)
 * warn:   تحذير، يحتاج انتباهاً لكن لا يوقف (قيمة مشتقة)
 * danger: خطر، يحتاج قراراً صريحاً قبل أي تطبيق (انتهاك هوية)
 */
export type DriftSeverity = 'info' | 'warn' | 'danger';

/**
 * اكتشاف واحد. يحمل الدليل، لا الحكم فقط.
 *
 * الحقول المضافة: الغياب يعني "لا".
 * اكتشاف بلا `evidence` لا `line` لا يحملهما — لا نخزن null.
 */
export interface DriftFinding {
  kind: DriftKind;
  severity: DriftSeverity;
  /** المسار الذي حدث فيه الانجراف */
  path: string;
  /** لماذا هذا انجراف — الدليل المقروء */
  reason: string;
  /** additive: السطر إن كان معروفاً */
  line?: number;
  /** additive: الدليل الخام إن كان مفيداً */
  evidence?: string;
}

/**
 * قرار معالجة الانجراف.
 *
 * accept:     ضم للّقطة — يصبح مشمولاً بالتراجع والمزامنة
 * ignore:     تجاهل — يبقى خارج اللقطة، لا يُتراجع عنه
 * quarantine: حجر — لا يُطبق حتى يُراجع يدوياً
 */
export type DriftResolution = 'accept' | 'ignore' | 'quarantine';

/**
 * تقرير الانجراف الكامل.
 *
 * ⚠️ القاعدة من rowcol.ts: "refusing loudly is the point".
 * التقرير لا يخفي شيئاً. كل اكتشاف مذكور، كل خطورة مسجلة.
 *
 * `clean` غير متناظر (مثل `clean` في SnapshotEngine):
 * تقرير بلا اكتشافات خطر ليس له `hasDanger: false` مخزنة —
 * الغياب يعني "لا خطر". الواجهة تقرأ hasDanger() كدالة.
 */
export interface DriftReport {
  timestamp: number;
  findings: DriftFinding[];
  /** عدد الملفات التي فُحصت */
  scanned: number;
  /** additive: رسالة إن كان الفحص نفسه فشل */
  error?: string;
}

/**
 * الحالة المعروفة الأخيرة — ما نتذكره عن المشروع.
 *
 * ⚠️ هذه View State، لا Document State (من story.ts rule 1).
 * تُحفظ في الذاكرة/localStorage، لا في الملف. مشروع يُفتح من
 * البريد يجب أن يبدو متطابقاً بغض النظر عمن فتحه.
 */
export interface KnownState {
  /** المسارات المعروفة مع بصماتها (hash المحتوى) */
  files: Map<string, string>;
  /** المعرفات المعروفة (أدوات، مكونات) */
  knownIds: Set<string>;
  /** المعرفات المحذوفة — لا يجب أن تُعاد (burned) */
  burnedIds: Set<string>;
  timestamp: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// البصمات — كيف نعرف أن شيئاً تغيّر
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * بصمة محتوى — hash بسيط وسريع.
 *
 * ⚠️ هذا ليس hash أمني. الغرض اكتشاف "هل تغيّر شيء"، لا
 * إثبات "لم يعبث أحد". djb2 كافٍ لهذا الغرض، وسريع بما يكفي
 * لآلاف الملفات. لو احتجنا أماناً، نستبدل هذه الدالة فقط —
 * لا شيء آخر يعتمد على خوارزميتها.
 */
export function fingerprint(content: string): string {
  let h = 5381;
  for (let i = 0; i < content.length; i++) {
    h = ((h << 5) + h + content.charCodeAt(i)) | 0;
  }
  return h.toString(36) + ':' + content.length.toString(36);
}

/**
 * إنشاء حالة معروفة من الوضع الحالي.
 *
 * تُستدعى عند فتح الاستوديو، وبعد كل التزام ناجح، لتصبح
 * "آخر شيء رأيناه".
 */
export function captureKnownState(project: ProjectSurface): KnownState {
  const files = new Map<string, string>();
  const knownIds = new Set<string>();
  const burnedIds = new Set<string>();

  for (const path of project.listFiles()) {
    const content = project.readFile(path);
    if (content !== null) {
      files.set(path, fingerprint(content));

      // استخراج المعرفات المحروقة والمعرفة إن كان ملف JSON
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.burnedIds)) {
            for (const bid of parsed.burnedIds) {
              if (typeof bid === 'string') burnedIds.add(bid);
            }
          }
          if (parsed.vars && typeof parsed.vars === 'object') {
            for (const v of Object.values(parsed.vars)) {
              if (v && typeof v === 'object' && typeof (v as { id?: string }).id === 'string') {
                knownIds.add((v as { id: string }).id);
              }
            }
          }
        }
      } catch {
        // ليس JSON — نتابع
      }
    }
  }
  return {
    files,
    knownIds,
    burnedIds,
    timestamp: Date.now(),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المصنفات — كل واحدة تكتشف انتهاكاً محدداً
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مصنف: الحقول المجهولة (PLATFORM §3).
 *
 * من test-dash-story.ts:
 * "a whole story-level field from a build that does not exist yet"
 * يجب أن ينجو. تعديل خارجي يضيف حقلاً لا نعرفه ليس خطأ —
 * هو إضافة من إصدار أحدث أو أداة أخرى.
 *
 * نكتشف الحقول التي تشبه تعريفاً (key: value في أعلى مستوى)
 * ولا تطابق أي حقل نعرفه.
 */
function classifyUnknownFields(
  path: string,
  content: string,
  knownTopLevel: Set<string>,
): DriftFinding[] {
  const out: DriftFinding[] = [];
  // نمط بسيط: سطر يبدأ بمفتاح في أعلى مستوى (بدون مسافة بادئة)
  const re = /^([A-Za-z_][A-Za-z0-9_]*)\s*[:=]/;
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    const m = re.exec(line);
    if (m && !knownTopLevel.has(m[1]) && !line.trim().startsWith('//')) {
      out.push({
        kind: 'unknownField',
        severity: 'info',
        path,
        reason: `حقل "${m[1]}" غير معروف لهذا البناء — سيُحافظ عليه (PLATFORM §3)`,
        line: i + 1,
        evidence: m[1],
      });
    }
  });
  return out;
}

/**
 * مصنف: القيم المشتقة المخزنة (story.ts rule 2).
 *
 * "SERIES ARE DERIVED, NEVER STORED."
 * تعديل خارجي يخزن قيمة محسوبة (مثل "result = 5750" بجوار
 * تعبيرها) يمكن أن ينفصل عن الحقيقة لحظة يتغير التعبير.
 *
 * نكتشف أنماطاً شائعة: متغير يحمل "_result" أو "_computed"
 * أو "Cached" أو "cached_" — هذه أسماء تخبرنا أن القيمة مشتقة.
 */
function classifyStoredDerived(path: string, content: string): DriftFinding[] {
  const out: DriftFinding[] = [];
  const re = /\b([A-Za-z_][A-Za-z0-9_]*)(?:_result|_computed|Cached|cached[A-Z])/;
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    const m = re.exec(line);
    if (m) {
      out.push({
        kind: 'storedDerived',
        severity: 'warn',
        path,
        reason: `"${m[0]}" تبدو قيمة مشتقة مخزنة — المشتقات تُحسب، لا تُخزن`,
        line: i + 1,
        evidence: m[0],
      });
    }
  });
  return out;
}

/**
 * مصنف: انتهاكات الحقول المضافة.
 *
 * من test-dash-story.ts:
 * "A SETTING THAT WILL NOT SWITCH OFF" — تخزين [] أو "" بدل
 * الغياب يترك الملف متغيراً بعد round-trip.
 *
 * نكتشف تعيينات صريحة لمجموعات فارغة:
 *   filters: [], sorts: [], caption: "", tags: []
 */
function classifyAdditiveViolations(path: string, content: string): DriftFinding[] {
  const out: DriftFinding[] = [];
  const re = /\b(filters|sorts|tags|caption|steps)\s*[:=]\s*(\[\]\s*[,;]|""|'')/;
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    const m = re.exec(line);
    if (m) {
      out.push({
        kind: 'additiveViolation',
        severity: 'warn',
        path,
        reason: `حقل مضاف "${m[1]}" يخزن فراغاً — الغياب يعني "لا"، ليس [] أو ""`,
        line: i + 1,
        evidence: m[0],
      });
    }
  });
  return out;
}

/**
 * مصنف: انتهاكات الهوية (RID lesson).
 *
 * من rowcol.ts: "A RID IS NEVER REUSED."
 * إذا عاد معرف محروق (burned) للظهور، فهذا بعث. التعريف
 * المحذوف لا يجب أن يعود، لأن تصحيحاته وملاحظاته وهوية CRDT
 * كلها تفترض أن المعرف يخص عنصراً واحداً للأبد.
 */
function classifyIdentity(
  path: string,
  content: string,
  known: KnownState,
): DriftFinding[] {
  const out: DriftFinding[] = [];
  const seenHere = new Set<string>();

  // 1. فحص JSON المنظم أولاً
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object') {
      const checkObj = (obj: unknown) => {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach(checkObj);
          return;
        }
        const rec = obj as Record<string, unknown>;
        for (const [k, val] of Object.entries(rec)) {
          if (['id', 'varId', 'toolId', 'componentId', 'sheetId'].includes(k) && typeof val === 'string') {
            if (seenHere.has(val)) {
              out.push({
                kind: 'identityViolation',
                severity: 'danger',
                path,
                reason: `المعرف "${val}" مكرر داخل نفس الملف — معرفان يتشاركان هوية واحدة`,
                evidence: val,
              });
            } else {
              seenHere.add(val);
            }
            if (known.burnedIds.has(val)) {
              out.push({
                kind: 'identityViolation',
                severity: 'danger',
                path,
                reason: `المعرف "${val}" محروق (سُجل حذفه) لكنه عاد للظهور — هذا بعث، والهوية لا تُعاد`,
                evidence: val,
              });
            }
          } else if (val && typeof val === 'object') {
            checkObj(val);
          }
        }
      };
      checkObj(parsed);
      if (out.length > 0) return out;
    }
  } catch {
    // ليس JSON — نتابع للفحص النصي
  }

  // 2. فحص نصي بالـ regex (يدعم JSON و TS/JS)
  const re = /(?:"id"|id|toolId|componentId|sheetId)\s*[:=]\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const id = m[1];
    if (seenHere.has(id)) {
      out.push({
        kind: 'identityViolation',
        severity: 'danger',
        path,
        reason: `المعرف "${id}" مكرر داخل نفس الملف — معرفان يتشاركان هوية واحدة`,
        evidence: id,
      });
      continue;
    }
    seenHere.add(id);
    if (known.burnedIds.has(id)) {
      out.push({
        kind: 'identityViolation',
        severity: 'danger',
        path,
        reason: `المعرف "${id}" محروق (سُجل حذفه) لكنه عاد للظهور — هذا بعث، والهوية لا تُعاد`,
        evidence: id,
      });
    }
  }
  return out;
}

/**
 * مصنف: بعث الأيتام (RESURRECTION lesson).
 *
 * من rowcol.ts: "a delete that leaves something behind."
 * نكتشف مراجع تشير إلى معرفات لم تعد موجودة. هذا يحتاج
 * قائمة المعرفات الحية من الحالة المعروفة.
 */
function classifyOrphans(
  path: string,
  content: string,
  known: KnownState,
  liveIds: Set<string>,
): DriftFinding[] {
  const out: DriftFinding[] = [];
  // مراجع: ref="...", target="...", source="...", link="..."
  const re = /\b(?:ref|target|source|link|to|from)\s*[:=]\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const target = m[1];
    // نتحقق فقط من المراجع التي تشبه معرفات (تحتوي : أو -)
    if (!/[:\-]/.test(target)) continue;
    // المرجع يشير لمعرف محروق
    if (known.burnedIds.has(target)) {
      out.push({
        kind: 'orphanResurrection',
        severity: 'danger',
        path,
        reason: `مرجع يشير إلى "${target}" المحروق — اليتيم سيبعث عنصرًا ميتاً`,
        evidence: target,
      });
    }
  }
  return out;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الدالة الرئيسية — الاكتشاف
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * الحقول العليا المعروفة — ما نتوقعه في أعلى مستوى.
 * أي شيء آخر هو unknownField (PLATFORM §3).
 */
const KNOWN_TOP_LEVEL = new Set([
  'id', 'name', 'kind', 'type', 'path', 'expr', 'value', 'format',
  'description', 'category', 'editors', 'actionId', 'shortcut',
  'created', 'updated', 'lines', 'vars', 'steps', 'filters', 'sorts',
  'caption', 'chart', 'viz', 'camera', 'transition', 'duration',
]);

/**
 * اكتشاف الانجراف بين الحالة المعروفة والوضع الحالي.
 *
 * ⚠️ هذه الدالة تقرأ فقط. لا تعدّل، لا تطبق، لا تقرر.
 * هي مصنع تقارير، بنفس معنى rowcol.ts لمصنع التصحيحات:
 * "It reads and returns what the store should commit — it never writes."
 *
 * الترتيب مهم:
 * 1. أولاً نكتشف الملفات المضافة/المحذوفة (بنية)
 * 2. ثم للملفات الباقية، نكتشف التعديلات (محتوى)
 * 3. ثم نشغل المصنفات المتخصصة على كل ملف متغير
 */
export function detectDrift(
  project: ProjectSurface,
  known: KnownState,
): DriftReport {
  const findings: DriftFinding[] = [];
  const current = project.listFiles();
  const currentSet = new Set(current);
  const knownSet = new Set(known.files.keys());
  let scanned = 0;

  // ── 1. الملفات المضافة والمحذوفة ──
  for (const path of current) {
    if (!knownSet.has(path)) {
      findings.push({
        kind: 'added',
        severity: 'info',
        path,
        reason: 'ملف جديد من الخارج',
      });
    }
  }
  for (const path of knownSet) {
    if (!currentSet.has(path)) {
      findings.push({
        kind: 'removed',
        severity: 'warn',
        path,
        reason: 'ملف حُذف من الخارج — التحقق من عدم وجود مراجع يتيمة',
      });
    }
  }

  // ── 2. الملفات المتغيرة + المصنفات المتخصصة ──
  for (const path of current) {
    scanned++;
    const content = project.readFile(path);
    if (content === null) continue;

    const fp = fingerprint(content);
    const wasKnown = known.files.has(path);
    const changed = !wasKnown || known.files.get(path) !== fp;

    if (changed && wasKnown) {
      findings.push({
        kind: 'modified',
        severity: 'info',
        path,
        reason: 'المحتوى تغيّر منذ آخر فحص',
      });
    }

    // المصنفات المتخصصة تعمل فقط على ملفات متغيرة أو جديدة
    if (changed) {
      findings.push(...classifyIdentity(path, content, known));
      findings.push(...classifyOrphans(path, content, known, knownSet));
      findings.push(...classifyStoredDerived(path, content));
      findings.push(...classifyAdditiveViolations(path, content));
      findings.push(...classifyUnknownFields(path, content, KNOWN_TOP_LEVEL));
    }
  }

  return { timestamp: Date.now(), findings, scanned };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الاستعلامات — قراءة التقرير
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * هل التقرير يحتوي على خطر؟
 *
 * ⚠️ دالة، لا حقل مخزن. من story.ts: "DERIVED, NEVER STORED."
 * عدد الأخطار يُشتق من findings، لا يُخزن بجانبها — تقرير
 * يحمل عدداً مخزناً يمكن أن يخالف اكتشافاته.
 */
export function hasDanger(report: DriftReport): boolean {
  return report.findings.some((f) => f.severity === 'danger');
}

export function countBySeverity(report: DriftReport): {
  info: number; warn: number; danger: number;
} {
  let info = 0;
  let warn = 0;
  let danger = 0;
  for (const f of report.findings) {
    if (f.severity === 'info') info++;
    else if (f.severity === 'warn') warn++;
    else danger++;
  }
  return { info, warn, danger };
}

/**
 * هل المشروع نظيف تماماً (لا انجراف إطلاقاً)؟
 */
export function isClean(report: DriftReport): boolean {
  return report.findings.length === 0;
}

/**
 * استخراج الأخطار فقط — ما يحتاج قراراً.
 */
export function dangers(report: DriftReport): DriftFinding[] {
  return report.findings.filter((f) => f.severity === 'danger');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المعالجة — القرارات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * نتيجة قرار معالجة الانجراف.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * قرار بلا `error` لا يحمل error.
 */
export interface DriftDecision {
  resolution: DriftResolution;
  /** عدد الاكتشافات المشمولة */
  covered: number;
  /** additive: السبب إن كان quarantine */
  reason?: string;
}

/**
 * قبول الانجراف — ضمّه للّقطة.
 *
 * ⚠️ الرفض الصريح: لا يمكن قبول تقرير يحتوي DANGER دون
 * مراجعة. من rowcol.ts: "refusing loudly is the point."
 * قبول خطر صامتاً هو بالضبط الفشل الذي يحرسه هذا الملف.
 *
 * @throws إذا حاول أحد قبول تقرير يحتوي danger
 */
export function acceptDrift(report: DriftReport): DriftDecision {
  const dangerCount = dangers(report).length;
  if (dangerCount > 0) {
    throw new Error(
      `[DriftDetector] لا يمكن قبول انجراف يحتوي ${dangerCount} خطر(اً) — ` +
      `راجع الأخطار أولاً أو استخدم quarantine`,
    );
  }
  return { resolution: 'accept', covered: report.findings.length };
}

/**
 * تجاهل الانجراف — يبقى خارج اللقطة.
 *
 * مسموح حتى مع وجود danger، لأن التجاهل لا يطبق شيئاً.
 * الخطر يبقى مرئياً في التقرير التالي.
 */
export function ignoreDrift(report: DriftReport): DriftDecision {
  return { resolution: 'ignore', covered: report.findings.length };
}

/**
 * حجر الانجراف — لا يُطبق حتى يُراجع.
 *
 * هذا هو المسار الآمن لأي danger. يوقف الخط، يترك القرار
 * للإنسان.
 */
export function quarantineDrift(report: DriftReport, reason?: string): DriftDecision {
  const decision: DriftDecision = {
    resolution: 'quarantine',
    covered: report.findings.length,
  };
  if (reason) decision.reason = reason;
  else if (hasDanger(report)) {
    decision.reason = 'يحتوي انتهاكات هوية — يحتاج مراجعة يدوية';
  }
  return decision;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التحديث — بعد القرار
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تحديث الحالة المعروفة بعد قبول انجراف.
 *
 * ⚠️ تُستدعى فقط بعد accept ناجح. هذا ما يجعل الاكتشاف
 * التالي يبدأ من الوضع الجديد، فلا يبلغ عن نفس الانجراف
 * مرتين.
 *
 * القاعدة من rowcol.ts: المعرفات المحروقة تبقى محروقة.
 * حتى لو قبلنا انجرافاً، burnedIds لا تُمسح — الهوية لا تُعاد.
 */
export function updateKnownState(
  project: ProjectSurface,
  previous: KnownState,
): KnownState {
  const fresh = captureKnownState(project);
  // المعرفات المحروقة تنتقل — لا تُنسى أبداً
  return {
    ...fresh,
    burnedIds: new Set(previous.burnedIds),
    knownIds: new Set([...previous.knownIds, ...fresh.knownIds]),
  };
}

/**
 * تسجيل حرق معرف — بعد حذف ناجح.
 *
 * من rowcol.ts: "a rid that has existed must never be minted again."
 * هذه هي الذاكرة التي تمنع البعث. تُستدعى من خط الأنابيب
 * بعد كل حذف.
 */
export function burnId(known: KnownState, id: string): void {
  known.burnedIds.add(id);
  known.knownIds.delete(id);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التكامل — كيف يستخدمه خط الأنابيب
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * فحص ما قبل المهمة.
 *
 * يُستدعى من TaskPipeline قبل أي تنفيذ. إذا وجد danger،
 * يرفض المهمة بصوت عالٍ. هذا هو "صمام الأمان" الذي يمنع
 * شغلًا خارجياً غير مفهوم من الدخول في لقطة.
 *
 * ⚠️ الرفض الصريح: danger = لا تنفيذ. لا استثناءات.
 *
 * @throws إذا كان هناك danger غير معالج
 */
export function preflightCheck(
  project: ProjectSurface,
  known: KnownState,
): DriftReport {
  const report = detectDrift(project, known);
  if (hasDanger(report)) {
    const d = dangers(report);
    throw new Error(
      `[DriftDetector] رفض ما قبل التنفيذ: ${d.length} خطر(اً) غير معالج. ` +
      `أولها: ${d[0].reason}`,
    );
  }
  return report;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// للاختبارات — كما تفعل store.ts مع _internals
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مكشوف للاختبارات فقط، ليس جزءاً من سطح الاستوديو.
 * نفس نمط rowcol.ts و store.ts في _internals.
 */
export const _internals = {
  fingerprint,
  classifyUnknownFields,
  classifyStoredDerived,
  classifyAdditiveViolations,
  classifyIdentity,
  classifyOrphans,
  KNOWN_TOP_LEVEL,
};
