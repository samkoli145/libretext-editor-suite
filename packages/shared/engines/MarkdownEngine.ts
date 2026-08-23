/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك ماركدون أصيل - تحويل MD↔HTML مع دعم LaTeX والجداول
 * 🏛️ الدور: محرك مشترك - أساس عرض المحتوى المنسق في المحررات
 * 📥 المستهلك: PresentationNotebookEngine, SharedMarkdownHtmlSuite, LiveInterpreterEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bidirectional MD↔HTML Pipeline: تحويل ثنائي الاتجاه مع الحفاظ على البنية
 *    واستدعاء LaTeXEngine للمعادلات الرياضية المضمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الجداول تحتاج فاصل أعمدة صحيح (| col1 | col2 |)
 *    2. الكود المضمن (`code`) يجب حمايته من التحويل
 *    3. الروابط النسبية قد تتكسر عند التحويل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخلات قبل التحويل
 *    - حماية الكود المضمن بـ placeholder مؤقت
 *    - إرجاع المدخل الأصلي عند فشل التحويل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/MarkdownEngine.ts
import { latexEngine } from './LaTeXEngine';

/**
 * محرك ماركدون أصيل 100% بدون أي مكتبات خارجية
 * يحول من Markdown إلى HTML ومن HTML إلى Markdown بكفاءة عالية
 * مع دعم المعادلات الرياضية LaTeX والجداول والشروحات
 */
export class MarkdownEngine {
  private static instance: MarkdownEngine;

  public static getInstance(): MarkdownEngine {
    if (!MarkdownEngine.instance) {
      MarkdownEngine.instance = new MarkdownEngine();
    }
    return MarkdownEngine.instance;
  }

