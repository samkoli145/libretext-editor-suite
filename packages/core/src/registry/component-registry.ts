/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: component-registry.ts
 * 📂 المسار: packages/core/src/registry/component-registry.ts
 * 🎯 الهدف الرئيسي: سجل مكونات المحررات المركزي
 *    مع Single Source of Truth لتعريف وحالة كل مكون.
 * 🏷️ المعرف: CORE-REG-001
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export type ComponentCategory = 'shell' | 'canvas' | 'text' | 'table' | 'plugin' | 'shared';

export type ComponentPosition =
  'top-bar' | 'sidebar' | 'canvas-center' | 'modal' | 'context-menu' | 'floating';

export interface ComponentRegistration {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly category: ComponentCategory;
  readonly filePath: string;
  readonly defaultPosition: ComponentPosition;
  readonly currentPosition: ComponentPosition;
  readonly isRegistered: boolean;
  readonly isVisible: boolean;
  readonly iconName: string;
  readonly descriptionAr: string;
}

function validateRegistration(reg: Partial<ComponentRegistration>): reg is ComponentRegistration {
  return typeof reg.id === 'string' && reg.id.length > 0 && typeof reg.nameEn === 'string';
}

export function createComponentRegistry() {
  const registry = new Map<string, ComponentRegistration>();

  function register(component: ComponentRegistration): boolean {
    if (!validateRegistration(component)) return false;
    registry.set(component.id, component);
    return true;
  }

  function unregister(id: string): boolean {
    return registry.delete(id);
  }
  function get(id: string): ComponentRegistration | undefined {
    return registry.get(id);
  }
  function list(): readonly ComponentRegistration[] {
    return Array.from(registry.values());
  }

  function listByCategory(category: ComponentCategory): readonly ComponentRegistration[] {
    return Array.from(registry.values()).filter((c) => c.category === category);
  }

  function listByPosition(position: ComponentPosition): readonly ComponentRegistration[] {
    return Array.from(registry.values()).filter((c) => c.currentPosition === position);
  }

  function setVisible(id: string, visible: boolean): boolean {
    const reg = registry.get(id);
    if (!reg) return false;
    registry.set(id, { ...reg, isVisible: visible });
    return true;
  }

  function setPosition(id: string, position: ComponentPosition): boolean {
    const reg = registry.get(id);
    if (!reg) return false;
    registry.set(id, { ...reg, currentPosition: position });
    return true;
  }

  function toMatrix(): Record<string, ComponentRegistration> {
    const obj: Record<string, ComponentRegistration> = {};
    for (const [k, v] of registry) obj[k] = v;
    return obj;
  }

  function size(): number {
    return registry.size;
  }
  function clear(): void {
    registry.clear();
  }

  return {
    register,
    unregister,
    get,
    list,
    listByCategory,
    listByPosition,
    setVisible,
    setPosition,
    toMatrix,
    size,
    clear,
  };
}
