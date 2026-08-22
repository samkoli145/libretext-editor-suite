/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: وحدة محرر الكود الموحدة في نظام المكتبة المشتركة - Code Editor Module
 * 🏛️ الدور: مكون مشترك - التلوين النحوي والمعاينة الحية الفورية
 * 📥 المستهلك: LiveInterpreterEngine, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Syntax Highlighter: مُلون نحوي بدون مكتبات خارجية
 *    مع معاينة حية فورية بالثيم الفاتح النقي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التلوين يجب أن يدعم 10 لغات + لغة الرسوم البيانية
 *    2. المعاينة يجب أن تبقى معزولة 100%
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الكود قبل التفسير
 *    - fallback لرسالة خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  liveInterpreterEngine,
  type SupportedLanguage,
  type InterpretedOutput,
  type VisualAstNode,
  type SnippetTemplate,
} from './live-interpreter-engine';
import {
  zeroDependencyChartEngine,
  type ChartConfig,
  type ChartType,
  type ChartDataPoint,
} from '../charts/zero-dependency-chart-engine';

export interface CodeEditorModuleConfig {
  id: string;
  name: string;
  version: string;
  theme: 'pure-light-100';
  mouseDriven: boolean;
  supportedLanguages: SupportedLanguage[];
  features: {
    syntaxHighlighting: boolean;
    realTimeWysiwygPreview: boolean;
    mouseDrivenManipulation: boolean;
    zeroDependencyCharting: boolean;
    chartMorphing: boolean;
    astTreeMapping: boolean;
    rightClickContextMenu: boolean;
  };
}

export class CodeEditorModule {
  public readonly moduleId = 'code-editor-module';
  public readonly name = 'Universal Interactive Code Editor Module';
  public readonly version = '1.2.0';

  public getModuleConfig(): CodeEditorModuleConfig {
    return {
      id: this.moduleId,
      name: this.name,
      version: this.version,
      theme: 'pure-light-100',
      mouseDriven: true,
      supportedLanguages: [
        'html',
        'css',
        'javascript',
        'typescript',
        'json',
        'markdown',
        'latex',
        'svg',
        'xml',
        'yaml',
      ],
      features: {
        syntaxHighlighting: true,
        realTimeWysiwygPreview: true,
        mouseDrivenManipulation: true,
        zeroDependencyCharting: true,
        chartMorphing: true,
        astTreeMapping: true,
        rightClickContextMenu: true,
      },
    };
  }

  /**
   * ترجمة وتفسير الكود لحظياً
   */
  public interpretCode(code: string, language: SupportedLanguage): InterpretedOutput {
    return liveInterpreterEngine.interpret(code, language);
  }

  /**
   * رسم مخطط بياني تفاعلي بدون أي مكتبات
   */
  public renderChart(
    config: ChartConfig,
    state = { zoom: 1, panX: 0, panY: 0, hoveredIndex: null, selectedIndex: null }
  ) {
    return zeroDependencyChartEngine.renderInteractiveSvg(config, state);
  }

  /**
   * تحويل فوري بين أنواع المخططات (Morphing)
   */
  public morphChartType(config: ChartConfig, targetType: ChartType): ChartConfig {
    return zeroDependencyChartEngine.morphChart(config, targetType);
  }

  /**
   * استرجاع الـ 20 نموذجاً للمخططات الجاهزة للإدراج الفوري
   */
  public get20ChartPresets() {
    return zeroDependencyChartEngine.get20ChartPresets();
  }

  /**
   * استرجاع قوالب ومقتطفات الكود الجاهزة
   */
  public getPresetSnippets(): SnippetTemplate[] {
    return liveInterpreterEngine.getPresetSnippets();
  }

  /**
   * توليد شجرة AST البصرية للربط بالفأرة
   */
  public getVisualAst(code: string, language: SupportedLanguage): VisualAstNode[] {
    if (language === 'html' || language === 'svg' || language === 'xml') {
      return liveInterpreterEngine.extractHtmlAst(code);
    }
    return [];
  }
}

export const codeEditorModule = new CodeEditorModule();
