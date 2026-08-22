/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات تحويل OOXML وتحليل XML - DOCX Utilities
 * 🏛️ الدور: محرك مشترك - توليد وتحليل ملفات DOCX و XML
 * 📥 المستهلك: docxServices
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    OOXML Generator + XML Parser: مولد OOXML ومحلل XML
 *    مع escapeXml وتحليل عناصر DOCX
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. XML يجب أن يكون صالحاً
 *    2. التحويل يجب أن يحافظ على التنسيق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - escapeXml قبل الإدراج
 *    - fallback لتنسيق افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createZipArchive, readZipEntries, type ZipEntryInput } from "./zipUtils";

/**
 * Clean XML special characters escaping
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Converts CSS / Hex colors into 6-digit hex format for OOXML
 */
function normalizeHexColor(color: string): string | null {
  if (!color) return null;
  const clean = color.trim().toLowerCase();
  if (clean.startsWith("#")) {
    const hex = clean.replace("#", "");
    if (hex.length === 3) {
      return hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6) return hex;
  }
  if (clean.startsWith("rgb")) {
    const match = clean.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10).toString(16).padStart(2, "0");
      const g = parseInt(match[1], 10).toString(16).padStart(2, "0");
      const b = parseInt(match[2], 10).toString(16).padStart(2, "0");
      return `${r}${g}${b}`;
    }
  }
  return null;
}

/**
 * Pure OOXML DOCX Exporter
 */
export async function generateDocxFromHtml(
  htmlContent: string,
  title: string = "Document"
): Promise<Blob> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, "text/html");
  const container = doc.body.firstElementChild || doc.body;

  let bodyXml = "";

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text.trim()) {
        bodyXml += `<w:p><w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Cairo" w:hAnsi="Cairo" w:cs="Cairo"/><w:rtl/></w:rPr><w:t xml:space="preserve">${escapeXml(
          text
        )}</w:t></w:r></w:p>`;
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Headings
    if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName[1], 10);
      const textAlign = getAlignment(el);
      const runs = extractRuns(el);
      const sizeVal = level === 1 ? "36" : level === 2 ? "30" : level === 3 ? "26" : "24";

      bodyXml += `<w:p>
        <w:pPr>
          <w:pStyle w:val="Heading${level}"/>
          <w:bidi/>
          <w:jc w:val="${textAlign}"/>
          <w:spacing w:before="240" w:after="120"/>
        </w:pPr>
        ${runs.map((r) => renderRunXml(r, { isBold: true, fontSize: sizeVal })).join("")}
      </w:p>`;
      return;
    }

    // Paragraphs / Divs
    if (tagName === "p" || tagName === "div") {
      // Check if page break
      if (el.classList.contains("page-break") || el.getAttribute("data-type") === "page-break") {
        bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
        return;
      }

      const textAlign = getAlignment(el);
      const runs = extractRuns(el);

      bodyXml += `<w:p>
        <w:pPr>
          <w:bidi/>
          <w:jc w:val="${textAlign}"/>
          <w:spacing w:before="80" w:after="80" w:line="360" w:lineRule="auto"/>
        </w:pPr>
        ${runs.length > 0 ? runs.map((r) => renderRunXml(r)).join("") : '<w:r><w:t xml:space="preserve"> </w:t></w:r>'}
      </w:p>`;
      return;
    }

    // Blockquote
    if (tagName === "blockquote") {
      const runs = extractRuns(el);
      bodyXml += `<w:p>
        <w:pPr>
          <w:bidi/>
          <w:jc w:val="right"/>
          <w:ind w:right="720" w:left="0"/>
          <w:pBdr><w:right w:val="single" w:sz="24" w:space="12" w:color="3B82F6"/></w:pBdr>
        </w:pPr>
        ${runs.map((r) => renderRunXml(r, { isItalic: true, color: "64748B" })).join("")}
      </w:p>`;
      return;
    }

    // Lists (ul / ol)
    if (tagName === "ul" || tagName === "ol") {
      const items = Array.from(el.querySelectorAll(":scope > li"));
      items.forEach((li, idx) => {
        const runs = extractRuns(li as HTMLElement);
        const bulletText = tagName === "ol" ? `${idx + 1}. ` : "• ";
        bodyXml += `<w:p>
          <w:pPr>
            <w:bidi/>
            <w:jc w:val="right"/>
            <w:ind w:right="360" w:left="0"/>
          </w:pPr>
          <w:r><w:rPr><w:b/><w:rFonts w:ascii="Cairo" w:cs="Cairo"/><w:rtl/></w:rPr><w:t xml:space="preserve">${bulletText}</w:t></w:r>
          ${runs.map((r) => renderRunXml(r)).join("")}
        </w:p>`;
      });
      return;
    }

    // Tables
    if (tagName === "table") {
      const rows = Array.from(el.querySelectorAll("tr"));
      let tableXml = `<w:tbl>
        <w:tblPr>
          <w:tblW w:w="0" w:type="auto"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          </w:tblBorders>
          <w:bidiVisual/>
        </w:tblPr>`;

      for (const row of rows) {
        tableXml += `<w:tr>`;
        const cells = Array.from(row.querySelectorAll("th, td"));
        for (const cell of cells) {
          const isHeader = cell.tagName.toLowerCase() === "th";
          const cellEl = cell as HTMLElement;
          const bgColor = normalizeHexColor(cellEl.style.backgroundColor) || (isHeader ? "F1F5F9" : null);
          const runs = extractRuns(cellEl);

          tableXml += `<w:tc>
            <w:tcPr>
              <w:tcW w:w="3000" w:type="dxa"/>
              ${bgColor ? `<w:shd w:val="clear" w:color="auto" w:fill="${bgColor}"/>` : ""}
            </w:tcPr>
            <w:p>
              <w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr>
              ${runs.length > 0 ? runs.map((r) => renderRunXml(r, { isBold: isHeader })).join("") : '<w:r><w:t xml:space="preserve"> </w:t></w:r>'}
            </w:p>
          </w:tc>`;
        }
        tableXml += `</w:tr>`;
      }
      tableXml += `</w:tbl>`;
      bodyXml += tableXml;
      return;
    }

    // Default: recurse on child nodes
    Array.from(el.childNodes).forEach(processNode);
  };

  Array.from(container.childNodes).forEach(processNode);

  if (!bodyXml.trim()) {
    bodyXml = `<w:p><w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>`;
  }

  // Construct complete OOXML Package
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      <w:bidi/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:dcterms="http://purl.org/dc/terms/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>WebPainter Studio</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`;

  const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>WebPainter Next Native Document Engine</Application>