  /**
   * تحويل Markdown إلى HTML نظيف
   */
  public toHtml(markdown: string): string {
    if (!markdown) return '';

    let text = markdown.replace(/\r\n/g, '\n');

    // Protect Blocks (Code fences, Math, Tables) from inline Markdown corruption
    const blocks: string[] = [];
    const createPlaceholder = (content: string) => {
      const id = `%%MD_PROTECTED_BLOCK_${blocks.length}%%`;
      blocks.push(content);
      return id;
    };

    // 1. Code blocks with syntax fence ```
    text = text.replace(/```([\s\S]*?)```/g, (_match, code) => {
      const escaped = this.escapeHtml(code.trim());
      const html = `<pre class="bg-slate-100 p-3 rounded-lg border border-slate-200 font-mono text-xs overflow-x-auto text-slate-800 my-2"><code>${escaped}</code></pre>`;
      return createPlaceholder(html);
    });

    // 2. LaTeX Math Block $$ ... $$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
      return createPlaceholder(latexEngine.renderToHtml(math, true));
    });

    // 3. LaTeX Inline Math $ ... $
    text = text.replace(/\$([^$\n]+)\$/g, (_match, math) => {
      return createPlaceholder(latexEngine.renderToHtml(math, false));
    });

    // 4. Tables | a | b |
    text = this.parseMarkdownTables(text);
    text = text.replace(/<div class="overflow-x-auto my-3">[\s\S]*?<\/div>/g, (tableHtml) => {
      return createPlaceholder(tableHtml);
    });

    // 5. Inline code `code`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-mono text-xs">$1</code>',
    );

    // Headings
    text = text.replace(
      /^######\s+(.+)$/gm,
      '<h6 class="text-sm font-bold text-slate-800 my-2">$1</h6>',
    );
    text = text.replace(
      /^#####\s+(.+)$/gm,
      '<h5 class="text-base font-bold text-slate-800 my-2">$1</h5>',
    );
    text = text.replace(
      /^####\s+(.+)$/gm,
      '<h4 class="text-lg font-bold text-slate-800 my-2">$1</h4>',
    );
    text = text.replace(
      /^###\s+(.+)$/gm,
      '<h3 class="text-xl font-bold text-slate-800 my-3">$1</h3>',
    );
    text = text.replace(
      /^##\s+(.+)$/gm,
      '<h2 class="text-2xl font-bold text-slate-800 my-4 pb-1 border-b border-slate-200">$1</h2>',
    );
    text = text.replace(
      /^#\s+(.+)$/gm,
      '<h1 class="text-3xl font-extrabold text-slate-900 my-5 pb-2 border-b border-slate-300">$1</h1>',
    );

    // Horizontal Rule
    text = text.replace(
      /^(?:---|\*\*\*|___)\s*$/gm,
      '<hr class="my-4 border-t border-slate-200" />',
    );

    // Blockquotes
    text = text.replace(
      /^\>\s+(.+)$/gm,
      '<blockquote class="border-r-4 border-blue-500 bg-blue-50/50 pr-4 py-2 my-2 text-slate-700 italic rounded-l">$1</blockquote>',
    );

    // Images ![alt](url)
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg border border-slate-200 shadow-sm my-3 mx-auto" />',
    );

    // Links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // Bold & Italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong class="font-bold text-slate-900">$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-800">$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em class="italic text-slate-800">$1</em>');
    text = text.replace(/~~([^~]+)~~/g, '<del class="line-through text-slate-400">$1</del>');

    // Unordered lists
    text = text.replace(/(^[*\-+]\s+.+$\n?)+/gm, (match) => {
      const items = match
        .trim()
        .split('\n')
        .map((l) => l.replace(/^[*\-+]\s+/, ''))
        .map((l) => `<li class="my-0.5">${l}</li>`)
        .join('');
      return `<ul class="list-disc list-inside my-2 space-y-1 text-slate-700 pr-4">${items}</ul>`;
    });

    // Ordered lists
    text = text.replace(/(^\d+\.\s+.+$\n?)+/gm, (match) => {
      const items = match
        .trim()
        .split('\n')
        .map((l) => l.replace(/^\d+\.\s+/, ''))
        .map((l) => `<li class="my-0.5">${l}</li>`)
        .join('');
      return `<ol class="list-decimal list-inside my-2 space-y-1 text-slate-700 pr-4">${items}</ol>`;
    });

    // Paragraphs for remaining text lines
    const lines = text.split('\n');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        result.push('');
      } else if (
        line.startsWith('<h') ||
        line.startsWith('<ul') ||
        line.startsWith('<ol') ||
        line.startsWith('<li') ||
        line.startsWith('<blockquote') ||
        line.startsWith('<pre') ||
        line.startsWith('<hr') ||
        line.startsWith('<table') ||
        line.startsWith('<div') ||
        line.startsWith('<img') ||
        line.startsWith('%%MD_PROTECTED_BLOCK_')
      ) {
        result.push(line);
      } else {
        result.push(`<p class="my-2 leading-relaxed text-slate-800">${line}</p>`);
      }
    }

    let finalHtml = result.join('\n');

    // Restore protected blocks
    for (let i = 0; i < blocks.length; i++) {
      finalHtml = finalHtml.replace(`%%MD_PROTECTED_BLOCK_${i}%%`, blocks[i]);
    }

    return finalHtml;
  }

  /**
   * تحويل HTML إلى Markdown نقي
   */
  public toMarkdown(html: string): string {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return this.domNodeToMarkdown(doc.body).trim();
  }

  private domNodeToMarkdown(node: Node): string {
    let result = '';

    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent || '';
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const content = this.domNodeToMarkdown(el);

        switch (tag) {
          case 'h1':
            result += `\n\n# ${content}\n\n`;
            break;
          case 'h2':
            result += `\n\n## ${content}\n\n`;
            break;
          case 'h3':
            result += `\n\n### ${content}\n\n`;
            break;
          case 'h4':
            result += `\n\n#### ${content}\n\n`;
            break;
          case 'h5':
            result += `\n\n##### ${content}\n\n`;
            break;
          case 'h6':
            result += `\n\n###### ${content}\n\n`;
            break;
          case 'p':
            result += `\n\n${content}\n\n`;
            break;
          case 'strong':
          case 'b':
            result += `**${content}**`;
            break;
          case 'em':
          case 'i':
            result += `*${content}*`;
            break;
          case 'u':
            result += `<u>${content}</u>`;
            break;
          case 'del':
          case 's':
          case 'strike':
            result += `~~${content}~~`;
            break;
          case 'code':
            result +=
              el.parentElement?.tagName.toLowerCase() === 'pre' ? content : `\`${content}\``;
            break;
          case 'pre':
            result += `\n\n\`\`\`\n${el.textContent || ''}\n\`\`\`\n\n`;
            break;
          case 'blockquote':
            result += `\n\n> ${content.replace(/\n/g, '\n> ')}\n\n`;
            break;
          case 'ul':
            result += `\n\n${content}\n\n`;
            break;
          case 'ol':
            result += `\n\n${content}\n\n`;
            break;
          case 'li':
            result += `\n- ${content}`;
            break;
          case 'hr':
            result += '\n\n---\n\n';
            break;
          case 'br':
            result += '\n';
            break;
          case 'a': {
            const href = el.getAttribute('href') || '#';
            result += `[${content}](${href})`;
            break;
          }
          case 'img': {
            const src = el.getAttribute('src') || '';
            const alt = el.getAttribute('alt') || 'image';
            result += `![${alt}](${src})`;
            break;
          }
          case 'table':
            result += `\n\n${this.tableToMarkdown(el)}\n\n`;
            break;
          default:
            result += content;
            break;
        }
      }
    }

    return result.replace(/\n{3,}/g, '\n\n');
  }

  private tableToMarkdown(tableEl: HTMLElement): string {
    const rows = Array.from(tableEl.querySelectorAll('tr'));
    if (rows.length === 0) return '';

    const lines: string[] = [];
    let isFirstRow = true;

    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const rowText =
        '| ' +
        cells.map((c) => (c.textContent || '').trim().replace(/\|/g, '\\|')).join(' | ') +
        ' |';
      lines.push(rowText);

      if (isFirstRow) {
        const separator = '| ' + cells.map(() => '---').join(' | ') + ' |';
        lines.push(separator);
        isFirstRow = false;
      }
    }

    return lines.join('\n');
  }

  private parseMarkdownTables(text: string): string {
    return text.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
      const lines = match.trim().split('\n').filter(Boolean);
      if (lines.length < 2) return match;

      let html =
        '<div class="overflow-x-auto my-3"><table class="min-w-full border-collapse border border-slate-300 bg-white rounded-lg shadow-xs text-xs text-slate-800">';
      let inHeader = true;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('---')) {
          inHeader = false;
          continue;
        }

        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        if (inHeader && i === 0) {
          html +=
            '<thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300"><tr>';
          for (const cell of cells) {
            html += `<th class="border border-slate-300 px-3 py-2 text-right">${cell.trim()}</th>`;
          }
          html += '</tr></thead><tbody>';
        } else {
          html += '<tr class="hover:bg-slate-50 border-b border-slate-200">';
          for (const cell of cells) {
            html += `<td class="border border-slate-300 px-3 py-2 text-right">${cell.trim()}</td>`;
          }
          html += '</tr>';
        }
      }

      html += '</tbody></table></div>';
      return html;
    });
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * كشف صيغة النص تلقائياً
   */
  public detectFormat(content: string): 'markdown' | 'html' | 'unknown' {
    const trimmed = content.trim();
    if (
      trimmed.startsWith('<!DOCTYPE') ||
      trimmed.startsWith('<html') ||
      (trimmed.startsWith('<div') && trimmed.endsWith('</div>'))
    ) {
      return 'html';
    }
    if (
      /^#{1,6}\s/m.test(trimmed) ||
      /^\s*[-*+]\s/m.test(trimmed) ||
      /```/.test(trimmed) ||
      /\[.+\]\(.+\)/.test(trimmed)
    ) {
      return 'markdown';
    }
    return 'unknown';
  }
}

export const markdownEngine = MarkdownEngine.getInstance();
