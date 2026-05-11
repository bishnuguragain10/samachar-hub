import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";

const LOGOUT_FLAG_KEY = "auth-logout-flag";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  // Track if user has explicitly logged out to prevent re-authentication
  // Use localStorage to persist across page refreshes
  const [hasLoggedOut, setHasLoggedOut] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LOGOUT_FLAG_KEY) === "true";
  });

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: !hasLoggedOut,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: !hasLoggedOut,
    trpc: {
      context: {
        headers: () => {
          if (hasLoggedOut) {
            return { "x-auth-logout-flag": "true" };
          }
          return {};
        },
      },
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      console.error("[Logout] Error:", error);
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        // Already logged out, proceed with cleanup
      } else {
        // For other errors, still proceed with cleanup
        console.error("[Logout] Unexpected error during logout:", error);
      }
    } finally {
      // Set logout flag to prevent re-authentication
      setHasLoggedOut(true);
      localStorage.setItem(LOGOUT_FLAG_KEY, "true");
      
      // Clear client-side state
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      
      // Clear auth-related storage keys only
      const keysToRemove = [
        "manus-runtime-user-info",
        "runway-auth-state",
        "runway-auth-tokens",
        "auth-user",
        "user",
        "session",
        "token",
        LOGOUT_FLAG_KEY,
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Redirect to home page to ensure clean state
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    // Clear logout flag if user is authenticated (new login happened)
    if (meQuery.data && hasLoggedOut) {
      localStorage.removeItem(LOGOUT_FLAG_KEY);
      setHasLoggedOut(false);
    }
    
    // If logout flag is set, force user to null regardless of query result
    // But only if the query is not loading (to allow initial check)
    if (hasLoggedOut && !meQuery.isLoading) {
      return {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    }
    
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data) && !hasLoggedOut,
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    hasLoggedOut,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => {
      // Only allow refresh if user hasn't logged out
      if (!hasLoggedOut) {
        meQuery.refetch();
      }
    },
    logout,
  };
}
