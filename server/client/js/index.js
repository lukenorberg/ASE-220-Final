import { jwtDecode } from "./jwt-decode.js";
import { clearForm, updateTotalTime, addServingSizes, addTimeOptions } from "./modal.js";

var token;
var recipes;
var fullRecipes;
var currentFilter;
var offset;
var rpp;
var apiUrl = "http://localhost:3000/api/recipes";

export function displayCards(contentCleared = false) {
    $.get(apiUrl, function(data) {
        fullRecipes = data.data;
        recipes = fullRecipes;
        let filteredRecipes = [];
        if (currentFilter !== "All") {
            for (let i = 0; i < fullRecipes.length; i++) {
                if (fullRecipes[i].category === currentFilter) {
                    filteredRecipes.push(fullRecipes[i]);
                }
            }
            recipes = filteredRecipes;
        }
        for (
            let i = contentCleared ? 0 : offset;
            i < Math.min(offset + rpp, recipes.length);
            i++
        ) {
            createCard(i, recipes);
        }
    }).fail(function() { });
}

// Create card function
function createCard(index, recipes) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `card-${recipes[index]._id}`;
    card.setAttribute("data-id", recipes[index]._id);
    card.innerHTML = fillCardInfo(index, recipes);
    document.getElementById("content").append(card);
    if (offset + rpp + 1 > recipes.length) {
        $("#load-more").addClass("hide");
    }
}

// Generating card info (displaying card data)
function fillCardInfo(index, recipes) {
    var authorName = recipes[index].author;

    if (token) {
        const fullName = jwtDecode(token).fullName;
        if (fullName === authorName) {
            authorName = "You";
        }
    }
    return `
		<a href="detail.html?item=${recipes[index]._id}">
		  <div class="img-div">
			<img src="${recipes[index].image}">
		  </div>
		  <div class="h1-div">
			<h1 class="text-truncate">${recipes[index].name}</h1>
		  </div>
		  <p class="author">Author: <span>${authorName}</span></p>
		</a>
		<div class="d-flex btns" id="btn-box-${recipes[index]._id}">
		</div>
	  `;
}

$(document).ready(function() {
    navBar();
    addSignoutButton();
    meta("Recipes");

    token = localStorage.getItem("token");

    // adds create button if user is signed in
    const createBtn = `<button 
		id="create-btn" 
		class="btn 
			btn-primary" 
			data-bs-toggle="modal" 
			data-bs-target="#modal-update">
			Create
	</button>`;
    if (token) {
        $('#create').append(createBtn);
    }

    offset = 0;
    rpp = 9;
    var selectedId = -1;
    currentFilter = "All";

    var inputKeys = [
        "name",
        "category",
        "author",
        "cook_time",
        "image",
        "prep_time",
        "servings",
        "total_time",
    ];

    // creates serving size options
    addServingSizes();

    //creates prep & cook time options
    addTimeOptions();

    //calculates total time
    var prepHrs = 0;
    var prepMins = 0;
    var cookHrs = 0;
    var cookMins = 0;

    $(document).on('change', '.prep_time.time_hrs', function() {
        prepHrs = parseInt($(this).val());
        updateTotalTime();
    });

    $(document).on('change', '.prep_time.time_mins', function() {
        prepMins = parseInt($(this).val());
        updateTotalTime();
    });

    $(document).on('change', '.cook_time.time_hrs', function() {
        cookHrs = parseInt($(this).val());
        updateTotalTime();
    });

    $(document).on('change', '.cook_time.time_mins', function() {
        cookMins = parseInt($(this).val());
        updateTotalTime();
    });

    // Displaying the recipe cards with GET request
    displayCards();

    // "Load more" button
    $("#load-more").on("click", function() {
        offset += 9;
        displayCards();
    });

    // Toggling filter dropdown menu
    $(".dropdown-toggle").on("click", function() {
        $(this).next(".dropdown-menu").toggle();
    });

    $(".dropdown-item").on("click", function() {
        offset = 0;
        $("#load-more").removeClass("hide");
        currentFilter = $(this).text();
        $("#content").empty();
        displayCards();
        let dropdown = $(this).closest(".dropdown").find(".dropdown-menu");
        dropdown.toggle(); // Hiding dropdown menu

        $("#dropdownMenu2").text($(this).text());
        $(".dropdown-item").prop("disabled", false);
        $(this).prop("disabled", true);
    });

    // Create logic
    $(document).on("click", "#create-btn", function() {
        clearForm();
        $("#save-changes-btn").attr("data-action", "create");
        $("#modify-title").text("Create recipe");

        const fullName = localStorage.getItem("fullName")
        $("#m-authorName").val(fullName);
        const author = document.getElementById("authorName");

        let ingNum = $(".ingredient-input").length + 1;
        $("#m-ingredients").append(
            `<div class="d-flex">
				<input class="form-control mb-3 ingredient-input" id="ingredient-${ingNum}"/>
				<button class="btn btn-danger del-input">X</button>
			</div>`,
        );

        let stepNum = $(".step-input").length + 1;
        $("#m-steps").append(
            `<div class="d-flex">
				<textarea class="form-control textarea mb-3 step-input" id="step-${stepNum}"></textarea>
				<button class="btn btn-danger del-input">X</button>
			</div>`,
        );
    });
});

