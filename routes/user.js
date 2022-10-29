const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const User = require("../models/User");

// @route POST api/user/me
// @desc Register User
// @access Public
router.get("/me", verifyToken, async (req, res) => {
    try {
        //Check for exitsting user
        const user = await User.findOne({ _id: req.userId });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin tài khoản thành công",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                avatar: user.avatar,
                cloudinary_id: user.cloudinary_id,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route get api/user/me/avatar
// @desc Profile
// @access Public
router.post("/me/avatar", verifyToken, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })

        if (user.avatar !== '' || user.cloudinary_id !== '') {
            await cloudinary.uploader.destroy(user.cloudinary_id);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "OM-UserImg",
        })

        const updateData = {
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id,
        };

        await User.findByIdAndUpdate(req.userId, updateData);

        res.status(200).json({
            success: true,
            message: "Tải lên hình ảnh thành công",
            data: updateData,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route get api/media/user
// @desc Profile
// @access Public
router.post("/me/change-password", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne(req.userId)

        const updateData = {
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id,
        };

        await User.findByIdAndUpdate(req.userId, updateData);

        res.status(200).json({
            success: true,
            message: "Tải lên hình ảnh thành công",
            data: updateData,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
