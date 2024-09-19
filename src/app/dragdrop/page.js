import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/d_and_d.scss";
export default function dragdrop() {
  return (
    <>
    <Head>
    <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hobbies - Matching</title>
    </Head>
    <TopNav/>
    <div className="drag_content">
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
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <div className="content_interact">
      <section className="draggable-items">
        {/* Will be dynamically populated - Example Element: */}
        {/* <div class="draggable" draggable="true">ABCD</div> */}
      </section>
      <section className="matching-pairs">
        {/* Will be dynamically populated - Example Element: */}
        {/* <div class="matching-pair">
    <span class="label"><img src="img/Rectangle 1694.png" alt=""></span>
    <span class="droppable" data-answer="ABCD"></span>
  </div> */}
      </section>
    </div>
    <div className="result_shower">
      <h1>You Archived</h1>
      <div className="result_content">
        <div className="percentage-result">
          <div className="circular-progress">
            <span className="circular-value">0%</span>
          </div>
        </div>
        <div className="point-result">
          <div className="score-points" />
          <div className="max-streak" />
        </div>
      </div>
    </div>
    <div className="interact">
      <button id="challenge__continue">Finish</button>
    </div>
  </div>
  <Footer/>
    </>
  )}