import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import "../scss/challenge.scss";
import TopNav from "../Component/header";
export default function challenge() {
  return (
    <>
    <Head>
    <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/x-icon" href="../favicon.ico" />
  <title>Challenge</title>
    </Head>
    <TopNav/>
    <section className="challenge">
    <div className="challenge__container">
      <div className="titles">
        <h1>Challenge</h1>
        <a className="leaderboard" href="./leaderboard.html">
          Leaderboard
        </a>
      </div>
      <div className="challenges" />
    </div>
  </section>
  <Footer/>
    </>
  )}