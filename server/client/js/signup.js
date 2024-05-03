$(document).ready(function() {
    navBar();
	addSignoutButton();
    meta("Details");

    document.getElementById("signup").addEventListener("click", function(e) {
        e.preventDefault();
        const first_name = document.getElementById("firstName").value;
        const last_name = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
		
		if (first_name == "" || last_name == "" || email == "" || password == ""){
			alert("Fields with a * are required");
		} else{
			axios.post("http://localhost:3000/api/auth/signup", {
					first_name,
					last_name,
					email,
					password,
			})
			.then((response) => {
				$('[class="form-control"]').val('');
				alert("You are signed up!");
				location.href = "../";
			})
			.catch((error) => {
				console.error("Error signing up:", error);
				alert(error.response.data.data);
			});
		};
	});
});
