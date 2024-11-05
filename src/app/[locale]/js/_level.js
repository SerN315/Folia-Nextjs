function toggleActiveClass() {
  const levels = document.querySelectorAll(".wrd-lv");
  const first = document.querySelector(".wrd-lv.first-link");
  first.addEventListener("click", () => {
    levels.forEach((level) => {
      level.classList.toggle("active");
    });
  });
}

export { toggleActiveClass };
