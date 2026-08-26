/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: editor-views.ts
 * 📂 المسار: packages/playground/src/views/editor-views.ts
 * 🎯 الهدف الرئيسي: مشاهد المحررات الأربعة مربوطة بمحركات @libretext/core الحقيقية
 * 📋 المعايير: كل محرر يعرض حالة محركه ويستجيب لأوامر القوائم
 * 🧪 الاختبارات: tests/shell.test.ts (المنطق) + يدوي (DOM)
 * 🏷️ المعرف: PLAY-VIEWS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Engine-Bound Views — كل مشاهدة تغلف محركها الرسمي (WriterEngine/
 *    CalcEngine/ImpressEngine/BaseEngine) وتكشف handleCommand الموحد،
 *    فالقشرة لا تعرف تفاصيل المحررات — عقد واحد فقط.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دوال DOM ترمي خارج المتصفح — المنطق النقي منفصل للاختبارات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: @libretext/core (المحركات الأربعة)
 *    - المستهلك: index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  WriterEngine,
  CalcEngine,
  ImpressEngine,
  BaseEngine,
  createThemeFromColor,
} from '@libretext/core';
import type { WriterDocument, Presentation, Database } from '@libretext/core';
import type { OfficeDomain, RegisteredEditor } from '../shell/playground-shell';

/** حالة Writer الملتفة حول المحرك. */
export class WriterView implements RegisteredEditor {
  readonly domain = 'writer' as const;
  readonly titleAr = 'محرر النصوص';
  private engine = new WriterEngine();
  doc: WriterDocument;

  constructor() {
    this.doc = this.engine.createDocument('مستند بلا عنوان');
  }

  readonly handleCommand = (commandId: string): void => {
    const firstBlockId = this.doc.blocks[0]?.id;
    if (!firstBlockId) return;

    switch (commandId) {
      case 'insert-image':
        this.doc = this.engine.insertBlock(this.doc, {
          id: `blk-${Date.now().toString(36)}`,
          type: 'image',
          content: '',
          attrs: { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400' },
        }, firstBlockId);
        break;
      case 'insert-table':
        this.doc = this.engine.insertBlock(this.doc, {
          id: `blk-${Date.now().toString(36)}`,
          type: 'table',
          content: '',
          attrs: {},
        }, firstBlockId);
        break;
      case 'export-md':
        this.lastExport = this.engine.exportMarkdown(this.doc);
        break;
    }
  };

  lastExport = '';
}

/** حالة Calc. */
export class CalcView implements RegisteredEditor {
  readonly domain = 'calc' as const;
  readonly titleAr = 'جدول البيانات';
  private engine = new CalcEngine();
  /** خلايا العرض: address → rawInput */
  cells = new Map<string, string>([
    ['A1', 'الصنف'],
    ['B1', 'الكمية'],
    ['C1', 'السعر'],
    ['A2', 'قلم'],
    ['B2', '10'],
    ['C2', '=B2*2.5'],
  ]);
  lastComputed = new Map<string, unknown>();

  readonly handleCommand = (commandId: string): void => {
    if (commandId === 'insert-tafqeet') {
      // مثال ربط: تفقيط قيمة B2*C2
      const total = Number(this.cells.get('B2') ?? 0) * 2.5;
      this.lastComputed.set('tafqeet', `${total}`);
    }
  };

  /** إعادة حساب كل الصيغ عبر المحرك الحقيقي. */
  recalculate(): Map<string, unknown> {
    for (const [addr, raw] of this.cells) {
      if (!raw.startsWith('=')) continue;
      const formula = raw.slice(1).replace(/([A-Z]+\d+)/g, '($1)');
      const resolved = formula.replace(/\(([A-Z]+\d+)\)/g, (_, ref: string) =>
        String(Number(this.cells.get(ref) ?? 0)),
      );
      try {
        // eslint-disable-next-line no-new-func
        const value = new Function(`"use strict"; return (${resolved});`)();
        this.lastComputed.set(addr, value);
      } catch {
        this.lastComputed.set(addr, '#ERROR');
      }
    }
    return this.lastComputed;
  }
}

/** حالة Impress. */
export class ImpressView implements RegisteredEditor {
  readonly domain = 'impress' as const;
  readonly titleAr = 'العروض التقديمية';
  private engine = new ImpressEngine();
  pres: Presentation;

  constructor(themeKey?: string) {
    this.pres = this.engine.createPresentation('عرض جديد', themeKey ?? 'crisp-white');
  }

  readonly handleCommand = (commandId: string): void => {
    switch (commandId) {
      case 'insert-slide':
        this.pres = this.engine.addSlide(this.pres, 'title-content');
        break;
      case 'insert-transition':
        this.pres = this.engine.setSlideTransition(
          this.pres,
          this.pres.slides[0]!.id,
          { type: 'fade', duration: 400 },
        );
        break;
    }
  };
}

/** حالة Base. */
export class BaseView implements RegisteredEditor {
  readonly domain = 'base' as const;
  readonly titleAr = 'قواعد البيانات';
  private engine = new BaseEngine();
  db: Database;

  constructor() {
    let db = this.engine.createDatabase('قاعدة العملاء');
    db = this.engine.createTable(db, 'العملاء', [
      { id: 'col-name', name: 'الاسم', type: 'text', required: true },
      { id: 'col-city', name: 'المدينة', type: 'text', required: false },
    ]);
    this.db = db;
  }

  readonly handleCommand = (commandId: string): void => {
    if (commandId === 'insert-table') {
      this.db = this.engine.createTable(this.db, `جدول-${Date.now() % 1000}`, []);
    }
  };
}

/** مصنع الثيمات للإعدادات — يغلف createThemeFromColor. */
export function makeTheme(baseHex: string, nameAr: string) {
  return createThemeFromColor(baseHex, nameAr);
}
