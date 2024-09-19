import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/vocabularies.scss";
import "../scss/subnav.scss";
export default function History() {
  return (
    <>
    <Head>  <link rel="icon" type="image/x-icon" href="../favicon.ico" />
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  {/* Add API to call for topic's name*/}
  <title>History</title>
  {/* Google tag (gtag.js) */}
  {/* GG analytics */}</Head>
  <div id="progress">
    <span id="progress-value">
      <i className="fa-solid fa-arrow-up" />
    </span>
  </div>
  <TopNav/>
  {/* NAVIGATION PANEL */}
  <div className="nav-panel">
    <h3 className="nav-panel__main-title">History</h3>
    <div className="nav-panel__dropdown">
      <p>Practices</p>
      <i className="fa-solid fa-chevron-down fa-s" />
    </div>
    <div className="nav-panel__game-list">
      <a
        href="#"
        className="nav-panel__game-list__game-item flashcard-link"
        flashcard=""
      >
        <i className="fa-regular fa-images" />
        <p>Flashcard</p>
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
  {/* SEARCH RESULT CONTENT */}
  <div className="search-result">
    <h1>SEARCH RESULT</h1>
    <h2>
      THERE ARE <span className="count">0</span> RESULTS THAT CONTAIN THE PHRASE
      <span className="input-text">...</span>
    </h2>
  </div>
  {/* VOCABULARY MAIN CONTENT */}
  <main className="article">
    <h1 style={{ fontSize: 30, textAlign: "center", margin: 0 }}>
      You haven't any practice, practice more to get your history
    </h1>
  </main>
  <div className="word-box-overlay overlay hidden">
    <div className="modal20">
      <button className="close-modal">×</button>
    </div>
  </div>
  <Footer/>
</>

  )}