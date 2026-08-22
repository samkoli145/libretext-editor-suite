/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المحرر الأصلي للنصوص الغنية - Native Editor Core
 * 🏛️ الدور: محرك رئيسي - بديل معزول لمحرر TipTap مع Zero-Dependencies
 * 📥 المستهلك: useNativeEditor, RichTextEditor, كل ملفات rich-text
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    TipTap Replacement Engine: بديل معزول بالكامل لمحرر TipTap
 *    مع Command Chain وEvent System وHTML Output
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DOM Manipulation يجب أن تكون آمنة
 *    2. الأحداث يجب أن تصل لكل المستهلكين
 *    3. التخلص يجب أن يكون شاملاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص DOM قبل التعديل
 *    - cleanup عند dispose
 *    - fallback لمحرر فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  INativeEditor,
  ChainCommands,
  EditorSelection,
  EditorEventType,
} from "../types";

export interface NativeEditorOptions {
  content?: string | object;
  onUpdate?: (props: { editor: INativeEditor }) => void;
  onSelectionUpdate?: (props: { editor: INativeEditor }) => void;
  onFocus?: (props: { editor: INativeEditor }) => void;
  onBlur?: (props: { editor: INativeEditor }) => void;
}

export class NativeEditor implements INativeEditor {
  public element: HTMLElement | null = null;
  public isFocused: boolean = false;
  public isComposing: boolean = false;

  private listeners: Map<EditorEventType, Set<(eventData?: any) => void>> = new Map();
  private historyStack: string[] = [];
  private historyIndex: number = -1;
  private isExecutingCommand: boolean = false;
  private updateDebounceTimer: any = null;
  private initialContent: string = "";

  public state: INativeEditor["state"];
  public view: INativeEditor["view"];
  public commands: INativeEditor["commands"];

  constructor(options: NativeEditorOptions = {}) {
    this.initialContent = this.normalizeContent(options.content);

    // Initialize state
    this.state = {
      selection: { from: 0, to: 0, empty: true },
      doc: {
        descendants: (callback) => this.walkDescendants(callback),
        textContent: "",
      },
    };

    // Initialize view
    this.view = {
      coordsAtPos: (pos: number) => this.getCoordsAtPos(pos),
      dom: null,
    };

    // Initialize commands map
    this.commands = this.createCommandsMap();

    // Hook listeners passed in options
    if (options.onUpdate) this.on("update", () => options.onUpdate?.({ editor: this }));
    if (options.onSelectionUpdate) this.on("selectionUpdate", () => options.onSelectionUpdate?.({ editor: this }));
    if (options.onFocus) this.on("focus", () => options.onFocus?.({ editor: this }));
    if (options.onBlur) this.on("blur", () => options.onBlur?.({ editor: this }));
  }

  public mount(el: HTMLElement) {
    this.element = el;
    this.view.dom = el;

    if (this.initialContent) {
      this.element.innerHTML = this.initialContent;
    } else if (!this.element.innerHTML.trim()) {
      this.element.innerHTML = "<p><br></p>";
    }

    this.saveSnapshot();
    this.updateState();
  }

  public unmount() {
    this.element = null;
    this.view.dom = null;
  }

  private normalizeContent(content?: unknown): string {
    if (!content) return "<p><br></p>";
    if (typeof content === "string") return content;
    // If legacy TipTap JSON doc
    if (typeof content === "object" && content !== null) {
      return this.convertJsonToHtml(content as any);
    }
    return "<p><br></p>";
  }

