import { auth } from "../../src/app/firebase/authenciation.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { getDatabase, getDatabase2 } from "./api/databaseAPI";
// Import toggleActive from "_level.js"
import { navigationPanel } from "./_navigation";
navigationPanel();
import { getCookie } from "./cookie";
import config from "./config";

import { getAudio } from "./api/pronunciationApi";
const jwt = getCookie("jwt");
var searchParams = new URLSearchParams(window.location.search);
const phrase = searchParams.get("text");
const searchedWord = searchParams.get("word");
const topicID = searchParams.get("topic");
const vocab = [];
const pronunciations = [];
const sets = [];
const meanings = [];
const imgs = [];
let data = [];

// // LINK TỚI TRANG CATEGORY
// document.querySelector(".cate-link").href = "/cate.html?topic=folia-language";

// LẤY CÁC COMPONENTS
$(function () {
  fetch("_topNav.html")
    .then((response) => response.text())
    .then((html) => {
      $("#topNav").html(html);
    });
});
fetch("_footer.html")
  .then((response) => response.text())
  .then((html) => {
    $("#footer").html(html);
  });

// LINK TỚI CÁC CHỨC NĂNG KHÁC
document.querySelector(
  ".flashcard-link"
).href = `flashcard.html?topic=${topicID}`;
document.querySelector(".d-and-d-link").href = `d_and_d.html?topic=${topicID}`;

// THANH ĐƯA VỀ ĐẦU TRANG
let scrollProgress = document.getElementById("progress");
let progressValue = document.getElementById("progress-value");
let calcScrollValue = () => {
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);
  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }
  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });
  scrollProgress.style.background = `conic-gradient(#3fbd00 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// Khởi tạo một Firestore instance
const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  $(".article").empty();
  if (user != null) {
    // Lấy dữ liệu từ một collection cụ thể
    const idnguoidung = auth.currentUser.uid;
    const q = query(collection(firestore, `${idnguoidung}`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("userId:", data.userId);
        console.log("highestStreak:", data.highestStreak);
        console.log("points:", data.points);
        console.log("timestamp:", data.timestamp);
        console.log("questions:");
        data.questions.forEach((question, index) => {
          console.log(`Question ${index + 1}:`, question);
          let questionHTML = `
          <div class="question_box">
          <h1>Question</h1>
            <div class="question">${question.question}</div>
            <h2>Correct Answer</h2>
            <div class="dapan">${question.correctAnswer}</div>
          </div>`;
          $(".modal20").append(questionHTML);
        });
        let wordHTML = `
        <div class="vocabulary show-modal" vocabId =${data.userId}>
          <div class="vocabulary-word20">
            <div class="word"><i class="fa-solid fa-star"></i> Score Achived: ${data.points}</div>
            <div class="word-set"><i class="fa-solid fa-fire"></i> Highest Streak this run: ${data.highestStreak}</div>
          </div>
        </div>`;

        $(".article").append(wordHTML);

        const wordBox = $(".word-box-overlay");
        const btnsOpen = $(".show-modal");
        const btnClose = $(".close-modal");
        btnClose.on("click", function () {
          wordBox.addClass("hidden");
        });
        //  wordBox.on("click", function () {
        //     wordBox.addClass("hidden");
        //   });
        btnsOpen.on("click", function () {
          wordBox.removeClass("hidden");
        });
      });
    });
  }
});
