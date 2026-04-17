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

  it("starts create form with empty values even when a class is selected in store", () => {
    useClassStore.setState({
      selectedClass: {
        id: "class-selected",
        schoolId: "school-1",
        name: "Turma Selecionada",
        shift: "morning",
        academicYear: 2026,
        capacity: 35,
        teacherName: "Professor Selecionado",
        createdAt: "",
        updatedAt: "",
      },
    });

    const { result } = renderHook(() =>
      useClasses({ schoolId: "school-1", classId: undefined, autoLoad: false }),
    );

    expect(result.current.hookForm.getValues()).toEqual({
      name: "",
      teacherName: "",
    });
  });

  it("validates required class fields on submit when create form is empty", async () => {
    const onValid = vi.fn();
    const onInvalid = vi.fn();

    const { result } = renderHook(() =>
      useClasses({ schoolId: "school-1", autoLoad: false }),
    );

    await act(async () => {
      await result.current.hookForm.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();

    const [errors] = onInvalid.mock.calls[0] as [
      Record<string, { message?: string }>,
    ];

    expect(errors.name?.message).toBeTruthy();
    expect(errors.shift?.message).toBeTruthy();
    expect(errors.academicYear?.message).toBeTruthy();
  });
});
