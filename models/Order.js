const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  orderCode: {
    type: String,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "customer",
  },
  products: {
    type: Array,
    required: true,
  },
  receipts: {
    type: Array,
    default: [],
  },
  shippingUnit: {
    type: String,
    default: '',
  },
  COD: {
    type: Number,
    default: 0,
  },
  weightPackage: {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
    default: '',
  },
  recieverName: {
    type: String,
    default: '',
  },
  phoneNumberOfReciever: {
    type: String,
    default: '',
  },
  addressOfReciever: {
    type: String,
    default: '',
  },
  province: {
    type: String,
    default: '',
  },
  district: {
    type: String,
    default: '',
  },
  ward: {
    type: String,
    default: '',
  },
  quantitySum: {
    type: Number,
    default: 0,
  },
  totalProductCost: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  serviceFee: {
    type: Number,
    default: 0,
  },
  totalOrderCost: {
    type: Number,
    default: 0,
  },
  pay: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'CONFIRMATION',
  },
  reason: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Order.index({ orderCode: 'text' })

module.exports = mongoose.model("order", Order);
