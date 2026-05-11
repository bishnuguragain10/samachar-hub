/**
 * Navbar service layer
 * Safe frontend service for navbar categories
 * Currently using mock data from shared data file - ready for backend integration
 */

import { getNavbarCategories } from "../data/navbar-categories";
import type { NavbarCategory } from "../data/navbar-categories";

/**
 * Get navbar categories with async loading support
 * Currently returns mock data from shared file - ready for backend integration
 */
export async function getNavbarCategoriesService(): Promise<NavbarCategory[]> {
  try {
    // TODO: Replace with real API call when ready
    // const response = await apiRequest('/categories/navbar');
    // return response;

    // Mock implementation with delay to simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return data from shared file
    return getNavbarCategories();
  } catch (error) {
    console.error('[Navbar Service] Failed to load categories:', error);
    // Return fallback data from shared file to ensure navbar still works
    return getNavbarCategories();
  }
}

/**
 * Get navbar categories with loading state support
 * Returns loading state and data for React components
 * Currently uses static data - ready for async backend integration
 */
export function useNavbarCategories() {
  // For now, return static data with loading simulation
  // In future, this will handle real loading states via React Query or SWR
  return {
    loading: false,
    data: getNavbarCategories(),
  };
}
