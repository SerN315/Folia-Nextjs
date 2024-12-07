import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/material.scss";
import Link from "next/link";
export default function Home() {
  return (
    <>
    <Head>
    <meta charSet="UTF-8" />
  <link rel="icon" type="image/x-icon" href="../favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Folia - Learning Material</title>
    </Head>
    {/* <TopNav/> */}
      {/* NAVIGATION PANEL */}
  <div className="nav-panel">
    <p className="nav-panel__navigation">
      <Link href="#" cate="" className="cate-link">
        Categories
      </Link>{" "}
      &gt; Category:
      <span className="category">...</span> &gt; Topic:
      <span className="topic">...</span>
    </p>
    <h3 className="nav-panel__main-title">Learning Material</h3>
    <div className="nav-panel__dropdown">
      <p>Practices</p>
      <i className="fa-solid fa-chevron-down fa-s" />
    </div>
    <div className="nav-panel__game-list">
      <Link
        href="#"
        className="nav-panel__game-list__game-item vocabulary-link"
        vocabularies=""
      >
        <i className="fa-solid fa-a" />
        <p>Vocabulary</p>
      </Link>
      <Link
        href="#"
        className="nav-panel__game-list__game-item flashcard-link"
        flashcard=""
      >
        <i className="fa-regular fa-images" />
        <p>Flashcard</p>
      </Link>
      {/* <Link
              href={locale !== "vi" ? `arrange?topic=${id}` : undefined}
              className={`nav-panel__game-list__game-item d-and-d-link ${
                locale === "vi" ? "disabled-link" : ""
              }`}
              onClick={(e) => {
                if (locale === "vie") {
                  e.preventDefault(); // Prevent navigation
                }
              }}
            >
              <i className="fa-regular fa-images" />
              <p>Arrange</p>
            </Link> */}
      <Link
        href="#"
        className="nav-panel__game-list__game-item d-and-d-link"
        flashcard=""
      >
        <i className="fa-regular fa-hand" />
        <p>Drag&amp;Drop</p>
      </Link>
    </div>
  </div>
  <main className="material">
    <div className="material-content-box">
      <div className="grid-container" />
    </div>
    <div className="msg-bubble">
      <div className="msg-bubble__body">
        <h2>Name of Word</h2>
        <p>
          pronunciation (<span className="tags">noun</span>)
        </p>
        <h6>Meaning: nghia cua tu</h6>
      </div>
    </div>
  </main>
  <div className="popup-flex-container hidden" />
  {/* <Footer/> */}
    </>
  )}