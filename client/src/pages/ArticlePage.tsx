import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Link as LinkIcon,
  Clock,
  Eye,
  User,
  Zap,
  ChevronLeft,
  Sparkles,
  Youtube,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function ArticlePage() {
  console.log("[ArticlePage] Rendering");
  
  const { slug } = useParams<{ slug: string }>();
  const { t, isNepali } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // All hooks MUST be called unconditionally in the same order every render
  const { data, isLoading, error } = trpc.articles.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  // ALWAYS call these queries in the same order, even when disabled
  const articleId = data?.article?.id ?? 0;
  const categoryId = data?.article?.categoryId ?? null;

  const { data: relatedData } = trpc.articles.related.useQuery(
    { articleId, categoryId },
    { enabled: articleId > 0 }
  );

  const { data: commentsData, refetch: refetchComments } = trpc.comments.list.useQuery(
    { articleId },
    { enabled: articleId > 0 }
  );

  const { data: isBookmarkedData, refetch: refetchBookmark } = trpc.bookmarks.check.useQuery(
    { articleId },
    { enabled: articleId > 0 && isAuthenticated }
  );

  // Mutations - always call in same order
  const addBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => { 
      refetchBookmark(); 
      toast.success(t("Bookmarked!", "बुकमार्क गरियो!")); 
    },
  });

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => { 
      refetchBookmark(); 
      toast.success(t("Bookmark removed", "बुकमार्क हटाइयो")); 
    },
  });

  const addComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      refetchComments();
      setCommentText("");
      toast.success(t("Comment submitted for review", "टिप्पणी समीक्षाको लागि पेश गरियो"));
    },
    onError: (err) => toast.error(err.message),
  });

  // All state - always call in same order
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  console.log("[ArticlePage] Data loaded:", !!data, "isLoading:", isLoading, "articleId:", articleId);

  // Helper functions - MUST be defined before any early returns
  const getYouTubeId = (url: string | null | undefined) => {
    if (!url || typeof url !== "string") return undefined;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match?.[1];
  };

  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = encodeURIComponent(data?.article?.title ?? "");
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      toast.success(t("Link copied!", "लिङ्क कपी गरियो!"));
      return;
    }
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const handleBookmark = () => {
    if (!data?.article) return;
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (isBookmarkedData) {
      removeBookmark.mutate({ articleId: data.article.id });
    } else {
      addBookmark.mutate({ articleId: data.article.id });
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.article || !commentText.trim()) return;
    addComment.mutate({
      articleId: data.article.id,
      content: commentText,
      guestName: !isAuthenticated ? guestName : undefined,
      guestEmail: !isAuthenticated ? guestEmail : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">{t("Article not found", "लेख फेला परेन")}</h1>
        <Link href="/">
          <Button variant="outline" className="mt-4 gap-2">
            <ChevronLeft className="w-4 h-4" />
            {t("Back to Home", "गृहपृष्ठमा फर्कनुहोस्")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!data?.article) {
    console.error("[ArticlePage] ERROR: article data missing after loading completed");
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">{t("Article not found", "लेख फेला परेन")}</h1>
        <Link href="/">
          <Button variant="outline" className="mt-4 gap-2">
            <ChevronLeft className="w-4 h-4" />
            {t("Back to Home", "गृहपृष्ठमा फर्कनुहोस्")}
          </Button>
        </Link>
      </div>
    );
  }

  const { article, category, author } = data;
  const title = isNepali && article.titleNe ? article.titleNe : article.title;
  const excerpt = isNepali && article.excerptNe ? article.excerptNe : (article.excerpt ?? "");
  const content = (isNepali && article.contentNe ? article.contentNe : article.content) ?? "";
  const summary = isNepali && article.aiSummaryNe ? article.aiSummaryNe : (article.aiSummary ?? null);
  const categoryName = isNepali && category?.nameNe ? category.nameNe : (category?.name ?? "");
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(article.title ?? "");

  // Safely extract YouTube ID
  const youtubeId = article.youtubeUrl ? getYouTubeId(article.youtubeUrl) : null;

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("Home", "गृहपृष्ठ")}
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/category/${category.slug}`} className="hover:text-primary transition-colors">
                <span className={isNepali ? "font-nepali" : ""}>{categoryName}</span>
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground line-clamp-1">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main article */}
          <article className="lg:col-span-2">
            {/* Category + badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {article.isBreaking && (
                <Badge className="bg-news-red text-white gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  {t("Breaking News", "ब्रेकिङ न्युज")}
                </Badge>
              )}
              {category && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: (category.color ?? "#dc2626") + "20", color: category.color ?? undefined }}
                  className={`font-semibold ${isNepali ? "font-nepali" : ""}`}
                >
                  {categoryName}
                </Badge>
              )}
              {article.isSponsored && (
                <Badge variant="outline" className="text-xs">
                  {t("Sponsored", "प्रायोजित")}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className={`text-2xl sm:text-3xl font-bold leading-tight mb-4 ${isNepali ? "font-nepali" : ""}`}>
              {title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
              {author?.name && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{author.name}</span>
                </div>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {format(publishedDate, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.viewCount.toLocaleString()} {t("views", "दृश्य")}
              </span>
            </div>

            {/* Cover image */}
            {article.coverImage && (
              <div className="rounded-xl overflow-hidden mb-6">
                <img
                  src={article.coverImage}
                  alt={title}
                  className="w-full object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* In-article Ad */}
            <div className="flex justify-center mb-6">
              <AdSlot type="in-article" className="w-full" />
            </div>

            {/* Article content */}
            {content ? (
              <div
                className={`article-content ${isNepali ? "font-nepali" : ""}`}
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-muted-foreground">
                {t("No content available for this article.", "यस लेखको लागि कुनै सामग्री उपलब्ध छैन।")}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot type="sidebar" />
            <AdSlot type="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
