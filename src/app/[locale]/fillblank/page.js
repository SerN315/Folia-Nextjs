"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../js/api/databaseAPI";
import "../scss/fill-blank.scss";
import { useSearchParams } from "next/navigation";

export default function FillBlank() {
  const locale = getCookie("NEXT_LOCALE");
  console.log(locale); // Logs the value of the locale cookie or null if not found
  const searchParams = useSearchParams(); // Access query params
  const id = searchParams.get("topic"); // Get the 'topic' query param
  const idd = searchParams.get("id");
  const [questions, setQuestions] = useState([]);
  const [answersList, setAnswersList] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // Array of arrays for user answers
  const [resultMessage, setResultMessage] = useState([]);
  const [answerStatus, setAnswerStatus] = useState([]); // Track correctness
  const storedTopicName = localStorage.getItem(`Topic`);
  const storedCategoryName = localStorage.getItem(`Category`) ;
  const topicName = storedTopicName ? storedTopicName.replace(/"/g, "") : "null";
  const categoryName = storedCategoryName ? storedCategoryName.replace(/"/g, "") : "null";

  const topicId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("topic")
      : "";

  useEffect(() => {
    getDatabase("34211db3f19c494ca53662f08af164db", {
      filter: {
        property: "Topics",
        relation: { contains: "c9c54b75-f73e-4c66-89c9-d7a1c51538f6" },
      },
    }).then((responses) => {
      const selectedQuestions = randomQuestion(responses, 3);
      setQuestions(selectedQuestions);
      setUserAnswers(selectedQuestions.map(() => [])); // Initialize with an empty array for each question

      const allAnswers = selectedQuestions.map((question) =>
        question.properties.Answers.rich_text[0].plain_text.split(", ")
      );
      setAnswersList(allAnswers);
    });
  }, []);

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

  const textDecoder = (sentence, questionIndex) => {
    const parts = sentence.split(/_+/g); // Split the sentence by underscores
    return parts.map((part, partIndex) => {
      if (partIndex < parts.length - 1) {
        return (
          <span key={partIndex}>
            {part}
            <input
              className={`answer ${
                answerStatus[questionIndex]
                  ? answerStatus[questionIndex] === true
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              type="text"
              value={userAnswers[questionIndex][partIndex] || ""} // Use nested index
              onChange={(e) => handleInputChange(e, questionIndex, partIndex)} // Pass partIndex
              autoComplete="off"
              aria-label="input-word"
            />
          </span>
        );
      }
      return <span key={partIndex}>{part}</span>;
    });
  };

  const handleInputChange = (e, questionIndex, partIndex) => {
    const newUserAnswers = [...userAnswers];
    if (!newUserAnswers[questionIndex]) {
      newUserAnswers[questionIndex] = []; // Initialize if undefined
    }
    newUserAnswers[questionIndex][partIndex] = e.target.value; // Update the specific answer
    setUserAnswers(newUserAnswers);
  };

  const handleCheckAnswers = () => {
    const correctList = [];
    let countCorrect = 0;

    userAnswers.forEach((userAnswerArray, questionIndex) => {
      userAnswerArray.forEach((answer, partIndex) => {
        if (answer.toLowerCase() === answersList[questionIndex][partIndex].toLowerCase()) {
          countCorrect++;
          correctList[questionIndex] = correctList[questionIndex] || [];
          correctList[questionIndex][partIndex] = true;
        } else {
          correctList[questionIndex] = correctList[questionIndex] || [];
          correctList[questionIndex][partIndex] = false;
        }
      });
    });

    setResultMessage(
      countCorrect > answersList.length - 3
        ? `You answered ${countCorrect} out of ${answersList.length} questions correctly. Congrats!`
        : `You answered ${countCorrect} out of ${answersList.length} questions correctly. Try to learn more!`
    );

    setAnswerStatus(correctList);
  };

  const handleReload = () => {
    setUserAnswers(questions.map(() => [])); // Reset to empty arrays for each question
    setResultMessage("");
    setAnswerStatus([]);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fill-in-the-blank - Folia</title>
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <main className="fill-blank">
      <div className="nav-panel">
          <p className="nav-panel__navigation">
            <Link href="/cate?topic=folia-language" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">{categoryName}</span> &gt; Topic:
            <span className="topic">{topicName}</span>
          </p>
          <h3 className="nav-panel__main-title">Fill The Blank</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`vocabularies?topic=${id}`}
              className="nav-panel__game-list__game-item vocabulary-link"
            >
              <i className="fa-solid fa-a" />
              <p>Vocabulary</p>
            </Link>
            <Link
              href={`flashcard?topic=${id}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-images" />
              <p>FlashCard</p>
            </Link>
            <Link
              href={`/multichoicesFT?topic=${id}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Multiple Choices</p>
            </Link>
            <Link
              href={locale !== "vi" ? `arrange?topic=${id}` : undefined}
              className={`nav-panel__game-list__game-item d-and-d-link ${
                locale === "vi" ? "disabled-link" : ""
              }`}
              onClick={(e) => {
                if (locale === "vi") {
                  e.preventDefault(); // Prevent navigation
                }
              }}
            >
              <i className="fa-regular fa-images" />
              <p>Arrange</p>
            </Link>
            <Link
              href={`dragdrop?topic=${id}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Drag&amp;Drop</p>
            </Link>
            
          </div>
        </div>

        <div className="fill-blank__main-content">
          <form id="fillForm" className="fill-blank__main-content__container">
            <div className="fill-blank__main-content__container__text">
              {questions.map((question, index) => {
                const sentence =
                  question.properties.Sentence.rich_text[0].plain_text;
                return (
                  <div
                    key={index}
                    className="fill-blank__main-content__container__text__item"
                  >
                    <h6>Sentence {index + 1}:</h6>
                    <p>{textDecoder(sentence, index)}</p>
                    {answerStatus[index] && answerStatus[index].some(status => status === false) && userAnswers[index].some(answer => answer) && (
                      <span className="correct-answer" style={{
                        color:"green",
                        fontWeight:"600",
                      }}>
                        Correct answer: {answersList[index].join(", ")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="fill-blank__main-content__container__submit">
              <button
                className="fill-blank__main-content__container__submit-btn"
                type="button"
                onClick={handleCheckAnswers}
              >
                Submit
              </button>
              <button className="reload" onClick={handleReload}>
                <i className="fa-solid fa-arrow-rotate-right fa-xl" />
              </button>
              <button
                className="new"
                onClick={() => setQuestions(randomQuestion(questions, 3))}
              >
                <i className="fa-solid fa-play fa-xl" />
              </button>
              <p className="fill-blank__main-content__container__submit__result">
                {resultMessage}
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
