const {
  login,
  register,
  getAllUsers,
  setFotoProfile,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();

const { setFotoProfil } = require("../controllers/userController");
const multer = require("multer");

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setfotoprofil/:id", upload.single("image"), setFotoProfil);
router.get("/logout/:id", logOut);

module.exports = router;
