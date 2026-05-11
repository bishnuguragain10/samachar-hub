/**
 * Navbar service layer
 * Safe frontend service for navbar categories
 * Currently using mock data - ready for backend integration
 */

import type { NavbarCategory } from "@/data/navbar-categories";

/**
 * Get navbar categories with async loading support
 * Currently returns mock data - ready for backend integration
 */
export async function getNavbarCategoriesService(): Promise<NavbarCategory[]> {
  try {
    // TODO: Replace with real API call when ready
    // const response = await apiRequest('/categories/navbar');
    // return response;
    
    // Mock implementation with delay to simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return static data for now
    return [
      {
        id: 1,
        name: "Home",
        nameNe: "होम",
        slug: "/",
        order: 1,
      },
      {
        id: 2,
        name: "Politics",
        nameNe: "राजनीति",
        slug: "politics",
        order: 2,
      },
      {
        id: 3,
        name: "Business",
        nameNe: "व्यापार",
        slug: "business",
        order: 3,
      },
      {
        id: 4,
        name: "Technology",
        nameNe: "प्रविधि",
        slug: "technology",
        order: 4,
      },
      {
        id: 5,
        name: "Sports",
        nameNe: "खेलकुद",
        slug: "sports",
        order: 5,
      },
      {
        id: 6,
        name: "Entertainment",
        nameNe: "मनोरञ्जन",
        slug: "entertainment",
        order: 6,
      },
      {
        id: 7,
        name: "International",
        nameNe: "अन्तराष्ट्रिय",
        slug: "international",
        order: 7,
      },
    ];
  } catch (error) {
    console.error('[Navbar Service] Failed to load categories:', error);
    // Return fallback data to ensure navbar still works
    return [
      {
        id: 1,
        name: "Home",
        nameNe: "होम",
        slug: "/",
        order: 1,
      },
      {
        id: 2,
        name: "Politics",
        nameNe: "राजनीति",
        slug: "politics",
        order: 2,
      },
      {
        id: 3,
        name: "Business",
        nameNe: "व्यापार",
        slug: "business",
        order: 3,
      },
      {
        id: 4,
        name: "Technology",
        nameNe: "प्रविधि",
        slug: "technology",
        order: 4,
      },
      {
        id: 5,
        name: "Sports",
        nameNe: "खेलकुद",
        slug: "sports",
        order: 5,
      },
      {
        id: 6,
        name: "Entertainment",
        nameNe: "मनोरञ्जन",
        slug: "entertainment",
        order: 6,
      },
      {
        id: 7,
        name: "International",
        nameNe: "अन्तराष्ट्रिय",
        slug: "international",
        order: 7,
      },
    ];
  }
}

/**
 * Get navbar categories with loading state support
 * Returns loading state and data for React components
 */
export function useNavbarCategories() {
  // For now, return static data with loading simulation
  // In future, this will handle real loading states
  return {
    loading: false,
    data: [
      {
        id: 1,
        name: "Home",
        nameNe: "होम",
        slug: "/",
        order: 1,
      },
      {
        id: 2,
        name: "Politics",
        nameNe: "राजनीति",
        slug: "politics",
        order: 2,
      },
      {
        id: 3,
        name: "Business",
        nameNe: "व्यापार",
        slug: "business",
        order: 3,
      },
      {
        id: 4,
        name: "Technology",
        nameNe: "प्रविधि",
        slug: "technology",
        order: 4,
      },
      {
        id: 5,
        name: "Sports",
        nameNe: "खेलकुद",
        slug: "sports",
        order: 5,
      },
      {
        id: 6,
        name: "Entertainment",
        nameNe: "मनोरञ्जन",
        slug: "entertainment",
        order: 6,
      },
      {
        id: 7,
        name: "International",
        nameNe: "अन्तराष्ट्रिय",
        slug: "international",
        order: 7,
      },
    ] as const,
  };
}
