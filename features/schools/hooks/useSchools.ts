import { useCallback, useEffect } from "react";
import { STATE_ERROR_MESSAGES } from "@/core/constants";
import { useSchoolStore } from "../store/schoolStore";
import { schoolRepository } from "../services/schoolService";
import type { CreateSchoolDTO, UpdateSchoolDTO } from "../types";

export const useSchools = () => {
  const {
    schools,
    setSchools,
    isLoading,
    setLoading,
    error,
    setError,
    filters,
    addSchool,
    updateSchool: updateSchoolInStore,
    removeSchool,
  } = useSchoolStore();

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await schoolRepository.findAll(filters);
      setSchools(data);
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.SCHOOL.FETCH);
    } finally {
      setLoading(false);
    }
  }, [filters, setSchools, setLoading, setError]);

  const createSchool = async (data: CreateSchoolDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newSchool = await schoolRepository.create(data);
      addSchool(newSchool);
      return newSchool;
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.SCHOOL.CREATE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (id: string, data: UpdateSchoolDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSchool = await schoolRepository.update(id, data);
      updateSchoolInStore(updatedSchool);
      return updatedSchool;
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.SCHOOL.UPDATE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await schoolRepository.delete(id);
      removeSchool(id);
    } catch (err) {
      setError(STATE_ERROR_MESSAGES.SCHOOL.DELETE);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    isLoading,
    error,
    fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  };
};
