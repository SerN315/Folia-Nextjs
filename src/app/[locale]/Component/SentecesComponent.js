'use client'
import React, { useState, useEffect } from "react";
import "../scss/arrange.scss";
import { getDatabase } from "../js/api/databaseAPI";
import { useSearchParams } from "next/navigation";
import { getCookie } from "../js/cookie";

const SentenceArrangeGame = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordItems, setWordItems] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTries, setTotalTries] = useState(0);
  const [feedbackColor, setFeedbackColor] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // Access query params
  const topicID = searchParams.get('topic'); // Get the 'topic' query param
  const locale = getCookie("NEXT_LOCALE");
  const localeU = locale.toUpperCase();

  useEffect(() => {
    fetchVocabBasedOnTopic();
  }, []);

  useEffect(() => {
    if (sentences.length > 0) {
      loadSentence();
    }
  }, [currentSentenceIndex, sentences]);

  const fetchVocabBasedOnTopic = () => {
    setLoading(true);
  
    getDatabase("8240dd072127443f8e51d09de242c2d9", {
      filter: {
        property: "Topic",
        relation: {
          contains: topicID,
        },
      },
    })
      .then(async (response) => {
        // Process each item and split sentences using regex
        const sentencePromises = response.flatMap((item) => {
          try {
            const exampleText = item.properties.Example.rich_text[0]?.plain_text;
            if (!exampleText) return []; // Skip items without an example
  
            // Split sentences using a more flexible regex pattern
            const sentencesArray = exampleText.split(/(?<=\.)\s+/);  // Regex for splitting sentences
  
            // Translate each sentence individually and create the sentence object
            return sentencesArray.map(async (sentence) => {
              try {
                const translatedText = await translateText(sentence);
                return {
                  original: sentence,
                  translation: translatedText,
                  diversionWords: ["example", "words", "here"],
                };
              } catch (error) {
                console.error("Translation error for sentence:", sentence, error);
                return {
                  original: sentence,
                  translation: "Translation error", // Fallback for translation failure
                  diversionWords: ["example", "words", "here"],
                };
              }
            });
          } catch (error) {
            console.error("Error processing item:", item, error);
            return []; // Return empty array for this item in case of error
          }
        });
  
        // Wait for all translations to complete and filter out any null entries
        const newSentences = (await Promise.all(sentencePromises)).filter((item) => item !== null);
        setSentences(newSentences);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vocabularies:", error);
        setSentences([]); // Reset sentences on fetch error
        setLoading(false);
      });
  };
  

  const translateText = async (text) => {
    try {
      const response = await fetch("/api/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: localeU }), // Convert locale to uppercase
      });
      const data = await response.json();
      return data.translation || "Translation error";
    } catch (error) {
      console.error("Error translating text:", error);
      return "Translation error";
    }
  };
  
  
  const loadSentence = () => {
    const current = sentences[currentSentenceIndex];
    
    // Split the sentence into words and remove any leading/trailing spaces, then filter out empty strings
    const words = [...current.original.split(/\s+/).map(word => word.trim()).filter(word => word !== ""), ...current.diversionWords];
    
    // Shuffle the words
    setWordItems(shuffleArray(words));
    setUserAnswer([]);
    setFeedbackColor("");
    setIsAnswerChecked(false);
  };
  

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleWordClick = (word) => {
    if (isAnswerChecked) return;

    if (userAnswer.includes(word)) {
      setUserAnswer(userAnswer.filter((w) => w !== word));
      setWordItems([...wordItems, word]);
    } else {
      setUserAnswer([...userAnswer, word]);
      setWordItems(wordItems.filter((w) => w !== word));
    }
  };

  const checkAnswer = () => {
    const currentSentence = sentences[currentSentenceIndex].original;
    const userAnswerString = userAnswer.join(" ");
    setTotalTries(totalTries + 1);

    if (userAnswerString === currentSentence) {
      setCorrectCount(correctCount + 1);
      setFeedbackColor("green");
    } else {
      setFeedbackColor("red");
    }
    setIsAnswerChecked(true);
  };

  const handleNextSentence = () => {
    setCurrentSentenceIndex((currentSentenceIndex + 1) % sentences.length);
  };

  const handleSkip = () => {
    setCurrentSentenceIndex((currentSentenceIndex + 1) % sentences.length);
  };

  return (
    <div className="game_content">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="score">
            <div className="score_right">
              <h1 className="left_score">Right Tries</h1>
              <span className="correct">{correctCount}</span>
            </div>
            <div className="score_right">
              <h1 className="right_score">Total Tries</h1>
              <span className="total">{totalTries}</span>
            </div>
            <button id="play-again-btn" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </section>
          <section className="gameUI">
            <div className="userMeaning">
              <div className="sentencesContainer">
                {sentences[currentSentenceIndex].translation}
              </div>
              <div className="correctContainer" style={{ display: feedbackColor === "red" ? "block" : "none" }}>
                {sentences[currentSentenceIndex].original}
              </div>
            </div>
            <div className="answerContainer" style={{ backgroundColor: feedbackColor }}>
              {userAnswer.map((word, index) => (
                <span key={index} className="wordItem" onClick={() => handleWordClick(word)}>
                  {word}
                </span>
              ))}
            </div>
            <div className="wordHolder">
              {wordItems.map((word, index) => (
                <div key={index} className="wordItem" onClick={() => handleWordClick(word)}>
                  {word}
                </div>
              ))}
            </div>
          </section>
          <div className="interact">
            <button id="Skip" onClick={handleSkip}>Skip</button>
            {isAnswerChecked ? (
              <button id="next" onClick={handleNextSentence} style={{ backgroundColor: "green", color: "white" }}>
                Next Sentence
              </button>
            ) : (
              <button
                id="check"
                onClick={checkAnswer}
                style={{
                  backgroundColor: userAnswer.length !== 0 ? "green" : "rgb(194, 194, 194)",
                  color: userAnswer.length !== 0 ? "white" : "grey",
                }}
                disabled={userAnswer.length === 0}
              >
                Check Answer
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SentenceArrangeGame;
