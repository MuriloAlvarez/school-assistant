declare module "@testing-library/react" {
  export function act<T>(callback: () => Promise<T> | T): Promise<T>;
  export function renderHook<T>(callback: () => T): { result: { current: T } };
  export function waitFor(
    assertion: () => void | Promise<void>,
    options?: { timeout?: number; interval?: number },
  ): Promise<void>;
}
