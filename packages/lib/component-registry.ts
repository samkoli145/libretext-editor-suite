/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل المكونات المعياري والمصفوفة المركزية - UI Component Registry
 * 🏛️ الدور: مكون مشترك - تعريف العقود البرمجية وحالة تسجيل المكونات
 * 📥 المستهلك: SettingsPanel, UiPreferencesService, كل مكونات الواجهة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component Matrix Registry: سجل مصفوفة المكونات
 *    مع Single Source of Truth لهيكلية الواجهة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. العقود يجب أن تبقى متوافقة مع جميع المكونات
 *    2. الحالة يجب أن تبقى متزامنة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المكون قبل التسجيل
 *    - fallback لحالة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type UIComponentCategory =
  'shell' | 'canvas-designer' | 'ui-designer' | 'rich-text' | 'pdf' | 'shared-modal' | 'tooling';

export type UIPosition =
  | 'top-bar'
  | 'right-sidebar'
  | 'left-sidebar'
  | 'bottom-bar'
  | 'canvas-center'
  | 'modal-overlay'
  | 'context-menu'
  | 'floating-dock';

export interface SupportedInteractions {
  mouseRightClick: boolean;
  keyboardShortcut?: string;
  touchSupport: boolean;
  zoomPanSupport: boolean;
}

export interface SettingsConfig {
  allowToggleVisibility: boolean;
  allowPositionChange: boolean;
  allowCustomization: boolean;
}

export interface UIComponentRegistration {
  id: string;
  nameAr: string;
  nameEn: string;
  category: UIComponentCategory;
  filePath: string;
  defaultPosition: UIPosition;
  currentPosition: UIPosition;
  isRegistered: boolean;
  isVisible: boolean;
  isDraggable: boolean;
  configKey: string;
  iconName: string;
  descriptionAr: string;
  supportedInteractions: SupportedInteractions;
  settingsConfig: SettingsConfig;
}

const STORAGE_KEY = 'webpainter.component.matrix.v1';

