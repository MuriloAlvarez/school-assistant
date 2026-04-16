import * as yup from "yup";
import { classSchema } from "../schemas";

export type SchoolShift = "morning" | "afternoon" | "evening" | "full";

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  shift: SchoolShift;
  academicYear: number;
  capacity?: number;
  teacherName?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateClassDTO = Required<yup.InferType<typeof classSchema>>;

export type UpdateClassDTO = Partial<CreateClassDTO>;
