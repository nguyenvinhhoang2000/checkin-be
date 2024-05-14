const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const verifyToken = require("../middleware/auth");

const Admin = require("../models/Admin");
const User = require("../models/User");

// @route POST api/admin/auth/register
// @desc Register Admin
// @access Public
router.post("/register", async (req, res) => {
  const { email, password, role, fullName, phoneNumber } = req.body;

  try {
    //All good
    const hashedPassword = await argon2.hash(password);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role,
      fullName,
      phoneNumber,
    });
    await newAdmin.save()

    res.status(200).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route POST api/admin/auth/login
// @desc Login User
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  //Simple validation
  if (!email || !password)
    return res
  .status(400)
  .json({ success: false, message: "Email và mật khẩu không được để trống" });
  
  try {
    //Check for existing user
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });

    //Username found
    const passwordValid = await argon2.verify(admin.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });

    //All good
    //Return token
    const accessToken = jwt.sign(
      { adminId: Admin._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      message: "Đăng nhập thành công",
      payload: accessToken
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});


// @route POST api/admin/auth/create-member
// @desc Register Admin
// @access Public
router.post("/create-member", verifyToken, async (req, res) => {
  const { email, password, name, phoneNumber, gender, note, position } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        success: false,
        message: "Email đã được đăng ký",
      });

    //All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      position,
      gender,
      note,
      adminId: req.userId,
    });
    await newUser.save()

    res.status(200).json({
      success: true,
      message: "Tạo tài khoản thành công",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

module.exports = router;
