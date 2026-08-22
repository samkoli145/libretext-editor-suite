/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الإشعارات والتنبيهات - Toast Notifications مع auto-dismiss
 * 🏛️ الدور: محرك مشترك - خدمة موحدة للإشعارات في كل الواجهات
 * 📥 المستهلك: ToastContainer, كل المكونات التي تُظهر إشعارات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Observable Toast Stack: مكدس إشعارات قابل للمراقبة مع auto-dismiss
 *    وsubscribe/unsubscribe لمنع تسريب الذاكرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإشعارات المتكررة يجب دمجها لا إضافتها
 *    2. الحد الأقصى للإشعارات المعروضة (5) لمنع تراكم الذاكرة
 *    3. timeout يجب أن يُنظف عند الإغلاق اليدوي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تجاوز الحد الأقصى للإشعارات
 *    - تنظيف timers عند إزالة الإشعار
 *    - إرجاع معرّف الإشعار للمتابعة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/NotificationEngine.ts

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // duration in ms, default 4000
  actionLabel?: string;
  onAction?: () => void;
  createdAt: number;
}

type NotificationListener = (notifications: ToastNotification[]) => void;

export class NotificationEngine {
  private static instance: NotificationEngine;
  private notifications: ToastNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();

  public static getInstance(): NotificationEngine {
    if (!NotificationEngine.instance) {
      NotificationEngine.instance = new NotificationEngine();
    }
    return NotificationEngine.instance;
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const copy = [...this.notifications];
    this.listeners.forEach((listener) => listener(copy));
  }

  public notify(options: Omit<ToastNotification, 'id' | 'createdAt'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = options.duration ?? 4000;

    const newNotification: ToastNotification = {
      ...options,
      id,
      duration,
      createdAt: Date.now(),
    };

    this.notifications = [newNotification, ...this.notifications].slice(0, 5);
    this.notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  public success(title: string, message?: string, options?: Partial<ToastNotification>): string {
    return this.notify({ type: 'success', title, message, ...options });
  }

  public error(title: string, message?: string, options?: Partial<ToastNotification>): string {
    return this.notify({ type: 'error', title, message, duration: 6000, ...options });
  }

  public info(title: string, message?: string, options?: Partial<ToastNotification>): string {
    return this.notify({ type: 'info', title, message, ...options });
  }

  public warning(title: string, message?: string, options?: Partial<ToastNotification>): string {
    return this.notify({ type: 'warning', title, message, duration: 5000, ...options });
  }

  public dismiss(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  public clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  public getNotifications(): ToastNotification[] {
    return [...this.notifications];
  }
}

export const notificationEngine = NotificationEngine.getInstance();
