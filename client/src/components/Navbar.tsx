import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { getNavbarCategories } from "@/data/navbar-categories";
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
  Mail,
} from "lucide-react";
import NewsletterModal from "./NewsletterModal";

export default function Navbar() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Use central category source from database with fallback to default categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    trpc.categories.navList.useQuery();
  // Fallback to default categories if API returns empty or on error
  const categories =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : getNavbarCategories();

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="container mx-auto px-4">
        {/* Mobile layout - hamburger left, logo center, utilities right */}
        <div className="lg:hidden flex items-center h-16">
          {/* FAR LEFT: Hamburger */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 lg:hidden rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* CENTER: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-news-red to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-news-red transition-colors">
                Samachar Hub
              </span>
            </Link>
          </div>

          {/* RIGHT: Utilities */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleLanguage}
              aria-label="Switch language"
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setProfileOpen(true)}
                aria-label="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-news-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 gap-2"
                onClick={() => setNewsletterOpen(true)}
              >
                <Mail className="w-3 h-3" />
                {t("Subscribe", "सदस्यता")}
              </Button>
            )}
          </div>
        </div>

        {/* Desktop layout - logo + categories left, utilities right */}
        <div className="hidden lg:flex items-center h-16">
          {/* Left side: Logo + Categories */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-news-red to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-news-red transition-colors">
                Samachar Hub
              </span>
            </Link>

            {/* Desktop category nav - left aligned */}
            <nav className="flex items-center gap-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-news-red ${
                    location === `/category/${cat.slug}`
                      ? "bg-news-red text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:shadow-sm"
                  } ${language === "ne" ? "font-nepali" : ""}`}
                >
                  {language === "ne" && cat.nameNe ? cat.nameNe : cat.name}
                </Link>
              ))}
              {categories.length > 6 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-news-red transition-all duration-200 gap-1"
                    >
                      {t("More", "थप")} <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg">
                    {categories.slice(6).map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        asChild
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-news-red"
                      >
                        <Link
                          href={`/category/${cat.slug}`}
                          className={`text-sm font-medium dark:text-gray-200 ${language === "ne" ? "font-nepali" : ""}`}
                        >
                          {language === "ne" && cat.nameNe
                            ? cat.nameNe
                            : cat.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t("Search news...", "समाचार खोज्नुहोस्...")}
                  className="w-32 sm:w-48 h-auto border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
              className="h-9 px-3 gap-1 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={toggleLanguage}
              title={t("Switch to Nepali", "अंग्रेजीमा जानुहोस्")}
            >
              <Globe className="w-3 h-3" />
              {language === "ne" ? "EN" : "NE"}
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={toggleTheme}
              title={t("Toggle theme", "विषय परिवर्तन गर्नुहोस्")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Auth */}
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-gray-200 shadow-lg"
                >
                  <div className="flex items-center justify-start gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="border-gray-100" />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-gray-100">
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 text-sm"
                        >
                          <Settings className="w-4 h-4" />
                          {t("Admin Panel", "एडमिन प्यानेल")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-gray-100" />
                    </>
                  )}
                  <DropdownMenuItem asChild className="hover:bg-gray-100">
                    <Link
                      href="/bookmarks"
                      className="flex items-center gap-2 text-sm"
                    >
                      <Bookmark className="w-4 h-4" />
                      {t("Bookmarks", "बुकमार्कहरू")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("Logout", "लगआउट")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-news-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 gap-2"
                onClick={() => setNewsletterOpen(true)}
              >
                <Mail className="w-3 h-3" />
                {t("Subscribe", "सदस्यता")}
              </Button>
            )}
            </div>
          </div>
        </div>

      {/* Mobile menu - categories only, slides from LEFT */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-news-red to-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">Samachar Hub</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile menu content - categories only */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-news-red ${
                        location === `/category/${cat.slug}`
                          ? "bg-news-red text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300"
                      } ${language === "ne" ? "font-nepali" : ""}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {language === "ne" && cat.nameNe ? cat.nameNe : cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile panel - logout only, slides from RIGHT */}
      {profileOpen && isAuthenticated && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Profile panel header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Profile</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setProfileOpen(false)}
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Profile panel content - logout only */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-base text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-news-red rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t("Logout", "लगआउट")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </header>
  );
}
