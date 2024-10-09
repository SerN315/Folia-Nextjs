'use client';

import { useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/authenciation";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import Head from "next/head";
import "../scss/favorite.scss";

export default function Favorite() {
  useEffect(() => {
    const getWordByName = (favoriteList) => {
      const favoriteListContainer = document.querySelector(".favorite__list");
      // Clear previous entries to prevent duplication
      favoriteListContainer.innerHTML = '';

      if (favoriteList.length === 0) {
        // Display message if no favorites are found
        favoriteListContainer.innerHTML = `
          <p class="no-favorites-text">You have no favorites at the moment go explore and store your favorite more knowlegde.</p>
        `;
      } else {
        favoriteList.forEach((favorite) => {
          const addedHTML = `
            <div class="favorite__list__item">
              <div class="favorite__list__item__img-container">
                <img src="${favorite.img}" alt="${favorite.word}" />
              </div>
              <div class="favorite__list__item__text-container">
                <div class="word-container">
                  <div class="word">
                    <h2>${favorite.word}</h2>
                    <p>${favorite.set}</p>
                  </div>
                  <i class="fa-solid fa-heart favorites show-modal-favo" style="color:red;"></i>
                </div>
                <div class="pronunciation-container">
                  <i class="fa-solid fa-volume-high"></i>
                  <p>${favorite.pronunciation}</p>
                </div>
                <div class="word-content">
                  <p class="meaning"><strong>Meaning:</strong> ${favorite.meaning}</p>
                </div>
              </div>
            </div>
            <hr />
          `;
          favoriteListContainer.insertAdjacentHTML("beforeend", addedHTML);
        });
      }
    };

    const firestore = getFirestore();

    // Monitor authentication state and fetch favorite list
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = auth.currentUser.uid;
        const favoriteRef = doc(firestore, "favorites", userId);

        try {
          const docSnapshot = await getDoc(favoriteRef);
          if (docSnapshot.exists()) {
            const favoriteList = docSnapshot.data().favoriteList || [];
            getWordByName(favoriteList);
          } else {
            // If no document is found, display a message
            document.querySelector(".favorite__list").innerHTML = `
              <p class="no-favorites-text">You have no favorite items at the moment.</p>
            `;
          }
        } catch (error) {
          console.error("Error fetching favorite list: ", error);
        }
      }
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Favorite - Folia</title>
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <TopNav />
      <main className="favorite-content">
        <h1 className="favorite-title">Favorite List</h1>
        <div className="favorite__list" />
      </main>
      <Footer />
    </>
  );
}
