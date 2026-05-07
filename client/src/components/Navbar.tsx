import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { localizedCategory } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Bookmark,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";

const FALLBACK_CATEGORIES = [
  { slug: "politics", name: "Politics", nameNe: "राजनीति" },
  { slug: "business", name: "Business", nameNe: "व्यापार" },
  { slug: "technology", name: "Technology", nameNe: "प्रविधि" },
  { slug: "sports", name: "Sports", nameNe: "खेलकुद" },
  { slug: "entertainment", name: "Entertainment", nameNe: "मनोरञ्जन" },
  { slug: "international", name: "International", nameNe: "अन्तर्राष्ट्रिय" },
  { slug: "nepal", name: "Nepal", nameNe: "नेपाल" },
  { slug: "opinion", name: "Opinion", nameNe: "विचार" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: categoriesData } = trpc.categories.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const categories = categoriesData?.length
    ? categoriesData
    : FALLBACK_CATEGORIES;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${
        scrolled ? "shadow-md" : ""
      } bg-background border-b border-border`}
    >
      {/* Top bar */}
      <div className="bg-news-red text-white py-1 px-4 text-xs flex items-center justify-between">
        <span className={language === "ne" ? "font-nepali" : ""}>
          {t("Nepal's Trusted News Source", "नेपालको विश्वसनीय समाचार स्रोत")}
        </span>
        <span className="hidden sm:block">
          {new Date().toLocaleDateString(
            language === "ne" ? "ne-NP" : "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </span>
      </div>

      {/* Main nav */}
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-news-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight text-foreground">
                Samachar Hub
              </div>
              <div className="font-nepali text-xs text-muted-foreground leading-tight">
                समाचार हब
              </div>
            </div>
          </Link>

          {/* Desktop category nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                  location === `/category/${cat.slug}`
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                } ${language === "ne" ? "font-nepali" : ""}`}
              >
                {localizedCategory(cat, language === "ne").name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {t("More", "थप")} <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.slice(6).map(cat => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={language === "ne" ? "font-nepali" : ""}
                    >
                      {localizedCategory(cat, language === "ne").name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <Input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t("Search news...", "समाचार खोज्नुहोस्...")}
                  className="w-40 sm:w-56 h-8 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}

            {/* Language toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-1 text-xs font-medium"
              onClick={toggleLanguage}
              title={t("Switch to Nepali", "अंग्रेजीमा जानुहोस्")}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === "en" ? "नेपाली" : "EN"}
              </span>
            </Button>

            {/* Dark mode */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 text-sm font-medium">
                    {user?.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      {t("Bookmarks", "बुकमार्क")}
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        {t("Admin Panel", "प्रशासन")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("Sign Out", "साइन आउट")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  size="sm"
                  className="h-8 bg-news-red hover:bg-news-red/90 text-white text-xs px-3"
                  onClick={() => (window.location.href = "/login")}
                >
                  {t("Login", "लगइन")}
                </Button>
              </>
            )}

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container py-3 grid grid-cols-2 gap-1">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
                  language === "ne" ? "font-nepali" : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {localizedCategory(cat, language === "ne").name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
