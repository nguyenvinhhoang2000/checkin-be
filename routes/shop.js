const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Shop = require("../models/Shop");

// @route POST api/shop
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const shop = await Shop.findOne({ userId: req.userId });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin cửa hàng thành công",
            data: shop,
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route get api/shop
// @desc Profile
// @access Public
router.post("/", verifyToken, async (req, res) => {
    try {
        const { 
            storeName,
            phoneNumber,
            email,
            address,
            province,
            district,
            ward,
            business,
        } = req.body;

        const newShop = new Shop({
            userId: req.userId,
            storeName,
            phoneNumber,
            email,
            address,
            province,
            district,
            ward,
            business,
        })

        await newShop.save()

        res.status(200).json({
            success: true,
            message: "Cập nhập thông tin cửa hàng thành công",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
