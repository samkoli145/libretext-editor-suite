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
