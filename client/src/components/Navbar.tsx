import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { useNavCategoriesWithCache } from "@/hooks/useCategoriesWithCache";
import { getLoginUrl } from "@/const";
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
  
  // Fetch dynamic navigation categories from backend
  const { data: categoriesData } = trpc.categories.navList.useQuery();
  const categories = categoriesData ?? [];

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
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      } border-b border-gray-100`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-news-red to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:block text-gray-900 group-hover:text-news-red transition-colors">Samachar Hub</span>
          </Link>

          {/* Desktop category nav */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-news-red ${
                  location === `/category/${cat.slug}` 
                    ? "bg-news-red text-white shadow-sm" 
                    : "text-gray-700 hover:shadow-sm"
                } ${language === "ne" ? "font-nepali" : ""}`}
              >
                {language === "ne" && cat.nameNe ? cat.nameNe : cat.name}
              </Link>
            ))}
            {categories.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-news-red transition-all duration-200 gap-1">
                    {t("More", "थप")} <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-gray-200 shadow-lg">
                  {categories.slice(6).map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild className="hover:bg-gray-100 hover:text-news-red">
                      <Link href={`/category/${cat.slug}`} className={`text-sm font-medium ${language === "ne" ? "font-nepali" : ""}`}>
                        {language === "ne" && cat.nameNe ? cat.nameNe : cat.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-gray-200 shadow-lg">
                  <div className="flex items-center justify-start gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-news-red to-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-gray-900">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="border-gray-100" />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-gray-100">
                        <Link href="/admin" className="flex items-center gap-2 text-sm">
                          <Settings className="w-4 h-4" />
                          {t("Admin Panel", "एडमिन प्यानेल")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-gray-100" />
                    </>
                  )}
                  <DropdownMenuItem asChild className="hover:bg-gray-100">
                    <Link href="/bookmarks" className="flex items-center gap-2 text-sm">
                      <Bookmark className="w-4 h-4" />
                      {t("Bookmarks", "बुकमार्कहरू")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      if (location === "/") {
                        window.location.reload();
                      }
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("Logout", "लगआउट")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  size="sm"
                  className="h-9 bg-gradient-to-r from-news-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => (window.location.href = "/login")}
                >
                  {t("Login", "लगइन")}
                </Button>
                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 lg:hidden rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search news...", "समाचार खोज्नुहोस्...")}
                className="flex-1 h-auto border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
            
            {/* Mobile categories */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t("Categories", "श्रेणीहरू")}
              </h3>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-news-red ${
                    location === `/category/${cat.slug}` 
                      ? "bg-news-red text-white shadow-sm" 
                      : "text-gray-700"
                  } ${language === "ne" ? "font-nepali" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {language === "ne" && cat.nameNe ? cat.nameNe : cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
