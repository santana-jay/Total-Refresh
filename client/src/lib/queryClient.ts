// =============================================================================
// REACT QUERY CLIENT (client/src/lib/queryClient.ts)
// =============================================================================
// Configures the TanStack React Query client used for server-state management.
//
// Exports:
//   - apiRequest() — generic fetch wrapper for POST/PUT/DELETE requests
//   - getQueryFn() — factory for query functions with configurable 401 handling
//   - queryClient — singleton QueryClient instance with sensible defaults
// =============================================================================

import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Throws an error if the fetch response is not OK (status 2xx)
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Generic API request helper — sends JSON data and checks for errors
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Factory that creates a query function for React Query.
// on401: "returnNull" — silently return null on 401 (useful for optional auth checks)
// on401: "throw" — throw an error on 401 (default behavior)
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Singleton React Query client with default settings:
//   - No automatic refetch on window focus or interval
//   - Data stays fresh forever (manual invalidation only)
//   - No automatic retries on failure
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
