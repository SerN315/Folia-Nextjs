// components/SentenceArrangeGame.js
"use client";
import { useState, useEffect } from "react";

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

const SentenceArrangeGame = ({ sentence }) => {
  const [originalWords, setOriginalWords] = useState([]);
  const [scrambledWords, setScrambledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Split sentence and add diversion words
    const words = sentence.split(" ");
    const diversionWords = ["the", "a", "in", "on", "by", "to"];
    const allWords = [...words, ...diversionWords.slice(0, 3)];
    
    setOriginalWords(words);  // Store the original sentence words
    setScrambledWords(shuffleArray(allWords)); // Shuffle words with diversion
  }, [sentence]);

  const handleWordClick = (word) => {
    if (selectedWords.length < originalWords.length) {
      setSelectedWords((prev) => [...prev, word]);
      setScrambledWords(scrambledWords.filter((w) => w !== word)); // Remove word from scrambled display
    }
  };

  const checkAnswer = () => {
    if (selectedWords.join(" ") === originalWords.join(" ")) {
      setFeedback("Correct!");
    } else {
      setFeedback("Try again!");
      // Reset selected words and re-shuffle all words
      setScrambledWords(shuffleArray([...scrambledWords, ...selectedWords]));
      setSelectedWords([]);
    }
  };

  // Automatically check answer when selection reaches original length
  useEffect(() => {
    if (selectedWords.length === originalWords.length) {
      checkAnswer();
    }
  }, [selectedWords]);

  return (
    <div>
      <h1>Arrange the Sentence</h1>
      <div id="scrambled-words">
        {scrambledWords.map((word, index) => (
          <button key={index} onClick={() => handleWordClick(word)}>
            {word}
          </button>
        ))}
      </div>
      <div id="answer-words">
        {selectedWords.map((word, index) => (
          <span key={index}>{word} </span>
        ))}
      </div>
      <div>{feedback}</div>
    </div>
  );
};

export default SentenceArrangeGame;
