/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: دوال فرز المشاريع والمستندات - Sorting Utilities
 * 🏛️ الدور: أداة مشتركة - فرز متعدد المعايير مع الحفاظ على اللا-تغييرية
 * 📥 المستهلك: ProjectManager, DocumentList, LayersPanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Criteria Sort: فرز حسب (title, createdAt, updatedAt, publishedAt)
 *    مع اتجاه (asc/desc) و fallback تلقائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الفرز يجب أن يكون immutable (لا يغير المصفوفة الأصلية)
 *    2. updatedAt يجب أن يستخدم latestBuildVirtual.updatedAt إن وجد
 *    3. fallback لـ createdAt عند عدم وجود تاريخ
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المعايير
 *    - fallback لـ [] عند الخطأ
 *    - تعامل مع القيم الفارغة/undefined
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type SortBy = 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  sortBy?: SortBy;
  order?: SortOrder;
}

export interface DashboardProject {
  id: string;
  title: string;
  createdAt: string | number | Date;
  isPublished?: boolean;
  latestBuildVirtual?: {
    createdAt?: string | number | Date;
    updatedAt?: string | number | Date;
    publishStatus?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  } | null;
  [key: string]: any;
}

/**
 * دالة فرز مصفوفة المشاريع بناءً على الحالة المحددة
 */
export function sortProjects<T extends DashboardProject = DashboardProject>(
  projects: readonly T[],
  sortState?: SortState
): T[] {
  // إذا كانت المصفوفة فارغة أو تحتوي على عنصر واحد
  if (!projects || projects.length <= 1) {
    return projects ? [...projects] : [];
  }

  // تحديد خيارات الفرز الافتراضية
  const sortBy: SortBy = sortState?.sortBy ?? 'updatedAt';
  const order: SortOrder = sortState?.order ?? 'desc';

  // إنشاء نسخة جديدة لضمان عدم المساس بالمصفوفة الأصلية (Immutability)
  const cloned = [...projects];

  // 1. فرز حسب تاريخ النشر (publishedAt) - معالجة خاصة للمشاريع غير المنشورة
  if (sortBy === 'publishedAt') {
    const isProjectPublished = (p: T): boolean => {
      if (!p.isPublished) return false;
      if (p.latestBuildVirtual && p.latestBuildVirtual.publishStatus && p.latestBuildVirtual.publishStatus !== 'PUBLISHED') {
        return false;
      }
      return true;
    };

    const published: T[] = [];
    const unpublished: T[] = [];

    cloned.forEach((p) => {
      if (isProjectPublished(p)) {
        published.push(p);
      } else {
        unpublished.push(p);
      }
    });

    published.sort((a, b) => {
      const dateA = new Date(a.latestBuildVirtual?.createdAt || a.createdAt).getTime();
      const dateB = new Date(b.latestBuildVirtual?.createdAt || b.createdAt).getTime();
      if (order === 'asc') {
        return dateA - dateB; // الأقدم أولاً
      } else {
        return dateB - dateA; // الأحدث أولاً
      }
    });

    // دمج المنشورة أولاً متبوعة بغير المنشورة في النهاية
    return [...published, ...unpublished];
  }

  // 2. فرز حسب باقي الحقول (title, createdAt, updatedAt)
  return cloned.sort((a, b) => {
    if (sortBy === 'title') {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      const comparison = titleA.localeCompare(titleB);
      return order === 'asc' ? comparison : -comparison;
    }

    if (sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortBy === 'updatedAt') {
      const timeA = new Date(a.latestBuildVirtual?.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.latestBuildVirtual?.updatedAt || b.createdAt).getTime();
      return order === 'asc' ? timeA - timeB : timeB - timeA;
    }

    return 0;
  });
}
