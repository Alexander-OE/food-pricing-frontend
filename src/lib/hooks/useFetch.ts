"use client";
// The one small hook every data hook is built on: runs a request and tracks loading, error and data.
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // run the request again
}

interface Result<T> {
  key: string; // which request this result belongs to
  data: T | null;
  error: string | null;
}

/** Calls `fetcher` on mount and again whenever `deps` change or `refetch` is called. */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[]): FetchState<T> {
  const [reloads, setReloads] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: "", data: null, error: null });

  // A new key means a new request; while the saved result has an older key we are still loading
  const key = JSON.stringify([...deps, reloads]);

  useEffect(() => {
    let ignore = false; // set when a newer request replaces this one
    fetcher()
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult((previous) => ({ key, data: previous.data, error: getErrorMessage(error) }));
      });
    return () => {
      ignore = true;
    };
    // `fetcher` is a new function every render, so only the key decides when to reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    data: result.data,
    loading: result.key !== key,
    error: result.key === key ? result.error : null,
    refetch: () => setReloads((count) => count + 1),
  };
}
