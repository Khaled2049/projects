import "./style.css";

import { setUpGemini } from "./gemini.js";

document.querySelector("#app").innerHTML = `
  <div class="container">
    <h1>Start your novel today 😊</h1>
    <textarea id="userInput" placeholder="Enter your text..."></textarea>
    <span id="loading" class="loading">...</span>
  </div>
`;

setUpGemini(
  document.getElementById("userInput"),
  document.getElementById("loading")
);
