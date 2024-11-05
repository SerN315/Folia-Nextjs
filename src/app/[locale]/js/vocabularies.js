// import { getDatabase, getDatabase2 } from "./api/databaseAPI";
// // Import toggleActive from "_level.js"
// import { navigationPanel } from "./_navigation";
// navigationPanel();
// import axios from "axios";
// import { getAudio } from "./api/pronunciationApi";
// import { auth } from "../../src/app/firebase/authenciation";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
//   updateDoc,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { merge } from "jquery";

// var searchParams = new URLSearchParams(window.location.search);
// const phrase = searchParams.get("text");
// const searchedWord = searchParams.get("word");
// const topicID = searchParams.get("topic");
// const vocab = [];
// const pronunciations = [];
// const sets = [];
// const meanings = [];
// const imgs = [];
// let data = [];


// // LINK TỚI TRANG CATEGORY
// document.querySelector(".cate-link").href = "/cate?topic=folia-language";

// const getVocabBasedOnTopic = (favoriteList, favoriteRef, firestore) => {
//   let check_favorites;
//   getDatabase2(`vocab/${topicID}`).then(async (response) => {
//     document.querySelector(".topic").innerHTML = response.topics;
//     document.querySelector(".category").innerHTML = response.category;
//     const words = response.vocabs;
//     $(".article")("");
//     data = [];
//     check_favorites = favoriteList;

//     await words.forEach((item, id) => {
//       try {
//         const uniqueId = item.Id;
//         const word = item.Word;
//         const pronunciation = item.Pronunciation;
//         const set = item.Set;
//         const meaning = item.Meaning;
//         const img = item.Img;

//         vocab.push(word);
//         sets.push(set);
//         meanings.push(meaning);
//         pronunciations.push(pronunciation);
//         imgs.push(img);
//         data.push({
//           Id: uniqueId,
//           Word: word,
//           Set: set,
//           Meaning: meaning,
//           Pronunciation: pronunciation,
//           Img: img,
//         });

//         // KIỂM TRA check_favorites ĐỂ XEM NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP HAY CHƯA
//         let favoriteIcon;
//         if (check_favorites == null) {
//           favoriteIcon = `<i class="fa-solid fa-heart favorites show-modal-favo" style="z-index: 100;"></i>`;
//         } else {
//           favoriteIcon = `<i class="fa-solid fa-heart favorites show-modal-favo" style="z-index: 100 ;${
//             check_favorites.find((obj) => obj.word === word) ? "color:red" : ""
//           }"></i>`;
//         }

//         // ADD TỪ VÀO HTML
//         let wordHTML = `
//           <div class="vocabulary show-modal" vocabId =${uniqueId} id=${id} word=${word}>
//             <div class="icon-container">
//               <i class="fa-solid fa-flag report"></i>
//               ${favoriteIcon}
//             </div>
//             <div class="vocabulary-image">
//               <img src="${img}" alt="img" />
//             </div>
//             <div class="vocabulary-word">
//               <div class="word">${word}</div>
//               <div class="word-set">${set}</div>

//               <div class="word-pronunciation">
//                 <i class="fa-solid fa-volume-high pronunciation"></i> ${pronunciation}
//                   <Linkudio id="myAudio" class="hidden" src="path_to_your_audio_file.mp3"></Linkudio>
//               </div>
//               <div class="word-audio"></div>
//             </div>
//           </div>`;
//         $(".article").append(wordHTML);
//       } catch (e) {
//         console.log(e);
//         data.push({});
//       }
//     });
//     localStorage.setItem(searchParams, JSON.stringify(data));

//     // XỬ LÝ KẾT QUẢ TÌM KIẾM
//     if (searchedWord) {
//       words.forEach((word) => {
//         if (word.Word.toLowerCase() === searchedWord.toLowerCase()) {
//           let searchedModal = `
//           <div class="modal1">
//             <button class="close-modal">&times;</button>
//             <div class="anh">
//             <img src="${word.Img}" width="100%" alt="word-img" />
//             </div>

//             <div class="word-box">
//               <div class="flex-box">
//                 <p class="new-word">${word.Word}</p>
//                 <p class="word-set">${word.Set}</p>
//               </div>     
//               <p class="pronun"><i class="fa-solid fa-volume-high"></i>${word.Pronunciation}</p>
//             </div>
//             <div class="meaning-box">
//               <p class="definition-viet">
//               <span style="color:green">Nghĩa: </span>
//                 ${word.Meaning}
//               </p>
//               <p class="definition-example">
//                   <span style="color:green">Example: </span>
//               </p>
//             </div>
//           </div>`;
//           const modal = $(".word-box-overlay");
//           modal.append(searchedModal);
//           modal.removeClass("hidden");
//           $(".close-modal").on("click", () => {
//             modal.removeClass("display").addClass("hidden");
//             modal("");
//           });
//         }
//       });
//     }

