type WorkerLike = {
  start: (options?: unknown) => Promise<void>;
  stop: () => void;
};

// Native runtime shim: MSW browser worker is web-only.
export const worker: WorkerLike = {
  start: async () => {},
  stop: () => {},
};
