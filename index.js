$(document).ready(function() {
  var apiUrl = "https://jsonblob.com/api/jsonBlob/1212147388440764416";
  var offset = 0;
  var rpp = 9;
  var selectedId = -1;
  var currentFilter = "All";

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
  let largestServing = 20;
  for (let i = 1; i <= largestServing; i++) {
    $("#servings").append(`<option value="${i}">${i}</option>`);
  }

  function getIndex(id, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  function clearForm() {
    $("#change-form").trigger("reset");
    $("#ingredients").empty();
    $("#steps").empty();
  }

  // Create card function

  function createCard(index, recipes) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `card-${recipes[index].id}`;
    card.setAttribute("data-id", recipes[index].id);
    card.innerHTML = fillCardInfo(index, recipes);
    document.getElementById("content").append(card);
    if (offset + rpp + 1 > recipes.length) {
      $("#load-more").addClass("hide");
    }
  }

  // Generating card info (displaying card data)

  function fillCardInfo(index, recipes) {
    return `
    <a href="detail.html?item=${recipes[index].id}">
      <div class="img-div">
        <img src="${recipes[index].image}">
      </div>
      <div class="h1-div">
        <h1 class="text-truncate">${recipes[index].name}</h1>
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
  var fullRecipes;
  function displayCards(contentCleared = false) {
    $.get(apiUrl, function(data) {
      fullRecipes = data;
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
    }).fail(function() {
      console.log("Error loading data from the API.");
    });
  }

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

  // Delete logic
  $(document).on("click", ".btn-delete", function() {
    let id = parseInt($(this).attr("data-id"));
    let index = getIndex(id, fullRecipes);
    fullRecipes.splice(index, 1);
    $.ajax({
      type: "PUT",
      url: apiUrl,
      data: JSON.stringify(fullRecipes),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        $("#content").empty();
        displayCards(true);
      },
      error: function(errMsg) {
        alert(errMsg);
      },
    });
  });

  // Update logic

  $(document).on("click", ".update-btn", function() {
    clearForm();
    $("#btn-change").attr("data-action", "update");
    $("#modify-title").text("Update recipe");
    selectedId = parseInt($(this).attr("data-id"));
    recipeIndex = getIndex(selectedId, recipes);
    let recipe = recipes[recipeIndex];

    for (key in recipe) {
      if (!Array.isArray(recipe[key])) {
        $(`[name="${key}"]`).val(recipe[key]);
      }
    }
    for (let i = 0; i < recipe.ingredients.length; i++) {
      $("#ingredients").append(
        `<div class="d-flex">
            <input class="form-control mb-3 ingredient-input" name="ingredient-${i}" value="${recipe.ingredients[i]}"/>
            <button class="btn btn-danger del-input">X</button>
        </div>`,
      );
    }
    for (let i = 0; i < recipe.steps.length; i++) {
      $("#steps").append(
        `<div class="d-flex">
          <textarea class="form-control textarea mb-3 step-input" name="step-${i}">${recipe.steps[i]}</textarea>
          <button class="btn btn-danger del-input">X</button>
        </div>`,
      );
    }
  });

  $(document).on("click", "#btn-change", function() {
    let action = $(this).attr("data-action");
    let randomId = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    let recipe = {
      id: action === "update" ? parseInt(selectedId) : randomId,
      ingredients: [],
      steps: [],
    };
    selectedId = -1;

    for (let i = 0; i < $(".ingredient-input").length; i++) {
      recipe.ingredients.push($(".ingredient-input")[i].value);
    }
    for (let i = 0; i < $(".step-input").length; i++) {
      recipe.steps.push($(".step-input")[i].value);
    }
    for (let i in inputKeys) {
      recipe[inputKeys[i]] = $(`[name=${inputKeys[i]}]`)[0].value;
    }
    if (action === "update") {
      let index = getIndex(recipe.id, fullRecipes);
      fullRecipes[index] = recipe;
    } else {
      fullRecipes.push(recipe);
    }
    $.ajax({
      type: "PUT",
      url: apiUrl,
      data: JSON.stringify(fullRecipes),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        if (action === "create") {
          clearForm();
        }
        $("#content").empty();
        displayCards(true);
      },
      error: function(errMsg) {
        alert(errMsg);
      },
    });
  });

  // Create logic
  $(document).on("click", "#create-btn", function() {
    clearForm();
    $("#btn-change").attr("data-action", "create");
    $("#modify-title").text("Create recipe");
  });

  // Modal logic
  $(document).on("click", ".del-input", function() {
    $(this).closest("div").remove();
  });

  $(document).on("click", "#add-ingredient", function() {
    let name = $(".ingredient-input").length + 1;
    $("#ingredients").append(
      `<div class="d-flex">
        <input class="form-control mb-3 ingredient-input" name="ingredient-${name}"/>
        <button class="btn btn-danger del-input">X</button>
      </div>`,
    );
  });

  $(document).on("click", "#add-step", function() {
    let name = $(".step-input").length + 1;
    $("#steps").append(
      `<div class="d-flex">
        <textarea class="form-control textarea mb-3 step-input" name="step-${name}"></textarea>
        <button class="btn btn-danger del-input">X</button>
      </div>`,
    );
  });
});
