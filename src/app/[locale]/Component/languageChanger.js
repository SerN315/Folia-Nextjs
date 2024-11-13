"use client";

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "./TranslationProvider"; // Custom hook
import "../scss/languageChanger.scss";
import { useEffect, useState } from "react";

export default function LanguageChanger() {
  const { t, isLoading } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const [selectedLocale, setSelectedLocale] = useState(getCookie("NEXT_LOCALE") || "en");

  const handleChange = (e) => {
    const newLocale = e.target.value;
    setSelectedLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`; // Update locale cookie
  };

  useEffect(() => {
    // Remove any existing locale prefix from the path
    const localeRegex = /^\/(en|vi|ja|zh)(\/|$)/; // Adjust locale regex if needed
    const pathWithoutLocale = currentPathname.replace(localeRegex, "/");

    // Build the new path with the selected locale prefix
    const newPath = `/${selectedLocale}${pathWithoutLocale}`;
    const query = searchParams.toString();
    const finalPath = query ? `${newPath}?${query}` : newPath;

    // Push the final path
    router.push(finalPath);
  }, [selectedLocale, currentPathname, searchParams, router]);

  if (isLoading) return <p>Loading translations...</p>;

  return (
    <select onChange={handleChange} value={selectedLocale} className="language-changer">
      <option value="en" className="flag-option en">
        {t("English")}
      </option>
      <option value="vi" className="flag-option vi">
        {t("Vietnamese")}
      </option>
      <option value="ja" className="flag-option ja">
        {t("Japanese")}
      </option>
      <option value="zh" className="flag-option zh">
        {t("Chinese")}
      </option>
    </select>
  );
}
