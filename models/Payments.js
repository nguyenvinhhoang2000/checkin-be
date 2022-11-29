const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Payments = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  expenditure: {
    type: Schema.Types.ObjectId,
    ref: "expenditures",
  },
  targetGroup: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  paymentCode: {
    type: String,
    unique: true,
  },
  note: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("payments", Payments);
