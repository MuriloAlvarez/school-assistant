import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import {
  ROUTES,
  STATE_ERROR_MESSAGES,
  TOAST_MESSAGES,
} from "@/src/shared/constants";
import { useRequestHandler } from "@/src/shared/hooks/useRequestHandler";
import { schoolRepository } from "./services";
import { useSchoolStore } from "./store";
import type { CreateSchoolDTO, UpdateSchoolDTO } from "./types";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schoolSchema } from "./schemas";

interface UseSchoolsOptions {
  schoolId?: string;
  loadList?: boolean;
  loadDetails?: boolean;
}

interface FeedbackMessages {
  successMessage: string;
  errorMessage: string;
}

export const useSchools = (options: UseSchoolsOptions = {}) => {
  const { schoolId, loadList = true, loadDetails = false } = options;
  const router = useRouter();
  const { executeRequest } = useRequestHandler();

  const {
    schools,
    selectedSchool,
    isLoading,
    isFetchingSelectedSchool,
    isDeleteDialogOpen,
    isDeleting,
    error,
    filters,
    setSchools,
    setSelectedSchool,
    setLoading,
    setFetchingSelectedSchool,
    setDeleteDialogOpen,
    setDeleting,
    setError,
    setFilters,
    addSchool,
    updateSchool: updateSchoolInStore,
    removeSchool,
  } = useSchoolStore();

  const initialFormData = useMemo(() => {
    if (!selectedSchool) {
      return null;
    }

    return {
      name: selectedSchool.name,
      address: selectedSchool.address,
      phone: selectedSchool.phone,
      principalName: selectedSchool.principalName,
    };
  }, [selectedSchool]);

  const hookForm = useForm<CreateSchoolDTO>({
    resolver: yupResolver(schoolSchema) as Resolver<CreateSchoolDTO>,
    defaultValues: {
      name: initialFormData?.name || "",
      address: initialFormData?.address || "",
      phone: initialFormData?.phone || "",
      principalName: initialFormData?.principalName || "",
    },
  });

  const { reset } = hookForm;

  useEffect(() => {
    if (!initialFormData) {
      return;
    }

    reset(initialFormData);
  }, [initialFormData, reset]);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);

    const data = await executeRequest(() => schoolRepository.findAll(filters), {
      onError: () => setError(STATE_ERROR_MESSAGES.SCHOOL.FETCH),
    });

    if (data) {
      setSchools(data);
    }

    setLoading(false);
    return data ?? [];
  }, [executeRequest, filters, setError, setLoading, setSchools]);

  const fetchSchoolById = useCallback(
    async (targetSchoolId = schoolId) => {
      if (!targetSchoolId) {
        setSelectedSchool(null);
        return null;
      }

      setFetchingSelectedSchool(true);
      setError(null);

      const data = await executeRequest(
        () => schoolRepository.findById(targetSchoolId),
        {
          onError: () => setError(STATE_ERROR_MESSAGES.SCHOOL.FETCH),
        },
      );

      setSelectedSchool(data);
      setFetchingSelectedSchool(false);
      return data;
    },
    [
      executeRequest,
      schoolId,
      setError,
      setFetchingSelectedSchool,
      setSelectedSchool,
    ],
  );

  const createSchool = useCallback(
    async (data: CreateSchoolDTO, feedback: FeedbackMessages) => {
      setLoading(true);
      setError(null);

      const createdSchool = await executeRequest(
        () => schoolRepository.create(data),
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: (result) => {
            addSchool(result);
            setSelectedSchool(result);
          },
          onError: () => setError(STATE_ERROR_MESSAGES.SCHOOL.CREATE),
        },
      );

      setLoading(false);
      return createdSchool;
    },
    [addSchool, executeRequest, setError, setLoading, setSelectedSchool],
  );

  const updateSchool = useCallback(
    async (
      targetSchoolId: string,
      data: UpdateSchoolDTO,
      feedback: FeedbackMessages,
    ) => {
      setLoading(true);
      setError(null);

      const updatedSchool = await executeRequest(
        () => schoolRepository.update(targetSchoolId, data),
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: (result) => {
            updateSchoolInStore(result);
            setSelectedSchool(result);
          },
          onError: () => setError(STATE_ERROR_MESSAGES.SCHOOL.UPDATE),
        },
      );

      setLoading(false);
      return updatedSchool;
    },
    [
      executeRequest,
      setError,
      setLoading,
      setSelectedSchool,
      updateSchoolInStore,
    ],
  );

  const deleteSchool = useCallback(
    async (targetSchoolId: string, feedback: FeedbackMessages) => {
      setDeleting(true);
      setError(null);

      const wasDeleted = await executeRequest(
        async () => {
          await schoolRepository.delete(targetSchoolId);
          return true;
        },
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: () => {
            removeSchool(targetSchoolId);
          },
          onError: () => setError(STATE_ERROR_MESSAGES.SCHOOL.DELETE),
        },
      );

      setDeleting(false);
      return wasDeleted;
    },
    [executeRequest, removeSchool, setDeleting, setError],
  );

  const submitUpsert = useCallback(
    async (data: CreateSchoolDTO) => {
      if (schoolId) {
        const updatedSchool = await updateSchool(schoolId, data, {
          successMessage: TOAST_MESSAGES.SCHOOL.UPDATED,
          errorMessage: TOAST_MESSAGES.SCHOOL.UPDATE_ERROR,
        });

        if (!updatedSchool) {
          return;
        }

        const resolvedSchoolId = updatedSchool.id || schoolId;

        if (!resolvedSchoolId) {
          router.replace(ROUTES.HOME);
          return;
        }

        router.replace({
          pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
          params: { id: resolvedSchoolId },
        });

        return;
      }

      const createdSchool = await createSchool(data, {
        successMessage: TOAST_MESSAGES.SCHOOL.CREATED,
        errorMessage: TOAST_MESSAGES.SCHOOL.CREATE_ERROR,
      });

      if (!createdSchool) {
        return;
      }

      router.replace(ROUTES.HOME);
    },
    [createSchool, router, schoolId, updateSchool],
  );

  const deleteSelectedSchool = useCallback(async () => {
    const targetSchoolId = schoolId ?? selectedSchool?.id;

    if (!targetSchoolId) {
      return;
    }

    const wasDeleted = await deleteSchool(targetSchoolId, {
      successMessage: TOAST_MESSAGES.SCHOOL.DELETED,
      errorMessage: TOAST_MESSAGES.SCHOOL.DELETE_ERROR,
    });

    if (!wasDeleted) {
      return;
    }

    setDeleteDialogOpen(false);
    router.replace(ROUTES.HOME);
  }, [deleteSchool, router, schoolId, selectedSchool?.id, setDeleteDialogOpen]);

  const navigateToUpsert = useCallback(() => {
    if (!schoolId) {
      return;
    }

    router.push({
      pathname: ROUTES.SCHOOLS.EDIT_PATHNAME,
      params: { id: schoolId },
    });
  }, [router, schoolId]);

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, [setDeleteDialogOpen]);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, [setDeleteDialogOpen]);

  useEffect(() => {
    if (!loadList) {
      return;
    }

    void fetchSchools();
  }, [fetchSchools, loadList]);

  useEffect(() => {
    if (!loadDetails) {
      return;
    }

    if (!schoolId) {
      setSelectedSchool(null);
      return;
    }

    void fetchSchoolById(schoolId);
  }, [fetchSchoolById, loadDetails, schoolId, setSelectedSchool]);

  return {
    schools,
    selectedSchool,
    initialFormData,
    filters,
    isLoading,
    isFetchingSelectedSchool,
    isDeleteDialogOpen,
    isDeleting,
    error,
    setFilters,
    fetchSchools,
    fetchSchoolById,
    submitUpsert,
    deleteSelectedSchool,
    navigateToUpsert,
    openDeleteDialog,
    closeDeleteDialog,
    hookForm,
  };
};
