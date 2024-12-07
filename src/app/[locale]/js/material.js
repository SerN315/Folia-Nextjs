// import { getDatabase } from "./api/databaseAPI";
// import { navigationPanel } from "./_navigation";
// import { doc } from "firebase/firestore";
// navigationPanel();

// const topicID = "c9c54b75-f73e-4c66-89c9-d7a1c51538f6";

// // DEMO VOCAB FOR SHOWCASE
// const vocabs = [
//   {
//     uniqueID: "4307",
//     Name: "dolphin",
//     Pronunciation: "ˈdɑːl.fɪn",
//     Tags: "noun",
//     Meaning: "cá heo",
//   },
//   {
//     uniqueID: "4308",
//     Name: "whale",
//     Pronunciation: "weɪl",
//     Tags: "noun",
//     Meaning: "cá voi",
//   },
//   {
//     uniqueID: "4309",
//     Name: "shark",
//     Pronunciation: "weɪl",
//     Tags: "noun",
//     Meaning: "cá voi",
//   },
//   {
//     uniqueID: "4310",
//     Name: "turtle",
//     Pronunciation: "ˈtɜː.təl",
//     Tags: "noun",
//     Meaning: "con rùa",
//   },
//   {
//     uniqueID: "4311",
//     Name: "fish",
//     Pronunciation: "fɪʃ",
//     Tags: "noun",
//     Meaning: "con cá",
//   },
// ];

// // INITIALIZE NAME LIST
// const nameList = [];
// vocabs.forEach((vocab) => {
//   nameList.push(vocab.Name.toLowerCase());
// });

// // INITIALIZE DISPLAY CATE & TOPIC
// $(".category")("Animals");
// $(".topic")("Marine Life");

// // LINK TỚI CÁC CHỨC NĂNG KHÁC
// document.querySelector(
//   ".vocabulary-link"
// ).href = `vocabularies?topic=${topicID}`;
// document.querySelector(
//   ".flashcard-link"
// ).href = `flashcard?topic=${topicID}`;
// document.querySelector(".d-and-d-link").href = `dragdrop?topic=${topicID}`;

// $(function () {
//   fetch("_topNav")
//     .then((response) => response.text())
//     .then((html) => {
//       $("#topNav")(html);
//     });
//   fetch("_subNav")
//     .then((response) => response.text())
//     .then((html) => {
//       $("#subNav")(html);
//     });
//   fetch("_footer")
//     .then((response) => response.text())
//     .then((html) => {
//       $("#footer")(html);
//     });

//   let materialArray = [];
//   getDatabase("0bd82b3350f549b59c91e755491b2d1f", {
//     filter: {
//       property: "Topic",
//       relation: {
//         contains: "c9c54b75-f73e-4c66-89c9-d7a1c51538f6",
//       },
//     },
//   }).then(async (response) => {
//     for (let i = 0; i < response.length; i++) {
//       let materialData = {
//         id: response[i]?.properties?.ID?.unique_id?.number ?? null,
//         title: response[i]?.properties?.name.title[0]?.plain_text ?? null,
//         text:
//           response[i]?.properties?.content?.rich_text[0]?.text?.content ?? null,
//         image:
//           response[i]?.properties?.images?.rich_text[0]?.plain_text ?? null,
//         tag: response[i]?.properties?.tags?.select?.name ?? null,
//         color:
//           response[i]?.properties?.tags?.select?.name === "Article"
//             ? "#c7c7ff"
//             : response[i]?.properties?.tags?.select?.name === "Story"
//             ? "#ffbdbd"
//             : response[i]?.properties?.tags?.select?.name === "Conversation"
//             ? "#fff7a8"
//             : "#bfbfbf",
//       };
//       materialArray.push(materialData);

//       //Formatting the response text line break
//       let content = materialData.text.replace(/\n/g, "<br>");

