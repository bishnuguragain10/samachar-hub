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
  const { slug } = useParams<{ slug: string }>();
  const { t, isNepali } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, error } = trpc.articles.bySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });
  const { data: relatedData } = trpc.articles.related.useQuery(
    { articleId: data?.article.id ?? 0, categoryId: data?.article.categoryId ?? null },
    { enabled: !!data?.article.id }
  );
  const { data: commentsData, refetch: refetchComments } = trpc.comments.list.useQuery(
    { articleId: data?.article.id ?? 0 },
    { enabled: !!data?.article.id }
  );
  const { data: isBookmarkedData, refetch: refetchBookmark } = trpc.bookmarks.check.useQuery(
    { articleId: data?.article.id ?? 0 },
    { enabled: !!data?.article.id && isAuthenticated }
  );

  const addBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => { refetchBookmark(); toast.success(t("Bookmarked!", "बुकमार्क गरियो!")); },
  });
  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => { refetchBookmark(); toast.success(t("Bookmark removed", "बुकमार्क हटाइयो")); },
  });
  const addComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      refetchComments();
      setCommentText("");
      toast.success(t("Comment submitted for review", "टिप्पणी समीक्षाको लागि पेश गरियो"));
    },
    onError: (err) => toast.error(err.message),
  });

  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showSummary, setShowSummary] = useState(false);

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

  const { article, category, author } = data;
  const title = isNepali && article.titleNe ? article.titleNe : article.title;
  const excerpt = isNepali && article.excerptNe ? article.excerptNe : (article.excerpt ?? "");
  const content = (isNepali && article.contentNe ? article.contentNe : article.content) ?? "";
  const summary = isNepali && article.aiSummaryNe ? article.aiSummaryNe : (article.aiSummary ?? null);
  const categoryName = isNepali && category?.nameNe ? category.nameNe : (category?.name ?? "");
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(article.title);

  const handleShare = (platform: string) => {
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
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (isBookmarkedData) {
      removeBookmark.mutate({ articleId: article.id });
    } else {
      addBookmark.mutate({ articleId: article.id });
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment.mutate({
      articleId: article.id,
      content: commentText,
      guestName: !isAuthenticated ? guestName : undefined,
      guestEmail: !isAuthenticated ? guestEmail : undefined,
    });
  };

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match?.[1];
  };

  // Dynamic SEO meta tags
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${article.title} | Samachar Hub`;
    const setMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", excerpt || article.title);
    setMeta("og:title", article.title, true);
    setMeta("og:description", excerpt || article.title, true);
    setMeta("og:image", article.coverImage ?? "", true);
    setMeta("og:type", "article", true);
    setMeta("twitter:title", article.title);
    setMeta("twitter:description", excerpt || article.title);
    return () => { document.title = prevTitle; };
  }, [article.title, excerpt, article.coverImage]);

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

            {/* Action bar */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleBookmark}
              >
                {isBookmarkedData ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isBookmarkedData ? t("Saved", "सेभ गरियो") : t("Save", "सेभ गर्नुहोस्")}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("facebook")}>
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("twitter")}>
                <Twitter className="w-4 h-4 text-sky-500" />
                <span className="hidden sm:inline">Twitter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("whatsapp")}>
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("copy")}>
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t("Copy Link", "लिङ्क कपी")}</span>
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

            {/* AI Summary */}
            {summary && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <button
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className={`font-semibold text-sm text-primary ${isNepali ? "font-nepali" : ""}`}>
                    {t("AI Summary", "AI सारांश")}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {showSummary ? t("Hide", "लुकाउनुहोस्") : t("Show", "देखाउनुहोस्")}
                  </span>
                </button>
                {showSummary && (
                  <p className={`mt-3 text-sm text-muted-foreground leading-relaxed ${isNepali ? "font-nepali" : ""}`}>
                    {summary}
                  </p>
                )}
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

            {/* YouTube embed */}
            {article.youtubeUrl && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-sm">{t("Watch Video", "भिडियो हेर्नुहोस्")}</span>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  {(() => {
                    const youtubeId = getYouTubeId(article.youtubeUrl ?? "");
                    if (!youtubeId) {
                      return (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          {t("Invalid YouTube URL", "अमान्य YouTube URL")}
                        </div>
                      );
                    }
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube video"
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.trim() && (
              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{t("Tags:", "ट्यागहरू:")}</span>
                {article.tags.split(",").map((tag) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <Link key={trimmedTag} href={`/search?q=${encodeURIComponent(trimmedTag)}`}>
                      <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-accent">
                        #{trimmedTag}
                      </Badge>
                    </Link>
                  ) : null;
                })}
              </div>
            )}

            <Separator className="my-8" />

            {/* Comments section */}
            <div id="comments">
              <h3 className={`text-lg font-bold mb-6 ${isNepali ? "font-nepali" : ""}`}>
                {t("Comments", "टिप्पणीहरू")} ({commentsData?.length ?? 0})
              </h3>

              {/* Comment form */}
              <form onSubmit={handleComment} className="mb-8 bg-card border border-border rounded-xl p-4">
                <h4 className={`font-semibold text-sm mb-3 ${isNepali ? "font-nepali" : ""}`}>
                  {t("Leave a Comment", "टिप्पणी छोड्नुहोस्")}
                </h4>
                {!isAuthenticated && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder={t("Your name", "तपाईंको नाम")}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder={t("Your email (optional)", "तपाईंको इमेल (वैकल्पिक)")}
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                  </div>
                )}
                <Textarea
                  placeholder={t("Write your comment...", "आफ्नो टिप्पणी लेख्नुहोस्...")}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addComment.isPending || !commentText.trim()}
                  className="bg-news-red hover:bg-news-red/90 text-white"
                >
                  {addComment.isPending
                    ? t("Submitting...", "पेश गर्दै...")
                    : t("Submit Comment", "टिप्पणी पेश गर्नुहोस्")}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("Comments are reviewed before publishing.", "टिप्पणीहरू प्रकाशन गर्नु अघि समीक्षा गरिन्छ।")}
                </p>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {(commentsData ?? []).length === 0 ? (
                  <p className={`text-muted-foreground text-sm ${isNepali ? "font-nepali" : ""}`}>
                    {t("No comments yet. Be the first to comment!", "अहिलेसम्म कुनै टिप्पणी छैन। पहिलो टिप्पणी गर्नुहोस्!")}
                  </p>
                ) : (
                  commentsData?.map((item) => (
                    <div key={item.comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs bg-muted">
                          {(item.user?.name ?? item.comment.guestName ?? "?")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {item.user?.name ?? item.comment.guestName ?? t("Anonymous", "अनाम")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm ${isNepali ? "font-nepali" : ""}`}>{item.comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot type="sidebar" />

            {/* Related articles */}
            {(relatedData ?? []).length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className={`font-bold text-sm mb-4 ${isNepali ? "font-nepali" : ""}`}>
                  {t("Related Articles", "सम्बन्धित लेखहरू")}
                </h3>
                <div className="space-y-3">
                  {relatedData?.map((item) => (
                    <NewsCard key={item.article.id} data={item} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            <AdSlot type="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
