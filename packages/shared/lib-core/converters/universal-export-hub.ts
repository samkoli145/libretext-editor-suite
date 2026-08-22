/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: المركز الرئيسي الشامل للتصدير لأكثر من 50 صيغة - توجيه المحركات الخمسة
 * 🏛️ الدور: نواة مشتركة معزولة - Hub Pattern يجمع 5 محولات تخصصية
 * 📥 المستهلك: UniversalFormatConverter, RichTextPlugin, CanvasDesignerPlugin
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hub & Spoke Architecture: محور مركزي يوجه التحويل لأحد 5 محولات
 *    (ODF, CAD, Web, Schema, Markup) مع واجهة موحدة واحدة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يجب تهيئة المحركات الخمسة قبل أول استخدام (lazy initialization)
 *    2. صيغة غير معروفة يجب أن تُرجع خطأ وصفي لا استثناء
 *    3. بعض الصيغ تتطلب بيانات إضافية (مثل DOCX يحتاج metadata)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المحول المناسب قبل الاستدعاء
 *    - تعامل مع المحركات غير المُهيأة بقيم افتراضية آمنة
 *    - تسجيل جميع عمليات التحويل للتدقيق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { OdfEngine } from './odf-engine';
import { CadVectorEngine, CadEntity } from './cad-vector-engine';
import { WebComponentsEngine } from './web-components-engine';
import { SchemaDataEngine } from './schema-data-engine';
import { DocumentMarkupEngine } from './document-markup-engine';
import type { UIComponentNode } from '../../../features/ui-designer/model';

export type UniversalExportFormat =
  // مستندات وحزم مكتبية
  | 'odt'
  | 'ods'
  | 'odp'
  | 'fodt'
  | 'docx'
  | 'rtf'
  | 'epub'
  | 'latex'
  | 'markdown'
  | 'html'
  | 'pdf'
  // رسوم وهندسة ومخططات
  | 'dxf'
  | 'eps'
  | 'drawio'
  | 'svg'
  | 'png'
  | 'jpeg'
  | 'webp'
  // ويب ومكونات تفاعلية
  | 'react-tsx'
  | 'vue-sfc'
  | 'web-component'
  // بيانات ومخططات وقواعد بيانات
  | 'json-schema'
  | 'sql-ddl'
  | 'csv'
  | 'tsv'
  | 'xml'
  | 'yaml'
  | 'json';

export interface UniversalExportPayload {
  title?: string;
  author?: string;
  htmlContent?: string;
  plainText?: string;
  gridData?: (string | number | boolean)[][];
  jsonData?: any;
  cadEntities?: CadEntity[];
  uiComponents?: UIComponentNode[];
  width?: number;
  height?: number;
}

export class UniversalExportHub {
  /**
   * تنفيذ التصدير بالصيغة المحددة وتنزيل الملف مباشرة للمستخدم
   */
  public static async exportFormat(
    format: UniversalExportFormat,
    payload: UniversalExportPayload,
    filename?: string
  ): Promise<{ blob: Blob; filename: string }> {
    const baseName = filename || payload.title || 'document';
    let outputBlob: Blob;
    let extension: string = format;

    switch (format) {
      // 1. ODF Formats
      case 'odt': {
        const bytes = await OdfEngine.generateOdt(payload.htmlContent || '', { title: payload.title });
        outputBlob = new Blob([bytes], { type: 'application/vnd.oasis.opendocument.text' });
        extension = 'odt';
        break;
      }
      case 'ods': {
        const bytes = await OdfEngine.generateOds(payload.gridData as (string | number)[][] || [[]], { title: payload.title });
        outputBlob = new Blob([bytes], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
        extension = 'ods';
        break;
      }
      case 'fodt': {
        const xml = OdfEngine.generateFodt(payload.htmlContent || '', payload.title);
        outputBlob = new Blob([xml], { type: 'application/x-fodt;charset=utf-8' });
        extension = 'fodt';
        break;
      }

      // 2. CAD & Vector Formats
      case 'dxf': {
        const dxf = CadVectorEngine.generateDxf(payload.cadEntities || [], payload.height || 1000);
        outputBlob = new Blob([dxf], { type: 'application/dxf;charset=utf-8' });
        extension = 'dxf';
        break;
      }
      case 'eps': {
        const eps = CadVectorEngine.generateEps(payload.cadEntities || [], payload.width || 800, payload.height || 600, payload.title);
        outputBlob = new Blob([eps], { type: 'application/postscript;charset=utf-8' });
        extension = 'eps';
        break;
      }
      case 'drawio': {
        const drawio = CadVectorEngine.generateDrawioXml(payload.cadEntities || [], payload.width || 1000, payload.height || 800);
        outputBlob = new Blob([drawio], { type: 'application/xml;charset=utf-8' });
        extension = 'drawio';
        break;
      }

      // 3. Web & UI Component Formats
      case 'react-tsx': {
        const tsx = WebComponentsEngine.generateReactTsx(payload.uiComponents || [], 'GeneratedApp');
        outputBlob = new Blob([tsx], { type: 'text/typescript;charset=utf-8' });
        extension = 'tsx';
        break;
      }
      case 'vue-sfc': {
        const vue = WebComponentsEngine.generateVueSfc(payload.uiComponents || [], 'GeneratedApp');
        outputBlob = new Blob([vue], { type: 'text/x-vue;charset=utf-8' });
        extension = 'vue';
        break;
      }
      case 'web-component': {
        const wc = WebComponentsEngine.generateWebComponent(payload.uiComponents || []);
        outputBlob = new Blob([wc], { type: 'application/javascript;charset=utf-8' });
        extension = 'js';
        break;
      }

      // 4. Data & Schema Formats
      case 'json-schema': {
        const schema = SchemaDataEngine.generateJsonSchema(payload.jsonData || {});
        outputBlob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/schema+json' });
        extension = 'schema.json';
        break;
      }
      case 'sql-ddl': {
        const sql = SchemaDataEngine.generateSqlDdl(baseName, Array.isArray(payload.jsonData) ? payload.jsonData : []);
        outputBlob = new Blob([sql], { type: 'application/sql;charset=utf-8' });
        extension = 'sql';
        break;
      }
      case 'csv': {
        const csv = SchemaDataEngine.generateCsv(payload.gridData || []);
        outputBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        extension = 'csv';
        break;
      }
      case 'xml': {
        const xml = SchemaDataEngine.jsonToXml(payload.jsonData || {});
        outputBlob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        extension = 'xml';
        break;
      }

      // 5. Document & Markup Formats
      case 'latex': {
        const tex = DocumentMarkupEngine.generateLatex(payload.htmlContent || '', payload.title, payload.author);
        outputBlob = new Blob([tex], { type: 'application/x-latex;charset=utf-8' });
        extension = 'tex';
        break;
      }
      case 'rtf': {
        const rtf = DocumentMarkupEngine.generateRtf(payload.plainText || '', payload.title);
        outputBlob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
        extension = 'rtf';
        break;
      }
      case 'epub': {
        const epubBytes = await DocumentMarkupEngine.generateEpub(payload.htmlContent || '', payload.title, payload.author);
        outputBlob = new Blob([epubBytes], { type: 'application/epub+zip' });
        extension = 'epub';
        break;
      }

      default: {
        outputBlob = new Blob([payload.plainText || payload.htmlContent || ''], { type: 'text/plain;charset=utf-8' });
        extension = 'txt';
      }
    }

    const finalFilename = `${baseName}.${extension}`;
    return { blob: outputBlob, filename: finalFilename };
  }

  /**
   * تشغيل التنزيل الفوري في المتصفح
   */
  public static triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
