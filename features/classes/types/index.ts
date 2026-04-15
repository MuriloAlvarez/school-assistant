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

export type CreateClassDTO = Omit<
  SchoolClass,
  "id" | "schoolId" | "createdAt" | "updatedAt"
>;

export type UpdateClassDTO = Partial<CreateClassDTO>;
