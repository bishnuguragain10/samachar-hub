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

export default function NewsCard({ data, variant = "default", showExcerpt = false }: NewsCardProps) {
  const { t, isNepali } = useLanguage();
  const { article, category, author } = data;

  const title = isNepali && article.titleNe ? article.titleNe : article.title;
  const excerpt = isNepali && article.excerptNe ? article.excerptNe : article.excerpt;
  const categoryName = isNepali && category?.nameNe ? category.nameNe : category?.name;
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

  if (variant === "hero") {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-muted">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-news-red/20 to-primary/10 flex items-center justify-center">
              <span className="text-6xl opacity-20">📰</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {article.isBreaking && (
                <Badge className="bg-news-red text-white text-xs gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  {t("Breaking", "ब्रेकिङ")}
                </Badge>
              )}
              {category && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: category.color + "33", color: category.color ?? undefined }}
                >
                  {categoryName}
                </Badge>
              )}
              {article.isSponsored && (
                <Badge variant="outline" className="text-xs text-white border-white/50">
                  {t("Sponsored", "प्रायोजित")}
                </Badge>
              )}
            </div>
            <h2
              className={`text-white font-bold text-xl sm:text-2xl leading-tight mb-2 group-hover:text-white/90 transition-colors ${
                isNepali ? "font-nepali" : ""
              }`}
            >
              {title}
            </h2>
            {excerpt && (
              <p className={`text-white/75 text-sm line-clamp-2 mb-3 ${isNepali ? "font-nepali" : ""}`}>
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 text-white/60 text-xs">
              {author?.name && <span>{author.name}</span>}
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
      <Link href={`/article/${article.slug}`} className="group flex gap-3">
        <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden bg-muted shrink-0">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-news-red/10 to-primary/5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {category && (
            <span
              className={`text-xs font-semibold mb-1 block ${isNepali ? "font-nepali" : ""}`}
              style={{ color: category.color ?? "var(--news-red)" }}
            >
              {categoryName}
            </span>
          )}
          <h3
            className={`text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`} className="group flex items-start gap-2 py-2">
        <div className="w-1.5 h-1.5 rounded-full bg-news-red mt-2 shrink-0" />
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h4>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-all duration-200 h-full flex flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-news-red/10 to-primary/5 flex items-center justify-center">
              <span className="text-4xl opacity-20">📰</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {article.isBreaking && (
              <Badge className="bg-news-red text-white text-xs gap-1 py-0">
                <Zap className="w-2.5 h-2.5 fill-current" />
                {t("Breaking", "ब्रेकिङ")}
              </Badge>
            )}
            {category && (
              <span
                className={`text-xs font-semibold ${isNepali ? "font-nepali" : ""}`}
                style={{ color: category.color ?? "var(--news-red)" }}
              >
                {categoryName}
              </span>
            )}
            {article.isSponsored && (
              <Badge variant="outline" className="text-xs py-0">
                {t("Sponsored", "प्रायोजित")}
              </Badge>
            )}
          </div>
          <h3
            className={`font-bold text-base leading-snug mb-2 line-clamp-3 group-hover:text-primary transition-colors flex-1 ${
              isNepali ? "font-nepali" : ""
            }`}
          >
            {title}
          </h3>
          {showExcerpt && excerpt && (
            <p className={`text-sm text-muted-foreground line-clamp-2 mb-3 ${isNepali ? "font-nepali" : ""}`}>
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
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
