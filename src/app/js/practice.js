$(function () {
  fetch("_topNav.html")
    .then((response) => response.text())
    .then((html) => {
      $("#topNav").html(html);
    });
  fetch("_subNav.html")
    .then((response) => response.text())
    .then((html) => {
      $("#subNav").html(html);
    });
  fetch("_footer.html")
    .then((response) => response.text())
    .then((html) => {
      $("#footer").html(html);
    });
});
