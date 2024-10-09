// IMPORTS
import { getDatabase } from "./api/databaseAPI";
import { navigationPanel } from "./_navigation";
navigationPanel();

//COMPONENTS

//NAVIGATION PANEL
const dropdownBtn = document.querySelector(".nav-panel__dropdown");
const dropdownContent = document.querySelector(".nav-panel__game-list");
dropdownBtn.addEventListener("click", () => {
  dropdownBtn.classList.toggle("openDropdown");
  dropdownContent.classList.toggle("openDropdown");
});
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("topic");
document.querySelector("[cate]").href = "/cate?topic=folia-language";
document.querySelector("[vocab]").href = `/vocabularies?topic=${id}`;
document.querySelector("[flashcard]").href = `/flashcard?topic=${id}`;
document.querySelector("[d-and-d]").href = `/d_and_d?topic=${id}`;

//FORMAT SENTENCE
const textDecoder = (sentence) => {
  let modifiedSentence = sentence.replace(
    /_+/g,
    `<input class="answer" type="text" autocomplete="off" aria-label="input-word" />`
  );
  modifiedSentence = modifiedSentence.replace(/\n/g, `<br/>`);
  return modifiedSentence;
};
//RANDOM QUESTIONS
const randomQuestion = (questionArray, numberOfElements) => {
  const randomQuestions = [];
  while (randomQuestions.length < numberOfElements) {
    const randomIndex = Math.floor(Math.random() * questionArray.length);
    if (!randomQuestions.includes(questionArray[randomIndex])) {
      randomQuestions.push(questionArray[randomIndex]);
    }
  }
  return randomQuestions;
};

let answersList = [];
const textContainer = document.querySelector(
  ".fill-blank__main-content__container__text"
);

//MAIN FUNCTION
const main = (responses) => {
  answersList = [];
  textContainer.innerHTML = "";
  const randomQuestions = randomQuestion(responses, 3);
  let countSentence = 0;
  randomQuestions.forEach((response) => {
    countSentence += 1;
    const sentence = response.properties.Sentence.rich_text[0].plain_text;
    const answers =
      response.properties.Answers.rich_text[0].plain_text.split(", ");
    answers.forEach((answer) => {
      answersList.push(answer);
    });
    const modifiedSentence = textDecoder(sentence);
    const addContent = `
    <div class="fill-blank__main-content__container__text__item">
      <h6>Sentence ${countSentence}:</h6>
      <p>
        ${modifiedSentence}
      </p>
    </div>
    `;
    textContainer.insertAdjacentHTML("beforeend", addContent);
  });

  //CHECK THE CORRECT ANSWER
  const submitBtn = document.querySelector(
    ".fill-blank__main-content__container__submit-btn"
  );
  const userAnswers = document.querySelectorAll(".answer");

  submitBtn.addEventListener("click", () => {
    //CHECK IF USER CLICK ON SUBMIT BUTTON TWICE?
    userAnswers.forEach((userAnswer) => {
      if (userAnswer.classList.contains("incorrect")) {
        userAnswer.value = ``;
      }
    });
    const userAnswersList = [];
    let countCorrect = 0;
    const correctList = [];
    correctList.length = answersList.length;
    userAnswers.forEach((userAnswer) => {
      userAnswersList.push(userAnswer.value);
      userAnswer.disabled = true;
    });
    for (let i = 0; i < answersList.length; i++) {
      if (userAnswersList[i].toLowerCase() === answersList[i].toLowerCase()) {
        countCorrect++;
        correctList[i] = true;
        userAnswers[i].classList.add("correct");
      } else {
        correctList[i] = false;
        userAnswers[i].classList.add("incorrect");
        userAnswers[
          i
        ].value = `${userAnswers[i].value} (correct: ${answersList[i]})`;
      }
    }
    const result = document.querySelector(
      ".fill-blank__main-content__container__submit__result"
    );
    if (countCorrect > answersList.length - 3) {
      result.innerHTML = `You answered ${countCorrect} out of ${answersList.length} questions correctly. Congrats!`;
    } else if (countCorrect < 5) {
      result.innerHTML = `You answered ${countCorrect} out of ${answersList.length} questions correctly. Try to learn more!`;
    } else {
      result.innerHTML = `You answered ${countCorrect} out of ${answersList.length} questions correctly!`;
    }
  });

  //RELOAD BUTTON
  const reloadBtn = document.querySelector(".reload");
  const result = document.querySelector(
    ".fill-blank__main-content__container__submit__result"
  );
  reloadBtn.addEventListener("click", () => {
    userAnswers.forEach((userAnswer) => {
      userAnswer.value = "";
      userAnswer.disabled = false;
      userAnswer.classList.remove("correct");
      userAnswer.classList.remove("incorrect");
    });
    result.innerHTML = "";
  });

  // NEXT BUTTON
  const nextBtn = document.querySelector(".new");
  nextBtn.addEventListener("click", () => {
    const items = document.querySelectorAll(
      ".fill-blank__main-content__container__text__item"
    );
    const relsult = document.querySelector(
      ".fill-blank__main-content__container__submit__result"
    );
    relsult.innerHTML = "";
    items.forEach((item) => {
      item.innerHTML = "";
    });
    main(responses);
  });
};

//CALL DATA FROM NOTION API (AND INSERT THAT DATA INTO MAIN FUNCTION)
getDatabase("34211db3f19c494ca53662f08af164db", {
  filter: {
    property: "Topics",
    relation: {
      contains: "c9c54b75-f73e-4c66-89c9-d7a1c51538f6",
    },
  },
}).then((responses) => {
  main(responses);
});
