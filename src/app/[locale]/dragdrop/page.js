"use client";
import Link from "next/link";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/d_and_d.scss";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
import DOMPurify from "dompurify";
import { getCookie } from "../js/cookie";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  addDoc,
  Timestamp,
  collection,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { getDatabase,getDatabase2 } from "../js/api/databaseAPI";
import { fetchTopic } from "../js/api/specificPageApi";


export default function DragDrop() {
  const locale = getCookie("NEXT_LOCALE");
  console.log(locale); // Logs the value of the locale cookie or null if not found
  const searchParams = useSearchParams(); // Access query params
  const id = searchParams.get("topic"); // Get the 'topic' query param
  const idd = searchParams.get("id");
  const storedTopicName = localStorage.getItem(`Topic`);
  const storedCategoryName = localStorage.getItem(`Category`) ;
  const topicName = storedTopicName ? storedTopicName.replace(/"/g, "") : "null";
  const categoryName = storedCategoryName ? storedCategoryName.replace(/"/g, "") : "null";
  

  // State variables
  const [responseData, setResponseData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [draggedAnswer, setDraggedAnswer] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalMatchingPairs, setTotalMatchingPairs] = useState(5);
  const [uniqueAnswers, setUniqueAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [showInteract, setShowInteract] = useState(false);
  const [showContentInteract, setShowContentInteract] = useState(true);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [droppedQuestions, setDroppedQuestions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Constants
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

  // Effect: Handle Firebase Authentication and Firestore Streaks
  useEffect(() => {
    const firestore = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const streakRef = doc(firestore, "streaks", userId);
        getDoc(streakRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const { streakCheck, streakCnt } = docSnapshot.data();
              if (!streakCheck) {
                updateDoc(streakRef, {
                  streakCheck: true,
                  streakCnt: streakCnt + 1,
                  lastUpdated: Timestamp.now(),
                })
                  .then(() => {
                    setStreak(streakCnt + 1);
                  })
                  .catch((error) => {
                    console.error("Error updating streak: ", error);
                  });
              } else {
                updateDoc(streakRef, {
                  lastUpdated: Timestamp.now(),
                }).catch((error) => {
                  console.error("Error updating lastUpdated: ", error);
                });
              }
            } else {
              const userStreakData = {
                streakCnt: 1,
                streakCheck: true,
                lastUpdated: Timestamp.now(),
              };
              setDoc(streakRef, userStreakData)
                .then(() => {
                  setStreak(1);
                })
                .catch((error) => {
                  console.error("Error setting streak: ", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error getting streak document: ", error);
          });
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id]);

  // Effect: Fetch Data based on Topic or Challenge
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        let fetchedData = [];

        if (ht2.includes(id)) {
          // Fetch data for ht2 topics
          fetchedData = await getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
            filter: {
              property: "topic",
              relation: {
                contains: id,
              },
            },
          });
        } else if (!ht2.includes(id) && !id.includes("challenge")) {
          // Fetch data for non-ht2, non-challenge topics
          await getDatabase2(`vocab/${id}`).then((response) => {
            fetchedData = response.vocabs;
          })
        } else if (id.includes("challenge")) {
          // Fetch data for challenges
          fetchedData = await getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
            filter: {
              property: "challenge",
              relation: {
                contains: idd,
              },
            },
          });
        }

        console.log("Fetched data:", fetchedData);

        if (id.includes("challenge")) {
          // Handle challenge-specific data
          try {
            const storedOriginalQuestions =
              localStorage.getItem("originalQuestions");
            const storedScore = localStorage.getItem("points");
            const storedStreak = localStorage.getItem("streak");

            let originalQuestions = [];
            if (storedOriginalQuestions) {
              originalQuestions = JSON.parse(storedOriginalQuestions);
              // Filter out already attempted questions
              fetchedData = fetchedData.filter(
                (item) => !originalQuestions.some((q) => q.id === item.id)
              );
              fetchedData = fetchedData.slice(0, 5);
              setTotalMatchingPairs(fetchedData.length);
            }

            if (storedScore) setScore(parseInt(storedScore, 10));
            if (storedStreak) setStreak(parseInt(storedStreak, 10));
          } catch (error) {
            console.error("Error handling stored challenge data: ", error);
          }
        }

        setResponseData(fetchedData);
        initiateGame(fetchedData); // Initialize game after data is set
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchData();
  }, [id, idd]);

  
  
  // Function: Initialize Game
  const initiateGame = (data) => {
    if (!data || data.length === 0) {
      console.warn("No data to initialize the game.");
      setLoading(false);
      return;
    }

    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    if(ht2.includes(id)){
    const selectedQuestions = shuffledData
      .slice(0, totalMatchingPairs)
      .map((item) => ({
        Q:
          item.properties.img?.rich_text[0]?.plain_text ??
          item.properties.Name?.title[0]?.text.content ??
          "N/A",
        answer:
          item.properties.Answer_Content?.formula.string ??
          item.properties.Name?.title[0]?.plain_text ??
          "N/A",
        dropped: false, // Add 'dropped' property
        source: "Drag and Drop",
      }));
      

    console.log("Initializing game with questions:", selectedQuestions);

    setQuestions(selectedQuestions);

    const uniqueAnswersSet = new Set(selectedQuestions.map((q) => q.answer));
    const uniqueAnswersArray = Array.from(uniqueAnswersSet).sort(
      () => Math.random() - 0.5
    );
    setUniqueAnswers(uniqueAnswersArray);
  }
  else if (!ht2.includes(id) && !id.includes("challenge")){
    const selectedQuestions = shuffledData
      .slice(0, totalMatchingPairs)
      .map((item) => ({
        Q:
        item.Img ?? // Image URL
          "N/A",
        answer:
        item.Word ?? // Meaning
          "N/A",
        dropped: false, // Add 'dropped' property
        source: "Drag and Drop",
      }));
      

    console.log("Initializing game with questions:", selectedQuestions);

    setQuestions(selectedQuestions);

    const uniqueAnswersSet = new Set(selectedQuestions.map((q) => q.answer));
    const uniqueAnswersArray = Array.from(uniqueAnswersSet).sort(
      () => Math.random() - 0.5
    );
    setUniqueAnswers(uniqueAnswersArray);
  }

    setLoading(false);
  };

  const handleTouchStart = (e, answer) => {
    e.preventDefault(); // Prevent default touch behavior
    setDraggedAnswer(answer); // Store the dragged answer in state
  };

  // Handle Touch End
  const handleTouchEnd = (e, expectedAnswer, questionIndex) => {
    e.preventDefault();
    if (draggedAnswer) {
      processDrop(draggedAnswer, expectedAnswer, questionIndex);
      setDraggedAnswer(null); // Clear the dragged answer
    }
  };

  // Function: Handle Drag Start
  const handleDragStart = (e, answer) => {
    e.dataTransfer.setData("text/plain", answer);
  };

  // Handle Drop (Mouse)
  const handleDrop = (e, expectedAnswer, questionIndex) => {
    e.preventDefault();
    const draggedAnswer = e.dataTransfer.getData("text/plain");
    processDrop(draggedAnswer, expectedAnswer, questionIndex);
  };

  // Function to process the drop logic
  const processDrop = (draggedAnswer, expectedAnswer, questionIndex) => {
    const isCorrect = draggedAnswer === expectedAnswer;

    setTotal((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      // Remove the answer from uniqueAnswers to hide the draggable
      setUniqueAnswers((prev) => prev.filter((ans) => ans !== draggedAnswer));

      // Update the corresponding question's 'dropped' property to true
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          dropped: true,
        };
        return updatedQuestions;
      });

      // Add the question to the droppedQuestions state to apply the class
      setDroppedQuestions((prev) => [...prev, questionIndex]);
    } else {
      setScore((prev) => Math.max(prev - 25, 0));
      setStreak(0);
    }

    // Update highest streak if necessary
    setHighestStreak((prev) =>
      streak + (isCorrect ? 1 : 0) > prev ? streak + (isCorrect ? 1 : 0) : prev
    );

    checkGameCompletion();
  };

  // Function: Allow Drop
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Function: Handle Play Again
  const handlePlayAgain = () => {
    setShowResult(false);
    setShowInteract(false);
    setShowContentInteract(true);
    setScore(0);
    setTotal(0);
    setStreak(0);
    setHighestStreak(0);
    setCorrectCount(0);
    setUniqueAnswers([]);
    setDroppedQuestions([]); // Reset dropped questions
    setShowPlayAgain(false);
    localStorage.removeItem("points");
    localStorage.removeItem("streak");
    // Reinitialize the game
    initiateGame(responseData);
  };

  // Function: Handle Continue (Challenge)
  const handleContinue = () => {
    window.location.href = `challenge`;
  };

  // Function: Save Quiz Data to Firestore
  const saveQuizData = async (
    currentScore,
    currentHighestStreak,
    currentQuestions,
    userId
  ) => {
    const firestore = getFirestore();
    const userDocRef = doc(db, `user_history/${userId}`);

    let originalQuestions = [];
    if (id.includes("challenge")) {
      // Retrieve original questions from localStorage
      const storedOriginalQuestions = localStorage.getItem("originalQuestions");
      if (storedOriginalQuestions) {
        originalQuestions = JSON.parse(storedOriginalQuestions);
      }
    }

    const data = {
      score: currentScore,
      originalQuestions: originalQuestions.map((question) => ({
        userAnswer: question.UserAnswer || "N/A",
        question: question.properties.Name.title[0].plain_text || "N/A",
        correctAnswer:
          question.properties.Answer_Content.formula.string || "N/A",
        source: "Multiple Choices",
      })),
      highestStreak: currentHighestStreak,
      questions: currentQuestions,
      userId: userId,
      id: id,
      type: "Drag and Drop",
      tag: id.includes("challenge") ? "Challenge" : "Practices",
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(
        collection(
          userDocRef,
          id.includes("challenge") ? "challenge" : "practices"
        ),
        data
      );
      console.log("Quiz attempt saved for user:", userId);
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  // Function: Check Game Completion
  const checkGameCompletion = () => {
    console.log("Dropped Questions:", droppedQuestions.length);
    console.log("Total Matching Pairs:", totalMatchingPairs);

    if (droppedQuestions.length === totalMatchingPairs - 1) {
      setShowResult(true);
      setShowContentInteract(false);
      setGameCompleted(true);
      if (id.includes("challenge")) {
        setShowInteract(true);
      } else {
        setShowPlayAgain(true);
      }
      // Save quiz data
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        saveQuizData(score, highestStreak, questions, userId);
      }
    }
  };

  // Function: Check Streak (Used inside saveQuizData)
  const checkStreak = async (userId) => {
    const firestore = getFirestore();
    const streakRef = doc(firestore, "streaks", userId);
    try {
      const docSnapshot = await getDoc(streakRef);
      if (docSnapshot.exists()) {
        const { streakCheck, streakCnt } = docSnapshot.data();
        if (!streakCheck) {
          await updateDoc(streakRef, {
            streakCheck: true,
            streakCnt: streakCnt + 1,
            lastUpdated: Timestamp.now(),
          });
        } else {
          await updateDoc(streakRef, {
            lastUpdated: Timestamp.now(),
          });
        }
      } else {
        const userStreakData = {
          streakCnt: 1,
          streakCheck: true,
          lastUpdated: Timestamp.now(),
        };
        await setDoc(streakRef, userStreakData);
      }
    } catch (error) {
      console.error("Error checking streak:", error);
    }
  };

  // Rendering Draggable Items
  const renderDraggableItems = () => {
    return uniqueAnswers.map((answer, index) => (
      <div
        key={index}
        className="draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, answer)}
        onTouchStart={(e) => handleTouchStart(e, answer)} // Add touch handler
      >
        {answer}
      </div>
    ));
  };

  // Rendering Matching Pairs
  const renderMatchingPairs = () => {
    return questions.map((question, index) => (
      <div key={index} className="matching-pair">
        {question.Q.startsWith("http://") ||
        question.Q.startsWith("https://") ||
        question.Q.startsWith("data:") ? (
          <span
            className="label"
            style={{
              backgroundImage: `url(${question.Q})`,
            }}
          ></span>
        ) : (
          <span className="label"dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(question.Q, {
              ALLOWED_TAGS: ["small", "b", "i", "strong", "em"], // Add safe tags here
              ALLOWED_ATTR: [], // Restrict attributes if necessary
            }),
          }}
        ></span>
        )}
        <span
          className={`droppable ${question.dropped ? "dropped" : ""}`} // Conditionally add the 'dropped' class
          data-answer={question.answer}
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, question.answer, index)} // pass index to handleDrop
          onTouchEnd={(e) => handleTouchEnd(e, question.answer, index)} // Add touch end handler
        >
          {/* If already dropped, show the answer */}
          {question.dropped && <span>{question.answer}</span>}
        </span>
      </div>
    ));
  };
  useEffect(() => {
    if (gameCompleted) {
      const speed = 10; // Adjust speed of animation
      const targetPercentage = (correctCount / total) * 100;

      let progressStartValue = 0;

      const progressInterval = setInterval(() => {
        if (progressStartValue < targetPercentage) {
          progressStartValue++;
          setProgress(progressStartValue);
        } else {
          clearInterval(progressInterval);
        }
      }, speed);

      return () => clearInterval(progressInterval);
    }
  }, [gameCompleted, correctCount, total]);

  // Rendering Result Section
  const renderResult = () => {
    return (
      <div className="result_shower">
        <h1>You Achieved</h1>
        <div className="result_content">
          <div className="percentage-result">
            <div
              className="circular-progress"
              style={{
                background: `conic-gradient(#3fbd00 ${
                  progress * 3.6
                }deg, #ededed 0deg)`,
              }}
            >
              <span className="circular-value">{progress}%</span>
            </div>
          </div>
          <div className="point-result">
            <div className="score-points">Your Score: {score}</div>
            <div className="max-streak">
              Best Streak this run: {highestStreak}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Rendering Interact Section
  const renderInteract = () => {
    return (
      <div className="interact">
        <button id="challenge__continue" onClick={handleContinue}>
          Finish
        </button>
      </div>
    );
  };

  // Rendering Content Interact Section
  const renderContentInteract = () => {
    return (
      <div className="content_interact">
        <section className="draggable-items">{renderDraggableItems()}</section>
        <section className="matching-pairs">{renderMatchingPairs()}</section>
      </div>
    );
  };

  // Conditional Rendering for Loading State
  if (loading) {
    return (
      <>
        {/* <TopNav/> */}
        <div class="drag_content">
          <section class="score">
            <div class="score_right">
              <h1 class="left_score">Right Tries</h1>
              <span class="correct">0</span>
            </div>
            <div class="score_right">
              <h1 class="right_score">Total Tries</h1>
              <span class="total">0</span>
            </div>
            <button id="play-again-btn">Play Again</button>
          </section>
          <div class="content_interact">
            <section class="draggable-items"></section>
            <section class="matching-pairs">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </section>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hobbies - Matching</title>
      </Head>
      <main className="dragdropMain">
      {/* <TopNav/> */}
              {/* NAVIGATION PANEL */}
              {!id.includes("challenge") && !ht2.includes(id) && (
        <div className="nav-panel">
          <p className="nav-panel__navigation">
            <Link href="/cate?topic=folia-language" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">{categoryName}</span> &gt; Topic:
            <span className="topic">{topicName}</span>
          </p>
          <h3 className="nav-panel__main-title">Drag&amp;Drop</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`vocabularies?topic=${id}`}
              className="nav-panel__game-list__game-item vocabulary-link"
            >
              <i className="fa-solid fa-a" />
              <p>Vocabulary</p>
            </Link>
            <Link
              href={`/multichoicesFT?topic=${id}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Multiple Choices</p>
            </Link>
            <Link
              href={`flashcard?topic=${id}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-images" />
              <p>FlashCard</p>
            </Link>
            <Link
              href={`/arrange?topic=${id}`}
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
              href={`fillblank?topic=${id}`}
              className="nav-panel__game-list__game-item fillblank-link"
            >
              <i className="fa-solid fa-pen" />
              <p>Fill The Blank</p>
            </Link>
          </div>
        </div>
        )
}
      <div className="drag_content">
        {/* Score Section */}
        <section className="score">
          <div className="score_right">
            <h1 className="left_score">
              {id.includes("challenge") ? "Points" : "Right Tries"}
            </h1>
            <span className="correct">
              {id.includes("challenge") ? score : correctCount}
            </span>
          </div>
          <div className="score_right">
            <h1 className="right_score">
              {id.includes("challenge") ? "Streak" : "Total Tries"}
            </h1>
            <span className="total">
              {id.includes("challenge") ? streak : total}
            </span>
          </div>
          {!id.includes("challenge") && (
            <button
              id="play-again-btn"
              style={{
                display: showPlayAgain ? "block" : "none", // Control visibility based on state
                opacity: showPlayAgain ? "1" : "0",
              }}
              onClick={handlePlayAgain}
            >
              Play Again
            </button>
          )}
        </section>

        {/* Content Interact */}
        {showContentInteract && renderContentInteract()}

        {/* Result Section */}
        {showResult && renderResult()}

        {/* Interact Section (Only for Challenges) */}
        {showInteract && renderInteract()}
      </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}

// return (
//   <>
//   <Head>
//   <meta charSet="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// <title>Hobbies - Matching</title>
//   </Head>
//   <TopNav/>
//   <div className="drag_content">
//   <section className="score">
//     <div className="score_right">
//       <h1 className="left_score">Right Tries</h1>
//       <span className="correct">0</span>
//     </div>
//     <div className="score_right">
//       <h1 className="right_score">Total Tries</h1>
//       <span className="total">0</span>
//     </div>
//     <button id="play-again-btn">Play Again</button>
//   </section>
//   <div className="spinner-border" role="status">
//     <span className="visually-hidden">Loading...</span>
//   </div>
//   <div className="content_interact">
//     <section className="draggable-items">
//       {/* Will be dynamically populated - Example Element: */}
//       {/* <div class="draggable" draggable="true">ABCD</div> */}
//     </section>
//     <section className="matching-pairs">
//       {/* Will be dynamically populated - Example Element: */}
//       {/* <div class="matching-pair">
//   <span class="label"><img src="img/Rectangle 1694.png" alt=""></span>
//   <span class="droppable" data-answer="ABCD"></span>
// </div> */}
//     </section>
//   </div>
//   <div className="result_shower">
//     <h1>You Archived</h1>
//     <div className="result_content">
//       <div className="percentage-result">
//         <div className="circular-progress">
//           <span className="circular-value">0%</span>
//         </div>
//       </div>
//       <div className="point-result">
//         <div className="score-points" />
//         <div className="max-streak" />
//       </div>
//     </div>
//   </div>
//   <div className="interact">
//     <button id="challenge__continue">Finish</button>
//   </div>
// </div>

// <Footer/>
//   </>
// )}
