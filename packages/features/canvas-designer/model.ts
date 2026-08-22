/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نموذج بيانات محرر الكانفا والرسم الفيكتوري - Canvas Designer Model
 * 🏛️ الدور: نوع مشترك - تعريفات الأنواع والواجهات لكافة عناصر الكانفا
 * 📥 المستهلك: كل ملفات canvas-designer والمحركات المشتركة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dual Model System: نموذج تدفقي (23 نوع) + نموذج مطلق ثنائي الأبعاد
 *    مع شجرة تدفقية (PageElement / WebBlock)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل أنواع العناصر يجب أن تكون مسجلة
 *    2. الافتراضيات يجب أن تتوافق مع الثيم الفاتح
 *    3. IDs يجب أن تكون فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام discriminated unions للأنواع
 *    - fallback لقيم افتراضية آمنة
 *    - تعامل مع الأنواع غير المعروفة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ElementType =
  | 'section'
  | 'container'
  | 'grid'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'card'
  | 'navbar'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'footer'
  | 'cms-list'
  | 'form'
  | 'input'
  | 'badge'
  | 'icon'
  | 'divider'
  | 'video'
  // Canvas Vector & Specialized Shapes:
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'freehand'
  | 'path'
  | 'polygon'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'hexagon'
  | 'octagon'
  | 'pentagon'
  | 'shield'
  | 'text'
  | 'latex-equation'
  | 'mindmap-node'
  | 'slide-header'
  | 'slide-footer'
  | 'special-quote'
  | 'warning-box'
  | 'arrow'
  | 'line'
  | 'connector'
  | 'callout-balloon'
  | 'step-badge'
  | 'explainer-card'
  | 'kpi-card'
  | 'spotlight-pin'
  | 'note'
  | 'diagram-node'
  | 'web-frame'
  | 'html-card'
  | 'avatar'
  | 'chart'
  | 'bezier';

export type CanvasElementType = ElementType;

export interface ElementStyles {
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gridCols?: number; // 1 to 6 or 12
  gap?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  lineHeight?: string;
  backgroundColor?: string;
  bgGradient?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  boxShadow?: string;
  opacity?: number;
  customClasses?: string;
  [key: string]: any;
}

export interface ElementProps {
  content?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  placeholder?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  iconName?: string;
  iconPosition?: 'left' | 'right';
  badgeText?: string;
  isCmsRepeater?: boolean;
  cmsCollectionId?: string;
  cmsFieldBinding?: string;
  onClickAction?: string;
  targetElementId?: string;
  customJsSnippet?: string;
  ariaLabel?: string;
  columnSpan?: number; // 1 to 12 in grid
  [key: string]: any;
}

export interface PageElement {
  id: string;
  name?: string;
  type: ElementType;
  content?: string;
  styles?: ElementStyles;
  props?: ElementProps;
  children?: PageElement[];
  isLocked?: boolean;
  isHidden?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface PageSettings {
  title: string;
  slug: string;
  primaryColor: string;
  fontFamily: string;
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'clean-white';
  customHeadCode?: string;
  clientJs?: string;
}

export interface PageDocument {
  id: string;
  name: string;
  slug: string;
  elements: PageElement[];
  settings: PageSettings;
  isPublished?: boolean;
  publishVersion?: number;
}

export interface WebBlock {
  id: string;
  type: ElementType;
  tag?: string;
  tagName?: string;
  name?: string;
  attributes?: Record<string, any>;
  styles?: Record<string, string>;
  children?: WebBlock[];
  content?: string;
  columnSpan?: number;
  [key: string]: any;
}

export interface ComponentPreset {
  id: string;
  name: string;
  nameAr: string;
  category: 'hero' | 'navbar' | 'features' | 'pricing' | 'testimonials' | 'faq' | 'cta' | 'footer' | 'cms' | 'basic' | 'callouts' | 'connectors' | 'interactive';
  descriptionAr: string;
  icon: string;
  element: PageElement;
}

export interface LayoutPreset {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  descriptionAr: string;
  template: WebBlock;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  parentId?: string;
  children?: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  layerId?: string;
  locked?: boolean;
  visible?: boolean;
  props?: Record<string, any>;
  src?: string;
  imageUrl?: string;
  alt?: string;

  // Visual Styles & Image Formatting
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  borderRadius?: number;
  shadow?: string;
  boxShadow?: string;
  shapeMask?: 'none' | 'rounded' | 'circle' | 'pill' | 'squircle' | 'hexagon' | 'octagon' | 'diamond' | 'star' | 'shield';
  animation?: 'none' | 'fade-in' | 'pulse' | 'float' | 'spin' | 'bounce' | 'slide-right' | 'slide-up';
  glossEffect?: 'none' | 'top-shine' | 'diagonal-gloss' | 'glass-card';
  softEdges?: boolean;
  colorOverlay?: string;
  colorOverlayOpacity?: number;

  // Web & DOM Properties
  tag?: string;
  rawCss?: string;
  tailwindClasses?: string;
  htmlContent?: string;

  // Flow & Flex/Grid Properties
  columnSpan?: number; // 1 to 12
  elementStyles?: ElementStyles;
  elementProps?: ElementProps;
  subElements?: PageElement[];

  // Text, Math & Label Properties
  text?: string;
  subtitle?: string;
  latex?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  lineHeight?: number | string;
  direction?: 'rtl' | 'ltr';

