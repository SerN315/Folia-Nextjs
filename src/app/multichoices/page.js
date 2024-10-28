"use client";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/multi.scss";
import { getDatabase } from "../js/api/databaseAPI";
import { db, auth } from "../firebase/authenciation";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { update } from "firebase/database";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MultiQ() {
  const [showResult, setShowResult] = useState(false);
  const serachParams = useSearchParams();
  const id = serachParams.get("topic");
  const idd = serachParams.get("id");
  const tag = serachParams.get("tag");
  const catesID = serachParams.get("cateID");
  const categoryID = catesID?.split(",");
  const [choicesDisabled, setChoicesDisabled] = useState(false);
  const [timeBonus,setTimeBonus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInteract, setShowInteract] = useState(false);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [originalFetch, setOriginalFetch] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [feedbackClass, setFeedbackClass] = useState('');
  const [highestStreak, setHighestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // For the timer
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For selected answer
  const [timer, setTimer] = useState(null); // Initialize timer
  const [isShowing, setShowing] = useState(false);
  const [isFinish, setFinish] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0); // For the progress bar
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const total = originalQuestions.length; // Total questions

  const handleContinue = () => {
    window.location.href = `dragdrop?topic=${id}&id=${idd}`;
  };
  let codelabid = [
    "602c19aa0a48437aa38b322e5863d7b6",
    "9b15c0bb39e4484a95cb054040485d0c",
    "8b5d55aff1be4580b23e4e34142c7d09",
    "aac0459b84bf48019510a8f2c73f7eab",
    "3dc16a1a73064fdf8b4c1b199077383e",
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Fetch data based on the ID
  function fetchDatas() {
    if (!codelabid.includes(id) && id.includes("challenge")) {
        getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
            filter: {
                property: "challenge",
                relation: {
                    contains: idd,
                },
            },
        }).then((response) => {
            const shuffledQuestions = shuffleArray([...response]); // Shuffle the questions
            setOriginalFetch(shuffledQuestions);
            const questions = shuffledQuestions.slice(0, 10); // Select the first 10 questions
            setOriginalQuestions(questions);
            setLoading(false);
            startTimer();
            // localStorage.setItem("originalQuestions", JSON.stringify(originalQuestions));
        });
    } else if (!codelabid.includes(id) && !id.includes("challenge")) {
        getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
            filter: {
                property: "topic",
                relation: {
                    contains: id,
                },
            },
        }).then((response) => {
            const shuffledQuestions = shuffleArray([...response]); // Shuffle the questions
            setOriginalFetch(shuffledQuestions);
            const questions = shuffledQuestions.slice(0, 10); // Select the first 10 questions
            setOriginalQuestions(questions);
            startTimer();
            setLoading(false);
        });
    } else if (codelabid.includes(id)) {
        getDatabase(id, {
            filter: {
                property: "tags",
                multi_select: {
                    contains: tag,
                },
            },
        }).then((response) => {
            const shuffledQuestions = shuffleArray([...response]); // Shuffle the questions
            setOriginalFetch(shuffledQuestions);
            const questions = shuffledQuestions.slice(0, 10); // Select the first 10 questions
            setLoading(false);
            startTimer();
            setOriginalQuestions(questions);
        });
    }
}

  useEffect(() => {
    // console.log("Component mounted, calling fetchData...");
    fetchDatas(); // Ensure this runs only once when the component mounts
}, []); // Empty dependency array to avoid multiple fetches

function redoQuiz() {
  setShowInteract(false);
  setShowResult(false);
  // Reset the current index and score parameters
  setCurrentIndex(0);
  setScore(0);
  setStreak(0);
  setPoints(0);
  setProgress(0);
  setCorrectCount(0);
  
  // Slice the last 10 questions from originalQuestions
  const lastQuestions = originalQuestions.slice(-10); // Get last 10 questions
  setOriginalQuestions(lastQuestions); // Update to only the last questions
  setFinish(false); // Reset finish state to false
  renderQuestion(); // Call renderQuestion to display the questions
}

