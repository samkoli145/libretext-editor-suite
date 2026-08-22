/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة شبكة التصميم المتجاوبة ونقاط التوقف - Responsive Grid
 * 🏛️ الدور: خطاف مشترك - دعم 3 أحجام (جوال 375px، تابلت 768px، سطح مكتب 1200px)
 * 📥 المستهلك: UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    12-Column Responsive Grid: شبكة 12 عمود متجاوبة
 *    مع نقاط توقف وأبعاد شاشات محددة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأبعاد يجب أن تتوافق مع أحجام الشاشات الحقيقية
 *    2. الشبكة يجب أن تكون مرئية فقط عند التفعيل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة حجم الشاشة
 *    - fallback لحجم افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';

export type BreakpointId = 'mobile' | 'tablet' | 'desktop' | 'fluid';

export interface BreakpointConfig {
  id: BreakpointId;
  name: string;
  width: number | string;
  iconName: string;
}

export const BREAKPOINTS: BreakpointConfig[] = [
  { id: 'mobile', name: 'جوال (Mobile)', width: 375, iconName: 'Smartphone' },
  { id: 'tablet', name: 'لوحي (Tablet)', width: 768, iconName: 'Tablet' },
  { id: 'desktop', name: 'مكتبي (Desktop)', width: 1200, iconName: 'Monitor' },
  { id: 'fluid', name: 'مرن (100%)', width: '100%', iconName: 'Maximize' },
];

export function useResponsiveGrid() {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointId>('desktop');
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [gridColumns, setGridColumns] = useState<number>(12);
  const [gridGap, setGridGap] = useState<number>(16);

  const setBreakpoint = useCallback((bp: BreakpointId) => {
    setActiveBreakpoint(bp);
  }, []);

  const toggleGridOverlay = useCallback(() => {
    setShowGridOverlay(prev => !prev);
  }, []);

  const currentBreakpointConfig = BREAKPOINTS.find(b => b.id === activeBreakpoint) || BREAKPOINTS[2];

  return {
    activeBreakpoint,
    setBreakpoint,
    showGridOverlay,
    toggleGridOverlay,
    gridColumns,
    setGridColumns,
    gridGap,
    setGridGap,
    currentBreakpointConfig,
    breakpoints: BREAKPOINTS,
  };
}
