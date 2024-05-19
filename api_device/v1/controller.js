const { resError, resSuccess } = require("../../services/responseHandler")
const { generateString } = require("../../services/stringGenerator")
const prisma = require("../../prisma/client")

exports.deviceList = async (req, res) => {
    try {
        return resSuccess({ res, title: "Success to show all device list", data: ["device 1", "device 2"] })
    } catch (error) {
        return resError({ res, errors: error })
    }
}

exports.generateDeviceId = async (req, res) => {
    try {
        const kodeUnikPerangkat = generateString(5)
        await prisma.perangkat.create({
            data: {
                kode_unik: kodeUnikPerangkat,
                nama_alat: kodeUnikPerangkat,
                control_motor_dc: false,
                monior_kekeruhan: 0,
                monitor_ph: 0,
                monitor_tds: 0
            }
        })

        return resSuccess({ res, title: "Success to create new device", data: { "device_id": kodeUnikPerangkat } })
    } catch (error) {
        return resError({ res, errors: error })
    }
}

exports.generateRecord = async (req, res) => {
    try {
        // 1. Ambil Payload Yang Di Kirimkan Oleh ESP nantinya melalui request body
        // Payload yang diperlukan : kode_unik_perangkat, moniotr_kekurahan, monitor_ph, monitor_tds
        // 2. Update table perangkat dengan nilai yang baru di terima
        // 3. Tambahkan record tersebut ke dalam tabel "Riwayat" jika selisih waktu antara record perangkat di database di banding dengan masuknya
        // request baru berselang 1 menit, tetapi jika record perangkat kosong lalu masukan saja record baru
        return resSuccess({ res, title: "Success to create new record" })
    } catch (error) {
        return resError({ res, errors: error })
    }
}