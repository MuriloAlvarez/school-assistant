export const ROUTES = {
  HOME: "/",
  SCHOOLS: {
    LIST: "/",
    NEW: "/schools/new",
    DETAIL_PATHNAME: "/schools/[id]" as const,
    EDIT_PATHNAME: "/schools/edit/[id]" as const,
    detail: (id: string) => `/schools/${id}`,
    edit: (id: string) => `/schools/edit/${id}`,
  },
  CLASSES: {
    NEW: "/classes/new",
    DETAIL_PATHNAME: "/classes/[id]" as const,
    EDIT_PATHNAME: "/classes/edit/[id]" as const,
    detail: (id: string) => `/classes/${id}`,
    edit: (id: string) => `/classes/edit/${id}`,
  },
} as const;
