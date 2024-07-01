const formUsername = document.getElementById("floating_full_name");
const formEmail = document.getElementById("floating_email");
const formTelegramId = document.getElementById("floating_telegram"); // Ambil input telegramId
const formPassword = document.getElementById("floating_password");
const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameValue = String(formUsername.value).trim();
    const emailValue = String(formEmail.value).trim();
    const passwordValue = String(formPassword.value).trim();
    const telegramIdValue = String(formTelegramId.value).trim(); // Ambil nilai telegramId

    const response = await httpRequest({
        url: "/api/v1/user/register",
        method: "POST",
        body: {
            username: usernameValue,
            email: emailValue,
            password: passwordValue,
            telegramId: telegramIdValue, // Kirim nilai telegramId ke API
        },
    });

    if (response.success) {
        alertify.set("notifier", "position", "top-right");
        alertify.success("Berhasil Register");
        // Redirect
        window.location = "/user/login";
    } else {
        console.log("GAGAL");
        alertify.set("notifier", "position", "top-right");
        alertify.error("Gagal Register");
    }
});
