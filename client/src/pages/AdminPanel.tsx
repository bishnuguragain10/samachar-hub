import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Tag,
  MessageSquare,
  Users,
  Mail,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Zap,
  Star,
  Eye,
  LogOut,
  ChevronRight,
  Upload,
  Sparkles,
  Clock,
  TrendingUp,
  BookOpen,
  Menu,
} from "lucide-react";
import { format } from "date-fns";

type AdminTab = "dashboard" | "articles" | "new-article" | "edit-article" | "categories" | "comments" | "users" | "newsletter";

export default function AdminPanel() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [editArticleId, setEditArticleId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Skeleton className="w-48 h-8" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{t("Access Denied", "पहुँच अस्वीकृत")}</h2>
          <p className="text-muted-foreground mb-4">{t("You need admin privileges.", "तपाईंलाई प्रशासक विशेषाधिकार चाहिन्छ।")}</p>
          <Link href="/"><Button variant="outline">{t("Go Home", "गृहपृष्ठमा जानुहोस्")}</Button></Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{t("Access Denied", "पहुँच अस्वीकृत")}</h2>
          <p className="text-muted-foreground mb-4">{t("You need admin privileges.", "तपाईंलाई प्रशासक विशेषाधिकार चाहिन्छ।")}</p>
          <Link href="/"><Button variant="outline">{t("Go Home", "गृहपृष्ठमा जानुहोस्")}</Button></Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard" as AdminTab, icon: LayoutDashboard, en: "Dashboard", ne: "ड्यासबोर्ड" },
    { id: "articles" as AdminTab, icon: FileText, en: "Articles", ne: "लेखहरू" },
    { id: "categories" as AdminTab, icon: Tag, en: "Categories", ne: "श्रेणीहरू" },
    { id: "comments" as AdminTab, icon: MessageSquare, en: "Comments", ne: "टिप्पणीहरू" },
    { id: "users" as AdminTab, icon: Users, en: "Users", ne: "प्रयोगकर्ताहरू" },
    { id: "newsletter" as AdminTab, icon: Mail, en: "Newsletter", ne: "न्यूजलेटर" },
  ];

  const handleEditArticle = (id: number) => {
    setEditArticleId(id);
    setTab("edit-article");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-news-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <div className="font-bold text-sm">Samachar Hub</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === item.id || (tab === "new-article" && item.id === "articles") || (tab === "edit-article" && item.id === "articles")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {t(item.en, item.ne)}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs" onClick={logout}>
            <LogOut className="w-3.5 h-3.5" />
            {t("Sign Out", "साइन आउट")}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base flex-1">
            {navItems.find((n) => n.id === tab)?.en ?? (tab === "new-article" ? "New Article" : "Edit Article")}
          </h1>
          {tab === "articles" && (
            <Button size="sm" className="bg-news-red text-white gap-1" onClick={() => setTab("new-article")}>
              <Plus className="w-3.5 h-3.5" />
              {t("New Article", "नयाँ लेख")}
            </Button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {tab === "dashboard" && <AdminDashboard onNavigate={setTab} />}
          {tab === "articles" && <AdminArticles onEdit={handleEditArticle} onNew={() => setTab("new-article")} />}
          {tab === "new-article" && <ArticleEditor onBack={() => setTab("articles")} />}
          {tab === "edit-article" && editArticleId && (
            <ArticleEditor articleId={editArticleId} onBack={() => setTab("articles")} />
          )}
          {tab === "categories" && <AdminCategories />}
          {tab === "comments" && <AdminComments />}
          {tab === "users" && <AdminUsers />}
          {tab === "newsletter" && <AdminNewsletter />}
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function AdminDashboard({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { t } = useLanguage();
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  const statCards = [
    { label: t("Total Articles", "कुल लेखहरू"), value: stats?.totalArticles ?? 0, icon: FileText, color: "text-blue-500" },
    { label: t("Published", "प्रकाशित"), value: stats?.publishedArticles ?? 0, icon: Eye, color: "text-green-500" },
    { label: t("Comments", "टिप्पणीहरू"), value: stats?.totalComments ?? 0, icon: MessageSquare, color: "text-purple-500" },
    { label: t("Pending", "प्रतीक्षारत"), value: stats?.pendingComments ?? 0, icon: Clock, color: "text-orange-500" },
    { label: t("Subscribers", "सदस्यहरू"), value: stats?.totalSubscribers ?? 0, icon: Mail, color: "text-pink-500" },
    { label: t("Users", "प्रयोगकर्ताहरू"), value: stats?.totalUsers ?? 0, icon: Users, color: "text-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate("new-article")}
          className="bg-news-red text-white rounded-xl p-4 text-left hover:bg-news-red/90 transition-colors"
        >
          <Plus className="w-6 h-6 mb-2" />
          <div className="font-bold">{t("Write New Article", "नयाँ लेख लेख्नुहोस्")}</div>
          <div className="text-sm text-white/70">{t("Create and publish content", "सामग्री सिर्जना र प्रकाशन गर्नुहोस्")}</div>
        </button>
        <button
          onClick={() => onNavigate("comments")}
          className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-colors"
        >
          <MessageSquare className="w-6 h-6 mb-2 text-orange-500" />
          <div className="font-bold">{t("Moderate Comments", "टिप्पणी मध्यस्थता")}</div>
          <div className="text-sm text-muted-foreground">
            {stats?.pendingComments ?? 0} {t("pending review", "समीक्षाको प्रतीक्षामा")}
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Articles List ──────────────────────────────────────────────────────────
function AdminArticles({ onEdit, onNew }: { onEdit: (id: number) => void; onNew: () => void }) {
  const { t } = useLanguage();
  const [offset, setOffset] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const LIMIT = 15;

  const { data, isLoading, refetch } = trpc.articles.adminList.useQuery({ limit: LIMIT, offset });
  const deleteArticle = trpc.articles.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(t("Article deleted", "लेख मेटाइयो")); setDeleteId(null); },
  });

  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">{t("Title", "शीर्षक")}</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">{t("Category", "श्रेणी")}</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">{t("Status", "स्थिति")}</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">{t("Date", "मिति")}</th>
                  <th className="text-right px-4 py-3 font-semibold">{t("Actions", "कार्यहरू")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((item) => (
                  <tr key={item.article.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.article.isBreaking && <Zap className="w-3 h-3 text-news-red shrink-0" />}
                        {item.article.isFeatured && <Star className="w-3 h-3 text-yellow-500 shrink-0" />}
                        <span className="font-medium line-clamp-1 max-w-xs">{item.article.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {item.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge
                        variant={item.article.status === "published" ? "default" : "secondary"}
                        className={item.article.status === "published" ? "bg-green-500/10 text-green-600 border-green-200" : ""}
                      >
                        {item.article.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {format(new Date(item.article.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(item.article.id)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(item.article.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {total > LIMIT && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - LIMIT))}>
            {t("Previous", "अघिल्लो")}
          </Button>
          <span className="text-sm text-muted-foreground">{offset + 1}–{Math.min(offset + LIMIT, total)} / {total}</span>
          <Button variant="outline" size="sm" disabled={offset + LIMIT >= total} onClick={() => setOffset(offset + LIMIT)}>
            {t("Next", "अर्को")}
          </Button>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete Article?", "लेख मेटाउने?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("This action cannot be undone.", "यो कार्य पूर्ववत गर्न सकिँदैन।")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel", "रद्द गर्नुहोस्")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white"
              onClick={() => deleteId && deleteArticle.mutate({ id: deleteId })}
            >
              {t("Delete", "मेटाउनुहोस्")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Article Editor ─────────────────────────────────────────────────────────
function ArticleEditor({ articleId, onBack }: { articleId?: number; onBack: () => void }) {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: existingData, isLoading: loadingExisting } = trpc.articles.adminGetById.useQuery(
    { id: articleId! },
    { enabled: !!articleId }
  );
  const { data: categoriesData } = trpc.categories.list.useQuery();

  const existing = existingData?.article;

  const [form, setForm] = useState({
    title: "",
    titleNe: "",
    slug: "",
    excerpt: "",
    excerptNe: "",
    content: "",
    contentNe: "",
    coverImage: "",
    categoryId: "",
    status: "draft" as "draft" | "published" | "scheduled",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    youtubeUrl: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    generateSummary: false,
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize form with existing data
  if (existing && !initialized) {
    setForm({
      title: existing.title,
      titleNe: existing.titleNe ?? "",
      slug: existing.slug,
      excerpt: existing.excerpt ?? "",
      excerptNe: existing.excerptNe ?? "",
      content: existing.content,
      contentNe: existing.contentNe ?? "",
      coverImage: existing.coverImage ?? "",
      categoryId: existing.categoryId?.toString() ?? "",
      status: existing.status,
      isBreaking: existing.isBreaking,
      isFeatured: existing.isFeatured,
      isSponsored: existing.isSponsored,
      youtubeUrl: existing.youtubeUrl ?? "",
      tags: existing.tags ?? "",
      metaTitle: existing.metaTitle ?? "",
      metaDescription: existing.metaDescription ?? "",
      generateSummary: false,
    });
    setInitialized(true);
  }

  const createArticle = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success(t("Article created!", "लेख सिर्जना गरियो!"));
      utils.articles.adminList.invalidate();
      onBack();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateArticle = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success(t("Article updated!", "लेख अपडेट गरियो!"));
      utils.articles.adminList.invalidate();
      onBack();
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadImage = trpc.articles.uploadImage.useMutation({
    onSuccess: (data) => {
      setForm((f) => ({ ...f, coverImage: data.url }));
      toast.success(t("Image uploaded!", "तस्बिर अपलोड गरियो!"));
    },
    onError: (err) => toast.error(err.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        uploadImage.mutate({ base64, filename: file.name, mimeType: file.type });
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setImageUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      titleNe: form.titleNe || undefined,
      slug: form.slug || generateSlug(form.title),
      excerpt: form.excerpt || undefined,
      excerptNe: form.excerptNe || undefined,
      content: form.content,
      contentNe: form.contentNe || undefined,
      coverImage: form.coverImage || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      status: form.status,
      isBreaking: form.isBreaking,
      isFeatured: form.isFeatured,
      isSponsored: form.isSponsored,
      youtubeUrl: form.youtubeUrl || undefined,
      tags: form.tags || undefined,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      generateSummary: form.generateSummary,
    };

    if (articleId) {
      updateArticle.mutate({ id: articleId, ...payload });
    } else {
      createArticle.mutate(payload);
    }
  };

  const isSubmitting = createArticle.isPending || updateArticle.isPending;

  if (loadingExisting) {
    return <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-2">
        <Button type="button" variant="ghost" size="sm" onClick={onBack} className="gap-1">
          ← {t("Back", "फिर्ता")}
        </Button>
        <h2 className="font-bold">{articleId ? t("Edit Article", "लेख सम्पादन") : t("New Article", "नयाँ लेख")}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>{t("Title (English)", "शीर्षक (अंग्रेजी)")} *</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }));
              }}
              placeholder="Article title in English"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-nepali">{t("Title (Nepali)", "शीर्षक (नेपाली)")}</Label>
            <Input
              value={form.titleNe}
              onChange={(e) => setForm((f) => ({ ...f, titleNe: e.target.value }))}
              placeholder="नेपालीमा शीर्षक"
              className="mt-1 font-nepali"
            />
          </div>

          <div>
            <Label>{t("URL Slug", "URL स्लग")}</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="article-url-slug"
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label>{t("Excerpt (English)", "सारांश (अंग्रेजी)")}</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Brief summary of the article..."
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-nepali">{t("Excerpt (Nepali)", "सारांश (नेपाली)")}</Label>
            <Textarea
              value={form.excerptNe}
              onChange={(e) => setForm((f) => ({ ...f, excerptNe: e.target.value }))}
              placeholder="लेखको संक्षिप्त सारांश..."
              rows={2}
              className="mt-1 font-nepali"
            />
          </div>

          <div>
            <Label>{t("Content (English)", "सामग्री (अंग्रेजी)")} *</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Full article content. You can use HTML tags for formatting."
              rows={12}
              required
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("Supports HTML: <b>, <i>, <h2>, <h3>, <p>, <ul>, <ol>, <blockquote>", "HTML समर्थन गर्दछ")}
            </p>
          </div>

          <div>
            <Label className="font-nepali">{t("Content (Nepali)", "सामग्री (नेपाली)")}</Label>
            <Textarea
              value={form.contentNe}
              onChange={(e) => setForm((f) => ({ ...f, contentNe: e.target.value }))}
              placeholder="नेपालीमा पूर्ण लेख सामग्री..."
              rows={8}
              className="mt-1 font-nepali"
            />
          </div>

          <div>
            <Label>{t("YouTube URL", "YouTube URL")}</Label>
            <Input
              value={form.youtubeUrl}
              onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1"
            />
          </div>

          {/* SEO */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">{t("SEO Settings", "SEO सेटिङहरू")}</h3>
            <div>
              <Label className="text-xs">{t("Meta Title", "मेटा शीर्षक")}</Label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                placeholder="SEO title (defaults to article title)"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">{t("Meta Description", "मेटा विवरण")}</Label>
              <Textarea
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                placeholder="SEO description (max 160 chars)"
                rows={2}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">{t("Tags (comma separated)", "ट्यागहरू (अल्पविरामले छुट्याउनुहोस्)")}</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="nepal, politics, kathmandu"
                className="mt-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Publish settings */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">{t("Publish Settings", "प्रकाशन सेटिङहरू")}</h3>
            <div>
              <Label className="text-xs">{t("Status", "स्थिति")}</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof form.status }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("Draft", "मस्यौदा")}</SelectItem>
                  <SelectItem value="published">{t("Published", "प्रकाशित")}</SelectItem>
                  <SelectItem value="scheduled">{t("Scheduled", "अनुसूचित")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">{t("Category", "श्रेणी")}</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("Select category", "श्रेणी छान्नुहोस्")} />
                </SelectTrigger>
                <SelectContent>
                  {(categoriesData ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { key: "isBreaking", en: "Breaking News", ne: "ब्रेकिङ न्युज", icon: Zap },
                { key: "isFeatured", en: "Featured Article", ne: "फिचर्ड लेख", icon: Star },
                { key: "isSponsored", en: "Sponsored", ne: "प्रायोजित", icon: BookOpen },
                { key: "generateSummary", en: "Generate AI Summary", ne: "AI सारांश बनाउनुहोस्", icon: Sparkles },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm">
                    <toggle.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{t(toggle.en, toggle.ne)}</span>
                  </div>
                  <Switch
                    checked={form[toggle.key as keyof typeof form] as boolean}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, [toggle.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">{t("Cover Image", "कभर तस्बिर")}</h3>
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
            )}
            <div>
              <Label className="text-xs">{t("Image URL", "तस्बिर URL")}</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                placeholder="https://..."
                className="mt-1 text-sm"
              />
            </div>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-2"
                disabled={imageUploading || uploadImage.isPending}
              >
                <Upload className="w-3.5 h-3.5" />
                {imageUploading || uploadImage.isPending
                  ? t("Uploading...", "अपलोड गर्दै...")
                  : t("Upload Image", "तस्बिर अपलोड")}
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-news-red hover:bg-news-red/90 text-white"
          >
            {isSubmitting
              ? t("Saving...", "सेभ गर्दै...")
              : articleId
              ? t("Update Article", "लेख अपडेट गर्नुहोस्")
              : t("Publish Article", "लेख प्रकाशन गर्नुहोस्")}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Categories ─────────────────────────────────────────────────────────────
function AdminCategories() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.categories.list.useQuery();
  const [editId, setEditId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", nameNe: "", slug: "", description: "", color: "#dc2626", sortOrder: 0 });

  const create = trpc.categories.create.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setShowNew(false); setForm({ name: "", nameNe: "", slug: "", description: "", color: "#dc2626", sortOrder: 0 }); toast.success(t("Category created!", "श्रेणी सिर्जना गरियो!")); },
  });
  const update = trpc.categories.update.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setEditId(null); toast.success(t("Category updated!", "श्रेणी अपडेट गरियो!")); },
  });
  const del = trpc.categories.delete.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success(t("Category deleted", "श्रेणी मेटाइयो")); },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" className="bg-news-red text-white gap-1" onClick={() => setShowNew(true)}>
        <Plus className="w-3.5 h-3.5" />
        {t("New Category", "नयाँ श्रेणी")}
      </Button>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">{t("Name", "नाम")}</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">{t("Nepali", "नेपाली")}</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">{t("Slug", "स्लग")}</th>
              <th className="text-right px-4 py-3 font-semibold">{t("Actions", "कार्यहरू")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("Loading...", "लोड गर्दै...")}</td></tr>
            ) : (data ?? []).map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color ?? "#dc2626" }} />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell font-nepali text-muted-foreground">{cat.nameNe ?? "—"}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditId(cat.id)}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => del.mutate({ id: cat.id })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New/Edit dialog */}
      <Dialog open={showNew || editId !== null} onOpenChange={() => { setShowNew(false); setEditId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? t("Edit Category", "श्रेणी सम्पादन") : t("New Category", "नयाँ श्रेणी")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>{t("Name (English)", "नाम (अंग्रेजी)")}</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="mt-1" /></div>
            <div><Label className="font-nepali">{t("Name (Nepali)", "नाम (नेपाली)")}</Label><Input value={form.nameNe} onChange={(e) => setForm((f) => ({ ...f, nameNe: e.target.value }))} className="mt-1 font-nepali" /></div>
            <div><Label>{t("Slug", "स्लग")}</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 font-mono text-sm" /></div>
            <div><Label>{t("Color", "रंग")}</Label><Input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="mt-1 h-10 w-full" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNew(false); setEditId(null); }}>{t("Cancel", "रद्द")}</Button>
            <Button
              className="bg-news-red text-white"
              onClick={() => {
                if (editId) {
                  update.mutate({ id: editId, ...form, sortOrder: Number(form.sortOrder) });
                } else {
                  create.mutate({ ...form, sortOrder: Number(form.sortOrder) });
                }
              }}
            >
              {t("Save", "सेभ गर्नुहोस्")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Comments ────────────────────────────────────────────────────────────────
function AdminComments() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.comments.adminList.useQuery({ limit: 20, offset: 0 });
  const approve = trpc.comments.approve.useMutation({ onSuccess: () => utils.comments.adminList.invalidate() });
  const reject = trpc.comments.reject.useMutation({ onSuccess: () => utils.comments.adminList.invalidate() });
  const del = trpc.comments.delete.useMutation({ onSuccess: () => { utils.comments.adminList.invalidate(); toast.success(t("Comment deleted", "टिप्पणी मेटाइयो")); } });

  const comments = data?.comments ?? [];

  return (
    <div className="space-y-3">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t("No comments yet", "अहिलेसम्म कुनै टिप्पणी छैन")}</div>
      ) : (
        comments.map((item) => (
          <div key={item.comment.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{item.user?.name ?? item.comment.guestName ?? t("Anonymous", "अनाम")}</span>
                  <Badge
                    variant={item.comment.status === "approved" ? "default" : item.comment.status === "rejected" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {item.comment.status}
                  </Badge>
                  {item.article && (
                    <span className="text-xs text-muted-foreground truncate">
                      on: {item.article.title}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.comment.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(item.comment.createdAt), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.comment.status !== "approved" && (
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600" onClick={() => approve.mutate({ id: item.comment.id })}>
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                )}
                {item.comment.status !== "rejected" && (
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-orange-500" onClick={() => reject.mutate({ id: item.comment.id })}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => del.mutate({ id: item.comment.id })}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Users ──────────────────────────────────────────────────────────────────
function AdminUsers() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.users.useQuery();
  const promote = trpc.admin.promoteUser.useMutation({ onSuccess: () => { utils.admin.users.invalidate(); toast.success(t("User role updated", "प्रयोगकर्ता भूमिका अपडेट गरियो")); } });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">{t("Name", "नाम")}</th>
            <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">{t("Email", "इमेल")}</th>
            <th className="text-left px-4 py-3 font-semibold">{t("Role", "भूमिका")}</th>
            <th className="text-right px-4 py-3 font-semibold">{t("Actions", "कार्यहरू")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("Loading...", "लोड गर्दै...")}</td></tr>
          ) : (data ?? []).map((u) => (
            <tr key={u.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{u.name ?? "—"}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{u.email ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className={u.role === "admin" ? "bg-news-red text-white" : ""}>
                  {u.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => promote.mutate({ userId: u.id, role: u.role === "admin" ? "user" : "admin" })}
                  >
                    {u.role === "admin" ? t("Demote", "डिमोट") : t("Make Admin", "एडमिन बनाउनुहोस्")}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Newsletter ──────────────────────────────────────────────────────────────
function AdminNewsletter() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.newsletter.adminList.useQuery();

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-2xl font-bold">{data?.length ?? 0}</div>
        <div className="text-sm text-muted-foreground">{t("Active Subscribers", "सक्रिय सदस्यहरू")}</div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">{t("Email", "इमेल")}</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">{t("Name", "नाम")}</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">{t("Date", "मिति")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">{t("Loading...", "लोड गर्दै...")}</td></tr>
            ) : (data ?? []).map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">{sub.email}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{sub.name ?? "—"}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                  {format(new Date(sub.createdAt), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
