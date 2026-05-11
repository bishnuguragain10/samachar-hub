import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function Footer() {
  const { t, isNepali } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Fetch dynamic categories from backend
  const { data: categoriesData } = trpc.categories.list.useQuery();
  const categories = categoriesData ?? [];

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success(
        t(
          "Successfully subscribed to newsletter!",
          "न्यूजलेटरमा सफलतापूर्वक सदस्यता लिइयो!"
        )
      );
      setEmail("");
      setName("");
    },
    onError: err => {
      toast.error(err.message || t("Failed to subscribe", "सदस्यता लिन असफल"));
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({ email, name: name || undefined });
  };

  return (
    <footer className="bg-card dark:bg-gray-900 border-t border-border dark:border-gray-800 mt-12">
      {/* Newsletter section */}
      <div className="bg-news-red text-white">
        <div className="container py-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3
              className={`text-2xl font-bold mb-2 ${isNepali ? "font-nepali" : ""}`}
            >
              {t("Stay Informed", "सूचित रहनुहोस्")}
            </h3>
            <p
              className={`text-white/80 mb-6 text-sm ${isNepali ? "font-nepali" : ""}`}
            >
              {t(
                "Get the latest news from Nepal delivered to your inbox.",
                "नेपालका ताजा समाचार आफ्नो इनबक्समा पाउनुहोस्।"
              )}
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <Input
                type="text"
                placeholder={t(
                  "Your name (optional)",
                  "तपाईंको नाम (वैकल्पिक)"
                )}
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
              />
              <Input
                type="email"
                placeholder={t("Your email address", "तपाईंको इमेल ठेगाना")}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
              />
              <Button
                type="submit"
                disabled={subscribe.isPending}
                className="bg-white text-news-red hover:bg-white/90 h-10 shrink-0 gap-1"
              >
                <Send className="w-4 h-4" />
                {t("Subscribe", "सदस्यता")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-news-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">Samachar Hub</div>
                <div className="font-nepali text-xs text-muted-foreground dark:text-gray-400">
                  समाचार हब
                </div>
              </div>
            </div>
            <p
              className={`text-sm text-muted-foreground dark:text-gray-400 mb-4 ${isNepali ? "font-nepali" : ""}`}
            >
              {t(
                "Nepal's trusted source for breaking news, politics, business, sports, and more.",
                "नेपालको विश्वसनीय समाचार स्रोत — ब्रेकिङ न्युज, राजनीति, व्यापार, खेलकुद र थप।"
              )}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4
              className={`font-bold text-sm mb-4 text-gray-900 dark:text-white ${isNepali ? "font-nepali" : ""}`}
            >
              {t("Categories", "श्रेणीहरू")}
            </h4>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors ${
                      isNepali ? "font-nepali" : ""
                    }`}
                  >
                    {isNepali && cat.nameNe ? cat.nameNe : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className={`font-bold text-sm mb-4 text-gray-900 dark:text-white ${isNepali ? "font-nepali" : ""}`}
            >
              {t("Quick Links", "द्रुत लिङ्कहरू")}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", en: "Home", ne: "गृहपृष्ठ" },
                { href: "/bookmarks", en: "Bookmarks", ne: "बुकमार्क" },
                { href: "/search", en: "Search", ne: "खोज" },
                { href: "#about", en: "About Us", ne: "हाम्रो बारेमा" },
                { href: "#contact", en: "Contact", ne: "सम्पर्क" },
                { href: "#advertise", en: "Advertise", ne: "विज्ञापन" },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors ${
                      isNepali ? "font-nepali" : ""
                    }`}
                  >
                    {t(link.en, link.ne)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4
              className={`font-bold text-sm mb-4 text-gray-900 dark:text-white ${isNepali ? "font-nepali" : ""}`}
            >
              {t("Contact Us", "सम्पर्क गर्नुहोस्")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-news-red" />
                <span className={isNepali ? "font-nepali" : ""}>
                  {t("Kathmandu, Nepal", "काठमाडौं, नेपाल")}
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                <Mail className="w-4 h-4 shrink-0 text-news-red" />
                <a
                  href="mailto:news@samacharhub.com"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  news@samacharhub.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                <Phone className="w-4 h-4 shrink-0 text-news-red" />
                <span>+977-1-XXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border dark:border-gray-800">
        <div className="container py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground dark:text-gray-400">
          <span className={`text-center sm:text-left ${isNepali ? "font-nepali" : ""}`}>
            {t(
              `© ${new Date().getFullYear()} Samachar Hub. All rights reserved.`,
              `© ${new Date().getFullYear()} समाचार हब। सर्वाधिकार सुरक्षित।`
            )}
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#" className="hover:text-primary dark:hover:text-white transition-colors">
              {t("Privacy Policy", "गोपनीयता नीति")}
            </a>
            <a href="#" className="hover:text-primary dark:hover:text-white transition-colors">
              {t("Terms of Service", "सेवाका शर्तहरू")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
