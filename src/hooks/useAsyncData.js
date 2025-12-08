/**
 * useAsyncData Hook
 * Standardizes async data loading with loading, error, and data states
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing async data fetching
 * @param {Function} asyncFunction - Async function to fetch data
 * @param {Array} dependencies - Dependencies array for re-fetching
 * @returns {Object} { data, loading, error, refetch }
 */
export function useAsyncData(asyncFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      console.error('Async data error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          console.error('Async data error:', err);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for async data with manual trigger
 * @param {Function} asyncFunction - Async function to fetch data
 * @returns {Object} { data, loading, error, execute }
 */
export function useAsyncAction(asyncFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      console.error('Async action error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return {
    data,
    loading,
    error,
    execute,
  };
}

export default useAsyncData;
