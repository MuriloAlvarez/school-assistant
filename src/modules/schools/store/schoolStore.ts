import { create } from "zustand";
import type { School, SchoolFilters } from "../types";

interface SchoolState {
  schools: School[];
  selectedSchool: School | null;
  isLoading: boolean;
  isFetchingSelectedSchool: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: SchoolFilters;
  setSchools: (schools: School[]) => void;
  setSelectedSchool: (school: School | null) => void;
  setLoading: (loading: boolean) => void;
  setFetchingSelectedSchool: (loading: boolean) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
  setDeleting: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SchoolFilters>) => void;
  addSchool: (school: School) => void;
  updateSchool: (school: School) => void;
  incrementSchoolClassCount: (schoolId: string) => void;
  decrementSchoolClassCount: (schoolId: string) => void;
  removeSchool: (id: string) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  selectedSchool: null,
  isLoading: false,
  isFetchingSelectedSchool: false,
  isDeleteDialogOpen: false,
  isDeleting: false,
  error: null,
  filters: {
    search: "",
    sortBy: "name",
  },
  setSchools: (schools) => set({ schools }),
  setSelectedSchool: (selectedSchool) => set({ selectedSchool }),
  setLoading: (isLoading) => set({ isLoading }),
  setFetchingSelectedSchool: (isFetchingSelectedSchool) =>
    set({ isFetchingSelectedSchool }),
  setDeleteDialogOpen: (isDeleteDialogOpen) => set({ isDeleteDialogOpen }),
  setDeleting: (isDeleting) => set({ isDeleting }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  addSchool: (school) =>
    set((state) => ({ schools: [...state.schools, school] })),
  updateSchool: (school) =>
    set((state) => ({
      schools: state.schools.map((s) => (s.id === school.id ? school : s)),
      selectedSchool:
        state.selectedSchool?.id === school.id ? school : state.selectedSchool,
    })),
  incrementSchoolClassCount: (schoolId) =>
    set((state) => ({
      schools: state.schools.map((school) =>
        school.id === schoolId
          ? { ...school, classCount: school.classCount + 1 }
          : school,
      ),
    })),
  decrementSchoolClassCount: (schoolId) =>
    set((state) => ({
      schools: state.schools.map((school) =>
        school.id === schoolId
          ? { ...school, classCount: Math.max(0, school.classCount - 1) }
          : school,
      ),
    })),
  removeSchool: (id) =>
    set((state) => {
      const isSelectedRemoved = state.selectedSchool?.id === id;

      return {
        schools: state.schools.filter((s) => s.id !== id),
        selectedSchool: isSelectedRemoved ? null : state.selectedSchool,
      };
    }),
}));
