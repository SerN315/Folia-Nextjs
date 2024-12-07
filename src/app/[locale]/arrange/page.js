// app/sentence-game/page.js
import SentenceArrangeGame from "../Component/SentecesComponent";
import "../scss/arrange.scss"
import Link from "next/link";
export default function SentenceGamePage() {
  // const searchParams = useSearchParams(); // Access query params
  // const topicID = searchParams.get("topic"); // Get the 'topic' query param
  return (

<main className="sentencesGame">
<div
          className="nav-panel"
          style={{ display: phrase ? "none" : "flex" }}
        >
          <p className="nav-panel__navigation">
            <Link href="#" cate="" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Vocabulary</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link
              href={`/flashcard?topic=${topicID}`}
              className="nav-panel__game-list__game-item flashcard-link"
            >
              <i className="fa-regular fa-images" />
              <p>Flashcard</p>
            </Link>
            <Link
              href={`/dragdrop?topic=${topicID}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Drag&amp;Drop</p>
            </Link>
            <Link
              href={`/multichoicesFT?topic=${topicID}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Multiple Choices</p>
            </Link>
            <Link
              href={`/vocabularies?topic=${topicID}`}
              className="nav-panel__game-list__game-item d-and-d-link"
            >
              <i className="fa-regular fa-hand" />
              <p>Vocabulary</p>
            </Link>
            <Link
              href={`fillblank?topic=${topicID}`}
              className="nav-panel__game-list__game-item fillblank-link"
            >
              <i className="fa-solid fa-pen" />
              <p>Fill The Blank</p>
            </Link>
          </div>
        </div>
        <SentenceArrangeGame></SentenceArrangeGame>
      </main>
  );
}