//     // XỬ LÝ THÊM VÀ XOÁ TỪ YÊU THÍCH
//     if (favoriteList) {
//       const favIcons = document.querySelectorAll(".favorites");
//       favIcons.forEach((favIcon) => {
//         favIcon.addEventListener("click", (e) => {
//           e.stopPropagation();
//           const id = parseInt(
//             favIcon.closest(".vocabulary").getAttribute("id")
//           );
//           const favWord = data.at(id);
//           let favData = {
//             id: favWord.Id,
//             img: favWord.Img,
//             meaning: favWord.Meaning,
//             pronunciation: favWord.Pronunciation,
//             set: favWord.Set,
//             word: favWord.Word,
//           };
//           const index = favoriteList.findIndex(
//             (item) => item.id === favData.id
//           );
//           if (index !== -1) {
//             favoriteList.splice(index, 1);
//           } else {
//             favoriteList.push(favData);
//           }
//           favIcon.style.color = favIcon.style.color === "red" ? "black" : "red";
//           setDoc(favoriteRef, { favoriteList }, { merge: true });
//         });
//       });
//     }

//     // XỬ LÝ BÁO CÁO
//     if (favoriteList) {
//       const palceholderText =
//         "We appreciate your help in maintaining accurate information. Please take a moment to provide us with an explanation of the false information you've encountered. Your input will assist us in promptly addressing and correcting any inaccuracies.";
//       document.querySelectorAll(".report").forEach((report) => {
//         report.addEventListener("click", (e) => {
//           e.stopPropagation();
//           const vocab = report.closest(".vocabulary");
//           const word = vocab.querySelector(".word").innerHTML;
//           const reportForm = `
//           <form class="report-form">
//             <div class="mb-3">
//               <label for="report" class="form-label">Report False Information</label>
//               <textarea class="form-control" placeholder="${palceholderText}" id="reportInput" rows="20"></textarea>
//             </div>
//             <div class="button-container">
//               <button type="submit" class="btn send-report">Submit</button>
//               <button type="reset" class="btn cancel-report">Cancel</button>
//             </div>
//           </form>
//           `;
//           $(".word-box-overlay").append(reportForm);
//           $(".word-box-overlay").removeClass("hidden");
//           document
//             .querySelector(".report-form")
//             .addEventListener("submit", (e) => {
//               e.preventDefault();
//               const text = document.querySelector("#reportInput").value;
//               addDoc(collection(firestore, "reports"), {
//                 content: text,
//                 word: word,
//               });
//               $(".word-box-overlay").addClass("hidden");
//               $(".word-box-overlay .report-form").remove();
//             });
//           document
//             .querySelector(".cancel-report")
//             .addEventListener("click", () => {
//               $(".word-box-overlay").addClass("hidden");
//               $(".word-box-overlay .report-form").remove();
//             });
//         });
//       });
//     }

//     model(data);
//     $(".word-pronunciation").on("click", async function (e) {
//       console.log(
//         e.currentTarget.closest(".vocabulary").querySelector(".word").innerHTML
//       );
//       e.stopPropagation();
//       const w = e.currentTarget
//         .closest(".vocabulary")
//         .querySelector(".word").innerHTML;

//       const options = {
//         method: "GET",
//         url: `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${e.currentTarget
//           .closest(".vocabulary")
//           .querySelector(".word")
//           .innerHTML.toLowerCase()}`,
//         headers: {
//           "X-RapidAPI-Key":
//             "3b348803b4msh6cd665dad394a09p18e81djsn5381b615508d",
//           "X-RapidAPI-Host": "lingua-robot.p.rapidapi.com",
//         },
//       };

//       try {
//         const response = await axios.request(options);
//         console.log(response.data.entries[0].pronunciations[0].audio.url);
//         const audio = document.getElementById("myAudio");
//         audio.src = response.data.entries[0].pronunciations[0].audio.url;

//         if (audio.paused) {
//           audio.play();
//         } else {
//           audio.pause();
//           audio.currentTime = 0; // Optional: to restart the audio when clicked again
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     });
//     $(document).on("keydown", function (e) {
//       if (e.key === "Escape" && !wordBox.hasClass("hidden")) {
//         closeModal();
//       }
//     });
//   });
// };