function restartQuiz() {
  setProgress(0);
  setShowInteract(false);
  setShowResult(false);
  setScore(0);
  setStreak(0);
  setPoints(0);
  setLoading(false); // Set loading state to true
  setCorrectCount(0);

  // Fetch new questions (10 more random questions from the originalQuestions)
  const newQuestions = getRandomQuestions(originalFetch, 10); // You will need to implement this function
  setOriginalQuestions(newQuestions); // Update the state with the new questions

  // Reset the progress and current index
  setCurrentIndex(0);
  setProgressWidth(0);
  setFinish(false); // Reset finish state to false
  renderQuestion(); // Call renderQuestion to display the new questions
}

function getRandomQuestions(questionsArray, count) {
  const shuffled = questionsArray.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffled.slice(0, count); // Return the first 'count' number of questions
}

  function startTimer() {
    clearInterval(timer);
    setTimeLeft(10);
    const newTimer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(newTimer);
          handleTimeUp();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
    setTimer(newTimer);
  }

function handleTimeUp() {
    // Get the correct answer for the current question
    const correctAnswer = originalQuestions[currentIndex]?.properties?.Answer?.rich_text[0]?.text.content || properties?.correct?.rich_text[0]?.text.content ;

    // Reset streak if no answer is selected
    setStreak(0);
    setTimeBonus(0);
    setChoicesDisabled(true);

    // Store the user's answer
    setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        correctAnswer, // Storing the correct answer
    ]);

    // Use a timeout to allow the UI to render before applying the class
    setTimeout(() => {
        // Find the correct answer element and add the 'correct-answer' class
        const correctChoiceElement = document.querySelector(`[data-answer="${correctAnswer}"]`);
        if (correctChoiceElement) {
            correctChoiceElement.classList.add("correct-answer");
        }

        // Show the correct answer briefly before moving to the next question
        setTimeout(() => {
            setShowing(true); // Show the next button
            if (correctChoiceElement) {
                correctChoiceElement.classList.remove("correct-answer");
            }
        }, 3000); // Adjust delay for how long to show the correct answer
    }, 100); // Small delay to ensure the DOM updates
}


function handleNextQuestion() {
  setTimeBonus(0);
  startTimer();
  setShowing(false);
  setSelectedAnswer(null); // Reset selected answer
  setFeedbackClass(""); // Remove any previous feedback class
  setChoicesDisabled(false);
  if (currentIndex < total - 1) {
      // If not the last question, increment the index
      setCurrentIndex((prevIndex) => prevIndex + 1);
      // Calculate and set progress width based on the current index
      setProgressWidth(((currentIndex + 1) / total) * 100);
  } else {
      // If it's the last question, set progress to 100%
      setProgressWidth(100);
      setFinish(true);
      handleCompletion();
  }
}
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
            <div className="score-points">Your Score: {points}</div>
            <div className="max-streak">
              Best Streak this run: {highestStreak}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderInteract = () => {
    return (
      <div className="interact">
        {/* Render these buttons only when id does NOT include "challenge" */}
        {!id.includes("challenge") && (
          <>
            <button id="restartButton" onClick={restartQuiz}>
              New Questions
            </button>
            <button id="redoButton" onClick={redoQuiz}>
              Try Again
            </button>
            <button id="return" onClick={() => window.history.back()}>
              Return To Select Page
            </button>
          </>
        )}
        {/* Render the Continue button only when id includes "challenge" */}
        {id.includes("challenge") && (
          <button id="challenge__continue" onClick={handleContinue}>
            Continue
          </button>
        )}
      </div>
    );
  };
  
  

  function handleCompletion() {
    clearInterval(timer);
    setShowInteract(true);
    setShowResult(true);
    if (id.includes("challenge")){
    // Store points and streak in local storage or process further as needed
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("streak", JSON.stringify(streak));
    localStorage.setItem("originalQuestions", JSON.stringify(originalQuestions))
    }
    else if(!id.includes("challenge")) {
    saveQuizData(points, highestStreak, originalQuestions, userAnswers, currentIndex);
    }
  }

  function handleAnswer(selectedAnswer,correctAnswer) {
    // Stop the timer immediately when the user answers
    clearInterval(timer);
    console.log(correctAnswer);
  
    // Provide immediate visual feedback
    const isCorrect = selectedAnswer === correctAnswer;
    setFeedbackClass(isCorrect ? "correct-answer" : "incorrect-answer");
      // Disable choices
      setChoicesDisabled(true);
    // Set the flag to show the correct answer
    setShowCorrectAnswer(true);

    setOriginalQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentIndex
          ? { ...question, UserAnswer: selectedAnswer }
          : question
      )
    );

    if (isCorrect) {
      setCorrectCount(prevCount => {const newCount = prevCount + 1;return newCount;
      })
      let timeBonus = Math.floor((timeLeft / 2) * 10);
      // console.log("Time left for bonus calculation:", timeLeft); // Log time left for debugging
      // console.log("Calculated time bonus:", timeBonus); // Log calculated bonus
      
      // Update states
      setTimeBonus(timeBonus);
      setScore(prevScore => {
          const newScore = prevScore + 50; // Increment score
          // console.log("Score updated to:", newScore); // Log updated score
          return newScore;
      });
      setStreak(prevStreak => {
          const newStreak = prevStreak + 1;
          // console.log("Streak updated to:", newStreak); // Log updated streak
          if (newStreak > highestStreak) {
              setHighestStreak(newStreak);
              // console.log("Highest streak updated to:", newStreak);
          }
          return newStreak;
      });
      setPoints(prevPoints => {
          const newPoints = prevPoints + 50 + timeBonus;
          // console.log("Points updated to:", newPoints); // Log updated points
          return newPoints;
      });
  } else {
      // If the answer is incorrect
      // console.log("Incorrect answer. Resetting score and streak.");
      setTimeBonus(0);
      setScore(0);
      setStreak(0);
  }

  // Store the user's answer
  setUserAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers, selectedAnswer]; // Storing selected answer
      console.log("User Answers updated to:", updatedAnswers); // Log updated user answers
      return updatedAnswers;

  });
  
  
    // Delay for showing the next button and highlighting correct answer
    setTimeout(() => {
        setShowing(true); // Show next button
        setShowCorrectAnswer(false);
    }, 1000); // Adjust delay as needed
}

