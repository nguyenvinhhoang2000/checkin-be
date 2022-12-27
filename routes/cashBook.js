const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Receipts = require("../models/Receipts");
const Payments = require("../models/Payments");

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

        const receiptList = await Receipts.find({
            user: req.userId, status: "ACTIVE", createdAt: {
            $gte: fromDate ? new Date(fromDate) : new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-1`),
            $lt: toDate ? newToDate : currentDate,
        }}).populate({ path: 'revenua'}).sort({ createdAt: -1 });

        const paymentList = await Payments.find({
            user: req.userId, status: "ACTIVE", createdAt: {
            $gte: fromDate ? new Date(fromDate) : new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-1`),
            $lt: toDate ? newToDate : currentDate,
        }}).populate({ path: 'expenditure'}).sort({ createdAt: -1 });

        const cashBookList = [
            ...receiptList,
            ...paymentList
        ]

        cashBookList.sort((a,b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            message: "Lấy danh sách sổ quỹ thành công",
            data: {
                list: cashBookList,
                total: cashBookList.length,
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