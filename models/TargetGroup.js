const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TargetGroup = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  groupCode: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  },
  defaultDiscount: {
    type: Number,
    default: 0,
  },
  totalUser: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("target_group", TargetGroup);
