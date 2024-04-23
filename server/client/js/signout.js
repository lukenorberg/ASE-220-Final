$(document).ready(function() {
    navBar();
    meta("Sign out");

    const token = localStorage.getItem("token");

    if (!token) {
        location.href = "../";
    }

    localStorage.removeItem("token");
    axios
        .get("http://localhost:3000/api/auth/signout")
        .then((res) => {
            console.log("Signed out",);
        })
        .catch((err) => {
            console.error("Error logging in:", error);
        });
});

