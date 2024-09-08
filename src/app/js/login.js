
import { auth } from "../../src/app/firebase/authenciation";
import { saveUserData } from "./setting";
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
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";

// GET START OF THE DAY
const dayStart = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
};

// GET USER STREAK EVERYTIME USER RELOAD
const getStreak = (uid) => {
  const firestore = getFirestore();
  const streakRef = doc(firestore, "streaks", uid);
  getDoc(streakRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      let streak = docSnapshot.data().streakCnt;
      let check = docSnapshot.data().streakCheck;
      let lastUpdated = docSnapshot.data().lastUpdated.toMillis();
      const currentTime = Date.now();
      // IF USER HAVEN'T PLAY ANY GAME IN 1 DAYS
      if (currentTime - lastUpdated >= 86400000 && check) {
        updateDoc(streakRef, {
          lastUpdated: Timestamp.now(),
          streakCheck: false,
          streakCnt: 0,
        });
        $(".streak-cnt").text(streak);
      } else {
        if (lastUpdated < dayStart() && !check) {
          updateDoc(streakRef, {
            lastUpdated: Timestamp.now(),
            streakCheck: false,
            streakCnt: 0,
          });
          $(".streak-cnt").text(0);
        } else if (lastUpdated < dayStart() && check) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          updateDoc(streakRef, {
            lastUpdated: Timestamp.fromDate(currentDate),
            streakCheck: false,
            streakCnt: streak,
          });
          $(".streak-cnt").text(streak);
        } else {
          $(".streak-cnt").text(streak);
        }
      }
    } else {
      // IF USER HAVEN'T HAVE A STREAK DATA
      const userStreakData = {
        streakCnt: 0,
        streakCheck: false,
        lastUpdated: Timestamp.now(),
      };
      setDoc(streakRef, userStreakData);
    }
  });
};

// const colRef = collection(db, "users");

$(".profile").hide();
onAuthStateChanged(auth, (user) => {
  const avatarimg = $(".user-img");
  const avatarURL = user.photoURL;
  if (user != null) {
    $(".streak").removeClass("hidden");
    $(".ranking").removeClass("hidden");
    $(".fav_list").removeClass("hidden");
    $(".profile").show();
    $(".open-popup").addClass("hidden");
    $(".wrapper").removeClass("active-popup");
    $(".logout").removeClass("hidden");
    $(".user-name").text(user.displayName);
    $(".avatar").attr("src", avatarURL);
    $(".detail__avatar").attr("src", avatarURL);
    $(".user-email").text(user.email);
    getStreak(user.uid);
  }
});

const wrapper = $(".wrapper");
const loginLink = $(".login-link");
const background = $(".wrapper-background");
const registerLink = $(".register-link");
const bodyscrolling = $("body");
const closeIcon = $(".closebtn");
const popup = $(".open-popup");
const forgotLink = $(".forgot-link");
const sendEmail = $(".btnFg");
const optconfirm = $(".btnotp");

registerLink.on("click", function () {
  wrapper.addClass("active");
});
forgotLink.on("click", function () {
  wrapper.addClass("active2");
});
loginLink.on("click", function () {
  wrapper.removeClass("active");
  wrapper.removeClass("active2");
  wrapper.removeClass("active3");
  wrapper.removeClass("active4");
});

popup.on("click", function () {
  wrapper.addClass("active-popup");
  background.addClass("active");
  bodyscrolling.addClass("disable-ov");
});
sendEmail.on("click", function () {
  wrapper.addClass("active3");
  wrapper.removeClass("active2");
});
optconfirm.on("click", function () {
  wrapper.addClass("active4");
  wrapper.removeClass("active3");
});
closeIcon.on("click", function () {
  wrapper.removeClass("active-popup");
  background.removeClass("active");
  bodyscrolling.removeClass("disable-ov");
});

const signupForm = document.querySelector("#register");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const username = signupForm.username.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      background.removeClass("active");
      saveUserData();
      updateProfile(auth.currentUser, {
        displayName: username,
      })
        .then(() => {
          console.log("Display name updated:", username);
        })
        .catch((error) => {
          console.error("Error updating display name:", error);
        });
      console.log("user created:", cred.user);
      // saveData(email, password); // Saving user data to Firestore
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector("#login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in:", cred.user);
      background.removeClass("active");
      $(".streak").removeClass("active");
      $(".fav_list").removeClass("hidden");
      $(".profile").show();
      $(".open-popup").addClass("hidden");
      $(".wrapper").removeClass("active-popup");
      bodyscrolling.removeClass("disable-ov");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      $(".profile").hide();
      $(".streak").addClass("hidden");
      $(".ranking").addClass("hidden");
      $(".fav_list").addClass("hidden");
      $(".login-button").removeClass("hidden");
      $(".wrapper").addClass("active-popup");
      $(".logout").addClass("hidden");
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});
// $(".logout").removeClass("hidden");
