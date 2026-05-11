import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, X, CheckCircle2, Loader2 } from "lucide-react";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewsletterModal({
  open,
  onOpenChange,
}: NewsletterModalProps) {
  const { t, isNepali } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setName("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert(isNepali ? "कृपया मान्य ईमेल ठेगाना प्रविष्ट गर्नुहोस्" : "Please enter a valid email address");
      return;
    }

    subscribeMutation.mutate({ email, name: name || undefined });
  };

  const handleClose = () => {
    setSuccess(false);
    setName("");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-xl ${isNepali ? "font-nepali" : ""}`}>
            {t("Subscribe to Newsletter", "न्यूजलेटरमा सदस्यता लिनुहोस्")}
          </DialogTitle>
          <DialogDescription className={isNepali ? "font-nepali" : ""}>
            {t(
              "Get the latest news delivered to your inbox",
              "नवीनतम समाचारहरू तपाईंको इनबक्समा पाउनुहोस्"
            )}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isNepali ? "font-nepali" : ""}`}>
              {t("Successfully Subscribed!", "सफलतापूर्वक सदस्यता लियो!")}
            </h3>
            <p className={`text-sm text-muted-foreground ${isNepali ? "font-nepali" : ""}`}>
              {t(
                "Thank you for subscribing to our newsletter",
                "हाम्रो न्यूजलेटरमा सदस्यता लिनुभएकोमा धन्यवाद"
              )}
            </p>
            <Button onClick={handleClose} className="mt-6">
              {t("Close", "बन्द गर्नुहोस्")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${isNepali ? "font-nepali" : ""}`}
              >
                {t("Name (Optional)", "नाम (वैकल्पिक)")}
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Your name", "तपाईंको नाम")}
                className={isNepali ? "font-nepali" : ""}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${isNepali ? "font-nepali" : ""}`}
              >
                {t("Email Address", "ईमेल ठेगाना")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("your@email.com", "तपाईं@ईमेल.com")}
                required
                className={isNepali ? "font-nepali" : ""}
              />
            </div>
            {subscribeMutation.error && (
              <p className="text-sm text-red-500">
                {t(
                  "Failed to subscribe. Please try again.",
                  "सदस्यता लिन असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।"
                )}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {t("Cancel", "रद्द गर्नुहोस्")}
              </Button>
              <Button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="flex-1 bg-gradient-to-r from-news-red to-red-600 hover:from-red-600 hover:to-red-700"
              >
                {subscribeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("Subscribing...", "सदस्यता लिँदै...")}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {t("Subscribe", "सदस्यता लिनुहोस्")}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
