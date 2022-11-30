const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receipts = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  revenua: {
    type: Schema.Types.ObjectId,
    ref: "revenuas",
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
  status: {
    type: String,
    default: 'ACTIVE',
  },
  price: {
    type: String,
    required: true,
  },
  receiptCode: {
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

module.exports = mongoose.model("receipts", Receipts);