useEffect(() => {
  // console.log("Updated Score:", score);
  // console.log("Updated Time Bonus:", timeBonus);
  // console.log("Updated Streak:", streak);
}, [score, timeBonus, streak]);


function renderQuestion() {
  const item = originalQuestions[currentIndex];
  const img = item.properties.Img?.files[0]?.file.url || item.properties.img?.rich_text[0] || null;
  const Q =
      item.properties.Name.title[0]?.text.content ||
      item.properties.question.rich_text[0]?.text.content;

  const correctAnswer = item.properties.Answer.rich_text[0]?.text.content || item.properties.correct.rich_text[0].text.content;
  const answerContent = item.properties.Answer_Content.formula.string;

  // Create answer options, only including those that have content
  const answerOptions = ["A", "B", "C", "D", "E"].reduce((acc, option) => {
      const content = item.properties[option]?.rich_text[0]?.text.content;
      if (content) {
          acc.push({ letter: option, content });
      }
      return acc;
  }, []);

  return (
      <div className="multiChoice">
          <div className="questionno">
              <h2>
                  Q<span className="qid">{currentIndex + 1}</span>:
              </h2>
          </div>
          <div className="Q-content">
              <h3>
              {img && (<img src={img} alt="Question-related image"></img>)}
              <br></br>
                {Q}</h3>
          </div>
          <div className="choices">
              <ul>
                  {answerOptions.map(({ letter, content }) => {
                      // Determine the class based on selected answer and correct answer
                      const isSelected = selectedAnswer === letter;
                      const isCorrect = letter === correctAnswer;

                      let className = "choice";
                      // If the user has selected an answer, adjust the classes accordingly
                      if (showCorrectAnswer) {
                          if (isSelected && isCorrect) {
                              className += " correct-answer"; // User selected correct answer
                          } else if (isSelected && !isCorrect) {
                              className += " incorrect-answer"; // User selected incorrect answer
                          }  
                          if (!isSelected && isCorrect) {
                            className += " correct-answer";  // Highlight the correct answer if wrong one was chosen
                        }
                      }

                      return (
                          <li
                              className={className} 
                              style={{
                                pointerEvents: choicesDisabled ? "none" : "",
                            }}
                              key={letter}
                              data-answer={letter}
                              onClick={() => {
                                  if (!choicesDisabled && !selectedAnswer) {
                                      // Only allow one selection
                                      setSelectedAnswer(letter);
                                      handleAnswer(content, answerContent);
                                  }
                              }}
                          >
                              <label>
                                  <span>{content}</span>
                              </label>
                          </li>
                      );
                  })}
              </ul>
          </div>
          <button
              id="nextB"
              className="nextButton"
              style={{
                  opacity: isShowing ? "1" : "0",
                  pointerEvents: isShowing ? "" : "none",
              }}
              onClick={handleNextQuestion}
          >
              Next
          </button>
      </div>
  );
}



