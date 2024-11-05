// TranslationContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import initTranslations from '../../i18n';

const TranslationContext = createContext();

export function TranslationProvider({ children, locale }) {
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await initTranslations(locale, ['common']);
        setT(() => translations.t);
      } catch (error) {
        console.error("Error loading translations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ t, loading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
