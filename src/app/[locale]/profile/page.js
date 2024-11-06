"use client";
import { useEffect, useState } from "react";
import {
  getDoc,
  getFirestore,
  onSnapshot,
  collection,
  doc,
  query,
} from "firebase/firestore";
import { auth } from "../firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
// import TopNav from "../Component/header";
//import Footer from "../Component/footer";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "../Component/TranslationProvider";
export default function Profile() {
  const { t } = useTranslation();
  const [userStreak, setUserStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [user, setUser] = useState(null);

  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userId = currentUser.uid;
        const streakRef = doc(firestore, "streaks", userId);
        getDoc(streakRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserStreak(docSnapshot.data().streakCnt);
          }
        });

        const userQuery = query(
          collection(firestore, "user_history", userId, "userInfo")
        );
        onSnapshot(userQuery, (userInfoSnapshot) => {
          userInfoSnapshot.forEach((userInfoDoc) => {
            const userInfoData = userInfoDoc.data();

            const challengeQuery = query(
              collection(firestore, "user_history", userId, "challenge")
            );
            onSnapshot(challengeQuery, (challengeSnapshot) => {
              let challengePoints = {};
              challengeSnapshot.forEach((challengeDoc) => {
                const challengeData = challengeDoc.data();
                const challengeId = challengeDoc.id;

                if (
                  !challengePoints[challengeId] ||
                  challengePoints[challengeId] < challengeData.score
                ) {
                  challengePoints[challengeId] = challengeData.score;
                }
              });

              const totalPoints = Object.values(challengePoints).reduce(
                (sum, score) => sum + score,
                0
              );
              setTotalPoints(totalPoints);
            });
          });
        });
      }
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile</title>
        <link rel="stylesheet" href="/scss/pro5.scss" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      {/* <TopNav/> */}
      <main className="setting">
        <div className="setting__main">
          <h2 className="title">
            <Link href="/home">Home</Link> &gt; Profile
          </h2>
          <div className="content">
            <div className="content__user-info">
              <div className="userinfos">
                <img
                  src="/img/folia-asvab.png"
                  className="user-img"
                  width={100}
                  height={100}
                  alt="User Image"
                />
                <div className="user-text">
                  <h2 className="username_text">
                    {user?.displayName || "USERNAME"}
                  </h2>
                  <h5 className="userId_text">{user?.email || "USERID"}</h5>
                  <h4 className="created_text">
                    Started from{" "}
                    {new Date(
                      user?.metadata?.creationTime
                    ).toLocaleDateString()}
                  </h4>
                </div>
              </div>
              <div className="icons">
                <Link href="/history" style={{ fontSize: 35, marginRight: 30 }}>
                  <i className="fa-solid fa-clock-rotate-left" />
                </Link>
                <a href="/setting" style={{ fontSize: 35 }}>
                  <i className="fa-solid fa-gear" />
                </a>
              </div>
            </div>
            <hr />
            <h1 style={{ fontSize: 30, marginBottom: 20 }}>{t('statistic', { ns: 'profile+setting' })}</h1>
            <div className="content__stats">
              <div className="streak stat">
                <div className="icon">
                  <Image
                    src="/img/Icons/pro5-1.png"
                    alt="Streak Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="text">
                  <div className="counter">
                    <h1>{userStreak}</h1>
                  </div>
                  <div className="title">
                    <h3>{t('content1', { ns: 'profile+setting' })}</h3>
                  </div>
                </div>
              </div>
              <div className="exp stat">
                <div className="icon">
                  <Image
                    src="/img/Icons/pro5-1.png"
                    alt="Exp Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="text">
                  <div className="counter">
                    <h1>{totalPoints}</h1>
                  </div>
                  <div className="title">
                    <h3>Exp</h3>
                  </div>
                </div>
              </div>
              <div className="rank stat" style={{ display: "none" }}>
                <div className="icon">
                  <Image
                    src="/img/Icons/pro5-1.png"
                    alt="Rank Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="text">
                  <div className="counter">
                    <h1>Coming Soon</h1>
                  </div>
                  <div className="title">
                    <h3>Rank</h3>
                  </div>
                </div>
              </div>
              <div className="toptimes stat" style={{ display: "none" }}>
                <div className="icon">
                  <Image
                    src="/img/Icons/pro5-1.png"
                    alt="Top Times Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="text">
                  <div className="counter">
                    <h1>Coming Soon</h1>
                  </div>
                  <div className="title">
                    <h3>Top Times</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting__bkg" />
      </main>
      {/* <Footer /> */}
    </>
  );
}
