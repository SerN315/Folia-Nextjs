import { getDatabase } from "./api/databaseAPI";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("topic");
if (id == "folia-language") {
  const maxRetries = 10; // Maximum number of retries
  const initialDelay = 100; // Initial delay in milliseconds
  let retryAttempts = 0; // Counter for retry attempts

  // Call handleResponses() function directly after retrieving data from local storage
  const storedResponse1 = localStorage.getItem("response1");
  const storedResponse2 = localStorage.getItem("response2");

  if (storedResponse1 && storedResponse2) {
    const response1 = JSON.parse(storedResponse1);
    const response2 = JSON.parse(storedResponse2);
    handleResponses(response1, response2);
    console.log("Handle Response");
  } else {
    console.log("Make Requests");
    makeRequests();
  }

  function makeRequests() {
    Promise.all([
      getDatabase("f52cea04f3cd43239e0c8a409f67c8e8", {
        sorts: [
          {
            property: "Priority",
            direction: "ascending",
          },
        ],
      }),
      getDatabase("10087f66f2404f85ac4eee90c2203dc3", {}),
    ])
      .then(([response1, response2]) => {
        const isResponse1Updated =
          JSON.stringify(response1) !== storedResponse1;
        const isResponse2Updated =
          JSON.stringify(response2) !== storedResponse2;

        if (isResponse1Updated || isResponse2Updated) {
          // If the responses are updated, store the new responses in local storage
          localStorage.setItem("response1", JSON.stringify(response1));
          localStorage.setItem("response2", JSON.stringify(response2));
        }

        handleResponses(response1, response2);
        retryAttempts = 0;
      })
      .catch((error) => {
        console.error(error);

        // Retry the requests if maximum retry attempts not reached
        if (retryAttempts < maxRetries) {
          retryAttempts++;
          const delay = initialDelay * Math.pow(2, retryAttempts);

          console.log(`Retrying requests in ${delay} milliseconds...`);

          // Delay before retrying
          // setTimeout(makeRequests, delay);
        } else {
          console.error(
            "Maximum retry attempts reached. Unable to complete requests."
          );
        }
      });
  }

  function handleResponses(response1, response2) {
    console.log(response1);
    console.log(response2);
    $(".category__content").empty();

    response1.forEach((item) => {
      let cateID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let cateindi = `
      <div class="indi" id="${name}">
        <h1>${name}</h1>
      </div>
      <div id="${cateID}" class="topic-list"></div>
    `;

      // Add categories
      let cateHTML = `
      <div class="item">
        <h1>${name}</h1>
        <div id=${cateID} class="topic-container"> 
        </div>
      </div>
      `;
      $(".category__content").append(cateHTML);

      // Filtering for related topics
      let relatedTopic = response2.filter((topic) => {
        return topic.properties.Category.relation[0]?.id === cateID;
      });

      // Add topics
      relatedTopic.forEach((topic) => {
        let topicId = topic.id;
        let existingTopic = $(
          `#${cateID} .card.topic[data-topic-id="${topicId}"]`
        );

        if (existingTopic.length === 0) {
          let topicName = topic.properties.Name.title[0]?.plain_text;
          let formulaValue = topic.properties.Vocab.formula.string;

          if (formulaValue) {
            const words = formulaValue.split(" ");
            if (words.length > 4) {
              const count = words.length;
              let img = topic.properties.SVG.rich_text[0]?.plain_text;
              let topicHTML = `
              <Link href="vocabularies?topic=${topicId}" class="topic">
                <div class="topic__img">
                  <img src="${img}" />
                </div>
                <div class="topic__text">
                  <h3>${topicName}</h3>
                  <p>Total words: ${count}</p>
                </div>
              </Link>
              `;
              $(`#${cateID}`).append(topicHTML);
            }
          }
        }
      });
      $(".loading").hide();
    });
  }
  // Start making requests
  makeRequests();
}

// FOLIA - ASVAB
if (id == "folia-asvab") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("d62d1d0bae164347b13143e0503a5280", {}).then((response) => {
    // Clear the existing content
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];

    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let SVG = item.properties.SVG.rich_text[0]?.plain_text;
      let fname = item.properties.Fullname.rich_text[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${topicID}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${topicID}">
          <Link href="multichoices?topic=${topicID}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${fname}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(topicID);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
  });
  function getRandomColor() {
    var color = Math.floor(Math.random() * 16777216).toString(16);
    // Avoid loops.
    return "#000000".slice(0, -color.length) + color;
  }
}

