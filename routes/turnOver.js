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

        const newToDate = new Date(toDate);
        const currentDate = new Date()

        if (newToDate.getDate() !== currentDate.getDate()) {
            newToDate.setHours(23);
            newToDate.setMinutes(59);
            newToDate.setSeconds(59);
        } else {
            newToDate.setHours(currentDate.getHours());
            newToDate.setMinutes(currentDate.getMinutes());
            newToDate.setSeconds(currentDate.getSeconds());
        }

        const orderList = await Order.find({
            user: req.userId, status: "FINISHED", createdAt: {
            $gte: fromDate ? new Date(fromDate) : new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-1`),
            $lt: toDate ? newToDate : currentDate,
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