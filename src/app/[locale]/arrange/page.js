// app/sentence-game/page.js
import SentenceArrangeGame from "../Component/SentecesComponent";
import "../scss/arrange.scss"
import Link from "next/link";
export default function SentenceGamePage() {
  return (

<main className="sentencesGame">
<div className="nav-panel">
          <p className="nav-panel__navigation">
            <Link href="/cate?topic=folia-language" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Arrange Senteces</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`vocabularies?topic=`}
              className="nav-panel__game-list__game-item vocabulary-link"
            >
              <i className="fa-solid fa-a" />
              <p>Vocabulary</p>
            </Link>
            <Link
              href={`flashcard?topic=`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-images" />
              <p>FlashCard</p>
            </Link>
            <Link
              href={`fillblank?topic=`}
              className="nav-panel__game-list__game-item fillblank-link"
            >
              <i className="fa-solid fa-pen" />
              <p>Fill The Blank</p>
            </Link>
          </div>
        </div>
        <SentenceArrangeGame></SentenceArrangeGame>

  {/* <div className="game_content">
  <section className="score">
    <div className="score_right">
      <h1 className="left_score">Right Tries</h1>
      <span className="correct">0</span>
    </div>
    <div className="score_right">
      <h1 className="right_score">Total Tries</h1>
      <span className="total">0</span>
    </div>
    <button id="play-again-btn">Play Again</button>
  </section>
  <section className="gameUI">
    <div className="userMeaning">
      <div className="sentecesContainer">something</div>
      <div className="correctContainer">something </div>
    </div>
    <div className="answerContainer"></div>
    <div className="wordHolder">
      <div className="wordItem">something</div>
      <div className="wordItem">something</div>
      <div className="wordItem">something</div>
      <div className="wordItem">something</div>
      <div className="wordItem">something</div>
      <div className="wordItem">something</div>
    </div>
  </section>
  <div className="interact">
    <button id="Skip">Skip</button>
    <button id="check">Check Answer</button>
  </div>
</div> */}
      </main>
  );
}