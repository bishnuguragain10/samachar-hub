import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HiddenAdminAccessPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error(t("Please enter both email and password.", "कृपया ईमेल र पासवर्ड दुवै प्रविष्ट गर्नुहोस्।"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error ?? t("Admin login failed.", "प्रशासक लगइन असफल भयो।"));
        return;
      }

      toast.success(t("Login successful. Redirecting to admin dashboard...", "लगइन सफल भयो। प्रशासक ड्यासबोर्डमा प्रस्थान हुँदैछ..."));
      window.location.assign("/admin");
    } catch (error) {
      console.error("[Hidden Admin Access] login failed", error);
      toast.error(t("Unable to sign in. Please try again.", "साइन इन गर्न असमर्थ। कृपया पुन: प्रयास गर्नुहोस्।"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error(t("Enter the admin email first to receive reset instructions.", "रिसेट निर्देशनहरू प्राप्त गर्न पहिला प्रशासक ईमेल प्रविष्ट गर्नुहोस्।"));
      return;
    }

    try {
      const response = await fetch("/api/admin-forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error ?? t("Unable to request password reset.", "पासवर्ड रिसेट अनुरोध गर्न असमर्थ।"));
        return;
      }
      toast.success(t("Reset instructions were sent. Check server logs.", "रिसेट निर्देशनहरू पठाइयो। सर्वर लगहरू जाँच गर्नुहोस्।"));
    } catch (error) {
      console.error("[Hidden Admin Access] forgot password failed", error);
      toast.error(t("Unable to request password reset.", "पासवर्ड रिसेट अनुरोध गर्न असमर्थ।"));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{t("Hidden Admin Access", "लुकेको प्रशासक पहुँच")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "This page is not linked from the public UI. Use the hidden URL directly.",
              "यो पृष्ठ सार्वजनिक UI बाट लिंक गरिएको छैन। लुकाएको URL सिधै प्रयोग गर्नुहोस्।"
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="admin-email">{t("Email", "ईमेल")}</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="bishnu.guragain.10@gmail.com"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="admin-password">{t("Password", "पासवर्ड")}</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("Enter your password", "आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्")}
              className="mt-2"
              required
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? t("Signing in...", "साइन इन हुँदैछ...") : t("Sign In", "साइन इन")}
            </Button>
            <Button type="button" variant="outline" onClick={handleForgotPassword} disabled={isSubmitting}>
              {t("Forgot Password", "पासवर्ड बिर्सनुभयो")}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
            {t(
              "Only the hidden admin email and password work here.",
              "यहाँ केवल लुकेको प्रशासक ईमेल र पासवर्ड मात्र काम गर्दछ।"
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
