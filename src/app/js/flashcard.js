import { getDatabase, getDatabase2 } from "./api/databaseAPI";
import { navigationPanel } from "./_navigation";
navigationPanel();
import { getCookie } from "./cookie";
import config from "./config";
import axios from "axios";
import { getAudio } from "./api/pronunciationApi";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("topic");
let shuffledResponse = [];
let currentIndex = 0;
let autoCycleInterval;

// Navigation panel
document.querySelector(".cate-link").href = "/cate?topic=folia-language";
document.querySelector(
  ".vocabulary-link"
).href = `vocabularies?topic=${id}`;
document.querySelector(".d-and-d-link").href = `d_and_d?topic=${id}`;

// Define favoritesList function
const favoritesList = function () {
  $(".favorites").on("click", (e) => {
    e.stopPropagation();
    if (!jwt) {
      alert("You need to log in");
      return;
    }

    // Get the currently displayed flashcard item based on currentIndex
    const currentFlashcard = $(".content-d").eq(currentIndex);
    const id = currentFlashcard.attr("fid"); // Get the id attribute value

    // Toggle favorite status (add/remove from favorites)
    if ($(e.currentTarget).css("color") === "rgb(255, 0, 0)") {
      // Check if already in favorites
      $(e.currentTarget).css("color", ""); // Remove red color
      // Make API call to remove from favorites
      axios
        .post(
          `${config.apiUrl}/users/removefavorites`,
          JSON.stringify({ id: id }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + getCookie("jwt"),
            },
          }
        )
        .then((response) => {
          console.log("Removed from favorites");
        })
        .catch((error) => {
          console.log("Error removing from favorites");
        });
    } else {
      $(e.currentTarget).css("color", "red"); // Add red color to indicate favorite
      // Make API call to add to favorites
      axios
        .patch(`${config.apiUrl}/users/favorites`, JSON.stringify({ id: id }), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getCookie("jwt"),
          },
        })
        .then((response) => {
          console.log("Added to favorites");
        })
        .catch((error) => {
          console.log("Error adding to favorites");
        });
    }
  });
};

fetch("_topNav")
  .then((response) => response.text())
  .then((html) => {
    $("#topNav")(html);
  });

fetch("_footer")
  .then((response) => response.text())
  .then((html) => {
    $("#footer")(html);
  });
let ht2 = [
  "8e3fdb05-5ef5-4e77-b400-0d8767fb539e",
  "730846b3-4f7b-4367-b004-f3842d630b7e",
  "61e2d92a-e3a6-418f-939f-99ede4c5b185",
  "53114cf6-dadc-4c5d-b08a-c04d1b433274",
  "d7585a20-67e8-48d1-b097-05f5f498edd9",
  "3264dc41-5c6f-4e4f-9ece-71136a57afe3",
  "28704707-dc7e-45cb-9765-16865d32b9c5",
  "46852722-fb9f-4935-b2d3-add5bff13640",
  "94879267-de61-4edb-baf7-ac99849ebe21",
];

