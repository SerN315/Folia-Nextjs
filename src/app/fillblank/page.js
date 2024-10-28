import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/fill-blank.scss";
import Link from "next/link";
export default function FillBlank() {
  return (
    <>
    <Head>  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fill-in-the-blank - Folia</title>
  <link rel="icon" href="../favicon.ico" /></Head>
  <main className="fill-blank">
    <div className="nav-panel">
      <p className="nav-panel__navigation">
        <Link href="/cate" cate="">
          Categories
        </Link>{" "}
        &gt; Category: Animals &gt; Topic: Marine life
      </p>
      <h3 className="nav-panel__main-title">Fill in the blank</h3>
      <div className="nav-panel__dropdown">
        <p>Practices</p>
        <i className="fa-solid fa-chevron-down fa-s" />
      </div>
      <div className="nav-panel__game-list">
        <Link
          href="vocabularies"
          className="nav-panel__game-list__game-item"
          vocab=""
        >
          <i className="fa-solid fa-a" />
          <p>Vocabulary</p>
        </Link>
        <Link
          href="flashcard"
          className="nav-panel__game-list__game-item"
          flashcard=""
        >
          <i className="fa-solid fa-image" />
          <p>Flashcard</p>
        </Link>
        <Link href="#" className="nav-panel__game-list__game-item" d-and-d="">
          <i className="fa-solid fa-pencil" />
          <p>Matching</p>
        </Link>
      </div>
    </div>
    <div className="fill-blank__main-content">
      <form id="fillForm" className="fill-blank__main-content__container">
        <div className="fill-blank__main-content__container__text" />
        <div className="fill-blank__main-content__container__submit">
          <input
            className="fill-blank__main-content__container__submit-btn"
            type="button"
            defaultValue="Submit"
          />
          <i className="fa-solid fa-arrow-rotate-right fa-xl reload" />
          <i className="fa-solid fa-play fa-xl new" />
          <p className="fill-blank__main-content__container__submit__result" />
        </div>
      </form>
    </div>
  </main>
    </>
  )}