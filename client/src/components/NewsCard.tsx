import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { Clock, Eye, Zap, Star, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleData {
  article: {
    id: number;
    title: string;
    titleNe?: string | null;
    slug: string;
    excerpt?: string | null;
    excerptNe?: string | null;
    coverImage?: string | null;
    isBreaking: boolean;
    isFeatured: boolean;
    isSponsored: boolean;
    viewCount: number;
    publishedAt?: Date | null;
    createdAt: Date;
    tags?: string | null;
  };
  category?: {
    name: string;
    nameNe?: string | null;
    slug: string;
    color?: string | null;
  } | null;
  author?: {
    id: number;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface NewsCardProps {
  data: ArticleData;
  variant?: "default" | "hero" | "compact" | "horizontal";
  showExcerpt?: boolean;
}

export default function NewsCard({
  data,
  variant = "default",
  showExcerpt = false,
}: NewsCardProps) {
  const { t, isNepali } = useLanguage();
  const { article, category, author } = data;

  const title = isNepali && article.titleNe ? article.titleNe : article.title;
  const excerpt =
    isNepali && article.excerptNe ? article.excerptNe : article.excerpt;
  const categoryName =
    isNepali && category?.nameNe ? category.nameNe : category?.name;
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

  if (variant === "hero") {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <span className="text-6xl opacity-30">📰</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
              {article.isBreaking && (
                <Badge className="bg-red-600 text-white text-xs font-semibold gap-1 px-2 py-1">
                  <Zap className="w-3 h-3 fill-current" />
                  {t("Breaking", "ब्रेकिङ")}
                </Badge>
              )}
              {category && (
                <Badge
                  className="text-xs font-semibold px-2 py-1"
                  style={{
                    backgroundColor: category.color
                      ? category.color + "20"
                      : "#f3f4f6",
                    color: category.color || "#374151",
                    border: category.color
                      ? `1px solid ${category.color}40`
                      : "1px solid #d1d5db",
                  }}
                >
                  {categoryName}
                </Badge>
              )}
              {article.isSponsored && (
                <Badge
                  variant="outline"
                  className="text-xs text-white border-white/30 bg-white/10 backdrop-blur-sm"
                >
                  {t("Sponsored", "प्रायोजित")}
                </Badge>
              )}
            </div>
            <h2
              className={`text-white font-bold text-xl sm:text-2xl lg:text-3xl leading-tight mb-2 sm:mb-3 group-hover:text-white transition-colors ${
                isNepali ? "font-nepali" : ""
              }`}
            >
              {title}
            </h2>
            {excerpt && (
              <p
                className={`text-white/80 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 ${isNepali ? "font-nepali" : ""}`}
              >
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
              {author?.name && (
                <span className="font-medium truncate">{author.name}</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.viewCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-28 lg:h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {category && (
            <span
              className={`text-xs font-semibold mb-1.5 sm:mb-2 inline-block px-2 py-1 rounded-md ${isNepali ? "font-nepali" : ""}`}
              style={{
                backgroundColor: category.color
                  ? category.color + "15"
                  : "#f3f4f6",
                color: category.color || "#dc2626",
              }}
            >
              {categoryName}
            </span>
          )}
          <h3
            className={`text-xs sm:text-sm font-semibold leading-tight line-clamp-2 group-hover:text-news-red transition-colors mb-1.5 sm:mb-2 text-gray-900 dark:text-gray-100 ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex items-start gap-2 py-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-news-red mt-2 shrink-0" />
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100 ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h4>
          <span className="text-xs text-muted-foreground dark:text-gray-400">{timeAgo}</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <span className="text-4xl opacity-30">📰</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white text-xs font-semibold gap-1 px-2 py-1">
                <Zap className="w-2.5 h-2.5 fill-current" />
                {t("Breaking", "ब्रेकिङ")}
              </Badge>
            )}
            {category && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-md ${isNepali ? "font-nepali" : ""}`}
                style={{
                  backgroundColor: category.color
                    ? category.color + "15"
                    : "#f3f4f6",
                  color: category.color || "#dc2626",
                }}
              >
                {categoryName}
              </span>
            )}
            {article.isSponsored && (
              <Badge
                variant="outline"
                className="text-xs font-semibold px-2 py-1 border-gray-300 dark:border-gray-600"
              >
                {t("Sponsored", "प्रायोजित")}
              </Badge>
            )}
          </div>
          <h3
            className={`font-bold text-lg leading-snug mb-3 line-clamp-3 group-hover:text-news-red transition-colors flex-1 text-gray-900 dark:text-gray-100 ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h3>
          {showExcerpt && excerpt && (
            <p
              className={`text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 ${isNepali ? "font-nepali" : ""}`}
            >
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
