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
  const [categories, setCategories] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("topic");

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await getDatabase("category");
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
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
      // ASVAB-specific content
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
              {categories.map((category) => (
                <div key={category.categoryName} className="item">
                  <h1>{category.categoryName}</h1>
                  <ScrollableList
                    id={category.categoryName}
                    className="topic-container"
                  >
                    {category.topicList.map((topic) => {
                      const topicId = topic.topicId;
                      const topicName = topic.topicName;
                      const totalWords = topic.wordCount;
                      const img = topic.img;

                      const progress = calculateProgress(topicId, totalWords);

                      return (
                        <Link
                          href={`vocabularies?topic=${topicId}`}
                          className="topic"
                          key={topicId}
                        >
                          <div className="topic__img">
                            <img src={img} alt={topicName} />
                          </div>
                          <div className="topic__text">
                            <h3>{topicName}</h3>
                            <p>Total words: {totalWords}</p>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: "#3fbd00",
                                }}
                              >
                                {progress}%
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </ScrollableList>
                </div>
              ))}
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
        <title>{id === "folia-asvab" ? "Folia - ASVAB" : "Folia"}</title>
        {id === "folia-asvab" && (
          <link rel="stylesheet" href="/scss/cate_2.scss" />
        )}
        {id === "folia-language" && (
          <link rel="stylesheet" href="/scss/cate.scss" />
        )}
      </Head>
      {renderContent()}
    </>
  );
}
