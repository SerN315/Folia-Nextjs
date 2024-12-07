// function navigationPanel() {
//   const dropdownBtn = document.querySelector(".nav-panel__dropdown");
//   const dropdownContent = document.querySelector(".nav-panel__game-list");
//   dropdownBtn.addEventListener("click", () => {
//     dropdownBtn.classList.toggle("openDropdown");
//     dropdownContent.classList.toggle("openDropdown");
//   });
//   const urlParams = new URLSearchParams(window.location.search);
//   const id = urlParams.get("topic");

//   const functions = ["cate", "vocabularies", "flashcard", "d_and_d"];
//   functions.forEach((functionName) => {
//     const el = document.querySelector(`[${functionName}]`);
//     if (el) {
//       el.href = `/${functionName}?topic=${id}`;
//     }
//   });
// }

// export { navigationPanel };
