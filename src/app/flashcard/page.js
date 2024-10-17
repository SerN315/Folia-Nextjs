import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/flash.scss";
export default function FlashCard() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>English - Flashcard</title>
        {/* GG analytics */}
      </Head>
      <TopNav />
      <main>
        {/* NAVIGATION PANEL */}
        <div className="nav-panel">
          <p className="nav-panel__navigation">
            <a href="#" cate="" className="cate-link">
              Categories
            </a>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Flashcard</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <a
              href="#"
              className="nav-panel__game-list__game-item vocabulary-link"
              vocabularies=""
            >
              <i className="fa-solid fa-a" />
              <p>Vocabulary</p>
            </a>
            <a
              href="#"
              className="nav-panel__game-list__game-item d-and-d-link"
              flashcard=""
            >
              <i className="fa-regular fa-hand" />
              <p>Drag&amp;Drop</p>
            </a>
          </div>
        </div>
        {/* FLASHCARD MAIN CONTENT */}
        <div className="flashCard">
          <div className="flashcard-content">
            <div className="card">
              {/* <div class="interact">
</div> */}
              <div className="content">
                <div className="loading" />
                {/* <div id="word"></div>
<img id="flashcardimg"> */}
              </div>
            </div>
            <div className="card-con">
              <button id="speaker">
                <i className="fa-solid fa-volume-high fa-2xl" />
              </button>
              <button id="shuffle" className="shuffle" style={{ fontSize: 30 }}>
                <i className="fa-solid fa-shuffle" />
              </button>
              <div className="con-content">
                <button className="reverse-arrow-button" id="backB">
                  <i className="fa-solid fa-angle-left fa-2xl" />
                </button>
                <div id="now-total">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                <button className="arrow-button" id="nextB">
                  <i className="fa-solid fa-angle-right fa-2xl" />
                </button>
              </div>
              <button id="heart" className="favorite" style={{ fontSize: 30 }}>
                <i className="fa-solid fa-heart" />
              </button>
              <button id="autoCycleButton">
                <i className="fa-solid fa-play fa-2xl" />
              </button>
              <button id="pause" style={{ fontSize: 30 }}>
                <i className="fa-solid fa-pause" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
