const formKodeUnik = document.getElementById("kode_unik");
const formNamaPerangkat = document.getElementById("device_name");
const pairingButton = document.getElementById("pairing-button");

pairingButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const kodeUnikValue = String(formKodeUnik.value).trim();
    const namaPerangkatValue = String(formNamaPerangkat.value).trim();

    const resp = await httpRequest({
        url: "/api/v1/device/link",
        body: {
            kode_unik: kodeUnikValue,
            nama_perangkat: namaPerangkatValue,
        },
    });

    if (resp.success) {
        alertify.set("notifier", "position", "top-right");
        alertify.success("Berhasil menautkan perangkat");
        setTimeout(() => {
            window.location = "/";
        }, 1000);
    }

    if (!resp.success) {
        alertify.set("notifier", "position", "top-right");
        alertify.error(resp.errors);
    }
});
