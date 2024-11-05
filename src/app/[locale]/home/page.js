"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "../Component/loadingSpinner";
import Head from "next/head";
import ScrollableList from "../Component/scrollableComponent"; 
import { getDatabase } from "../js/api/databaseAPI";
import Link from "next/link";
import initTranslations from '../../i18n';

export default function Home1({ params: { locale } }) {
  const [t, setT] = useState(() => (key) => key);
  const [isLoadingkeys, setLoadingkeys] = useState(true);
  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(locale, ['category+home']);
      setT(() => t); // Set the translation function
      setLoadingkeys(false); // Set loading to false after translations load
    };
    
    loadTranslations();
  }, [locale]);
  const [mostLearnedTopics, setMostLearnedTopics] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both main fetch functions concurrently
        const [mostLearnedResponse, categoryResponse] = await Promise.all([
          getDatabase("509c3cca958545f0949070dec832e093"), // Most learned topics
          getDatabase("529b7e6a8ba74d799e05c8a7bca72252") // Suggested categories
        ]);

        // Process most learned topics
        const topics = mostLearnedResponse.map((item) => ({
          topicId: item.properties.TopicName.relation[0].id,
          topicName: item.properties.TopicNameDev.formula.string,
          categoryName: item.properties.CategoryNameDev.formula.string,
          image: item.properties.ImageDev.rollup.array[0].rich_text[0].plain_text,
          wordCount: item.properties.WordsCountDev.formula.number,
        }));
        setMostLearnedTopics(topics);

        // Process suggested categories with topics
        const categories = categoryResponse.map((item) => ({
          cateId: item.properties.CategoryName.relation[0].id,
          cateName: item.properties.CategoryNameDev.formula.string,
        }));

        // Fetch topics for each category concurrently
        const topicsPromises = categories.map(async (category) => {
          const topicResponse = await getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
            filter: { property: "Category", relation: { contains: category.cateId } },
          });
          return {
            ...category,
            topics: topicResponse.map((topic) => ({
              topicId: topic.id,
              topicName: topic.properties.Name.title[0].plain_text,
              topicImage: topic.properties.SVG.rich_text[0].plain_text,
              wordCount: topic.properties.WordCountDev.formula.number,
            })),
          };
        });

        // Wait for all topics to be fetched
        const categoriesWithTopics = await Promise.all(topicsPromises);
        setSuggestedCategories(categoriesWithTopics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading once all data is fetched
      }
    };

    fetchData();
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
      {/* Most Learned Topics Section */}
      <div className="home__most-learned">
        <div className="home__most-learned__title">
          <h4>{t('title_1')}</h4>
          <h6>{t('subtitle_1')}</h6>
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
                  <p>{t('total')} {topic.wordCount}</p>
                </div>
              </div>
            </Link>
          ))}
        </ScrollableList>
      </div>

      {/* Suggested Categories Section */}
      <div className="home__suggest">
        <div className="home__suggest__title">
          <h4>{t('title_2')}</h4>
        </div>
        {suggestedCategories.map((category) => (
          <div key={category.cateId} className="home__suggest__cate">
            <div className="home__suggest__cate__title">
              <h4>{category.cateName}</h4>
            </div>
            <ScrollableList className="home__suggest__cate__list">
              {category.topics && category.topics.map((topic) => (
                <div key={topic.topicId} className="home__suggest__cate__list__item">
                  <Link href={`vocabularies?topic=${topic.topicId}`} style={{ width: "100%" }}>
                    <div className="card">
                      <Image
                        src={topic.topicImage}
                        className="card-img-top"
                        alt={topic.topicName}
                        width={300}
                        height={200}
                      />
                      <div className="card-body">
                        <h5 className="card-body__title">{topic.topicName}</h5>
                        <p className="card-body__wrd-cnt">{t('total')} {topic.wordCount}</p>
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
      {/* <Footer /> */}
    </>
  );
}
