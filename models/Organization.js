const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfWorkingDays: {
    type: Number,
    required: true,
  },
  workTimeEnd: {
    type: String,
    required: true
  },
  workTimeStart: {
    type: String,
    required: true
  },
  ips: {
    type: String,
    default: "",
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "admins",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("organizations", OrganizationSchema);
