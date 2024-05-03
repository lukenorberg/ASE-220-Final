$(document).ready(function() {
    navBar();
    addSignoutButton();
    meta("Sign In");

    document
        .getElementById("signin")
        .addEventListener("click", function(e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email == "") {
                if (password == "") {
                    alert("Please enter a username and password to sign in");
                    return;
                }
                alert("Please enter a username to sign in");
            } else if (password == "") {
                alert("Please enter a password to sign in");
            } else {
                axios
                    .post("http://localhost:3000/api/auth/signin", {
                        email,
                        password,
                    })
                    .then((response) => {
                        localStorage.setItem("token", response.data.jwt);
                        localStorage.setItem("id", response.data.data._id);
                        localStorage.setItem("fullName", response.data.data.first_name + " " + response.data.data.last_name)
                        $('[class="form-control"]').val('');
                        alert("You are logged in!");
                        location.href = "../";
                    })
                    .catch((error) => {
                        console.error("Error logging in:", error);
                        alert(error.response.data.data);
                    });
            }
        });
});
