const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: false,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Menambahkan properti untuk menyimpan file (contoh: image)
    file: {
      filename: String,
      path: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
