'use client';

import { useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/authenciation";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import Head from "next/head";
import "../scss/favorite.scss";

export default function Favorite() {
  useEffect(() => {
    const firestore = getFirestore();

    const getWordByName = (favoriteList) => {
      const favoriteListContainer = document.querySelector(".favorite__list");
      // Clear previous entries to prevent duplication
      favoriteListContainer.innerHTML = '';

      if (favoriteList.length === 0) {
        // Display message if no favorites are found
        favoriteListContainer.innerHTML = `
          <p class="no-favorites-text">You have no favorites at the moment. Go explore and store your favorite knowledge.</p>
        `;
      } else {
        favoriteList.forEach((favorite) => {
          const addedHTML = `
            <div class="favorite__list__item" data-id="${favorite.id}">
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
            <hr /> <!-- Add hr here to be removed together with the item -->
          `;
          favoriteListContainer.insertAdjacentHTML("beforeend", addedHTML);
        });
      }

      // Attach click event listener for the favorites icon
      const favoritesIcons = document.querySelectorAll(".favorites");
      favoritesIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
          const itemId = e.target.closest('.favorite__list__item').dataset.id;
          removeFavorite(itemId); // Call removeFavorite here
        });
      });
    };

    const removeFavorite = async (id) => {
      const userId = auth.currentUser.uid;
      const favoriteRef = doc(firestore, "favorites", userId);
    
      try {
        const docSnapshot = await getDoc(favoriteRef);
        if (docSnapshot.exists()) {
          const favoriteList = docSnapshot.data().favoriteList || [];
    
          // Check if the item exists in the favorite list
          const itemExists = favoriteList.some(item => item.id === parseInt(id)); // Ensure you're comparing the correct types
          if (!itemExists) {
            console.log(`Item with id ${id} does not exist in favorites.`);
            return; // Exit if item doesn't exist
          }
    
          // Filter out the item to be removed
          const updatedFavorites = favoriteList.filter(item => item.id !== parseInt(id));
    
          // Update the Firestore document
          await updateDoc(favoriteRef, { favoriteList: updatedFavorites });
          console.log(`Item with id ${id} removed from favorites successfully.`);
    
          // Remove from the UI
          const itemToRemove = document.querySelector(`.favorite__list__item[data-id="${id}"]`);
          const hrToRemove = itemToRemove ? itemToRemove.nextElementSibling : null; // Get the <hr> after the item
    
          if (itemToRemove) {
            itemToRemove.remove(); // Remove the item from the DOM
          }
          if (hrToRemove) {
            hrToRemove.remove(); // Remove the <hr> from the DOM
          }
        } else {
          console.log("Favorite document does not exist in Firestore.");
        }
      } catch (error) {
        console.error("Error removing favorite: ", error);
      }
    };

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
