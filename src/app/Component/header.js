"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Login from "../Component/loginUI";
import { getDatabase2 } from "../js/api/databaseAPI";
import { auth } from "../firebase/authenciation";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

export default function TopNav() {
  const [vocab, setVocab] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const resultContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const idnguoidung = user.uid;

        // Fetch userInfo and challenge data
        const userInfoQuery = query(
          collection(firestore, `user_history`, idnguoidung, `userInfo`)
        );
        const unsubscribeUserInfo = onSnapshot(userInfoQuery, (userInfoSnapshot) => {
          userInfoSnapshot.forEach((userInfoDoc) => {
            const userInfoData = userInfoDoc.data();

            const challengeQuery = query(
              collection(firestore, `user_history`, idnguoidung, `challenge`)
            );
            const unsubscribeChallenges = onSnapshot(challengeQuery, (challengeSnapshot) => {
              let challengePoints = {};
              challengeSnapshot.forEach((challengeDoc) => {
                const challengeData = challengeDoc.data();
                const challengeId = challengeDoc.id;

                if (!challengePoints[challengeId] || challengePoints[challengeId] < challengeData.score) {
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
                  console.log("Data saved to ranking collection:", rankingData);
                })
                .catch((error) => {
                  console.error("Error saving ranking data:", error);
                });
            });

            return () => {
              unsubscribeChallenges();
            };
          });
        });

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
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (value === "") {
      setSearchResultsVisible(false);
    } else {
      setSearchResultsVisible(true);
      const response = await getDatabase2(`vocabularies?search=${value}`);
      const sliceResponse = response.slice(0, 5);
      setVocab(sliceResponse.map((word) => ({ name: word.Word, topicID: word.TopicId })));
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/vocabularies.html?text=${searchValue}`;
    }
  };

  const handleSearchResultClick = (word) => {
    window.location.href = `/vocabularies.html?topic=${word.topicID}&word=${word.name}`;
  };

  const toggleDropdown = (dropdownClass) => {
    document.querySelector(dropdownClass).classList.toggle("active");
  };

  return (
    <>
      <div className="flex-container">
        <div className="info-box">
          <a href="hub" className="info-box__title">FOLIA</a>
        </div>

        <div className="search-bar" tabIndex={0}>
          <i className="fa-solid fa-magnifying-glass search-bar__icon" />
          <input
            type="search"
            className="inside-search-bar"
            placeholder="Find your favorite topics on Folia"
            onChange={handleSearchInput}
            onKeyPress={handleEnterKeyPress}
            ref={searchInputRef}
          />
          {searchResultsVisible && (
            <div className="search__result" ref={resultContainerRef}>
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
        </div>

        <div className="buttons">
          <button className="open-popup login-button">Login</button>
          <a href="/challenge" className="ranking hidden">
            <Image
              src="/img/features-icon/ranking-ico.svg"
              className="ranking--ico"
              alt="Ranking Icon"
              width={25}
              height={25}
            />
          </a>
          <div className="streak hidden">
            <button className="streak__btn" onClick={() => toggleDropdown(".streak__dropdown")}>
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
                  <p className="days-cnt">learning day streak</p>
                  <p className="tips">Play a game today to keep your streak!</p>
                </div>
              </div>
              <hr />
              <a href="/streak.html" className="link">View More</a>
            </div>
          </div>
          <a href="intro.html">
            <Image src="/img/help.svg" width={40} height={40} />
          </a>

          <div className="profile hidden">
            <button className="profile__btn" onClick={() => toggleDropdown(".profile__dropdown")}>
              <Image
                src="/img/avatar.png"
                className="avatar"
                width={25}
                height={25}
              />
            </button>
            <div className="profile__dropdown">
              <a className="detail" href="/pro5.html">
                <Image
                  className="detail__avatar"
                  src="/img/avatar.png"
                  width={25}
                  height={25}
                />
                <div className="detail__info">
                  <h5 className="user-name">username</h5>
                  <p className="user-email">example@domain.com</p>
                </div>
              </a>
              <hr />
              <a href="/favorite.html" className="link">Favorites</a>
              <hr />
              <a href="/setting.html" className="link">Settings</a>
              <div className="logout link hidden">Log Out</div>
            </div>
          </div>
        </div>
      </div>
      <Login />
    </>
  );
}