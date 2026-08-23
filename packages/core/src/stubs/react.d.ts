/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: react.d.ts
 * 📂 المسار: packages/core/src/stubs/react.d.ts
 * 🎯 الهدف: تعريف نوع React لㅂعدم وجود react كBrowser
 * 🏷️ المعرف: CORE-STUB-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export type ComponentType<P = Record<string, never>> = any;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export type FC<P = Record<string, never>> = any;
  export function useState<T>(initial: T): [T, (v: T) => void];
  export function useEffect(effect: () => void, deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
}
