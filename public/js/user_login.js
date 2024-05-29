const formEmail = document.getElementById("floating_email");
const formPassword = document.getElementById("floating_password");
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = String(formEmail.value).trim();
    const passwordValue = String(formPassword.value).trim();

    const resp = await httpRequest({
        url: "/api/v1/user/login",
        body: {
            username: emailValue,
            password: passwordValue,
        },
    });

    if (resp.success) {
        window.location = "/";
    }

    console.log(alertify);
    if (!resp.success) {
        console.log("GAGAL");
        alertify.set("notifier", "position", "top-right");
        alertify.error("Gagal Login");
    }
});
