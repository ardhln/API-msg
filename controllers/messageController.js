const Messages = require("../models/messageModel");
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder penyimpanan file
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nama file yang disimpan dengan ekstensi
  },
});

// Inisialisasi multer dengan konfigurasi penyimpanan
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      callback(null, true);
    } else {
      console.log('Hanya ekstensi jpg, jpeg, atau png yang diperbolehkan!!!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // Batas ukuran file (2MB)
  },
});

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const file = req.file; // Mengambil file yang diunggah dengan multer

    // Membuat objek pesan
    const newMessage = {
      text: message,
      users: [from, to],
      sender: from,
    };

    // Jika ada file yang diunggah, tambahkan ke objek pesan
    if (file) {
      newMessage.file = {
        filename: file.filename,
        path: file.path,
      };
    }

    const data = await Messages.create(newMessage);

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
