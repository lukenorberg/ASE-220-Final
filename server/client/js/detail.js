$(document).ready(function() {
    navBar();
    meta("Details");

    let apiUrl = "http://localhost:3000/api/recipes";
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let recipeId = parseInt(urlParams.getAll("item")[0]);
    const token = localStorage.getItem("token");

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
                    `<li>${recipe.ingredients[i]}</li>`,
                );
            }
            for (let i in recipe.steps) {
                $("#steps").append(`<li>${recipe.steps[i]}</li>`);
            }
            if (response.data.isUser) {
                $("#author").text("You are the author");
            }
        }).catch((error) =>
            console.error("Error fetching profile:", error),
        );
});
