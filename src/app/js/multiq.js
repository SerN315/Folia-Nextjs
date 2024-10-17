import { getDatabase } from "./api/databaseAPI";
import { db } from "../../src/app/firebase/authenciation.js";
import { auth } from "../../src/app/firebase/authenciation.js";

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

$(function () {
  fetch("_topNav")
    .then((response) => response.text())
    .then((html) => {
      $("#topNav")(html);
    });

  fetch("_footer")
    .then((response) => response.text())
    .then((html) => {
      $("#footer")(html);
    });
});

// FUNCTION TO CHECK STREAK AFTER PLAY A GAME
function checkStreak(userId) {
  const firestore = getFirestore();
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      const userid = auth.currentUser.uid;
      const streakRef = doc(firestore, "streaks", userid);
      getDoc(streakRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const check = docSnapshot.data().streakCheck;
          const count = docSnapshot.data().streakCnt;
          if (check == false) {
            updateDoc(streakRef, {
              streakCheck: true,
              streakCnt: count + 1,
              lastUpdated: Timestamp.now(),
            });
          } else {
            updateDoc(streakRef, {
              lastUpdated: Timestamp.now(),
            });
          }
        } else {
          const userStreakData = {
            streakCnt: 1,
            streakCheck: true,
            lastUpdated: Timestamp.now(),
          };
          setDoc(streakRef, userStreakData);
        }
      });
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let timer;
let timeLeft = 10; //
let streak = 0;
let score = 0;
let point = 0;
let points = 0;
let currentIndex = 0;
let highestStreak = 0; // Thêm biến highestStreak để lưu trữ streak cao nhất
let userAnswers = [];

function restartQuiz() {
  score = 0;
  streak = 0;
  points = 0;
  point = 0;
  let loading = `<div class="multiChoice">
  <div class="questionno-skeleton">
    <h2><span class="qid"></span>:</h2>
  </div>
  <div class="Q-content-skeleton">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </div>
  <div class="choices">
    <ul>
      <li id="choice-skeleton">
        <label><input type="radio" name="question${1}" value="A" />
          <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></label>
      </li>
      <li id="choice-skeleton">
        <label><input type="radio" name="question${1}" value="B" />
          <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></label>
      </li>
      <li id="choice-skeleton">
        <label><input type="radio" name="question${1}" value="C" />
          <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></label>
      </li>
      <li id="choice-skeleton">
        <label><input type="radio" name="question${1}" value="D" />
          <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></label>
      </li>
    </ul>
  </div>
</div>`;
  $(".timeAttack").empty().append(loading);
  setupQuiz();
  $(".indicator").width("0");
}

$("#restartButton").on("click", restartQuiz);
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("topic");
const idd = urlParams.get("id");
const tag = urlParams.get("tag");
const catesID = urlParams.get("cateID");
const categoryID = catesID?.split(",");
$("#challenge__continue").on("click", function () {
  window.location.href = `dragdrop?topic=${id}&id=${idd}`;
});
let originalQuestions = [];
let codelabid = [
  "602c19aa0a48437aa38b322e5863d7b6",
  "9b15c0bb39e4484a95cb054040485d0c",
  "8b5d55aff1be4580b23e4e34142c7d09",
  "aac0459b84bf48019510a8f2c73f7eab",
  "3dc16a1a73064fdf8b4c1b199077383e",
];
//Lay data ve
function fetchData() {
  if (!codelabid.includes(id) && id.includes("challenge")) {
    getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
      filter: {
        property: "challenge",
        relation: {
          contains: idd,
        },
        // property: "Category",
        // relation: {
        //   contains: categoryID,
        // },
      },
    }).then(async (response) => {
      console.log(response);
      originalQuestions = [...response].slice(0, 10); // Store the original order of questions
      console.log(originalQuestions);
      // shuffleArray(originalQuestions); // Shuffle the original questions once
      const maxquestion = Math.min(10, originalQuestions.length);
      showQuestion(currentIndex, maxquestion);

      $("#redoButton").on("click", function () {
        redoQuiz(originalQuestions);
      });
      localStorage.setItem(
        "originalQuestions",
        JSON.stringify(originalQuestions)
      );
    });
  }
  if (!codelabid.includes(id) && !id.includes("challenge")) {
    getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
      filter: {
        property: "topic",
        relation: {
          contains: id,
        },
      },
    }).then(async (response) => {
      console.log(response);
      originalQuestions = [...response]; // Store the original order of questions
      shuffleArray(originalQuestions); // Shuffle the original questions once
      const maxquestion = Math.min(10, originalQuestions.length);
      showQuestion(currentIndex, maxquestion);

      $("#redoButton").on("click", function () {
        redoQuiz(originalQuestions);
      });
    });
  }
  if (codelabid.includes(id)) {
    getDatabase(id, {
      filter: {
        property: "tags",
        multi_select: {
          contains: tag,
        },
      },
    }).then(async (response) => {
      console.log(response);
      originalQuestions = [...response]; // Store the original order of questions
      shuffleArray(originalQuestions); // Shuffle the original questions once
      const maxquestion = Math.min(10, originalQuestions.length);
      showQuestion(currentIndex, maxquestion);

      $("#redoButton").on("click", function () {
        redoQuiz(originalQuestions);
      });
    });
  }
}

