"use client";
import "../scss/cate.scss";
import ScrollableList from "../Component/scrollableComponent";
import { useEffect, useState } from "react";
import { getDatabase } from "../js/api/databaseAPI";
import { useSearchParams } from "next/navigation";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import Head from "next/head";
import "../scss/cate_2.scss";

export default function Category2() {
  const searchParams = useSearchParams();
  const id = searchParams.get("topic");

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define images for each topic type
  const heroImages = {
    "folia-asvab": {
      img1: "./img/Rectangle1670.png",
      img2: "./img/Rectangle1671.png",
      img3: "./img/Rectangle1672.png",
    },
    "folia-SAT": {
      img1: "./img/sat-hero-1.png",
      img2: "./img/sat-hero-2.png",
      img3: "./img/sat-hero-3.png",
    },
    "folia-GED": {
      img1: "./img/ged-hero-1.png",
      img2: "./img/ged-hero-2.png",
      img3: "./img/ged-hero-3.png",
    },
    "folia-NCLEX": {},
    "folia-ACT": {},
    "folia-GRE": {},
    // Add more images as needed for other topics
  };

  // Get the appropriate images based on the topic
  const images = heroImages[id] || {
    img1: "./img/Rectangle1670.png", // default image 1
    img2: "./img/Rectangle1671.png", // default image 2
    img3: "./img/Rectangle1672.png", // default image 3
  };

  // Define images for each topic type
  const texts = {
    "folia-asvab": {
      text1: "Wecolome to Folia-ASVAB",
      text2: "Start Practicing For Your ASVAB Certificate ",
    },
    "folia-SAT": {
      text1: "Wecolome to Folia-SAT",
      text2: "Start Practicing For Your SAT Certificate ",
    },
    "folia-GED": {
      text1: "Wecolome to Folia-GED",
      text2: "Start Practicing For Your GED Certificate ",
    },
    "folia-NCLEX": {
      text1: "Wecolome to Folia-NCLEX",
      text2: "Start Practicing For Your NCLEX Certificate ",
    },
    "folia-ACT": {
      text1: "Wecolome to Folia-ACT",
      text2: "Start Practicing For Your ACT Certificate ",
    },
    "folia-GRE": {
      text1: "Wecolome to Folia-GRE",
      text2: "Start Practicing For Your GRE Certificate ",
    },
  };

  // Get the appropriate images based on the topic
  const text = texts[id] || {
    text1: "Wecolome to Folia",
    text2: "Start Practicing For Your Certificate ",
  };

  useEffect(() => {
    // Define database IDs for each topic type
    const databaseIds = {
      "folia-asvab": "d62d1d0bae164347b13143e0503a5280",
      "folia-SAT": "954089bc53fb407192bcaec2549725a1",
      "folia-GED": "e7d0c4eb138342cfa988c5f39ea55ed6",
      "folia-NCLEX": "5aef13734f3345269127919131ce875d",
      "folia-ACT": "818ef610f58041d4a760af1349e23791",
      "folia-GRE": "e40b9cb547044e8d92bc1f4385bdaa52",
    };

    // Function to load topics
    const loadTopics = async (dbId) => {
      const response = await getDatabase(dbId, {});
      const reversedResponse = response.reverse();
      const storedTopics = JSON.parse(localStorage.getItem("topics")) || [];

      const newTopics = reversedResponse.map((item) => {
        const topicID = item.id;
        const name = item.properties.Name.title[0]?.plain_text;
        const SVG =
          item.properties?.SVG?.rich_text?.[0]?.plain_text ??
          item.properties?.img?.rich_text?.[0]?.plain_text;
        const des = item.properties.Des.rich_text[0]?.plain_text;
        const fname =
          item.properties.fname?.rich_text[0]?.plain_text ??
          item.properties.Fullname.rich_text[0]?.plain_text;
        const db = item.properties.db?.rich_text[0]?.plain_text ?? topicID; // Default to topicID if no db field

        // Check if the topic is already in local storage
        if (!storedTopics.includes(topicID)) {
          storedTopics.push(topicID);
        }

        return {
          topicID,
          name,
          SVG,
          des,
          fname,
          db,
        };
      });

      // Update topics and local storage
      setTopics(newTopics);
      localStorage.setItem("topics", JSON.stringify(storedTopics));
      setLoading(false);
    };

    if (databaseIds[id]) {
      loadTopics(databaseIds[id]);
    } else {
      setLoading(false); // If no matching ID, just stop loading
    }
  }, [id]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia</title>
      </Head>

      <TopNav />
      <div className="home__hero-section">
        <div className="home__hero-section__container">
          {/* Hero image and text content */}
          <div className="home-hero-img">
            <div className="home-hero-img__container">
              {/* Hero images */}
              <img
                src={images.img1}
                className="home-hero-img__container__img1"
                loading="lazy"
              />
              <img
                src={images.img2}
                className="home-hero-img__container__img2"
                loading="lazy"
              />
              <img
                src={images.img3}
                className="home-hero-img__container__img3"
                loading="lazy"
              />
            </div>
          </div>
          <div className="col-lg-6 home-hero-text">
            <div className="home-hero-text__container">
              <h5>{text.text1},</h5>
              <h1>{text.text2}</h1>
              <div className="home-hero-text__container__cate-link">
                {/* <a href="hub.html">View our categories</a>
                <i className="fa-solid fa-arrow-right"></i> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container container-fluid">
        <div className="shower">
          <h1 className="shower__title">Choose your prefrences topic</h1>
          <div
            id="topic-list"
            className={`topic-list ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <div id="topic-list" class="topic-list loading">
                <div class="card topic">
                  <div class="topic-img">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div class="topic-title">
                    <h2></h2>
                    <h3></h3>
                    <h2></h2>
                  </div>
                </div>
                <div class="card topic">
                  <div class="topic-img">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div class="topic-title">
                    <h2></h2>
                    <h3></h3>
                    <h2></h2>
                  </div>
                </div>
                <div class="card topic">
                  <div class="topic-img">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div class="topic-title">
                    <h2></h2>
                    <h3></h3>
                    <h2></h2>
                  </div>
                </div>
              </div>
            ) : (
              topics.map((topic) => (
                <div
                  className="card topic"
                  data-topic-id={topic.topicID}
                  key={topic.topicID}
                >
                  <a href={`multichoices?topic=${topic.db}&tag=${topic.fname}`}>
                    <div
                      className="topic-img"
                      style={{ backgroundImage: `url(${topic.SVG})` }}
                    ></div>
                    <div className="topic-title">
                      <h2>{topic.name}</h2>
                      <h3>{topic.des}</h3>
                      <h2 style={{ color: "#226500" }}>Practice</h2>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
