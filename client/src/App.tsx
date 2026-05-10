import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import BreakingNewsTicker from "./components/BreakingNewsTicker";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminPanel from "./pages/AdminPanel";
import AdminLoginPage from "./pages/AdminLoginPage";
import HiddenAdminAccessPage from "./pages/HiddenAdminAccessPage";
import LoginPage from "./pages/LoginPage";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BreakingNewsTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ArticleWithLayout() {
  return (
    <PublicLayout>
      <ArticlePage />
    </PublicLayout>
  );
}

function CategoryWithLayout() {
  return (
    <PublicLayout>
      <CategoryPage />
    </PublicLayout>
  );
}

function SearchWithLayout() {
  return (
    <PublicLayout>
      <SearchPage />
    </PublicLayout>
  );
}

function BookmarksWithLayout() {
  return (
    <PublicLayout>
      <BookmarksPage />
    </PublicLayout>
  );
}

function HomeWithLayout() {
  return (
    <PublicLayout>
      <Home />
    </PublicLayout>
  );
}

function LoginWithLayout() {
  return (
    <PublicLayout>
      <LoginPage />
    </PublicLayout>
  );
}

function AdminWithLayout() {
  return <AdminPanel />;
}

function AdminLoginWithLayout() {
  return <AdminLoginPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <HomeWithLayout />}</Route>
      <Route path="/article/:slug">{() => <ArticleWithLayout />}</Route>
      <Route path="/category/:slug">{() => <CategoryWithLayout />}</Route>
      <Route path="/search">{() => <SearchWithLayout />}</Route>
      <Route path="/bookmarks">{() => <BookmarksWithLayout />}</Route>
      <Route path="/login">{() => <LoginWithLayout />}</Route>
      <Route path="/hidden-admin-access">
        {() => <HiddenAdminAccessPage />}
      </Route>
      <Route path="/admin/login">{() => <AdminLoginWithLayout />}</Route>
      <Route path="/admin">{() => <AdminWithLayout />}</Route>
      <Route path="/admin/:rest*">{() => <AdminWithLayout />}</Route>
      <Route path="/404">{() => <NotFound />}</Route>
      <Route>{() => <NotFound />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
