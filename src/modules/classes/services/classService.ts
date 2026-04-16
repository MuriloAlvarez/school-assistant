import { apiClient } from "@/src/shared/services/api/apiClient";
import { REPOSITORY_ERROR_MESSAGES } from "@/src/shared/constants";
import type {
  SchoolClass,
  CreateClassDTO,
  UpdateClassDTO,
} from "@/src/modules/classes/types";

const nowIso = () => new Date().toISOString();
const createId = () => Math.random().toString(36).slice(2, 11);

let localClasses: SchoolClass[] = [];

export interface IClassRepository {
  findBySchoolId(schoolId: string): Promise<SchoolClass[]>;
  findById(id: string): Promise<SchoolClass | null>;
  create(schoolId: string, data: CreateClassDTO): Promise<SchoolClass>;
  update(id: string, data: UpdateClassDTO): Promise<SchoolClass>;
  delete(id: string): Promise<void>;
}

export class ClassRepository implements IClassRepository {
  async findBySchoolId(schoolId: string): Promise<SchoolClass[]> {
    try {
      const response = await apiClient.get<SchoolClass[]>(
        `/api/schools/${schoolId}/classes`,
      );
      return response.data;
    } catch {
      return localClasses.filter(
        (schoolClass) => schoolClass.schoolId === schoolId,
      );
    }
  }

  async findById(id: string): Promise<SchoolClass | null> {
    try {
      const response = await apiClient.get<SchoolClass>(`/api/classes/${id}`);
      return response.data;
    } catch {
      return localClasses.find((schoolClass) => schoolClass.id === id) ?? null;
    }
  }

  async create(schoolId: string, data: CreateClassDTO): Promise<SchoolClass> {
    try {
      const response = await apiClient.post<SchoolClass>(
        `/api/schools/${schoolId}/classes`,
        data,
      );
      localClasses = [...localClasses, response.data];
      return response.data;
    } catch {
      const schoolClass: SchoolClass = {
        ...data,
        id: createId(),
        schoolId,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      localClasses = [...localClasses, schoolClass];
      return schoolClass;
    }
  }

  async update(id: string, data: UpdateClassDTO): Promise<SchoolClass> {
    try {
      const response = await apiClient.put<SchoolClass>(
        `/api/classes/${id}`,
        data,
      );
      localClasses = localClasses.map((schoolClass) =>
        schoolClass.id === id ? response.data : schoolClass,
      );
      return response.data;
    } catch {
      const currentClass = localClasses.find(
        (schoolClass) => schoolClass.id === id,
      );
      if (!currentClass) {
        throw new Error(REPOSITORY_ERROR_MESSAGES.CLASS_NOT_FOUND);
      }

      const updatedClass: SchoolClass = {
        ...currentClass,
        ...data,
        updatedAt: nowIso(),
      };

      localClasses = localClasses.map((schoolClass) =>
        schoolClass.id === id ? updatedClass : schoolClass,
      );

      return updatedClass;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/classes/${id}`);
    } finally {
      localClasses = localClasses.filter(
        (schoolClass) => schoolClass.id !== id,
      );
    }
  }
}

export const classRepository = new ClassRepository();
