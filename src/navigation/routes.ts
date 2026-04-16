export const ROUTES = {
  HOME: "/",
  SCHOOLS: {
    LIST: "/",
    UPSERT: "/schools/upsert",
    UPSERT_PATHNAME: "/schools/upsert" as const,
    DETAIL_PATHNAME: "/schools/[id]" as const,
    NEW: "/schools/new",
    EDIT_PATHNAME: "/schools/edit/[id]" as const,
    detail: (id: string) => `/schools/${id}`,
    edit: (id: string) => `/schools/edit/${id}`,
    upsert: (id?: string) => (id ? `/schools/edit/${id}` : "/schools/new"),
  },
  CLASSES: {
    UPSERT: "/classes/upsert",
    UPSERT_PATHNAME: "/classes/upsert" as const,
    NEW: "/classes/new",
    DETAIL_PATHNAME: "/classes/[id]" as const,
    EDIT_PATHNAME: "/classes/edit/[id]" as const,
    detail: (id: string) => `/classes/${id}`,
    edit: (id: string) => `/classes/edit/${id}`,
    upsert: (id?: string) => (id ? `/classes/edit/${id}` : "/classes/new"),
  },
} as const;
