const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const Organization = require("../models/Organization");

// @route PUT api/admin/organizations
router.post("/", verifyToken, async (req, res) => {
  const {
    address,
    businessName,
    ips,
    numberOfWorkingDays,
    workTimeEnd,
    workTimeStart
   } = req.body;
  
  try {
    const newOrganization = new Organization({
      adminId: req.userId,
      address,
      businessName,
      ips,
      numberOfWorkingDays,
      workTimeEnd,
      workTimeStart
    })

    await newOrganization.save();

    res.json({
      success: true,
      message: "Cập nhật thông tin doanh nghiệp thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route GET api/admin/organizations
router.get("/", verifyToken, async (req, res) => {
  try {
    const organizations = await Organization.findOne({ adminId: req.userId });

    res.json({
      success: true,
      message: "Lấy thông tin doanh nghiệp thành công",
      payload: organizations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});
// @route PUT api/admin/organizations
router.post("/", verifyToken, async (req, res) => {
  const {
    address,
    businessName,
    ips,
    numberOfWorkingDays,
    workTimeEnd,
    workTimeStart
   } = req.body;
  
  try {
    const newOrganization = new Organization({
      adminId: req.userId,
      address,
      businessName,
      ips,
      numberOfWorkingDays,
      workTimeEnd,
      workTimeStart
    })

    await newOrganization.save();

    res.json({
      success: true,
      message: "Cập nhật thông tin doanh nghiệp thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

module.exports = router;
