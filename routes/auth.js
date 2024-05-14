const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");
// const UserOTPVerification = require("../models/UserOTPVerification");

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: 'nguyenvinhhoang2000@outlook.com',
    pass: 'Vn0914451879@',
  }
})

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log(success);
  }
})


// get otp verify email
router.post("/get-otp", async (req, res) => {
  const { email } = req.body;
  try {
    //Check for exitsting user
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã được đăng ký" });
    }

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`

    // mail options
    const mailOptions = {
      from: 'nguyenvinhhoang2000@outlook.com',
      to: email,
      subject: "Verify your Email",
      html: `<p>Mã xác nhận của bạn là <b>${otp}</b>.</p>`
    }

    await UserOTPVerification.deleteMany({ email });

    // hash the otp
    const saltRounds = 10

    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions)

    res.status(200).json({
      success: true,
      message: "Mã xác thực đã được gửi về email của bạn",
      data: {
        email,
      }
    })
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    })
  }
})

// Verify otp email
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json("Lỗi")
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        email,
      })

      if (UserOTPVerificationRecords.length <= 0) {
        res.status(400).json("Email không tồn tại hoặc đã được xác thực. Vui lòng đăng ký hoặc đăng nhập.")
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ email });

          res.status(200).json("Mã xác thực đã hết hạn. Vui lòng gửi lại.")
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            res.status(500).json("Mã xác thực không đúng. Vui lòng kiểm tra lại.")
          } else {
            await UserOTPVerification.deleteMany({ email });

            res.status(200).json({
              success: true,
              message: "Xác thực thành công",
            })
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route POST api/auth/login
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
    const user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });

    //Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });

    //All good
    //Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      message: "Đăng nhập thành công",
      token: accessToken
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route POST api/auth/changeimg
// @desc Login User
// @access Public
router.put(
  "/changeimg",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      let user = await User.findById(req.userId);
      await cloudinary.uploader.destroy(user.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "UserImg",
      });

      const data = {
        avatar: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };

      user = await User.findByIdAndUpdate(req.userId, data, { new: true });
      res.json({
        success: true,
        message: "Thay đổi ảnh thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

// @route POST api/auth/changepassword
// @desc Change Password
// @access Public
router.put(
  "/changepassword",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      let user = await User.findById(req.userId);

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res.status(400).json({
          success: false,
          message: "Sai mật khẩu",
        });

      const hashedPassword = await argon2.hash(newPassword);

      const data = {
        password: hashedPassword,
      };

      user = await User.findByIdAndUpdate(req.userId, data, { new: true });
      res.json({
        success: true,
        message: "Thay đổi mật khẩu thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

module.exports = router;
