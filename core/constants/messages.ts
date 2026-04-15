export const TOAST_TITLES = {
  SUCCESS: "Sucesso!",
  ERROR: "Erro",
} as const;

export const TOAST_MESSAGES = {
  SCHOOL: {
    CREATED: "Escola cadastrada com sucesso.",
    UPDATED: "Escola atualizada com sucesso.",
    DELETED: "Escola excluída com sucesso.",
    CREATE_ERROR: "Não foi possível cadastrar a escola.",
    UPDATE_ERROR: "Não foi possível atualizar a escola.",
    DELETE_ERROR: "Não foi possível excluir a escola.",
  },
  CLASS: {
    CREATED: "Turma cadastrada com sucesso.",
    UPDATED: "Turma atualizada com sucesso.",
    DELETED: "Turma excluída com sucesso.",
    CREATE_ERROR: "Não foi possível cadastrar a turma.",
    UPDATE_ERROR: "Não foi possível atualizar a turma.",
    DELETE_ERROR: "Não foi possível excluir a turma.",
  },
} as const;

export const EMPTY_STATE_MESSAGES = {
  HOME_NO_SCHOOLS: {
    TITLE: "Nenhuma escola encontrada",
    DESCRIPTION: "Tente ajustar sua busca ou adicione uma nova escola.",
  },
  SCHOOL: {
    MISSING_ID_TITLE: "Escola não informada",
    MISSING_ID_DESCRIPTION: "Não foi possível identificar a escola solicitada.",
    NOT_FOUND_TITLE: "Escola não encontrada",
    NOT_FOUND_DESCRIPTION: "A escola solicitada não existe no sistema.",
    EDIT_NOT_FOUND_DESCRIPTION:
      "Não foi possível localizar os dados para edição.",
  },
  CLASS: {
    MISSING_ID_TITLE: "Turma não informada",
    MISSING_ID_DESCRIPTION: "Não foi possível identificar a turma solicitada.",
    EDIT_MISSING_ID_DESCRIPTION:
      "Não foi possível identificar a turma para edição.",
    NOT_FOUND_TITLE: "Turma não encontrada",
    NOT_FOUND_DESCRIPTION: "Não foi possível localizar os dados da turma.",
    EDIT_NOT_FOUND_DESCRIPTION:
      "Não foi possível localizar os dados da turma para edição.",
    MISSING_SCHOOL_TITLE: "Escola não informada",
    MISSING_SCHOOL_DESCRIPTION:
      "Não foi possível identificar a escola para cadastrar a turma.",
  },
  SCHOOL_CLASSES: {
    EMPTY_TITLE: "Nenhuma turma",
    EMPTY_DESCRIPTION: "Esta escola ainda não possui turmas vinculadas.",
  },
} as const;

export const STATE_ERROR_MESSAGES = {
  SCHOOL: {
    FETCH: "Erro ao carregar escolas",
    CREATE: "Erro ao criar escola",
    UPDATE: "Erro ao atualizar escola",
    DELETE: "Erro ao excluir escola",
  },
  CLASS: {
    FETCH: "Erro ao carregar turmas",
    CREATE: "Erro ao criar turma",
    UPDATE: "Erro ao atualizar turma",
    DELETE: "Erro ao excluir turma",
    MISSING_SCHOOL_ID: "schoolId é obrigatório para criar turma",
  },
} as const;

export const REPOSITORY_ERROR_MESSAGES = {
  SCHOOL_NOT_FOUND: "Escola não encontrada",
  CLASS_NOT_FOUND: "Turma não encontrada",
} as const;
