import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
import "../scss/learderboard.scss";
import Link from "next/link";
export default function Leaderboard() {
return(
    <>
    <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Leaderboard</title>
    </Head>
    <section className="leaderboardContent">
    <div className="leaderboardContent__container">
      <div className="leaderboardContent__container__title">
        <Link className="challenge" href="/challenge">
          Challenge
        </Link>
        <h1>Leaderboard</h1>
      </div>
      {/* <div class="leaderboard__container__selector">
  <div class="leaderboard__container__selector__buttons">
  <button class="day"><h1>Day</h1></button>
  <button class="week"><h1>Week</h1></button>
  <button class="month"><h1>Month</h1></button>
  <button class="year"><h1>Year</h1></button>
</div>
</div> */}
      <div className="leaderboardContent__container__top3">
        <ul className="ranks">
          <li>
            <div className="ranker_avatar" />
            <div className="rank_indicator">2</div>
          </li>
          <li>
            <div className="ranker_avatar" />
            <div className="rank_indicator">1</div>
          </li>
          <li>
            <div className="ranker_avatar" />
            <div className="rank_indicator">3</div>
          </li>
        </ul>
      </div>
      <div className="leaderboardContent__container__rankinglist">
        <div className="content">
          <div className="indicator">
            <h1>Player ranks</h1>
            <Link href="#">View all &gt;</Link>
          </div>
          <ul className="rankings">
            <li>
              <div className="user_ranking_info">
                <div className="rank">4</div>
                <div className="ranking_avatar" />
                <div className="user_info">
                  <div className="username">Username</div>
                  <div className="email">Email</div>
                </div>
              </div>
              <div className="point">12345</div>
            </li>
            <li />
            <li />
          </ul>
        </div>
      </div>
    </div>
  </section>
    </>
)
}
