import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsCard from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialQuery = params.get("q") ?? "";

  const { t, isNepali } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [offset, setOffset] = useState(0);
  const LIMIT = 9;

  const { data, isLoading } = trpc.articles.search.useQuery(
    { query: submittedQuery, limit: LIMIT, offset },
    { enabled: submittedQuery.length > 0 }
  );

  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setOffset(0);
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <h1 className={`text-2xl font-bold mb-6 ${isNepali ? "font-nepali" : ""}`}>
          {t("Search News", "समाचार खोज्नुहोस्")}
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search articles, topics, tags...", "लेख, विषय, ट्याग खोज्नुहोस्...")}
            className="flex-1"
          />
          <Button type="submit" className="bg-news-red hover:bg-news-red/90 text-white gap-2">
            <Search className="w-4 h-4" />
            {t("Search", "खोज")}
          </Button>
        </form>

        {submittedQuery && (
          <p className={`text-sm text-muted-foreground mb-6 ${isNepali ? "font-nepali" : ""}`}>
            {isLoading
              ? t("Searching...", "खोज्दै...")
              : t(
                  `${total} result${total !== 1 ? "s" : ""} for "${submittedQuery}"`,
                  `"${submittedQuery}" को लागि ${total} परिणाम`
                )}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 && submittedQuery ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className={`text-lg ${isNepali ? "font-nepali" : ""}`}>
              {t(`No results found for "${submittedQuery}"`, `"${submittedQuery}" को लागि कुनै परिणाम फेला परेन`)}
            </p>
            <p className={`text-sm mt-2 ${isNepali ? "font-nepali" : ""}`}>
              {t("Try different keywords", "फरक कुञ्जी शब्दहरू प्रयास गर्नुहोस्")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((item) => (
                <NewsCard key={item.article.id} data={item} variant="default" showExcerpt />
              ))}
            </div>

            {total > LIMIT && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                >
                  {t("Previous", "अघिल्लो")}
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {offset + 1}–{Math.min(offset + LIMIT, total)} / {total}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + LIMIT >= total}
                  onClick={() => setOffset(offset + LIMIT)}
                >
                  {t("Next", "अर्को")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
