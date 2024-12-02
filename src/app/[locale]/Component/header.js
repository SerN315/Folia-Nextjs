"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Login from "../Component/loginUI";
import { getDatabase, getDatabase2 } from "../js/api/databaseAPI";
import { auth } from "../firebase/authenciation";
import { signOut } from "firebase/auth";
import LanguageChanger from "./languageChanger";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from './TranslationProvider';

export default function TopNav() {
  const { t } = useTranslation();
  const [vocab, setVocab] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const resultContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const firestore = getFirestore();
  const pathname = usePathname();
  const hideTopNavPaths = ["/vi", "/vi/hub","/en","/en/hub","/hub","/ja","/ja/hub","/zh/hub","/zh"];

  const handleLogoutClick = () => {
    signOut(auth)
      .then(() => {
        document.querySelector(".profile__dropdown").classList.remove("active");
        document.querySelector(".profile__btn").classList.add("hidden");
        document.querySelector(".streak").classList.add("hidden");
        document.querySelector(".ranking").classList.add("hidden");
        document.querySelector(".open-popup").classList.remove("hidden");
        wrapperRef.current.classList.add("active-popup");
        console.log("User signed out");
      })
      .catch((err) => {
        console.error("Logout error:", err.message);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const idnguoidung = user.uid;

        // Fetch userInfo and challenge data
        const userInfoQuery = query(
          collection(firestore, `user_history`, idnguoidung, `userInfo`)
        );
        const unsubscribeUserInfo = onSnapshot(
          userInfoQuery,
          (userInfoSnapshot) => {
            userInfoSnapshot.forEach((userInfoDoc) => {
              const userInfoData = userInfoDoc.data();

              const challengeQuery = query(
                collection(firestore, `user_history`, idnguoidung, `challenge`)
              );
              const unsubscribeChallenges = onSnapshot(
                challengeQuery,
                (challengeSnapshot) => {
                  let challengePoints = {};
                  challengeSnapshot.forEach((challengeDoc) => {
                    const challengeData = challengeDoc.data();
                    const challengeId = challengeDoc.id;

                    if (
                      !challengePoints[challengeId] ||
                      challengePoints[challengeId] < challengeData.score
                    ) {
                      challengePoints[challengeId] = challengeData.score;
                    }
                  });

                  let totalPoints = Object.values(challengePoints).reduce(
                    (sum, score) => sum + score,
                    0
                  );

                  const rankingData = {
                    userId: userInfoData.userId,
                    avatar: userInfoData.photoURL,
                    username: userInfoData.displayname,
                    email: userInfoData.email,
                    totalPoints,
                  };

                  setDoc(doc(firestore, "ranking", idnguoidung), rankingData)
                    .then(() => {
                      console.log(
                        "Data saved to ranking collection:",
                        rankingData
                      );
                    })
                    .catch((error) => {
                      console.error("Error saving ranking data:", error);
                    });
                }
              );

              return () => {
                unsubscribeChallenges();
              };
            });
          }
        );

        return () => {
          unsubscribeUserInfo();
        };
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firestore]);

  const handleSearchInput = async (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchValue(value);
  
    if (value === "") {
      setSearchResultsVisible(false);
      setVocab([]); // Clear results when input is empty
    } else {
      setSearchResultsVisible(true);
  
      try {
        // Fetch data from the database
        const response = await getDatabase2(`vocabularies?search=${value}`);
        const sliceResponse = response.slice(0, 5);
  
        // Map and update state
        const vocabData = sliceResponse.map((word) => ({
          name: word.Word,
          topicID: word.TopicId,
        }));
        setVocab(vocabData);
      } catch (error) {
        console.error("Error fetching vocab data:", error);
        setVocab([]); // Clear results in case of error
      }
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/vocabularies?text=${searchValue}`;
    }
  };

  const handleSearchResultClick = (word) => {
    window.location.href = `/vocabularies?topic=${word.topicID}&word=${word.name}`;
  };

  const handleArrowNavigation = (e) => {
    if (!searchResultsVisible) return;
    const searchResults = resultContainerRef.current.querySelectorAll(".cards.show");
    if (searchResults.length === 0) return;

    let currentIndex = Array.from(searchResults).findIndex(
      (item) => document.activeElement === item
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = Math.min(currentIndex + 1, searchResults.length - 1);
      searchResults[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = Math.max(currentIndex - 1, 0);
      searchResults[prevIndex]?.focus();
    }
  };

  const toggleDropdown = (dropdownClass) => {
    document.querySelector(dropdownClass).classList.toggle("active");
  };

  if (hideTopNavPaths.includes(pathname)) {
    return null; // Do not render TopNav if on specified paths
  }
  return (
    <>
      <div className="flex-container">
        <div className="info-box">
          <Link href="hub" className="info-box__title">
            FOLIA
          </Link>
        </div>

        <div className="search-bar" tabIndex={0}>
          <i className="fa-solid fa-magnifying-glass search-bar__icon" />
          <input
            type="search"
            className="inside-search-bar"
            placeholder={t('search', { ns: 'topnav' })}
            onChange={handleSearchInput}
            onKeyPress={handleEnterKeyPress}
            ref={searchInputRef}
          />
          {searchResultsVisible && vocab.length > 0 && (
      <div className="search__result" ref={resultContainerRef} style={{display : "flex"}}>
        {vocab.map((word, index) => (
          <div
            key={index}
            className="cards show"
            tabIndex={index}
            onClick={() => handleSearchResultClick(word)}
          >
            {word.name}
          </div>
        ))}
      </div>
    )}
    {searchResultsVisible && vocab.length === 0 && (
      <div className="search__result no-results">
        <p>No results found</p>
      </div>
    )}
        </div>

        <div className="buttons">
          <button className="open-popup login-button">{t('login', { ns: 'topnav' })}</button>
          <Link href="/challenge" className="ranking hidden">
            <Image
              src="/img/features-icon/ranking-ico.svg"
              className="ranking--ico"
              alt="Ranking Icon"
              width={25}
              height={25}
            />
          </Link>
          <div className="streak hidden">
            <button
              className="streak__btn"
              onClick={() => toggleDropdown(".streak__dropdown")}
            >
              <Image
                src="/img/features-icon/streak-ico.svg"
                alt="Streak Icon"
                className="streak-ico"
                width={25}
                height={25}
              />
            </button>
            <div className="streak__dropdown">
              <div className="info">
                <Image
                  src="/img/features-icon/streak-ico.svg"
                  alt="Streak Icon"
                  className="info__ico"
                  width={25}
                  height={25}
                />
                <div className="info__text">
                  <h4 className="streak-cnt">0</h4>
                  <p className="days-cnt">{t('streak1', { ns: 'topnav' })}</p>
                  <p className="tips">{t('streak2', { ns: 'topnav' })}</p>
                </div>
              </div>
              <hr />
              <Link href="/streak" className="link">
              {t('view', { ns: 'topnav' })}
              </Link>
            </div>
          </div>
          <LanguageChanger/>

          <div className="profile">
            <button
              className="profile__btn hidden"
              onClick={() => toggleDropdown(".profile__dropdown")}
            >
              <Image src="" className="avatar" width={25} height={25} />
            </button>
            <div className="profile__dropdown">
              <a className="detail" href="/profile">
                <Image
                  className="detail__avatar"
                  src=""
                  width={25}
                  height={25}
                />
                <div className="detail__info">
                  <h5 className="user-name">username</h5>
                  <p className="user-email">example@domain.com</p>
                </div>
              </a>
              <hr />
              <Link href="/favorite" className="link">
                {t('favorite', { ns: 'topnav' })}
              </Link>
              <hr />
              <a href="/setting" className="link">
              {t('settings', { ns: 'topnav' })}
              </a>
              <div className="logout link hidden" onClick={handleLogoutClick}>
              {t('logout', { ns: 'topnav' })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Login />
    </>
  );
}
