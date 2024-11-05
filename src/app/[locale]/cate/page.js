'use client';
import '../scss/cate.scss'
import ScrollableList from "../Component/scrollableComponent";
import { useEffect, useState } from "react";
import { getDatabase } from "../js/api/databaseAPI";
import { useSearchParams } from "next/navigation";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import Head from "next/head";
import Link from 'next/link';

export default function Category() {
  const [response1, setResponse1] = useState([]);
  const [response2, setResponse2] = useState([]);
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

  const renderContent = () => {
    if (id === 'folia-asvab') {
      return(
        <>
        <div className="home__hero-section">
    <div className="home__hero-section__container">
      <div className="home-hero-img">
        <div className="home-hero-img__container">
          <img
            src="./img/Rectangle1670.png"
            className="home-hero-img__container__img1"
            loading="lazy"
            width="48%"
            height="59.2%"
          />
          <img
            src="./img/Rectangle1671.png"
            className="home-hero-img__container__img2"
            loading="lazy"
            width="67%"
            height="94.6%"
          />
          <img
            src="./img/Rectangle1672.png"
            className="home-hero-img__container__img3"
            loading="lazy"
            width="35.1%"
            height="29.1%"
          />
          <div className="home-hero-img__container__box1" />
          <div className="home-hero-img__container__box2" />
        </div>
      </div>
      <div className="col-lg-6 home-hero-text">
        <div className="home-hero-text__container">
          <h5>Welcome to Folia,</h5>
          <h1>Start Learning Your Suitable Subject,</h1>
          <div className="home-hero-text__container__cate-link">
            <Link href="hub.html">View our categories</Link>
            <i className="fa-solid fa-arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="main-container container-fluid">
    <div className="shower">
      <div id="topic-list" className="topic-list loading">
        <div className="card topic">
          <div className="topic-img">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="topic-title">
            <h2 />
            <h3 />
            <h2 />
          </div>
        </div>
        <div className="card topic">
          <div className="topic-img">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="topic-title">
            <h2 />
            <h3 />
            <h2 />
          </div>
        </div>
        <div className="card topic">
          <div className="topic-img">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="topic-title">
            <h2 />
            <h3 />
            <h2 />
          </div>
        </div>
      </div>
      <div className="topic-list" />
    </div>
  </div>
  </>
      )
    } else if (id === 'folia-language') {
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
                          return (
                            <Link href={`vocabularies?topic=${topicId}`} className="topic" key={topicId}>
                              <div className="topic__img">
                                <img src={img} alt={topicName} />
                              </div>
                              <div className="topic__text">
                                <h3>{topicName}</h3>
                                <p>Total words: {formulaValue.split(" ").length}</p>
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
