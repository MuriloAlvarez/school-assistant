import { apiClient } from "@/core/api/apiClient";
import { REPOSITORY_ERROR_MESSAGES } from "@/core/constants";
import type {
  School,
  CreateSchoolDTO,
  UpdateSchoolDTO,
  SchoolFilters,
} from "../types";

const nowIso = () => new Date().toISOString();
const createId = () => Math.random().toString(36).slice(2, 11);

let localSchools: School[] = [];

function applyFiltersAndSort(
  data: School[],
  filters?: SchoolFilters,
): School[] {
  let result = [...data];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.address.toLowerCase().includes(search),
    );
  }

  if (filters?.sortBy) {
    result.sort((a, b) => {
      if (filters.sortBy === "name") return a.name.localeCompare(b.name);
      if (filters.sortBy === "createdAt") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (filters.sortBy === "classCount") return b.classCount - a.classCount;
      return 0;
    });
  }

  return result;
}

export interface ISchoolRepository {
  findAll(filters?: SchoolFilters): Promise<School[]>;
  findById(id: string): Promise<School | null>;
  create(data: CreateSchoolDTO): Promise<School>;
  update(id: string, data: UpdateSchoolDTO): Promise<School>;
  delete(id: string): Promise<void>;
}

export class SchoolRepository implements ISchoolRepository {
  async findAll(filters?: SchoolFilters): Promise<School[]> {
    try {
      const response = await apiClient.get<School[]>("/api/schools");
      localSchools = response.data;
      return applyFiltersAndSort(response.data, filters);
    } catch {
      return applyFiltersAndSort(localSchools, filters);
    }
  }

  async findById(id: string): Promise<School | null> {
    try {
      const response = await apiClient.get<School>(`/api/schools/${id}`);
      return response.data;
    } catch {
      return localSchools.find((school) => school.id === id) ?? null;
    }
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    try {
      const response = await apiClient.post<School>("/api/schools", data);
      localSchools = [...localSchools, response.data];
      return response.data;
    } catch {
      const school: School = {
        ...data,
        id: createId(),
        classCount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      localSchools = [...localSchools, school];
      return school;
    }
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    try {
      const response = await apiClient.put<School>(`/api/schools/${id}`, data);
      localSchools = localSchools.map((school) =>
        school.id === id ? response.data : school,
      );
      return response.data;
    } catch {
      const currentSchool = localSchools.find((school) => school.id === id);
      if (!currentSchool) {
        throw new Error(REPOSITORY_ERROR_MESSAGES.SCHOOL_NOT_FOUND);
      }

      const updatedSchool: School = {
        ...currentSchool,
        ...data,
        updatedAt: nowIso(),
      };

      localSchools = localSchools.map((school) =>
        school.id === id ? updatedSchool : school,
      );
      return updatedSchool;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/schools/${id}`);
    } finally {
      localSchools = localSchools.filter((school) => school.id !== id);
    }
  }
}

export const schoolRepository = new SchoolRepository();
