$(document).ready(function() {
    navBar();
    addSignoutButton();
    meta("Details");

    let apiUrl = "http://localhost:3000/api/recipes";
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let recipeId = urlParams.getAll("item")[0];
    var token = localStorage.getItem("token");

    axios
        .get(`${apiUrl}/${recipeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            const recipe = response.data.data;
            $("#photo").attr("src", recipe.image);
            for (let key in recipe) {
                if (!Array.isArray(recipe[key])) {
                    $(`#${key}`).text(recipe[key]);
                }
            }
            for (let i in recipe.ingredients) {
                $("#ingredients").append(
                    `<li id="item-${i}">${recipe.ingredients[i]}</li>`,
                );
            }
            for (let i in recipe.steps) {
                $("#steps").append(`<li>${recipe.steps[i]}</li>`);
            }
            $("#prep_time").text(`${recipe.prep_time_hrs} hour(s), ${recipe.prep_time_mins} minutes`);
            $("#cook_time").text(`${recipe.cook_time_hrs} hour(s), ${recipe.cook_time_mins} minutes`);
            if (response.data.isUser) {
                $("#author").text("You are the author");

                if (token) {
                    var url = window.location.href;
                    var urlObject = new URL(url);
                    var idValue = urlObject.searchParams.get('item');
                    var recipeId = parseInt(idValue);
                    const btns = `
						<div id="detailBtns">
							<button data-id="${recipe.id}" class="btn btn-secondary update-btn" data-bs-toggle="modal" data-bs-target="#modal-update" id="editBtn">Edit</button>
							<button data-id="${recipe.id}" class="btn btn-danger btn-delete" id="deleteBtn">Delete</button>
						</div>
					`;
                    $('#btns').append(btns);
                }
            }
        }).catch((error) =>
            console.error("Error fetching recipe information:", error),
        );
});
