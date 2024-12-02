'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/authenciation';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import Image from "next/image";
import Head from "next/head";
import LoadingSpinner from "../Component/loadingSpinner.js";
import initTranslations from "../../i18n";
import Link from "next/link";
import "../scss/learderboard.scss";

export default function Leaderboard({ params: { locale } }) {
  const [t, setT] = useState(() => (key) => key);
  const [isLoadingkeys, setLoadingkeys] = useState(true);
  const [userInfoData, setUserInfoData] = useState([]);
  const [isVisible, setIsVisible] = useState(true); // For handling ranksList2 visibility

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(locale, ["games"]);
      setT(() => t);
      setLoadingkeys(false);
    };

    loadTranslations();
  }, [locale]);





  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userInfoQuery = query(
          collection(db, 'ranking'),
          orderBy('totalPoints', 'desc'),
          limit(10)
        );

        const unsubscribeSnapshot = onSnapshot(userInfoQuery, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id })); // Ensure uid is available

          // Create or update the current user data object
          const currentUserData = {
            avatar: user.photoURL,
            points: user.points || 0, // Set default points if not available
            email: user.email,
            username: user.displayName,
            uid: user.uid,
          };

          // Check if the current user already exists in the data
          const currentUserIndex = data.findIndex((rankedUser) => rankedUser.uid === user.uid);

          if (currentUserIndex !== -1) {
            // If the user exists, update their points
            data[currentUserIndex].points = currentUserData.points;
          } else {
            // If the user does not exist, add them
            data.push(currentUserData);
          }

          // Sort the data by totalPoints after updating
          const sortedData = data.sort((a, b) => b.points - a.points);

          setUserInfoData(sortedData);
          setIsVisible(sortedData.length > 3); // Show ranksList2 if more than 3 users
        });

        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  if (isLoadingkeys || !t) return <LoadingSpinner />;
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Leaderboard</title>
      </Head>
      <section className="leaderboardContent">
        <div className="leaderboardContent__container">
          <div className="leaderboardContent__container__title">
          <h1> {t("title2")}</h1>
            <Link className="challenge" href="/challenge">
            {t("title1")}
            </Link>

          </div>
          <div className="leaderboardContent__container__top3">
          <ul className="ranks">
              {/* Render top 3 users in the order: 2nd, 1st, 3rd */}
              {userInfoData.length > 1 && (
                <>
                  <li key={userInfoData[1].uid}>
                    <div
                      className="ranker_avatar"
                      style={{
                        backgroundImage: `url(${userInfoData[1].avatar})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    ></div>
                    <div className="rank_indicator">2</div>
                  </li>
                  <li key={userInfoData[0].uid}>
                    <div
                      className="ranker_avatar"
                      style={{
                        backgroundImage: `url(${userInfoData[0].avatar})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    ></div>
                    <div className="rank_indicator">1</div>
                  </li>
                  <li key={userInfoData[2]?.uid}>
                    <div
                      className="ranker_avatar"
                      style={{
                        backgroundImage: `url(${userInfoData[2]?.avatar})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    ></div>
                    <div className="rank_indicator">3</div>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="leaderboardContent__container__rankinglist">
            <div className="content">
              <div className="indicator">
                <h1>{t("title7")}</h1>
                {/* <Link href="#">View all &gt;</Link> */}
              </div>
              <ul className="rankings">
                {/* Render remaining users if more than 3 */}
                {isVisible && userInfoData.slice(3).map((user, index) => (
                  <li key={user.uid}>
                    <div className="user_ranking_info">
                      <div className="rank">{index + 4}</div>
                      <div
                        className="ranking_avatar"
                        style={{
                          backgroundImage: `url(${user.avatar})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                        }}
                      ></div>
                      <div className="user_info">
                        <div className="username">{user.username}</div>
                        <div className="email">{user.email}</div>
                      </div>
                    </div>
                    <div className="point">{user.totalPoints}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
