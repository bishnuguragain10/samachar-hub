/**
 * Navbar category data structure
 * Currently using static/mock data - ready for backend integration
 */

export interface NavbarCategory {
  id: number;
  name: string;
  nameNe: string;
  slug: string;
  order: number;
}

// Static navbar categories - preserves current order and names
export const navbarCategories: NavbarCategory[] = [
  {
    id: 1,
    name: "Politics",
    nameNe: "राजनीति",
    slug: "politics",
    order: 1,
  },
  {
    id: 2,
    name: "Business",
    nameNe: "व्यापार",
    slug: "business",
    order: 2,
  },
  {
    id: 3,
    name: "Technology",
    nameNe: "प्रविधि",
    slug: "technology",
    order: 3,
  },
  {
    id: 4,
    name: "Sports",
    nameNe: "खेलकुद",
    slug: "sports",
    order: 4,
  },
  {
    id: 5,
    name: "Entertainment",
    nameNe: "मनोरञ्जन",
    slug: "entertainment",
    order: 5,
  },
  {
    id: 6,
    name: "International",
    nameNe: "अन्तराष्ट्रिय",
    slug: "international",
    order: 6,
  },
];

/**
 * Get navbar categories sorted by order
 * Ready for future backend integration
 */
export function getNavbarCategories(): NavbarCategory[] {
  // TODO: Replace with backend API call when ready
  // const response = await apiRequest('/categories/navbar');
  // return response;
  
  return navbarCategories.sort((a, b) => a.order - b.order);
}

/**
 * Get navbar categories by limit
 * Used for desktop navigation (first 6 + dropdown)
 */
export function getNavbarCategoriesWithLimit(limit: number): NavbarCategory[] {
  const categories = getNavbarCategories();
  return categories.slice(0, limit);
}
