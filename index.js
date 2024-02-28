
  let apiUrl = "http://jsonblob.com/api/jsonBlob/1212147388440764416";

  var offset = 0;
  var rpp = 9;
  let selectedIndex = 0;
  
// Create card function

  function createCard(index, recipes) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `card-${recipes[index].id}`;
    card.setAttribute("data-id", recipes[index].id);
    card.innerHTML = fillCardInfo(index, recipes);
    document.getElementById("content").append(card);
    if (offset + rpp > recipes.length) {
      loadMoreButton.hidden = true;
    }
  }
  
// Generating the card information (displaying card data)

  function fillCardInfo(index, recipes) {
    return `
    <a href="detail.html?item=${recipes[index].image}">
	  <div class="img-div">
	    <img src="${recipes[index].image}">
	  </div>
      <div class="h1-div">
	    <h1>${recipes[index].name}</h1>
	  </div>
      <p class="author">Author: <span>${recipes[index].author}</span></p>
    </a>
    <div class="d-flex btns" id="btn-box-${recipes[index].id}">
        <button data-id="${recipes[index].id}" class="btn btn-sm btn-danger btn-delete">Delete</button>
        <button data-id="${recipes[index].id}" class="btn btn-secondary update-btn" data-bs-toggle="modal" data-bs-target="#modal-update">Edit</button>
    </div>
  `;
  }
  
// Displaying the recipe cards with GET request
  
  var recipes;
  function displayCards(contentCleared = false) {
	$.get(apiUrl, function(data) {
	  recipes = data;
	  console.log(recipes);
      for (
        let i = contentCleared ? 0 : offset;
        i < Math.min(offset + rpp, recipes.length);
        i++
      ) {
        createCard(i, recipes);
      }
    });
  };
  
  displayCards();

// "Load more" button

  let loadMoreButton = document.createElement("button");
  loadMoreButton.classList.add("btn", "load-btn");
  loadMoreButton.classList.add("btn-primary");
  loadMoreButton.innerText = "Load more";
  loadMoreButton.addEventListener("click", function() {
    offset += 9;
    displayCards();
  });
  document.querySelector("#loadmore").append(loadMoreButton);