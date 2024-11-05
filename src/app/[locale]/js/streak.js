// IMPORTS
import { data } from "jquery";
import { auth } from "../../src/app/firebase/authenciation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
  setDoc,
  Timestamp,
} from "firebase/firestore";



// CLOSE & OPEN POPUP
const popup = $(".reward-list");
const open = $(".reward-ico");
const close = $(".cancel");
open.on("click", () => {
  popup.toggleClass("deactivate");
});
close.on("click", () => {
  popup.toggleClass("deactivate");
});

// DEALING WITH STREAK
const completeColor = "#ffce51";
const setStreak = (streak, streakRef) => {
  $(".days").text(streak);

  // INITIALIZE STREAK BAR
  const streakCnt = (streak / 25) * 100;
  $(".bp").each((index, element) => {
    if (parseInt($(element).text()) <= streak) {
      $(element).css("color", completeColor);
    }
  });
  $(".reward").each((index, element) => {
    const breakpoint = $(element).attr("bp");
    if (breakpoint <= streak) {
      $(element).find(".complete").removeClass("deactivate");
    }
  });
  $(".progress-res").css("width", streakCnt + "%");
};

// INITIALIZE A FIRESTORE INSTANCE
const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    const userid = auth.currentUser.uid;
    const streakRef = doc(firestore, "streaks", userid);
    getDoc(streakRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        let streak = docSnapshot.data().streakCnt;
        setStreak(streak);
        content(streak);

        // CHANGE CONTENT BASED ON RESIZE VIEWPORT
        window.addEventListener("resize", () => {
          content(streak);
        });
      } else {
        const userStreakData = {
          streakCnt: 0,
          streakCheck: false,
          lastUpdated: Timestamp.now(),
        };
        setDoc(streakRef, userStreakData);
      }
    });
  }
});

// CHANGE CONTENT BASED ON RESIZE VIEWPORT WIDTH
const content = (streak) => {
  const viewport = window.innerWidth;
  if (viewport < 685) {
    if (streak == 0) {
      $(".days")(
        `You haven't got any streak. Play a game today to get your first streak`
      );
    } else if (streak == 1) {
      $(".days")(`You hit your first streak today. Keep going!`);
    } else {
      $(".days")(
        `You hit a <span>${streak}</span> days streak. Keep going!`
      );
    }
  } else {
    $(".days").text(streak);
  }
};
