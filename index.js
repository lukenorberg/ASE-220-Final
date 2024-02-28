$(document).ready(function() {
  let apiUrl = "https://jsonblob.com/api/jsonBlob/1212147388440764416";

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
	  $("#load-more").addClass("hide");
    }
  }
  
// Generating card info (displaying card data)

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
    }).fail(function() {
      console.log("Error loading data from the API.");
    });
  };
  
  displayCards();

// "Load more" button

  $('#load-more').on("click", function() {
    offset += 9;
    displayCards();
  });
  
// Toggling filter dropdown menu

  $('.dropdown-toggle').on("click", function() {
    $(this).next('.dropdown-menu').toggle();
  });
  
// Filter functionality
  
  $('[data-id="all"]').prop("disabled", true);
  
  function filter(category) {
	$.get(apiUrl, function(data) {
	  recipes = data;
	  for(let i = 0; i < recipes.length; i++){
	    if (recipes[i].category == category){
	      createCard(i, recipes);
	    }
	  }
	});
  }
  
  $('.dropdown-item').on("click", function() {
	let category = $(this).text();
	$("#content").empty();
    if (category != "All"){
	  filter(category);
	}
	else{
	  offset = 0;
	  $("#load-more").removeClass("hide");
	  displayCards();
	}
	
	let dropdown = $(this).closest('.dropdown').find('.dropdown-menu');
	dropdown.toggle(); // Hiding dropdown menu

	$('#dropdownMenu2').text(category);
	$('.dropdown-item').prop("disabled", false);
	$(this).prop("disabled", true);
  });
});