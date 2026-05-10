import { useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap } from "lucide-react";

export default function BreakingNewsTicker() {
  const { t, isNepali } = useLanguage();
  const { data } = trpc.articles.list.useQuery({ limit: 8, breaking: true });

  const breakingArticles = data?.articles ?? [];

  if (breakingArticles.length === 0) return null;

  const tickerText = breakingArticles
    .map(item => {
      const title =
        isNepali && item.article.titleNe
          ? item.article.titleNe
          : item.article.title;
      return `${title}`;
    })
    .join("   •   ");

  return (
    <div className="bg-news-red text-white overflow-hidden">
      <div className="container">
        <div className="flex items-center h-9">
          {/* Label */}
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-white/30 mr-3">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span
              className={`text-xs font-bold uppercase tracking-wide ${isNepali ? "font-nepali" : ""}`}
            >
              {t("Breaking", "ब्रेकिङ")}
            </span>
          </div>

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="ticker-scroll text-sm font-medium">
              {breakingArticles.map((item, idx) => (
                <span key={item.article.id}>
                  <Link
                    href={`/article/${item.article.slug}`}
                    className="hover:underline cursor-pointer"
                  >
                    {isNepali && item.article.titleNe
                      ? item.article.titleNe
                      : item.article.title}
                  </Link>
                  {idx < breakingArticles.length - 1 && (
                    <span className="mx-6 opacity-60">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
