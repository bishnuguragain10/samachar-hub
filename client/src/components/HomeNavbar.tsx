import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function HomeNavbar() {
  const { t, isNepali } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Home", labelNe: "होम", href: "/" },
    {
      id: "politics",
      label: "Politics",
      labelNe: "राजनीति",
      href: "/politics",
    },
    {
      id: "business",
      label: "Business",
      labelNe: "व्यापार",
      href: "/business",
    },
    {
      id: "technology",
      label: "Technology",
      labelNe: "प्रविध्य",
      href: "/technology",
    },
    { id: "sports", label: "Sports", labelNe: "खेलाडु", href: "/sports" },
    {
      id: "entertainment",
      label: "Entertainment",
      labelNe: "मनोरञ्जन",
      href: "/entertainment",
    },
    {
      id: "international",
      label: "International",
      labelNe: "अन्तराष्ट्रिय",
      href: "/international",
    },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-2xl font-bold text-news-red hover:text-news-red/90 transition-colors"
          >
            Samachar Hub
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-6">
            {menuItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                className={`${
                  location.pathname === item.href
                    ? "text-news-red bg-news-red/10"
                    : "text-gray-700 hover:text-news-red hover:bg-gray-50"
                } px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 transform hover:scale-105 ${
                  isNepali ? "font-nepali" : ""
                }`}
                aria-label={t(item.label, item.labelNe)}
              >
                {t(item.label, item.labelNe)}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("Toggle mobile menu", "मोबाइल मेनु")}
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 space-y-2">
                {menuItems.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium text-gray-700 hover:text-news-red hover:bg-gray-50 ${
                      isNepali ? "font-nepali" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.label, item.labelNe)}
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
