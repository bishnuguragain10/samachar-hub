import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ne";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (en: string, ne: string) => string;
  isNepali: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (en) => en,
  isNepali: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("sh-lang") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("sh-lang", language);
    document.documentElement.lang = language;
    if (language === "ne") {
      document.documentElement.classList.add("lang-ne");
    } else {
      document.documentElement.classList.remove("lang-ne");
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ne" : "en"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (en: string, ne: string) => (language === "ne" ? ne : en);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, isNepali: language === "ne" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