function redoQuiz(originalQuestions) {
  currentIndex = 0;
  score = 0;
  streak = 0;
  points = 0;
  point = 0;

  // Show the last 10 questions without shuffling
  const lastQuestions = originalQuestions.slice(-10);

  // Show the first question
  showQuestion(currentIndex, lastQuestions.length, lastQuestions);

  // Reset progress indicator
  $(".indicator").css("width", "0");

  // Hide redo button and result display
  $(".multiChoice").show();
  $("#redoButton").hide();
  $(".timer").show();
  $(".streak").show();
  $("#restartButton").hide();
  $(".result_shower").hide();
  $("#challenge__continue").hide();
}

//Hien Cac cau hoi
function showQuestion(index, maxquestion) {
  if (index >= maxquestion) {
    if (id.includes("challenge")) {
      $("#challenge__continue").show();
      $(".result_shower").hide();
      // $(".main_content").css("height", "200px");
      localStorage.setItem("points", JSON.stringify(points));
      localStorage.setItem("streak", JSON.stringify(streak));
    } else if (!id.includes("challenge")) {
      $(".multiChoice").hide();
      $("#redoButton").show();
      $("#restartButton").show();
      $(".result_shower").show();
      // Retrieve the stored score from local storage
      const storedScore = localStorage.getItem("points");

      // Check if the stored score exists and compare it with the new score
      if (storedScore && points > parseInt(storedScore)) {
        // $(".result_shower").append("New Record");
      }

      // Update the stored score if the new score is greater
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
        $(".circular-value").text(`${progressStartValue}%`);
        $(".circular-progress").css(
          "background",
          `conic-gradient(#3fbd00 ${progressStartValue * 3.6}deg, #ededed 0deg)`
        );
        if (progressStartValue == percentage) {
          clearInterval(progress);
        }
      }, speed);
      const userId = auth.currentUser.uid;
      saveQuizData(points, highestStreak, originalQuestions, userId);
    }
    $(".indicator").animate({ width: "100%", borderRadius: "none" }, 1);
    $(".score-points").text(`Your Score: ${points}`);
    $(".max-streak").text(`Best Streak this run: ${highestStreak}`);
    $(".timer").hide();
    $(".streak").hide();
    $(".point").hide();
    console.log(userAnswers);
    console.log("quiz finish", score);
    console.log(percentage);
    console.log(streak);
    return;
  }
  if (!codelabid.includes(id) || id.includes("challenge")) {
    const item = originalQuestions[index];
    const img = item.properties.Img?.files[0]?.file.url;
    console.log(img);
    const Q = item.properties.Name.title[0]?.text.content;
    const A = item.properties.A.rich_text[0]?.text.content;
    const B = item.properties.B.rich_text[0]?.text.content;
    const C = item.properties.C.rich_text[0]?.text.content;
    const D = item.properties.D.rich_text[0]?.text.content;
    const answer = item.properties.Answer.rich_text[0].text.content;
    if (img != null) {
      let multiQ = `<div class="multiChoice" style="opacity: 0; width: 0;">
  <div class="questionno">
    <h2>Q<span class="qid">${index + 1}</span>:</h2>
  </div>
  <div class="Q-content">
    <h3><img src="${img}" alt="anh">
    <br>
    ${Q}</h3>
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
      $(".timeAttack").empty().append(multiQ);
    } else {
      let multiQ = `<div class="multiChoice" style="opacity: 0; width: 0;">
    <div class="questionno">
      <h2>Q<span class="qid">${index + 1}</span>:</h2>
    </div>
    <div class="Q-content">
      <h3>
      ${Q}</h3>
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
      $(".timeAttack").empty().append(multiQ);
    }
    $(".multiChoice").animate({ opacity: 1, width: "100%" }, 500, function () {
      $(`.choice input[name="question${index + 1}"]`).on("change", function () {
        handleAnswer(index, answer);
      });

      $("#nextB").on("click", function () {
        handleNextButton(index, maxquestion);
      });
    });
    startTimer();
    $(".point").hide();
  }
  if (codelabid.includes(id)) {
    const item = originalQuestions[index];
    const img = item.properties.img?.rich_text[0];
    console.log(img);
    const Q = item.properties.question.rich_text[0]?.text.content;
    const A = item.properties.A.rich_text[0]?.text.content;
    const B = item.properties.B.rich_text[0]?.text.content;
    const C = item.properties.C.rich_text[0]?.text.content;
    const D = item.properties.D.rich_text[0]?.text.content;
    const E = item.properties.E?.rich_text[0]?.text.content;
    const answer = item.properties.correct.rich_text[0].text.content;
    if (img != null) {
      let multiQ = `<div class="multiChoice" style="opacity: 0; width: 0;">
  <div class="questionno">
    <h2>Q<span class="qid">${index + 1}</span>:</h2>
  </div>
  <div class="Q-content">
    <h3><img src="${img}" alt="anh">
    <br>
    ${Q}</h3>
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
      <li class="choice  ${E ? "" : "hidden"}">
      <label><input type="radio" name="question${index + 1}" value="E" />
      <span>${E}</span></label>
    </li>
    </ul>
  </div>
  <button id="nextB" class="nextButton" disabled>Next</button>
</div>`;
      $(".timeAttack").empty().append(multiQ);
    } else {
      let multiQ = `<div class="multiChoice" style="opacity: 0; width: 0;">
    <div class="questionno">
      <h2>Q<span class="qid">${index + 1}</span>:</h2>
    </div>
    <div class="Q-content">
      <h3>
      ${Q}</h3>
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
        <li class="choice  ${E ? "" : "hidden"}">
        <label><input type="radio" name="question${index + 1}" value="E" />
          <span>${E}</span></label>
      </li>
      </ul>
    </div>
    <button id="nextB" class="nextButton" disabled>Next</button>
  </div>`;
      $(".timeAttack").empty().append(multiQ);
    }
    $(".multiChoice").animate({ opacity: 1, width: "100%" }, 500, function () {
      $(`.choice input[name="question${index + 1}"]`).on("change", function () {
        handleAnswer(index, answer);
      });

      $("#nextB").on("click", function () {
        handleNextButton(index, maxquestion);
      });
    });
    startTimer();

    $(".point").hide();
  }
}