// const getVocabBasedOnSearch = (favoriteList, favoriteRef, firestore) => {
//   document.querySelector(".nav-panel").style.display = "none";
//   document.querySelector(".search-result").style.display = "flex";
//   document.querySelector(".input-text").innerHTML = `'${phrase}'`;
//   $(".article")("");
//   let check_favorites = favoriteList;
//   getDatabase2(`vocabularies?search=${phrase}&limit=30`).then(
//     async (response) => {
//       // FUNCTION CHÍNH CHO CHỨC NĂNG HIỆN TỪ TÌM KIẾM
//       document.querySelector(".count").innerHTML = response.length;
//       data = [];
//       await response.forEach((word, id) => {
//         const wordID = word?.Id ?? null;
//         const topicID = word?._id ?? null;
//         const wordName = word?.Word ?? null;
//         const pronun = word?.Pronunciation ?? null;
//         const tags = word?.Set ?? null;
//         const meaning = word?.Meaning ?? null;
//         const image = word?.Img ?? null;

//         // KIỂM TRA check_favorites ĐỂ XEM NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP HAY CHƯA
//         let favoriteIcon;
//         if (check_favorites == null) {
//           favoriteIcon = `<i class="fa-solid fa-heart favorites show-modal-favo" style="z-index: 100;"></i>`;
//         } else {
//           favoriteIcon = `<i class="fa-solid fa-heart favorites show-modal-favo" style="z-index: 100 ;${
//             check_favorites.find((obj) => obj.word === wordName)
//               ? "color:red"
//               : ""
//           }"></i>`;
//         }

//         // THÊM TỪ VÀO HTML
//         let wordHTML = `
//         <div class="vocabulary show-modal" vocabid=${wordID} topicId =${topicID} id=${id} word=${wordName}>
//           <div class="icon-container">
//             <i class="fa-solid fa-flag report"></i>
//             ${favoriteIcon}
//           </div>
//           <div class="vocabulary-image">
//             <img src="${image}" alt="img" />
//           </div>
//           <div class="vocabulary-word">
//             <div class="word">${wordName}</div>
//             <div class="word-set">${tags}</div>

//             <div class="word-pronunciation">
//               <i class="fa-solid fa-volume-high pronunciation"></i> ${pronun}
//                 <Linkudio id="myAudio" class="hidden" src="path_to_your_audio_file.mp3"></Linkudio>
//             </div>
//             <div class="word-audio"></div>
//           </div>
//         </div>`;
//         $(".article").append(wordHTML);
//         data.push({
//           Id: wordID,
//           Word: wordName,
//           Set: tags,
//           Meaning: meaning,
//           Pronunciation: pronun,
//           Img: image,
//         });
//       });

//       // XỬ LÝ THÊM VÀ XOÁ TỪ YÊU THÍCH
//       if (favoriteList) {
//         const favIcons = document.querySelectorAll(".favorites");
//         favIcons.forEach((favIcon) => {
//           favIcon.addEventListener("click", (e) => {
//             e.stopPropagation();
//             const id = parseInt(
//               favIcon.closest(".vocabulary").getAttribute("id")
//             );
//             const favWord = data.at(id);
//             let favData = {
//               id: favWord.Id,
//               img: favWord.Img,
//               meaning: favWord.Meaning,
//               pronunciation: favWord.Pronunciation,
//               set: favWord.Set,
//               word: favWord.Word,
//             };
//             const index = favoriteList.findIndex(
//               (item) => item.id === favData.id
//             );
//             if (index !== -1) {
//               favoriteList.splice(index, 1);
//             } else {
//               favoriteList.push(favData);
//             }
//             favIcon.style.color =
//               favIcon.style.color === "red" ? "black" : "red";
//             setDoc(favoriteRef, { favoriteList }, { merge: true });
//           });
//         });
//       }

