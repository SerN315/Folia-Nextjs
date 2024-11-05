// import { getDatabase } from "./api/databaseAPI";
// import { db } from "../../src/app/firebase/authenciation.js";

// let categories = [];
// getDatabase("791918f3d802459291dcc45c7d8f9254", {
//   // filter: {
//   //   property: "topic",
//   //   relation: {
//   //     contains: id,
//   //   },
//   // },
//   sorts: [
//     {
//       property: "Name",
//       direction: "ascending",
//     },
//   ],
// })
//   .then(async (response) => {
//     console.log(response);
//     displayElements(response);
//   })
//   .catch((error) => {
//     console.error("Error fetching data from the API:", error);
//   });

// function displayElements(elements) {
//   // $(".content").empty(); // Clear existing flashcards
//   elements.forEach((item) => {
//     const challengeId = item.id;
//     const relationIds = item.properties.Categories.multi_select.map(
//       (rel) => rel.name
//     );
//     const tags = item.properties.Tags.multi_select.map((rel) => rel.name);
//     const categories = relationIds.slice(0, 10); // Lấy 2 ID từ relation
//     const name = item.properties.Name.title[0]?.plain_text;
//     const tag = tags.slice(0, 10);
//     const id = item.properties.id.number;
//     let challengeitem = `                <div class="challenges__item">
//                     <div class="challenges__item__left">
//                         <div class="title">
//                             <h2>Challenge ${id}</h2>
//                         </div>
//                         <div class="tquestion">
//                         ${tag.map((ta) => `<h3>${ta}</h3>`).join("")}
//                         </div>
//                     </div>

//                     <div class="challenges__item__middle">
//                         <div class="title">
//                             <h2>Categories</h2>
//                         </div>
//                         <div class="tquestion">
// ${categories.map((category) => `<h4>${category}</h4>`).join("")}
//                         </div>
//                     </div>
//                     <div class="challenges__item__right">
//                         <div class="checks">
//                             <i class="fa-solid fa-check"></i>
//                         </div>
//    <div id="startchallenge">
//                         <Link href="multichoices?topic=${name}&id=${challengeId}&cateID=${categories}">Start</Link>
//                     </div>
//                     </div>
//                 </div>`;
//     $(".challenges").append(challengeitem);
//   });
// }
