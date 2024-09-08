// GET COMPONENTS
import { getDoc, getFirestore } from "firebase/firestore";
import { auth } from "../../src/app/firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
import { get } from "jquery";
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

fetch("_topNav.html")
  .then((response) => response.text())
  .then((html) => {
    $("#topNav").html(html);
  });
fetch("_footer.html")
  .then((response) => response.text())
  .then((html) => {
    $("#footer").html(html);
  });
console.log(auth);
$(".icons").hide();

const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  // STREAK
  const userId = auth.currentUser.uid;
  const streakRef = doc(firestore, "streaks", userId);
  getDoc(streakRef).then((docSnapshot) => {
    let add;
    if (docSnapshot.exists()) {
      add = docSnapshot.data().streakCnt;
    } else add = undefined;
    $(".streak .text .counter h1").text(add);
  });

  // USER'S POINTS
  const userQuery = query(
    collection(firestore, "user_history", userId, "userInfo")
  );
  const userInfoSnapshot = onSnapshot(userQuery, (userInfoSnapshot) => {
    userInfoSnapshot.forEach((userInfoDoc) => {
      const userInfoData = userInfoDoc.data();

      // Lấy dữ liệu từ subcollection challenge
      const challengeQuery = query(
        collection(firestore, `user_history`, userId, `challenge`)
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
          $(".exp .text .counter h1").text(totalPoints);
        }
      );
    });
  });
  const creationTime = new Date(user.metadata.creationTime);
  const year = creationTime.getFullYear();
  const month = creationTime.toLocaleString("default", { month: "long" });
  const avatarimg = $(".user-img");
  const avatarURL = user.photoURL;
  if (user != null) {
    $(".icons").show();
    $(".username_text").text(user.displayName);
    $(".userId_text").text(user.email);
    $(".created_text").text(`started from ${month} ${year}`);
    $(".created_text").text(`started from ${month} ${year}`);
    avatarimg.attr("src", avatarURL);
  }
});