//       // XỬ LÝ BÁO CÁO
//       if (favoriteList) {
//         const palceholderText =
//           "We appreciate your help in maintaining accurate information. Please take a moment to provide us with an explanation of the false information you've encountered. Your input will assist us in promptly addressing and correcting any inaccuracies.";
//         document.querySelectorAll(".report").forEach((report) => {
//           report.addEventListener("click", (e) => {
//             e.stopPropagation();
//             const vocab = report.closest(".vocabulary");
//             const word = vocab.querySelector(".word").innerHTML;
//             const reportForm = `
//           <form class="report-form">
//             <div class="mb-3">
//               <label for="report" class="form-label">Report False Information</label>
//               <textarea class="form-control" placeholder="${palceholderText}" id="reportInput" rows="20"></textarea>
//             </div>
//             <div class="button-container">
//               <button type="submit" class="btn send-report">Submit</button>
//               <button type="reset" class="btn cancel-report">Cancel</button>
//             </div>
//           </form>
//           `;
//             $(".word-box-overlay").append(reportForm);
//             $(".word-box-overlay").removeClass("hidden");
//             document
//               .querySelector(".report-form")
//               .addEventListener("submit", (e) => {
//                 e.preventDefault();
//                 const text = document.querySelector("#reportInput").value;
//                 addDoc(collection(firestore, "reports"), {
//                   content: text,
//                   word: word,
//                 });
//                 $(".word-box-overlay").addClass("hidden");
//                 $(".word-box-overlay .report-form").remove();
//               });
//             document
//               .querySelector(".cancel-report")
//               .addEventListener("click", () => {
//                 $(".word-box-overlay").addClass("hidden");
//                 $(".word-box-overlay .report-form").remove();
//               });
//           });
//         });
//       }

//       model(data);
//     }
//   );
// };

// KHỞI TẠO MỘT FIRESTORE INSTANCE
const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    const userid = auth.currentUser.uid;
    const favoriteRef = doc(firestore, "favorites", userid);
    getDoc(favoriteRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        let favoriteList = docSnapshot.data().favoriteList;
        if (phrase) {
          getVocabBasedOnSearch(favoriteList, favoriteRef, firestore);
        } else {
          getVocabBasedOnTopic(favoriteList, favoriteRef, firestore);
        }
      } else {
        const initialData = {
          favoriteList: [],
        };
        setDoc(favoriteRef, initialData).then(() => {
          if (phrase) {
            getVocabBasedOnSearch([], favoriteRef);
          } else {
            getVocabBasedOnTopic([], favoriteRef);
          }
        });
      }
    });
  } else {
    if (phrase) {
      getVocabBasedOnSearch(null, null);
    } else {
      getVocabBasedOnTopic(null, null);
    }
  }
});

// // ĐÓNG VÀ MỞ MODAL
// const model = function (localData = undefined) {
//   data = localData;
//   const wordBox = $(".word-box-overlay");
//   const btnsOpen = $(".show-modal");

//   const openModal = function (item) {
//     const pos = item.currentTarget.id * 1;
//     let vocab_detailed = `
//       <div class="modal1">
//         <button class="close-modal">&times;</button>
//         <div class="anh">
//         <img src="${data[pos].Img}" width="100%" alt="word-img" />
//         </div>

//         <div class="word-box">
//           <div class="flex-box">
//             <p class="new-word">${data[pos].Word}</p>
//             <p class="word-set">${data[pos].Set}</p>
//           </div>     
//           <p class="pronun"><i class="fa-solid fa-volume-high"></i>${data[pos].Pronunciation}</p>
//         </div>
//         <div class="meaning-box">
//           <p class="definition-viet">
//           <span style="color:green">Nghĩa: </span>
//             ${data[pos].Meaning}
//           </p>
//           <p class="definition-example">
//               <span style="color:green">Example: </span>
//           </p>
//         </div>
//       </div>`;

//     $(".word-box-overlay").append(vocab_detailed);
//     wordBox.removeClass("hidden");

//     const closeModal = function (item) {
//       wordBox.removeClass("display").addClass("hidden");
//       wordBox("");
//     };
//     const btnClose = $(".close-modal");
//     btnClose.on("click", closeModal);
//   };
//   btnsOpen.on("click", openModal);
// };

// // LINK TỚI CÁC CHỨC NĂNG KHÁC
// document.querySelector(
//   ".flashcard-link"
// ).href = `flashcard?topic=${topicID}`;
// document.querySelector(".d-and-d-link").href = `dragdrop?topic=${topicID}`;

// // THANH ĐƯA VỀ ĐẦU TRANG
// let scrollProgress = document.getElementById("progress");
// let progressValue = document.getElementById("progress-value");
// let calcScrollValue = () => {
//   let pos = document.documentElement.scrollTop;
//   let calcHeight =
//     document.documentElement.scrollHeight -
//     document.documentElement.clientHeight;
//   let scrollValue = Math.round((pos * 100) / calcHeight);
//   if (pos > 100) {
//     scrollProgress.style.display = "grid";
//   } else {
//     scrollProgress.style.display = "none";
//   }
//   scrollProgress.addEventListener("click", () => {
//     document.documentElement.scrollTop = 0;
//   });
//   scrollProgress.style.background = `conic-gradient(#3fbd00 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
// };
// window.onscroll = calcScrollValue;
// window.onload = calcScrollValue;
