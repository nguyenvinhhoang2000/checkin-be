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
  productCode: {
    type: String,
    unique: true,
  },
  productGroup: {
    type: Schema.Types.ObjectId,
    ref: "product_group",
  },
  status: {
    type: String,
    default: 'SELLING',
  },
  description: {
    type: String,
    default: '',
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  price: {
    type: String,
    required: true,
  },
  costPrice: {
    type: String,
    required: true,
  },
  inventoryNumber: {
    type: Number,
    required: true,
  },
  mass: {
    type: Number,
    required: true,
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: "unit",
  },
  avatar: {
    type: String,
    default: '',
  },
  cloudinary_id: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProductGroup.index({ name: 'text', productCode: 'text'})

module.exports = mongoose.model("products", ProductGroup);
