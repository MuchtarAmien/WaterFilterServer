const formEmail = document.getElementById("floating_email");
const formPassword = document.getElementById("floating_password");
const formUsername = document.getElementById("floating_username");
const settingsButton = document.getElementById("setting-button");

settingsButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameValue = String(formUsername.value).trim();
    const emailValue = String(formEmail.value).trim();
    const passwordValue = String(formPassword.value).trim();
    const fileInput = document.getElementById("file-input");
    const profilePicture = document.getElementById("profile-picture");
    const response = await httpRequest({
        url: "/api/v1/user/update/profile",
        method: "POST",
        body: {
            username: usernameValue,
            email: emailValue,
            password: passwordValue,
            profilePicture: profilePicture.src,
        },
    });
    alertify.set("notifier", "position", "top-right");
    if (response.success) {
        console.log("Profil Terupdate");
        alertify.success("Profil Terupdate");
        window.location.reload();
    } else {
        console.log("Profil Gagal");
        alertify.error("Profil Gagal Terupdate");
    }
});
