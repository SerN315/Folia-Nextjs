// components/FlashCardItem.jsx
import { useState } from "react";
import Image from "next/image";

const FlashCardItem = ({ flashcard, isFavorited, onFavoriteToggle }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flashcard-item ${isFlipped ? "flipped" : ""}`} 
      onClick={handleFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h2>{flashcard.word || flashcard.Word}</h2>
          {flashcard.img && (
            <div className="flashcard-image">
              <Image 
                src={flashcard.img} 
                alt={flashcard.word || flashcard.Word} 
                width={200} 
                height={200} 
              />
            </div>
          )}
        </div>
        <div className="flashcard-back">
          <h3>{flashcard.pronunciation || flashcard.Pronunciation}</h3>
          <p>{flashcard.meaning || flashcard.Meaning}</p>
          {flashcard.set && <h4>{flashcard.set || flashcard.Set}</h4>}
        </div>
      </div>
      <button 
        className="favorite-button" 
        onClick={(e) => {
          e.stopPropagation(); // Prevent flipping when clicking favorite
          onFavoriteToggle(flashcard);
        }}
      >
        <i className={`fa-solid fa-heart ${isFavorited ? 'favorited' : ''}`} />
      </button>
    </div>
  );
};

export default FlashCardItem;
