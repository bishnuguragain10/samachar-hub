import { trpc } from "@/lib/trpc";

// Optimized hook with caching for category data
export function useCategoriesWithCache() {
  return trpc.categories.list.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useNavCategoriesWithCache() {
  return trpc.categories.navList.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useFeaturedCategoriesWithCache() {
  return trpc.categories.featured.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}
