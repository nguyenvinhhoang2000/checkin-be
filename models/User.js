const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "admins",
  },
  avatar: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({ name: 'text' })

module.exports = mongoose.model("users", UserSchema);
