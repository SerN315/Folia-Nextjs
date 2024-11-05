"use client";
import { createContext, useContext, useEffect, useState } from "react";
import initTranslations from '../../i18n';

const TranslationContext = createContext();

export function TranslationProvider({ children, locale }) {
  const [t, setT] = useState(() => (key) => key); // Fallback function
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
      return null; // return null if cookie doesn't exist
    };

    const savedLocale = getCookie('NEXT_LOCALE') || locale;
    console.log(`Using locale: ${savedLocale}`); // Log the locale being used

    const loadTranslations = async () => {
      setLoading(true); // Start loading
      try {
        const { t: translationFunction } = await initTranslations(savedLocale, ['footer']);
        console.log("Loaded translations for footer:", translationFunction); // Log loaded translations
        setT(() => translationFunction);
      } catch (error) {
        console.error("Error loading translations:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    loadTranslations();
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ t, isLoading }}>
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
