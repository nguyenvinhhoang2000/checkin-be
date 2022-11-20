const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductGroup = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  productGroupCode: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("product_group", ProductGroup);
