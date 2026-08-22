/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: موفر إدارة ومزامنة أبعاد وتخطيطات الألواح القابلة للإرساء
 * 🏛️ الدور: مكون مشترك - مزامنة حالة الألواح والأشرطة عبر المحررات
 * 📥 المستهلك: Workbench, كل المكونات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Synchronized Dockable Layout: تخطيط موحد متزامن
 *    مع LocalStorage persistence و10% height clamp
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأبعاد يجب أن تبقى متزامنة عبر المحررات
 *    2. الشريط يجب ألا يتجاوز 10%
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص localStorage قبل القراءة
 *    - fallback لقيم افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * موفر إدارة ومزامنة أبعاد وتخطيطات الألواح والشرائط المثبتة عبر المحررات
 * (Synchronized Dockable Layout & Panels State Provider).
 * 
 * التوجهات والغرض:
 * 1. مزامنة حالة الألواح الجانبية (Left / Right Sidebars):
 *    - العرض (Width)، التثبيت (Pinned)، الرؤية (Visibility)، الطفو (Floating Position).
 * 2. مزامنة الأشرطة العلوية (Top Bars / Ribbons):
 *    - الارتفاع المقيد بنسبة 10% كحد أقصى (Strictly Clamped Height).
 *    - حالة الطي (Collapsed) والتثبيت (Pinned).
 * 3. حفظ واسترجاع التفضيلات عبر LocalStorage لضمان سلوك موحد ومتسق 100%
 *    عند التنقل والتبديل بين المحررات الأربعة (Canvas, UI, Rich Text, PDF).
 * 4. دعم الثيم الفاتح النقي 100% والتحكم الشامل بالفأرة فقط (Zero-Keyboard).
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

export interface PanelState {
  width: number;
  isPinned: boolean;
  isVisible: boolean;
  isFloating: boolean;
  floatingPos: { x: number; y: number };
}

export interface TopBarState {
  height: number;
  isCollapsed: boolean;
  isPinned: boolean;
  activeTabId?: string;
}

export interface DockableLayoutContextValue {
  // Left panel (e.g. Tools / Library / Thumbnails)
  leftPanel: PanelState;
  setLeftPanelWidth: (w: number) => void;
  toggleLeftPanelPin: () => void;
  toggleLeftPanelVisibility: () => void;
  setLeftPanelVisibility: (v: boolean) => void;
  setLeftFloatingPos: (pos: { x: number; y: number }) => void;

  // Right panel (e.g. Inspector / Layers / Properties)
  rightPanel: PanelState;
  setRightPanelWidth: (w: number) => void;
  toggleRightPanelPin: () => void;
  toggleRightPanelVisibility: () => void;
  setRightPanelVisibility: (v: boolean) => void;
  setRightFloatingPos: (pos: { x: number; y: number }) => void;

  // Top Bar / Ribbon (Clamped <= 10%)
  topBar: TopBarState;
  setTopBarHeight: (h: number) => void;
  toggleTopBarCollapsed: () => void;
  toggleTopBarPinned: () => void;
  setActiveRibbonTab: (tabId: string) => void;

  // Global layout reset
  resetLayoutDefaults: () => void;
}

const STORAGE_KEYS = {
  leftWidth: 'wp_dockable:left:width',
  leftPinned: 'wp_dockable:left:pinned',
  leftVisible: 'wp_dockable:left:visible',
  leftFloating: 'wp_dockable:left:floating',
  leftFloatingPos: 'wp_dockable:left:floatingPos',

  rightWidth: 'wp_dockable:right:width',
  rightPinned: 'wp_dockable:right:pinned',
  rightVisible: 'wp_dockable:right:visible',
  rightFloating: 'wp_dockable:right:floating',
  rightFloatingPos: 'wp_dockable:right:floatingPos',

  topBarHeight: 'wp_dockable:topbar:height',
  topBarCollapsed: 'wp_dockable:topbar:collapsed',
  topBarPinned: 'wp_dockable:topbar:pinned',
  topBarActiveTab: 'wp_dockable:topbar:activeTab',
};

const DEFAULT_LEFT_WIDTH = 280;
const DEFAULT_RIGHT_WIDTH = 300;
const DEFAULT_TOP_BAR_HEIGHT = 42;

const DockableLayoutContext = createContext<DockableLayoutContextValue | null>(null);