useEffect(() => {
  if (isFinish) {
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
}, [isFinish, correctCount, total]);  


async function saveQuizData(
  points,
  highestStreak,
  originalQuestions,
  userAnswers, // This should now contain the user's selected answers
  currentIndex
) {
  const userIdFromAuth = auth.currentUser?.uid; // Get the current user's ID

  // Check if user is logged in
  if (!userIdFromAuth) {
    console.log("User is not logged in. Quiz data will not be saved.");
    return; // Exit the function if the user is not logged in
  }

  try {
    // Gather the answered questions data
    const answeredQuestions = originalQuestions.slice(0, currentIndex).map((question, index) => {
      const questionText = question.properties.Name.title[0]?.text.content ||
        question.properties.question.rich_text[0]?.text.content;

      const correctAnswer = question.properties.Answer_Content.formula.string ||
      question.properties.correct.rich_text[0].text.content 

      // Get user's answer content based on the selected index in userAnswers
      const userAnswer = userAnswers[index] || "No Answer"; // Get user's answer or set default

      return {
        question: questionText,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        sources:"Multiple Choices",
      };
    });

    // Prepare the data to save
    const data = {
      points: points,
      highestStreak: highestStreak,
      questions: answeredQuestions,
      userId: userIdFromAuth, // Use the user ID from authentication
      timestamp: serverTimestamp(),
      type: "Multiple Choices",
    };

    // Save data to Firestore in user-specific collection
    const userDocRef = doc(db, `user_history/${userIdFromAuth}`);
    const docRef = await addDoc(collection(userDocRef,"practices"), data);
    console.log("Document written with ID: ", userDocRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}





  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Add API to call for topic's name */}
        <title>English - Multiple Choice</title>
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        {/* GG analytics */}
      </Head>
      {/* <TopNav/> */}
      <div className="main_content">
        <div className="background" />
        <div className="progress_bar">
        <div className="indicator" style={{ width: `${progressWidth}%` }} />
        </div>
        <div className="limiters">
          <div className="timer" style={{
            display: !isFinish ? "flex" : "none",
          }}>
            <i className="fa-solid fa-clock" />
            <div id="timerText"  />
            {timeLeft}
          </div>
          
          <div className="point" style={{
            opacity: !isFinish && isShowing ? "1" : "0",
          }}>
            
            <div className="correct-point">
              <i className="fa-solid fa-check" />
              <div id="points" />
              {score}
            </div>
            <hr />
            <div className="bonus-point">
              <i className="fa-solid fa-clock" />
              <div id="bonus" />
              {timeBonus}
            </div>
          </div>
          <div className="streak" style={{
              display: !isFinish ? "flex" : "none",
            }}>
            <i className="fa-solid fa-fire" />
            <div id="streak" 
             />
            {streak}
          </div>
        </div>
        <div className="timeAttack">
          {loading ? (
            <div className="multiChoice">
              <div className="questionno-skeleton">
                <h2>
                  <span className="qid" />:
                </h2>
              </div>
              <div className="Q-content-skeleton">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div className="choices">
                <ul>
                  <li id="choice-skeleton">
                    <label>
                      <input
                        type="radio"
                        name="question${
            1
          }"
                        defaultValue="A"
                      />
                      <span>
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </label>
                  </li>
                  <li id="choice-skeleton">
                    <label>
                      <input
                        type="radio"
                        name="question${
            1
          }"
                        defaultValue="B"
                      />
                      <span>
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </label>
                  </li>
                  <li id="choice-skeleton">
                    <label>
                      <input
                        type="radio"
                        name="question${
            1
          }"
                        defaultValue="C"
                      />
                      <span>
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </label>
                  </li>
                  <li id="choice-skeleton">
                    <label>
                      <input
                        type="radio"
                        name="question${
            1
          }"
                        defaultValue="D"
                      />
                      <span>
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            !isFinish && renderQuestion()
          )}
        </div>
        {showResult && !id.includes("challenge") && renderResult()}
      </div>
      {showInteract && renderInteract()}
      {/* <div id="Timer">adafa</div> */}
      {/* <Footer /> */}
    </>
  );
}
