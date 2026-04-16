import { useCallback } from "react";
import { notify } from "@/src/shared/store";

interface RequestOptions<T> {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
}

export const useRequestHandler = () => {
  const executeRequest = useCallback(
    async <T>(
      request: () => Promise<T>,
      options: RequestOptions<T> = {},
    ): Promise<T | null> => {
      try {
        const result = await request();

        if (options.successMessage) {
          notify.success(options.successMessage);
        }

        options.onSuccess?.(result);
        return result;
      } catch (error) {
        if (options.errorMessage) {
          notify.error(options.errorMessage);
        }

        options.onError?.(error);
        return null;
      }
    },
    [],
  );

  return { executeRequest };
};
