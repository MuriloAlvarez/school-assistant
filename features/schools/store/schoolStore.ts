import { create } from "zustand";
import type { School, SchoolFilters } from "../types";

interface SchoolState {
  schools: School[];
  isLoading: boolean;
  error: string | null;
  filters: SchoolFilters;
  setSchools: (schools: School[]) => void;
  setLoading: (loading: boolean) => void;
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
  isLoading: false,
  error: null,
  filters: {
    search: "",
    sortBy: "name",
  },
  setSchools: (schools) => set({ schools }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  addSchool: (school) =>
    set((state) => ({ schools: [...state.schools, school] })),
  updateSchool: (school) =>
    set((state) => ({
      schools: state.schools.map((s) => (s.id === school.id ? school : s)),
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
    set((state) => ({
      schools: state.schools.filter((s) => s.id !== id),
    })),
}));
