import { getDatabase2 } from "./api/databaseAPI";
import { auth } from "./firebase/authenciation";
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
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Khởi tạo một Firestore instance
const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    const idnguoidung = auth.currentUser.uid;

    // Lấy dữ liệu từ subcollection userInfo
    const userInfoQuery = query(
      collection(firestore, `user_history`, idnguoidung, `userInfo`)
    );
    const userInfoSnapshot = onSnapshot(userInfoQuery, (userInfoSnapshot) => {
      userInfoSnapshot.forEach((userInfoDoc) => {
        const userInfoData = userInfoDoc.data();

        // Lấy dữ liệu từ subcollection challenge
        const challengeQuery = query(
          collection(firestore, `user_history`, idnguoidung, `challenge`)
        );
        const challengeSnapshot = onSnapshot(
          challengeQuery,
          (challengeSnapshot) => {
            let challengePoints = {};

            challengeSnapshot.forEach((challengeDoc) => {
              const challengeData = challengeDoc.data();
              const challengeId = challengeDoc.id;

              if (
                !challengePoints[challengeId] ||
                challengePoints[challengeId] < challengeData.score
              ) {
                challengePoints[challengeId] = challengeData.score;
              }
            });

            // Tính tổng điểm từ các challenge ID khác nhau
            let totalPoints = Object.values(challengePoints).reduce(
              (sum, score) => sum + score,
              0
            );

            // Tổng hợp data
            const rankingData = {
              userId: userInfoData.userId,
              avatar: userInfoData.photoURL,
              username: userInfoData.displayname,
              email: userInfoData.email,
              totalPoints: totalPoints,
            };

            // Lưu data vào collection ranking
            setDoc(doc(firestore, "ranking", idnguoidung), rankingData)
              .then(() => {
                console.log(
                  "Data đã được lưu vào collection ranking:",
                  rankingData
                );
              })
              .catch((error) => {
                console.error(
                  "Lỗi khi lưu data vào collection ranking:",
                  error
                );
              });
          }
        );
      });
    });
  }
});

let vocab = [];
document.querySelectorAll('.profile').forEach(function(profile) {
  profile.style.display = 'none';
});
const cardsTemplate = document.querySelector(".cards-template");
const resultContainer = document.querySelector(".search__result");
const searchInput = document.querySelector(".inside-search-bar");
const resultContainerMobile = document.querySelector(".search__result--mobile");
const searchInputMobile = document.querySelector(".inside-search-bar--mobile");

// FUNCTION FOR KEYPRESS 'ENTER'
searchInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    window.location.href = `/vocabularies.html?text=${event.target.value}`;
  }
});

// FUNCTION FOR FULL-WIDTH SEARCH BAR
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  // CHECK IF INPUT IS EMPTY?
  if (value === "") {
    resultContainer.style.display = "none";
  } else {
    resultContainer.style.display = "flex";
    getDatabase2(`vocabularies?search=${value}`).then(async (response) => {
      const sliceRespond = response.slice(0, 5);
      sliceRespond.forEach((word) => {
        vocab.push({ name: word.Word, topicID: word.TopicId });
      });
      $(".search__result").addClass("show");
      words = vocab.map((word) => {
        const card = cardsTemplate.content.cloneNode(true).children[0];
        const text = card.querySelector(".text");
        card.href = `vocabularies.html?topic=${word.topicID}&word=${word.name}`;
        card.text = word.name;
        card.classList.add("show");
        resultContainer.append(card);
        return { name: word.name, element: card };
      });
    });

    // FUNCTION ĐỂ XỬ LÝ KEYDOWN TRÊN RESULT
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && resultContainer.classList.contains("show")) {
        e.preventDefault();
        const searchResults = document.querySelectorAll(".cards.show");
        searchResults[0].focus();
        currentIndex = 0;
        searchResults.forEach((result, index) => {
          result.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextIndex = Math.min(index + 1, searchResults.length - 1);
              searchResults[nextIndex].focus();
              currentIndex = nextIndex;
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const prevIndex = Math.max(index - 1, 0);
              searchResults[prevIndex].focus();
              currentIndex = prevIndex;
            }
          });
        });
      }
    });
  }

  resultContainer.innerHTML = "";
  vocab = [];
});

searchInputMobile.addEventListener("input", (e) => {
  resultContainerMobile.style.display = "none";
});

// FUNCTION FOR RESPONSIVE SEARCH BAR
searchInputMobile.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  if (value === "") {
    resultContainerMobile.style.display = "none";
  } else {
    resultContainerMobile.style.display = "flex";
    getDatabase2(`vocabularies?search=${value}`).then(async (response) => {
      const sliceRespond = response.slice(0, 5);
      sliceRespond.forEach((word) => {
        vocab.push({ name: word.Word, topicID: word._id });
      });
      $(".search__result").addClass("show");
      wordsMobile = vocab.map((word) => {
        const card = cardsTemplate.content.cloneNode(true).children[0];
        const text = card.querySelector(".text");
        card.href = `vocabularies.html?topic=${word.topicID}&word=${word.name}`;
        card.text = word.name;
        card.classList.add("show");
        resultContainerMobile.append(card);
        return { name: word.name, element: card };
      });
    });
  }
  resultContainerMobile.innerHTML = "";
  vocab = [];
});

// FUNCTION FOR HAMBURGER BTN
const hamicon = document.querySelector(".hambricon");
const sidenav = document.querySelector(".hamburger_menu");

hamicon.addEventListener("click", function () {
  hamicon.classList.toggle("active");
  sidenav.classList.toggle("active");
});

// FUNCTION FOR DROPDOWN
const profileBtn = document.querySelector(".profile");
const profileDropdown = document.querySelector(".profile__dropdown");
profileBtn.addEventListener("click", () => {
  profileDropdown.classList.toggle("active");
});
document.addEventListener("click", (e) => {
  if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("active");
  }
});

// FUNCTION FOR STREAK DROPDOWN
const streakBtn = document.querySelector(".streak");
const streakDropdown = document.querySelector(".streak__dropdown");
streakBtn.addEventListener("click", () => {
  streakDropdown.classList.toggle("active");
});
document.addEventListener("click", (e) => {
  if (!streakBtn.contains(e.target) && !streakBtn.contains(e.target)) {
    streakDropdown.classList.remove("active");
  }
});
