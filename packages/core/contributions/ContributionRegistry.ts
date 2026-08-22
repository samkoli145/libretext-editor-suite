/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل المساهمات (Contributions) - Contribution Registry
 * 🏛️ الدور: نواة النظام - تسجيل أوامر وقوائم وأدوات panels و اختصارات وESCOs
 * 📥 المستهلك: Shell, كل الإضافات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Contribution Points System: نظام نقاط المساهمة
 *    مع 8 أنواع مساهمة و Filtrage حسب pluginId
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. IDs يجب أن تكون فريدة
 *    2. pluginId يجب أن يُستخدم للفلترة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم التسجيل المزدوج
 *    - emit للحدث عند التسجيل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ComponentType } from "react";
import type { EventBus } from "../events/EventBus";
import type { DocumentModel, DocumentType } from "../types";

export type ContributionPoint =
  | "command"
  | "menu"
  | "toolbar"
  | "panel"
  | "shortcut"
  | "context-menu"
  | "exporter"
  | "importer";

export interface BaseContribution {
  id: string;
  point: ContributionPoint;
  pluginId?: string;
  priority?: number;
  when?: string;
  enabled?: boolean;
}

export interface CommandContribution extends BaseContribution {
  point: "command";
  commandId: string;
}

export interface MenuContribution extends BaseContribution {
  point: "menu";
  label: string;
  commandId?: string;
  location?: "file" | "edit" | "insert" | "format" | "view" | "help" | string;
  group?: string;
  icon?: string;
}

export interface ToolbarContribution extends BaseContribution {
  point: "toolbar";
  commandId?: string;
  label?: string;
  icon?: string;
  location?: "top" | "left" | "right" | "bottom" | string;
}

export interface PanelContribution extends BaseContribution {
  point: "panel";
  title: string;
  location?: "left" | "right" | "bottom" | string;
  render: ComponentType<any>;
}

export interface ShortcutContribution extends BaseContribution {
  point: "shortcut";
  commandId: string;
  key: string;
}

export interface ContextMenuContribution extends BaseContribution {
  point: "context-menu";
  label: string;
  commandId?: string;
  group?: string;
  icon?: string;
}

export interface ExporterContribution extends BaseContribution {
  point: "exporter";
  label: string;
  documentTypes: DocumentType[];

  run: (document: DocumentModel) => void | Promise<void>;
}

export interface ImporterContribution extends BaseContribution {
  point: "importer";
  label: string;
  accept: readonly string[];

  run: (file: File) => DocumentModel | Promise<DocumentModel>;
}

export type Contribution =
  | CommandContribution
  | MenuContribution
  | ToolbarContribution
  | PanelContribution
  | ShortcutContribution
  | ContextMenuContribution
  | ExporterContribution
  | ImporterContribution;

export const ContributionEvents = {
  registered: "contribution:registered",
  unregistered: "contribution:unregistered",
} as const;

export class ContributionRegistry {
  private contributions: Map<string, Contribution> = new Map();

  constructor(private events?: EventBus) {}

  public register(contribution: Contribution): () => void {
    if (this.contributions.has(contribution.id)) {
      console.warn(
        `[ContributionRegistry] Contribution already registered: "${contribution.id}". It will be replaced.`
      );
    }

    this.contributions.set(contribution.id, contribution);

    this.events?.emit(ContributionEvents.registered, contribution);

    return () => {
      this.unregister(contribution.id);
    };
  }

  public unregister(contributionId: string): boolean {
    const existed = this.contributions.delete(contributionId);

    if (existed) {
      this.events?.emit(ContributionEvents.unregistered, {
        id: contributionId,
      });
    }

    return existed;
  }

  public get<T extends Contribution = Contribution>(
    contributionId: string
  ): T | undefined {
    return this.contributions.get(contributionId) as T | undefined;
  }

  public getAll(): Contribution[] {
    return Array.from(this.contributions.values());
  }

  public getByPoint<T extends Contribution = Contribution>(
    point: ContributionPoint
  ): T[] {
    return Array.from(this.contributions.values())
      .filter((contribution) => contribution.point === point)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)) as T[];
  }

  public getByPlugin(pluginId: string): Contribution[] {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.pluginId === pluginId
    );
  }

  public clear(): void {
    this.contributions.clear();
  }
}
