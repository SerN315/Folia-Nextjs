"use client";
import Image from "next/image";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import { useState, useEffect, useRef } from "react";
import "../scss/flash.scss";
import { onAuthStateChanged } from "../firebase/authenciation";
import { useSearchParams } from "next/navigation";
import { auth } from "../firebase/authenciation";
import { getTopicFlashcards } from "../js/api/foliaAPI";
// TODO Step 2: favorites via /api/folia/favorites/:userId
import Link from "next/link";
import DOMPurify from "dompurify";
import { getCookie } from "../js/cookie";

export default function FlashCard() {
  const locale = getCookie("NEXT_LOCALE");
  console.log(locale); // Logs the value of the locale cookie or null if not found
  const searchParams = useSearchParams(); // Access query params
  const topicID = searchParams.get("topic"); // Get the 'topic' query param
  const [data, setData] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const autoCycleInterval = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [allData, setAllData] = useState([]); // State to hold all fetched data


  const isFavorited = favoriteList.some(
    (item) => item.id === data[currentIndex]?.Id
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // TODO Step 2: fetch favorites from /api/folia/favorites/:userId
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!topicID) return;
    setLoading(true);
    getTopicFlashcards(topicID)
      .then((response) => {
        const newData = (response.vocabs || []).map((item) => ({
          Id: item.Id,
          Word: item.Word,
          Meaning: item.Meaning,
          Pronunciation: item.Pronunciation,
          Img: item.Img,
          Set: item.Set,
          Cn: item.cn,
          Jp: item.jp,
          Example: item.example,
        }));
        setAllData(newData);
        setData(newData.slice(0, 30));

        const topicEl = document.querySelector(".topic");
        const cateEl = document.querySelector(".category");
        if (topicEl) topicEl.innerHTML = response.topics || "";
        if (cateEl) cateEl.innerHTML = response.category || "";
      })
      .catch((err) => {
        console.error("Error fetching flashcards:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [topicID]);
  

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleShuffle = () => {
    setData((prevData) => shuffleArray(prevData));
  };

  const handleFavoriteToggle = (word) => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true); // Show login prompt if not logged in
      return; // Exit the function early
    }

    const index = favoriteList.findIndex((item) => item.id === word.Id);
    let updatedFavorites;

    if (index !== -1) {
      // If already a favorite, remove it
      updatedFavorites = favoriteList.filter((item) => item.id !== word.Id);
    } else {
      // If not a favorite, add it
      updatedFavorites = [
        ...favoriteList,
        {
          id: word.Id,
          img: word.Img,
          meaning: word.Meaning,
          jpMeaning: word.jp,
          cnMeaning: word.cn,
          pronunciation: word.Pronunciation,
          set: word.Set,
          word: word.Word,
        },
      ];
    }

    setFavoriteList(updatedFavorites); // Update state
    // TODO Step 2: persist favorites via POST /api/folia/favorites/:userId
  };

  // Function to close the login prompt
  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleAutoCycle = () => {
    if (isAutoCycling) {
      clearInterval(autoCycleInterval.current);
      setIsAutoCycling(false);
    } else {
      setIsAutoCycling(true);
      let count = 0; // Counter for the number of cycles
      autoCycleInterval.current = setInterval(() => {
        if (count < data.length) {
          setCurrentIndex(count); // Set the current index
          setIsFlipped(false); // Reset flip state

          // Wait for half the interval time before flipping
          setTimeout(() => {
            setIsFlipped(true); // Flip the card
          }, 1500); // Adjust this value if needed (1500ms = 1.5 seconds)

          count++;
        } else {
          clearInterval(autoCycleInterval.current); // Stop cycling after one full pass
          setIsAutoCycling(false); // Reset auto-cycling state
        }
      }, 3000); // Set to your full interval time (3000ms = 3 seconds)
    }
  };

  const handlePause = () => {
    clearInterval(autoCycleInterval.current);
    setIsAutoCycling(false);
  };

  const handleNavigate = (direction) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return data.length - 1;
      if (newIndex >= data.length) return 0;
      return newIndex;
    });
    setIsFlipped(false);
  };

  // Swipe handling using touch events
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const distThreshold = 50; // Minimum distance required for a swipe gesture

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distX = touchEndX.current - touchStartX.current;
    if (Math.abs(distX) >= distThreshold) {
      if (distX > 0) {
        handleNavigate(-1); // Swipe right
      } else {
        handleNavigate(1); // Swipe left
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleNavigate(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNavigate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data.length]);

  // Clean up auto cycle on unmount
  useEffect(() => {
    return () => clearInterval(autoCycleInterval.current);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>English - Flashcard</title>
        {/* Add any analytics scripts here if needed */}
      </Head>
      {/* <TopNav/> */}
      <main className="flasharticle">
        {/* NAVIGATION PANEL */}
        <div className="nav-panel">
          <p className="nav-panel__navigation">
            <Link href="/cate?topic=folia-language" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Flashcard</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`vocabularies?topic=${topicID}`}
              className="nav-panel__game-list__game-item vocabulary-link"
            >
              <i className="fa-solid fa-a" />
              <p>Vocabulary</p>
            </Link>
            <Link
              href={`dragdrop?topic=${topicID}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Drag&amp;Drop</p>
            </Link>
            <Link
              href={`/multichoicesFT?topic=${topicID}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Multiple Choices</p>
            </Link>
            <Link
              href={`/arrange?topic=${topicID}`}
              className={`nav-panel__game-list__game-item d-and-d-link ${
                locale === "vi" ? "disabled-link" : ""
              }`}
              onClick={(e) => {
                if (locale === "vi") {
                  e.preventDefault(); // Prevent navigation
                }
              }}
            >
              <i className="fa-regular fa-images" />
              <p>Arrange</p>
            </Link>
            <Link
              href={`fillblank?topic=${topicID}`}
              className="nav-panel__game-list__game-item fillblank-link"
            >
              <i className="fa-solid fa-pen" />
              <p>Fill The Blank</p>
            </Link>
          </div>
        </div>
        {/* FLASHCARD MAIN CONTENT */}
        <div
          className="flashCard"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flashcard-content">
            {loading ? (
              <div
                class="card"
                style={{
                  height: "",
                }}
              >
                <div class="content">
                  <div class="loading"></div>
                </div>
              </div>
            ) : (
              data.length > 0 && (
                <div
                  className={`card ${isFlipped ? "active" : ""}`} // Apply active class here
                  onClick={() => setIsFlipped(!isFlipped)} // Flip the card on click
                >
                  <div className="content">
                    {data.map((item, i) => (
                      <div
                        key={i}
                        className={`content-d ${
                          i === currentIndex ? "active" : ""
                        }`}
                        style={{
                          opacity: i === currentIndex ? "1" : "0",
                          width: i === currentIndex ? "100%" : "0%",
                          transition:
                            "opacity 0.5s, transform 0.5s, width 0.5s",
                        }}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {/* Word section */}
                        <div className="word">
                          <div
                            style={{
                              padding: "0px 50px",
                              fontSize: "25px",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                item.Word,
                                {
                                  ALLOWED_TAGS: [
                                    "small",
                                    "b",
                                    "i",
                                    "strong",
                                    "em",
                                  ], // Add safe tags here
                                  ALLOWED_ATTR: [], // Restrict attributes if necessary
                                }
                              ),
                            }}
                          ></div>
                          <>
                            <h3>{item.Pronunciation}</h3>
                            <h3>{item.Set}</h3>
                          </>
                        </div>

                        {/* Image section */}
                        {item.Img && (
                          <div className="flashcardimg">
                            <img
                              src={item.Img}
                              alt={item.Word}
                              width={200}
                              height={200}
                            />
                            <h2>
                              {locale === "ja"
                                ? item.Jp
                                : locale === "zh"
                                ? item.Cn
                                : item.Meaning}
                            </h2>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            <div className="card-con">
              <button id="speaker">
                <i className="fa-solid fa-volume-high fa-2xl" />
              </button>
              <button
                id="shuffle"
                className="shuffle"
                style={{ fontSize: 30 }}
                onClick={handleShuffle}
              >
                <i className="fa-solid fa-shuffle" />
              </button>
              <div className="con-content">
                <button
                  className="reverse-arrow-button"
                  id="backB"
                  onClick={() => handleNavigate(-1)}
                >
                  <i className="fa-solid fa-angle-left fa-2xl" />
                </button>
                <div id="now-total">
                  {data.length > 0
                    ? `${currentIndex + 1} / ${data.length}`
                    : "0 / 0"}
                </div>
                <button
                  className="arrow-button"
                  id="nextB"
                  onClick={() => handleNavigate(1)}
                >
                  <i className="fa-solid fa-angle-right fa-2xl" />
                </button>
              </div>
              <button
                id="heart"
                className={`favorite ${isFavorited ? "favorited" : ""}`}
                style={{ fontSize: 30 }}
                onClick={() => handleFavoriteToggle(data[currentIndex])}
              >
                <i
                  className={`fa-solid fa-heart ${
                    isFavorited ? "favorited" : ""
                  }`}
                />
              </button>
              {!isAutoCycling ? (
                <button id="autoCycleButton" onClick={handleAutoCycle}>
                  <i className="fa-solid fa-play fa-2xl" />
                </button>
              ) : (
                <button
                  id="pause"
                  style={{
                    fontSize: 30,
                    display: isAutoCycling ? "block" : "none", // Control visibility based on state
                  }}
                  onClick={handlePause}
                >
                  <i className="fa-solid fa-pause" />
                </button>
              )}
            </div>
          </div>
          {/* Login Prompt Popup */}
          {showLoginPrompt && (
            <div className="login-popup">
              <div className="login-popup-content">
                <h2>Please Log In</h2>
                <p>You must be logged in to use the favorites feature.</p>
                <button class="closealert" onClick={closeLoginPrompt}>
                  x
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
