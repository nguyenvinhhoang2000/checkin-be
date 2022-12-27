const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cost = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("cost", Cost);
