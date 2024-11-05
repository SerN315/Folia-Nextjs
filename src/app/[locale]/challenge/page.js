"use client";
import { useEffect, useState } from "react";
import { getDatabase } from "../js/api/databaseAPI.js";
import { auth, firestore } from "../firebase/authenciation.js";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/challenge.scss";
import Link from "next/link.js";

export default function Challenge() {
  const [categories, setCategories] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]); // State to store completed challenge IDs
  const [userId, setUserId] = useState(null); // State to store the user ID
  const firestore = getFirestore();
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User is signed in:", user);
        const userId = user.uid;
        setUserId(userId);
        console.log("User ID:", userId);

        // Debugging: Check Firestore instance
        console.log("Firestore Instance:", firestore);

        try {
          // Define the path to the 'challenge' collection
          const challengeCollection = collection(
            firestore,
            "user_history",
            userId,
            "challenge"
          );
          console.log("Challenge Collection Path:", challengeCollection.path);

          // Set up snapshot listener for the 'challenge' collection
          const unsubscribeChallenge = onSnapshot(
            challengeCollection,
            (snapshot) => {
              if (snapshot.empty) {
                console.log("No challenges found for this user.");
                setCompletedChallenges([]); // No challenges completed
              } else {
                // Fetch each challenge document
                const fetchedCompletedChallenges = snapshot.docs.map((doc) => {
                  const challengeData = doc.data();
                  return challengeData.id; // Return the 'id' field
                });

                console.log(
                  "Fetched completed challenges:",
                  fetchedCompletedChallenges
                );
                setCompletedChallenges(fetchedCompletedChallenges);
              }
            },
            (error) => {
              console.error("Error fetching challenge history:", error);
            }
          );

          // Cleanup on unmount
          return () => unsubscribeChallenge();
        } catch (error) {
          console.error("Error setting up snapshot listener:", error);
        }
      } else {
        console.log("No user is signed in.");
        setCompletedChallenges([]);
      }
    });

    // Cleanup on unmount
    return () => unsubscribeAuth();
  }, [firestore]);

  // Fetch challenge categories from the API
  useEffect(() => {
    getDatabase("791918f3d802459291dcc45c7d8f9254", {
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    })
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  }, []);

  // Function to check if a challenge has been completed by the user
  const hasCompletedChallenge = (challengeName) => {
    return completedChallenges.includes(challengeName); // Check if the challenge Name exists in completedChallenges array
  };

  // Render challenge elements
  const displayElements = (elements) => {
    return elements.map((item) => {
      const challengeId = item.id;
      const challengeName = item.properties.Name.title[0]?.plain_text; // Get challenge name from the API
      const relationIds = item.properties.Categories.multi_select.map(
        (rel) => rel.name
      );
      const tags = item.properties.Tags.multi_select.map((rel) => rel.name);
      const categories = relationIds.slice(0, 10); // Limit to 10 categories
      const name = challengeName;
      const tag = tags.slice(0, 10);
      const id = item.properties.id.number; // Unique ID of the challenge

      return (
        <div className="challenges__item" key={challengeName}>
          <div className="challenges__item__left">
            <div className="title">
              <h2>Challenge {id}</h2>
            </div>
            <div className="tquestion">
              {tag.map((ta) => (
                <h3 key={ta}>{ta}</h3>
              ))}
            </div>
          </div>

          <div className="challenges__item__middle">
            <div className="title">
              <h2>Categories</h2>
            </div>
            <div className="tquestion">
              {categories.map((category) => (
                <h4 key={category}>{category}</h4>
              ))}
            </div>
          </div>

          <div className="challenges__item__right">
            {/* Conditionally render checkmark if the user completed the challenge */}
            {hasCompletedChallenge(`challenge_${id}`) ? (
              <div className="checks">
                <i className="fa-solid fa-check"></i>
              </div>
            ) : null}
            <div id="startchallenge">
              <Link
                href={`multichoices?topic=${name}&id=${challengeId}&cateID=${categories.join(
                  ","
                )}`}
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <title>Challenge</title>
      </Head>
      {/* <TopNav/> */}
      <section className="challenge">
        <div className="challenge__container">
          <div className="titles">
            <h1>Challenge</h1>
            <Link className="leaderboard" href="./leaderboard">
              Leaderboard
            </Link>
          </div>
          <div className="challenges">
            {/* Render the dynamic challenge elements */}
            {displayElements(categories)}
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
}
