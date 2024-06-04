const { resError, resSuccess } = require("../../services/responseHandler");
const { generateString } = require("../../services/stringGenerator");
const prisma = require("../../prisma/client");

exports.deviceList = async (req, res) => {
    try {
        return resSuccess({
            res,
            title: "Success to show all device list",
            data: ["device 1", "device 2"],
        });
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.generateDeviceId = async (req, res) => {
    try {
        const kodeUnikPerangkat = generateString(5);
        await prisma.perangkat.create({
            data: {
                kode_unik: kodeUnikPerangkat,
                nama_alat: kodeUnikPerangkat,
                control_motor_dc: false,
                monior_kekeruhan: "0", // Pastikan nama kolomnya benar
                monitor_ph: "0",
                monitor_tds: "0",
            },
        });

        return resSuccess({
            res,
            title: "Success to create new device",
            data: { device_id: kodeUnikPerangkat },
        });
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.generateRecord = async (req, res) => {
    try {
        // Mendapatkan data dari body permintaan
        const {
            kode_unik,
            control_motor_dc,
            monior_kekeruhan,
            monitor_ph,
            monitor_tds,
        } = req.body;

        console.log("Received kode_unik:", kode_unik);
        console.log("Request body:", req.body);

        if (
            !kode_unik ||
            monior_kekeruhan === undefined ||
            monitor_ph === undefined ||
            monitor_tds === undefined
        ) {
            console.log("Invalid data provided");
            return resError({ res, errors: "Invalid data provided" });
        }

        const deviceExists = await prisma.perangkat.findUnique({
            where: { kode_unik: kode_unik },
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
                monitor_tds: monitor_tds,
            },
        });

        console.log("Device updated:", updateDevice);

        // Periksa entri terbaru di tabel "Riwayat"
        const recentRecord = await prisma.riwayat.findFirst({
            where: { id_perangkatr: deviceExists.id_perangkat },
            orderBy: { createdAt: "desc" },
        });

        // Dapatkan waktu sekarang
        const now = new Date();

        // Periksa apakah ada entri dan selisih waktunya lebih dari satu menit
        if (!recentRecord || now - new Date(recentRecord.createdAt) > 60000) {
            const newRecord = await prisma.riwayat.create({
                data: {
                    monitor_tds: monitor_tds,
                    monitor_ph: monitor_ph,
                    monior_kekeruhan: monior_kekeruhan,
                    id_perangkatr: deviceExists.id_perangkat,
                },
            });

            console.log("New record created:", newRecord);

            return resSuccess({
                res,
                title: "Success to create new record",
                data: newRecord,
            });
        } else {
            console.log(
                "New record not created because the time difference is less than 1 minute"
            );
            throw "New record not created because the time difference is less than 1 minute";
        }
    } catch (error) {
        console.error("Error creating record:", error);
        return resError({ res, errors: error });
    }
};

exports.linkDeviceToUser = async (req, res) => {
    try {
        const { kode_unik, nama_perangkat } = req.body;
        const userId = req.userId;

        console.log("Request body:", req.body);
        console.log("User ID:", userId);

        // Cek Apakah Perangkat ada
        const deviceExists = await prisma.perangkat.findUnique({
            where: { kode_unik: kode_unik },
        });
        if (!deviceExists) throw "Perangkat tidak ditemukan";

        const linkDevice = await prisma.perangkat.update({
            where: {
                id_perangkat: deviceExists.id_perangkat,
            },
            data: {
                userId: userId,
                nama_alat: nama_perangkat,
            },
            select: {
                id_perangkat: true,
                nama_alat: true,
                kode_unik: true,
                User: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return resSuccess({
            res,
            title: "Success to link device with user",
            data: linkDevice,
        });
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.userDeviceList = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("User ID: ", userId);
        const userDevice = await prisma.perangkat.findMany({
            where: {
                userId: userId,
            },
            select: {
                id_perangkat: true,
                kode_unik: true,
                nama_alat: true,
            },
            orderBy: {
                id_perangkat: "desc",
            },
        });

        return resSuccess({
            res,
            title: "Success to show user device",
            data: userDevice,
        });
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.deviceHistory = async (req, res) => {
    try {
        const { kode_unik, tanggal_awal, tanggal_akhir } = req.query;
        console.log("Kode Unik Perangkat: ", kode_unik);
        console.log("Tanggal Awal: ", tanggal_awal);
        console.log("Tanggal Akhir: ", tanggal_akhir);

        const device = await prisma.perangkat.findUnique({
            where: {
                kode_unik,
            },
        });

        if (!device) throw "Device Tidak Ditemukan";

        const deviceHistory = await prisma.riwayat.findMany({
            where: {
                id_perangkatr: device.id_perangkat,
                createdAt: {
                    gte: tanggal_awal
                        ? new Date(tanggal_awal)
                        : new Date(new Date().setDate(new Date().getDay() - 7)),
                    lte: tanggal_akhir ? new Date(tanggal_akhir) : new Date(),
                },
            },
        });

        return resSuccess({
            res,
            title: "Success to show user device",
            data: deviceHistory,
        });
    } catch (error) {
        return resError({ res, errors: error });
    }
};
