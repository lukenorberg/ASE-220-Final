function navBar() {
    const navHTML = `
        <nav class="navbar navbar-expand-lg navbar-light mb-2 turqoise">
            <div class="container-fluid">
                <a class="navbar-brand text-light" href="..">SavorySagas</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link" href="/signin.html" id="signinBtn">Sign in</a>
                        <a class="nav-link" href="/signup.html" id="signupBtn">Sign up</a>
                    </div>
                </div>
            </div>
        </nav>
    `
    $('body').prepend(navHTML);
}


function addSignoutButton() {
    const token = localStorage.getItem("token");
    var el = document.getElementById('signout');
    if (token) {
        const signout = `<a class="nav-link" href="/" id="signout">Sign out</a>`;
        $(".navbar-nav").append(signout);
        $('body').append(`<script src="./js/signout.js"></script>`);

        const signin = document.getElementById('signinBtn');
        const signup = document.getElementById('signupBtn');
        signin.parentNode.removeChild(signin);
        signup.parentNode.removeChild(signup);
    } else if (!token && el) {
        el.parentNode.removeChild(el);
    }
}

function meta(title) {
    const metaHTML = `
        
            <title>${title}</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
                integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
                integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
                crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
            <link rel="stylesheet" href="./css/styles.css" type="text/css" />
        
    `
    $('head').append(metaHTML);
}
