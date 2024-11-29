"use client";
import "../scss/cate.scss";
import ScrollableList from "../Component/scrollableComponent";
import { useEffect, useState } from "react";
import { getDatabase } from "../js/api/databaseAPI";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase/authenciation";

export default function Category() {
  const [response1, setResponse1] = useState([]);
  const [response2, setResponse2] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("topic");

  useEffect(() => {
    if (id === "folia-language") {
      const storedResponse1 = localStorage.getItem("response1");
      const storedResponse2 = localStorage.getItem("response2");

      if (storedResponse1 && storedResponse2) {
        setResponse1(JSON.parse(storedResponse1));
        setResponse2(JSON.parse(storedResponse2));
      } else {
        makeRequests();
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchUserProgress = async (userId) => {
      try {
        const db = getFirestore();
        const userProgressSnapshot = await getDocs(
          collection(db, "users", userId, "progress")
        );

        const progress = {};
        userProgressSnapshot.forEach((doc) => {
          const topicId = doc.id;
          const contentData = doc.data();
          if (contentData) progress[topicId] = contentData;
        });

        setUserProgress(progress);
        console.log("User progress fetched:", progress);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    // Listen for auth state changes and fetch progress
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProgress(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const makeRequests = () => {
    Promise.all([
      getDatabase("f52cea04f3cd43239e0c8a409f67c8e8", {}),
      getDatabase("10087f66f2404f85ac4eee90c2203dc3", {}),
    ])
      .then(([res1, res2]) => {
        localStorage.setItem("response1", JSON.stringify(res1));
        localStorage.setItem("response2", JSON.stringify(res2));
        setResponse1(res1);
        setResponse2(res2);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  const calculateProgress = (topicId, totalWords) => {
    const progressData = userProgress[topicId] || {};
    const knownWords = Object.values(progressData).filter(
      (status) => status === "known"
    ).length;
    return Math.round((knownWords / totalWords) * 100);
  };

  const renderContent = () => {
    if (id === "folia-asvab") {
      // Asvab-specific content
      return (
        <div className="home__hero-section">
          {/* Hero section for folia-asvab */}
        </div>
      );
    } else if (id === "folia-language") {
      return (
        <main className="category">
          <h1 className="category__title">
            Browse our categories list
            <i aria-hidden="true" className="fa-solid fa-arrow-down fa-xs" />
          </h1>
          <div className="category__content">
            <div className="topic-list">
              {response1.map((item) => {
                const cateID = item.id;
                const name = item.properties.Name.title[0]?.plain_text;
                const relatedTopic = response2.filter(
                  (topic) => topic.properties.Category.relation[0]?.id === cateID
                );

                return (
                  <div key={cateID} className="item">
                    <h1>{name}</h1>
                    <ScrollableList id={cateID} className="topic-container">
                      {relatedTopic.map((topic) => {
                        const topicId = topic.id;
                        const topicName = topic.properties.Name.title[0]?.plain_text;
                        const formulaValue = topic.properties.Vocab.formula.string;
                        const img = topic.properties.SVG.rich_text[0]?.plain_text;

                        if (formulaValue && formulaValue.split(" ").length > 4) {
                          const totalWords = formulaValue.split(" ").length;
                          const progress = calculateProgress(topicId, totalWords);

                          return (
                            <Link href={`vocabularies?topic=${topicId}`} className="topic" key={topicId}>
                              <div className="topic__img">
                                <img src={img} alt={topicName} />
                              </div>
                              <div className="topic__text">
                                <h3>{topicName}</h3>
                                <p>Total words: {totalWords}</p>
                                <div className="progress">
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%`, backgroundColor: "#3fbd00"}}
                                  >
                                    {progress}%
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </ScrollableList>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      );
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{id === 'folia-asvab' ? 'Folia - ASVAB' : 'Folia'}</title>
        {id === 'folia-asvab' && (
          <link rel="stylesheet" href="/scss/cate_2.scss" />
        )}
        {id === 'folia-language' && (
          <>
            <link rel="stylesheet" href="/scss/cate.scss" />
          </>
        )}
      </Head>
      {/* <TopNav/> */}
      {renderContent()}
      {/* <Footer /> */}
    </>
  );
}