//       let material = ``;
//       if (i % 2 == 0) {
//         material = `
//         <div class="materials" onclick="handlePopup(${i})" >
//           <Link src="#" style="border-radius: 20px"
//             ><img class="material-img" src="${materialData.image}"
//           /></Link>
//           <div class="text-container">
//             <h2>
//               ${materialData.title}
//               <br/>
//               <span class="tag" style="background-color: ${materialData.color};"> ${materialData.tag}</span>
//             </h2>
//             <p>
//               ${content}
//             </p>
//           </div>
//         </div>`;
//       } else {
//         material = `
//         <div class="materials reverse" onclick="handlePopup(${i})" >
//           <Link src="#" style="border-radius: 20px"
//             ><img class="material-img" src="${materialData.image}"
//           /></Link>
//           <div class="text-container">
//             <h2>
//               ${materialData.title}
//               <br/>
//               <span class="tag" style="background-color: ${materialData.color};">${materialData.tag}</span>
//             </h2>
//             <p>
//               ${content}
//             </p>
//           </div>
//         </div>`;
//       }
//       $(".grid-container").append(material);

//       //Create a function to open the popup
//       window.handlePopup = function (id) {
//         let currentPopup = {
//           title: response[id]?.properties?.name?.title[0]?.plain_text ?? null,
//           text:
//             response[id]?.properties?.content?.rich_text[0]?.text?.content ??
//             null,
//           image:
//             response[id]?.properties?.images?.rich_text[0]?.plain_text ?? null,
//         };
//         let popupContent = textPreprocess(currentPopup.text, nameList);
//         let popup = ``;
//         popup = `
//         <div class="popup">
//           <div class="image-holder">
//             <img class="popup-img" src="${currentPopup.image}" />
//           </div>
//           <div class="text-holder">
//             <img
//               class="popup-close-button"
//               src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMjczOTMgMzYuNzI5TDIxLjAwMjkgMjFMMzYuNzMxOSAzNi43MjlNMzYuNzMxOSA1LjI3MUwyMC45OTk5IDIxTDUuMjczOTMgNS4yNzEiIHN0cm9rZT0iIzM1QTAwMCIgc3Ryb2tlLXdpZHRoPSIxMC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=="
//               style="width: 24px"
//               onclick = "closePopup()"
//             />
//             <div class="text-container">
//               <div class="title-container">
//                 <h3>
//                   ${currentPopup.title}
//                 </h3>
//               </div>
//               <div class="scroll-box">
//                 <p class="scroll-content left">
//                   ${popupContent}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         `;
//         $(".popup-flex-container").append(popup);
//         displayDetails(vocabs);

//         //Function to hide the popup
//         window.closePopup = function () {
//           $(".popup-flex-container").addClass("hidden");
//           $(".popup").remove();
//         };
//       };
//     }

//     //Function to hide the popup-flex-container
//     $(".materials").on("click", function () {
//       $(".popup-flex-container").removeClass("hidden");
//     });
//   });
// });

// const textPreprocess = (text, vocabNameList) => {
//   let replaceBlankSpace = text.replace(/\n/g, "<br>");
//   // CHECK WORDS IN TEXT
//   const words = replaceBlankSpace.split(/\s+/);
//   const filterText = words.map((word) => {
//     if (vocabNameList.includes(word.toLowerCase())) {
//       return `<u class="vocabWord">${word}</u>`;
//     } else {
//       return word;
//     }
//   });
//   const processedText = filterText.join(" ");
//   return processedText;
// };

// const displayDetails = (vocabs) => {
//   const text = document.querySelector(".scroll-content");
//   const words = text.querySelectorAll(".vocabWord");
//   words.forEach((word) => {
//     word.addEventListener("click", () => {
//       const wordElement = word.textContent.trim();
//       const wordDetail = vocabs.find((vocab) => vocab.Name === wordElement);
//       if (wordDetail) {
//         console.log("Word: ", word);
//         console.log("Word detail: ", wordDetail);
//         console.log("Word meaning: ", wordDetail.Meaning);
//       }
//     });
//   });
// };