if (id == "folia-SAT") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("954089bc53fb407192bcaec2549725a1", {}).then((response) => {
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];
    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let SVG = item.properties.img.rich_text[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let fname = item.properties.fname.rich_text[0]?.plain_text;
      let db = item.properties.db.rich_text[0]?.plain_text;
      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${fname}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${fname}">
        <Link href="multichoices?topic=${db}&tag=${fname}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${name}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(name);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
    indi.removeClass("hidden");
  });
}

if (id == "folia-GED") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("e7d0c4eb138342cfa988c5f39ea55ed6", {}).then((response) => {
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];
    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let SVG = item.properties.img.rich_text[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let fname = item.properties.fname.rich_text[0]?.plain_text;
      let db = item.properties.db.rich_text[0]?.plain_text;
      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${fname}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${fname}">
        <Link href="multichoices?topic=${db}&tag=${fname}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${name}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(fname);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
    indi.removeClass("hidden");
  });
}

if (id == "folia-NCLEX") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("5aef13734f3345269127919131ce875d", {}).then((response) => {
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];
    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let SVG = item.properties.img.rich_text[0]?.plain_text;
      let fname = item.properties.fname.rich_text[0]?.plain_text;
      let db = item.properties.db.rich_text[0]?.plain_text;
      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${fname}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${fname}">
        <Link href="multichoices?topic=${db}&tag=${fname}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${name}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(fname);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
    indi.removeClass("hidden");
  });
}

if (id == "folia-ACT") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("818ef610f58041d4a760af1349e23791", {}).then((response) => {
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];
    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let SVG = item.properties.img.rich_text[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let fname = item.properties.fname.rich_text[0]?.plain_text;
      let db = item.properties.db.rich_text[0]?.plain_text;
      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${fname}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${fname}">
        <Link href="multichoices?topic=${db}&tag=${fname}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${name}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(fname);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
    indi.removeClass("hidden");
  });
}

if (id == "folia-GRE") {
  let indi = document.getElementsByClassName("indi");
  getDatabase("e40b9cb547044e8d92bc1f4385bdaa52", {}).then((response) => {
    $(".topic-list").empty();
    response = response.reverse();
    const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];
    response.forEach((item) => {
      let topicID = item.id;
      let name = item.properties.Name.title[0]?.plain_text;
      let SVG = item.properties.img.rich_text[0]?.plain_text;
      let des = item.properties.Des.rich_text[0]?.plain_text;
      let fname = item.properties.fname.rich_text[0]?.plain_text;
      let db = item.properties.db.rich_text[0]?.plain_text;

      let existingTopic = $(
        `.topic-list .card.topic[data-topic-id="${fname}"]`
      );
      if (existingTopic.length === 0) {
        let cateindi = `
        <div class="card topic" data-topic-id="${fname}">
        <Link href="multichoices?topic=${db}&tag=${fname}">
            <div class="topic-img" style="background-image:url('${SVG}');">
            </div>
          <div class="topic-title">
          <h2>${name}</h2>
          <h3>${des}</h3>
          <h2 style="color:#226500">Practice</h2>
          </div>
          </Link>
        </div>`;
        $(".topic-list").append(cateindi);

        // Store the topic ID in local storage
        storedTopics.push(name);
      }
    });

    // Store the updated topics in local storage
    localStorage.setItem("topics", JSON.stringify(storedTopics));

    $(".loading").hide();
    indi.removeClass("hidden");
  });
}

// GRE quantitative verbal
//  GED reading social science mathematics writing
//   SAT Reading sentences completion / improving sentences / improving paragraphs /error findings / math solving / reading comprehension
//   PMP
//   NCLEX rn pn
//   ACT reading mathematics science english

(function ($) {
  var $window = $(window),
    $html = $("category");

  $window
    .resize(function resize() {
      if ($window.width() < 426) {
        return $html.addClass("mobile");
      }

      $html.removeClass("mobile");
    })
    .trigger("resize");
});

$(function () {
  const $nextbutton = $(".arrow-button");
  const $container = $(".categorylist");

  $nextbutton.on("click", function () {
    $container.toggleClass("active");
    $nextbutton.toggleClass("active");
  });
});
