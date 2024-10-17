// import { getDatabase } from "./api/databaseAPI";


// //Tải các dữ liệu về topic phổ biến
// const mostLearnedTopic = document.querySelector(".home__most-learned__list");

// getDatabase("509c3cca958545f0949070dec832e093").then((response) => {
//   let addedData = ``;
//   response.forEach((item) => {
//     const topicId = item.properties.TopicName.relation[0].id;
//     const topicName = item.properties.TopicNameDev.formula.string;
//     const categoryName = item.properties.CategoryNameDev.formula.string;
//     const image =
//       item.properties.ImageDev.rollup.array[0].rich_text[0].plain_text;
//     const wordCount = item.properties.WordsCountDev.formula.number;
//     addedData = `
//     <a href="vocabularies?topic=${topicId}" class="home__most-learned__list__item">
//       <div class="card text-bg-dark">
//         <img src=${image} class="card-img"/>
//         <div class="card-img-overlay">
//           <h6>${categoryName}</h6>
//           <h4>${topicName}</h4>
//           <p>Total Words: ${wordCount}</p>
//         </div>
//       </div>
//     </a>
//     `;
//     mostLearnedTopic.insertAdjacentHTML("beforeend", addedData);
//   });
// });

// //Tải các dữ liệu về category
// getDatabase("529b7e6a8ba74d799e05c8a7bca72252").then((response) => {
//   const container = document.querySelector(".home__suggest");
//   let addedData = ``;
//   response.forEach((item) => {
//     let cateId = item.properties.CategoryName.relation[0].id;
//     let cateName = item.properties.CategoryNameDev.formula.string;
//     addedData = `
//     <div class="home__suggest__cate">
//       <div class="home__suggest__cate__title">
//         <h4>${cateName}</h4>
//       </div>
//     <div class="home__suggest__cate__list" cateID="${cateId}">
//     </div>
//     `;
//     container.insertAdjacentHTML("beforeend", addedData);
//     getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
//       filter: {
//         property: "Category",
//         relation: {
//           contains: cateId,
//         },
//       },
//     }).then((response) => {
//       const cate = document.querySelector([`div[cateID="${cateId}"]`]);
//       response.forEach((topic) => {
//         let topicId = topic.id;
//         let topicName = topic.properties.Name.title[0].plain_text;
//         let topicImage = topic.properties.SVG.rich_text[0].plain_text;
//         let wordCount = topic.properties.WordCountDev.formula.number;
//         addedData = `
//         <div class="home__suggest__cate__list__item">
//           <a href="vocabularies?topic=${topicId}" style="width: 100%">
//             <div class="card">
//               <img
//                 src=${topicImage}
//                 class="card-img-top"
//                 alt="..."
//               />
//               <div class="card-body">
//                 <h5 class="card-body__title">${topicName}</h5>
//                 <p class="card-body__wrd-cnt">Total Words: ${wordCount}</p>
//               </div>
//             </div>
//           </a>
//         `;
//         cate.insertAdjacentHTML("beforeend", addedData);
//       });
//     });
//   });
// });

// //Chỉnh link sang trang cate
// document.querySelector(".cate-link").href = `/cate?topic=folia-language`;
