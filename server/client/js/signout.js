var token = localStorage.getItem("token");

if (token) {
    document.getElementById('signout').addEventListener("click", function(e) {
        e.preventDefault();

        meta("Sign out");
        localStorage.removeItem("token");

        token = localStorage.getItem("token");
        if (!token) {
            var el = document.getElementById('signout');
            el.parentNode.removeChild(el);
            alert("You have been signed out");
            location.href = "../";
        }
        else {
            alert("Error signing out");
        }
    })
}
