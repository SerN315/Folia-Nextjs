import { auth } from "../../src/app/firebase/authenciation.js";
import { db } from "../../src/app/firebase/authenciation.js";
// import { storageRef } from "./firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
import { storageRef, storage } from "../../src/app/firebase/authenciation.js";
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
  getDocs,
  getDoc,
  serverTimestamp,
  updateDoc,
  limit,
} from "firebase/firestore";


// Khởi tạo Firestore instance
const firestore = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    const idnguoidung = auth.currentUser.uid;

    // Lấy dữ liệu từ subcollection "ranking"
    const userInfoQuery = query(
      collection(firestore, "ranking"),
      orderBy("totalPoints", "desc"),
      limit(10)
    );

    const userInfoSnapshot = onSnapshot(userInfoQuery, (userInfoSnapshot) => {
      const userInfoData = userInfoSnapshot.docs.map((doc) => doc.data());

      // Tìm vị trí của người dùng trong danh sách
      const currentUserIndex = userInfoData.findIndex(
        (user) => user.uid === auth.currentUser.uid
      );

      // Nếu người dùng không có trong danh sách, thêm vào
      if (currentUserIndex === 1) {
        userInfoData.push({
          avatar: auth.currentUser.photoURL,
          points: auth.currentUser.points,
          email: auth.currentUser.email,
          username: auth.currentUser.displayName,
          uid: auth.currentUser.uid,
        });
        userInfoData.sort((a, b) => b.totalPoints - a.totalPoints);
      }
      // Lấy các 3 vị trí đầu tiên và append vào HTML
      const ranksList = document.querySelector(".ranks");
      const ranksList2 = document.querySelector(".rankings");
      const ranklist2container = document.querySelector(
        ".leaderboard__container__rankinglist"
      );
      ranksList.innerHTML = "";
      ranksList2.innerHTML = "";
      // Người có điểm số cao nhất
      const firstPlace = userInfoData[1];
      const firstPlaceLi = document.createElement("li");
      firstPlaceLi.innerHTML = `
       <div class="ranker_avatar" style="background-image:url(${firstPlace.avatar});background-position:center;background-size:cover">
       </div>
       <div class="rank_indicator">2</div>
              <div class="rankerinfors">
       <div class="username"><h3>${firstPlace.username}</h3></div>
       <div class="email"><h4>${firstPlace.email}</h4></div>
       </div>
     `;
      ranksList.appendChild(firstPlaceLi);

      // Người có điểm số cao thứ 2
      const secondPlace = userInfoData[0];
      const secondPlaceLi = document.createElement("li");
      secondPlaceLi.innerHTML = `
       <div class="ranker_avatar" style="background-image:url(${secondPlace.avatar});background-position:center;background-size:cover">
       </div>
       <div class="rank_indicator">1</div>
       <div class="rankerinfors">
       <div class="username"><h3>${secondPlace.username}</h3></div>
       <div class="email"><h4>${secondPlace.email}</h4></div>
       </div>
     `;
      ranksList.appendChild(secondPlaceLi);

      // Người có điểm số cao thứ 3
      const thirdPlace = userInfoData[2];
      const thirdPlaceLi = document.createElement("li");
      thirdPlaceLi.innerHTML = `
       <div class="ranker_avatar" style="background-image:url(${thirdPlace.avatar});background-position:center;background-size:cover">
       </div>
       <div class="rank_indicator">3</div>
              <div class="rankerinfors">
       <div class="username"><h3>${thirdPlace.username}</h3></div>
       <div class="email"><h4>${thirdPlace.email}</h4></div>
       </div>
     `;
      ranksList.appendChild(thirdPlaceLi);

      // Thêm phần còn lại vào .ranks
      for (let i = 3; i < userInfoData.length; i++) {
        const user = userInfoData[i];
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="user_ranking_info">
          <div class="rank">${i + 1}</div>
          <div class="ranking_avatar" style="background-image:url(${
            user.avatar
          });background-position:center;background-size:cover"></div>
          <div class="user_info">
            <div class="username">${user.username}</div>
            <div class="email">${user.email}</div>
          </div>
        </div>
        <div class="point">${user.totalPoints}</div>
      `;
        ranksList2.appendChild(li);
      }

      // Ẩn ranksList2 nếu danh sách <= 3 users
      if (userInfoData.length <= 3) {
        ranklist2container.style.display = "none";
      } else {
        ranklist2container.style.display = "block";
      }
    });
  }
});
