import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { TrendingUp, Grid3x3, Search, User } from "lucide-react";

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const navItems = [
    { href: "/search", icon: Search, label: "Search" },
    { href: "/category", icon: Grid3x3, label: "Categories" },
    { href: "/trending", icon: TrendingUp, label: "Trending" },
    ...(loading
      ? []
      : isAuthenticated
      ? [{ href: "/bookmarks", icon: User, label: "Profile" }]
      : [{ href: "/login", icon: User, label: "Login" }]),
  ];

  const isActive = (href: string) => {
    return location.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors ${
                active ? "text-news-red" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
