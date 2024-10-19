'use client'
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/multi.scss";
import { getDatabase } from "../js/api/databaseAPI";
import { db,auth } from "../firebase/authenciation";
import { useSearchParams } from "next/navigation";

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

export default function MultiQ() {
  const searchPram = useSearchParams();
  const id = searchPram.get("topic")
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // For the timer
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For selected answer
  const [timer, setTimer] = useState(null); // Initialize timer
  const [progressWidth, setProgressWidth] = useState(0); // For the progress bar

  // Simulating the values that might be passed or fetched
  // const id = "challenge_1"; // Assume you get this from somewhere in your app
  let codelabid = [
    "602c19aa0a48437aa38b322e5863d7b6",
    "9b15c0bb39e4484a95cb054040485d0c",
    "8b5d55aff1be4580b23e4e34142c7d09",
    "aac0459b84bf48019510a8f2c73f7eab",
    "3dc16a1a73064fdf8b4c1b199077383e",
  ];
  // const tag = "exampleTag"; // Simulating a tag to filter questions

  // Fetch data based on the ID
  function fetchData() {
    if (!codelabid.includes(id) && id.includes("challenge")) {
      getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
        filter: {
          property: "challenge",
          relation: {
            contains: id,
          },
        },
      }).then((response) => {
        const questions = [...response].slice(0, 10);
        setOriginalQuestions(questions);
        showQuestion(0, Math.min(10, questions.length));
        localStorage.setItem("originalQuestions", JSON.stringify(questions));
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
        const shuffledQuestions = shuffleArray([...response]);
        setOriginalQuestions(shuffledQuestions);
        showQuestion(0, Math.min(10, shuffledQuestions.length));
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
        const shuffledQuestions = shuffleArray([...response]);
        setOriginalQuestions(shuffledQuestions);
        showQuestion(0, Math.min(10, shuffledQuestions.length));
      });
    }
  }

  function redoQuiz(questions) {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setPoints(0);
    const lastQuestions = questions.slice(-10); // Get last 10 questions
    showQuestion(0, lastQuestions.length, lastQuestions);
  }

  function showQuestion(index, maxquestion) {
    if (index >= maxquestion) {
      if (id.includes("challenge")) {
        document.getElementById("challenge__continue").style.display = "block";
        document.querySelector(".result_shower").style.display = "none";
        localStorage.setItem("points", JSON.stringify(points));
        localStorage.setItem("streak", JSON.stringify(streak));
      } else {
        // Handle the non-challenge case
        document.querySelectorAll(".multiChoice").forEach(el => el.style.display = "none");
        document.getElementById("redoButton").style.display = "block";
        document.getElementById("restartButton").style.display = "block";
        document.querySelector(".result_shower").style.display = "block";
  
        const storedScore = localStorage.getItem("points");
  
        if (storedScore && points > parseInt(storedScore)) {
          // Optionally append "New Record"
        }
  
        if (!storedScore || points > parseInt(storedScore)) {
          localStorage.setItem("points", points);
        }
      }
  
      let progressStartValue = -1;
      const speed = 10;
      let percentage = (score / maxquestion) * 100;
  
      if (!isNaN(percentage)) {
        let progress = setInterval(() => {
          progressStartValue++;
          document.querySelector(".circular-value").textContent = `${progressStartValue}%`;
          document.querySelector(".circular-progress").style.background =
            `conic-gradient(#3fbd00 ${progressStartValue * 3.6}deg, #ededed 0deg)`;
  
          if (progressStartValue === percentage) {
            clearInterval(progress);
          }
        }, speed);
  
        const userId = auth.currentUser.uid;
        saveQuizData(points, highestStreak, originalQuestions, userId);
      }
  
      document.querySelector(".indicator").style.width = "100%";
      document.querySelector(".score-points").textContent = `Your Score: ${points}`;
      document.querySelector(".max-streak").textContent = `Best Streak this run: ${highestStreak}`;
      document.querySelector(".timer").style.display = "none";
      document.querySelector(".streak").style.display = "none";
      document.querySelector(".point").style.display = "none";
  
      console.log(userAnswers);
      console.log("quiz finish", score);
      console.log(percentage);
      console.log(streak);
      return;
    }
  
    // Fetch question data
    const item = originalQuestions[index];
    const img = item.properties.Img?.files[0]?.file.url || null;
    const Q = item.properties.Name.title[0]?.text.content || '';
    const A = item.properties.A.rich_text[0]?.text.content || '';
    const B = item.properties.B.rich_text[0]?.text.content || '';
    const C = item.properties.C.rich_text[0]?.text.content || '';
    const D = item.properties.D.rich_text[0]?.text.content || '';
    const answer = item.properties.Answer.rich_text[0]?.text.content || '';
  
    // Construct the question HTML
    let multiQ = `
      <div class="multiChoice" style="opacity: 0; width: 0;">
        <div class="questionno">
          <h2>Q<span class="qid">${index + 1}</span>:</h2>
        </div>
        <div class="Q-content">
          <h3>${img ? `<img src="${img}" alt="image"><br>${Q}` : Q}</h3>
        </div>
        <div class="choices">
          <ul>
            <li class="choice">
              <label><input type="radio" name="question${index + 1}" value="A" />
                <span>${A}</span></label>
            </li>
            <li class="choice">
              <label><input type="radio" name="question${index + 1}" value="B" />
                <span>${B}</span></label>
            </li>
            <li class="choice">
              <label><input type="radio" name="question${index + 1}" value="C" />
                <span>${C}</span></label>
            </li>
            <li class="choice">
              <label><input type="radio" name="question${index + 1}" value="D" />
                <span>${D}</span></label>
            </li>
          </ul>
        </div>
        <button id="nextB" class="nextButton" disabled>Next</button>
      </div>`;
  
    document.querySelector(".timeAttack").innerHTML = multiQ;
  
    // Animate showing the question
    const multiChoiceEl = document.querySelector(".multiChoice");
    multiChoiceEl.style.opacity = 1;
    multiChoiceEl.style.width = "100%";
  
    // Set up answer handling
    document.querySelectorAll(`.choice input[name="question${index + 1}"]`).forEach(input => {
      input.addEventListener("change", () => {
        handleAnswer(index, answer);
      });
    });
  
    // Next button event
    document.getElementById("nextB").addEventListener("click", () => {
      handleNextButton(index, maxquestion);
    });
  
    startTimer();
    document.querySelector(".point").style.display = "none";
  }

  
  function handleAnswer(correctAnswer) {
    clearInterval(timer); // Stop the timer
    let timeBonus = Math.floor((timeLeft / 2) * 10);

    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
      setPoints((prevPoints) => prevPoints + 50 + timeBonus);
      if (streak + 1 > highestStreak) {
        setHighestStreak(streak + 1);
      }
    } else {
      setStreak(0);
    }

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      originalQuestions[currentIndex].properties.Answer.rich_text[0].text.content,
    ]);
    // Enable next button
    document.getElementById("nextB").disabled = false;
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
    const correctAnswer = originalQuestions[currentIndex]?.properties?.Answer?.rich_text[0]?.text?.content;
    if (!selectedAnswer) {
      setStreak(0);
    }

    // Enable next button
    document.getElementById("nextB").disabled = false;
  }

  function handleNextButton(maxQuestions) {
    const newProgress = (progressWidth + 10) % 100;
    setProgressWidth(newProgress);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      showQuestion(currentIndex + 1, maxQuestions);
    }, 500);

    document.getElementById("nextB").disabled = true;
  }

  function showQuestion(index, maxQuestions) {
    if (index >= maxQuestions) return;

    // Reset selected answer
    setSelectedAnswer(null);
    startTimer();
  }

  useEffect(() => {
    fetchData();
  }, []);



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
  <TopNav/>
  <div className="main_content">
    <div className="background" />
    <div className="progress_bar">
      <div className="indicator" />
    </div>
    <div className="limiters">
      <div className="timer">
        <i className="fa-solid fa-clock" />
        <div id="timerText" />
      </div>
      <div className="point">
        <div className="correct-point">
          <i className="fa-solid fa-check" />
          <div id="points" />
        </div>
        <hr />
        <div className="bonus-point">
          <i className="fa-solid fa-fire" />
          <div id="bonus" />
        </div>
      </div>
      <div className="streak">
        <i className="fa-solid fa-fire" />
        <div id="streak" />
      </div>
    </div>
    <div className="timeAttack">
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
    </div>
    <div className="result_shower">
      <h1>You Archived</h1>
      <div className="result_content">
        <div className="percentage-result">
          <div className="circular-progress">
            <span className="circular-value">0%</span>
          </div>
        </div>
        <div className="point-result">
          <div className="score-points" />
          <div className="max-streak" />
        </div>
      </div>
    </div>
  </div>
  <div className="interact">
    <button id="restartButton">New Questions</button>
    <button id="redoButton">Try Again</button>
    <button id="challenge__continue">Continue</button>
    {/* <button id="nextB" class="nextButton" disabled>Next</button> */}
  </div>
  {/* <div id="Timer">adafa</div> */}
  <Footer/>
    </>
  )}