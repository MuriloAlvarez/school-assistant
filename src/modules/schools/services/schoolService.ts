import { apiClient } from "@/src/shared/services/api/apiClient";
import { REPOSITORY_ERROR_MESSAGES } from "@/src/shared/constants";
import type {
  School,
  CreateSchoolDTO,
  UpdateSchoolDTO,
  SchoolFilters,
} from "../types";

const nowIso = () => new Date().toISOString();
const createId = () => Math.random().toString(36).slice(2, 11);

let localSchools: School[] = [];

function upsertLocalSchool(school: School) {
  const hasSchool = localSchools.some((item) => item.id === school.id);

  if (!hasSchool) {
    localSchools = [...localSchools, school];
    return;
  }

  localSchools = localSchools.map((item) =>
    item.id === school.id ? school : item,
  );
}

function normalizeSchool(data: Partial<School>, fallback?: School): School {
  const timestamp = nowIso();

  return {
    id: data.id ?? fallback?.id ?? createId(),
    name: data.name ?? fallback?.name ?? "",
    address: data.address ?? fallback?.address ?? "",
    phone: data.phone ?? fallback?.phone,
    principalName: data.principalName ?? fallback?.principalName,
    classCount: data.classCount ?? fallback?.classCount ?? 0,
    createdAt: data.createdAt ?? fallback?.createdAt ?? timestamp,
    updatedAt: data.updatedAt ?? timestamp,
  };
}

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
      const normalizedSchools = response.data.map((school) => {
        const cachedSchool = localSchools.find((item) => item.id === school.id);
        return normalizeSchool(school, cachedSchool);
      });

      localSchools = normalizedSchools;
      return applyFiltersAndSort(normalizedSchools, filters);
    } catch {
      return applyFiltersAndSort(localSchools, filters);
    }
  }

  async findById(id: string): Promise<School | null> {
    try {
      const response = await apiClient.get<School>(`/api/schools/${id}`);
      const cachedSchool = localSchools.find((school) => school.id === id);
      const normalizedSchool = normalizeSchool(response.data, cachedSchool);

      upsertLocalSchool(normalizedSchool);
      return normalizedSchool;
    } catch {
      return localSchools.find((school) => school.id === id) ?? null;
    }
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    try {
      const response = await apiClient.post<School>("/api/schools", data);
      const normalizedSchool = normalizeSchool(response.data);

      upsertLocalSchool(normalizedSchool);
      return normalizedSchool;
    } catch {
      const school: School = {
        ...data,
        id: createId(),
        classCount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      upsertLocalSchool(school);
      return school;
    }
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    try {
      const response = await apiClient.put<School>(`/api/schools/${id}`, data);
      const cachedSchool = localSchools.find((school) => school.id === id);
      const fallbackSchool = cachedSchool
        ? { ...cachedSchool, ...data, id }
        : undefined;
      const normalizedSchool = normalizeSchool(response.data, fallbackSchool);

      upsertLocalSchool(normalizedSchool);
      return normalizedSchool;
    } catch {
      const currentSchool = localSchools.find((school) => school.id === id);
      if (!currentSchool) {
        throw new Error(REPOSITORY_ERROR_MESSAGES.SCHOOL_NOT_FOUND);
      }

      const updatedSchool = normalizeSchool(
        {
          ...currentSchool,
          ...data,
          id,
          updatedAt: nowIso(),
        },
        currentSchool,
      );

      upsertLocalSchool(updatedSchool);
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