export function DockableLayoutProvider({ children }: { children: ReactNode }) {
  // ─── Left Panel State ───
  const [leftWidth, setLeftWidthState] = useState<number>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_LEFT_WIDTH;
    const saved = localStorage.getItem(STORAGE_KEYS.leftWidth);
    return saved ? Math.min(500, Math.max(200, Number(saved))) : DEFAULT_LEFT_WIDTH;
  });

  const [leftPinned, setLeftPinnedState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const saved = localStorage.getItem(STORAGE_KEYS.leftPinned);
    return saved !== null ? saved === 'true' : true;
  });

  const [leftVisible, setLeftVisibleState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const saved = localStorage.getItem(STORAGE_KEYS.leftVisible);
    return saved !== null ? saved === 'true' : true;
  });

  const [leftFloating, setLeftFloatingState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const saved = localStorage.getItem(STORAGE_KEYS.leftFloating);
    return saved !== null ? saved === 'true' : false;
  });

  const [leftFloatingPos, setLeftFloatingPosState] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return { x: 40, y: 80 };
    const saved = localStorage.getItem(STORAGE_KEYS.leftFloatingPos);
    try {
      return saved ? JSON.parse(saved) : { x: 40, y: 80 };
    } catch {
      return { x: 40, y: 80 };
    }
  });

  // ─── Right Panel State ───
  const [rightWidth, setRightWidthState] = useState<number>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_RIGHT_WIDTH;
    const saved = localStorage.getItem(STORAGE_KEYS.rightWidth);
    return saved ? Math.min(520, Math.max(220, Number(saved))) : DEFAULT_RIGHT_WIDTH;
  });

  const [rightPinned, setRightPinnedState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const saved = localStorage.getItem(STORAGE_KEYS.rightPinned);
    return saved !== null ? saved === 'true' : true;
  });

  const [rightVisible, setRightVisibleState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const saved = localStorage.getItem(STORAGE_KEYS.rightVisible);
    return saved !== null ? saved === 'true' : true;
  });

  const [rightFloating, setRightFloatingState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const saved = localStorage.getItem(STORAGE_KEYS.rightFloating);
    return saved !== null ? saved === 'true' : false;
  });

  const [rightFloatingPos, setRightFloatingPosState] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return { x: 800, y: 80 };
    const saved = localStorage.getItem(STORAGE_KEYS.rightFloatingPos);
    try {
      return saved ? JSON.parse(saved) : { x: 800, y: 80 };
    } catch {
      return { x: 800, y: 80 };
    }
  });

  // ─── Top Bar / Ribbon State (Clamped <= 10% viewport height) ───
  const [topBarHeight, setTopBarHeightState] = useState<number>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_TOP_BAR_HEIGHT;
    const maxAllowed = Math.floor((window.innerHeight || 800) * 0.1);
    const saved = localStorage.getItem(STORAGE_KEYS.topBarHeight);
    return saved ? Math.min(maxAllowed, Math.max(34, Number(saved))) : DEFAULT_TOP_BAR_HEIGHT;
  });

  const [topBarCollapsed, setTopBarCollapsedState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const saved = localStorage.getItem(STORAGE_KEYS.topBarCollapsed);
    return saved !== null ? saved === 'true' : false;
  });

  const [topBarPinned, setTopBarPinnedState] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const saved = localStorage.getItem(STORAGE_KEYS.topBarPinned);
    return saved !== null ? saved === 'true' : true;
  });

  const [activeRibbonTab, setActiveRibbonTabState] = useState<string>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return 'home';
    return localStorage.getItem(STORAGE_KEYS.topBarActiveTab) || 'home';
  });

  // ─── Auto-Persist State to LocalStorage ───
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEYS.leftWidth, leftWidth.toString());
      localStorage.setItem(STORAGE_KEYS.leftPinned, leftPinned.toString());
      localStorage.setItem(STORAGE_KEYS.leftVisible, leftVisible.toString());
      localStorage.setItem(STORAGE_KEYS.leftFloating, leftFloating.toString());
      localStorage.setItem(STORAGE_KEYS.leftFloatingPos, JSON.stringify(leftFloatingPos));

      localStorage.setItem(STORAGE_KEYS.rightWidth, rightWidth.toString());
      localStorage.setItem(STORAGE_KEYS.rightPinned, rightPinned.toString());
      localStorage.setItem(STORAGE_KEYS.rightVisible, rightVisible.toString());
      localStorage.setItem(STORAGE_KEYS.rightFloating, rightFloating.toString());
      localStorage.setItem(STORAGE_KEYS.rightFloatingPos, JSON.stringify(rightFloatingPos));

      localStorage.setItem(STORAGE_KEYS.topBarHeight, topBarHeight.toString());
      localStorage.setItem(STORAGE_KEYS.topBarCollapsed, topBarCollapsed.toString());
      localStorage.setItem(STORAGE_KEYS.topBarPinned, topBarPinned.toString());
      localStorage.setItem(STORAGE_KEYS.topBarActiveTab, activeRibbonTab);
    } catch {}
  }, [
    leftWidth,
    leftPinned,
    leftVisible,
    leftFloating,
    leftFloatingPos,
    rightWidth,
    rightPinned,
    rightVisible,
    rightFloating,
    rightFloatingPos,
    topBarHeight,
    topBarCollapsed,
    topBarPinned,
    activeRibbonTab,
  ]);

  // ─── Callbacks & Updaters ───
  const setLeftPanelWidth = useCallback((w: number) => {
    setLeftWidthState(Math.min(500, Math.max(200, Math.round(w))));
  }, []);

  const toggleLeftPanelPin = useCallback(() => {
    setLeftPinnedState((prev) => {
      const next = !prev;
      setLeftFloatingState(!next);
      return next;
    });
  }, []);

  const toggleLeftPanelVisibility = useCallback(() => {
    setLeftVisibleState((prev) => !prev);
  }, []);

  const setLeftPanelVisibility = useCallback((v: boolean) => {
    setLeftVisibleState(v);
  }, []);

  const setLeftFloatingPos = useCallback((pos: { x: number; y: number }) => {
    setLeftFloatingPosState(pos);
  }, []);

  const setRightPanelWidth = useCallback((w: number) => {
    setRightWidthState(Math.min(520, Math.max(220, Math.round(w))));
  }, []);

  const toggleRightPanelPin = useCallback(() => {
    setRightPinnedState((prev) => {
      const next = !prev;
      setRightFloatingState(!next);
      return next;
    });
  }, []);

  const toggleRightPanelVisibility = useCallback(() => {
    setRightVisibleState((prev) => !prev);
  }, []);

  const setRightPanelVisibility = useCallback((v: boolean) => {
    setRightVisibleState(v);
  }, []);

  const setRightFloatingPos = useCallback((pos: { x: number; y: number }) => {
    setRightFloatingPosState(pos);
  }, []);

  const setTopBarHeight = useCallback((h: number) => {
    const maxAllowed = Math.floor((typeof window !== 'undefined' ? window.innerHeight : 800) * 0.1);
    setTopBarHeightState(Math.min(maxAllowed, Math.max(34, Math.round(h))));
  }, []);

  const toggleTopBarCollapsed = useCallback(() => {
    setTopBarCollapsedState((prev) => !prev);
  }, []);

  const toggleTopBarPinned = useCallback(() => {
    setTopBarPinnedState((prev) => !prev);
  }, []);

  const setActiveRibbonTab = useCallback((tabId: string) => {
    setActiveRibbonTabState(tabId);
    setTopBarCollapsedState(false);
  }, []);

  const resetLayoutDefaults = useCallback(() => {
    setLeftWidthState(DEFAULT_LEFT_WIDTH);
    setLeftPinnedState(true);
    setLeftVisibleState(true);
    setLeftFloatingState(false);
    setLeftFloatingPosState({ x: 40, y: 80 });

    setRightWidthState(DEFAULT_RIGHT_WIDTH);
    setRightPinnedState(true);
    setRightVisibleState(true);
    setRightFloatingState(false);
    setRightFloatingPosState({ x: 800, y: 80 });

    setTopBarHeightState(DEFAULT_TOP_BAR_HEIGHT);
    setTopBarCollapsedState(false);
    setTopBarPinnedState(true);
    setActiveRibbonTabState('home');
  }, []);

  const value = useMemo<DockableLayoutContextValue>(
    () => ({
      leftPanel: {
        width: leftWidth,
        isPinned: leftPinned,
        isVisible: leftVisible,
        isFloating: leftFloating,
        floatingPos: leftFloatingPos,
      },
      setLeftPanelWidth,
      toggleLeftPanelPin,
      toggleLeftPanelVisibility,
      setLeftPanelVisibility,
      setLeftFloatingPos,

      rightPanel: {
        width: rightWidth,
        isPinned: rightPinned,
        isVisible: rightVisible,
        isFloating: rightFloating,
        floatingPos: rightFloatingPos,
      },
      setRightPanelWidth,
      toggleRightPanelPin,
      toggleRightPanelVisibility,
      setRightPanelVisibility,
      setRightFloatingPos,

      topBar: {
        height: topBarHeight,
        isCollapsed: topBarCollapsed,
        isPinned: topBarPinned,
        activeTabId: activeRibbonTab,
      },
      setTopBarHeight,
      toggleTopBarCollapsed,
      toggleTopBarPinned,
      setActiveRibbonTab,

      resetLayoutDefaults,
    }),
    [
      leftWidth,
      leftPinned,
      leftVisible,
      leftFloating,
      leftFloatingPos,
      rightWidth,
      rightPinned,
      rightVisible,
      rightFloating,
      rightFloatingPos,
      topBarHeight,
      topBarCollapsed,
      topBarPinned,
      activeRibbonTab,
      setLeftPanelWidth,
      toggleLeftPanelPin,
      toggleLeftPanelVisibility,
      setLeftPanelVisibility,
      setLeftFloatingPos,
      setRightPanelWidth,
      toggleRightPanelPin,
      toggleRightPanelVisibility,
      setRightPanelVisibility,
      setRightFloatingPos,
      setTopBarHeight,
      toggleTopBarCollapsed,
      toggleTopBarPinned,
      setActiveRibbonTab,
      resetLayoutDefaults,
    ]
  );

  return <DockableLayoutContext.Provider value={value}>{children}</DockableLayoutContext.Provider>;
}

export function useDockableLayout(): DockableLayoutContextValue {
  const context = useContext(DockableLayoutContext);
  if (!context) {
    throw new Error('useDockableLayout must be used within a DockableLayoutProvider');
  }
  return context;
}
