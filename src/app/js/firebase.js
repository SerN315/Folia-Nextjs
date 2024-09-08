// let registerE = document.querySelector(".btnDk");
// let loginE = document.querySelector(".btnDn");
// // // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getDatabase, set, ref, update } from 'firebase/database';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// // // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuc1s-5DA5R0lSDqVYp6HAG1hvwH8Jbc8",
  authDomain: "folia-c597d.firebaseapp.com",
  databaseURL: "https://folia-c597d-default-rtdb.firebaseio.com",
  projectId: "folia-c597d",
  storageBucket: "folia-c597d.appspot.com",
  messagingSenderId: "515814194700",
  appId: "1:515814194700:web:1a5576859573e5f610f829",
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const auth = getAuth();
// const user = auth.currentUser;

// //Set register Function
// if (registerE) {
//   registerE.addEventListener("click", (e) => {
//     var email = document.getElementById("dkemail").value;
//     var username = document.getElementById("dkusername").value;
//     var password = document.getElementById("dkpassword").value;

//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;

//         set(ref(database, "user/" + user.uid), {
//           username: username,
//           email: email,
//           last_login: Date.now(),
//         });
//         alert("User Created");
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;

//         alert(errorMessage);
//         // ..
//       });
//     });
// } else {
//   console.log('The register element does not exist.');
// }

// //Login
// if (loginE) {
// loginE.addEventListener("click", (e) => {
// var email = document.getElementById("email").value;
// var password = document.getElementById("password").value;
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;

//     update(ref(database, "user/" + user.uid), {
//       last_login: Date.now(),
//     });
//     alert("Login Success");
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     alert(errorMessage);
//   });
// });
// }
// else {
//   console.log("the login element does not exist")
// }

// onAuthStateChanged(auth, (user) => {
// if (user) {
//   // User is signed in, see docs for a list of available properties
//   // https://firebase.google.com/docs/reference/js/auth.user
//   const uid = user.uid;
//   // ...
// } else {
//   // User is signed out
//   // ...
// }
// });

// // //Logout user
// // logout.addEventListener("click", (e) => {
// //   signOut(auth)
// //     .then(() => {
// //       // Sign-out successful.
// //       alert("Log Out Success");
// //     })
// //     .catch((error) => {
// //       // An error happened.
// //       const errorCode = error.code;
// //       const errorMessage = error.message;
// //       alert(errorMessage);
// //     });
// // });
