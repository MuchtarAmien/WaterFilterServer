const motorToggle = document.getElementById("motorToggle");

motorToggle.addEventListener("change", async (e) => {
    const resp = await httpRequest({
        url: "/api/v1/device/toggle",
        body: {
            kode_unik: activeFilter?.kode_unik,
            isTurnOn: motorToggle.checked,
        },
    });

    if (resp.success) {
        alertify.set("notifier", "position", "top-right");
        alertify.success(resp.message);
    }

    if (!resp.success) {
        alertify.set("notifier", "position", "top-right");
        alertify.error(resp.errors);
    }
});
