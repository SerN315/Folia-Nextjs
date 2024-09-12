"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import { getDatabase } from "../js/api/databaseAPI";

export default function Home1() {
  const [mostLearnedTopics, setMostLearnedTopics] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);

  useEffect(() => {
    // Fetch data for most learned topics
    getDatabase("509c3cca958545f0949070dec832e093").then((response) => {
      const topics = response.map((item) => {
        return {
          topicId: item.properties.TopicName.relation[0].id,
          topicName: item.properties.TopicNameDev.formula.string,
          categoryName: item.properties.CategoryNameDev.formula.string,
          image: item.properties.ImageDev.rollup.array[0].rich_text[0].plain_text,
          wordCount: item.properties.WordsCountDev.formula.number,
        };
      });
      setMostLearnedTopics(topics);
    });

    // Fetch data for suggested categories
    getDatabase("529b7e6a8ba74d799e05c8a7bca72252").then((response) => {
      const categories = response.map((item) => ({
        cateId: item.properties.CategoryName.relation[0].id,
        cateName: item.properties.CategoryNameDev.formula.string,
      }));
      setSuggestedCategories(categories);

      categories.forEach((category) => {
        // Fetch topics for each category
        getDatabase("10087f66f2404f85ac4eee90c2203dc3", {
          filter: { property: "Category", relation: { contains: category.cateId } },
        }).then((topicResponse) => {
          category.topics = topicResponse.map((topic) => ({
            topicId: topic.id,
            topicName: topic.properties.Name.title[0].plain_text,
            topicImage: topic.properties.SVG.rich_text[0].plain_text,
            wordCount: topic.properties.WordCountDev.formula.number,
          }));
          setSuggestedCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.cateId === category.cateId ? category : cat
            )
          );
        });
      });
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia</title>
      </Head>
      <TopNav />
      <main className="home">
        <div className="home__hero-section">
          <div className="home__hero-section__container">
            <div className="home-hero-img">
              <div className="home-hero-img__container">
                <Image
                  src="/img/home-hero-img1.png"
                  className="home-hero-img__container__img1"
                  alt="Hero Image 1"
                  layout="intrinsic"
                  width={497} // Set the exact pixel size to avoid blur
                  height={365} // Exact height for clarity

                />
                <Image
                  src="/img/home-hero-img2.png"
                  className="home-hero-img__container__img2"
                  alt="Hero Image 2"
                  layout="intrinsic"
                  width={497} // Set the exact pixel size to avoid blur
                  height={365} // Exact height for clarity

                />
                <Image
                  src="/img/home-hero-img3.png"
                  className="home-hero-img__container__img3"
                  alt="Hero Image 3"
                  layout="intrinsic"
                  width={497} // Set the exact pixel size to avoid blur
                  height={365} // Exact height for clarity
                />
                <div className="home-hero-img__container__box1" />
                <div className="home-hero-img__container__box2" />
              </div>
            </div>
            <div className="col-lg-6 home-hero-text">
              <div className="home-hero-text__container">
                <h5>Welcome to Folia - English,</h5>
                <h1>Start Learning Your Favorite Language here,</h1>
                <div className="home-hero-text__container__cate-link">
                  <a className="cate-link" href="/cate.html?topic=folia-language">
                    View our categories
                  </a>
                  <i className="fa-solid fa-arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="home__most-learned">
          <div className="home__most-learned__title">
            <h4>Keep up with the world!</h4>
            <h6>Our most learned Topics</h6>
          </div>
          <div className="home__most-learned__list">
            {mostLearnedTopics.map((topic) => (
              <a key={topic.topicId} href={`vocabularies.html?topic=${topic.topicId}`} className="home__most-learned__list__item">
                <div className="card text-bg-dark">
                  <Image src={topic.image} alt={topic.topicName} className="card-img" width={300} height={200} />
                  <div className="card-img-overlay">
                    <h6>{topic.categoryName}</h6>
                    <h4>{topic.topicName}</h4>
                    <p>Total Words: {topic.wordCount}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="home__suggest">
          <div className="home__suggest__title">
            <h4>Our Suggestions</h4>
          </div>
          {suggestedCategories.map((category) => (
            <div key={category.cateId} className="home__suggest__cate">
              <div className="home__suggest__cate__title">
                <h4>{category.cateName}</h4>
              </div>
              <div className="home__suggest__cate__list">
                {category.topics &&
                  category.topics.map((topic) => (
                    <div key={topic.topicId} className="home__suggest__cate__list__item">
                      <a href={`vocabularies.html?topic=${topic.topicId}`} style={{ width: "100%" }}>
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
                            <p className="card-body__wrd-cnt">Total Words: {topic.wordCount}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
