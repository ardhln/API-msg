const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../profil"); // Direktori penyimpanan foto profil

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "fotoProfile", // Mengubah nama field dari "avatarImage" menjadi "fotoProfile"
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setFotoProfil = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const imageFile = req.file; // Mengambil file gambar yang diunggah dengan multer

    if (!imageFile) {
      return res.status(400).json({ msg: "File gambar diperlukan." });
    }

    // Menyimpan informasi foto profil ke dalam database
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isFotoProfilSet: true,
        fotoProfile: imageFile.filename, // Menyimpan nama file gambar
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    return res.json({
      isSet: user.isFotoProfilSet,
      image: user.fotoProfile,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.status(400).json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).json({ msg: "Logout successful" });
  } catch (ex) {
    next(ex);
  }
};
