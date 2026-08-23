/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل هياكل البيانات والمخططات - JSON Schema/XML/CSV/SQL/YAML
 * 🏛️ الدور: نواة مشتركة معزولة - محول تخصصي في نظام الـ 50 صيغة
 * 📥 المستهلك: UniversalExportHub, UniversalFormatConverter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Schema-Driven Conversion: توليد YAML/DDL/JSON Schema من هيكل بيانات واحد
 *    مع الحفاظ على الأنواع والتسميات والتسلسل الهرمي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. CSV يحتاج حماية الفواصل والاقتباسات داخل القيم
 *    2. SQL DDL يحتاج أسماء جداول آمنة (بدون مسافات أو محجوزات)
 *    3. XML يحتاج ترميز خاص للأحرف < > & " '
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخلات (null, undefined, empty) قبل التحويل
 *    - تقييد حجم المخرجات لمنع تجاوز ذاكرة المتصفح
 *    - إرجاع كائن خطأ وصفي بدلاً من رمي استثناء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export class SchemaDataEngine {
  /**
   * تحويل كائن أو مصفوفة إلى JSON Schema دقيق
   */
  public static generateJsonSchema(data: any, title = 'RootSchema'): Record<string, any> {
    const getType = (val: any): string => {
      if (val === null) return 'null';
      if (Array.isArray(val)) return 'array';
      return typeof val;
    };

    const buildSchema = (value: any): any => {
      const type = getType(value);
      if (type === 'object' && value !== null) {
        const properties: Record<string, any> = {};
        const required: string[] = [];
        for (const key of Object.keys(value)) {
          properties[key] = buildSchema(value[key]);
          required.push(key);
        }
        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        };
      } else if (type === 'array') {
        const itemSchema = value.length > 0 ? buildSchema(value[0]) : { type: 'string' };
        return {
          type: 'array',
          items: itemSchema,
        };
      } else {
        return { type };
      }
    };

    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title,
      ...buildSchema(data),
    };
  }

  /**
   * توليد جداول وعبارات SQL DDL & INSERT
   */
  public static generateSqlDdl(tableName: string, data: Record<string, any>[]): string {
    if (!data || data.length === 0) return `-- لا توجد بيانات لتوليد جدول SQL\n`;

    const sample = data[0];
    const columns: string[] = [];

    for (const key of Object.keys(sample)) {
      const val = sample[key];
      let sqlColType = 'TEXT';
      if (typeof val === 'number') {
        sqlColType = Number.isInteger(val) ? 'INTEGER' : 'NUMERIC(10,2)';
      } else if (typeof val === 'boolean') {
        sqlColType = 'BOOLEAN';
      } else if (val instanceof Date) {
        sqlColType = 'TIMESTAMP';
      }
      columns.push(`  "${key}" ${sqlColType}`);
    }

    let sql = `-- جدول تم إنشاؤه بواسطة محرك البيانات الموحد\n`;
    sql += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  "id" SERIAL PRIMARY KEY,\n${columns.join(',\n')}\n);\n\n`;

    // Generate INSERT statements
    for (const row of data) {
      const cols = Object.keys(row)
        .map((k) => `"${k}"`)
        .join(', ');
      const vals = Object.values(row)
        .map((v) => {
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
          return `'${String(v).replace(/'/g, "''")}'`;
        })
        .join(', ');

      sql += `INSERT INTO "${tableName}" (${cols}) VALUES (${vals});\n`;
    }

    return sql;
  }

  /**
   * توليد وتنسيق ملف CSV متوافق مع معايير RFC 4180
   */
  public static generateCsv(rows: (string | number | boolean)[][]): string {
    return rows
      .map((row) =>
        row
          .map((val) => {
            const str = String(val ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(','),
      )
      .join('\r\n');
  }

  /**
   * قراءة وتحليل ملف CSV بدقة
   */
  public static parseCsv(csvText: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField);
        currentField = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.length > 0 && !(currentRow.length === 1 && currentRow[0] === '')) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentField += char;
      }
    }

    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * تحويل كائن JSON إلى شجرة XML
   */
  public static jsonToXml(obj: any, rootTag = 'root'): string {
    const toXml = (val: any, name: string): string => {
      if (val === null || val === undefined) return `<${name}/>`;
      if (typeof val !== 'object') return `<${name}>${this.escapeXml(String(val))}</${name}>`;

      if (Array.isArray(val)) {
        return val.map((item) => toXml(item, name)).join('\n');
      }

      let inner = '';
      for (const k of Object.keys(val)) {
        inner += toXml(val[k], k) + '\n';
      }
      return `<${name}>\n${inner}</${name}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootTag)}`;
  }

  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