  private convertJsonToHtml(json: any): string {
    if (!json || !json.content) return "<p><br></p>";
    let html = "";

    const parseNode = (node: any): string => {
      if (node.type === "text") {
        let text = node.text || "";
        if (node.marks) {
          for (const m of node.marks) {
            if (m.type === "bold") text = `<strong>${text}</strong>`;
            if (m.type === "italic") text = `<em>${text}</em>`;
            if (m.type === "underline") text = `<u>${text}</u>`;
            if (m.type === "strike") text = `<s>${text}</s>`;
            if (m.type === "subscript") text = `<sub>${text}</sub>`;
            if (m.type === "superscript") text = `<sup>${text}</sup>`;
            if (m.type === "highlight") {
              text = `<mark style="background-color: ${m.attrs?.color || "#fef08a"}">${text}</mark>`;
            }
            if (m.type === "textStyle") {
              const styles: string[] = [];
              if (m.attrs?.color) styles.push(`color: ${m.attrs.color}`);
              if (m.attrs?.fontFamily) styles.push(`font-family: ${m.attrs.fontFamily}`);
              if (m.attrs?.fontSize) styles.push(`font-size: ${m.attrs.fontSize}`);
              if (styles.length) text = `<span style="${styles.join("; ")}">${text}</span>`;
            }
            if (m.type === "link") {
              text = `<a href="${m.attrs?.href || "#"}" target="${m.attrs?.target || "_self"}">${text}</a>`;
            }
          }
        }
        return text;
      }

      if (node.type === "paragraph") {
        const inner = node.content ? node.content.map(parseNode).join("") : "<br>";
        const align = node.attrs?.textAlign;
        const style = align ? ` style="text-align: ${align}"` : "";
        return `<p${style}>${inner || "<br>"}</p>`;
      }

      if (node.type === "heading") {
        const level = node.attrs?.level || 1;
        const inner = node.content ? node.content.map(parseNode).join("") : "<br>";
        const align = node.attrs?.textAlign;
        const style = align ? ` style="text-align: ${align}"` : "";
        return `<h${level}${style}>${inner || "<br>"}</h${level}>`;
      }

      if (node.type === "bulletList") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<ul>${inner}</ul>`;
      }

      if (node.type === "orderedList") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<ol>${inner}</ol>`;
      }

      if (node.type === "listItem") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<li>${inner}</li>`;
      }

      if (node.type === "blockquote") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<blockquote>${inner}</blockquote>`;
      }

