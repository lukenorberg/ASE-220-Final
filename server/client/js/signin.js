$(document).ready(function() {
    navBar();
    meta("Sign In");

    document
        .getElementById("signin")
        .addEventListener("click", function(e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            axios
                .post("http://localhost:3000/api/auth/signin", {
                    email,
                    password,
                })
                .then((response) => {
                    console.log(
                        "Logged in successfully:",
                        response.data.jwt,
                    );
                    localStorage.setItem("token", response.data.jwt);
                    $('[class="form-control"]').val('');
                    alert("You are logged in!");
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    alert(error.response.data.data);
                });
        });
});
