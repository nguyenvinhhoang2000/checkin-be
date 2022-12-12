const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Order = require("../models/Order");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        const currentDate = new Date()

        const orderList = await Order.find({
            user: req.userId, status: "FINISHED", createdAt: {
            $gte: fromDate ? new Date(fromDate) : new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-1`),
            $lt: toDate ? new Date(toDate) : currentDate,
        }}).populate({ path: 'customer'}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy danh sách doanh thu thành công",
            data: {
                list: orderList,
                total: orderList.length,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

module.exports = router;