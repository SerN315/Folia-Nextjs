// import { getDatabase } from "./api/databaseAPI";
// import { db } from "../../src/app/firebase/authenciation.js";
// import { auth } from "../../src/app/firebase/authenciation.js";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   getDoc,
//   query,
//   where,
//   orderBy,
//   setDoc,
//   Timestamp,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";


// // FUNCTION TO CHECK STREAK AFTER PLAY A GAME
// function checkStreak(userId) {
//   const firestore = getFirestore();
//   onAuthStateChanged(auth, (user) => {
//     if (user != null) {
//       const userid = auth.currentUser.uid;
//       const streakRef = doc(firestore, "streaks", userid);
//       getDoc(streakRef).then((docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const check = docSnapshot.data().streakCheck;
//           const count = docSnapshot.data().streakCnt;
//           if (check == false) {
//             updateDoc(streakRef, {
//               streakCheck: true,
//               streakCnt: count + 1,
//               lastUpdated: Timestamp.now(),
//             });
//           } else {
//             updateDoc(streakRef, {
//               lastUpdated: Timestamp.now(),
//             });
//           }
//         } else {
//           const userStreakData = {
//             streakCnt: 1,
//             streakCheck: true,
//             lastUpdated: Timestamp.now(),
//           };
//           setDoc(streakRef, userStreakData);
//         }
//       });
//     }
//   });
// }

// const urlParams = new URLSearchParams(window.location.search);
// const id = urlParams.get("topic");
// const idd = urlParams.get("id");
// $(".result_shower").hide();
// $(".interact").hide();
// $("#challenge__continue").on("click", function () {
//   window.location.href = `challenge`;
// });
// let correct = 0;
// // Khai báo biến streak và khởi tạo giá trị ban đầu
// let questions = [];
// let streak = 0;
// let total = 0;
// let score = 0;
// let highestStreak = 0; // Thêm biến highestStreak để lưu trữ streak cao nhất
// let storedOriginalQuestions = [];
// let maxquestion = 0;
// // let storedpoints = 0;
// // let storedstreak = 0;

// let totalMatchingPairs = 5; // Total questions to display

// const scoreSection = document.querySelector(".score");
// const correctSpan = scoreSection.querySelector(".correct");
// const totalSpan = scoreSection.querySelector(".total");
// const playAgainBtn = scoreSection.querySelector("#play-again-btn");
// const draggableItems = document.querySelector(".draggable-items");
// const matchingPairs = document.querySelector(".matching-pairs");
// let draggableElements;
// let droppableElements;
// let uniqueAnswers; // Declare uniqueAnswers globally

// if (id.includes("challenge")) {
//   $(".left_score").text("Points");
//   $(".right_score").text("Streak");
//   try {
//     storedOriginalQuestions = localStorage.getItem("originalQuestions");
//     score = localStorage.getItem("points");
//     streak = localStorage.getItem("streak");
//     if (storedOriginalQuestions) {
//       // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
//       originalQuestions = JSON.parse(storedOriginalQuestions);
//     }
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// }

// // console.log(storedpoints);
// // console.log(storedstreak);

// let responseData;
// let ht2 = [
//   "8e3fdb05-5ef5-4e77-b400-0d8767fb539e",
//   "730846b3-4f7b-4367-b004-f3842d630b7e",
//   "61e2d92a-e3a6-418f-939f-99ede4c5b185",
//   "53114cf6-dadc-4c5d-b08a-c04d1b433274",
//   "d7585a20-67e8-48d1-b097-05f5f498edd9",
//   "3264dc41-5c6f-4e4f-9ece-71136a57afe3",
//   "28704707-dc7e-45cb-9765-16865d32b9c5",
//   "46852722-fb9f-4935-b2d3-add5bff13640",
//   "94879267-de61-4edb-baf7-ac99849ebe21",
// ];
// if (ht2.includes(id)) {
//   // Fetch data from the API once
//   getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
//     filter: {
//       property: "topic",
//       relation: {
//         contains: id,
//       },
//     },
//   })
//     .then(async (response) => {
//       responseData = response;
//       console.log(responseData);
//       initiateGame();
//     })
//     .catch((error) => {
//       console.error("Error fetching data from the API:", error);
//     });
// } else if (!ht2.includes(id) && !id.includes("challenge")) {
//   // Fetch data from the API once
//   getDatabase("8240dd072127443f8e51d09de242c2d9", {
//     filter: {
//       property: "Topic",
//       relation: {
//         contains: id,
//       },
//     },
//   })
//     .then(async (response) => {
//       responseData = response;
//       initiateGame();
//     })
//     .catch((error) => {
//       console.error("Error fetching data from the API:", error);
//     });
// } else if (id.includes("challenge")) {
//   getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
//     filter: {
//       property: "challenge",
//       relation: {
//         contains: idd,
//       },
//     },
//   })
//     .then(async (response) => {
//       initialQ = response;
//       maxquestion = response.length;
//       responseData = response.filter(
//         (item) => !originalQuestions.some((question) => question.id === item.id)
//       );
//       totalMatchingPairs = responseData.length;
//       console.log(responseData);
//       initiateGame();
//     })
//     .catch((error) => {
//       console.error("Error fetching data from the API:", error);
//     });
// }

