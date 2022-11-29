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
            paymentCode,
            note,
        } = req.body;

        if (paymentCode) {
            const newPayment = new Payments({
                user: req.userId,
                revenua,
                targetGroup,
                target,
                paymentMethod,
                price,
                paymentCode,
                note,
            })

            await newPayment.save()

            res.status(200).json({
                success: true,
                message: "Thêm phiếu chi thành công",
                data: newPayment,
            })
        } else {
            const paymentCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newPayment = new Payments({
                user: req.userId,
                revenua,
                targetGroup,
                target,
                paymentMethod,
                price,
                paymentCode: paymentCodeGenerate,
                note,
            })

            await newPayment.save()

            res.status(200).json({
                success: true,
                message: "Thêm phiếu chi thành công",
                data: newPayment,
            })
        }
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
            paymentCode,
            note,
        } = req.body;

        let payment = Payments.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!payment) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy phiếu chi" });
        }

        if (paymentCode) {
            const data = {
                revenua,
                targetGroup,
                target,
                paymentMethod,
                price,
                paymentCode,
                note,
            }

            await Payments.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa phiếu chi thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        } else {
            const paymentCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const data = {
                revenua,
                targetGroup,
                target,
                paymentMethod,
                price,
                paymentCode: paymentCodeGenerate,
                note,
            }

            await Payments.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa phiếu chi thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        }
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
        const receiptsDelete = await Payments.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa phiếu chi thành công",
            data: receiptsDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
