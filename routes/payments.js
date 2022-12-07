const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Payments = require("../models/Payments");

// @route POST api/payment
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const paymentList = await Payments.find({ user: req.userId })
        .populate({ path: 'expenditure'})
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin phiếu chi thành công",
            data: {
                list: paymentList,
                total: paymentList.length,
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
            expenditure,
            targetGroup,
            target,
            paymentMethod,
            price,
            note,
        } = req.body;

        const paymentCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

        const newPayment = new Payments({
            user: req.userId,
            expenditure,
            targetGroup,
            target,
            paymentMethod,
            price,
            paymentCode: paymentCodeGenerate,
            note,
        })

        await newPayment.save()

        const paymentSaved = await Payments.findOne({ paymentCode: paymentCodeGenerate }).populate({ path: 'expenditure'})

        res.status(200).json({
            success: true,
            message: "Thêm phiếu chi thành công",
            data: paymentSaved,
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
        let payment = Payments.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!payment) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy phiếu chi" });
        }

        const data = {
            // note,
            status: "CANCEL"
        }

        await Payments.findByIdAndUpdate(req.params.id, data);

        res.status(200).json({
            success: true,
            message: "Hủy phiếu chi thành công",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
