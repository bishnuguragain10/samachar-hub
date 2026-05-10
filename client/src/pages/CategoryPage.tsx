import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, isNepali } = useLanguage();
  const [offset, setOffset] = useState(0);
  const LIMIT = 9;

  const { data: categoriesData } = trpc.categories.list.useQuery();
  const category = categoriesData?.find(c => c.slug === slug);

  const { data, isLoading } = trpc.articles.list.useQuery(
    { limit: LIMIT, offset, categoryId: category?.id },
    { enabled: !!category?.id }
  );

  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;
  const categoryName =
    isNepali && category?.nameNe ? category.nameNe : category?.name;

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        {/* Category header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: category?.color ?? "var(--news-red)" }}
            />
            <h1
              className={`text-3xl font-bold ${isNepali ? "font-nepali" : ""}`}
            >
              {categoryName ?? slug}
            </h1>
          </div>
          {category?.description && (
            <p
              className={`text-muted-foreground ml-4 ${isNepali ? "font-nepali" : ""}`}
            >
              {isNepali && category.descriptionNe
                ? category.descriptionNe
                : category.description}
            </p>
          )}
          <Separator className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-border"
                  >
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className={`text-lg ${isNepali ? "font-nepali" : ""}`}>
                  {t(
                    "No articles found in this category.",
                    "यस श्रेणीमा कुनै लेख फेला परेन।"
                  )}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.map((item, idx) => (
                    <div key={item.article.id}>
                      <NewsCard data={item} variant="default" showExcerpt />
                      {idx === 3 && (
                        <div className="col-span-full my-4 flex justify-center">
                          <AdSlot type="in-article" className="w-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
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
                      {t(
                        `${offset + 1}–${Math.min(offset + LIMIT, total)} of ${total}`,
                        `${offset + 1}–${Math.min(offset + LIMIT, total)} / ${total}`
                      )}
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

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot type="sidebar" />

            {/* Other categories */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3
                className={`font-bold text-sm mb-4 ${isNepali ? "font-nepali" : ""}`}
              >
                {t("Other Categories", "अन्य श्रेणीहरू")}
              </h3>
              <div className="space-y-1">
                {(categoriesData ?? [])
                  .filter(c => c.slug !== slug)
                  .map(cat => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color ?? "#dc2626" }}
                      />
                      <span
                        className={`text-sm ${isNepali ? "font-nepali" : ""}`}
                      >
                        {isNepali && cat.nameNe ? cat.nameNe : cat.name}
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
