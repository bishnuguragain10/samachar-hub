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

  const { data: commentsData, refetch: refetchComments } =
    trpc.comments.list.useQuery({ articleId }, { enabled: articleId > 0 });

  const { data: isBookmarkedData, refetch: refetchBookmark } =
    trpc.bookmarks.check.useQuery(
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
      toast.success(
        t("Comment submitted for review", "टिप्पणी समीक्षाको लागि पेश गरियो")
      );
    },
    onError: err => toast.error(err.message),
  });

  // All state - always call in same order
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  console.log(
    "[ArticlePage] Data loaded:",
    !!data,
    "isLoading:",
    isLoading,
    "articleId:",
    articleId
  );

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
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t("Article not found", "लेख फेला परेन")}
        </h1>
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
    console.error(
      "[ArticlePage] ERROR: article data missing after loading completed"
    );
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t("Article not found", "लेख फेला परेन")}
        </h1>
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
  const excerpt =
    isNepali && article.excerptNe ? article.excerptNe : (article.excerpt ?? "");
  const content =
    (isNepali && article.contentNe ? article.contentNe : article.content) ?? "";
  const summary =
    isNepali && article.aiSummaryNe
      ? article.aiSummaryNe
      : (article.aiSummary ?? null);
  const categoryName =
    isNepali && category?.nameNe ? category.nameNe : (category?.name ?? "");
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : new Date(article.createdAt);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(article.title ?? "");

  // Safely extract YouTube ID
  const youtubeId = article.youtubeUrl
    ? getYouTubeId(article.youtubeUrl)
    : null;

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
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-primary transition-colors"
              >
                <span className={isNepali ? "font-nepali" : ""}>
                  {categoryName}
                </span>
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
                  style={{
                    backgroundColor: (category.color ?? "#dc2626") + "20",
                    color: category.color ?? undefined,
                  }}
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
            <h1
              className={`text-2xl sm:text-3xl font-bold leading-tight mb-4 ${isNepali ? "font-nepali" : ""}`}
            >
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
                  <span className="font-medium text-foreground">
                    {author.name}
                  </span>
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

            {/* Action buttons - share and bookmark */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleBookmark}
              >
                {isBookmarkedData ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isBookmarkedData
                  ? t("Saved", "सेभ गरियो")
                  : t("Save", "सेभ गर्नुहोस्")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="w-4 h-4" />
                {t("Share", "साझा गर्नुहोस्")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare("copy")}
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
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

            {/* AI Summary */}
            {summary && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 mb-3 text-blue-700 dark:text-blue-300"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <Sparkles className="w-4 h-4" />
                  {showSummary
                    ? t("Hide Summary", "सारांश लुकाउनुहोस्")
                    : t("Show AI Summary", "AI सारांश देखाउनुहोस्")}
                </Button>
                {showSummary && (
                  <p className={`text-sm text-blue-900 dark:text-blue-100 ${isNepali ? "font-nepali" : ""}`}>
                    {summary}
                  </p>
                )}
              </div>
            )}

            {/* Article content */}
            {content ? (
              <div
                className={`article-content ${isNepali ? "font-nepali" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, "<br/>"),
                }}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-muted-foreground">
                {t(
                  "No content available for this article.",
                  "यस लेखको लागि कुनै सामग्री उपलब्ध छैन।"
                )}
              </div>
            )}

            {/* Related articles section */}
            {relatedData && relatedData.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h2
                  className={`text-xl font-bold mb-4 ${isNepali ? "font-nepali" : ""}`}
                >
                  {t("Related Articles", "सम्बन्धित लेखहरू")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedData.slice(0, 4).map(item => (
                    <NewsCard key={item.article.id} data={item} variant="default" />
                  ))}
                </div>
              </div>
            )}

            {/* Comments section */}
            <div className="mt-8 pt-8 border-t border-border">
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${isNepali ? "font-nepali" : ""}`}
              >
                <MessageCircle className="w-5 h-5" />
                {t("Comments", "टिप्पणीहरू")}
                {commentsData && commentsData.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({commentsData.length})
                  </span>
                )}
              </h2>

              {/* Comment form */}
              <form onSubmit={handleComment} className="mb-6">
                {!isAuthenticated && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder={t("Your name", "तपाईंको नाम")}
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder={t("Your email", "तपाईंको इमेल")}
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                )}
                <Textarea
                  placeholder={t("Write a comment...", "टिप्पणी लेख्नुहोस्...")}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={3}
                  className="mb-4"
                  required
                />
                <Button type="submit" disabled={addComment.isPending}>
                  {addComment.isPending
                    ? t("Submitting...", "पेश गर्दै...")
                    : t("Submit Comment", "टिप्पणी पेश गर्नुहोस्")}
                </Button>
              </form>

              {/* Comments list */}
              {commentsData && commentsData.length > 0 ? (
                <div className="space-y-4">
                  {commentsData.map(item => (
                    <div
                      key={item.comment.id}
                      className="bg-muted/30 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {(item.user?.name || item.comment.guestName || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {item.user?.name || item.comment.guestName || "Guest"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{item.comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t("No comments yet. Be the first to comment!", "अझै कुनै टिप्पणी छैन। पहिले टिप्पणी गर्नुहोस्!")}
                </p>
              )}
            </div>
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
