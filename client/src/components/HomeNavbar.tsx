import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { getNavbarCategories } from "@/data/navbar-categories";

interface Category {
  id: number;
  name: string;
  nameNe?: string | null;
  slug: string;
}

export default function HomeNavbar() {
  const { t, isNepali } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pathname] = useLocation();

  // Get navbar categories from central database source with fallback to default categories
  const { data: menuItems, isLoading: categoriesLoading } =
    trpc.categories.navList.useQuery();

  // Fallback to default categories if API returns empty or on error
  const categories =
    menuItems && menuItems.length > 0 ? menuItems : getNavbarCategories();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-16 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-news-red hover:text-news-red/90 transition-colors"
          >
            Samachar Hub
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4 lg:space-x-6">
            {categories.map((item: Category) => (
              <Link
                key={item.id}
                href={`/category/${item.slug}`}
                className={`${
                  pathname === `/category/${item.slug}`
                    ? "text-news-red bg-news-red/10"
                    : "text-gray-700 hover:text-news-red hover:bg-gray-50"
                } px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 transform hover:scale-105 ${
                  isNepali ? "font-nepali" : ""
                }`}
                aria-label={t(item.name, item.nameNe)}
              >
                {t(item.name, item.nameNe)}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("Toggle mobile menu", "मोबाइल मेनु")}
            className="p-2 h-10 w-10"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-[60]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
              <div className="py-3 sm:py-4 space-y-1 sm:space-y-2">
                {categories.map((item: Category) => (
                  <Link
                    key={item.id}
                    href={`/category/${item.slug}`}
                    className={`block px-3 sm:px-4 py-3 text-base font-medium text-gray-700 hover:text-news-red hover:bg-gray-50 rounded-md transition-colors ${
                      isNepali ? "font-nepali" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.name, item.nameNe)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