let codelabid = [
  "602c19aa0a48437aa38b322e5863d7b6",
  "9b15c0bb39e4484a95cb054040485d0c",
  "8b5d55aff1be4580b23e4e34142c7d09",
  "aac0459b84bf48019510a8f2c73f7eab",
  "3dc16a1a73064fdf8b4c1b199077383e",
];
//shuffle data
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
if (!ht2.includes(id) & !codelabid.includes(id)) {
  // Define a variable to store the retrieved data
  let allData = [];

  // Retrieve all data from the database and store it
  getDatabase("8240dd072127443f8e51d09de242c2d9", {
    filter: {
      property: "Topic",
      relation: {
        contains: id,
      },
    },
  }).then((response) => {
    // Store the retrieved data
    allData = response;
    // Display the first 15 elements
    displayElements(shuffleArray(allData.slice(0, 15)));
  });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Event listener for the shuffle button
  $("#shuffle").on("click", function () {
    // Shuffle the stored data
    const shuffledData = shuffleArray(allData);
    // Display the first 15 shuffled elements
    displayElements(shuffledData.slice(0, 15));
  });

  // Function to display elements on the page
  function displayElements(elements) {
    $(".content").empty(); // Clear existing flashcards
    elements.forEach((item) => {
      const fid = item.properties.id;
      const word = item.properties.Name.title[0]?.plain_text;
      const set = item.properties.Set.multi_select[0]?.name;
      const meaning = item.properties.Meaning.rich_text[0]?.plain_text;
      const pronunciation =
        item.properties.Pronunciation.rich_text[0]?.plain_text;
      const img = item.properties.img.rich_text[0]?.plain_text;
      let flashcards = `<div class="content-d" fid="${fid}">
            <div class="word">
            <h2>${word}</h2>
            <h3>${pronunciation}</h3>
            <h3>${set}<h3>
            </div>
            <div class=flashcardimg>
            <img src="${img}" alt="${word}">
            <h2>${meaning}<h2>
            </div>
            </div>`;
      ///Show FlashCard Content
      $(".content").append(flashcards);
      $(".loading").hide();
      $(".spinner-border").hide();
      favoritesList();
    });

    // Function to shuffle an array (Fisher-Yates shuffle)

    const divs = document.getElementsByClassName("content-d");

    // Set the initial index to 0 (first div)
    currentIndex = 0;
    showDiv(currentIndex);
    $("#autoCycleButton").on("click", function () {
      $("#autoCycleButton").css("display", "none");
      $("#pause").css("display", "block");
      const card = $(".card");
      $(card).removeClass("active");
      setTimeout(function () {
        $(card).addClass("active");
      }, 1000); // 5 seconds
      let cycleCount = 0;
      autoCycleInterval = setInterval(function () {
        if (cycleCount % 2 === 0) {
          // Add "active" class to the current div after half the cycling time
          const card = $(".card");
          $(card).removeClass("active");
          setTimeout(function () {
            $(card).addClass("active");
          }, 1000); // 5 seconds
        }
        currentIndex++;
        if (currentIndex >= divs.length) {
          currentIndex = 0;
          cycleCount++;
          if (cycleCount >= 1) {
            clearInterval(autoCycleInterval);
            cycleCount = 0;

            // Check if the cycling has returned to the original state
            if (currentIndex === 0 && cycleCount === 0) {
              clearInterval(autoCycleInterval);
              clearTimeout();
              $("#autoCycleButton").css("display", "block");
              $("#pause").css("display", "none");
            }
          }
        }

        showDiv(currentIndex);
      }, 2000); // 10 seconds
    });
    $("#pause").on("click", function () {
      clearInterval(autoCycleInterval);
      $("#autoCycleButton").css("display", "block");
      $("#pause").css("display", "none");
    });

    // Function to show the current div and hide others
    function showDiv(index) {
      for (let i = 0; i < divs.length; i++) {
        if (i === index) {
          divs[i].style.opacity = "1";
          divs[i].style.width = "100%";
          divs[i].style.transition = "opacity 0.5s, transform 0.5s, width 0.5s";
        } else {
          divs[i].style.opacity = "0";
          divs[i].style.width = "0%";
          divs[i].style.transition = "opacity 0.5s, transform 0.5s, width 0.5s";
        }
      }
      updateDisplay(index);
    }

    // Function to update the display
    function updateDisplay(index) {
      const displayElement = document.getElementById("now-total");
      displayElement.textContent = `${index + 1} / ${divs.length}`;
    }

    // Show the initial div
    showDiv(currentIndex);

    var currentIndex = 0;
    var startX = 0;
    var distThreshold = 50; // Minimum distance required for a swipe gesture

    // Add event listener to the previous button
    document.getElementById("backB").addEventListener("click", function () {
      navigate(-1);
    });

    // Add event listener to the next button
    document.getElementById("nextB").addEventListener("click", function () {
      navigate(1);
    });

    // Add event listener for swipe gestures
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        navigate(-1);
      } else if (event.key === "ArrowRight") {
        navigate(1);
      }
    });

    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      event.preventDefault(); // Prevent scrolling while swiping
    }

    function handleTouchEnd(event) {
      var distX = event.changedTouches[0].clientX - startX;
      const $card = $(".card");
      if (Math.abs(distX) >= distThreshold) {
        if (distX > 0) {
          $card.removeClass("active");
          navigate(-1); // Swipe right
        } else {
          $card.removeClass("active");
          navigate(1); // Swipe left
        }
      }
    }

    function navigate(direction) {
      currentIndex += direction;
      if (currentIndex < 0) {
        currentIndex = divs.length - 1;
      } else if (currentIndex >= divs.length) {
        currentIndex = 0;
      }
      showDiv(currentIndex);
    }
  }
}
//flashcard fun
else if (ht2.includes(id)) {
  // Define a variable to store the retrieved data
  let allData = [];

  // Retrieve all data from the database and store it
  getDatabase("c3428e69474d46a790fe5e4d37f1600d", {
    filter: {
      property: "topic",
      relation: {
        contains: id,
      },
    },
  }).then((response) => {
    // Store the retrieved data
    allData = response;
    // Display the first 15 elements
    displayElements(allData.slice(0, 15));
  });
  // Function to shuffle an array (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Event listener for the shuffle button
  $("#shuffle").on("click", function () {
    console.log("pressed");
    // Shuffle the stored data
    const shuffledData = shuffleArray(allData);
    // Display the first 15 shuffled elements
    displayElements(shuffledData.slice(0, 15));
  });

  // Function to display elements on the page
  function displayElements(elements) {
    $(".content").empty(); // Clear existing flashcards
    elements.forEach((item) => {
      const word = item.properties.Name.title[0]?.plain_text;
      const meaning = item.properties.Answer_Content.formula.string;
      const pronunciation =
        item.properties.explanation.rich_text[0]?.plain_text;
      const img = item.properties.Img.files?.[0]?.url;
      let flashcards = `<div class="content-d">
            <div class="word">
                <h2 style="font-size:20px; text-align:center">${word}</h2>
            </div>
            <div class="flashcardimg ${img ? "" : "hidden"}">
                ${img ? `<img src="${img}" alt="${word}">` : ""}
                <h2>${meaning}</h2>
                <h3 class="flashcardimg ${
                  pronunciation ? "" : "hidden"
                }">${pronunciation}</h3>
            </div>
        </div>`;
      $(".content").append(flashcards);
      $(".loading").hide();
      $(".spinner-border").hide();
    });

    const divs = document.getElementsByClassName("content-d");

    // Set the initial index to 0 (first div)
    currentIndex = 0;
    showDiv(currentIndex);
    $("#autoCycleButton").on("click", function () {
      $("#autoCycleButton").css("display", "none");
      $("#pause").css("display", "block");
      const card = $(".card");
      $(card).removeClass("active");
      setTimeout(function () {
        $(card).addClass("active");
      }, 1000); // 5 seconds
      let cycleCount = 0;
      autoCycleInterval = setInterval(function () {
        if (cycleCount % 2 === 0) {
          // Add "active" class to the current div after half the cycling time
          const card = $(".card");
          $(card).removeClass("active");
          setTimeout(function () {
            $(card).addClass("active");
          }, 1000); // 5 seconds
        }
        currentIndex++;
        if (currentIndex >= divs.length) {
          currentIndex = 0;
          cycleCount++;
          if (cycleCount >= 1) {
            clearInterval(autoCycleInterval);
            cycleCount = 0;

            // Check if the cycling has returned to the original state
            if (currentIndex === 0 && cycleCount === 0) {
              clearInterval(autoCycleInterval);
              clearTimeout();
              $("#autoCycleButton").css("display", "block");
              $("#pause").css("display", "none");
            }
          }
        }

        showDiv(currentIndex);
      }, 2000); // 10 seconds
    });
    $("#pause").on("click", function () {
      clearInterval(autoCycleInterval);
      $("#autoCycleButton").css("display", "block");
      $("#pause").css("display", "none");
    });

    // Function to show the current div and hide others
    function showDiv(index) {
      for (let i = 0; i < divs.length; i++) {
        if (i === index) {
          divs[i].style.opacity = "1";
          divs[i].style.width = "100%";
          divs[i].style.transition = "opacity 0.5s, transform 0.5s, width 0.5s";
        } else {
          divs[i].style.opacity = "0";
          divs[i].style.width = "0%";
          divs[i].style.transition = "opacity 0.5s, transform 0.5s, width 0.5s";
        }
      }
      updateDisplay(index);
    }

    // Function to update the display
    function updateDisplay(index) {
      const displayElement = document.getElementById("now-total");
      displayElement.textContent = `${index + 1} / ${divs.length}`;
    }

    // Show the initial div
    showDiv(currentIndex);

    var currentIndex = 0;
    var startX = 0;
    var distThreshold = 50; // Minimum distance required for a swipe gesture

    // Add event listener to the previous button
    document.getElementById("backB").addEventListener("click", function () {
      navigate(-1);
    });

    // Add event listener to the next button
    document.getElementById("nextB").addEventListener("click", function () {
      navigate(1);
    });

    // Add event listener for swipe gestures
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        navigate(-1);
      } else if (event.key === "ArrowRight") {
        navigate(1);
      }
    });

    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      event.preventDefault(); // Prevent scrolling while swiping
    }

    function handleTouchEnd(event) {
      var distX = event.changedTouches[0].clientX - startX;
      const $card = $(".card");
      if (Math.abs(distX) >= distThreshold) {
        if (distX > 0) {
          $card.removeClass("active");
          navigate(-1); // Swipe right
        } else {
          $card.removeClass("active");
          navigate(1); // Swipe left
        }
      }
    }

    function navigate(direction) {
      currentIndex += direction;
      if (currentIndex < 0) {
        currentIndex = divs.length - 1;
      } else if (currentIndex >= divs.length) {
        currentIndex = 0;
      }
      showDiv(currentIndex);
    }
  }
}
$(function () {
  const $card = $(".card");
  // const $flashcard = $(".Op1");
  // const $timeattack = $(".Op2");
  // const $headline1 = $(".headline");
  // const $headline2 = $(".headline2");
  // const $fcontent = $(".flashcard-content");
  // const $answers = $(".Answers");
  // const $tcontent = $(".timeAttack");
  const $backbutton = $("#backB");
  const $nextbutton = $("#nextB");

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      $card.removeClass("active");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
      event.preventDefault();
      $card.toggleClass("active");
    }
  });

  $backbutton.on("click", function () {
    $card.removeClass("active");
  });
  $nextbutton.on("click", function () {
    $card.removeClass("active");
  });

  $card.on("click", function () {
    $card.toggleClass("active");
  });

  // $flashcard.on("click", function () {
  //   $headline1.addClass("active");
  //   // $answers.addClass("active");
  //   $timeattack.removeClass("active");
  //   $headline2.removeClass("active");
  //   $tcontent.removeClass("active");
  //   $headline1.removeClass("un-active");
  //   $flashcard.removeClass("un-active");
  //   $fcontent.removeClass("un-active");
  // });

  // $timeattack.on("click", function () {
  // $fcontent.addClass("un-active");
  // $timeattack.addClass("active");
  // $headline2.addClass("active");
  // $tcontent.addClass("active");
  // $headline1.addClass("un-active");
  // $flashcard.addClass("un-active");
  // $headline1.removeClass("active");
  // $answers.removeClass("active");
  // $fcontent.removeClass("active");
  // });
});