      if (node.type === "codeBlock") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<pre><code>${inner}</code></pre>`;
      }

      if (node.type === "image") {
        return `<img src="${node.attrs?.src || ""}" alt="${node.attrs?.alt || ""}" />`;
      }

      if (node.type === "table") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<table class="rich-text-table"><tbody>${inner}</tbody></table>`;
      }

      if (node.type === "tableRow") {
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<tr>${inner}</tr>`;
      }

      if (node.type === "tableCell" || node.type === "tableHeader") {
        const tag = node.type === "tableHeader" ? "th" : "td";
        const inner = node.content ? node.content.map(parseNode).join("") : "";
        return `<${tag}>${inner || "<br>"}</${tag}>`;
      }

      if (node.type === "pageBreak") {
        return `<div class="page-break" data-type="page-break" style="page-break-after: always; border-top: 2px dashed #cbd5e1; margin: 24px 0; text-align: center;"><span style="background: #f1f5f9; padding: 2px 8px; font-size: 11px; color: #64748b; border-radius: 4px;">فاصل صفحات</span></div>`;
      }

      return "";
    };

    html = json.content.map(parseNode).join("");
    return html || "<p><br></p>";
  }

  public updateState() {
    if (!this.element) return;

    const sel = window.getSelection();
    let from = 0;
    let to = 0;
    let empty = true;

    if (sel && sel.rangeCount > 0 && this.element.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      empty = range.collapsed;
      from = this.calculateOffset(range.startContainer, range.startOffset);
      to = this.calculateOffset(range.endContainer, range.endOffset);
    }

    this.state.selection = { from, to, empty };
    this.state.doc.textContent = this.element.textContent || "";
  }

  private calculateOffset(targetNode: Node, nodeOffset: number): number {
    if (!this.element) return 0;
    let offset = 0;
    const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

    let cur: Node | null = walker.nextNode();
    while (cur) {
      if (cur === targetNode) {
        if (cur.nodeType === Node.TEXT_NODE) {
          offset += nodeOffset;
        } else {
          offset += nodeOffset;
        }
        return offset;
      }
      if (cur.nodeType === Node.TEXT_NODE) {
        offset += cur.textContent?.length || 0;
      }
      cur = walker.nextNode();
    }
    return offset;
  }

  private getCoordsAtPos(pos: number): { top: number; left: number; right: number; bottom: number } {
    if (!this.element) return { top: 0, left: 0, right: 0, bottom: 0 };
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && this.element.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) {
        return {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        };
      }
    }
    const elemRect = this.element.getBoundingClientRect();
    return {
      top: elemRect.top + 20,
      left: elemRect.left + 20,
      right: elemRect.left + 20,
      bottom: elemRect.top + 40,
    };
  }

  private walkDescendants(callback: (node: any, pos: number) => boolean | void) {
    if (!this.element) return;
    const headings = Array.from(this.element.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    let pos = 0;

    for (const h of headings) {
      const level = parseInt(h.tagName[1], 10);
      const text = h.textContent || "";
      const simulatedNode = {
        type: { name: "heading" },
        attrs: { level },
        textContent: text,
      };
      callback(simulatedNode, pos);
      pos += text.length + 1;
    }
  }

  public on(event: EditorEventType, callback: (eventData?: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off(event: EditorEventType, callback: (eventData?: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  public emit(event: EditorEventType, data?: any) {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(`Error in editor listener for event '${event}':`, err);
      }
    });
  }

  public saveSnapshot() {
    if (!this.element) return;
    const html = this.element.innerHTML;
    if (this.historyIndex >= 0 && this.historyStack[this.historyIndex] === html) {
      return;
    }
    this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    this.historyStack.push(html);
    if (this.historyStack.length > 50) {
      this.historyStack.shift();
    }
    this.historyIndex = this.historyStack.length - 1;
  }

  public triggerUpdate(emitContentChange = true) {
    this.updateState();
    this.emit("transaction");
    this.emit("selectionUpdate");

    if (emitContentChange && !this.isComposing) {
      clearTimeout(this.updateDebounceTimer);
      this.updateDebounceTimer = setTimeout(() => {
        if (!this.isComposing) {
          this.saveSnapshot();
          this.emit("update");
        }
      }, 100);
    }
  }

  public getHTML(): string {
    return this.element?.innerHTML || "";
  }

  public getJSON(): any {
    return {
      type: "doc",
      content: this.htmlToStructure(this.element?.innerHTML || "<p><br></p>"),
    };
  }

  private htmlToStructure(html: string): any[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
    const container = doc.body.firstElementChild || doc.body;

    const convertNode = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        return { type: "text", text: node.textContent || "" };
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        return {
          type: "heading",
          attrs: { level: parseInt(tag[1], 10), textAlign: el.style.textAlign || "right" },
          content: Array.from(el.childNodes).map(convertNode).filter(Boolean),
        };
      }
      if (tag === "p" || tag === "div") {
        return {
          type: "paragraph",
          attrs: { textAlign: el.style.textAlign || "right" },
          content: Array.from(el.childNodes).map(convertNode).filter(Boolean),
        };
      }
      if (tag === "ul") {
        return {
          type: "bulletList",
          content: Array.from(el.childNodes).map(convertNode).filter(Boolean),
        };
      }
      if (tag === "ol") {
        return {
          type: "orderedList",
          content: Array.from(el.childNodes).map(convertNode).filter(Boolean),
        };
      }
      if (tag === "li") {
        return {
          type: "listItem",
          content: [{ type: "paragraph", content: Array.from(el.childNodes).map(convertNode).filter(Boolean) }],
        };
      }
      if (tag === "table") {
        return {
          type: "table",
          content: Array.from(el.querySelectorAll("tr")).map((tr) => ({
            type: "tableRow",
            content: Array.from(tr.querySelectorAll("th, td")).map((c) => ({
              type: c.tagName.toLowerCase() === "th" ? "tableHeader" : "tableCell",
              content: [{ type: "paragraph", content: Array.from(c.childNodes).map(convertNode).filter(Boolean) }],
            })),
          })),
        };
      }
      return {
        type: "paragraph",
        content: [{ type: "text", text: el.textContent || "" }],
      };
    };

    return Array.from(container.childNodes).map(convertNode).filter(Boolean);
  }

  public getText(): string {
    return this.element?.innerText || this.element?.textContent || "";
  }

  public isEmpty(): boolean {
    const text = this.getText().trim();
    return !text && !this.element?.querySelector("img, table");
  }

  public can() {
    return {
      undo: () => this.historyIndex > 0,
      redo: () => this.historyIndex < this.historyStack.length - 1,
    };
  }

  public isActive(name: string | Record<string, any>, attributes?: Record<string, any>): boolean {
    if (!this.element) return false;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !this.element.contains(sel.anchorNode)) return false;

    let targetNode: Node | null = sel.anchorNode;
    if (targetNode?.nodeType === Node.TEXT_NODE) {
      targetNode = targetNode.parentNode;
    }
    const currentEl = targetNode as HTMLElement | null;
    if (!currentEl) return false;

    if (typeof name === "object" && name !== null) {
      // Attribute matches e.g. { textAlign: 'center' }
      if (name.textAlign) {
        const closestBlock = this.getClosestBlock(currentEl);
        return closestBlock?.style.textAlign === name.textAlign;
      }
      return false;
    }

    switch (name) {
      case "bold":
        return document.queryCommandState("bold") || !!currentEl.closest("strong, b");
      case "italic":
        return document.queryCommandState("italic") || !!currentEl.closest("em, i");
      case "underline":
        return document.queryCommandState("underline") || !!currentEl.closest("u");
      case "strike":
        return document.queryCommandState("strikeThrough") || !!currentEl.closest("s, del, strike");
      case "subscript":
        return document.queryCommandState("subscript") || !!currentEl.closest("sub");
      case "superscript":
        return document.queryCommandState("superscript") || !!currentEl.closest("sup");
      case "heading": {
        const h = currentEl.closest("h1, h2, h3, h4, h5, h6");
        if (!h) return false;
        if (attributes?.level) {
          return h.tagName.toLowerCase() === `h${attributes.level}`;
        }
        return true;
      }
      case "bulletList":
        return !!currentEl.closest("ul");
      case "orderedList":
        return !!currentEl.closest("ol");
      case "blockquote":
        return !!currentEl.closest("blockquote");
      case "codeBlock":
        return !!currentEl.closest("pre");
      case "table":
        return !!currentEl.closest("table");
      case "link":
        return !!currentEl.closest("a");
      case "image":
        return !!currentEl.closest("img") || currentEl.tagName.toLowerCase() === "img";
      case "textAlign": {
        const block = this.getClosestBlock(currentEl);
        if (!block) return false;
        if (attributes?.alignment) return block.style.textAlign === attributes.alignment;
        return false;
      }
      default:
        return false;
    }
  }

  public getAttributes(name: string): Record<string, any> {
    if (!this.element) return {};
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !this.element.contains(sel.anchorNode)) return {};

    let targetNode: Node | null = sel.anchorNode;
    if (targetNode?.nodeType === Node.TEXT_NODE) {
      targetNode = targetNode.parentNode;
    }
    const currentEl = targetNode as HTMLElement | null;
    if (!currentEl) return {};

    if (name === "textStyle") {
      const computed = window.getComputedStyle(currentEl);
      return {
        fontFamily: currentEl.style.fontFamily || computed.fontFamily.split(",")[0].replace(/['"]/g, ""),
        fontSize: currentEl.style.fontSize || computed.fontSize,
        color: currentEl.style.color || computed.color,
      };
    }

    if (name === "highlight") {
      const mark = currentEl.closest("mark") as HTMLElement | null;
      return {
        color: mark?.style.backgroundColor || currentEl.style.backgroundColor || "#fef08a",
      };
    }

    if (name === "link") {
      const a = currentEl.closest("a") as HTMLAnchorElement | null;
      return {
        href: a?.getAttribute("href") || "",
        target: a?.getAttribute("target") || "_self",
      };
    }

    if (name === "heading") {
      const h = currentEl.closest("h1, h2, h3, h4, h5, h6");
      return {
        level: h ? parseInt(h.tagName[1], 10) : 1,
      };
    }

    return {};
  }

  private getClosestBlock(el: HTMLElement | null): HTMLElement | null {
    if (!el || !this.element) return null;
    return (
      (el.closest("p, h1, h2, h3, h4, h5, h6, blockquote, pre, li, td, th") as HTMLElement | null) ||
      this.element
    );
  }

  private executeDomCommand(action: () => void) {
    if (!this.element) return;
    this.focus();
    action();
    this.triggerUpdate(true);
  }

  public focus(): boolean {
    if (!this.element) return false;
    this.element.focus();
    this.isFocused = true;
    return true;
  }

  public blur(): boolean {
    if (!this.element) return false;
    this.element.blur();
    this.isFocused = false;
    return true;
  }

  private wrapSelectionWithTag(tagName: string, styles?: Record<string, string>) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);

    const wrapper = document.createElement(tagName);
    if (styles) {
      Object.assign(wrapper.style, styles);
    }

    if (range.collapsed) {
      wrapper.innerHTML = "&#8203;"; // Zero-width space
      range.insertNode(wrapper);
      const newRange = document.createRange();
      newRange.setStart(wrapper.firstChild || wrapper, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }

  private formatBlockTag(newTag: string) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !this.element) return;
    let node: Node | null = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
    const block = this.getClosestBlock(node as HTMLElement);

    if (block && block !== this.element && !block.closest("table")) {
      const newEl = document.createElement(newTag);
      newEl.innerHTML = block.innerHTML;
      if (block.style.textAlign) newEl.style.textAlign = block.style.textAlign;
      block.parentNode?.replaceChild(newEl, block);

      // Restore selection
      const newRange = document.createRange();
      newRange.selectNodeContents(newEl);
      newRange.collapse(false);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      document.execCommand("formatBlock", false, `<${newTag}>`);
    }
  }

  // Chain Commands builder
  public chain(): ChainCommands {
    const self = this;
    const commands: ChainCommands = {
      focus() {
        self.focus();
        return commands;
      },
      blur() {
        self.blur();
        return commands;
      },
      selectAll() {
        if (self.element) {
          const range = document.createRange();
          range.selectNodeContents(self.element);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
        return commands;
      },
      toggleBold() {
        document.execCommand("bold", false);
        return commands;
      },
      setBold() {
        document.execCommand("bold", false);
        return commands;
      },
      toggleItalic() {
        document.execCommand("italic", false);
        return commands;
      },
      setItalic() {
        document.execCommand("italic", false);
        return commands;
      },
      toggleUnderline() {
        document.execCommand("underline", false);
        return commands;
      },
      setUnderline() {
        document.execCommand("underline", false);
        return commands;
      },
      toggleStrike() {
        document.execCommand("strikeThrough", false);
        return commands;
      },
      toggleSubscript() {
        document.execCommand("subscript", false);
        return commands;
      },
      toggleSuperscript() {
        document.execCommand("superscript", false);
        return commands;
      },
      setTextAlign(alignment) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount && self.element) {
          let node: Node | null = sel.anchorNode;
          if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
          const block = self.getClosestBlock(node as HTMLElement);
          if (block) {
            block.style.textAlign = alignment;
          }
        }
        return commands;
      },
      toggleHeading({ level }) {
        if (self.isActive("heading", { level })) {
          self.formatBlockTag("p");
        } else {
          self.formatBlockTag(`h${level}`);
        }
        return commands;
      },
      setParagraph() {
        self.formatBlockTag("p");
        return commands;
      },
      toggleBulletList() {
        document.execCommand("insertUnorderedList", false);
        return commands;
      },
      toggleOrderedList() {
        document.execCommand("insertOrderedList", false);
        return commands;
      },
      toggleBlockquote() {
        self.formatBlockTag("blockquote");
        return commands;
      },
      toggleCodeBlock() {
        self.formatBlockTag("pre");
        return commands;
      },
      setFontFamily(fontFamily) {
        self.wrapSelectionWithTag("span", { fontFamily: `'${fontFamily}', sans-serif` });
        return commands;
      },
      setFontSize(fontSize) {
        self.wrapSelectionWithTag("span", { fontSize });
        return commands;
      },
      setColor(color) {
        document.execCommand("foreColor", false, color);
        return commands;
      },
      unsetColor() {
        document.execCommand("removeFormat", false);
        return commands;
      },
      setHighlight(attrs) {
        const color = typeof attrs === "string" ? attrs : attrs?.color || "#fef08a";
        self.wrapSelectionWithTag("mark", { backgroundColor: color });
        return commands;
      },
      toggleHighlight(attrs) {
        const color = typeof attrs === "string" ? attrs : attrs?.color || "#fef08a";
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          let node: Node | null = sel.anchorNode;
          if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
          const mark = (node as HTMLElement)?.closest("mark");
          if (mark) {
            const parent = mark.parentNode;
            while (mark.firstChild) parent?.insertBefore(mark.firstChild, mark);
            parent?.removeChild(mark);
            return commands;
          }
        }
        self.wrapSelectionWithTag("mark", { backgroundColor: color });
        return commands;
      },
      unsetHighlight() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          let node: Node | null = sel.anchorNode;
          if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
          const mark = (node as HTMLElement)?.closest("mark");
          if (mark) {
            const parent = mark.parentNode;
            while (mark.firstChild) parent?.insertBefore(mark.firstChild, mark);
            parent?.removeChild(mark);
          }
        }
        return commands;
      },
      unsetAllMarks() {
        document.execCommand("removeFormat", false);
        return commands;
      },
      clearNodes() {
        self.formatBlockTag("p");
        document.execCommand("removeFormat", false);
        return commands;
      },
      setHorizontalRule() {
        document.execCommand("insertHorizontalRule", false);
        return commands;
      },
      setLink(attrs) {
        const sel = window.getSelection();
        const safeHref = attrs.href.trim().toLowerCase().startsWith("javascript:") ? "#" : attrs.href;
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          let a = (sel.anchorNode as HTMLElement)?.closest?.("a");
          if (a) {
            a.href = safeHref;
            if (attrs.target) a.target = attrs.target;
          } else {
            const linkEl = document.createElement("a");
            linkEl.href = safeHref;
            if (attrs.target) linkEl.target = attrs.target;
            if (range.collapsed) {
              linkEl.textContent = attrs.href;
              range.insertNode(linkEl);
            } else {
              linkEl.appendChild(range.extractContents());
              range.insertNode(linkEl);
            }
          }
        }
        return commands;
      },
      unsetLink() {
        document.execCommand("unlink", false);
        return commands;
      },
      extendMarkRange(type: string) {
        return commands;
      },
      setImage(attrs) {
        const safeSrc = attrs.src.trim().toLowerCase().startsWith("javascript:") ? "" : attrs.src;
        const safeAlt = (attrs.alt || "").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const img = `<img src="${safeSrc}" alt="${safeAlt}" style="max-width: 100%; border-radius: 8px; margin: 12px 0;" />`;
        document.execCommand("insertHTML", false, img);
        return commands;
      },
      insertContent(content) {
        document.execCommand("insertHTML", false, content);
        return commands;
      },
      setPageBreak() {
        const pb = `<div class="page-break" data-type="page-break" style="page-break-after: always; border-top: 2px dashed #cbd5e1; margin: 24px 0; text-align: center;"><span style="background: #f1f5f9; padding: 2px 8px; font-size: 11px; color: #64748b; border-radius: 4px;">فاصل صفحات</span></div><p><br></p>`;
        document.execCommand("insertHTML", false, pb);
        return commands;
      },
      insertTable(options = {}) {
        const rows = options.rows || 3;
        const cols = options.cols || 3;
        const withHeader = options.withHeaderRow !== false;

        let tableHtml = `<table class="rich-text-table" style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;"><tbody>`;
        for (let r = 0; r < rows; r++) {
          tableHtml += `<tr>`;
          for (let c = 0; c < cols; c++) {
            const isH = withHeader && r === 0;
            const tag = isH ? "th" : "td";
            const bg = isH ? "background-color: #f1f5f9; font-weight: bold;" : "";
            tableHtml += `<${tag} style="border: 1px solid #cbd5e1; padding: 8px 12px; min-width: 60px; text-align: right; ${bg}"><br></${tag}>`;
          }
          tableHtml += `</tr>`;
        }
        tableHtml += `</tbody></table><p><br></p>`;
        document.execCommand("insertHTML", false, tableHtml);
        return commands;
      },
      addRowBefore() {
        self.tableOperation((table, cell, row) => {
          const newRow = row.cloneNode(true) as HTMLTableRowElement;
          Array.from(newRow.querySelectorAll("td, th")).forEach((c) => (c.innerHTML = "<br>"));
          row.parentNode?.insertBefore(newRow, row);
        });
        return commands;
      },
      addRowAfter() {
        self.tableOperation((table, cell, row) => {
          const newRow = row.cloneNode(true) as HTMLTableRowElement;
          Array.from(newRow.querySelectorAll("td, th")).forEach((c) => (c.innerHTML = "<br>"));
          row.parentNode?.insertBefore(newRow, row.nextSibling);
        });
        return commands;
      },
      deleteRow() {
        self.tableOperation((table, cell, row) => {
          if (table.querySelectorAll("tr").length <= 1) {
            table.remove();
          } else {
            row.remove();
          }
        });
        return commands;
      },
      addColumnBefore() {
        self.tableOperation((table, cell, row) => {
          const cellIndex = Array.from(row.children).indexOf(cell);
          table.querySelectorAll("tr").forEach((r) => {
            const isH = r.querySelector("th") !== null;
            const newCell = document.createElement(isH ? "th" : "td");
            newCell.style.border = "1px solid #cbd5e1";
            newCell.style.padding = "8px 12px";
            newCell.style.textAlign = "right";
            newCell.innerHTML = "<br>";
            const target = r.children[cellIndex];
            r.insertBefore(newCell, target);
          });
        });
        return commands;
      },
      addColumnAfter() {
        self.tableOperation((table, cell, row) => {
          const cellIndex = Array.from(row.children).indexOf(cell);
          table.querySelectorAll("tr").forEach((r) => {
            const isH = r.querySelector("th") !== null;
            const newCell = document.createElement(isH ? "th" : "td");
            newCell.style.border = "1px solid #cbd5e1";
            newCell.style.padding = "8px 12px";
            newCell.style.textAlign = "right";
            newCell.innerHTML = "<br>";
            const target = r.children[cellIndex];
            r.insertBefore(newCell, target ? target.nextSibling : null);
          });
        });
        return commands;
      },
      deleteColumn() {
        self.tableOperation((table, cell, row) => {
          const cellIndex = Array.from(row.children).indexOf(cell);
          const totalCols = row.children.length;
          if (totalCols <= 1) {
            table.remove();
          } else {
            table.querySelectorAll("tr").forEach((r) => {
              r.children[cellIndex]?.remove();
            });
          }
        });
        return commands;
      },
      deleteTable() {
        self.tableOperation((table) => {
          table.remove();
        });
        return commands;
      },
      mergeCells() {
        return commands;
      },
      splitCell() {
        return commands;
      },
      mergeOrSplit() {
        return commands;
      },
      setCellAttribute(attribute, value) {
        self.tableOperation((table, cell) => {
          if (attribute === "backgroundColor" || attribute === "background") {
            cell.style.backgroundColor = value;
          } else if (attribute === "textAlign") {
            cell.style.textAlign = value;
          }
        });
        return commands;
      },
      toggleHeaderRow() {
        self.tableOperation((table) => {
          const firstRow = table.querySelector("tr");
          if (!firstRow) return;
          const isCurrentlyHeader = firstRow.querySelector("th") !== null;
          const cells = Array.from(firstRow.children);
          cells.forEach((c) => {
            const newCell = document.createElement(isCurrentlyHeader ? "td" : "th");
            newCell.innerHTML = c.innerHTML;
            newCell.style.cssText = (c as HTMLElement).style.cssText;
            if (!isCurrentlyHeader) {
              newCell.style.backgroundColor = "#f1f5f9";
              newCell.style.fontWeight = "bold";
            } else {
              newCell.style.backgroundColor = "";
              newCell.style.fontWeight = "normal";
            }
            firstRow.replaceChild(newCell, c);
          });
        });
        return commands;
      },
      toggleHeaderColumn() {
        return commands;
      },
      toggleHeaderCell() {
        return commands;
      },
      undo() {
        if (self.historyIndex > 0 && self.element) {
          self.historyIndex--;
          self.element.innerHTML = self.historyStack[self.historyIndex];
          self.triggerUpdate(false);
        }
        return commands;
      },
      redo() {
        if (self.historyIndex < self.historyStack.length - 1 && self.element) {
          self.historyIndex++;
          self.element.innerHTML = self.historyStack[self.historyIndex];
          self.triggerUpdate(false);
        }
        return commands;
      },
      setTextSelection(pos) {
        if (!self.element) return commands;
        const sel = window.getSelection();
        const range = document.createRange();
        const headings = Array.from(self.element.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        let targetEl: Element | null = null;
        let curPos = 0;

        for (const h of headings) {
          if (curPos === pos || curPos + (h.textContent?.length || 0) >= pos) {
            targetEl = h;
            break;
          }
          curPos += (h.textContent?.length || 0) + 1;
        }

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          range.selectNodeContents(targetEl);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
        return commands;
      },
      run() {
        self.triggerUpdate(true);
        return true;
      },
    };

    return commands;
  }

  private tableOperation(
    callback: (table: HTMLTableElement, cell: HTMLTableCellElement, row: HTMLTableRowElement) => void
  ) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !this.element) return;
    let node: Node | null = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
    const cell = (node as HTMLElement)?.closest("td, th") as HTMLTableCellElement | null;
    const row = (node as HTMLElement)?.closest("tr") as HTMLTableRowElement | null;
    const table = (node as HTMLElement)?.closest("table") as HTMLTableElement | null;

    if (table && cell && row) {
      callback(table, cell, row);
      this.triggerUpdate(true);
    }
  }

  private createCommandsMap(): INativeEditor["commands"] {
    const self = this;
    return {
      setContent(content: any, options?: { emitUpdate?: boolean }) {
        if (!self.element) {
          self.initialContent = self.normalizeContent(content);
          return true;
        }
        self.element.innerHTML = self.normalizeContent(content);
        self.saveSnapshot();
        if (options?.emitUpdate !== false) {
          self.triggerUpdate(true);
        }
        return true;
      },
      clearContent(emitUpdate?: boolean) {
        if (self.element) {
          self.element.innerHTML = "<p><br></p>";
          self.saveSnapshot();
          if (emitUpdate !== false) self.triggerUpdate(true);
        }
        return true;
      },
      focus() {
        return self.focus();
      },
      blur() {
        return self.blur();
      },
      undo() {
        self.chain().undo().run();
        return true;
      },
      redo() {
        self.chain().redo().run();
        return true;
      },
      toggleBold() {
        return self.chain().toggleBold().run();
      },
      toggleItalic() {
        return self.chain().toggleItalic().run();
      },
      toggleUnderline() {
        return self.chain().toggleUnderline().run();
      },
      toggleStrike() {
        return self.chain().toggleStrike().run();
      },
      toggleSubscript() {
        return self.chain().toggleSubscript().run();
      },
      toggleSuperscript() {
        return self.chain().toggleSuperscript().run();
      },
      setTextAlign(alignment) {
        return self.chain().setTextAlign(alignment).run();
      },
      toggleHeading(attrs) {
        return self.chain().toggleHeading(attrs).run();
      },
      setParagraph() {
        return self.chain().setParagraph().run();
      },
      toggleBulletList() {
        return self.chain().toggleBulletList().run();
      },
      toggleOrderedList() {
        return self.chain().toggleOrderedList().run();
      },
      toggleBlockquote() {
        return self.chain().toggleBlockquote().run();
      },
      toggleCodeBlock() {
        return self.chain().toggleCodeBlock().run();
      },
      setFontFamily(family) {
        return self.chain().setFontFamily(family).run();
      },
      setFontSize(size) {
        return self.chain().setFontSize(size).run();
      },
      setColor(color) {
        return self.chain().setColor(color).run();
      },
      setHighlight(attrs) {
        return self.chain().setHighlight(attrs).run();
      },
      unsetHighlight() {
        return self.chain().unsetHighlight().run();
      },
      unsetAllMarks() {
        return self.chain().unsetAllMarks().run();
      },
      clearNodes() {
        return self.chain().clearNodes().run();
      },
      setLink(attrs) {
        return self.chain().setLink(attrs).run();
      },
      unsetLink() {
        return self.chain().unsetLink().run();
      },
      setImage(attrs) {
        return self.chain().setImage(attrs).run();
      },
      insertContent(content) {
        return self.chain().insertContent(content).run();
      },
      setPageBreak() {
        return self.chain().setPageBreak().run();
      },
      insertTable(options) {
        return self.chain().insertTable(options).run();
      },
      addRowBefore() {
        return self.chain().addRowBefore().run();
      },
      addRowAfter() {
        return self.chain().addRowAfter().run();
      },
      deleteRow() {
        return self.chain().deleteRow().run();
      },
      addColumnBefore() {
        return self.chain().addColumnBefore().run();
      },
      addColumnAfter() {
        return self.chain().addColumnAfter().run();
      },
      deleteColumn() {
        return self.chain().deleteColumn().run();
      },
      deleteTable() {
        return self.chain().deleteTable().run();
      },
      mergeCells() {
        return self.chain().mergeCells().run();
      },
      splitCell() {
        return self.chain().splitCell().run();
      },
      setCellAttribute(attr, val) {
        return self.chain().setCellAttribute(attr, val).run();
      },
    };
  }

  public destroy() {
    this.listeners.clear();
    this.element = null;
    this.view.dom = null;
  }
}
