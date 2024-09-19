import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/multi.scss";
export default function MultiQ() {
  return (
    <>
    <Head>  
    <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {/* Add API to call for topic's name */}
  <title>English - Multiple Choice</title>
  <link rel="icon" type="image/x-icon" href="../favicon.ico" />
  {/* GG analytics */}
  </Head>
  <TopNav/>
  <div className="main_content">
    <div className="background" />
    <div className="progress_bar">
      <div className="indicator" />
    </div>
    <div className="limiters">
      <div className="timer">
        <i className="fa-solid fa-clock" />
        <div id="timerText" />
      </div>
      <div className="point">
        <div className="correct-point">
          <i className="fa-solid fa-check" />
          <div id="points" />
        </div>
        <hr />
        <div className="bonus-point">
          <i className="fa-solid fa-fire" />
          <div id="bonus" />
        </div>
      </div>
      <div className="streak">
        <i className="fa-solid fa-fire" />
        <div id="streak" />
      </div>
    </div>
    <div className="timeAttack">
      <div className="multiChoice">
        <div className="questionno-skeleton">
          <h2>
            <span className="qid" />:
          </h2>
        </div>
        <div className="Q-content-skeleton">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div className="choices">
          <ul>
            <li id="choice-skeleton">
              <label>
                <input
                  type="radio"
                  name="question${
            1
          }"
                  defaultValue="A"
                />
                <span>
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </label>
            </li>
            <li id="choice-skeleton">
              <label>
                <input
                  type="radio"
                  name="question${
            1
          }"
                  defaultValue="B"
                />
                <span>
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </label>
            </li>
            <li id="choice-skeleton">
              <label>
                <input
                  type="radio"
                  name="question${
            1
          }"
                  defaultValue="C"
                />
                <span>
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </label>
            </li>
            <li id="choice-skeleton">
              <label>
                <input
                  type="radio"
                  name="question${
            1
          }"
                  defaultValue="D"
                />
                <span>
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
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
  </div>
  <div className="interact">
    <button id="restartButton">New Questions</button>
    <button id="redoButton">Try Again</button>
    <button id="challenge__continue">Continue</button>
    {/* <button id="nextB" class="nextButton" disabled>Next</button> */}
  </div>
  {/* <div id="Timer">adafa</div> */}
  <Footer/>
    </>
  )}