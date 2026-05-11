/**
 * Navbar service layer
 * Unified category management - uses central database API
 * DEPRECATED: Use trpc.categories.navList.useQuery() directly in components
 * This file is kept for backward compatibility but should be removed in future
 */

/**
 * Get navbar categories with async loading support
 * DEPRECATED: Use trpc.categories.navList.useQuery() directly
 * This function is kept for backward compatibility only
 */
export async function getNavbarCategoriesService(): Promise<any[]> {
  try {
    // This service is deprecated - use tRPC directly
    console.warn(
      "[Navbar Service] getNavbarCategoriesService is deprecated. Use trpc.categories.navList.useQuery() directly in components."
    );
    return [];
  } catch (error) {
    console.error("[Navbar Service] Failed to load categories:", error);
    return [];
  }
}

/**
 * Get navbar categories with loading state support
 * DEPRECATED: Use trpc.categories.navList.useQuery() directly
 * This function is kept for backward compatibility only
 */
export function useNavbarCategories() {
  console.warn(
    "[Navbar Service] useNavbarCategories is deprecated. Use trpc.categories.navList.useQuery() directly in components."
  );
  return {
    loading: false,
    data: [],
  };
}
