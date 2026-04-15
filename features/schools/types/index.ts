export interface School {
  id: string;
  name: string;
  address: string;
  phone?: string;
  principalName?: string;
  classCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateSchoolDTO = Omit<
  School,
  "id" | "classCount" | "createdAt" | "updatedAt"
>;
export type UpdateSchoolDTO = Partial<CreateSchoolDTO>;

export interface SchoolFilters {
  search: string;
  sortBy: "name" | "createdAt" | "classCount";
}
