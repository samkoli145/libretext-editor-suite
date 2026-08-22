/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خدمة إدارة تفضيلات الواجهة والتخصيص العام - UI Preferences Service
 * 🏛️ الدور: خدمة مشتركة - إدارة أحجام الأيقونات، الخطوط، حجم الخط، حالة الأشرطة
 * 📥 المستهلك: PreferencesPanel, Workbench, كل المكونات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    CSS Variable Injection: حقن متغيرات CSS على :root فوراً
 *    مع localStorage persistence و RTL support
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المتغيرات يجب أن تُحقن فوراً على :root
 *    2. الحفظ يجب أن يكون تلقائياً في localStorage
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص localStorage قبل القراءة
 *    - fallback للقيم الافتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type IconSizeMode = 'small' | 'medium' | 'large' | 'xlarge';

export interface UiPreferences {
  iconSize: IconSizeMode;
  iconSizePx: number;
  fontFamily: string;
  fontSize: number; // in pixels (e.g. 12, 13, 14, 15, 16)
  showStatusBar: boolean;
  showContextRibbon: boolean;
  showRulers: boolean;
  compactToolbox: boolean;
}

export const AVAILABLE_FONTS = [
  { id: 'Cairo', nameAr: 'خط القاهرة (Cairo)', fontStack: "'Cairo', sans-serif" },
  { id: 'Tajawal', nameAr: 'خط تجوال (Tajawal)', fontStack: "'Tajawal', sans-serif" },
  { id: 'Almarai', nameAr: 'خط المراعي (Almarai)', fontStack: "'Almarai', sans-serif" },
  { id: 'Noto Kufi Arabic', nameAr: 'نوتو كوفي (Noto Kufi Arabic)', fontStack: "'Noto Kufi Arabic', sans-serif" },
  { id: 'Noto Naskh Arabic', nameAr: 'نوتو نسخ (Noto Naskh Arabic)', fontStack: "'Noto Naskh Arabic', serif" },
  { id: 'Amiri', nameAr: 'خط أميري (Amiri)', fontStack: "'Amiri', serif" },
  { id: 'Plus Jakarta Sans', nameAr: 'بلس جاكرتا (Plus Jakarta Sans)', fontStack: "'Plus Jakarta Sans', sans-serif" },
] as const;

export const ICON_SIZES: Record<IconSizeMode, { label: string; px: number }> = {
  small: { label: 'صغير (14px)', px: 14 },
  medium: { label: 'وسط (18px)', px: 18 },
  large: { label: 'كبير (24px)', px: 24 },
  xlarge: { label: 'كبير جداً (32px)', px: 32 },
};

const STORAGE_KEY = 'webpainter.ui.prefs';

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  iconSize: 'medium',
  iconSizePx: 18,
  fontFamily: "'Cairo', sans-serif",
  fontSize: 13,
  showStatusBar: true,
  showContextRibbon: true,
  showRulers: true,
  compactToolbox: false,
};

type Listener = (prefs: UiPreferences) => void;

class UiPreferencesServiceImpl {
  private currentPrefs: UiPreferences;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.currentPrefs = this.loadPreferences();
    this.applyToRoot(this.currentPrefs);
  }

  public getPreferences(): UiPreferences {
    return { ...this.currentPrefs };
  }

  public updatePreferences(partial: Partial<UiPreferences>): UiPreferences {
    let next: UiPreferences = {
      ...this.currentPrefs,
      ...partial,
    };

    if (partial.iconSize && ICON_SIZES[partial.iconSize]) {
      next.iconSizePx = ICON_SIZES[partial.iconSize].px;
    }

    this.currentPrefs = next;
    this.savePreferences(next);
    this.applyToRoot(next);
    this.notify();
    return next;
  }

  public resetDefaults(): UiPreferences {
    this.currentPrefs = { ...DEFAULT_UI_PREFERENCES };
    this.savePreferences(this.currentPrefs);
    this.applyToRoot(this.currentPrefs);
    this.notify();
    return this.currentPrefs;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const prefs = this.getPreferences();
    this.listeners.forEach((fn) => fn(prefs));
  }

  private loadPreferences(): UiPreferences {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_UI_PREFERENCES };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_UI_PREFERENCES };
      const parsed = JSON.parse(raw);
      const iconSize = parsed.iconSize in ICON_SIZES ? parsed.iconSize : DEFAULT_UI_PREFERENCES.iconSize;
      return {
        ...DEFAULT_UI_PREFERENCES,
        ...parsed,
        iconSize,
        iconSizePx: ICON_SIZES[iconSize as IconSizeMode].px,
      };
    } catch {
      return { ...DEFAULT_UI_PREFERENCES };
    }
  }

  private savePreferences(prefs: UiPreferences): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save UI preferences to localStorage', e);
    }
  }

  public applyToRoot(prefs: UiPreferences): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--ui-icon-size', `${prefs.iconSizePx}px`);
    root.style.setProperty('--ui-font-family', prefs.fontFamily);
    root.style.setProperty('--ui-font-size', `${prefs.fontSize}px`);
  }
}

export const UiPreferencesService = new UiPreferencesServiceImpl();
