const { resError, resSuccess } = require("../../services/responseHandler");
const { generateString } = require("../../services/stringGenerator");
const prisma = require("../../prisma/client");
var mqtt = require('mqtt');
// Import EventEmitter
const EventEmitter = require('events');

// Buat instance EventEmitter
const switchEmitter = new EventEmitter();

var options = {
    host: '068b2e83115c4ff99fd703a20d77ab14.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'muchtar123',
    password: 'Muchtar123'
};

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected to MQTT broker');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
});

function handleSwitchToggle(isChecked) {
    // Mengirim sinyal berbeda berdasarkan arah switch
    const signal = isChecked ? '1' : '0'; // Jika switch ke kanan, kirim '1', jika ke kiri, kirim '0'
    client.publish('controlMotor', signal, function (err) {
        if (err) {
            console.log('Gagal mengirim pesan MQTT', err);
        } else {
            console.log('Pesan MQTT berhasil dikirim');
        }
    });
}

// Fungsi untuk menginisialisasi listener untuk perubahan switch
function initializeSwitchListener(io) {
    // Menambahkan event listener untuk perubahan status switch
    switchEmitter.on('switchChanged', function (isChecked) {
        // Memanggil fungsi handleSwitchToggle saat status switch berubah
        handleSwitchToggle(isChecked);
    });
}

module.exports = { switchEmitter, initializeSwitchListener };

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

        console.log("Received kode_unik:", kode_unik);
        console.log("Request body:", req.body);

        if (!kode_unik || monior_kekeruhan === undefined || monitor_ph === undefined || monitor_tds === undefined) {
            console.log("Invalid data provided");
            return resError({ res, errors: "Invalid data provided" });
        }

        const deviceExists = await prisma.perangkat.findUnique({
            where: { kode_unik: kode_unik }
        });

        console.log("Device exists:", deviceExists);

        if (!deviceExists) {
            console.log("Device not found for kode_unik:", kode_unik);
            return resError({ res, errors: "Device not found" });
        }

        const updateDevice = await prisma.perangkat.update({
            where: { kode_unik: kode_unik },
            data: {
                control_motor_dc: control_motor_dc,
                monior_kekeruhan: monior_kekeruhan,
                monitor_ph: monitor_ph,
                monitor_tds: monitor_tds
            }
        });

        console.log("Device updated:", updateDevice);

        // Periksa entri terbaru di tabel "Riwayat"
        const recentRecord = await prisma.riwayat.findFirst({
            where: { id_perangkat: deviceExists.id_perangkat },
            orderBy: { createdAt: 'desc' }
        });

        // Dapatkan waktu sekarang
        const now = new Date();

        // Periksa apakah ada entri dan selisih waktunya lebih dari satu menit
        if (!recentRecord || (now - new Date(recentRecord.createdAt)) > 60000) {
            const newRecord = await prisma.riwayat.create({
                data: {
                    monitor_tds: monitor_tds,
                    monitor_ph: monitor_ph,
                    monior_kekeruhan: monior_kekeruhan,
                    id_perangkat: deviceExists.id_perangkat
                }
            });

            console.log("New record created:", newRecord);

            // Send MQTT message
            client.publish('controlMotor', '0', function (err) {
                if (err) {
                    console.log('Failed to send MQTT message', err);
                } else {
                    console.log('MQTT message sent successfully');
                }
            });

            return resSuccess({ res, title: "Success to create new record", data: newRecord });
        } else {
            console.log("New record not created because the time difference is less than 1 minute");
            return resError({ res, errors: "New record not created because the time difference is less than 1 minute" });
        }
    } catch (error) {
        console.error("Error creating record:", error);
        return resError({ res, errors: error.message });
    }
};
