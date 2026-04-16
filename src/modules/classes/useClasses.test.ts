import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useClasses } from "./useClasses";
import { useClassStore } from "./store/classStore";
import { useSchoolStore } from "../schools/store/schoolStore";
import { classRepository } from "./services/classService";
import type { SchoolClass } from "./types";

vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("./services/classService", () => ({
  classRepository: {
    findBySchoolId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedRepository = vi.mocked(classRepository);

describe("useClasses", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useClassStore.setState({
      classes: [],
      selectedClass: null,
      isLoading: false,
      isFetchingSelectedClass: false,
      isDeleteDialogOpen: false,
      isDeleting: false,
      error: null,
    });

    useSchoolStore.setState({
      schools: [
        {
          id: "school-1",
          name: "Escola Municipal",
          address: "Rua A",
          classCount: 0,
          createdAt: "",
          updatedAt: "",
        },
      ],
      selectedSchool: null,
      isLoading: false,
      isFetchingSelectedSchool: false,
      isDeleteDialogOpen: false,
      isDeleting: false,
      error: null,
      filters: { search: "", sortBy: "name" },
    });
  });

  it("increments school class count on class creation", async () => {
    const createdClass: SchoolClass = {
      id: "class-1",
      schoolId: "school-1",
      name: "1o Ano A",
      shift: "morning",
      academicYear: 2026,
      capacity: 30,
      teacherName: "Ana Paula",
      createdAt: "",
      updatedAt: "",
    };

    mockedRepository.create.mockResolvedValueOnce(createdClass);

    const { result } = renderHook(() =>
      useClasses({ schoolId: "school-1", autoLoad: false }),
    );

    await act(async () => {
      await result.current.submitUpsert({
        name: "1o Ano A",
        shift: "morning",
        academicYear: 2026,
        capacity: 30,
        teacherName: "Ana Paula",
      });
    });

    expect(useClassStore.getState().classes).toEqual([createdClass]);
    expect(useSchoolStore.getState().schools[0].classCount).toBe(1);
  });

  it("decrements school class count on class deletion", async () => {
    useClassStore.setState({
      classes: [
        {
          id: "class-1",
          schoolId: "school-1",
          name: "1o Ano A",
          shift: "morning",
          academicYear: 2026,
          capacity: 30,
          teacherName: "Ana Paula",
          createdAt: "",
          updatedAt: "",
        },
      ],
      selectedClass: {
        id: "class-1",
        schoolId: "school-1",
        name: "1o Ano A",
        shift: "morning",
        academicYear: 2026,
        capacity: 30,
        teacherName: "Ana Paula",
        createdAt: "",
        updatedAt: "",
      },
    });

    useSchoolStore.setState({
      schools: [
        {
          id: "school-1",
          name: "Escola Municipal",
          address: "Rua A",
          classCount: 1,
          createdAt: "",
          updatedAt: "",
        },
      ],
    });

    mockedRepository.delete.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useClasses({ schoolId: "school-1", classId: "class-1", autoLoad: false }),
    );

    await act(async () => {
      await result.current.deleteCurrentClass();
    });

    expect(useClassStore.getState().classes).toHaveLength(0);
    expect(useSchoolStore.getState().schools[0].classCount).toBe(0);
  });
});
