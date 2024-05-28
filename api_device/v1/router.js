// controller.js

// Definisikan fungsi untuk menghandle request deviceList
function deviceList(req, res) {
    // Logika untuk menangani permintaan
    res.send('Ini adalah contoh respon dari route deviceList');
}

// Definisikan fungsi untuk menghandle request generateDeviceId
function generateDeviceId(req, res) {
    // Logika untuk menangani permintaan
    res.send('Ini adalah contoh respon dari route generateDeviceId');
}

// Definisikan fungsi untuk menghandle request generateRecord
function generateRecord(req, res) {
    // Logika untuk menangani permintaan
    res.send('Ini adalah contoh respon dari route generateRecord');
}

// Export fungsi-fungsi agar dapat digunakan di file lain
module.exports = {
    deviceList: deviceList,
    generateDeviceId: generateDeviceId,
    generateRecord: generateRecord
};
