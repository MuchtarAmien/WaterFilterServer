// router.js

// Import module express
const express = require('express');

// Inisialisasi router
const router = express.Router();

// Import controller
const controller = require('./controller');

// Definisikan fungsi callback untuk route GET
function getHandler(req, res) {
    // Mengirimkan respon ke client
    res.send('Ini adalah contoh respon dari route GET');
}

// Menambahkan route GET dengan fungsi callback yang valid
router.get("/", getHandler);

// Export router agar dapat digunakan di file lain
module.exports = router;