//Kiem tra dung sai
function handleAnswer(index, correctAnswer) {
  clearInterval(timer); // Dừng bộ đếm thời gian khi chọn đáp án
  let timeBonus = Math.floor((timeLeft / 2) * 10); // Tính điểm bonus từ thời gian còn lại

  const selectedAnswer = $(
    `.choice input[name="question${index + 1}"]:checked`
  ).val();
  const userAnswer = $(
    `.choice input[name="question${currentIndex + 1}"]:checked`
  )
    .siblings("span")
    .text();
  // Disable radio buttons in the same group
  $(`.choice input[name="question${index + 1}"]`).attr("disabled", true);

  // Reset label colors
  $(`.choice input[name="question${index + 1}"]`)
    .parent("label")
    .css("background-color", "");

  // Show the right answer
  $(`.choice input[name="question${index + 1}"][value="${correctAnswer}"]`)
    .parent("label")
    .addClass("correct-answer");

  if (selectedAnswer === correctAnswer) {
    $(`.choice input[name="question${index + 1}"]:checked`)
      .parent("label")
      .css("background-color", "#33FF33");

    score++;
    streak++;
    point = 50;
    points += point + timeBonus;
    if (streak > highestStreak) {
      highestStreak = streak; // Cập nhật streak cao nhất nếu streak hiện tại lớn hơn streak cao nhất
    }
    $(".point").show();
  } else {
    $(`.choice input[name="question${index + 1}"]:checked`)
      .parent("label")
      .css("background-color", "#FF3333");
    streak = 0;
    timeBonus = 0;
  }
  userAnswers.push(userAnswer);
  $("#points").text(`+ ${point}`);
  $("#bonus").text(`+ ${timeBonus}`);
  $("#streak").text(`Streak: ${streak}`);
  // Enable the existing "Next" button after answering
  $("#nextB").prop("disabled", false);
}

