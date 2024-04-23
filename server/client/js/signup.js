$(document).ready(function() {
    navBar();
    meta("Details");

    document.getElementById("signup").addEventListener("click", function(e) {
        e.preventDefault();
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        axios
            .post("http://localhost:3000/api/auth/signup", {
                firstName,
                lastName,
                email,
                password,
            })
            .then((response) => {
                console.log("Signed up successfully:", response.data.jwt);
                localStorage.setItem("token", response.data.jwt);
                $('[class="form-control"]').val('');
                alert("You are signed up!");
            })
            .catch((error) => {
                console.error("Error signing up:", error);
                alert(error.response.data.data);
            });
    });
});