// // Other Event Listeners
// playAgainBtn.addEventListener("click", playAgainBtnClick);

// async function saveQuizData(
//   score,
//   highestStreak,
//   questions,
//   userId,
//   userAnswers,
//   totalMatchingPairs
// ) {
//   if (id.includes("challenge")) {
//     // Construct the data object to be stored in Firestore
//     const data = {
//       score: score,
//       originalQuestions: originalQuestions.map((question) => ({
//         question:
//           question.properties.Name.title[0]?.text.content ||
//           question.properties.question.rich_text[0]?.text.content,
//         correctAnswer:
//           question.properties.Answer_Content.formula.string ||
//           question.properties.correct.rich_text[0].text.content,
//         // userAnswer: userAnswers.userAnswer || "No Answer",
//         source: "multichoices",
//       })),
//       highestStreak: highestStreak,
//       questions: questions,
//       userId: userId,
//       id: id,
//       tag: "Challenge",
//       timestamp: serverTimestamp(),
//     };

//     // Get the user ID
//     const idnguoidung = auth.currentUser.uid;
//     checkStreak(idnguoidung);
//     const userDocRef = doc(db, `user_history/${idnguoidung}`);
//     try {
//       // Add a new document with a unique ID in the 'quizAttempts' subcollection
//       await addDoc(collection(userDocRef, "challenge"), data);
//       console.log("Quiz attempt saved for user: ", idnguoidung);
//     } catch (error) {
//       console.error("Error saving quiz attempt: ", error);
//     }
//   }

//   if (!id.includes("challenge")) {
//     // // Lấy các câu hỏi đã hiển thị
//     // const answeredQuestions = questions.map((question) => ({
//     //   question: question.Q,
//     //   correctAnswer: question.answer,
//     //   // userAnswer: userAnswers[question.id] || "No Answer",
//     // }));

//     // Dữ liệu cần lưu
//     const data = {
//       score: score,
//       highestStreak: highestStreak,
//       questions: questions,
//       userId: userId,
//       tag: "Practices",
//       timestamp: serverTimestamp(),
//     };
//     const idnguoidung = auth.currentUser.uid;
//     checkStreak(idnguoidung);
//     const userDocRef = doc(db, `user_history/${idnguoidung}`);
//     try {
//       // Add a new document with a unique ID in the 'quizAttempts' subcollection
//       await addDoc(collection(userDocRef, "practices"), data);
//       console.log("Quiz attempt saved for user: ", idnguoidung);
//     } catch (error) {
//       console.error("Error saving quiz attempt: ", error);
//     }
//   }
// }
// // Hàm cập nhật điểm số
// function updateScore() {
//   scoreSection.style.opacity = 0;
//   if (id.includes("challenge")) {
//     setTimeout(() => {
//       correctSpan.textContent = score;
//       totalSpan.textContent = streak;
//       scoreSection.style.opacity = 1;
//     }, 200);
//   } else {
//     setTimeout(() => {
//       correctSpan.textContent = correct;
//       totalSpan.textContent = total;
//       scoreSection.style.opacity = 1;
//     }, 200);
//   }
// }

