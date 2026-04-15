import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useClasses } from "./useClasses";
import { useClassStore } from "../store/classStore";
import { useSchoolStore } from "../../schools/store/schoolStore";
import { classRepository } from "../services/classService";
import type { SchoolClass } from "../../schools/types";

vi.mock("../services/classService", () => ({
  classRepository: {
    findBySchoolId: vi.fn(),
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
      isLoading: false,
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
      isLoading: false,
      error: null,
      filters: { search: "", sortBy: "name" },
    });
  });

  it("increments school class count on class creation", async () => {
    const createdClass: SchoolClass = {
      id: "class-1",
      schoolId: "school-1",
      name: "1º Ano A",
      shift: "morning",
      academicYear: 2026,
      capacity: 30,
      teacherName: "Ana Paula",
      createdAt: "",
      updatedAt: "",
    };

    mockedRepository.create.mockResolvedValueOnce(createdClass);

    const { result } = renderHook(() => useClasses("school-1"));

    await act(async () => {
      await result.current.createClass({
        name: "1º Ano A",
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
          name: "1º Ano A",
          shift: "morning",
          academicYear: 2026,
          capacity: 30,
          teacherName: "Ana Paula",
          createdAt: "",
          updatedAt: "",
        },
      ],
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

    const { result } = renderHook(() => useClasses("school-1"));

    await act(async () => {
      await result.current.deleteClass("class-1");
    });

    expect(useClassStore.getState().classes).toHaveLength(0);
    expect(useSchoolStore.getState().schools[0].classCount).toBe(0);
  });
});
