import AdminLoginForm from "@/components/AdminLoginForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HiddenAdminAccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <AdminLoginForm
        title={t("Hidden Admin Access", "लुकेको प्रशासक पहुँच")}
        description={t(
          "This page is not linked from the public UI. Use the hidden URL directly.",
          "यो पृष्ठ सार्वजनिक UI बाट लिंक गरिएको छैन। लुकाएको URL सिधै प्रयोग गर्नुहोस्।"
        )}
      />
    </div>
  );
}