// function initiateGame() {
//   // Randomize the questions
//   const shuffledData = responseData.sort(() => Math.random() - 0.5);
//   // if (!ht2.includes(id)){
//   questions = shuffledData.slice(0, totalMatchingPairs).map((item) => ({
//     Q:
//       item.properties.img?.rich_text[0]?.plain_text ||
//       item.properties.Name?.title[0]?.text.content ||
//       "N/A",
//     answer:
//       item.properties.Answer_Content?.formula.string ||
//       item.properties.Name?.title[0]?.plain_text ||
//       "N/A",
//     source: "d_and_d",
//   }));

//   // Randomize the order of draggable items
//   const shuffledDraggables = Array.from(
//     new Set(questions.map((q) => q.answer))
//   );
//   shuffledDraggables.sort(() => Math.random() - 0.5);

//   // Create "matching-pairs" and append to DOM for each question
//   matchingPairs.innerHTML = ""; // Clear existing content
//   questions.forEach((question) => {
//     if (
//       question.Q.includes("http://") ||
//       question.Q.includes("https://") ||
//       question.Q.includes("data:")
//     ) {
//       matchingPairs.insertAdjacentHTML(
//         "beforeend",
//         `
//     <div class="matching-pair">
//       <span class="label" style="background-image:url('${question.Q}')"></span>
//       <span class="droppable" data-answer="${question.answer}"></span>
//     </div>
//   `
//       );
//     } else {
//       matchingPairs.insertAdjacentHTML(
//         "beforeend",
//         `
//     <div class="matching-pair">
//       <span class="label">${question.Q}</span>
//       <span class="droppable" data-answer="${question.answer}"></span>
//     </div>
//   `
//       );
//     }
//   });

//   // Dynamically generate draggable items for "Answer_Content"
//   uniqueAnswers = Array.from(new Set(questions.map((q) => q.answer)));
//   draggableItems.innerHTML = ""; // Clear existing content
//   shuffledDraggables.forEach((answer) => {
//     draggableItems.insertAdjacentHTML(
//       "beforeend",
//       `<div class="draggable" draggable="true">${answer}</div>`
//     );
//   });

//   draggableElements = document.querySelectorAll(".draggable");
//   droppableElements = document.querySelectorAll(".droppable");

//   draggableElements.forEach((elem) => {
//     elem.addEventListener("dragstart", dragStart);
//   });

//   droppableElements.forEach((elem) => {
//     elem.addEventListener("dragenter", dragEnter);
//     elem.addEventListener("dragover", dragOver);
//     elem.addEventListener("dragleave", dragLeave);
//     elem.addEventListener("drop", drop);
//   });
//   $(".spinner-border").hide();
// }

// // Hàm kiểm tra hoàn thành trò chơi
// function checkGameCompletion() {
//   if (id.includes("challenge")) {
//     if (correct === Math.min(totalMatchingPairs, uniqueAnswers.length)) {
//       $(".result_shower").show();
//       $(".content_interact").hide();
//       $(".interact").show();
//       // $(".drag_content").hide();

//       let progressStartValue = -1;
//       const speed = 10;
//       const all = total + 10;
//       let percentage = (maxquestion / all) * 100;
//       if (!isNaN(percentage)) {
//         let progress = setInterval(() => {
//           progressStartValue++;
//           $(".circular-value").text(`${progressStartValue}%`);
//           $(".circular-progress").css(
//             "background",
//             `conic-gradient(#3fbd00 ${
//               progressStartValue * 3.6
//             }deg, #ededed 0deg)`
//           );
//           if (progressStartValue >= percentage) {
//             clearInterval(progress);
//           }
//         }, speed);
//       }
//       $(".indicator").animate({ width: "100%", borderRadius: "none" }, 1);
//       $(".score-points").text(`Your Score: ${score}`);
//       $(".max-streak").text(`Best Streak this run: ${highestStreak}`);
//       console.log("quiz finish", score);
//       console.log(percentage);
//       console.log(streak);
//       console.log(score);
//       console.log(highestStreak);
//       const userId = auth.currentUser.uid;
//       saveQuizData(score, highestStreak, questions, userId);
//     }
//   } else {
//     if (correct === Math.min(totalMatchingPairs, uniqueAnswers.length)) {
//       playAgainBtn.style.display = "block";
//       playAgainBtn.style.opacity = "1";
//       setTimeout(() => {
//         playAgainBtn.classList.add("play-again-btn-entrance");
//       }, 200);
//       console.log(streak);
//       console.log(score);
//       console.log(highestStreak);
//       const userId = auth.currentUser.uid;

