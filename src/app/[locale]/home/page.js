"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "../Component/loadingSpinner";
import Head from "next/head";
import ScrollableList from "../Component/scrollableComponent";
import { getCategories } from "../js/api/foliaAPI";
import Link from "next/link";
import initTranslations from "../../i18n";
import { auth } from "../firebase/authenciation";
// TODO Step 2: user progress via /api/folia/progress/:userId

export default function Home1({ params: { locale } }) {
  const [t, setT] = useState(() => (key) => key);
  const [isLoadingkeys, setLoadingkeys] = useState(true);
  const [mostLearnedTopics, setMostLearnedTopics] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(locale, ["category+home"]);
      setT(() => t);
      setLoadingkeys(false);
    };

    loadTranslations();
  }, [locale]);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        // First two categories → most learned topics section
        const topics = (cats[0]?.topicList || []).map((t) => ({
          topicId: t.topicId,
          topicName: t.topicName,
          categoryName: cats[0]?.categoryName || "",
          image: t.img || "",
          totalWords: t.wordCount,
          progress: 0, // TODO Step 2: fill from /api/folia/progress/:userId
        }));
        setMostLearnedTopics(topics);

        // All categories → suggested categories section
        const suggested = cats.map((cat) => ({
          cateId: cat.categoryId,
          cateName: cat.categoryName,
          topics: cat.topicList.map((t) => ({
            topicId: t.topicId,
            topicName: t.topicName,
            topicImage: t.img || "",
            totalWords: t.wordCount,
            progress: 0,
          })),
        }));
        setSuggestedCategories(suggested);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoading(false));

    // Auth state — used for progress in Step 2
    const unsubscribe = auth.onAuthStateChanged(() => {});
    return () => unsubscribe();
  }, []);

  if (isLoadingkeys || !t) return <LoadingSpinner />;
  
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia</title>
      </Head>
      {/* <TopNav/> */}
      <main className="home">
        {/* Hero Section */}
        <div className="home__hero-section">
          <div className="home__hero-section__container">
            <div className="home-hero-img">
              <div className="home-hero-img__container">
                <Image
                  src="/img/home-hero-img1.png"
                  className="home-hero-img__container__img1"
                  alt="Hero Image 1"
                  layout="intrinsic"
                  width={497}
                  height={365}
                />
                <Image
                  src="/img/home-hero-img2.png"
                  className="home-hero-img__container__img2"
                  alt="Hero Image 2"
                  layout="intrinsic"
                  width={497}
                  height={365}
                />
                <Image
                  src="/img/home-hero-img3.png"
                  className="home-hero-img__container__img3"
                  alt="Hero Image 3"
                  layout="intrinsic"
                  width={497}
                  height={365}
                />
                <div className="home-hero-img__container__box1" />
                <div className="home-hero-img__container__box2" />
              </div>
            </div>
            <div className="col-lg-6 home-hero-text">
              <div className="home-hero-text__container">
                <h5>{t('hero_title_1')}</h5>
                <h1>{t('hero_title_2')}</h1>
                <div className="home-hero-text__container__cate-link">
                  <Link className="cate-link" href="/cate?topic=folia-language">
                  {t('hero_btn')}
                  </Link>
                  <i className="fa-solid fa-arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="home__most-learned">
              <div className="home__most-learned__title">
                <h4>{t("title_1")}</h4>
                <h6>{t("subtitle_1")}</h6>
              </div>
              <ScrollableList className="home__most-learned__list">
                {mostLearnedTopics.map((topic) => (
                  <Link
                    key={topic.topicId}
                    href={`vocabularies?topic=${topic.topicId}`}
                    className="home__most-learned__list__item"
                  >
                    <div className="card text-bg-dark">
                      <Image
                        src={topic.image}
                        alt={topic.topicName}
                        className="card-img"
                        width={300}
                        height={200}
                      />
                      <div className="card-img-overlay">
                        <h6>{topic.categoryName}</h6>
                        <h4>{topic.topicName}</h4>
                        <p>{t("total")} {topic.totalWords}</p>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${topic.progress}%`, backgroundColor: "#3fbd00" }}
                            aria-valuenow={topic.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {Math.round(topic.progress)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </ScrollableList>
            </div>

            {/* Suggested Categories Section */}
            <div className="home__suggest">
              <div className="home__suggest__title">
                <h4>{t("title_2")}</h4>
              </div>
              {suggestedCategories.map((category) => (
                <div key={category.cateId} className="home__suggest__cate">
                  <ScrollableList className="home__suggest__cate__list">
                    {category.topics.map((topic) => (
                      <div
                        key={topic.topicId}
                        className="home__suggest__cate__list__item"
                      >
                        <Link
                          href={`vocabularies?topic=${topic.topicId}`}
                          style={{ width: "100%" }}
                        >
                          <div className="card">
                            <Image
                              src={topic.topicImage}
                              className="card-img-top"
                              alt={topic.topicName}
                              width={300}
                              height={200}
                            />
                            <div className="card-body">
                              <h5>{topic.topicName}</h5>
                              <p>{t("total")} {topic.totalWords}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: `${topic.progress}%`,backgroundColor: "#3fbd00"}}
                                  aria-valuenow={topic.progress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  {Math.round(topic.progress)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </ScrollableList>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
