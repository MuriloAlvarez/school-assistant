import { create } from "zustand";
import type { SchoolClass } from "@/src/modules/classes/types";

interface ClassState {
  classes: SchoolClass[];
  selectedClass: SchoolClass | null;
  isLoading: boolean;
  isFetchingSelectedClass: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  setClasses: (classes: SchoolClass[]) => void;
  setSelectedClass: (schoolClass: SchoolClass | null) => void;
  setLoading: (loading: boolean) => void;
  setFetchingSelectedClass: (loading: boolean) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
  setDeleting: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addClass: (schoolClass: SchoolClass) => void;
  updateClass: (schoolClass: SchoolClass) => void;
  removeClass: (id: string) => void;
}

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  selectedClass: null,
  isLoading: false,
  isFetchingSelectedClass: false,
  isDeleteDialogOpen: false,
  isDeleting: false,
  error: null,
  setClasses: (classes) => set({ classes }),
  setSelectedClass: (selectedClass) => set({ selectedClass }),
  setLoading: (isLoading) => set({ isLoading }),
  setFetchingSelectedClass: (isFetchingSelectedClass) =>
    set({ isFetchingSelectedClass }),
  setDeleteDialogOpen: (isDeleteDialogOpen) => set({ isDeleteDialogOpen }),
  setDeleting: (isDeleting) => set({ isDeleting }),
  setError: (error) => set({ error }),
  addClass: (schoolClass) =>
    set((state) => ({ classes: [...state.classes, schoolClass] })),
  updateClass: (schoolClass) =>
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === schoolClass.id ? schoolClass : c,
      ),
      selectedClass:
        state.selectedClass?.id === schoolClass.id
          ? schoolClass
          : state.selectedClass,
    })),
  removeClass: (id) =>
    set((state) => {
      const isSelectedRemoved = state.selectedClass?.id === id;

      return {
        classes: state.classes.filter((c) => c.id !== id),
        selectedClass: isSelectedRemoved ? null : state.selectedClass,
      };
    }),
}));
