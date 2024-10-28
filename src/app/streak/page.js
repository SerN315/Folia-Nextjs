'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import Calendar from "react-calendar";
import { auth } from "../firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, Timestamp, getFirestore } from "firebase/firestore";
import "../scss/streak.scss";
import 'react-calendar/dist/Calendar.css';

export default function Streak() {
  const [streak, setStreak] = useState(0);
  const [streakDates, setStreakDates] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const daysRef = useRef(null);
  const progressRef = useRef(null);
  const completeColor = "#ffce51";
  const firestore = getFirestore();

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const updateStreakUI = (streakValue) => {
    setStreak(streakValue);
    if (progressRef.current) {
      progressRef.current.style.width = `${(streakValue / 25) * 100}%`;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = auth.currentUser.uid;
        const streakRef = doc(firestore, "streaks", userId);
        const docSnapshot = await getDoc(streakRef);

        if (docSnapshot.exists()) {
          const streakData = docSnapshot.data();
          updateStreakUI(streakData.streakCnt);

          // Set streakDates from Firebase and convert Timestamps to Date objects
          const datesArray = (streakData.streakDates || []).map((timestamp) => timestamp.toDate());
          setStreakDates(datesArray);
        } else {
          const userStreakData = {
            streakCnt: 0,
            streakCheck: false,
            lastUpdated: Timestamp.now(),
            streakDates: []
          };
          await setDoc(streakRef, userStreakData);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const tileClassName = ({ date }) => 
    streakDates.some((streakDate) => streakDate.toDateString() === date.toDateString()) 
      ? "highlight"
      : "";

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Achieve Daily Learning Goals - Track Your Streaks with Folia</title>
      </Head>

      <section className="main">
        <Image
          className="background"
          src="/img/Rectangle-1694.png"
          alt="Background"
          layout="fill"
        />
        <div className="info">
          <div className="info__streak">
            <div className="detail">
              <Image
                className="detail__icon"
                src="/img/features-icon/streak-ico.svg"
                alt="Sun Icon Representing Learning Streaks on Folia"
                width={50}
                height={50}
              />
              <div className="detail__text">
                <h1 ref={daysRef} className="days">{streak}</h1>
                <p>learning day streak</p>
              </div>
            </div>
            <Image
              className="reward-ico"
              src="/img/features-icon/reward-ico.svg"
              alt="Gift Icon Representing Streak Rewards on Folia"
              width={50}
              height={50}
              onClick={togglePopup}
            />
          </div>

          <div className="info__progress">
            <div className="indi">
              {[0, 5, 10, 15, 20, 25].map((bp) => (
                <p key={bp} className={`bp bp-${bp}`}>{bp}</p>
              ))}
            </div>
            <div className="progress-bar">
              <span ref={progressRef} className="progress-res" />
            </div>
          </div>

          {/* Calendar Component */}
          <div className="calendar-container">
            <Calendar locale="en-US" tileClassName={tileClassName} />
          </div>
        </div>
      </section>

      {isPopupOpen && (
        <section className="reward-list">
          <div className="rewards">
            <h1 className="rewards__title">Streak's Monthly Rewards</h1>
            <p className="rewards__des">
              Earn ranking points each month by joining games and activities
            </p>
            {[5, 10, 15, 20, 25].map((bp) => (
              <div key={bp} className={`reward streak--${bp}`} bp={bp}>
                <div className="content">
                  <Image
                    src={`/img/achievement/achievement-${bp}.svg`}
                    alt={`${bp}-Day Streak Coin`}
                    className="achievement"
                    width={50}
                    height={50}
                  />
                  <div className="text">
                    <h3 className="text__title">Achievement Title for {bp} days</h3>
                    <p className="text__des">Achievement description for {bp} days streak</p>
                    <ul className="text__reward">
                      <li>Reward: +{bp * 50} ranking points</li>
                    </ul>
                  </div>
                </div>
                <i className="fa-solid fa-check fa-2xl complete deactivate" />
              </div>
            ))}
            <i className="fa-solid fa-xmark cancel" onClick={togglePopup} />
          </div>
        </section>
      )}
    </>
  );
}
