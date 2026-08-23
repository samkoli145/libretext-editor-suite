/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: block-manifest.ts
 * 📂 المسار: packages/core/src/blocks/block-manifest.ts
 * 🎯 الهدف الرئيسي: تجميع جميع بلوكات المكتبة برمجياً
 * 🏷️ المعرف: CORE-BLK-MANIFEST
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RegisteredBlockMeta {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly file: string;
  readonly pkg: string;
}

export const LIBRARY_BLOCKS_MANIFEST: ReadonlyArray<RegisteredBlockMeta> = [
  {
    id: 'blk-create-audioblock',
    name: 'createAudioBlockNode',
    type: 'factory',
    file: 'packages/core/src/blocks/AudioBlock.ts',
    pkg: 'core',
  },
  {
    id: 'blk-create-codeeditor',
    name: 'createCodeEditorNode',
    type: 'factory',
    file: 'packages/core/src/blocks/code-editor.ts',
    pkg: 'core',
  },
  {
    id: 'blk-htmlblock',
    name: 'HtmlBlock',
    type: 'block',
    file: 'packages/core/src/blocks/html-block-registry.ts',
    pkg: 'core',
  },
  {
    id: 'blk-create-unified',
    name: 'createUnifiedNode',
    type: 'factory',
    file: 'packages/core/src/blocks/html-unified-block.ts',
    pkg: 'core',
  },
  {
    id: 'blk-canvasdesignerplugin',
    name: 'CanvasDesignerPlugin',
    type: 'plugin',
    file: 'packages/features/canvas-designer/CanvasDesignerPlugin.tsx',
    pkg: 'features',
  },
  {
    id: 'blk-beziersubeditor',
    name: 'BezierSubEditor',
    type: 'editor',
    file: 'packages/features/canvas-designer/sub-editors/BezierSubEditor.ts',
    pkg: 'features',
  },
  {
    id: 'blk-linesubeditor',
    name: 'LineSubEditor',
    type: 'editor',
    file: 'packages/features/canvas-designer/sub-editors/LineSubEditor.ts',
    pkg: 'features',
  },
  {
    id: 'blk-htmlcomponentplugin',
    name: 'HTMLComponentPlugin',
    type: 'plugin',
    file: 'packages/features/html-component/HTMLComponentPlugin.tsx',
    pkg: 'features',
  },
  {
    id: 'blk-pdfplugin',
    name: 'PdfPlugin',
    type: 'plugin',
    file: 'packages/features/pdf/PdfPlugin.tsx',
    pkg: 'features',
  },
  {
    id: 'blk-richtextplugin',
    name: 'RichTextPlugin',
    type: 'plugin',
    file: 'packages/features/rich-text/RichTextPlugin.ts',
    pkg: 'features',
  },
  {
    id: 'blk-nativeeditor',
    name: 'NativeEditor',
    type: 'editor',
    file: 'packages/features/rich-text/core/NativeEditor.ts',
    pkg: 'features',
  },
  {
    id: 'blk-uidesignerplugin',
    name: 'UIDesignerPlugin',
    type: 'plugin',
    file: 'packages/features/ui-designer/UIDesignerPlugin.tsx',
    pkg: 'features',
  },
  {
    id: 'blk-mathplugin',
    name: 'MathPlugin',
    type: 'plugin',
    file: 'packages/plugins/src/math/math-plugin.ts',
    pkg: 'plugins',
  },
  {
    id: 'blk-mermaidplugin',
    name: 'MermaidPlugin',
    type: 'plugin',
    file: 'packages/plugins/src/mermaid/mermaid-plugin.ts',
    pkg: 'plugins',
  },
  {
    id: 'blk-codeeditor',
    name: 'CodeEditor',
    type: 'editor',
    file: 'packages/shared/lib-core/code-interpreter/code-editor-module.ts',
    pkg: 'shared',
  },
  {
    id: 'blk-subeditor',
    name: 'SubEditor',
    type: 'editor',
    file: 'packages/shared/lib-core/events/sub-editor-orchestrator.ts',
    pkg: 'shared',
  },
] as const;
