/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة التاريخ والتراجع - History State Hook
 * 🏛️ الدور: خطاف مشترك - يلف HistoryDiffEngine في hook آمن من Stale Closures
 * 📥 المستهلك: كل المحررات الأربعة (CanvasDesigner, RichText, UiDesigner, Pdf)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Ref-Backed Stable Hook: خطاف يعتمد على ref لمنع Stale Closures
 *    مع dispatch مستقر ودعمUndo/Redo
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. dispatch يجب أن يكون مستقراً (referential equality)
 *    2. Stale Closures يجب تجنبها بالكامل
 *    3. الحد الأقصى للتاريخ يجب تحديده
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام ref لكل الحالة
 *    - fallback لـ 50 خطوة تاريخية
 *    - تنظيف عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { HistoryDiffEngine, HistoryConfig } from '../lib-core/document-pipeline/history-diff-engine';

export interface UseHistoryReturn<T> {
  state: T;
  set: (nextState: T | ((prevState: T) => T), description?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: T) => void;
  startBatch: (description?: string) => void;
  commitBatch: () => void;
}

export function useHistoryState<T>(initialState: T, config?: HistoryConfig): UseHistoryReturn<T> {
  // Pure engine instance held in ref to survive re-renders without recreation
  const engineRef = useRef<HistoryDiffEngine<T> | null>(null);
  if (!engineRef.current) {
    engineRef.current = new HistoryDiffEngine<T>(initialState, config);
  }

  const [state, setState] = useState<T>(() => engineRef.current!.getCurrentState());
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Latest state ref to avoid any closure staleness in functional updaters
  const stateRef = useRef<T>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const engine = engineRef.current!;
    const unsubscribe = engine.subscribe((currentState, u, r) => {
      setState(currentState);
      setCanUndo(u);
      setCanRedo(r);
    });
    return unsubscribe;
  }, []);

  const set = useCallback((nextState: T | ((prevState: T) => T), description?: string) => {
    const engine = engineRef.current;
    if (!engine) return;

    if (typeof nextState === 'function') {
      const updater = nextState as (prevState: T) => T;
      const latestCurrent = engine.getCurrentState();
      const resolved = updater(latestCurrent);
      engine.pushState(resolved, description);
    } else {
      engine.pushState(nextState, description);
    }
  }, []);

  const undo = useCallback(() => {
    const engine = engineRef.current;
    if (engine && engine.canUndo) {
      engine.undo();
    }
  }, []);

  const redo = useCallback(() => {
    const engine = engineRef.current;
    if (engine && engine.canRedo) {
      engine.redo();
    }
  }, []);

  const reset = useCallback((newState: T) => {
    const engine = engineRef.current;
    if (engine) {
      engine.reset(newState);
    }
  }, []);

  const startBatch = useCallback((description?: string) => {
    engineRef.current?.startBatch(description);
  }, []);

  const commitBatch = useCallback(() => {
    engineRef.current?.commitBatch();
  }, []);

  return {
    state,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    startBatch,
    commitBatch,
  };
}
