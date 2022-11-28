const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Revenua = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  revenuaCode: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("revenuas", Revenua);
