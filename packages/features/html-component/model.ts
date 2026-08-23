/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/html-component/model.ts
 * 🎯 الهدف الرئيسي: تعريف نموذج بيانات كتلة مكونات HTML ومحول الكود (HTML Component & Code Transformer Model)
 * 📋 المعايير: دعم هيكل الشجرة، العقد، المكونات القياسية، وتحويل الكود (HTML/JSX/TSX)
 * 🏷️ المعرف: FEAT-HTML-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical AST Component Model + Bidirectional Code Transformer (HTML/TSX)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type HTMLNodeType =
  | 'container'
  | 'card'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'input'
  | 'image'
  | 'badge'
  | 'form'
  | 'divider';

export interface HTMLNodeItem {
  id: string;
  type: HTMLNodeType;
  name: string;
  props: {
    text?: string;
    placeholder?: string;
    className?: string;
    style?: Record<string, string>;
    src?: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    tag?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'aside';
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    [key: string]: any;
  };
  children: string[]; // IDs of child nodes
}

export interface HTMLComponentData {
  rootId: string;
  nodes: Record<string, HTMLNodeItem>;
  theme: 'daylight' | 'nordic' | 'ivory';
  codeMode: 'visual' | 'code' | 'hybrid';
}

export const INITIAL_HTML_COMPONENT_DATA: HTMLComponentData = {
  rootId: 'root-node',
  nodes: {
    'root-node': {
      id: 'root-node',
      type: 'container',
      name: 'الحاوية الرئيسية (Root Container)',
      props: {
        className: 'p-6 space-y-4 bg-white rounded-xl border border-slate-200 shadow-sm',
        tag: 'div',
      },
      children: ['heading-1', 'paragraph-1', 'card-1', 'button-1'],
    },
    'heading-1': {
      id: 'heading-1',
      type: 'heading',
      name: 'عنوان رئيسي',
      props: {
        text: 'مرحباً بك في محرر مكونات HTML والواجهات',
        level: 1,
        className: 'text-2xl font-bold text-slate-900 tracking-tight',
      },
      children: [],
    },
    'paragraph-1': {
      id: 'paragraph-1',
      type: 'paragraph',
      name: 'فقرة وصفية',
      props: {
        text: 'هذه الكتلة تجمع بين تصميم الواجهات البصري ومحول الكود المتقدم (HTML & TSX) بدون فقدان أي أدوات أو وظائف.',
        className: 'text-sm text-slate-600 leading-relaxed',
      },
      children: [],
    },
    'card-1': {
      id: 'card-1',
      type: 'card',
      name: 'بطاقة تفاعلية',
      props: {
        className: 'p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3',
      },
      children: ['input-1', 'button-submit'],
    },
    'input-1': {
      id: 'input-1',
      type: 'input',
      name: 'حقل إدخال النص',
      props: {
        placeholder: 'أدخل النص هنا...',
        className:
          'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      },
      children: [],
    },
    'button-submit': {
      id: 'button-submit',
      type: 'button',
      name: 'زر إرسال',
      props: {
        text: 'تنفيذ الإجراء',
        variant: 'primary',
        className:
          'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm',
      },
      children: [],
    },
    'button-1': {
      id: 'button-1',
      type: 'button',
      name: 'زر ثانوي',
      props: {
        text: 'إضافة عنصر جديد',
        variant: 'outline',
        className:
          'px-4 py-2 bg-white text-slate-700 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-50 transition-colors',
      },
      children: [],
    },
  },
  theme: 'daylight',
  codeMode: 'hybrid',
};

/**
 * تحويل شجرة العقد إلى كود HTML نظيف ومنسق
 */
export function generateHtmlFromNodes(
  nodeId: string,
  nodes: Record<string, HTMLNodeItem>,
  indent = 0,
): string {
  const node = nodes[nodeId];
  if (!node) return '';

  const spaces = '  '.repeat(indent);
  const tagMap: Record<string, string> = {
    container: node.props.tag || 'div',
    card: 'div',
    heading: `h${node.props.level || 1}`,
    paragraph: 'p',
    button: 'button',
    input: 'input',
    image: 'img',
    badge: 'span',
    form: 'form',
    divider: 'hr',
  };

  const htmlTag = tagMap[node.type] || 'div';
  const className = node.props.className ? ` class="${node.props.className}"` : '';
  const placeholder = node.props.placeholder ? ` placeholder="${node.props.placeholder}"` : '';
  const src = node.props.src ? ` src="${node.props.src}"` : '';

  if (node.type === 'input') {
    return `${spaces}<input type="text"${className}${placeholder} />`;
  }
  if (node.type === 'divider') {
    return `${spaces}<hr${className} />`;
  }
  if (node.type === 'image') {
    return `${spaces}<img${src}${className} alt="image" />`;
  }

  const childHtml = node.children
    .map((childId) => generateHtmlFromNodes(childId, nodes, indent + 1))
    .filter(Boolean)
    .join('\n');

  const textContent = node.props.text || '';
  const inner = childHtml ? `\n${childHtml}\n${spaces}` : textContent;

  return `${spaces}<${htmlTag}${className}>${inner}</${htmlTag}>`;
}

/**
 * تحويل شجرة العقد إلى كود TSX/JSX نظيف
 */
export function generateTsxFromNodes(
  nodeId: string,
  nodes: Record<string, HTMLNodeItem>,
  indent = 0,
): string {
  const node = nodes[nodeId];
  if (!node) return '';

  const spaces = '  '.repeat(indent);
  const tagMap: Record<string, string> = {
    container: node.props.tag || 'div',
    card: 'div',
    heading: `h${node.props.level || 1}`,
    paragraph: 'p',
    button: 'button',
    input: 'input',
    image: 'img',
    badge: 'span',
    form: 'form',
    divider: 'hr',
  };

  const htmlTag = tagMap[node.type] || 'div';
  const className = node.props.className ? ` className="${node.props.className}"` : '';
  const placeholder = node.props.placeholder ? ` placeholder="${node.props.placeholder}"` : '';
  const src = node.props.src ? ` src="${node.props.src}"` : '';

  if (node.type === 'input') {
    return `${spaces}<input type="text"${className}${placeholder} />`;
  }
  if (node.type === 'divider') {
    return `${spaces}<hr${className} />`;
  }
  if (node.type === 'image') {
    return `${spaces}<img${src}${className} alt="image" />`;
  }

  const childHtml = node.children
    .map((childId) => generateTsxFromNodes(childId, nodes, indent + 1))
    .filter(Boolean)
    .join('\n');

  const textContent = node.props.text || '';
  const inner = childHtml ? `\n${childHtml}\n${spaces}` : textContent;

  return `${spaces}<${htmlTag}${className}>${inner}</${htmlTag}>`;
}
