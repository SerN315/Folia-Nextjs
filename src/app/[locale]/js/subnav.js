// import { getDatabase } from "./api/databaseAPI";

// $(function () {
//   const select = document.querySelector(".select");
//   const caret = document.querySelector(".caret");
//   const menu = document.querySelector(".subnav-menu");
//   const options = document.querySelectorAll(".subnav-menu li");
//   const selected = document.querySelector(".selected");

//   select.addEventListener("click", () => {
//     select.classList.toggle("select-clicked");
//     //   // Caret rotate
//     caret.classList.toggle("caret-rotate");
//     //   // display menu
//     menu.classList.toggle("hidden");
//     menu.classList.toggle("menu-open");
//   });

//   getDatabase("10087f66f2404f85ac4eee90c2203dc3").then(async (response) => {
//     const topicName = response[9].properties.Name.title[0].plain_text;
//     let topic = `<h2>${topicName}</h2>`;
//     let repsonsive_topic = `${topicName}`;
//     $(".subnav-topic-name").append(topic);
//     $(".selected").append(repsonsive_topic);
//   });

//   options.forEach((option) => {
//     option.addEventListener("click", () => {
//       menu.classList.toggle("menu-open");
//       select.classList.remove("select-clicked");
//       caret.classList.remove("caret-rotate");
//       options.forEach((option) => {
//         option.classList.remove("active");
//       });
//       option.classList.add("active");
//     });
//   });
// });