  // Explanations, Tutorials & WYSIWYG Callouts
  stepNumber?: number;
  calloutDescription?: string;
  pointerDirection?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  calloutPointer?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
  badgeColor?: string;
  badgeTextColor?: string;
  iconName?: string;

  // Interactive Smart Connectors & Arrows
  fromElementId?: string;
  fromAnchor?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  toElementId?: string;
  toAnchor?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  routing?: 'straight' | 'orthogonal' | 'curved';
  arrowStart?: boolean;
  arrowEnd?: boolean;
  label?: string;

  // Freehand & Vector Path Properties
  pathData?: string;
  points?: Array<{ x: number; y: number }>;
  aspectRatioLocked?: boolean;
  sides?: number;

  // Diagram & Mind Map Node Details
  nodeType?: 'process' | 'decision' | 'start' | 'end' | 'database' | 'mindmap-root' | 'mindmap-branch' | 'mindmap-sub';
  connections?: Array<{ targetId: string; label?: string; style?: 'solid' | 'dashed' }>;

  // Linked Chart & Bezier Curve Properties
  chartType?: 'bar' | 'line' | 'area' | 'donut';
  nodes?: unknown[];
  closed?: boolean;

  // Mechanical Interaction Engine & Codeless Event Triggers
  interactions?: ElementInteraction[];
}

export type InteractionTrigger =
  | 'onClick'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onScrollIntoView'
  | 'onDoubleClick';

export type InteractionAction =
  | 'scrollToElement'
  | 'openUrl'
  | 'toggleVisibility'
  | 'triggerAnimation'
  | 'playSound'
  | 'showPopup'
  | 'changeColor';

export interface ElementInteraction {
  id: string;
  trigger: InteractionTrigger;
  action: InteractionAction;
  targetElementId?: string;
  url?: string;
  targetTab?: '_self' | '_blank';
  animationType?: 'fade-in' | 'bounce' | 'pulse' | 'slide-up' | 'spin' | 'shake' | 'float';
  soundType?: 'click' | 'pop' | 'success' | 'chime' | 'laser';
  popupMessage?: string;
  colorValue?: string;
  scrollOffset?: number;
  delayMs?: number;
  enabled?: boolean;
  label?: string;
}

export interface ColorSwatchItem {
  id: string;
  name: string;
  hex: string;
  category?: string;
}

export interface ColorPaletteGroup {
  id: string;
  name: string;
  nameAr: string;
  colors: ColorSwatchItem[];
  isCustom?: boolean;
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  colorTag?: string;
}

export interface CanvasDesignerData {
  backgroundColor?: string;
  canvasSettings: {
    width: number;
    height: number;
    background: string;
    gridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
  };
  viewport: {
    zoom: number; // 0.2 to 3
    x: number;
    y: number;
    breakpoint?: 'mobile' | 'tablet' | 'desktop';
  };
  layers: CanvasLayer[];
  activeLayerId: string;
  elements: CanvasElement[];
  selectedElementIds: string[];
}

export function createDefaultCanvasData(title = 'لوحة تصميم ويب وكانفا جديدة'): CanvasDesignerData {
  const defaultLayerId = 'layer-main';
  return {
    canvasSettings: {
      width: 1280,
      height: 720,
      background: '#ffffff',
      gridSize: 20,
      showGrid: true,
      snapToGrid: true,
    },
    viewport: {
      zoom: 1,
      x: 0,
      y: 0,
      breakpoint: 'desktop',
    },
    layers: [
      {
        id: defaultLayerId,
        name: 'الطبقة الأساسية',
        visible: true,
        locked: false,
        opacity: 1,
        colorTag: '#2563eb',
      },
      {
        id: 'layer-diagrams',
        name: 'طبقة المخططات والعقد',
        visible: true,
        locked: false,
        opacity: 1,
        colorTag: '#16a34a',
      },
    ],
    activeLayerId: defaultLayerId,
    elements: [
      {
        id: 'el-nav-1',
        type: 'navbar',
        x: 40,
        y: 30,
        width: 1200,
        height: 70,
        zIndex: 1,
        layerId: defaultLayerId,
        fillColor: '#ffffff',
        strokeColor: '#e2e8f0',
        strokeWidth: 1,
        borderRadius: 12,
        text: 'ستوديو الويب الذكي',
      },
      {
        id: 'el-hero-1',
        type: 'hero',
        x: 40,
        y: 120,
        width: 1200,
        height: 260,
        zIndex: 2,
        layerId: defaultLayerId,
        fillColor: '#f8fafc',
        strokeColor: '#bfdbfe',
        strokeWidth: 1,
        borderRadius: 16,
        text: 'صمم واجهاتك وصدّر الأكواد البرمجية فورياً',
        subtitle: 'منظومة متكاملة لربط الكانفا الفيكتوري بصفحات الويب الحية بتنسيق فاتح نقي وسرعة فائقة.',
      },
      {
        id: 'el-feat-1',
        type: 'features',
        x: 40,
        y: 400,
        width: 1200,
        height: 220,
        zIndex: 3,
        layerId: defaultLayerId,
        fillColor: '#ffffff',
        strokeColor: '#e2e8f0',
        strokeWidth: 1,
        borderRadius: 16,
        text: 'ميزات المنصة الذكية',
      },
    ],
    selectedElementIds: [],
  };
}
