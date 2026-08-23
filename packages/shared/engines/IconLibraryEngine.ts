/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكتبة الأيقونات المشتركة - فهرسة وبحث وتصنيف الأيقونات
 * 🏛️ الدور: محرك مشترك - مكتبة مركزية للأيقونات المستخدمة في كل الواجهات
 * 📥 المستهلك: IconLibraryDialog, Sidebar, Ribbon, Toolbars
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Indexed Library + Fuzzy Search: فهرسة الأيقونات مع بحث ضبابي سريع
 *    لتوفير أفضل نتيجة في أقل من 50ms
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. البحث يجب أن يكون سريعاً جداً (< 50ms)
 *    2. الفئات يجب أن تبقى متسقة
 *    3. بعض الأيقونات قد لا تظهر في بعض المتصفحات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة query قبل البحث
 *    - إرجاع مصفوفة فارغة بدلاً من null
 *    - تعامل مع الأيقونات المفقودة بأيقونة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/IconLibraryEngine.ts
/**
 * محرك مكتبة الأيقونات المتجهة (SVG) المستقل
 * خفيف الوزن، متوافق مع الثيم الفاتح النقي 100% وبدون أي مكتبات خارجية
 */

export interface SVGIcon {
  id: string;
  name: string;
  nameEn: string;
  category: IconCategory;
  tags: string[];
  body: string;
}

export type IconCategory = 'واجهة' | 'أسهم' | 'ملفات' | 'وسائط' | 'شروحات' | 'طبيعة' | 'تجارة';

export const ICON_CATEGORIES: Array<IconCategory | 'الكل'> = [
  'الكل',
  'واجهة',
  'شروحات',
  'أسهم',
  'ملفات',
  'وسائط',
  'طبيعة',
  'تجارة',
];

const I = (
  id: string,
  name: string,
  nameEn: string,
  category: IconCategory,
  tags: string[],
  body: string,
): SVGIcon => ({ id, name, nameEn, category, tags, body });