const INITIAL_COMPONENTS: Record<string, UIComponentRegistration> = {
  // 1. Shell Components
  tabsBar: {
    id: 'tabsBar',
    nameAr: 'شريط التبويبات العلوي',
    nameEn: 'Browser Tabs Bar',
    category: 'shell',
    filePath: 'src/shell/TabsBar.tsx',
    defaultPosition: 'top-bar',
    currentPosition: 'top-bar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showTabsBar',
    iconName: 'Layout',
    descriptionAr:
      'شريط إدارة التبويبات والمستندات المفتوحة بأسلوب المتصفح مع إجراءات الإغلاق والتنقل.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+T / Ctrl+W / Ctrl+Tab',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  contextRibbon: {
    id: 'contextRibbon',
    nameAr: 'شريط الأدوات السياقي الموحد',
    nameEn: 'Contextual Ribbon Toolbar',
    category: 'shell',
    filePath: 'src/shell/ContextualHeaderToolbar.tsx',
    defaultPosition: 'top-bar',
    currentPosition: 'top-bar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showContextRibbon',
    iconName: 'Sliders',
    descriptionAr: 'الشريط السياقي العلوي المتفاعل مع المحرر النشط وأدوات التحرير المباشرة.',
    supportedInteractions: {
      mouseRightClick: true,
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },
  drawingSidebar: {
    id: 'drawingSidebar',
    nameAr: 'شريط الأدوات والأشكال الفيكتورية',
    nameEn: 'Vector Shapes & Toolbox Sidebar',
    category: 'shell',
    filePath: 'src/shell/DrawingShapesSidebar.tsx',
    defaultPosition: 'right-sidebar',
    currentPosition: 'right-sidebar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showSidebar',
    iconName: 'Shapes',
    descriptionAr: 'الشريط الجانبي الأيمن المدمج لاختيار الأدوات ورسم المخططات والأشكال.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+B',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },
  statusBar: {
    id: 'statusBar',
    nameAr: 'شريط الحالة والمعلومات السفلي',
    nameEn: 'Slim Bottom Status Bar',
    category: 'shell',
    filePath: 'src/shell/StatusBar.tsx',
    defaultPosition: 'bottom-bar',
    currentPosition: 'bottom-bar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showStatusBar',
    iconName: 'Activity',
    descriptionAr: 'شريط معلومات أبعاد العمل، ونسبة الزووم، ولوحة الأوامر السريعة في أسفل النافذة.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+K / Ctrl+P',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  propertiesPanel: {
    id: 'propertiesPanel',
    nameAr: 'لوحة الخصائص الفيكتورية والمستندية',
    nameEn: 'Workbench Properties Panel',
    category: 'shell',
    filePath: 'src/shell/components/WorkbenchPropertiesPanel.tsx',
    defaultPosition: 'left-sidebar',
    currentPosition: 'left-sidebar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showProperties',
    iconName: 'Settings2',
    descriptionAr: 'لوحة تعديل الخصائص، والألوان، والحدود، والطبقات، وهوامش النصوص.',
    supportedInteractions: {
      mouseRightClick: true,
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },

  // 2. Editors & Studios
  canvasDesigner: {
    id: 'canvasDesigner',
    nameAr: 'استوديو الكانفا والفيكتور المتقدم',
    nameEn: 'Canvas Designer Studio',
    category: 'canvas-designer',
    filePath: 'src/features/canvas-designer/CanvasDesignerEditor.tsx',
    defaultPosition: 'canvas-center',
    currentPosition: 'canvas-center',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'activeStudio:canvas',
    iconName: 'Palette',
    descriptionAr: 'محرر الرسوم الفيكتورية، والطبقات، ومنحنيات بيزييه، وفلاتر الصور والفرشاة.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Space+Drag / Ctrl+Z / Ctrl+Y',
      touchSupport: true,
      zoomPanSupport: true,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  uiDesigner: {
    id: 'uiDesigner',
    nameAr: 'استوديو تصميم واجهات المستخدم',
    nameEn: 'UI Designer Studio',
    category: 'ui-designer',
    filePath: 'src/features/ui-designer/UIDesignerEditor.tsx',
    defaultPosition: 'canvas-center',
    currentPosition: 'canvas-center',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'activeStudio:ui',
    iconName: 'Smartphone',
    descriptionAr: 'محرر واجهات النماذج الأولية مع معاينة أحجام الهواتف والأجهزة وشجرة المكونات.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+D / Delete',
      touchSupport: true,
      zoomPanSupport: true,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  richText: {
    id: 'richText',
    nameAr: 'استوديو تحرير المستندات الغنية',
    nameEn: 'Rich Text Document Studio',
    category: 'rich-text',
    filePath: 'src/features/rich-text/RichTextEditor.tsx',
    defaultPosition: 'canvas-center',
    currentPosition: 'canvas-center',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'activeStudio:docs',
    iconName: 'FileText',
    descriptionAr: 'محرر مستندات معالج النصوص بنمط Word وأوفيس، والجداول، وهوامش الطباعة.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+B / Ctrl+I / Ctrl+U',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  pdfStudio: {
    id: 'pdfStudio',
    nameAr: 'استوديو قراءة وتعديل مستندات PDF',
    nameEn: 'PDF Studio & Annotation Editor',
    category: 'pdf',
    filePath: 'src/features/pdf/PdfEditor.tsx',
    defaultPosition: 'canvas-center',
    currentPosition: 'canvas-center',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'activeStudio:pdf',
    iconName: 'FileCheck',
    descriptionAr: 'عارض ومحرر PDF التفاعلي للشروحات، والتظليلات، وتدوير واستخراج الصفحات.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'PageUp / PageDown / Ctrl+P',
      touchSupport: true,
      zoomPanSupport: true,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },

  // 3. Modals & Dialogs
  settingsPanel: {
    id: 'settingsPanel',
    nameAr: 'لوحة الإعدادات والتفضيلات الديناميكية',
    nameEn: 'Dynamic Movable Settings Panel',
    category: 'shared-modal',
    filePath: 'src/components/SettingsPanel.tsx',
    defaultPosition: 'modal-overlay',
    currentPosition: 'modal-overlay',
    isRegistered: true,
    isVisible: true,
    isDraggable: true,
    configKey: 'showSettingsPanel',
    iconName: 'SlidersHorizontal',
    descriptionAr: 'نافذة الإعدادات الديناميكية القابلة للسحب بالفأرة وتخصيص كافة أجزاء الواجهة.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+,',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },
  formatConverter: {
    id: 'formatConverter',
    nameAr: 'محول الصيغ الـ 50 العالمي',
    nameEn: 'Universal Format Converter Modal',
    category: 'shared-modal',
    filePath: 'src/shared/components/UniversalFormatConverterModal.tsx',
    defaultPosition: 'modal-overlay',
    currentPosition: 'modal-overlay',
    isRegistered: true,
    isVisible: true,
    isDraggable: true,
    configKey: 'showFormatConverter',
    iconName: 'RefreshCw',
    descriptionAr: 'نافذة تحويل واستيراد وتصدير أكثر من 50 صيغة مستندية ونقطية وفيكتورية.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+E / Ctrl+O',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },
  imageEditor: {
    id: 'imageEditor',
    nameAr: 'محرر الصور النقطية المباشر',
    nameEn: 'Direct Image Filter & Adjuster Editor',
    category: 'shared-modal',
    filePath: 'src/shared/components/ImageEditor.tsx',
    defaultPosition: 'modal-overlay',
    currentPosition: 'modal-overlay',
    isRegistered: true,
    isVisible: true,
    isDraggable: true,
    configKey: 'showImageEditor',
    iconName: 'Image',
    descriptionAr: 'محرر فلاتر الصور، والقص، وتعديل السطوع والتباين والتشبع بالألوان.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Ctrl+S / Ctrl+Z',
      touchSupport: true,
      zoomPanSupport: true,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: true,
      allowCustomization: true,
    },
  },
  contextMenu: {
    id: 'contextMenu',
    nameAr: 'قائمة الزر الأيمن الموحدة',
    nameEn: 'Universal Right-Click Context Menu',
    category: 'tooling',
    filePath: 'src/shared/components/SharedContextMenu.tsx',
    defaultPosition: 'context-menu',
    currentPosition: 'context-menu',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'enableContextMenu',
    iconName: 'MousePointerClick',
    descriptionAr: 'القائمة السياقية الموحدة الشاملة لكافة الواجهات مع الحفاظ على حقول النصوص.',
    supportedInteractions: {
      mouseRightClick: true,
      keyboardShortcut: 'Esc',
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: false,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
  documentRuler: {
    id: 'documentRuler',
    nameAr: 'مساطر القياس والهوامش',
    nameEn: 'Document & Canvas Measurement Rulers',
    category: 'tooling',
    filePath: 'src/features/rich-text/components/DocumentRuler.tsx',
    defaultPosition: 'top-bar',
    currentPosition: 'top-bar',
    isRegistered: true,
    isVisible: true,
    isDraggable: false,
    configKey: 'showRulers',
    iconName: 'Ruler',
    descriptionAr: 'مساطر القياس بالبكسل والسنتيمتر لضبط هوامش الصفحة وأبعاد العناصر.',
    supportedInteractions: {
      mouseRightClick: true,
      touchSupport: true,
      zoomPanSupport: false,
    },
    settingsConfig: {
      allowToggleVisibility: true,
      allowPositionChange: false,
      allowCustomization: true,
    },
  },
};

type MatrixListener = (matrix: typeof ComponentMatrix) => void;

class ComponentMatrixImpl {
  public readonly version = '2026.1.0';
  public readonly theme = 'pure-light' as const;
  private components: Record<string, UIComponentRegistration>;
  private listeners: Set<MatrixListener> = new Set();

  constructor() {
    this.components = this.loadState();
  }

  public getComponent(id: string): UIComponentRegistration | undefined {
    return this.components[id];
  }

  public getAllComponents(): UIComponentRegistration[] {
    return Object.values(this.components);
  }

  public getComponentsByCategory(category: UIComponentCategory): UIComponentRegistration[] {
    return Object.values(this.components).filter((c) => c.category === category);
  }

  public getComponentsByPosition(pos: UIPosition): UIComponentRegistration[] {
    return Object.values(this.components).filter((c) => c.currentPosition === pos);
  }

  public setComponentVisibility(id: string, visible: boolean): void {
    if (this.components[id]) {
      this.components[id] = {
        ...this.components[id],
        isVisible: visible,
      };
      this.saveState();
      this.notify();
    }
  }

  public setComponentPosition(id: string, position: UIPosition): void {
    if (this.components[id]) {
      this.components[id] = {
        ...this.components[id],
        currentPosition: position,
      };
      this.saveState();
      this.notify();
    }
  }

  public resetToDefaults(): void {
    this.components = JSON.parse(JSON.stringify(INITIAL_COMPONENTS));
    this.saveState();
    this.notify();
  }

  public subscribe(listener: MatrixListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this);
      } catch (err) {
        console.error('Error in ComponentMatrix listener:', err);
      }
    });
  }

  private loadState(): Record<string, UIComponentRegistration> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return JSON.parse(JSON.stringify(INITIAL_COMPONENTS));
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return JSON.parse(JSON.stringify(INITIAL_COMPONENTS));
      const parsed = JSON.parse(stored);
      return {
        ...INITIAL_COMPONENTS,
        ...parsed,
      };
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_COMPONENTS));
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.components));
    } catch (e) {
      console.warn('Failed to save ComponentMatrix to localStorage', e);
    }
  }
}

export const ComponentMatrix = new ComponentMatrixImpl();
