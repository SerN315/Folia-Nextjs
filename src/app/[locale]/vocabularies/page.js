"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/vocabularies.scss";
import "../scss/subnav.scss";
import Link from "next/link";
import { onAuthStateChanged } from "../firebase/authenciation";
import { useSearchParams } from "next/navigation";
import { auth } from "../firebase/authenciation";
import { getTopicFlashcards, searchVocab } from "../js/api/foliaAPI";
// TODO Step 2: favorites, progress, reports via backend API
import { getCookie } from "../js/cookie";

export default function Vocabularies() {
  const locale = getCookie("NEXT_LOCALE");
  console.log(locale); // Logs the value of the locale cookie or null if not found
  const searchParams = useSearchParams(); // Access query params
  const topicID = searchParams.get("topic"); // Get the 'topic' query param
  const searchWord = searchParams.get("word"); // Get the 'topic' query param
  const phrase = searchParams.get("text"); // Get the 'topic' query param
  const [data, setData] = useState([]);
  const [counts, setCount] = useState(0);
  const [favoriteList, setFavoriteList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [progress, setProgress] = useState({}); // State to track progress

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // TODO Step 2: fetch favorites + progress via /api/folia/favorites/:userId and /api/folia/progress/:userId
    });
    return () => unsubscribe();
  }, [topicID]);

  const mapVocab = (word) => {
    let jp = word?.jp ?? null;
    let cn = word?.cn ?? null;
    if (jp?.endsWith(",")) jp = jp.slice(0, -1);
    if (cn?.endsWith(",")) cn = cn.slice(0, -1);
    const exampleText = word?.example ?? null;
    const highlightedSentence = searchWord
      ? exampleText?.replace(new RegExp(`\\b${searchWord}\\b`, "gi"), `<span class="highlight">${searchWord}</span>`) ?? null
      : exampleText;
    return {
      ...(word.Id && { Id: word.Id }),
      ...(word.Word && { Word: word.Word }),
      ...(word.Set && { Set: word.Set }),
      ...(word.Meaning && { Meaning: word.Meaning }),
      ...(word.Pronunciation && { Pronunciation: word.Pronunciation }),
      ...(word.Img && { Img: word.Img }),
      ...(jp && { Jp: jp }),
      ...(cn && { Cn: cn }),
      ...(highlightedSentence && { Sentence: highlightedSentence }),
    };
  };

  useEffect(() => {
    if (!topicID) return;
    setLoading(true);
    getTopicFlashcards(topicID)
      .then((response) => {
        setData((response.vocabs || []).map(mapVocab));
        const topicEl = document.querySelector(".topic");
        const cateEl = document.querySelector(".category");
        if (topicEl) topicEl.innerHTML = response.topics || "";
        if (cateEl) cateEl.innerHTML = response.category || "";
      })
      .catch((err) => { console.error(err); setData([]); })
      .finally(() => setLoading(false));
  }, [topicID]);

  useEffect(() => {
    if (topicID || !phrase) return;
    setLoading(true);
    searchVocab(phrase, 30)
      .then((results) => {
        const newData = results.map(mapVocab);
        setData(newData);
        setCount(newData.length);
      })
      .catch((err) => { console.error(err); setData([]); setCount(0); })
      .finally(() => setLoading(false));
  }, [phrase]);

  const handleFavoriteToggle = (word) => {
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

    setFavoriteList(updatedFavorites);
    // TODO Step 2: persist via POST /api/folia/favorites/:userId
  };
  const handleReport = (word) => {
    const palceholderText =
      "We appreciate your help in maintaining accurate information. Please take a moment to provide us with an explanation of the false information you've encountered.";

    const reportForm = `
      <form class="report-form">
        <div class="mb-3">
          <label for="report" class="form-label">Report False Information</label>
          <textarea class="form-control" placeholder="${palceholderText}" id="reportInput" rows="20"></textarea>
        </div>
        <div class="button-container">
          <button type="submit" class="btn send-report">Submit</button>
          <button type="reset" class="btn cancel-report">Cancel</button>
        </div>
      </form>
    `;

    document.querySelector(".word-box-overlay").innerHTML = reportForm;
    document.querySelector(".word-box-overlay").classList.remove("hidden");

    document.querySelector(".report-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.querySelector("#reportInput").value;

      // TODO Step 2: POST report to backend
      console.log("Report submitted:", { content: text, word });
      document.querySelector(".word-box-overlay").classList.add("hidden");
      document.querySelector(".word-box-overlay").innerHTML = "";
    });

    document.querySelector(".cancel-report").addEventListener("click", () => {
      document.querySelector(".word-box-overlay").classList.add("hidden");
      document.querySelector(".word-box-overlay").innerHTML = "";
    });
  };

  const openModal = (word) => {
    const wordBox = document.querySelector(".word-box-overlay");
    const isKnown = progress[word.Id] === "known";
    const isUnknown = progress[word.Id] === "unknown";

    // const sentences = word.sentence.map((sentence, index) => ({
    //   id: index + 1,
    //   sentence: sentence.trim(),
    // }));

    const vocabDetailed = `
      <div class="modal1 ${isKnown ? "known" : isUnknown ? "unknown" : ""}">
        <button class="close-modal">&times;</button>
        <div class="anh">
          <img 
            src="${word.Img}" 
            width="100%" 
            height="auto" 
            style="object-fit: contain;" 
            alt="word-img" 
          />
        </div>
        <div class="word-box">
          <div class="flex-box">
            <p class="new-word">${word.Word}</p>
            <p class="word-set">${word.Set}</p>
          </div>     
          <p class="pronun"><i class="fa-solid fa-volume-high"></i>${
            word.Pronunciation
          }</p>
        </div>
        <div class="meaning-box">
          <p class="definition-viet">
            <span style="color:green">Meaning: </span>${
              locale === "ja"
                ? word.Jp
                : locale === "zh"
                ? word.Cn
                : word.Meaning
            }
          </p>
          <div class="definition-example">
            <span style="color:green">Example: </span>
            ${word.sentence}
          </div>
        </div>
        <div class="progress-buttons">
          <button id="mark-known" class="btn_success ${
            isKnown ? "active" : ""
          }"><i class="fa-solid fa-check"></i></button>
          <button id="mark-unknown" class="btn_danger ${
            isUnknown ? "active" : ""
          }"><i class="fa-solid fa-x"></i></button>
        </div>
      </div>
    `;

    wordBox.innerHTML = vocabDetailed; // Set the inner HTML
    wordBox.classList.remove("hidden");

    // Handle button clicks
    document.getElementById("mark-known").addEventListener("click", () => {
      updateProgress(word.Id, "known");
      wordBox.classList.add("hidden");
    });

    document.getElementById("mark-unknown").addEventListener("click", () => {
      updateProgress(word.Id, "unknown");
      wordBox.classList.add("hidden");
    });

    document.querySelector(".close-modal").addEventListener("click", () => {
      wordBox.classList.add("hidden");
      wordBox.innerHTML = ""; // Clear content
    });

    // Close modal when clicking outside the modal content
    wordBox.addEventListener("click", (e) => {
      if (e.target === wordBox) {
        wordBox.classList.add("hidden");
        wordBox.innerHTML = ""; // Clear content
      }
    });
  };

  const updateProgress = (vocabId, status) => {
    setProgress((prev) => ({ ...prev, [vocabId]: status }));
    // TODO Step 2: persist via POST /api/folia/progress/:userId
  };

  const handleScroll = () => {
    let scrollProgress = document.getElementById("progress");
    let calcScrollValue = () => {
      let pos = document.documentElement.scrollTop;
      let calcHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      let scrollValue = Math.round((pos * 100) / calcHeight);
      scrollProgress.style.display = pos > 100 ? "grid" : "none";
      scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
      });
      scrollProgress.style.background = `conic-gradient(#3fbd00 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
    };
    window.onscroll = calcScrollValue;
    window.onload = calcScrollValue;
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    // Fetch data on page load
    // fetchVocabByTopic();
    // Handle opening modal for searchWord
    if (searchWord) {
      const checkWordExist = () => {
        const foundWord = data.find((item) => item.Word === searchWord);
        if (foundWord) {
          openModal(foundWord); // Open modal for the found word
        }
      };

      // Wait for `data` to load before checking
      if (!loading) {
        checkWordExist();
      }
    }
  }, [loading, searchWord, data]); // Re-run when loading or data changes

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <title>English - Vocabulary</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />
      </Head>
      {/* <TopNav/> */}
      <div id="progress">
        <span id="progress-value">
          <i className="fa-solid fa-arrow-up" />
        </span>
      </div>
      <main className="bigArticle">
        {/* NAVIGATION PANEL */}
        {/* NAVIGATION PANEL */}
        <div
          className="nav-panel"
          style={{ display: phrase ? "none" : "flex" }}
        >
          <p className="nav-panel__navigation">
            <Link href="#" cate="" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Vocabulary</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`/flashcard?topic=${topicID}`}
              className="nav-panel__game-list__game-item flashcard-link"
            >
              <i className="fa-regular fa-images" />
              <p>Flashcard</p>
            </Link>
            <Link
              href={`/dragdrop?topic=${topicID}`}
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
        {/* <!-- SEARCH RESULT CONTENT --> */}

        <div
          class="search-result"
          style={{ display: phrase ? "flex" : "none" }}
        >
          <h1>SEARCH RESULT</h1>
          <h2>
            THERE ARE <span class="count">{counts}</span> RESULTS THAT CONTAIN
            THE PHRASE <span class="input-text">{phrase}</span>
          </h2>
        </div>

        {/* VOCABULARY MAIN CONTENT */}
        <div className="article">
          {loading ? ( // Show loading state
            // Skeleton loader for vocabulary item
            <>
              <div className="vocabulary-load">
                <i className="fa-solid fa-heart favorites" />
                <div className="vocabulary-load-image" />
                <div className="vocabulary-load-word">
                  <div className="word-load">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-set">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-pronunciation">
                    <i className="fa-solid fa-volume-high" />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-audio" />
                </div>
              </div>
              <div className="vocabulary-load">
                <i className="fa-solid fa-heart favorites" />
                <div className="vocabulary-load-image" />
                <div className="vocabulary-load-word">
                  <div className="word-load">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-set">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-pronunciation">
                    <i className="fa-solid fa-volume-high" />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-audio" />
                </div>
              </div>
              <div className="vocabulary-load">
                <i className="fa-solid fa-heart favorites" />
                <div className="vocabulary-load-image" />
                <div className="vocabulary-load-word">
                  <div className="word-load">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-set">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-pronunciation">
                    <i className="fa-solid fa-volume-high" />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-audio" />
                </div>
              </div>
              <div className="vocabulary-load">
                <i className="fa-solid fa-heart favorites" />
                <div className="vocabulary-load-image" />
                <div className="vocabulary-load-word">
                  <div className="word-load">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-set">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-pronunciation">
                    <i className="fa-solid fa-volume-high" />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="word-load-audio" />
                </div>
              </div>
            </>
          ) : data.length > 0 ? (
            data.map((word, index) => {
              const wordProgress = progress[word.Id];
              const isKnown = wordProgress === "known";
              const isUnknown = wordProgress === "unknown";
              console.log(progress);

              return (
                <div
                  className={`vocabulary show-modal ${
                    isKnown ? "known" : isUnknown ? "unknown" : ""
                  }`}
                  key={index}
                >
                  <div className="vocabulary-image">
                    <img src={word.Img} alt={word.Word} />
                  </div>
                  <div
                    className="vocabulary-word"
                    onClick={() => openModal(word)}
                  >
                    <div className="word">{word.Word}</div>
                    <div className="word-set">{word.Set}</div>
                    <div className="word-pronunciation">
                      <i className="fa-solid fa-volume-high" />{" "}
                      {word.Pronunciation}
                    </div>
                    <div className="word-meaning">
                      {locale === "ja"
                        ? word.Jp
                        : locale === "zh"
                        ? word.Cn
                        : word.Meaning}
                    </div>
                  </div>
                  <div className="icon-container">
                    <i
                      className="fa-solid fa-flag report"
                      onClick={() => handleReport(word.Word)}
                    ></i>
                    {user && (
                      <div className="favorite-toggle">
                        <button
                          className={`favorite-btn ${
                            favoriteList.some((item) => item.id === word.Id)
                              ? "favorited"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal opening
                            handleFavoriteToggle(word); // Pass word object directly
                          }}
                        >
                          <i
                            className="fa fa-heart"
                            style={{
                              color: favoriteList.some(
                                (item) => item.id === word.Id
                              )
                                ? "red"
                                : "inherit",
                            }}
                          ></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No vocabulary found.</p> // Message if no data
          )}
        </div>
      </main>

      <div className="word-box-overlay overlay hidden"></div>
      {/* <Footer /> */}
    </>
  );
}
