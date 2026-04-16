import { create } from "zustand";
import { TOAST_TITLES } from "@/src/shared/constants";

export type NotifyVariant = "success" | "error";

export interface NotifyPayload {
  variant: NotifyVariant;
  title: string;
  message: string;
}

type NotifyListener = (payload: NotifyPayload) => void;

interface NotifyStoreState {
  listener: NotifyListener | null;
  setListener: (listener: NotifyListener | null) => void;
}

export const useNotifyStore = create<NotifyStoreState>((set) => ({
  listener: null,
  setListener: (listener) => set({ listener }),
}));

const emit = (payload: NotifyPayload) => {
  useNotifyStore.getState().listener?.(payload);
};

export const notify = {
  success: (message: string, title = TOAST_TITLES.SUCCESS) => {
    emit({ variant: "success", title, message });
  },
  error: (message: string, title = TOAST_TITLES.ERROR) => {
    emit({ variant: "error", title, message });
  },
};
