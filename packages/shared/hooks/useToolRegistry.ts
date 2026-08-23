/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف سجل الأدوات المركزي - Tool Registry Hook
 * 🏛️ الدور: خطاف مشترك - يجلب الأدوات المخصصة لكل محرر
 * 📥 المستهلك: UnifiedToolboxBlock, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Editor-Specific Tool Filtering: فلترة الأدوات حسب نوع المحرر النشط
 *    مع واجهة موحدة للتنفيذ
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأدوات يجب أن تظهر في كل المحررات (قاعدة AGENTS.md)
 *    2. IDs يجب أن تكون فريدة
 *    3. التنفيذ يجب أن يرتبط بسياق المحرر
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود الأداة قبل التنفيذ
 *    - fallback لأداة افتراضية
 *    - تنظيف عند تغيير المحرر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback } from 'react';
import {
  ToolRegistry,
  type EditorExecutionContext,
  type LatexSymbolItem,
  type LatexFormulaPreset,
  type ArithmeticToolItem,
} from '../tools/ToolRegistry';
import { type UnifiedToolItem, type ToolCategory } from '../tools/unifiedTools';
import { type WebTemplateItem } from '../../features/canvas-designer/componentLibrary';

export type EditorScope = 'canvas' | 'rich-text' | 'ui-page' | 'pdf' | 'all';

export interface UseToolRegistryOptions {
  scope?: EditorScope;
  services?: any;
  richEditor?: any;
  canvasStore?: any;
  insertHtml?: (html: string) => void;
  insertCanvasElement?: (element: any) => void;
}

export function useToolRegistry(options: UseToolRegistryOptions = {}) {
  const {
    scope = 'all',
    services,
    richEditor,
    canvasStore,
    insertHtml,
    insertCanvasElement,
  } = options;

  const registry = useMemo(() => ToolRegistry.getInstance(), []);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. تصفية الأدوات المتاحة بحسب نطاق المحرر المحدد
  const tools = useMemo(() => {
    const all = registry.getAllTools();
    if (scope === 'all') return all;

    return all.filter((tool) => {
      switch (scope) {
        case 'rich-text':
          return (
            tool.category === 'formatting' ||
            tool.category === 'latex-scientific' ||
            tool.category === 'diagrams-math' ||
            tool.category === 'media-callouts' ||
            tool.category === 'history-edit' ||
            tool.category === 'flow-elements' ||
            tool.category === 'computational-calc'
          );
        case 'canvas':
          return (
            tool.category === 'flow-elements' ||
            tool.category === 'latex-scientific' ||
            tool.category === 'vector-shapes' ||
            tool.category === 'diagrams-math' ||
            tool.category === 'media-callouts' ||
            tool.category === 'viewport-view' ||
            tool.category === 'history-edit' ||
            tool.category === 'computational-calc'
          );
        case 'ui-page':
          return (
            tool.category === 'flow-elements' ||
            tool.category === 'latex-scientific' ||
            tool.category === 'media-callouts' ||
            tool.category === 'history-edit' ||
            tool.category === 'document-io' ||
            tool.category === 'computational-calc'
          );
        case 'pdf':
          return (
            tool.category === 'latex-scientific' ||
            tool.category === 'document-io' ||
            tool.category === 'viewport-view' ||
            tool.category === 'history-edit' ||
            tool.category === 'media-callouts' ||
            tool.category === 'computational-calc'
          );
        default:
          return true;
      }
    });
  }, [registry, scope]);

  // 2. تصفية حسب الفئة والبحث
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchQuery =
        !searchQuery.trim() ||
        tool.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchQuery;
    });
  }, [tools, activeCategory, searchQuery]);

  // 3. سياق التنفيذ المشترك
  const executionContext: EditorExecutionContext = useMemo(
    () => ({
      editorType: scope,
      services,
      richEditor,
      canvasStore,
      insertHtml,
      insertCanvasElement,
    }),
    [scope, services, richEditor, canvasStore, insertHtml, insertCanvasElement],
  );

  // 4. تنفيذ أداة بنقرة فأرة واحدة
  const executeTool = useCallback(
    (toolId: string, customPayload?: Record<string, any>) => {
      const tool = registry.getTool(toolId);
      if (!tool) return false;

      const mergedContext: EditorExecutionContext = customPayload
        ? { ...executionContext, ...customPayload }
        : executionContext;

      return registry.executeTool(toolId, mergedContext);
    },
    [registry, executionContext],
  );

  // 5. دوال مساعدة لرموز وقوالب الرياضيات والتدفق
  const getLatexSymbols = useCallback(
    (category?: LatexSymbolItem['category']) => registry.getLatexSymbols(category),
    [registry],
  );

  const getFormulaPresets = useCallback(
    (category?: LatexFormulaPreset['category']) => registry.getFormulaPresets(category),
    [registry],
  );

  const getArithmeticTools = useCallback(() => registry.getArithmeticTools(), [registry]);

  const getFlowComponents = useCallback(
    (): WebTemplateItem[] => registry.getFlowComponents(),
    [registry],
  );

  const renderLatexHtml = useCallback(
    (code: string, isBlock = true) => registry.renderLatexHtml(code, isBlock),
    [registry],
  );

  return {
    tools: filteredTools,
    allScopeTools: tools,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    executeTool,
    getLatexSymbols,
    getFormulaPresets,
    getArithmeticTools,
    getFlowComponents,
    renderLatexHtml,
    registry,
  };
}
