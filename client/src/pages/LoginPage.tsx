import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!email.trim()) return;
    const params = new URLSearchParams({
      email: email.trim(),
      name: name.trim() || "Development Admin",
      openId: email.trim(),
    });
    window.location.href = `/api/dev-login?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t("Dev Login", "डेभ लगइन")}</h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Enter your name and email to log in as admin in development mode.",
                "विकास मोडमा प्रशासकको रूपमा लगइन गर्न आफ्नो नाम र इमेल प्रविष्ट गर्नुहोस्।"
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("Name", "नाम")}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Your name", "तपाईंको नाम")}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("Email", "इमेल")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("your@example.com", "तपाईंको@उदाहरण.कम")}/>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleLogin} className="bg-news-red text-white">
              {t("Login as Admin", "प्रशासकको रूपमा लगइन गर्नुहोस्")}
            </Button>
            <Link href="/" className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              {t("Back to Home", "गृहपृष्ठमा फर्कनुहोस्")}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
