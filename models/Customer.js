const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customer = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  customerCode: {
    type: String,
    unique: true,
  },
  birthday: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  customerGroup: {
    type: Schema.Types.ObjectId,
    ref: "customer_group",
  },
  sex: {
    type: String,
    default: 'MALE',
  },
  address: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  cloudinary_id: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("customer", Customer);
