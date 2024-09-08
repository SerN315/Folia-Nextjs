// IMPORTS
import { getDatabase2 } from "./api/databaseAPI";
import { auth } from "../../src/app/firebase/authenciation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

//COMPONENTS
$(function () {
  fetch("_topNav.html")
    .then((response) => response.text())
    .then((html) => {
      $("#topNav").html(html);
    });
});

fetch("_footer.html")
  .then((response) => response.text())
  .then((html) => {
    $("#footer").html(html);
  });

const getWordByName = (favoriteList, favoriteRef) => {
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
    document
      .querySelector(".favorite__list")
      .insertAdjacentHTML("beforeend", addedHTML);
  });
};

// KHỞI TẠO MỘT FIRESTORE INSTANCE
const firestore = getFirestore();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    const userid = auth.currentUser.uid;
    const favoriteRef = doc(firestore, "favorites", userid);
    getDoc(favoriteRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        let favoriteList = docSnapshot.data().favoriteList;
        getWordByName(favoriteList, favoriteRef);
      }
    });
  }
});
