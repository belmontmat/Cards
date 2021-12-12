//this is a garbage file but includes code structure similar to what i need
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Load initial page state and event listeners
   */
  function init() {
    .addEventListener("click", );
  }



  /**
   * Takes a response from a GET fetch to the books endpoint and populates the all books section
   * @param {Response} jresponse - a JSON API Response object
   */
  function processBooks(jresponse) {
    let container = document.getElementById("all-books");
    container.innerHTML = "";
    for (let i = 0; i < jresponse.length; i++) {
      let bcard = document.createElement("div");
      let title = document.createElement("p");
      title.textContent = jresponse[i]["title"];
      let cover = document.createElement("img");
      cover.src = "covers/" + jresponse[i]["book_id"] + ".jpg";
      cover.alt = "cover of " + jresponse[i]["title"];
      bcard.appendChild(cover);
      bcard.appendChild(title);
      bcard.classList.add("selectable");
      bcard.addEventListener("click", function() {
        singleBook(jresponse[i]["book_id"]);
      });
      container.appendChild(bcard);
    }
  }

  /**
   * Handles populating the single book section after a book is clicked on. It does so by making 3
   * FETCH calls to the bestreads API
   * @param {String} id - a unique String used to reference a book in the database
   */
  function singleBook(id) {
    document.getElementById("all-books").classList.add("hidden");
    document.getElementById("single-book").classList.remove("hidden");
    let cover = document.getElementById("book-cover");
    cover.src = "covers/" + id + ".jpg";
    fetch('/bestreads/description/' + id)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(processDesc)
      .catch(console.error);

    fetch('/bestreads/info/' + id)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processInfo)
      .catch(console.error);

    fetch('/bestreads/reviews/' + id)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processReviews)
      .catch(console.error);
  }

  /**
   * Takes a response from a GET fetch to the description endpoint and populates the description
   * section
   * @param {Response} tresponse - a text API Response object
   */
  function processDesc(tresponse) {
    let container = document.getElementById("book-description");
    container.textContent = tresponse;
  }

  /**
   * Takes a response from a GET fetch to the info endpoint and populates the title/author section
   * @param {Response} jresponse - a JSON API Response object
   */
  function processInfo(jresponse) {
    let author = document.getElementById("book-author");
    let title = document.getElementById("book-title");
    author.textContent = jresponse["author"];
    title.textContent = jresponse["title"];
  }

  /**
   * Takes a response from a GET fetch to the reviews endpoint and populates the reviews section
   * @param {Response} jresponse - a JSON API Response object
   */
  function processReviews(jresponse) {
    let container = document.getElementById("book-reviews");
    container.innerHTML = "";
    let avg = 0;
    for (let i = 0; i < jresponse.length; i++) {
      let score = jresponse[i]["rating"];
      avg += score;
      let reviewer = document.createElement("h3");
      let rating = document.createElement("h4");
      let review = document.createElement("p");
      reviewer.textContent = jresponse[i]["name"];
      rating.textContent = "Rating: " + score.toFixed(1);
      review.textContent = jresponse[i]["text"];

      container.appendChild(reviewer);
      container.appendChild(rating);
      container.appendChild(review);
    }
    avg = avg / jresponse.length;
    document.getElementById("book-rating").textContent = avg.toFixed(1);
  }

  /**
   * display helpful error message on the page
   * @param {Response} response - an API Response object
   * @return {Response} the same input
   */
  function checkStatus(response) {
    if (!response.ok) {
      let output = document.getElementById("output");
      output.innerHTML = "";
      let text = document.createElement("p");
      text.textContent = "Words should begin with a letter";
      output.appendChild(text);
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }
})();
