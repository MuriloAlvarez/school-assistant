import { create } from "zustand";
import type { SchoolClass } from "@/features/classes/types";

interface ClassState {
  classes: SchoolClass[];
  isLoading: boolean;
  error: string | null;
  setClasses: (classes: SchoolClass[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addClass: (schoolClass: SchoolClass) => void;
  updateClass: (schoolClass: SchoolClass) => void;
  removeClass: (id: string) => void;
}

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  isLoading: false,
  error: null,
  setClasses: (classes) => set({ classes }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addClass: (schoolClass) =>
    set((state) => ({ classes: [...state.classes, schoolClass] })),
  updateClass: (schoolClass) =>
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === schoolClass.id ? schoolClass : c,
      ),
    })),
  removeClass: (id) =>
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    })),
}));
