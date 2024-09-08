// // var xhttp = new XMLHttpRequest();
// //   xhttp.onreadystatechange = function() {
// //     if (this.readyState == 4 && this.status == 200) {
// //       document.getElementById("nav").innerHTML = this.responseText;

// //       document.body.appendChild(script1);
// //     }
// //   };
// //   xhttp.open("GET", "topnav.html", true);
// //   xhttp.send();

// import axios from 'axios';
// async function fetchData() {
//   try {
//     const response = await axios.get('topnav.html');
//     console.log(response);
//     document.getElementById('nav').innerHTML = response.data;
//     // const script1 = document.createElement('script');
//     // document.body.appendChild(script1);
//   } catch (error) {
//     console.error(error);
//   }
// }
// fetchData();

import axios from "axios";

const dataContainer = document.getElementById("data-container");

axios
  .get("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => {
    const post = response.data;
    const postElement = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
        `;
    dataContainer.innerHTML = postElement;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Load the header component
const headerContainer = document.getElementById("nav");
fetch("topnav.html")
  .then((response) => response.text())
  .then((headerHTML) => {
    headerContainer.innerHTML = headerHTML;
  })
  .catch((error) => {
    console.error("Error loading header component:", error);
  });
