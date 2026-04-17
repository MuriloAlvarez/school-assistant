import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { CreateClassDTO, SchoolClass } from "@/src/modules/classes/types";
import type { CreateSchoolDTO, School } from "@/src/modules/schools/types";

type CreateClassWithSchoolIdDTO = CreateClassDTO & { schoolId?: string };

const currentYear = new Date().getFullYear();

const nowIso = () => new Date().toISOString();
const createId = () => Math.random().toString(36).slice(2, 11);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let schools: School[] = [
  {
    id: "1",
    name: "Escola Municipal Paulo Freire",
    address: "Rua das Flores, 123",
    phone: "(11) 4002-8922",
    principalName: "Maria Silva",
    classCount: 2,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "2",
    name: "CIEP 123 - Tancredo Neves",
    address: "Av. Brasil, S/N",
    phone: "(21) 2233-4455",
    principalName: "Joao Souza",
    classCount: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

let classes: SchoolClass[] = [
  {
    id: "c1",
    schoolId: "1",
    name: "1o Ano A",
    shift: "morning",
    academicYear: currentYear,
    capacity: 30,
    teacherName: "Ana Paula",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "c2",
    schoolId: "1",
    name: "2o Ano B",
    shift: "afternoon",
    academicYear: currentYear,
    capacity: 25,
    teacherName: "Carlos Lima",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "c3",
    schoolId: "2",
    name: "1o Ano D",
    shift: "evening",
    academicYear: currentYear,
    capacity: 45,
    teacherName: "Fernanda Rocha",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const parseJsonData = <T>(data: unknown): T => {
  if (!data) {
    return {} as T;
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return {} as T;
    }
  }

  return data as T;
};

const buildResponse = <T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> => ({
  data,
  status,
  statusText: status >= 200 && status < 300 ? "OK" : "ERROR",
  headers: { "Content-Type": "application/json" },
  config,
});

const findSchoolById = (schoolId: string) =>
  schools.find((school) => school.id === schoolId);

const findClassById = (classId: string) =>
  classes.find((schoolClass) => schoolClass.id === classId);

const incrementSchoolClassCount = (schoolId: string) => {
  const school = findSchoolById(schoolId);
  if (school) {
    school.classCount += 1;
  }
};

const decrementSchoolClassCount = (schoolId: string) => {
  const school = findSchoolById(schoolId);
  if (school) {
    school.classCount = Math.max(0, school.classCount - 1);
  }
};

const buildClass = (schoolId: string, data: CreateClassDTO): SchoolClass => ({
  ...data,
  id: createId(),
  schoolId,
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

const toUrl = (url: string) => new URL(url, "http://localhost");

const isReactNativeRuntime = () =>
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

export const isNativeDevMockEnabled = () =>
  process.env.NODE_ENV === "development" && isReactNativeRuntime();

export const createNativeMockAdapter = (): AxiosAdapter => {
  return async (config) => {
    const internalConfig = config as InternalAxiosRequestConfig;
    const method = (internalConfig.method ?? "get").toLowerCase();
    const url = toUrl(internalConfig.url ?? "");
    const pathname = url.pathname;

    await wait(250);

    if (pathname === "/api/schools") {
      if (method === "get") {
        return buildResponse(internalConfig, schools);
      }

      if (method === "post") {
        const payload = parseJsonData<CreateSchoolDTO>(internalConfig.data);
        const newSchool: School = {
          ...payload,
          id: createId(),
          classCount: 0,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };

        schools.push(newSchool);
        return buildResponse(internalConfig, newSchool, 201);
      }
    }

    const schoolByIdMatch = pathname.match(/^\/api\/schools\/([^/]+)$/);
    if (schoolByIdMatch) {
      const schoolId = schoolByIdMatch[1];
      const school = findSchoolById(schoolId);

      if (!school) {
        return buildResponse(
          internalConfig,
          { message: "School not found" },
          404,
        );
      }

      if (method === "get") {
        return buildResponse(internalConfig, school);
      }

      if (method === "put") {
        const payload = parseJsonData<Partial<School>>(internalConfig.data);
        const updatedSchool: School = {
          ...school,
          ...payload,
          id: school.id,
          classCount: school.classCount,
          updatedAt: nowIso(),
        };

        schools = schools.map((item) =>
          item.id === schoolId ? updatedSchool : item,
        );

        return buildResponse(internalConfig, updatedSchool);
      }

      if (method === "delete") {
        schools = schools.filter((item) => item.id !== schoolId);
        classes = classes.filter((item) => item.schoolId !== schoolId);
        return buildResponse(internalConfig, { success: true });
      }
    }

    const schoolClassesMatch = pathname.match(
      /^\/api\/schools\/([^/]+)\/classes$/,
    );
    if (schoolClassesMatch) {
      const schoolId = schoolClassesMatch[1];

      if (method === "get") {
        return buildResponse(
          internalConfig,
          classes.filter((schoolClass) => schoolClass.schoolId === schoolId),
        );
      }

      if (method === "post") {
        const school = findSchoolById(schoolId);
        if (!school) {
          return buildResponse(
            internalConfig,
            { message: "School not found" },
            404,
          );
        }

        const payload = parseJsonData<CreateClassDTO>(internalConfig.data);
        const newClass = buildClass(schoolId, payload);
        classes.push(newClass);
        incrementSchoolClassCount(schoolId);
        return buildResponse(internalConfig, newClass, 201);
      }
    }

    if (pathname === "/api/classes") {
      if (method === "get") {
        const schoolId = url.searchParams.get("schoolId");
        if (!schoolId) {
          return buildResponse(internalConfig, classes);
        }

        return buildResponse(
          internalConfig,
          classes.filter((schoolClass) => schoolClass.schoolId === schoolId),
        );
      }

      if (method === "post") {
        const payload = parseJsonData<CreateClassWithSchoolIdDTO>(
          internalConfig.data,
        );

        if (!payload.schoolId) {
          return buildResponse(
            internalConfig,
            { message: "schoolId is required" },
            400,
          );
        }

        const school = findSchoolById(payload.schoolId);
        if (!school) {
          return buildResponse(
            internalConfig,
            { message: "School not found" },
            404,
          );
        }

        const { schoolId, ...classData } = payload;
        const newClass = buildClass(schoolId, classData as CreateClassDTO);
        classes.push(newClass);
        incrementSchoolClassCount(schoolId);
        return buildResponse(internalConfig, newClass, 201);
      }
    }

    const classByIdMatch = pathname.match(/^\/api\/classes\/([^/]+)$/);
    if (classByIdMatch) {
      const classId = classByIdMatch[1];
      const schoolClass = findClassById(classId);

      if (!schoolClass) {
        return buildResponse(
          internalConfig,
          { message: "Class not found" },
          404,
        );
      }

      if (method === "get") {
        return buildResponse(internalConfig, schoolClass);
      }

      if (method === "put") {
        const payload = parseJsonData<Partial<SchoolClass>>(
          internalConfig.data,
        );
        const updatedClass: SchoolClass = {
          ...schoolClass,
          ...payload,
          id: schoolClass.id,
          schoolId: schoolClass.schoolId,
          updatedAt: nowIso(),
        };

        classes = classes.map((item) =>
          item.id === classId ? updatedClass : item,
        );

        return buildResponse(internalConfig, updatedClass);
      }

      if (method === "delete") {
        classes = classes.filter((item) => item.id !== classId);
        decrementSchoolClassCount(schoolClass.schoolId);
        return buildResponse(internalConfig, { success: true });
      }
    }

    return buildResponse(
      internalConfig,
      { message: "Mock route not found" },
      404,
    );
  };
};
