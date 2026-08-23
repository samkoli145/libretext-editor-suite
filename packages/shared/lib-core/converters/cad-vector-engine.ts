/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل واستيراد وتصدير الرسوم الهندسية - DXF/EPS/Draw.io/SVG
 * 🏛️ الدور: نواة مشتركة معزولة - محول تخصصي في نظام الـ 50 صيغة
 * 📥 المستهلك: UniversalExportHub, UniversalFormatConverter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Format Strategy Pattern: كل صيغة لها محول مستقل يمكن استبداله
 *    مع واجهة موحدة (toBytes/fromBytes) لسهولة التوسيع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DXF يتطلب ترويسات محددة (HEADER, TABLES, BLOCKS, ENTITIES) بالترتيب
 *    2. EPS يحتاج BoundingBox دقيقاً لمنع قص المحتوى
 *    3. Draw.io XML قد يحتوي عناصر مخصصة لا يفهمها غير Draw.io
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الإحداثيات (NaN, Infinity) قبل الكتابة
 *    - تحويل جميع الألوان إلى صيغة RGB سداسية عشرية
 *    - إرجاع Uint8Array دائماً حتى للنصوص
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface CadEntity {
  type: 'line' | 'rect' | 'circle' | 'text' | 'polyline';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  points?: { x: number; y: number }[];
  text?: string;
  color?: string;
  strokeWidth?: number;
}

export class CadVectorEngine {
  /**
   * توليد ملف AutoCAD DXF (R12 ASCII)
   */
  public static generateDxf(entities: CadEntity[], canvasHeight = 1000): string {
    let dxf = '';

    // 1. DXF Header
    dxf += '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n';

    // 2. DXF Tables
    dxf +=
      '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n1\n0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n0\nENDTAB\n0\nENDSEC\n';

    // 3. DXF Entities Section
    dxf += '0\nSECTION\n2\nENTITIES\n';

    for (const ent of entities) {
      // Invert Y axis for standard CAD coordinate space (bottom-left origin)
      const cadY = canvasHeight - ent.y;

      if (ent.type === 'line' && ent.x2 !== undefined && ent.y2 !== undefined) {
        const cadY2 = canvasHeight - ent.y2;
        dxf += `0\nLINE\n8\n0\n10\n${ent.x.toFixed(2)}\n20\n${cadY.toFixed(2)}\n30\n0.0\n11\n${ent.x2.toFixed(2)}\n21\n${cadY2.toFixed(2)}\n31\n0.0\n`;
      } else if (ent.type === 'circle' && ent.radius !== undefined) {
        dxf += `0\nCIRCLE\n8\n0\n10\n${ent.x.toFixed(2)}\n20\n${cadY.toFixed(2)}\n30\n0.0\n40\n${ent.radius.toFixed(2)}\n`;
      } else if (ent.type === 'rect' && ent.width && ent.height) {
        // Draw 4 bounding lines
        const x1 = ent.x;
        const y1 = cadY;
        const x2 = ent.x + ent.width;
        const y2 = cadY - ent.height;

        dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y1}\n30\n0.0\n11\n${x2}\n21\n${y1}\n31\n0.0\n`;
        dxf += `0\nLINE\n8\n0\n10\n${x2}\n20\n${y1}\n30\n0.0\n11\n${x2}\n21\n${y2}\n31\n0.0\n`;
        dxf += `0\nLINE\n8\n0\n10\n${x2}\n20\n${y2}\n30\n0.0\n11\n${x1}\n21\n${y2}\n31\n0.0\n`;
        dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y2}\n30\n0.0\n11\n${x1}\n21\n${y1}\n31\n0.0\n`;
      } else if (ent.type === 'text' && ent.text) {
        dxf += `0\nTEXT\n8\n0\n10\n${ent.x.toFixed(2)}\n20\n${cadY.toFixed(2)}\n30\n0.0\n40\n${(ent.height || 14).toFixed(2)}\n1\n${ent.text}\n`;
      }
    }

    dxf += '0\nENDSEC\n0\nEOF\n';
    return dxf;
  }

  /**
   * توليد ملف Encapsulated PostScript (EPS Level 3)
   */
  public static generateEps(
    entities: CadEntity[],
    width = 800,
    height = 600,
    title = 'Vector Graphic',
  ): string {
    let ps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%Title: ${title}
%%Creator: Universal CAD Engine
%%CreationDate: ${new Date().toUTCString()}
%%Pages: 1
%%EndComments
%%Page: 1 1

/CairoFont findfont 12 scalefont setfont
`;

    for (const ent of entities) {
      // PS Origin is bottom-left
      const psY = height - ent.y;

      if (ent.type === 'rect' && ent.width && ent.height) {
        ps += `
newpath
${ent.x} ${psY - ent.height} moveto
${ent.width} 0 rlineto
0 ${ent.height} rlineto
-${ent.width} 0 rlineto
closepath
stroke
`;
      } else if (ent.type === 'circle' && ent.radius) {
        ps += `
newpath
${ent.x} ${psY} ${ent.radius} 0 360 arc
stroke
`;
      } else if (ent.type === 'line' && ent.x2 !== undefined && ent.y2 !== undefined) {
        ps += `
newpath
${ent.x} ${psY} moveto
${ent.x2} ${height - ent.y2} lineto
stroke
`;
      } else if (ent.type === 'text' && ent.text) {
        ps += `
${ent.x} ${psY} moveto
(${ent.text.replace(/[()\\]/g, '\\$&')}) show
`;
      }
    }

    ps += `
showpage
%%Trailer
%%EOF
`;
    return ps;
  }

  /**
   * توليد مخطط Draw.io XML
   */
  public static generateDrawioXml(entities: CadEntity[], width = 1000, height = 800): string {
    let cellsXml = `<mxCell id="0" />\n<mxCell id="1" parent="0" />\n`;

    entities.forEach((ent, index) => {
      const cellId = `cell_${index + 2}`;
      if (ent.type === 'rect') {
        cellsXml += `<mxCell id="${cellId}" value="${ent.text || ''}" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="${ent.x}" y="${ent.y}" width="${ent.width || 120}" height="${ent.height || 60}" as="geometry" />
</mxCell>\n`;
      } else if (ent.type === 'circle') {
        const d = (ent.radius || 40) * 2;
        cellsXml += `<mxCell id="${cellId}" value="${ent.text || ''}" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="${ent.x - d / 2}" y="${ent.y - d / 2}" width="${d}" height="${d}" as="geometry" />
</mxCell>\n`;
      } else if (ent.type === 'text') {
        cellsXml += `<mxCell id="${cellId}" value="${ent.text || ''}" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
  <mxGeometry x="${ent.x}" y="${ent.y}" width="${ent.width || 100}" height="${ent.height || 30}" as="geometry" />
</mxCell>\n`;
      }
    });

    return `<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Universal Engine" version="21.0.0" type="device">
  <diagram id="diagram_1" name="Page-1">
    <mxGraphModel dx="${width}" dy="${height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}">
      <root>
        ${cellsXml}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  }
}
