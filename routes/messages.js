const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer"); // Import multer

// Konfigurasi multer
const storage = multer.memoryStorage(); // Simpan file dalam memory
const upload = multer({ storage: storage });

// Rute untuk menambahkan pesan dengan menggunakan multer
router.post("/addmsg", upload.single("file"), addMessage);

// Rute untuk mendapatkan pesan
router.get("/getmsg", getMessages);

module.exports = router;
