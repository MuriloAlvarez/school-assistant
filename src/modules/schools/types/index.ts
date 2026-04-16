import * as yup from "yup";
import { schoolSchema } from "../schemas";

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

export type CreateSchoolDTO = Required<yup.InferType<typeof schoolSchema>>;
export type UpdateSchoolDTO = Partial<CreateSchoolDTO>;

export interface SchoolFilters {
  search: string;
  sortBy: "name" | "createdAt" | "classCount";
}
