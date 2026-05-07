import { useEffect } from "react";
import { useLocation } from "wouter";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLoginPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "admin") {
      setLocation("/admin", { replace: true });
    }
  }, [isAuthenticated, loading, setLocation, user?.role]);

  if (loading || (isAuthenticated && user?.role === "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <AdminLoginForm
        title={t("Admin Login", "प्रशासक लगइन")}
        description={t(
          "Sign in with the admin email and password to open the dashboard.",
          "ड्यासबोर्ड खोल्न प्रशासक ईमेल र पासवर्डबाट साइन इन गर्नुहोस्।"
        )}
      />
    </div>
  );
}
