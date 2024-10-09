$(function () {
  fetch("_topNav")
    .then((response) => response.text())
    .then((html) => {
      $("#topNav")(html);
    });
  fetch("_subNav")
    .then((response) => response.text())
    .then((html) => {
      $("#subNav")(html);
    });
  fetch("_footer")
    .then((response) => response.text())
    .then((html) => {
      $("#footer")(html);
    });
});