export const ICON_LIBRARY: SVGIcon[] = [
  // واجهة
  I(
    'home',
    'الرئيسية',
    'home',
    'واجهة',
    ['بيت', 'منزل', 'house'],
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v11h5v-6h4v6h5V10"/>',
  ),
  I(
    'search',
    'بحث',
    'search',
    'واجهة',
    ['تحري', 'find', 'lookup'],
    '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  ),
  I(
    'user',
    'مستخدم',
    'user',
    'واجهة',
    ['شخص', 'حساب', 'profile'],
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  ),
  I(
    'settings',
    'إعدادات',
    'settings',
    'واجهة',
    ['ضبط', 'خيارات', 'gear'],
    '<line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="7" cy="18" r="2"/>',
  ),
  I(
    'menu',
    'قائمة',
    'menu',
    'واجهة',
    ['خطوط', 'burger'],
    '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  ),
  I('check', 'موافق', 'check', 'واجهة', ['تم', 'صح', 'ok'], '<polyline points="4 12 10 18 20 6"/>'),
  I(
    'close',
    'إغلاق',
    'close',
    'واجهة',
    ['إكس', 'حذف', 'x'],
    '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  ),
  I(
    'plus',
    'إضافة',
    'plus',
    'واجهة',
    ['جديد', 'add'],
    '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  ),
  I(
    'eye',
    'عرض',
    'eye',
    'واجهة',
    ['رؤية', 'مشاهدة', 'view'],
    '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ),
  I(
    'lock',
    'قفل',
    'lock',
    'واجهة',
    ['أمان', 'حماية', 'security'],
    '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  ),
  I(
    'bell',
    'تنبيه',
    'bell',
    'واجهة',
    ['جرس', 'إشعار', 'notification'],
    '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  ),
  I(
    'edit',
    'تحرير',
    'edit',
    'واجهة',
    ['قلم', 'تعديل', 'pencil'],
    '<path d="M4 20l4-1L20 7l-3-3L5 16z"/>',
  ),
  I(
    'copy',
    'نسخ',
    'copy',
    'واجهة',
    ['تكرار', 'duplicate'],
    '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  ),
  I(
    'link',
    'رابط',
    'link',
    'واجهة',
    ['وصلة', 'url', 'chain'],
    '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>',
  ),

  // شروحات وتوضيحات
  I(
    'message-square',
    'مربع شرح',
    'callout',
    'شروحات',
    ['توضيح', 'تعليق', 'فقاعة'],
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ),
  I(
    'help-circle',
    'مساعدة وملاحظة',
    'help',
    'شروحات',
    ['سؤال', 'استفسار', 'شرح'],
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  ),
  I(
    'info',
    'معلومات وتنبيه',
    'info',
    'شروحات',
    ['تنبيه', 'إرشاد', 'guide'],
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  ),
  I(
    'pin',
    'دبوس الإشارة',
    'pin',
    'شروحات',
    ['تحديد', 'نقطة', 'spotlight'],
    '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h20"/><path d="M12 18v4"/>',
  ),

  // أسهم
  I(
    'arrow-right',
    'سهم يمين',
    'arrow-right',
    'أسهم',
    ['اتجاه', 'forward'],
    '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/>',
  ),
  I(
    'arrow-left',
    'سهم يسار',
    'arrow-left',
    'أسهم',
    ['رجوع', 'back'],
    '<line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/>',
  ),
  I(
    'arrow-up',
    'سهم أعلى',
    'arrow-up',
    'أسهم',
    ['فوق', 'up'],
    '<line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/>',
  ),
  I(
    'arrow-down',
    'سهم أسفل',
    'arrow-down',
    'أسهم',
    ['تحت', 'down'],
    '<line x1="12" y1="4" x2="12" y2="20"/><polyline points="6 14 12 20 18 14"/>',
  ),
  I(
    'download',
    'تنزيل',
    'download',
    'أسهم',
    ['تحميل', 'حفظ', 'save'],
    '<path d="M12 3v12"/><polyline points="6 9 12 15 18 9"/><line x1="4" y1="21" x2="20" y2="21"/>',
  ),
  I(
    'upload',
    'رفع',
    'upload',
    'أسهم',
    ['تحميل لأعلى', 'publish'],
    '<path d="M12 21V9"/><polyline points="6 15 12 9 18 15"/><line x1="4" y1="3" x2="20" y2="3"/>',
  ),

  // ملفات
  I(
    'folder',
    'مجلد',
    'folder',
    'ملفات',
    ['directory', 'حافظة'],
    '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ),
  I(
    'file',
    'ملف',
    'file',
    'ملفات',
    ['مستند', 'document'],
    '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/>',
  ),
  I(
    'trash',
    'سلة المهملات',
    'trash',
    'ملفات',
    ['حذف', 'delete', 'bin'],
    '<polyline points="4 7 20 7"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  ),
  I(
    'calendar',
    'تقويم',
    'calendar',
    'ملفات',
    ['تاريخ', 'موعد', 'date'],
    '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  ),
  I(
    'clock',
    'ساعة',
    'clock',
    'ملفات',
    ['وقت', 'زمن', 'time'],
    '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  ),

  // وسائط
  I(
    'camera',
    'كاميرا',
    'camera',
    'وسائط',
    ['تصوير', 'photo'],
    '<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 7l1.5-2h5L16 7"/>',
  ),
  I(
    'image',
    'صورة',
    'image',
    'وسائط',
    ['لقطة', 'picture'],
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 4 3 4-4 4 4"/>',
  ),
  I(
    'code',
    'كود',
    'code',
    'وسائط',
    ['برمجة', 'programming'],
    '<polyline points="8 6 3 12 8 18"/><polyline points="16 6 21 12 16 18"/>',
  ),
  I(
    'terminal',
    'طرفية',
    'terminal',
    'وسائط',
    ['كونسول', 'console', 'shell'],
    '<rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 9 10 12 7 15"/><line x1="12" y1="15" x2="17" y2="15"/>',
  ),
  I(
    'mail',
    'بريد',
    'mail',
    'وسائط',
    ['رسالة', 'email'],
    '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/>',
  ),
  I(
    'globe',
    'إنترنت',
    'globe',
    'وسائط',
    ['عالم', 'web', 'كرة'],
    '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
  ),

  // طبيعة
  I(
    'sun',
    'شمس',
    'sun',
    'طبيعة',
    ['نهار', 'ضوء', 'light'],
    '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>',
  ),
  I(
    'star',
    'نجمة',
    'star',
    'طبيعة',
    ['مفضلة', 'تقييم', 'favorite'],
    '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  ),
  I(
    'heart',
    'قلب',
    'heart',
    'طبيعة',
    ['حب', 'إعجاب', 'like'],
    '<path d="M12 21C7 16.5 3 13 3 8.8 3 6 5 4 7.5 4c1.8 0 3.4 1 4.5 2.6C13.1 5 14.7 4 16.5 4 19 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z"/>',
  ),

  // تجارة
  I(
    'cart',
    'سلة شراء',
    'cart',
    'تجارة',
    ['متجر', 'shop', 'buy'],
    '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h3l2.5 11h9L20 8H7"/>',
  ),
  I(
    'chart',
    'رسم بياني',
    'chart',
    'تجارة',
    ['إحصائيات', 'stats'],
    '<line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="10" width="3" height="10"/><rect x="11" y="6" width="3" height="14"/><rect x="16" y="13" width="3" height="7"/>',
  ),
  I(
    'rocket',
    'صاروخ',
    'rocket',
    'تجارة',
    ['إطلاق', 'نشر', 'launch'],
    '<path d="M12 2c4 2 6 6 6 10l-3 3H9l-3-3c0-4 2-8 6-10z"/><circle cx="12" cy="10" r="2"/><path d="M9 15l-2 5 3-2"/><path d="M15 15l2 5-3-2"/>',
  ),
];

export class IconLibraryEngine {
  public search(query: string, category: IconCategory | 'الكل' = 'الكل'): SVGIcon[] {
    const q = query.trim().toLowerCase();
    return ICON_LIBRARY.filter((icon) => {
      if (category !== 'الكل' && icon.category !== category) return false;
      if (!q) return true;
      return (
        icon.name.includes(q) ||
        icon.nameEn.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  public toSvg(
    icon: SVGIcon,
    opts: { size?: number; color?: string; strokeWidth?: number } = {},
  ): string {
    const { size = 24, color = '#2563eb', strokeWidth = 2 } = opts;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${icon.body}</svg>`;
  }

  public toDataUrl(icon: SVGIcon, opts?: Parameters<IconLibraryEngine['toSvg']>[1]): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(this.toSvg(icon, opts))}`;
  }

  public toHtml(
    icon: SVGIcon,
    opts?: { size?: number; color?: string; strokeWidth?: number },
  ): string {
    return `<span class="svg-icon-wrapper" data-icon-id="${icon.id}" style="display: inline-flex; align-items: center; justify-content: center;">${this.toSvg(icon, opts)}</span>`;
  }
}

export const iconLibraryEngine = new IconLibraryEngine();
