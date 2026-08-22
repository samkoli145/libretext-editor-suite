/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك النوافذ المنبثقة المركزي - فتح وإغلاق وإدارة حالة Dialogs
 * 🏛️ الدور: محرك مشترك - Service Pattern لإدارة جميع النوافذ في التطبيق
 * 📥 المستهلك: GlobalDialogHost, كل المكونات التي تفتح نوافذ
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized Dialog Service: خدمة موحدة تدير حالة جميع النوافذ
 *    عبر subscribe/unsubscribe pattern لمنع تسريب الذاكرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فتح نافذة أثناء وجود نافذة مفتوحة يجب أن يُغلق الأولى أولاً
 *    2. الـ subscribers يجب تنظيفها عند تدمير المكون
 *    3. الحالة يجب أن تبقى متزامنة مع GlobalDialogHost
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار فتح نفس النافذة
 *    - تنظيف تلقائي للـ subscriptions عند عدم الضرورة
 *    - إرجاع boolean للتأكيد
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/DialogEngine.ts

export type DialogType =
  | 'image'
  | 'image-editor'
  | 'image-style'
  | 'link'
  | 'table'
  | 'page-setup'
  | 'export'
  | 'diagram'
  | 'source-code'
  | 'code-studio'
  | 'icons'
  | 'callouts'
  | 'templates'
  | 'latex'
  | 'mindmap'
  | 'computational-scratchpad'
  | 'system-doctor'
  | 'dev-studio'
  | null;

export interface ImageDialogProps {
  initialUrl?: string;
  initialAlt?: string;
  onConfirm?: (data: { url: string; alt: string; width?: string; height?: string; className?: string; wrapMode?: 'inline' | 'left' | 'right' | 'break' }) => void;
}

export interface ImageEditorDialogProps {
  src: string;
  imageName?: string;
  onSave?: (result: any) => void;
  onCancel?: () => void;
  onLiveUpdate?: (result: any) => void;
  mode?: 'modal' | 'floating' | 'docked';
}

export interface LinkDialogProps {
  initialUrl?: string;
  initialText?: string;
  initialTarget?: string;
  onConfirm?: (data: { url: string; text: string; target: string; styleType?: string }) => void;
}

export interface TableDialogProps {
  initialRows?: number;
  initialCols?: number;
  onConfirm?: (data: { rows: number; cols: number; hasHeader: boolean; styleType: string }) => void;
}

export interface ActiveDialogState {
  type: DialogType;
  props?: ImageDialogProps | LinkDialogProps | TableDialogProps | any;
}

type DialogListener = (state: ActiveDialogState) => void;

export class DialogEngine {
  private static instance: DialogEngine;
  private state: ActiveDialogState = { type: null };
  private listeners: Set<DialogListener> = new Set();

  public static getInstance(): DialogEngine {
    if (!DialogEngine.instance) {
      DialogEngine.instance = new DialogEngine();
    }
    return DialogEngine.instance;
  }

  public subscribe(listener: DialogListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public openImageDialog(props?: ImageDialogProps): void {
    this.state = { type: 'image', props };
    this.notify();
  }

  public openImageEditor(props: ImageEditorDialogProps): void {
    this.state = { type: 'image-editor', props };
    this.notify();
  }

  public openLinkDialog(props?: LinkDialogProps): void {
    this.state = { type: 'link', props };
    this.notify();
  }

  public openTableDialog(props?: TableDialogProps): void {
    this.state = { type: 'table', props };
    this.notify();
  }

  public openPageSetupDialog(props?: any): void {
    this.state = { type: 'page-setup', props };
    this.notify();
  }

  public openExportDialog(props?: any): void {
    this.state = { type: 'export', props };
    this.notify();
  }

  public openDiagramDialog(props?: any): void {
    this.state = { type: 'diagram', props };
    this.notify();
  }

  public openSourceCodeDialog(props?: any): void {
    this.state = { type: 'source-code', props };
    this.notify();
  }

  public openIconsDialog(props?: any): void {
    this.state = { type: 'icons', props };
    this.notify();
  }

  public openCalloutsDialog(props?: any): void {
    this.state = { type: 'callouts', props };
    this.notify();
  }

  public openTemplatesDialog(props?: any): void {
    this.state = { type: 'templates', props };
    this.notify();
  }

  public openLatexDialog(props?: any): void {
    this.state = { type: 'latex', props };
    this.notify();
  }

  public openMindMapDialog(props?: any): void {
    this.state = { type: 'mindmap', props };
    this.notify();
  }

  public openImageStyleDialog(props?: any): void {
    this.state = { type: 'image-style', props };
    this.notify();
  }

  public openComputationalScratchpad(props?: any): void {
    this.state = { type: 'computational-scratchpad', props };
    this.notify();
  }

  public openSystemDoctor(props?: any): void {
    this.state = { type: 'system-doctor', props };
    this.notify();
  }

  public openDevStudio(props?: any): void {
    this.state = { type: 'dev-studio', props };
    this.notify();
  }

  public openCodeStudio(props?: any): void {
    this.state = { type: 'code-studio', props };
    this.notify();
  }

  public openDialog(type: DialogType, props?: any): void {
    this.state = { type, props };
    this.notify();
  }

  public openCustomDialog(type: DialogType, props?: any): void {
    this.state = { type, props };
    this.notify();
  }

  public closeDialog(): void {
    this.state = { type: null };
    this.notify();
  }

  public getState(): ActiveDialogState {
    return this.state;
  }
}

export const dialogEngine = DialogEngine.getInstance();

