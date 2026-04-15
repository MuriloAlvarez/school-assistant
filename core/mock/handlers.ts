import { http, HttpResponse, delay } from "msw";
import type { CreateClassDTO, SchoolClass } from "@/features/classes";
import type { CreateSchoolDTO, School } from "@/features/schools";

const currentYear = new Date().getFullYear();

let schools: School[] = [
  {
    id: "1",
    name: "Escola Municipal Paulo Freire",
    address: "Rua das Flores, 123",
    phone: "(11) 4002-8922",
    principalName: "Maria Silva",
    classCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CIEP 123 - Tancredo Neves",
    address: "Av. Brasil, S/N",
    phone: "(21) 2233-4455",
    principalName: "João Souza",
    classCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let classes: SchoolClass[] = [
  {
    id: "c1",
    schoolId: "1",
    name: "1º Ano A",
    shift: "morning",
    academicYear: currentYear,
    capacity: 30,
    teacherName: "Ana Paula",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    schoolId: "1",
    name: "2º Ano B",
    shift: "afternoon",
    academicYear: currentYear,
    capacity: 25,
    teacherName: "Carlos Lima",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get("/api/schools", async () => {
    await delay(500);
    return HttpResponse.json(schools);
  }),

  http.post("/api/schools", async ({ request }) => {
    const data = (await request.json()) as CreateSchoolDTO;
    const newSchool: School = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      classCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    schools.push(newSchool);
    return HttpResponse.json(newSchool, { status: 201 });
  }),

  http.get("/api/schools/:id", async ({ params }) => {
    const school = schools.find((s) => s.id === params.id);
    if (!school) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(school);
  }),

  http.put("/api/schools/:id", async ({ params, request }) => {
    const schoolIndex = schools.findIndex((school) => school.id === params.id);
    if (schoolIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = (await request.json()) as Partial<School>;
    const currentSchool = schools[schoolIndex];
    const updatedSchool: School = {
      ...currentSchool,
      ...data,
      id: currentSchool.id,
      classCount: currentSchool.classCount,
      updatedAt: new Date().toISOString(),
    };

    schools[schoolIndex] = updatedSchool;
    return HttpResponse.json(updatedSchool);
  }),

  http.delete("/api/schools/:id", async ({ params }) => {
    const schoolId = params.id as string;
    const schoolExists = schools.some((school) => school.id === schoolId);
    if (!schoolExists) {
      return new HttpResponse(null, { status: 404 });
    }

    schools = schools.filter((school) => school.id !== schoolId);
    classes = classes.filter(
      (schoolClass) => schoolClass.schoolId !== schoolId,
    );

    return HttpResponse.json({ success: true });
  }),

  http.get("/api/schools/:id/classes", async ({ params }) => {
    const schoolClasses = classes.filter((c) => c.schoolId === params.id);
    return HttpResponse.json(schoolClasses);
  }),

  http.post("/api/schools/:id/classes", async ({ params, request }) => {
    const data = (await request.json()) as CreateClassDTO;
    const newClass: SchoolClass = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      schoolId: params.id as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    classes.push(newClass);

    // Update class count
    const school = schools.find((s) => s.id === params.id);
    if (school) school.classCount++;

    return HttpResponse.json(newClass, { status: 201 });
  }),

  http.put("/api/classes/:id", async ({ params, request }) => {
    const classIndex = classes.findIndex(
      (schoolClass) => schoolClass.id === params.id,
    );
    if (classIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = (await request.json()) as Partial<SchoolClass>;
    const currentClass = classes[classIndex];
    const updatedClass: SchoolClass = {
      ...currentClass,
      ...data,
      id: currentClass.id,
      schoolId: currentClass.schoolId,
      updatedAt: new Date().toISOString(),
    };

    classes[classIndex] = updatedClass;
    return HttpResponse.json(updatedClass);
  }),

  http.delete("/api/classes/:id", async ({ params }) => {
    const classId = params.id as string;
    const targetClass = classes.find(
      (schoolClass) => schoolClass.id === classId,
    );
    if (!targetClass) {
      return new HttpResponse(null, { status: 404 });
    }

    classes = classes.filter((schoolClass) => schoolClass.id !== classId);

    schools = schools.map((school) =>
      school.id === targetClass.schoolId
        ? { ...school, classCount: Math.max(0, school.classCount - 1) }
        : school,
    );

    return HttpResponse.json({ success: true });
  }),
];
