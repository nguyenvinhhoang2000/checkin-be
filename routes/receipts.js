const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Receipts = require("../models/Receipts");

// @route POST api/receipts
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const receiptsList = await Receipts.find({ user: req.userId })
        .populate({ path: 'revenua'})
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin phiếu thu thành công",
            data: {
                list: receiptsList,
                total: receiptsList.length,
            },
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
            revenua,
            targetGroup,
            target,
            paymentMethod,
            price,
            note,
        } = req.body;

        const receiptCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

        const newReceipts = new Receipts({
            user: req.userId,
            revenua,
            targetGroup,
            target,
            paymentMethod,
            price,
            receiptCode: receiptCodeGenerate,
            note,
        })

        await newReceipts.save()

        const receiptSaved = await Receipts.findOne({ receiptCode: receiptCodeGenerate }).populate({ path: 'revenua'})

        res.status(200).json({
            success: true,
            message: "Thêm phiếu thu thành công",
            data: receiptSaved,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route update api/customer-group
// @desc customer-group
// @access Public
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { 
            revenua,
            targetGroup,
            target,
            paymentMethod,
            price,
            receiptCode,
            note,
        } = req.body;

        let receipts = Receipts.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!receipts) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy phiếu thu" });
        }

        const data = {
            revenua,
            targetGroup,
            target,
            paymentMethod,
            price,
            note,
        }

        await Receipts.findByIdAndUpdate(req.params.id, data);

        const receiptSaved = await Receipts.findOne({ _id: req.params.id  }).populate({ path: 'revenua'})

        res.status(200).json({
            success: true,
            message: "Sửa phiếu thu thành công",
            data: receiptSaved,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route delete api/customer-group
// @desc customer-group
// @access Public
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const receiptsDelete = await Receipts.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa phiếu thu thành công",
            data: receiptsDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