//       saveQuizData(score, highestStreak, questions, userId);
//     }
//   }
// }
// function playAgainBtnClick() {
//   playAgainBtn.classList.remove("play-again-btn-entrance");
//   correct = 0;
//   total = 0;
//   streak = 0;
//   score = 0;
//   highestStreak = 0;
//   localStorage.removeItem("points");
//   localStorage.removeItem("streak");
//   // Reset the score display
//   correctSpan.textContent = correct;
//   totalSpan.textContent = total;

//   draggableItems.style.opacity = 0;
//   matchingPairs.style.opacity = 0;

//   setTimeout(() => {
//     scoreSection.style.opacity = 0;
//   }, 100);

//   setTimeout(() => {
//     playAgainBtn.style.display = "none";

//     // Clear the draggable and matchingPairs elements
//     while (draggableItems.firstChild)
//       draggableItems.removeChild(draggableItems.firstChild);
//     while (matchingPairs.firstChild)
//       matchingPairs.removeChild(matchingPairs.firstChild);

//     // Reinitialize the game
//     initiateGame();

//     draggableItems.style.opacity = 1;
//     matchingPairs.style.opacity = 1;
//     scoreSection.style.opacity = 1;
//   }, 500);
// }

// function drop(event) {
//   event.preventDefault();
//   event.target.classList.remove("droppable-hover");

//   const draggableElementContent = event.dataTransfer.getData("text");
//   const droppableElementAnswer = event.target.getAttribute("data-answer");
//   const isCorrectMatching = draggableElementContent === droppableElementAnswer;

//   total++;

//   if (isCorrectMatching) {
//     // Ẩn draggable tương ứng
//     const correctDraggable = Array.from(draggableElements).find(
//       (draggable) => draggable.textContent === draggableElementContent
//     );

//     if (correctDraggable) {
//       correctDraggable.style.display = "none";
//     }

//     event.target.classList.add("dropped");
//     event.target.textContent = draggableElementContent; // Cập nhật nội dung droppable
//     correct++;

//     // Đảm bảo điểm số không bao giờ nhỏ hơn 0
//     score = Math.max(score, 0);

//     // Tăng streak nếu đúng liên tiếp
//     streak++;
//     // Tăng điểm số khi trả lời đúng
//     score += 100;
//   } else {
//     // Đặt streak về 0 nếu trả lời sai
//     streak = 0;
//     // Giảm điểm số khi trả lời sai
//     score -= 25;
//   }

//   if (streak > highestStreak) {
//     highestStreak = streak; // Cập nhật streak cao nhất nếu streak hiện tại lớn hơn streak cao nhất
//   }
//   // Cập nhật hiển thị của streak

//   // document.querySelector(".streak").textContent = streak;

//   // Cập nhật điểm số
//   updateScore();

//   // Kiểm tra nếu đã hoàn thành trò chơi
//   checkGameCompletion();
// }

// // Drag and Drop Functions

// // Events fired on the drag target
// function dragStart(event) {
//   event.dataTransfer.setData("text", event.target.textContent);
// }

// // Events fired on the drop target
// function dragEnter(event) {
//   if (
//     event.target.classList &&
//     event.target.classList.contains("droppable") &&
//     !event.target.classList.contains("dropped")
//   ) {
//     event.target.classList.add("droppable-hover");
//   }
// }

// function dragOver(event) {
//   if (
//     event.target.classList &&
//     event.target.classList.contains("droppable") &&
//     !event.target.classList.contains("dropped")
//   ) {
//     event.preventDefault();
//   }
// }

// function dragLeave(event) {
//   if (
//     event.target.classList &&
//     event.target.classList.contains("droppable") &&
//     !event.target.classList.contains("dropped")
//   ) {
//     event.target.classList.remove("droppable-hover");
//   }
// }



