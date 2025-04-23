import { useState, useCallback } from 'react';

/**
 * Custom hook for handling asynchronous operations with loading and error states
 * @template T The type of data returned by the async function
 * @template E The type of error that might be thrown
 * @param asyncFunction The async function to execute
 * @returns Object containing execute function, loading state, error state, and result
 */
export function useAsync<T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the function is not recreated on each render
  const execute = useCallback(
    async (...args: any[]) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setValue(result);
        setStatus('success');
        return result;
      } catch (error) {
        setError(error as E);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  return {
    execute,
    status,
    value,
    error,
    loading: status === 'pending',
    success: status === 'success',
    isError: status === 'error',
  };
}

export default useAsync; 