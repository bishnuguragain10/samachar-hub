import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  title: string;
  titleNe: string;
  message?: string;
  messageNe?: string;
}

export default function EmptyState({ title, titleNe, message, messageNe }: EmptyStateProps) {
  const { t, isNepali } = useLanguage();
  
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4 opacity-50">📰</div>
        <h3 className={`text-lg font-semibold text-muted-foreground mb-2 ${isNepali ? "font-nepali" : ""}`}>
          {t(title, titleNe)}
        </h3>
        {message && (
          <p className={`text-sm text-muted-foreground ${isNepali ? "font-nepali" : ""}`}>
            {t(message, messageNe || "")}
          </p>
        )}
      </div>
    </div>
  );
}
