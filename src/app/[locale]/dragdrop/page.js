"use client";
import Link from "next/link";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/d_and_d.scss";
import { useEffect, useState } from "react";
import { auth } from "../firebase/authenciation";
import { onAuthStateChanged } from "../firebase/authenciation";
import DOMPurify from "dompurify";
import { getCookie } from "../js/cookie";
import { useSearchParams } from "next/navigation";
import { getTopicFlashcards } from "../js/api/foliaAPI";
// TODO Step 2: streak via /api/folia/streaks/:userId, practice history via /api/folia/history/practices


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

  // TODO Step 2: streak update via POST /api/folia/streaks/:userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, [id]);

  // Effect: Fetch Data based on Topic or Challenge
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        let fetchedData = [];

        const response = await getTopicFlashcards(id);
        fetchedData = response.vocabs || [];

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
    const selectedQuestions = shuffledData
      .slice(0, totalMatchingPairs)
      .map((item) => ({
        Q: item.Img ?? "N/A",
        answer: item.Word ?? "N/A",
        dropped: false,
        source: "Drag and Drop",
      }));

    setQuestions(selectedQuestions);

    const uniqueAnswersArray = [...new Set(selectedQuestions.map((q) => q.answer))].sort(
      () => Math.random() - 0.5
    );
    setUniqueAnswers(uniqueAnswersArray);
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
  const saveQuizData = async (currentScore, currentHighestStreak, currentQuestions, userId) => {
    // TODO Step 2: save via POST /api/folia/history/practices
    console.log("Quiz complete — score:", currentScore, "userId:", userId);
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

  // TODO Step 2: checkStreak via POST /api/folia/streaks/:userId

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
              {!id.includes("challenge") && (
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
