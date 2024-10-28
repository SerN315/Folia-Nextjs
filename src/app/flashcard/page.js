"use client";
import Image from "next/image";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import { useState, useEffect, useRef } from "react";
import "../scss/flash.scss";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { auth } from "../firebase/authenciation";
import { getDatabase } from "../js/api/databaseAPI";
import { fetchTopic } from "../js/api/specificPageApi";
import Link from "next/link";

export default function FlashCard() {
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

  const ht2 = [
    "8e3fdb05-5ef5-4e77-b400-0d8767fb539e",
    "730846b3-4f7b-4367-b004-f3842d630b7e",
    "61e2d92a-e3a6-418f-939f-99ede4c5b185",
    "53114cf6-dadc-4c5d-b08a-c04d1b433274",
    "d7585a20-67e8-48d1-b097-05f5f498edd9",
    "3264dc41-5c6f-4e4f-9ece-71136a57afe3",
    "28704707-dc7e-45cb-9765-16865d32b9c5",
    "46852722-fb9f-4935-b2d3-add5bff13640",
    "94879267-de61-4edb-baf7-ac99849ebe21",
  ];

  const codelabid = [
    "602c19aa0a48437aa38b322e5863d7b6",
    "9b15c0bb39e4484a95cb054040485d0c",
    "8b5d55aff1be4580b23e4e34142c7d09",
    "aac0459b84bf48019510a8f2c73f7eab",
    "3dc16a1a73064fdf8b4c1b199077383e",
  ];

  const isFavorited = favoriteList.some(
    (item) => item.id === data[currentIndex]?.Id
  );

  useEffect(() => {
    const firestore = getFirestore();

    // Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userid = auth.currentUser.uid;
        const favoriteRef = doc(firestore, "favorites", userid);

        getDoc(favoriteRef).then((docSnapshot) => {
          const favoriteList = docSnapshot.exists()
            ? docSnapshot.data().favoriteList
            : [];
          setFavoriteList(favoriteList); // Set favorite list
          fetchVocabBasedOnTopic(favoriteList, favoriteRef, firestore);
        });
      } else {
        fetchVocabBasedOnTopic([], null, firestore);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [topicID]);

  const fetchVocabBasedOnTopic = (favoriteList, favoriteRef, firestore) => {
    setLoading(true); // Start loading
    const databaseId = ht2.includes(topicID)
      ? "c3428e69474d46a790fe5e4d37f1600d"
      : "8240dd072127443f8e51d09de242c2d9";
    getDatabase(databaseId, {
      filter: {
        property: ht2.includes(topicID) ? "topic" : "Topic",
        relation: {
          contains: topicID,
        },
      },
    })
      .then((response) => {
        console.log("API Response:", response);

        const newData = response
          .map((item) => {
            try {
              if (ht2.includes(topicID)) {
                // Handle ht2 data structure
                const word = item.properties.Name.title[0]?.plain_text;
                const meaning = item.properties.Answer_Content.formula.string;
                const pronunciation =
                item.properties.explanation.rich_text[0]?.plain_text;
                const img = item.properties.Img.files?.[0]?.url;
                console.log({
                  word,
                  meaning,
                  pronunciation,
                  img,
                });
                return {
                  word,
                  meaning,
                  pronunciation,
                  img,
                };
              } else {
                // Handle regular data structure
                const uniqueId = item.properties.ID.unique_id.number; // Make sure 'ID' exists
                const word = item.properties.Name.title[0]?.plain_text; // Check 'Name'
                const set = item.properties.Set.multi_select[0]?.name; // Check 'Set'
                const meaning =
                  item.properties.Meaning.rich_text[0]?.plain_text; // Check 'Meaning'
                const pronunciation =
                  item.properties.Pronunciation.rich_text[0]?.plain_text; // Check 'Pronunciation'
                const img = item.properties.img.rich_text[0]?.plain_text; // Check 'img'

                // Log each extracted value for debugging
                console.log({
                  uniqueId,
                  word,
                  set,
                  meaning,
                  pronunciation,
                  img,
                });

                return {
                  Id: uniqueId,
                  Word: word,
                  Set: set,
                  Meaning: meaning,
                  Pronunciation: pronunciation,
                  Img: img,
                };
              }
            } catch (error) {
              console.error("Error processing item:", item, error);
              return null; // Return null in case of error
            }
          })
          .filter((item) => item !== null); // Filter out any null values

        setData(newData);
        setLoading(false); // Stop loading

        fetchTopic(topicID)
          .then((topic) => {
            console.log("Topic:", topic);

            // Select the element with the class 'topic'
            const topicElement = document.querySelector(".topic");
            const cateElement = document.querySelector(".category");
            // Check if topic exists and has a name
            if (topic && topic.topicName) {
              topicElement.innerHTML = topic.topicName; // Set the topic name
            } else {
              topicElement.innerHTML = "No topic available"; // Fallback message
            }
            if (topic && topic.topicName) {
              cateElement.innerHTML = topic.categories[0].categoryName; // Set the topic name
            } else {
              cateElement.innerHTML = "No topic available"; // Fallback message
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            document.querySelector(".topic").innerHTML = "Error fetching topic"; // Error handling message
          });
      })
      .catch((error) => {
        console.error("Error fetching vocabularies:", error);
        setData([]);
        setLoading(false); // Stop loading even on error
      });
  };

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
          pronunciation: word.Pronunciation,
          set: word.Set,
          word: word.Word,
        },
      ];
    }

    setFavoriteList(updatedFavorites); // Update state

    // Firestore update logic
    const firestore = getFirestore();
    const userid = auth.currentUser.uid;
    const favoriteRef = doc(firestore, "favorites", userid);

    setDoc(favoriteRef, { favoriteList: updatedFavorites }, { merge: true })
      .then(() => {
        console.log("Favorites updated successfully");
      })
      .catch((error) => {
        console.error("Error updating favorites: ", error);
      });
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
              <div class="card">
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
                          <h2>
                            {ht2.includes(topicID) ? item.word : item.Word}
                          </h2>
                          {ht2.includes(topicID) ? (
                            <>
                              <h3>{item.pronunciation}</h3>
                              {/* <h3>{item.meaning}</h3> */}
                            </>
                          ) : (
                            <>
                              <h3>{item.Pronunciation}</h3>
                              <h3>{item.Set}</h3>
                              {/* <h3>{item.Meaning}</h3> */}
                            </>
                          )}
                        </div>

                        {/* Image section */}
                        {item.Img && (
                          <div className="flashcardimg">
                            <img
                              src={item.Img}
                              alt={
                                ht2.includes(topicID) ? item.word : item.Word
                              }
                              width={200}
                              height={200}
                            />
                            {ht2.includes(topicID) ? (
                              <h2>{item.meaning}</h2>
                            ) : (
                              <h2>{item.Meaning}</h2>
                            )}
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
