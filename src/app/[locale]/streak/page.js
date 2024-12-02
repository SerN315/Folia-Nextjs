'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import Calendar from "react-calendar";
import { auth } from "../firebase/authenciation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, Timestamp, getFirestore } from "firebase/firestore";
import "../scss/streak.scss";
import initTranslations from "../../i18n";
import 'react-calendar/dist/Calendar.css';
import LoadingSpinner from "../Component/loadingSpinner";

export default function Streak({ params: { locale } }) {
  const [t, setT] = useState(() => (key) => key);
  const [isLoadingkeys, setLoadingkeys] = useState(true);
  const [streak, setStreak] = useState(0);
  const [streakDates, setStreakDates] = useState([]); // Store streak timestamps from Firestore
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // Track time spent on the page
  const daysRef = useRef(null);
  const progressRef = useRef(null);
  const completeColor = "#ffce51";
  const firestore = getFirestore();

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(locale, ["streak"]);
      setT(() => t);
      setLoadingkeys(false);
    };

    loadTranslations();
  }, [locale]);


  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const updateStreakUI = (currentStreak) => {
    setStreak(currentStreak);
    if (progressRef.current) {
      progressRef.current.style.width = `${(currentStreak / 25) * 100}%`;
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

          // Extract timestamps and convert to Date objects
          const datesArray = (streakData.streakDates || []).map((timestamp) => timestamp.toDate());
          setStreakDates(datesArray);

          // Calculate streak based on dates
          const currentStreak = calculateStreak(datesArray);
          updateStreakUI(currentStreak);
        } else {
          const userStreakData = {
            streakDates: [], // Store exact timestamps here
          };
          await setDoc(streakRef, userStreakData);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Track time spent on the page
    const timer = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 1000); // Increment every second

    // If the user spends more than 2 minutes (120 seconds), log the session
    if (timeSpent >= 120) {
      logSession();
    }

    return () => clearInterval(timer); // Cleanup the timer when component unmounts
  }, [timeSpent]);

  const logSession = async () => {
    const userId = auth.currentUser.uid;
    const streakRef = doc(firestore, "streaks", userId);
    const docSnapshot = await getDoc(streakRef);

    const currentTimestamp = Timestamp.now();

    if (docSnapshot.exists()) {
      const streakData = docSnapshot.data();
      const updatedStreakDates = [...streakData.streakDates, currentTimestamp];

      // Update Firestore with the new timestamp
      await updateDoc(streakRef, { streakDates: updatedStreakDates });

      // Update local state
      setStreakDates((prevDates) => [...prevDates, currentTimestamp.toDate()]);

      // Recalculate streak
      const newStreak = calculateStreak(updatedStreakDates.map((ts) => ts.toDate()));
      updateStreakUI(newStreak);
    } else {
      // If no streak data exists, initialize it
      const newStreakData = {
        streakDates: [currentTimestamp],
      };
      await setDoc(streakRef, newStreakData);
      setStreakDates([currentTimestamp.toDate()]);
      updateStreakUI(1);
    }
  };

  const calculateStreak = (dates) => {
    if (dates.length === 0) return 0;

    // Sort dates in ascending order
    dates.sort((a, b) => a - b);

    let streakCount = 1;
    let lastDate = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const currentDate = dates[i];

      // Check if the current date is the next consecutive day
      const timeDifference = currentDate - lastDate;
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeDifference <= oneDayInMs) {
        streakCount++;
      } else if (timeDifference > oneDayInMs) {
        break; // Streak broken, stop counting
      }

      lastDate = currentDate;
    }

    return streakCount;
  };

  const tileClassName = ({ date }) => {
    const dateString = date.toDateString();
    return streakDates.some((streakDate) => streakDate.toDateString() === dateString)
      ? "highlight" // Highlight dates where the user earned a streak
      : "";
  };
  if (isLoadingkeys || !t) return <LoadingSpinner />;

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
                <p>{t("streakText")}</p>
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
            <h1 className="rewards__title">{t("title")}</h1>
            <p className="rewards__des">
            {t("subtitle")}
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
                    <h3 className="text__title">{t("title2")} {bp} {t("title22")}</h3>
                    <p className="text__des">{t("subtitle2")} {bp} {t("subtitle22")}</p>
                    <ul className="text__reward">
                      <li>{t("Ssubtitle2")} +{bp * 50} {t("Ssubtitle22")}</li>
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
