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
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const [selectedLocale, setSelectedLocale] = useState(getCookie("NEXT_LOCALE") || "en");
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Toggle for dropdown visibility

  const handleChange = (locale) => {
    setSelectedLocale(locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/`; // Update locale cookie
    setDropdownOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    const localeRegex = /^\/(en|vi|ja|zh)(\/|$)/; // Adjust locale regex if needed
    const pathWithoutLocale = currentPathname.replace(localeRegex, "/");

    const newPath = `/${selectedLocale}${pathWithoutLocale}`;
    const query = searchParams.toString();
    const finalPath = query ? `${newPath}?${query}` : newPath;

    // Perform shallow routing to avoid reloading the page
    router.push(finalPath, undefined, { shallow: true });
  }, [selectedLocale, currentPathname, searchParams, router]);

  if (isLoading) return <p>Loading translations...</p>;

  const languages = [
    { code: "en", name: t("English"), flag: "/img/Icons/en.png", flagi: "fa-flag-us" },
    { code: "vi", name: t("Vietnamese"), flag: "/img/Icons/vi.png", flagi: "fa-flag-vn" },
    { code: "ja", name: t("Japanese"), flag: "/img/Icons/ja.png", flagi: "fa-flag-jp" },
    { code: "zh", name: t("Chinese"), flag: "/img/Icons/zh.png", flagi: "fa-flag-cn" },
  ];

  const selectedLanguage = languages.find((lang) => lang.code === selectedLocale);

  return (
    <div className="language-changer">
      {/* Custom Selected View */}
      <div className="selected-flag" onClick={() => setDropdownOpen(!isDropdownOpen)}>
        <img
          src={selectedLanguage.flag}
          alt={selectedLanguage.code}
          className="flag-icon"
        />
      </div>

      {/* Custom Dropdown */}
      {isDropdownOpen && (
        <div className="custom-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="dropdown-item"
              onClick={() => handleChange(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.code}
                className="dropdown-flag"
              />
              {lang.name}
            </div>
          ))}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .language-changer {
          position: relative;
          display: inline-block;
          width: 50px; /* Adjust width to fit the flag */
        }

        .selected-flag {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          height: 30px; /* Adjust height as needed */
          width: 100%;
        }

        .flag-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .custom-dropdown {
          position: absolute;
          width: 150px;
          top: 100%;
          left: -100%;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 100;
          max-height: 200px;
          overflow-y: auto; /* Make dropdown scrollable if many options */
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .dropdown-flag {
          width: 20px;
          height: 15px;
          object-fit: cover;
          margin-right: 8px; /* Space between flag and text */
        }
      `}</style>
    </div>
  );
}
