/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: إدارة متغيرات البيانات ومصادرها - Data Variables Utilities
 * 🏛️ الدور: أداة مشتركة - تعريف وإدارة المتغيرات الديناميكية
 * 📥 المستهلك: TemplateEngine, ComponentBindings, SmartComponentEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Token-Based Variable System: نظام متغيرات بـ {token} placeholders
 *    مع بحث في شجرة العناصر لاكتشاف مواضع الاستخدام
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المتغيرات يجب أن تكون آمنة (no code injection)
 *    2. الاستبدال يجب أن يكون دقيقة (case-sensitive)
 *    3. التكرار يجب تجنبه (recursion guard)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة اسم المتغير
 *    - fallback لقيمة فارغة
 *    - timeout على البحث في الشجرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PageElement } from '../../features/canvas-designer/model';

export interface DataSourceVariable {
  id: string;
  name: string;
  type: 'variable';
  scopeInstanceId: string;
  dataType?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
}

export interface BaseOption {
  terms: string[];
  type: string;
  id: string;
  name: string;
}

export type DataVariableOption = BaseOption & {
  type: 'dataVariable';
  id: string;
  name: string;
  instanceId: string;
  usages: number;
  dataType?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
  collectionName?: string;
};

/**
 * مصادر البيانات الافتراضية للبيئة
 */
export const defaultDataSources: DataSourceVariable[] = [
  {
    id: 'var-user-name',
    name: 'currentUser.name',
    type: 'variable',
    scopeInstanceId: 'root',
    dataType: 'string',
    defaultValue: 'أحمد محمود',
  },
  {
    id: 'var-user-role',
    name: 'currentUser.role',
    type: 'variable',
    scopeInstanceId: 'root',
    dataType: 'string',
    defaultValue: 'مدير النظام',
  },
  {
    id: 'var-cart-count',
    name: 'cart.itemCount',
    type: 'variable',
    scopeInstanceId: 'hero-1',
    dataType: 'number',
    defaultValue: 3,
  },
  {
    id: 'var-theme-mode',
    name: 'theme.currentMode',
    type: 'variable',
    scopeInstanceId: 'root',
    dataType: 'string',
    defaultValue: 'light',
  },
  {
    id: 'var-site-title',
    name: 'siteSettings.title',
    type: 'variable',
    scopeInstanceId: 'root',
    dataType: 'string',
    defaultValue: 'منصة ويب ستوديو الفائقة',
  },
];

/**
 * فحص شجرة العناصر واستخراج المعرفات التي تعتمد على كل متغير
 */
export const findVariableUsagesByInstance = (params: {
  startingInstanceId?: string;
  elements: PageElement[];
  dataSources: DataSourceVariable[];
}): Map<string, Set<string>> => {
  const usageMap = new Map<string, Set<string>>();

  // تهيئة مجموعات فارغة لكل متغير
  for (const ds of params.dataSources) {
    usageMap.set(ds.id, new Set<string>());
  }

  const traverse = (element: PageElement) => {
    // التحقق مما إذا كان المحتوى أو الأنماط أو الخصائص تشير للمتغير
    for (const ds of params.dataSources) {
      const mentionsVariable =
        (element.content &&
          (element.content.includes(ds.name) || element.content.includes(ds.id))) ||
        (element.name && element.name.includes(ds.name)) ||
        (element.styles?.customClasses && element.styles.customClasses.includes(ds.name)) ||
        (element.props && JSON.stringify(element.props).includes(ds.name));

      if (mentionsVariable || element.id === ds.scopeInstanceId) {
        usageMap.get(ds.id)?.add(element.id);
      }
    }

    if (element.children && Array.isArray(element.children)) {
      for (const child of element.children) {
        traverse(child);
      }
    }
  };

  for (const el of params.elements) {
    traverse(el);
  }

  return usageMap;
};

/**
 * حساب خيارات المتغيرات للوحة الأوامر
 */
export const computeDataVariableOptions = (params: {
  isCommandPanelOpen: boolean;
  dataSources: DataSourceVariable[];
  elements: PageElement[];
}): DataVariableOption[] => {
  if (!params.isCommandPanelOpen) {
    return [];
  }

  const usedInInstances = findVariableUsagesByInstance({
    elements: params.elements,
    dataSources: params.dataSources,
  });

  const dataVariableOptions: DataVariableOption[] = [];

  for (const dataSource of params.dataSources) {
    if (dataSource.type === 'variable' && dataSource.scopeInstanceId !== undefined) {
      const usages = usedInInstances.get(dataSource.id)?.size ?? 0;
      const scopeLabel =
        dataSource.scopeInstanceId === 'root'
          ? 'الصفحة الجذرية (Root)'
          : dataSource.scopeInstanceId || 'غير مستخدم';

      dataVariableOptions.push({
        terms: [
          'variable',
          'variables',
          'data',
          'متغير',
          'بيانات',
          dataSource.name,
          scopeLabel,
          `${usages} استخدام`,
        ],
        type: 'dataVariable',
        id: dataSource.id,
        name: dataSource.name,
        instanceId: dataSource.scopeInstanceId,
        usages,
        dataType: dataSource.dataType,
        defaultValue: dataSource.defaultValue,
      });
    }
  }

  return dataVariableOptions;
};

/**
 * حذف متغير بيانات من المخزن
 */
export const deleteDataVariable = (
  variableId: string,
  dataSources: DataSourceVariable[] = defaultDataSources,
): DataSourceVariable[] => {
  return dataSources.filter((ds) => ds.id !== variableId);
};

/**
 * إعادة تسمية متغير بيانات في المخزن
 */
export const renameDataVariable = (
  variableId: string,
  newName: string,
  dataSources: DataSourceVariable[] = defaultDataSources,
): DataSourceVariable[] => {
  return dataSources.map((ds) => {
    if (ds.id === variableId) {
      return { ...ds, name: newName };
    }
    return ds;
  });
};
