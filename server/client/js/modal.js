var apiUrl = "http://localhost:3000/api/recipes";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipeId = urlParams.getAll("item")[0];

$(document).on("click", ".del-input", function() {
    $(this).closest("div").remove();
});

$(document).on("click", "#add-ingredient", function() {
    let name = $(".ingredient-input").length + 1;
    $("#m-ingredients").append(
        `<div class="d-flex">
			<input class="form-control mb-3 ingredient-input" id="ingredient-${name}"/>
			<button class="btn btn-danger del-input">X</button>
		</div>`,
    );
});

$(document).on("click", "#add-step", function() {
    let name = $(".step-input").length + 1;
    $("#m-steps").append(
        `<div class="d-flex">
			<textarea class="form-control textarea mb-3 step-input" id="step-${name}"></textarea>
			<button class="btn btn-danger del-input">X</button>
		</div>`,
    );
});

export function clearForm() {
    $("#change-form").trigger("reset");
    $("#m-ingredients").empty();
    $("#m-steps").empty();
    $("#ingredients").empty();
    $("#steps").empty();
}

export function addServingSizes() {
    let largestServing = 20;
    for (let i = 0; i <= largestServing; i++) {
        $("#servingSizes").append(`<option value="${i}">${i}</option>`);
    }
}

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

export function updateTotalTime() {
    var totalHrs = prepHrs + cookHrs;
    var totalMins = prepMins + cookMins;

    if (totalMins >= 60) {
        totalMins -= 60;
        totalHrs++;
    }

    var hours = "hours";
    var minutes = "minutes";

    if (totalHrs == 1) {
        hours = "hour";
    }

    var totalTimeString = totalHrs + " " + hours + ", " + totalMins + " " + minutes;

    document.getElementById('m-total-time').value = totalTimeString;
}

export function addTimeOptions() {
    const maxHours = 24;
    for (let i = 0; i <= maxHours; i++) {
        $("#prep_time_hrs").append(`<option value="${i}" class="hours">${i}</option>`);
        $("#cook_time_hrs").append(`<option value="${i}" class="hours">${i}</option>`);
    }
    const maxMinutes = 55;
    for (let i = 0; i <= maxMinutes; i += 5) {
        $("#prep_time_mins").append(`<option value="${i}" class="minutes">${i}</option>`);
        $("#cook_time_mins").append(`<option value="${i}" class="minutes">${i}</option>`);
    }
}

var recipe;

function appendIngredients(i) {
    const ingredients = `<div class="d-flex">
			<input class="form-control mb-3 ingredient-input" name="ingredient-${i + 1}" value="${recipe.ingredients[i]}" id="ingredient-${i + 1}"/>
			<button class="btn btn-danger del-input">X</button>
		</div>`;
    $("#m-ingredients").append(ingredients);
}
function appendSteps(i) {
    const steps = `<div class="d-flex">
		  <textarea class="form-control textarea mb-3 step-input" id="step-${i + 1}">${recipe.steps[i]}</textarea>
		  <button class="btn btn-danger del-input">X</button>
		</div>`;
    $("#m-steps").append(steps);
}

$(document).on("click", "#editBtn", function() {
    clearForm();
    $("#save-changes-btn").attr("data-action", "update");
    $("#modify-title").text("Update recipe");

    var selectedId = parseInt($(this).attr("data-id"));

    $.get(`${apiUrl}/${recipeId}`, function(data) {
        recipe = data.data;
        addTimeOptions();
        addServingSizes();

        $("#servingSizes").val(recipe.servings);

        $("#prep_time_hrs").each(function() {
            if (parseInt($(this).attr('value')) === parseInt(recipe.prep_time_hours)) {
                $(this).prop('selected', true);
                return false;
            }
        });
		
		prepHrs = parseInt(recipe.prep_time_hours);
		prepMins = parseInt(recipe.prep_time_minutes);
		cookHrs = parseInt(recipe.cook_time_hours);
		cookMins = parseInt(recipe.cook_time_minutes);
		
		$("#prep_time_hrs").val(recipe.prep_time_hours);
        $("#prep_time_mins").val(recipe.prep_time_minutes);
        $("#cook_time_hrs").val(recipe.cook_time_hours);
        $("#cook_time_mins").val(recipe.cook_time_minutes);
		

        for (var key in recipe) {
            if (!Array.isArray(recipe[key])) {
                $(`[name="${key}"]`).val(recipe[key]);
            }
        }
        for (let i = 0; i < recipe.ingredients.length; i++) {
            appendIngredients(i);
        }
        for (let i = 0; i < recipe.steps.length; i++) {
            appendSteps(i);
        }

    });
});

var inputKeys = [
    "name",
    "category",
    "author",
    "prep_time_hours",
    "prep_time_minutes",
    "cook_time_hours",
    "cook_time_minutes",
    "servings",
    "image",
    "total_time",
];

var prep_time_hours;
var prep_time_minutes;
var cook_time_hours;
var cook_time_minutes;

