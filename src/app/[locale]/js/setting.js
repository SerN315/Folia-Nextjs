'use client'
import { auth } from "../firebase/authenciation";
import { db } from "../firebase/authenciation";
import { storageRef, storage } from "../firebase/authenciation";
import initTranslations from '../../i18n';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from "firebase/auth";

// Utility function to check if an element exists
function getElement(selector) {
  return document.querySelector(selector);
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null; // Return null if the cookie doesn't exist
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    const creationTime = new Date(user.metadata.creationTime);
    const year = creationTime.getFullYear();
    const month = creationTime.toLocaleString("default", { month: "long" });

    const avatarimg = getElement(".user-img");
    const hoverOverlay = getElement(".hover_overlay");

    // Only add event listeners if elements exist
    if (hoverOverlay && avatarimg) {
      hoverOverlay.style.display = "none";
      avatarimg.addEventListener(
        "mouseenter",
        () => (hoverOverlay.style.display = "flex")
      );
      hoverOverlay.addEventListener(
        "mouseleave",
        () => (hoverOverlay.style.display = "none")
      );
    }

    if (avatarimg) {
      avatarimg.src = user.photoURL;
    }

    const usernameText = getElement(".username_text");
    const userIdText = getElement(".userId_text");
    const createdText = getElement(".created_text");

    if (usernameText) usernameText.textContent = user.displayName;
    if (userIdText) userIdText.textContent = user.email;
 // Translation function
    async function Translation(month, year) {
      // Get the locale from cookies
      const locale = getCookie('NEXT_LOCALE') || 'en'; // Default to 'en' if no locale is found
    
      const { t } = await initTranslations(locale, ['profile+setting']); // Load the 'profile+setting' namespace
    
      const createdText = document.querySelector(".created_text");
    
      // Translate and set the text content
      if (createdText) {
        createdText.textContent = t('timeprofile', { ns: 'profile+setting', month, year });
      }
    }
    
    // Call the Translation function and pass the month and year
    Translation(month, year);
    // Handle avatar list display
    // const avatarList = getElement("#avatar-list");
    // if (avatarList) avatarList.style.display = "none";

    // const settingOverlay = getElement(".setting-overlay");
    // if (settingOverlay) settingOverlay.style.display = "none";

    function displayAvatars() {
      const avatarList = getElement("#avatar-list");
      const wordBoxOverlay = getElement(".word-box-overlay");

      if (avatarList && wordBoxOverlay) {
        const hoverOverlayClick = getElement(".hover_overlay");
        if (hoverOverlayClick) {
          hoverOverlayClick.addEventListener("click", () => {
            avatarList.style.display = "flex";
            wordBoxOverlay.style.display = "flex";
          });
        }

        const closeBtn = getElement("#closebtn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            avatarList.style.display = "none";
            wordBoxOverlay.style.display = "none";
          });
        }
      }

      const avatarsRef = ref(storage, "avatar/");
      const userAvatarsRef = ref(storage, `avatar/${user.uid}/`);

      function listAvatarsFromRef(reference) {
        listAll(reference)
          .then((result) => {
            result.items.forEach((itemRef) => {
              getDownloadURL(itemRef).then((url) => {
                const img = document.createElement("img");
                img.src = url;
                img.width = 100;
                img.height = 100;

                img.addEventListener("click", () => {
                  if (avatarList && wordBoxOverlay) {
                    avatarList.style.display = "none";
                    wordBoxOverlay.style.display = "none";
                  }
                  changeAvatar(url);
                });
                if (avatarList) {
                  avatarList.appendChild(img);
                }
              });
            });
          })
          .catch(console.error);
      }

      listAvatarsFromRef(avatarsRef);
      listAvatarsFromRef(userAvatarsRef);
    }

    function uploadAvatar(event) {
      const file = event.target.files[0];
      const userAvatarRef = ref(storage, `avatar/${user.uid}/${file.name}`);

      uploadBytes(userAvatarRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            const newAvatarImg = document.createElement("img");
            newAvatarImg.src = downloadURL;
            newAvatarImg.width = 100;
            newAvatarImg.height = 100;

            newAvatarImg.addEventListener("click", () => {
              const avatarList = getElement("#avatar-list");
              const wordBoxOverlay = getElement(".word-box-overlay");

              if (avatarList && wordBoxOverlay) {
                avatarList.style.display = "none";
                wordBoxOverlay.style.display = "none";
              }
              changeAvatar(downloadURL);
            });

            const avatarList = getElement("#avatar-list");
            if (avatarList) {
              avatarList.appendChild(newAvatarImg);
            }
          });
        })
        .catch(console.error);
    }

    function setupAvatarUpload() {
      const addAvatarDiv = getElement("#addAvatar");
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";

      fileInput.addEventListener("change", uploadAvatar);
      document.body.appendChild(fileInput);

      if (addAvatarDiv) {
        addAvatarDiv.addEventListener("click", () => fileInput.click());
      }
    }

    setupAvatarUpload();

    function changeAvatar(url) {
      updateProfile(user, { photoURL: url })
        .then(() => {
          const avatarimg = getElement(".user-img");
          if (avatarimg) avatarimg.src = url;
          saveUserData(url, user.uid, user.displayName, user.email);
        })
        .catch(console.error);
    }

    displayAvatars(user.uid);
  }

  const accUpdateBtn = getElement(".acc-update");
  if (accUpdateBtn) {
    accUpdateBtn.addEventListener("click", () => {
      const popupContainer = getElement(".popup-container");
      const popup = getElement(".popup");

      if (popupContainer && popup) {
        popup.innerHTML = `
          <form class="update-info-form">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control usernameInput" id="inputUsername" placeholder="${user.displayName}" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control emailInput" id="inputEmail" placeholder="${user.email}" />
            </div>
            <div class="button-container">
              <button type="submit" class="btn submit btn-primary">Submit</button>
              <button type="reset" class="btn cancel btn-secondary">Cancel</button>
            </div>
          </form>
        `;
        popupContainer.classList.remove("hidden");

        const form = getElement(".update-info-form");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newUsername = getElement(".usernameInput").value;

            updateProfile(user, { displayName: newUsername }).then(() => {
              const usernameText = getElement(".username_text");
              if (usernameText) usernameText.textContent = newUsername;
            });

            popupContainer.classList.add("hidden");
          });
        }

        const cancelBtn = getElement(".cancel");
        if (cancelBtn) {
          cancelBtn.addEventListener("click", () => {
            popupContainer.classList.add("hidden");
          });
        }
      }
    });
  }

  const pwUpdateBtn = getElement(".pw");
  if (pwUpdateBtn) {
    pwUpdateBtn.addEventListener("click", () => {
      const popupContainer = getElement(".popup-container");
      const popup = getElement(".popup");

      if (popupContainer && popup) {
        popup.innerHTML = `
          <form class="update-pw-form">
            <div class="mb-3">
              <label for="password" class="form-label">Old Password</label>
              <input type="password" class="form-control" id="inputOldPw" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">New Password</label>
              <input type="password" class="form-control" id="inputNewPw" />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Re-confirm new Password</label>
              <input type="password" class="form-control" id="inputConfirmPassword" />
            </div>
            <div class="button-container">
              <button type="submit" class="btn submit btn-primary">Submit</button>
              <button type="reset" class="btn cancel btn-secondary">Cancel</button>
            </div>
          </form>
        `;
        popupContainer.classList.remove("hidden");

        const form = getElement(".update-pw-form");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newPw = getElement("#inputNewPw").value;
            updatePassword(user, newPw);
            popupContainer.classList.add("hidden");
          });
        }

        const cancelBtn = getElement(".cancel");
        if (cancelBtn) {
          cancelBtn.addEventListener("click", () => {
            popupContainer.classList.add("hidden");
          });
        }
      }
    });
  }
});
