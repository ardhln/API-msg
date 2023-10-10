const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/addmsg", upload.single("file"), addMessage);
router.get("/getmsg", getMessages);

module.exports = router;
