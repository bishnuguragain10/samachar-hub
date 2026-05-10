import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import NewsCard from "@/components/NewsCard";
import { Separator } from "@/components/ui/separator";

interface CategorySectionProps {
  category: any;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const { t, isNepali } = useLanguage();

  const { data, isLoading } = trpc.articles.list.useQuery(
    { limit: 4, categoryId: category?.id },
    { enabled: !!category?.id }
  );

  const articles = data?.articles ?? [];
  if (!isLoading && articles.length === 0) return null;

  const categoryName =
    isNepali && category.nameNe ? category.nameNe : category.name;

  return (
    <div className="mt-10">
      <SectionHeader
        en={categoryName}
        ne={categoryName}
        href={`/category/${category.slug}`}
      />
      <Separator className="mb-4" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map(item => (
            <NewsCard key={item.article.id} data={item} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
