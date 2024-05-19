const { resError, resSuccess } = require("../../services/responseHandler");
const { generateString } = require("../../services/stringGenerator");
const prisma = require("../../prisma/client");

exports.deviceList = async (req, res) => {
    try {
        return resSuccess({ res, title: "Success to show all device list", data: ["device 1", "device 2"] });
    } catch (error) {
        return resError({ res, errors: error });
    }
}

exports.generateDeviceId = async (req, res) => {
    try {
        const kodeUnikPerangkat = generateString(5);
        await prisma.perangkat.create({
            data: {
                kode_unik: kodeUnikPerangkat,
                nama_alat: kodeUnikPerangkat,
                control_motor_dc: false,
                monior_kekeruhan: 0,  // Pastikan nama kolomnya benar
                monitor_ph: 0,
                monitor_tds: 0
            }
        });

        return resSuccess({ res, title: "Success to create new device", data: { "device_id": kodeUnikPerangkat } });
    } catch (error) {
        return resError({ res, errors: error });
    }
}

exports.generateRecord = async (req, res) => {
    try {
        // Mendapatkan data dari body permintaan
        const { kode_unik, control_motor_dc, monior_kekeruhan, monitor_ph, monitor_tds } = req.body;

        // Log untuk debugging
        console.log("Received kode_unik:", kode_unik);
        console.log("Request body:", req.body);

        // Validasi data yang diterima
        if (!kode_unik || monior_kekeruhan === undefined || monitor_ph === undefined || monitor_tds === undefined) {
            console.log("Invalid data provided");
            return resError({ res, errors: "Invalid data provided" });
        }

        // Periksa apakah perangkat dengan kode_unik tersebut ada
        const deviceExists = await prisma.perangkat.findUnique({
            where: { kode_unik: kode_unik }
        });

        // Log hasil query findUnique untuk debugging
        console.log("Device exists:", deviceExists);

        if (!deviceExists) {
            console.log("Device not found for kode_unik:", kode_unik);
            return resError({ res, errors: "Device not found" });
        }

        // Perbarui tabel perangkat dengan nilai yang baru diterima
        const updateDevice = await prisma.perangkat.update({
            where: { kode_unik: kode_unik },
            data: {
                control_motor_dc: control_motor_dc,
                monior_kekeruhan: monior_kekeruhan,  // Pastikan nama kolomnya benar
                monitor_ph: monitor_ph,
                monitor_tds: monitor_tds
            }
        });

        console.log("Device updated:", updateDevice);

        // Tambahkan record tersebut ke dalam tabel "Riwayat"
        const newRecord = await prisma.riwayat.create({
            data: {
                kode_unik: kode_unik,
                control_motor_dc: control_motor_dc,
                monior_kekeruhan: monior_kekeruhan,
                monitor_ph: monitor_ph,
                monitor_tds: monitor_tds
            }
        });

        console.log("New record created:", newRecord);

        // Mengirim respons ke klien bahwa record baru telah berhasil dibuat
        return resSuccess({ res, title: "Success to create new record", data: newRecord });
    } catch (error) {
        // Menangani kesalahan dan mengirim respons error
        console.error("Error creating record:", error);
        return resError({ res, errors: error.message });
    }
};
