import { beforeEach, describe, expect, it } from "vitest";
import { useSchoolStore } from "./schoolStore";
import type { School } from "../types";

const baseSchool: School = {
  id: "school-1",
  name: "Escola Municipal Central",
  address: "Rua A, 10",
  classCount: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("useSchoolStore", () => {
  beforeEach(() => {
    useSchoolStore.setState({
      schools: [{ ...baseSchool }],
      isLoading: false,
      error: null,
      filters: { search: "", sortBy: "name" },
    });
  });

  it("increments and decrements class count safely", () => {
    useSchoolStore.getState().incrementSchoolClassCount(baseSchool.id);
    expect(useSchoolStore.getState().schools[0].classCount).toBe(2);

    useSchoolStore.getState().decrementSchoolClassCount(baseSchool.id);
    useSchoolStore.getState().decrementSchoolClassCount(baseSchool.id);
    useSchoolStore.getState().decrementSchoolClassCount(baseSchool.id);

    expect(useSchoolStore.getState().schools[0].classCount).toBe(0);
  });

  it("adds and removes schools", () => {
    const newSchool: School = {
      id: "school-2",
      name: "Escola Municipal Norte",
      address: "Rua B, 200",
      classCount: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    useSchoolStore.getState().addSchool(newSchool);
    expect(useSchoolStore.getState().schools).toHaveLength(2);

    useSchoolStore.getState().removeSchool(baseSchool.id);
    expect(useSchoolStore.getState().schools).toEqual([newSchool]);
  });
});
