import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import {
  ROUTES,
  STATE_ERROR_MESSAGES,
  TOAST_MESSAGES,
} from "@/src/shared/constants";
import { useRequestHandler } from "@/src/shared/hooks/useRequestHandler";
import { notify } from "@/src/shared/store";
import { classRepository } from "./services";
import { useClassStore } from "./store";
import { useSchoolStore } from "@/src/modules/schools/store/schoolStore";
import type { CreateClassDTO, UpdateClassDTO } from "./types";

interface UseClassesOptions {
  schoolId?: string;
  classId?: string;
  autoLoad?: boolean;
}

interface FeedbackMessages {
  successMessage: string;
  errorMessage: string;
}

export const useClasses = (options: UseClassesOptions = {}) => {
  const { schoolId, classId, autoLoad = true } = options;
  const router = useRouter();
  const { executeRequest } = useRequestHandler();

  const {
    classes,
    selectedClass,
    isLoading,
    isFetchingSelectedClass,
    isDeleteDialogOpen,
    isDeleting,
    error,
    setClasses,
    setSelectedClass,
    setLoading,
    setFetchingSelectedClass,
    setDeleteDialogOpen,
    setDeleting,
    setError,
    addClass,
    updateClass: updateClassInStore,
    removeClass,
  } = useClassStore();

  const incrementSchoolClassCount = useSchoolStore(
    (state) => state.incrementSchoolClassCount,
  );
  const decrementSchoolClassCount = useSchoolStore(
    (state) => state.decrementSchoolClassCount,
  );

  const fetchClasses = useCallback(
    async (targetSchoolId = schoolId) => {
      if (!targetSchoolId) {
        setClasses([]);
        return [];
      }

      setLoading(true);
      setError(null);

      const data = await executeRequest(
        () => classRepository.findBySchoolId(targetSchoolId),
        {
          onError: () => setError(STATE_ERROR_MESSAGES.CLASS.FETCH),
        },
      );

      if (data) {
        setClasses(data);
      }

      setLoading(false);
      return data ?? [];
    },
    [executeRequest, schoolId, setClasses, setError, setLoading],
  );

  const fetchClassById = useCallback(
    async (targetClassId = classId) => {
      if (!targetClassId) {
        setSelectedClass(null);
        return null;
      }

      setFetchingSelectedClass(true);
      setError(null);

      const data = await executeRequest(
        () => classRepository.findById(targetClassId),
        {
          onError: () => setError(STATE_ERROR_MESSAGES.CLASS.FETCH),
        },
      );

      setSelectedClass(data);
      setFetchingSelectedClass(false);
      return data;
    },
    [
      classId,
      executeRequest,
      setError,
      setFetchingSelectedClass,
      setSelectedClass,
    ],
  );

  const createClass = useCallback(
    async (
      targetSchoolId: string,
      data: CreateClassDTO,
      feedback: FeedbackMessages,
    ) => {
      setLoading(true);
      setError(null);

      const createdClass = await executeRequest(
        () => classRepository.create(targetSchoolId, data),
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: (result) => {
            addClass(result);
            incrementSchoolClassCount(targetSchoolId);
          },
          onError: () => setError(STATE_ERROR_MESSAGES.CLASS.CREATE),
        },
      );

      setLoading(false);
      return createdClass;
    },
    [addClass, executeRequest, incrementSchoolClassCount, setError, setLoading],
  );

  const updateClass = useCallback(
    async (
      targetClassId: string,
      data: UpdateClassDTO,
      feedback: FeedbackMessages,
    ) => {
      setLoading(true);
      setError(null);

      const updatedClass = await executeRequest(
        () => classRepository.update(targetClassId, data),
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: (result) => {
            updateClassInStore(result);
            setSelectedClass(result);
          },
          onError: () => setError(STATE_ERROR_MESSAGES.CLASS.UPDATE),
        },
      );

      setLoading(false);
      return updatedClass;
    },
    [
      executeRequest,
      setError,
      setLoading,
      setSelectedClass,
      updateClassInStore,
    ],
  );

  const deleteClass = useCallback(
    async (
      targetClassId: string,
      targetSchoolId: string | undefined,
      feedback: FeedbackMessages,
    ) => {
      setDeleting(true);
      setError(null);

      const wasDeleted = await executeRequest(
        async () => {
          await classRepository.delete(targetClassId);
          return true;
        },
        {
          successMessage: feedback.successMessage,
          errorMessage: feedback.errorMessage,
          onSuccess: () => {
            removeClass(targetClassId);
            if (targetSchoolId) {
              decrementSchoolClassCount(targetSchoolId);
            }
          },
          onError: () => setError(STATE_ERROR_MESSAGES.CLASS.DELETE),
        },
      );

      setDeleting(false);
      return wasDeleted;
    },
    [
      decrementSchoolClassCount,
      executeRequest,
      removeClass,
      setDeleting,
      setError,
    ],
  );

  const submitUpsert = useCallback(
    async (data: CreateClassDTO) => {
      if (classId) {
        const updatedClass = await updateClass(classId, data, {
          successMessage: TOAST_MESSAGES.CLASS.UPDATED,
          errorMessage: TOAST_MESSAGES.CLASS.UPDATE_ERROR,
        });

        if (!updatedClass) {
          return;
        }

        const resolvedSchoolId = schoolId ?? updatedClass.schoolId;

        router.replace({
          pathname: ROUTES.CLASSES.DETAIL_PATHNAME,
          params: resolvedSchoolId
            ? { id: updatedClass.id, schoolId: resolvedSchoolId }
            : { id: updatedClass.id },
        });

        return;
      }

      if (!schoolId) {
        setError(STATE_ERROR_MESSAGES.CLASS.MISSING_SCHOOL_ID);
        notify.error(TOAST_MESSAGES.CLASS.CREATE_ERROR);
        return;
      }

      const createdClass = await createClass(schoolId, data, {
        successMessage: TOAST_MESSAGES.CLASS.CREATED,
        errorMessage: TOAST_MESSAGES.CLASS.CREATE_ERROR,
      });

      if (!createdClass) {
        return;
      }

      router.replace({
        pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
        params: { id: schoolId },
      });
    },
    [classId, createClass, router, schoolId, setError, updateClass],
  );

  const deleteCurrentClass = useCallback(async () => {
    if (!classId) {
      return;
    }

    const targetSchoolId = schoolId ?? selectedClass?.schoolId;

    const wasDeleted = await deleteClass(classId, targetSchoolId, {
      successMessage: TOAST_MESSAGES.CLASS.DELETED,
      errorMessage: TOAST_MESSAGES.CLASS.DELETE_ERROR,
    });

    if (!wasDeleted) {
      return;
    }

    setDeleteDialogOpen(false);

    if (targetSchoolId) {
      router.replace({
        pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
        params: { id: targetSchoolId },
      });
      return;
    }

    router.replace(ROUTES.HOME);
  }, [
    classId,
    deleteClass,
    router,
    schoolId,
    selectedClass?.schoolId,
    setDeleteDialogOpen,
  ]);

  const navigateToUpsert = useCallback(() => {
    if (!classId) {
      return;
    }

    router.push({
      pathname: ROUTES.CLASSES.EDIT_PATHNAME,
      params: schoolId ? { id: classId, schoolId } : { id: classId },
    });
  }, [classId, router, schoolId]);

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, [setDeleteDialogOpen]);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, [setDeleteDialogOpen]);

  const initialFormData = useMemo(() => {
    if (!selectedClass) {
      return null;
    }

    return {
      name: selectedClass.name,
      shift: selectedClass.shift,
      academicYear: selectedClass.academicYear,
      capacity: selectedClass.capacity,
      teacherName: selectedClass.teacherName,
    };
  }, [selectedClass]);

  useEffect(() => {
    if (!autoLoad) {
      return;
    }

    if (classId) {
      void fetchClassById(classId);
      return;
    }

    if (schoolId) {
      void fetchClasses(schoolId);
      return;
    }

    setSelectedClass(null);
  }, [
    autoLoad,
    classId,
    fetchClassById,
    fetchClasses,
    schoolId,
    setSelectedClass,
  ]);

  const isEditMode = Boolean(classId);
  const effectiveSchoolId = schoolId ?? selectedClass?.schoolId;

  return {
    classes,
    selectedClass,
    initialFormData,
    effectiveSchoolId,
    isEditMode,
    isLoading,
    isFetchingSelectedClass,
    isDeleteDialogOpen,
    isDeleting,
    error,
    fetchClasses,
    fetchClassById,
    submitUpsert,
    deleteCurrentClass,
    navigateToUpsert,
    openDeleteDialog,
    closeDeleteDialog,
  };
};
