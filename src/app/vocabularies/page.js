'use client'
import { useState, useEffect } from "react";
import Head from "next/head";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/vocabularies.scss";
import "../scss/subnav.scss";
import Link from "next/link";
import {
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc
} from "firebase/firestore";
import { useSearchParams } from 'next/navigation';
import { auth } from "../firebase/authenciation"; 
import { getDatabase } from "../js/api/databaseAPI";
import { fetchTopic } from "../js/api/specificPageApi";

export default function Vocabularies() {
  const searchParams = useSearchParams(); // Access query params
  const topicID = searchParams.get('topic'); // Get the 'topic' query param
  const [data, setData] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const firestore = getFirestore();

    // Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userid = auth.currentUser.uid;
        const favoriteRef = doc(firestore, "favorites", userid);
        
        getDoc(favoriteRef).then((docSnapshot) => {
          const favoriteList = docSnapshot.exists() ? docSnapshot.data().favoriteList : [];
          setFavoriteList(favoriteList); // Set favorite list
          fetchVocabBasedOnTopic(favoriteList, favoriteRef, firestore);
        });
      } else {
        fetchVocabBasedOnTopic([], null, firestore);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [topicID]);

  const fetchVocabBasedOnTopic = (favoriteList, favoriteRef, firestore) => {
    setLoading(true); // Start loading
    getDatabase("8240dd072127443f8e51d09de242c2d9", {
      filter: {
        property: "Topic",
        relation: {
          contains: topicID,
        },
      },
    })
    .then((response) => {
      console.log("API Response:", response);
      
      const newData = response.map((item) => {
        try {
          const uniqueId = item.properties.ID.unique_id.number; // Make sure 'ID' exists
          const word = item.properties.Name.title[0]?.plain_text; // Check 'Name'
          const set = item.properties.Set.multi_select[0]?.name; // Check 'Set'
          const meaning = item.properties.Meaning.rich_text[0]?.plain_text; // Check 'Meaning'
          const pronunciation = item.properties.Pronunciation.rich_text[0]?.plain_text; // Check 'Pronunciation'
          const img = item.properties.img.rich_text[0]?.plain_text; // Check 'img'
      
          // Log each extracted value for debugging
          console.log({
            uniqueId,
            word,
            set,
            meaning,
            pronunciation,
            img,
          });
      
          return {
            Id: uniqueId,
            Word: word,
            Set: set,
            Meaning: meaning,
            Pronunciation: pronunciation,
            Img: img,
          };
        } catch (error) {
          console.error("Error processing item:", item, error);
          return null; // Return null in case of error
        }
      }).filter(item => item !== null); // Filter out any null values
      
      // Use the previous state to append new vocabulary items
      setData((prevData) => {
        const updatedData = [...prevData, ...newData];
        console.log("Updated Data:", updatedData); // Log the updated data
        return updatedData;
      });


      fetchTopic(topicID)
      .then((topic) => {
        console.log("Topic:", topic);
    
        // Select the element with the class 'topic'
        const topicElement = document.querySelector(".topic");
        const cateElement = document.querySelector(".category");
        // Check if topic exists and has a name
        if (topic && topic.topicName) {
          topicElement.innerHTML = topic.topicName; // Set the topic name
        } else {
          topicElement.innerHTML = "No topic available"; // Fallback message
        }
        if (topic && topic.topicName) {
          cateElement.innerHTML = topic.categories[0].categoryName; // Set the topic name
        } else {
          cateElement.innerHTML = "No topic available"; // Fallback message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.querySelector(".topic").innerHTML = "Error fetching topic"; // Error handling message
      });
      setLoading(false); // Stop loading
    })
    .catch((error) => {
      console.error("Error fetching vocabularies:", error);
      setData([]); 
      setLoading(false); // Stop loading even on error
    });
  };

  const handleFavoriteToggle = (word) => {
    const index = favoriteList.findIndex(item => item.id === word.Id);
    let updatedFavorites;
    
    if (index !== -1) {
      // If already a favorite, remove it
      updatedFavorites = favoriteList.filter(item => item.id !== word.Id);
    } else {
      // If not a favorite, add it
      updatedFavorites = [...favoriteList, {
        id: word.Id,
        img: word.Img,
        meaning: word.Meaning,
        pronunciation: word.Pronunciation,
        set: word.Set,
        word: word.Word,
      }];
    }

    setFavoriteList(updatedFavorites); // Update state

    const firestore = getFirestore();
    const userid = auth.currentUser.uid;
    const favoriteRef = doc(firestore, "favorites", userid);
    setDoc(favoriteRef, { favoriteList: updatedFavorites }, { merge: true })
    .then(() => {
      console.log("Favorites updated successfully");
    })
    .catch((error) => {
      console.error("Error updating favorites: ", error);
    });

  };
  const handleReport = (word) => {
    const firestore = getFirestore();
    const palceholderText =
      "We appreciate your help in maintaining accurate information. Please take a moment to provide us with an explanation of the false information you've encountered.";

    const reportForm = `
      <form class="report-form">
        <div class="mb-3">
          <label for="report" class="form-label">Report False Information</label>
          <textarea class="form-control" placeholder="${palceholderText}" id="reportInput" rows="20"></textarea>
        </div>
        <div class="button-container">
          <button type="submit" class="btn send-report">Submit</button>
          <button type="reset" class="btn cancel-report">Cancel</button>
        </div>
      </form>
    `;

    document.querySelector(".word-box-overlay").innerHTML = reportForm;
    document.querySelector(".word-box-overlay").classList.remove("hidden");

    document.querySelector(".report-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.querySelector("#reportInput").value;

      addDoc(collection(firestore, "reports"), { content: text, word: word });
      document.querySelector(".word-box-overlay").classList.add("hidden");
      document.querySelector(".word-box-overlay").innerHTML = "";
    });

    document.querySelector(".cancel-report").addEventListener("click", () => {
      document.querySelector(".word-box-overlay").classList.add("hidden");
      document.querySelector(".word-box-overlay").innerHTML = "";
    });
  };
  const openModal = (word) => {
    const wordBox = document.querySelector(".word-box-overlay");
    const vocabDetailed = `
      <div class="modal1">
        <button class="close-modal">&times;</button>
        <div class="anh">
          <img src="${word.Img}" width="100%" alt="word-img" />
        </div>
        <div class="word-box">
          <div class="flex-box">
            <p class="new-word">${word.Word}</p>
            <p class="word-set">${word.Set}</p>
          </div>     
          <p class="pronun"><i class="fa-solid fa-volume-high"></i>${word.Pronunciation}</p>
        </div>
        <div class="meaning-box">
          <p class="definition-viet">
            <span style="color:green">Nghĩa: </span>${word.Meaning}
          </p>
          <p class="definition-example">
            <span style="color:green">Example: </span>
          </p>
        </div>
      </div>`;

    wordBox.innerHTML = vocabDetailed; // Set the inner HTML
    wordBox.classList.remove("hidden");

    document.querySelector(".close-modal").addEventListener("click", () => {
      wordBox.classList.add("hidden");
      wordBox.innerHTML = ""; // Clear content
    });
      // Close modal when clicking outside the .modal1 element
  wordBox.addEventListener("click", (e) => {
    if (e.target === wordBox) {
      wordBox.classList.add("hidden");
      wordBox.innerHTML = ""; // Clear content
    }
  });
  };
  const handleScroll = () => {
    let scrollProgress = document.getElementById("progress");
    let calcScrollValue = () => {
      let pos = document.documentElement.scrollTop;
      let calcHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrollValue = Math.round((pos * 100) / calcHeight);
      scrollProgress.style.display = pos > 100 ? "grid" : "none";
      scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
      });
      scrollProgress.style.background = `conic-gradient(#3fbd00 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
    };
    window.onscroll = calcScrollValue;
    window.onload = calcScrollValue;
  };
  
// // LINK TỚI CÁC CHỨC NĂNG KHÁC
// document.querySelector(
//   ".flashcard-link"
// ).href = `flashcard.html?topic=${topicID}`;
// document.querySelector(".d-and-d-link").href = `d_and_d.html?topic=${topicID}`;

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <title>English - Vocabulary</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
      </Head>
      {/* <TopNav/> */}
      <div id="progress">
        <span id="progress-value">
          <i className="fa-solid fa-arrow-up" />
        </span>
      </div>
<main className="bigArticle">
      {/* NAVIGATION PANEL */}
        {/* NAVIGATION PANEL */}
        <div className="nav-panel">
          <p className="nav-panel__navigation">
            <Link href="#" cate="" className="cate-link">
              Categories
            </Link>{" "}
            &gt; Category: <span className="category">...</span> &gt; Topic:
            <span className="topic">...</span>
          </p>
          <h3 className="nav-panel__main-title">Vocabulary</h3>
          <div className="nav-panel__dropdown">
            <p>Practices</p>
            <i className="fa-solid fa-chevron-down fa-s" />
          </div>
          <div className="nav-panel__game-list">
            <Link href={`/flashcard?topic=${topicID}`} className="nav-panel__game-list__game-item flashcard-link">
              <i className="fa-regular fa-images" />
              <p>Flashcard</p>
            </Link>
            <Link href={`/dragdrop?topic=${topicID}`} className="nav-panel__game-list__game-item d-and-d-link">
              <i className="fa-regular fa-hand" />
              <p>Drag&amp;Drop</p>
            </Link>
          </div>
        </div>

      {/* VOCABULARY MAIN CONTENT */}
      <div className="article">
      {loading ? ( // Show loading state
    // Skeleton loader for vocabulary item
    <>

<div className="vocabulary-load">
  <i className="fa-solid fa-heart favorites" />
  <div className="vocabulary-load-image" />
  <div className="vocabulary-load-word">
    <div className="word-load">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-set">
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-pronunciation">
      <i className="fa-solid fa-volume-high" />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-audio" />
  </div>
</div>
<div className="vocabulary-load">
  <i className="fa-solid fa-heart favorites" />
  <div className="vocabulary-load-image" />
  <div className="vocabulary-load-word">
    <div className="word-load">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-set">
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-pronunciation">
      <i className="fa-solid fa-volume-high" />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-audio" />
  </div>
</div>
<div className="vocabulary-load">
  <i className="fa-solid fa-heart favorites" />
  <div className="vocabulary-load-image" />
  <div className="vocabulary-load-word">
    <div className="word-load">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-set">
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-pronunciation">
      <i className="fa-solid fa-volume-high" />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-audio" />
  </div>
</div>
<div className="vocabulary-load">
  <i className="fa-solid fa-heart favorites" />
  <div className="vocabulary-load-image" />
  <div className="vocabulary-load-word">
    <div className="word-load">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-set">
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-pronunciation">
      <i className="fa-solid fa-volume-high" />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div className="word-load-audio" />
  </div>
</div>
    </>
  )  : (
    data.length > 0 ? ( // Check if there's data to render
      data.map((word, index) => (
        <div className="vocabulary show-modal" key={index} >
          <div className="vocabulary-image">
            <img src={word.Img} alt={word.Word} />
          </div>
          <div className="vocabulary-word" onClick={() => openModal(word)}>
            <div className="word">{word.Word}</div>
            <div className="word-set">{word.Set}</div>
            <div className="word-pronunciation">
              <i className="fa-solid fa-volume-high" /> {word.Pronunciation}
            </div>
            <div className="word-meaning">{word.Meaning}</div> {/* Add meaning if needed */}
          </div>
          <div className="icon-container">
            <i className="fa-solid fa-flag report" onClick={() => handleReport(word.Word)}></i>
            {user && ( // Only show the favorite button if the user is logged in
          <div className="favorite-toggle">
            <button
              className={`favorite-btn ${favoriteList.some(item => item.id === word.Id) ? 'favorited' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleFavoriteToggle(word); // Pass word object directly
              }}
            >
              <i className="fa fa-heart" style={{ color: favoriteList.some(item => item.id === word.Id) ? 'red' : 'inherit' }}></i>
            </button>
          </div>
        )}
          </div>
        </div>
      ))
    ) : (
      <p>No vocabulary found.</p> // Message if no data
    )
  )}
  </div>
</main>

      <div className="word-box-overlay overlay hidden"></div>
      {/* <Footer /> */}
    </>
  );
}