// Bắt đầu bộ đếm thời gian
function startTimer() {
  clearInterval(timer);
  timeLeft = 10; // Reset lại thời gian còn lại
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    $("#timerText").text(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}

// Xử lý khi hết giờ
function handleTimeUp() {
  const correctAnswer =
    originalQuestions[currentIndex].properties.Answer.rich_text[0].text.content;

  // Disable radio buttons in the same group
  $(`.choice input[name="question${currentIndex + 1}"]`).attr("disabled", true);

  // Reset label colors
  $(`.choice input[name="question${currentIndex + 1}"]`)
    .parent("label")
    .css("background-color", "");

  // Show the right answer
  $(
    `.choice input[name="question${
      currentIndex + 1
    }"][value="${correctAnswer}"]`
  )
    .parent("label")
    .addClass("correct-answer");
  if (!$(`.choice input[name="question${currentIndex + 1}"]:checked`).length) {
    streak = 0;
    $("#streak").text(`Streak: ${streak}`);
  }
  // Enable the existing "Next" button after answering
  $("#nextB").prop("disabled", false);
}

//Nut tiep theo ( doi cau hoi)
function handleNextButton(index, maxquestion) {
  const progress = $(".indicator").width();
  const addedwidth = $(".indicator").parent().width();
  const newprogress = progress + addedwidth * 0.1;

  $(".indicator").animate({ width: newprogress }, 300, function () {
    setTimeout(function () {
      $(".multiChoice").animate({ opacity: 0 }, 200, function () {
        currentIndex++;
        showQuestion(currentIndex, maxquestion);
      });
    }, 500);
  });

  // Disable the existing "Next" button after clicking
  $("#nextB").prop("disabled", true);
}

async function saveQuizData(
  points,
  highestStreak,
  originalQuestions,
  userId,
  userAnswers
) {
  if (!codelabid.includes(id) && !id.includes("challenge")) {
    try {
      // Lấy các câu hỏi đã hiển thị
      // const selectedAnswer = $(
      //   `.choice input[name="question${index + 1}"]:checked`
      // ).val();

      const answeredQuestions = originalQuestions
        .slice(0, currentIndex)
        .map((question) => ({
          question:
            question.properties.Name.title[0]?.text.content ||
            question.properties.question.rich_text[0]?.text.content,
          correctAnswer:
            question.properties.Answer_Content.formula.string ||
            question.properties.correct.rich_text[0].text.content,
          // userAnswer: userAnswers.userAnswer || "No Answer",
        }));

      // Dữ liệu cần lưu
      const data = {
        points: points,
        highestStreak: highestStreak,
        questions: answeredQuestions,
        userId: userId,
        timestamp: serverTimestamp(),
      };
      const idnguoidung = auth.currentUser.uid;
      checkStreak(idnguoidung);
      // Lưu dữ liệu vào bảng "user_history"
      const docRef = await addDoc(collection(db, `${idnguoidung}`), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  if (codelabid.includes(id)) {
    try {
      // Lấy các câu hỏi đã hiển thị
      // const selectedAnswer = $(
      //   `.choice input[name="question${index + 1}"]:checked`
      // ).val();

      const answeredQuestions = originalQuestions
        .slice(0, currentIndex)
        .map((question) => ({
          question: question.properties.question.rich_text[0]?.text.content,
          correctAnswer: question.properties.correct.rich_text[0].text.content,
          // userAnswer: userAnswers.userAnswer || "No Answer",
        }));

      // Dữ liệu cần lưu
      const data = {
        points: points,
        highestStreak: highestStreak,
        questions: answeredQuestions,
        userId: userId,
        timestamp: serverTimestamp(),
      };
      const idnguoidung = auth.currentUser.uid;
      // Lưu dữ liệu vào bảng "user_history"
      const docRef = await addDoc(collection(db, `${idnguoidung}`), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
}

function setupQuiz() {
  let originalQuestions = [];
  $("#redoButton").hide();
  $("#restartButton").hide();
  $("#challenge__continue").hide();
  // $(".result_shower").hide();
  fetchData();
  redoQuiz(originalQuestions);
  showQuestion();
  handleAnswer();
  handleNextButton();
}

// Call setupQuiz() to initialize the quiz
setupQuiz();
