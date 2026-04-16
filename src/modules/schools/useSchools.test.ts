import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSchoolStore } from "./store/schoolStore";
import { useSchools } from "./useSchools";
import { schoolRepository } from "./services/schoolService";
import type { School } from "./types";

vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("./services/schoolService", () => ({
  schoolRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedRepository = vi.mocked(schoolRepository);

const mockSchools: School[] = [
  {
    id: "1",
    name: "Escola A",
    address: "Rua A",
    classCount: 0,
    createdAt: "",
    updatedAt: "",
  },
];

describe("useSchools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSchoolStore.setState({
      schools: [],
      selectedSchool: null,
      isLoading: false,
      isFetchingSelectedSchool: false,
      isDeleteDialogOpen: false,
      isDeleting: false,
      error: null,
      filters: { search: "", sortBy: "name" },
    });
  });

  it("fetches schools on mount when list loading is enabled", async () => {
    mockedRepository.findAll.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools());

    await waitFor(() => {
      expect(mockedRepository.findAll).toHaveBeenCalled();
      expect(result.current.schools).toEqual(mockSchools);
    });
  });

  it("creates a school through upsert flow and updates store", async () => {
    const createdSchool: School = {
      id: "2",
      name: "Escola B",
      address: "Rua B",
      phone: "11999999999",
      principalName: "Maria Souza",
      classCount: 0,
      createdAt: "",
      updatedAt: "",
    };

    mockedRepository.create.mockResolvedValueOnce(createdSchool);

    const { result } = renderHook(() => useSchools({ loadList: false }));

    await act(async () => {
      await result.current.submitUpsert({
        name: createdSchool.name,
        address: createdSchool.address,
        phone: "11999999999",
        principalName: "Maria Souza",
      });
    });

    expect(result.current.schools).toEqual([createdSchool]);
  });
});
