// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [ProjectTreePanel.ts] لوحة شجرة المشروع — الملاحة والتفكيك
 *
 * هذا الملف يربط ProjectTreeModel و TreeNavigation بواجهة DOM تفاعلية.
 *
 * المبدأ:
 * "A SELECTION IS DATA. Nothing here touches the DOM."
 * اللوحة ترسم كـ Viewport/Renderer، بينما حالة التنقل في TreeNavigation
 * والنموذج المشتق في ProjectTreeModel.
 *
 * التنبيهات:
 * - الثيم الفاتح النقي 100%
 * - دعم الزر الأيمن على كل عنصر
 * - LTR direction
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import type { ProjectTreeModel } from '../../tree/ProjectTreeModel';
import type { TreeNavigation } from '../../tree/TreeNavigation';

export interface ProjectTreePanelOpts {
  model: ProjectTreeModel;
  nav: TreeNavigation;
  onOpen?: (path: string) => void;
}

export class ProjectTreePanel {
  el: HTMLElement;
  private opts: ProjectTreePanelOpts;

  constructor(opts: ProjectTreePanelOpts) {
    this.opts = opts;
    this.el = document.createElement('div');
    this.el.className = 'dsw-tree-panel';
    this.render();
  }

  render(): void {
    this.el.innerHTML = '';
    const rootNode = this.opts.model.buildTree();

    const list = document.createElement('div');
    list.className = 'dsw-tree-list';

    const renderNode = (node: typeof rootNode, depth = 0) => {
      if (!node) return;
      const row = document.createElement('div');
      row.className = 'dsw-row dsw-tree-row';
      row.style.paddingLeft = `${depth * 14}px`;

      const isDir = node.kind === 'dir';
      const isExpanded = this.opts.nav.isExpanded(node.path);
      const isSelected = this.opts.nav.current.selected === node.path;

      const label = document.createElement('span');
      label.textContent = `${isDir ? (isExpanded ? '📂 ' : '📁 ') : '📄 '} ${node.name}`;
      if (isSelected) label.style.fontWeight = 'bold';
      row.appendChild(label);

      row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isDir) {
          this.opts.nav.toggle(node.path);
          this.render();
        } else {
          this.opts.nav.select(node.path, []);
          this.opts.onOpen?.(node.path);
          this.render();
        }
      });

      list.appendChild(row);

      if (isDir && isExpanded && node.children) {
        for (const child of node.children) {
          renderNode(child, depth + 1);
        }
      }
    };

    renderNode(rootNode, 0);
    this.el.appendChild(list);
  }
}
