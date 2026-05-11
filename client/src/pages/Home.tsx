import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategoriesWithCache } from "@/hooks/useCategoriesWithCache";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ChevronRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomepageNewsCards from "@/components/HomepageNewsCards";
import SectionHeader from "@/components/SectionHeader";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import HorizontalArticleSkeleton from "@/components/HorizontalArticleSkeleton";
import CategorySkeleton from "@/components/CategorySkeleton";
import EmptyState from "@/components/EmptyState";
import CategorySection from "@/components/CategorySection";

export default function Home() {
  const { t, isNepali } = useLanguage();
  const [latestOffset, setLatestOffset] = useState(0);
  const LATEST_LIMIT = 6;

  const { data: featuredData, isLoading: featuredLoading } =
    trpc.articles.list.useQuery({
      limit: 1,
      featured: true,
    });

  const { data: latestData, isLoading: latestLoading } =
    trpc.articles.list.useQuery({
      limit: LATEST_LIMIT,
      offset: latestOffset,
    });

  const { data: trendingData } = trpc.articles.list.useQuery({
    limit: 6,
    trending: true,
  });

  const { data: categoriesData } = useCategoriesWithCache();
  const categories = categoriesData ?? [];

  const featuredArticle = featuredData?.articles?.[0];
  const latestArticles = latestData?.articles ?? [];
  const trendingArticles = trendingData?.articles ?? [];
  const totalLatest = latestData?.total ?? 0;

  return (
    <div className="min-h-screen">
      {/* Header Ad Banner */}
      <div className="container py-3 flex justify-center">
        <AdSlot type="banner" />
      </div>

      <div className="container px-3 sm:px-4 pb-8 sm:pb-12">
        {/* Hero + Sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Main hero */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {featuredLoading ? (
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
            ) : featuredArticle ? (
              <NewsCard data={featuredArticle} variant="hero" />
            ) : (
              latestArticles[0] && (
                <NewsCard data={latestArticles[0]} variant="hero" />
              )
            )}

            {/* Latest Articles Grid */}
            {latestArticles.length > 1 && <HomepageNewsCards />}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Trending */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-news-red" />
                <h3
                  className={`font-bold text-sm ${isNepali ? "font-nepali" : ""}`}
                >
                  {t("Trending Now", "ट्रेन्डिङ")}
                </h3>
              </div>
              <div className="space-y-4">
                {trendingArticles.length === 0
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <HorizontalArticleSkeleton key={i} />
                    ))
                  : trendingArticles.map(item => (
                      <NewsCard
                        key={item.article.id}
                        data={item}
                        variant="horizontal"
                      />
                    ))}
              </div>
            </div>

            {/* Sidebar Ad */}
            <div className="flex justify-center">
              <AdSlot type="sidebar" />
            </div>
          </div>
        </div>

        {/* Category quick-nav */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-xs gap-1.5 whitespace-nowrap flex-shrink-0 ${isNepali ? "font-nepali" : ""}`}
                  style={{
                    borderColor: (cat.color ?? "#dc2626") + "40",
                    color: cat.color ?? "#dc2626",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color ?? "#dc2626" }}
                  />
                  {isNepali && cat.nameNe ? cat.nameNe : cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest news grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <SectionHeader en="Latest News" ne="ताजा समाचार" />

            {latestLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {latestArticles.map((item, idx) => (
                    <div key={item.article.id}>
                      <NewsCard data={item} variant="default" showExcerpt />
                      {/* In-article ad after 4th item */}
                      {idx === 3 && (
                        <div className="col-span-full my-4 flex justify-center">
                          <AdSlot type="in-article" className="w-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalLatest > LATEST_LIMIT && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={latestOffset === 0}
                      onClick={() =>
                        setLatestOffset(
                          Math.max(0, latestOffset - LATEST_LIMIT)
                        )
                      }
                    >
                      {t("Previous", "अघिल्लो")}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {t(
                        `Page ${Math.floor(latestOffset / LATEST_LIMIT) + 1} of ${Math.ceil(totalLatest / LATEST_LIMIT)}`,
                        `पृष्ठ ${Math.floor(latestOffset / LATEST_LIMIT) + 1} / ${Math.ceil(totalLatest / LATEST_LIMIT)}`
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={latestOffset + LATEST_LIMIT >= totalLatest}
                      onClick={() =>
                        setLatestOffset(latestOffset + LATEST_LIMIT)
                      }
                    >
                      {t("Next", "अर्को")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-card border border-border rounded-xl p-4">
              <SectionHeader en="Categories" ne="श्रेणीहरू" />
              <div className="space-y-1">
                {categories.length === 0 ? (
                  <div className="py-8 text-center">
                    <CategorySkeleton />
                  </div>
                ) : (
                  categories.map(cat => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}>
                      <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-accent transition-colors group">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color ?? "#dc2626" }}
                          />
                          <span
                            className={`text-sm font-medium group-hover:text-primary transition-colors ${
                              isNepali ? "font-nepali" : ""
                            }`}
                          >
                            {isNepali && cat.nameNe ? cat.nameNe : cat.name}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Second sidebar ad */}
            <div className="flex justify-center">
              <AdSlot type="sidebar" />
            </div>
          </div>
        </div>

        {/* Category sections */}
        {categories.length === 0 ? (
          <EmptyState 
            title="No Categories Available" 
            titleNe="कुनै श्रेणीहरू उपलब्ध"
            message="Categories are loading or not available at the moment."
            messageNe="श्रेणीहरू लोड हुँदैछ वा अहिले उपलब्ध छैन्।"
          />
        ) : (
          categories.slice(0, 3).map(cat => (
            <CategorySection key={cat.id} category={cat} />
          ))
        )}
      </div>
    </div>
  );
}
