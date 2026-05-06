import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, LogIn } from "lucide-react";

export default function BookmarksPage() {
  const { t, isNepali } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  const { data, isLoading } = trpc.bookmarks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <Skeleton className="w-48 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className={`text-2xl font-bold mb-2 ${isNepali ? "font-nepali" : ""}`}>
          {t("Sign in to view bookmarks", "बुकमार्क हेर्न साइन इन गर्नुहोस्")}
        </h1>
        <p className={`text-muted-foreground mb-6 ${isNepali ? "font-nepali" : ""}`}>
          {t("Save articles to read later", "पछि पढ्नको लागि लेखहरू सेभ गर्नुहोस्")}
        </p>
        <Button
          className="bg-news-red hover:bg-news-red/90 text-white gap-2"
          onClick={() => (window.location.href = getLoginUrl())}
        >
          <LogIn className="w-4 h-4" />
          {t("Sign In", "साइन इन")}
        </Button>
      </div>
    );
  }

  const bookmarks = data ?? [];

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <Bookmark className="w-6 h-6 text-news-red" />
          <h1 className={`text-2xl font-bold ${isNepali ? "font-nepali" : ""}`}>
            {t("My Bookmarks", "मेरा बुकमार्कहरू")}
          </h1>
          <span className="text-sm text-muted-foreground ml-2">({bookmarks.length})</span>
        </div>

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
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className={`text-lg ${isNepali ? "font-nepali" : ""}`}>
              {t("No bookmarks yet", "अहिलेसम्म कुनै बुकमार्क छैन")}
            </p>
            <p className={`text-sm mt-2 ${isNepali ? "font-nepali" : ""}`}>
              {t("Save articles to read later by clicking the bookmark icon", "बुकमार्क आइकनमा क्लिक गरेर लेखहरू सेभ गर्नुहोस्")}
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-6">
                {t("Browse News", "समाचार हेर्नुहोस्")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((item) =>
              item.article ? (
                <NewsCard
                  key={item.bookmark.id}
                  data={{
                    article: item.article,
                    category: item.category,
                  }}
                  variant="default"
                  showExcerpt
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