function updateTime(){
	if (prep_time_hours === null || prep_time_hours === undefined){
		prep_time_hours = 0;
	}
	if (prep_time_minutes === null || prep_time_minutes === undefined){
		prep_time_minutes = 0;
	}
	if (cook_time_hours === null || cook_time_hours === undefined){
		cook_time_hours = 0;
	}
	if (cook_time_minutes === null || cook_time_minutes === undefined){
		cook_time_minutes = 0;
	}
}

// Save logic
$(document).on("click", "#save-changes-btn", function() {
    const name = $('#recipe-name').val();
    const author = $('#m-authorName').val();
    const category = $('#m-category').find("option:selected").text();
	
	prep_time_hours = parseInt($('#prep_time_hrs').find("option:selected").text());
    prep_time_minutes = parseInt($('#prep_time_mins').find("option:selected").text());
	
	let hours = "hours";
	if (prep_time_hours == 1) { hours = "hour"; }
	const prep_time = prep_time_hours + " " + hours + ", " + prep_time_minutes + " minutes";
	
    cook_time_hours = parseInt($('#cook_time_hrs').find("option:selected").text());
    cook_time_minutes = parseInt($('#cook_time_mins').find("option:selected").text());
	
	updateTime();
	
	hours = "hours";
	if (cook_time_hours == 1) { hours = "hour"; }
	const cook_time = cook_time_hours + " " + hours + ", " + cook_time_minutes + " minutes";
	
    const total_time = $('#m-total-time').val();
    const serving_sizes = parseInt($('#servingSizes').find("option:selected").text());
    const img_url = $('input[name="image"]').val();
    const ingredient = $('#ingredient-1').val();
    const step = $('#step-1').val();

    const invalid_name = (name === "" || name === undefined);
    const invalid_prep_time = ((prep_time_hours == 0 && prep_time_minutes == 0) || prep_time_hours === undefined || prep_time_minutes === undefined);
    const invalid_serving_sizes = (serving_sizes == 0 || serving_sizes === undefined);
    const invalid_ingredient = (ingredient === "" || ingredient === undefined);
    const invalid_step = (step === "" || step === undefined);

    if (invalid_name || invalid_prep_time || invalid_serving_sizes || invalid_ingredient || invalid_step) {
        var message = "";

        if (invalid_name) { message += "\n  Recipe name"; }
        if (invalid_prep_time) { message += "\n  Prep time"; }
        if (invalid_serving_sizes) { message += "\n  Serving size"; }
        if (invalid_ingredient) { message += "\n  Ingredient(s)"; }
        if (invalid_step) { message += "\n  Step(s)"; }

        alert("The following fields are required:" + message);
    } else {
        let action = $(this).attr("data-action");
        let randomId = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        var selectedId = urlParams.getAll("item")[0];
        recipe = {
            id: action === "update" ? parseInt(selectedId) : "",
            ingredients: [],
            steps: [],
        };
		
		recipe.prep_time = prep_time;
		recipe.cook_time = cook_time;
		
        for (let i = 0; i < $(".ingredient-input").length; i++) {
            recipe.ingredients.push($(".ingredient-input")[i].value);
        }
        for (let i = 0; i < $(".step-input").length; i++) {
            recipe.steps.push($(".step-input")[i].value);
        }
        for (let i in inputKeys) {
            recipe[inputKeys[i]] = $(`[name="${inputKeys[i]}"]`).val();
        }

        const token = localStorage.getItem("token")
        recipe.author_id = localStorage.getItem("id");
		
        $.ajax({
            type: action === "update" ? "PUT" : "POST",
            url: apiUrl + (action === "update" ? `/${recipeId}` : ""),
            headers: { Authorization: `Bearer ${token}` },
            data: JSON.stringify(recipe),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
                if (action === "create") {
                    clearForm();
                    location.reload();
                } else {
                    $("#name").text(name)
                    $("#category").text(category)
                    $("#prep_time").text(prep_time);
                    $("#cook_time").text(cook_time);
                    $("#total_time").text(total_time);
                    $("#servings").text(serving_sizes);
                    const steps = document.querySelectorAll(".step-input");
                    const ingredients = document.querySelectorAll(".ingredient-input");

                    for (let i in steps) {
                        if (steps[i].value) {
                            $("#steps").append(
                                `<li id="item-${i}">${steps[i].value}</li>`,
                            );
                        }
                    }

                    for (let i in ingredients) {
                        if (ingredients[i].value) {
                            $("#ingredients").append(`<li>${ingredients[i].value}</li>`);
                        }
                    }

                }
                $("#content").empty();
            },
            error: function(errMsg) {
                alert(errMsg);
            },
        });
        $("#modal-update").modal("hide");
    }
});

// Delete logic
$(document).on("click", ".btn-delete", function() {
    $.ajax({
        type: "DELETE",
        url: `${apiUrl}/${recipeId}`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
            $("#content").empty();
            window.location.href = "http://localhost:3000/";
        },
        error: function(errMsg) {
            alert(errMsg);
        },
    });
});
