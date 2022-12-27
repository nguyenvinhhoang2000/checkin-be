const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Cost = require("../models/Cost");

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

        const costs = await Cost.find({ user: req.userId, createdAt: {
            $gte: fromDate ? new Date(fromDate) : new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-1`),
            $lt: toDate ? newToDate : currentDate,
        }});

        res.status(200).json({
            success: true,
            message: "Lấy danh sách chi phí thành công",
            data: costs,
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route get api/target-group
// @desc Profile
// @access Public
router.post("/", verifyToken, async (req, res) => {
    try {
        const { 
            name,
            price,
        } = req.body;

        const newCost = new Cost({
            user: req.userId,
            name,
            price,
        })

        await newCost.save()

        res.status(200).json({
            success: true,
            message: "Thêm doanh thu thành công",
            data: newCost,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