</Properties>`;

  const entries: ZipEntryInput[] = [
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: relsXml },
    { name: "word/document.xml", data: documentXml },
    { name: "docProps/core.xml", data: coreXml },
    { name: "docProps/app.xml", data: appXml },
  ];

  return createZipArchive(entries);
}

interface RunInfo {
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrike?: boolean;
  isSubscript?: boolean;
  isSuperscript?: boolean;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
}

function extractRuns(element: HTMLElement): RunInfo[] {
  const runs: RunInfo[] = [];

  const traverse = (
    node: Node,
    styles: {
      isBold?: boolean;
      isItalic?: boolean;
      isUnderline?: boolean;
      isStrike?: boolean;
      isSubscript?: boolean;
      isSuperscript?: boolean;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
    }
  ) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) {
        runs.push({ text, ...styles });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    const newStyles = { ...styles };

    if (tag === "strong" || tag === "b" || el.style.fontWeight === "bold" || parseInt(el.style.fontWeight, 10) >= 600) {
      newStyles.isBold = true;
    }
    if (tag === "em" || tag === "i" || el.style.fontStyle === "italic") {
      newStyles.isItalic = true;
    }
    if (tag === "u" || el.style.textDecoration?.includes("underline")) {
      newStyles.isUnderline = true;
    }
    if (tag === "s" || tag === "del" || tag === "strike" || el.style.textDecoration?.includes("line-through")) {
      newStyles.isStrike = true;
    }
    if (tag === "sub") {
      newStyles.isSubscript = true;
    }
    if (tag === "sup") {
      newStyles.isSuperscript = true;
    }
    if (el.style.color) {
      const hex = normalizeHexColor(el.style.color);
      if (hex) newStyles.color = hex;
    }
    if (el.style.fontFamily) {
      newStyles.fontFamily = el.style.fontFamily.replace(/['"]/g, "").split(",")[0].trim();
    }
    if (el.style.fontSize) {
      newStyles.fontSize = el.style.fontSize;
    }

    Array.from(el.childNodes).forEach((child) => traverse(child, newStyles));
  };

  Array.from(element.childNodes).forEach((child) => traverse(child, {}));
  return runs;
}

function renderRunXml(run: RunInfo, overrides?: Partial<RunInfo>): string {
  const isBold = overrides?.isBold || run.isBold;
  const isItalic = overrides?.isItalic || run.isItalic;
  const isUnderline = overrides?.isUnderline || run.isUnderline;
  const isStrike = overrides?.isStrike || run.isStrike;
  const isSubscript = overrides?.isSubscript || run.isSubscript;
  const isSuperscript = overrides?.isSuperscript || run.isSuperscript;
  const color = overrides?.color || run.color;
  const fontFamily = overrides?.fontFamily || run.fontFamily || "Cairo";

  let sizeHalfPoints = "24"; // 12pt default
  if (run.fontSize) {
    const px = parseFloat(run.fontSize);
    if (!isNaN(px)) {
      sizeHalfPoints = Math.round(px * 1.5).toString();
    }
  }

  return `<w:r>
    <w:rPr>
      <w:rFonts w:ascii="${escapeXml(fontFamily)}" w:hAnsi="${escapeXml(fontFamily)}" w:cs="${escapeXml(fontFamily)}"/>
      ${isBold ? "<w:b/>" : ""}
      ${isItalic ? "<w:i/>" : ""}
      ${isUnderline ? '<w:u w:val="single"/>' : ""}
      ${isStrike ? "<w:strike/>" : ""}
      ${isSubscript ? '<w:vertAlign w:val="subscript"/>' : ""}
      ${isSuperscript ? '<w:vertAlign w:val="superscript"/>' : ""}
      ${color ? `<w:color w:val="${color}"/>` : ""}
      <w:sz w:val="${sizeHalfPoints}"/>
      <w:rtl/>
    </w:rPr>
    <w:t xml:space="preserve">${escapeXml(run.text)}</w:t>
  </w:r>`;
}

function getAlignment(element: HTMLElement): "right" | "center" | "left" | "both" {
  const align = element.style.textAlign || element.getAttribute("align") || "";
  if (align === "center") return "center";
  if (align === "left") return "left";
  if (align === "justify") return "both";
  return "right";
}

/**
 * Pure OOXML DOCX Importer: converts `.docx` ArrayBuffer to clean semantic HTML.
 */
export async function parseDocxToHtml(buffer: ArrayBuffer): Promise<string> {
  const entries = await readZipEntries(buffer);
  const documentXmlBytes = entries.get("word/document.xml");

  if (!documentXmlBytes) {
    throw new Error("Invalid DOCX format: word/document.xml missing");
  }

  const textDecoder = new TextDecoder("utf-8");
  const xmlString = textDecoder.decode(documentXmlBytes);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const bodyEl = xmlDoc.getElementsByTagName("w:body")[0];
  if (!bodyEl) return "<p></p>";

  let htmlResult = "";

  const paragraphsAndTables = Array.from(bodyEl.children);

  for (const child of paragraphsAndTables) {
    const tagName = child.tagName;

    // Paragraph
    if (tagName === "w:p") {
      let pText = "";
      let pAlign = "right";
      let isHeading = false;
      let headingLevel = 1;

      // Check paragraph properties
      const pPr = child.getElementsByTagName("w:pPr")[0];
      if (pPr) {
        const jc = pPr.getElementsByTagName("w:jc")[0];
        if (jc) {
          const val = jc.getAttribute("w:val");
          if (val === "center") pAlign = "center";
          else if (val === "left") pAlign = "left";
          else if (val === "both") pAlign = "justify";
        }

        const pStyle = pPr.getElementsByTagName("w:pStyle")[0];
        if (pStyle) {
          const styleVal = pStyle.getAttribute("w:val") || "";
          const match = styleVal.match(/Heading(\d)/i);
          if (match) {
            isHeading = true;
            headingLevel = parseInt(match[1], 10);
          }
        }
      }

      // Read runs
      const runs = Array.from(child.getElementsByTagName("w:r"));
      for (const run of runs) {
        const tEl = run.getElementsByTagName("w:t")[0];
        if (!tEl) continue;

        let runText = escapeXml(tEl.textContent || "");
        const rPr = run.getElementsByTagName("w:rPr")[0];

        if (rPr) {
          const isBold = rPr.getElementsByTagName("w:b").length > 0;
          const isItalic = rPr.getElementsByTagName("w:i").length > 0;
          const isUnderline = rPr.getElementsByTagName("w:u").length > 0;
          const isStrike = rPr.getElementsByTagName("w:strike").length > 0;
          const colorEl = rPr.getElementsByTagName("w:color")[0];
          const colorVal = colorEl?.getAttribute("w:val");

          if (isBold) runText = `<strong>${runText}</strong>`;
          if (isItalic) runText = `<em>${runText}</em>`;
          if (isUnderline) runText = `<u>${runText}</u>`;
          if (isStrike) runText = `<s>${runText}</s>`;
          if (colorVal) runText = `<span style="color: #${colorVal}">${runText}</span>`;
        }

        pText += runText;
      }

      if (isHeading) {
        htmlResult += `<h${headingLevel} style="text-align: ${pAlign}">${pText || "<br>"}</h${headingLevel}>`;
      } else {
        htmlResult += `<p style="text-align: ${pAlign}">${pText || "<br>"}</p>`;
      }
    } else if (tagName === "w:tbl") {
      // Table
      let tableHtml = `<table border="1" style="width: 100%; border-collapse: collapse;"><tbody>`;
      const rows = Array.from(child.getElementsByTagName("w:tr"));

      for (const row of rows) {
        tableHtml += `<tr>`;
        const cells = Array.from(row.getElementsByTagName("w:tc"));
        for (const cell of cells) {
          let cellText = "";
          const cellPs = Array.from(cell.getElementsByTagName("w:p"));
          for (const cp of cellPs) {
            const texts = Array.from(cp.getElementsByTagName("w:t")).map((t) => t.textContent || "");
            cellText += texts.join("") + " ";
          }
          tableHtml += `<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">${escapeXml(
            cellText.trim()
          ) || "<br>"}</td>`;
        }
        tableHtml += `</tr>`;
      }
      tableHtml += `</tbody></table>`;
      htmlResult += tableHtml;
    }
  }

  return htmlResult || "<p></p>";
}
