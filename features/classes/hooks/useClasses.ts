import { useCallback } from "react";
import { STATE_ERROR_MESSAGES } from "@/core/constants";
import { useClassStore } from "../store/classStore";
import { classRepository } from "../services/classService";
import { useSchoolStore } from "@/features/schools/store/schoolStore";
import type { CreateClassDTO, UpdateClassDTO } from "@/features/classes/types";

export const useClasses = (schoolId?: string) => {
  const {
    classes,
    setClasses,
    isLoading,
    setLoading,
    error,
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

  const fetchClasses = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await classRepository.findBySchoolId(schoolId);
      setClasses(data);
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.CLASS.FETCH);
    } finally {
      setLoading(false);
    }
  }, [schoolId, setClasses, setLoading, setError]);

  const createClass = async (data: CreateClassDTO) => {
    if (!schoolId) {
      const missingSchoolError = new Error(
        STATE_ERROR_MESSAGES.CLASS.MISSING_SCHOOL_ID,
      );
      setError(STATE_ERROR_MESSAGES.CLASS.CREATE);
      throw missingSchoolError;
    }

    setLoading(true);
    setError(null);
    try {
      const newClass = await classRepository.create(schoolId, data);
      addClass(newClass);
      incrementSchoolClassCount(schoolId);
      return newClass;
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.CLASS.CREATE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, data: UpdateClassDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedClass = await classRepository.update(id, data);
      updateClassInStore(updatedClass);
      return updatedClass;
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.CLASS.UPDATE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string, targetSchoolId?: string) => {
    const resolvedSchoolId = targetSchoolId ?? schoolId;
    setLoading(true);
    setError(null);
    try {
      await classRepository.delete(id);
      removeClass(id);
      if (resolvedSchoolId) {
        decrementSchoolClassCount(resolvedSchoolId);
      }
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.CLASS.DELETE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  };
};
