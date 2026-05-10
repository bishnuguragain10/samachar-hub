import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SectionHeaderProps {
  en: string;
  ne: string;
  href?: string;
}

export default function SectionHeader({ en, ne, href }: SectionHeaderProps) {
  const { t, isNepali } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-news-red rounded-full" />
        <h2 className={`text-lg font-bold ${isNepali ? "font-nepali" : ""}`}>
          {t(en, ne)}
        </h2>
      </div>
      {href && (
        <Link href={href}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1 text-muted-foreground hover:text-primary"
          >
            {t("View All", "सबै हेर्नुहोस्")}{" "}
            <ChevronRight className="w-3 h-3" />
          </Button>
        </Link>
      )}
    </div>
  );
}
