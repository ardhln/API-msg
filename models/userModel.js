const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isFotoProfileSet: { // Mengubah nama field
    type: Boolean,
    default: false,
  },
  fotoProfile: { // Mengubah nama field
    type: String,
    default: "", // Ubah sesuai kebutuhan
  },
});

module.exports = mongoose.model("Users", userSchema);
