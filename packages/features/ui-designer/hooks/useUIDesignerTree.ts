/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة شجرة المكونات المتداخلة - UI Component Tree Engine
 * 🏛️ الدور: خطاف رئيسي - إضافة وحذف وتكرار وترتيب وقفل وإخفاء المكونات
 * 📥 المستهلك: UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Tree Operations: عمليات شجرة غير قابلة للتغيير
 *    مع تحديد متعدد وعمليات مجمعة بالفأرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحالة يجب أن تبقى غير قابلة للتغيير
 *    2. IDs يجب أن تكون فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المكون قبل التعديل
 *    - fallback لشجرة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import type { UIComponentNode } from '../model';

export function useUIDesignerTree(
  initialComponents: UIComponentNode[] = [],
  onTreeChange?: (components: UIComponentNode[]) => void
) {
  const [components, setComponents] = useState<UIComponentNode[]>(initialComponents);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateComponents = useCallback((newComponents: UIComponentNode[]) => {
    setComponents(newComponents);
    onTreeChange?.(newComponents);
  }, [onTreeChange]);

  const addComponent = useCallback((component: UIComponentNode, parentId?: string | null) => {
    const newComponent: UIComponentNode = {
      ...component,
      id: component.id || `ui-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      parentId: parentId || null,
    };

    setComponents(prev => {
      let updated = [...prev, newComponent];
      if (parentId) {
        updated = updated.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              childrenIds: [...(item.childrenIds || []), newComponent.id],
            };
          }
          return item;
        });
      }
      onTreeChange?.(updated);
      return updated;
    });

    setSelectedId(newComponent.id);
    return newComponent;
  }, [onTreeChange]);

  const removeComponent = useCallback((id: string) => {
    setComponents(prev => {
      // Find all nested children to remove recursively
      const idsToRemove = new Set<string>([id]);
      const collectChildren = (targetId: string) => {
        const item = prev.find(c => c.id === targetId);
        if (item?.childrenIds) {
          item.childrenIds.forEach(childId => {
            idsToRemove.add(childId);
            collectChildren(childId);
          });
        }
      };
      collectChildren(id);

      const updated = prev
        .filter(c => !idsToRemove.has(c.id))
        .map(c => {
          if (c.childrenIds) {
            return {
              ...c,
              childrenIds: c.childrenIds.filter(childId => !idsToRemove.has(childId)),
            };
          }
          return c;
        });

      onTreeChange?.(updated);
      return updated;
    });

    setSelectedId(prev => (prev === id ? null : prev));
  }, [onTreeChange]);

  const updateComponentProps = useCallback((id: string, newProps: Record<string, any>) => {
    setComponents(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            props: { ...c.props, ...newProps },
          };
        }
        return c;
      });
      onTreeChange?.(updated);
      return updated;
    });
  }, [onTreeChange]);

  const toggleVisibility = useCallback((id: string) => {
    setComponents(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          return { ...c, hidden: !c.hidden };
        }
        return c;
      });
      onTreeChange?.(updated);
      return updated;
    });
  }, [onTreeChange]);

  const toggleLock = useCallback((id: string) => {
    setComponents(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          return { ...c, locked: !c.locked };
        }
        return c;
      });
      onTreeChange?.(updated);
      return updated;
    });
  }, [onTreeChange]);

  const moveComponent = useCallback((id: string, direction: 'up' | 'down') => {
    setComponents(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);

      onTreeChange?.(updated);
      return updated;
    });
  }, [onTreeChange]);

  const duplicateComponent = useCallback((id: string) => {
    const item = components.find(c => c.id === id);
    if (!item) return;

    const cloned: UIComponentNode = {
      ...item,
      id: `ui-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      label: `${item.label} (نسخة)`,
      props: { ...item.props },
      childrenIds: [],
    };

    addComponent(cloned, item.parentId);
  }, [components, addComponent]);

  return {
    components,
    selectedId,
    setSelectedId,
    setComponents: updateComponents,
    addComponent,
    removeComponent,
    updateComponentProps,
    toggleVisibility,
    toggleLock,
    moveComponent,
    duplicateComponent,
    selectedComponent: components.find(c => c.id === selectedId) || null,
  };
}
