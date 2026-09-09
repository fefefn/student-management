import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  /** Re-runs the request (e.g. after a delete). */
  refetch: () => void;
  /** Optimistically update the cached data. */
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Small data-fetching hook: runs `fetcher` whenever `deps` change and tracks
 * loading / error state. Ignores responses from stale requests.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!isCancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!isCancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, isLoading, error, refetch, setData };
}
