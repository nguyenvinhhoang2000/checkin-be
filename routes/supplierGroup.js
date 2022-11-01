const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const SupplierGroup = require("../models/SupplierGroup");

// @route POST api/supplier-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const supplierGroup = await SupplierGroup.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin nhóm nhà cung cấp thành công",
            data: {
                list: supplierGroup,
                total: supplierGroup.length,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route get api/supplier-group
// @desc Profile
// @access Public
router.post("/", verifyToken, async (req, res) => {
    try {
        const { 
            name,
            groupCode,
            description,
            defaultDiscount,
        } = req.body;

        if (groupCode) {
            const newTargetGroup = new SupplierGroup({
                user: req.userId,
                name,
                groupCode,
                description,
                defaultDiscount,
            })

            await newTargetGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm nhà cung cấp thành công",
                data: newTargetGroup,
            })
        } else {
            const groupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newTargetGroup = new SupplierGroup({
                user: req.userId,
                name,
                groupCode: groupCodeGenerate,
                description,
                defaultDiscount,
            })

            await newTargetGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm nhà cung cấp thành công",
                data: newTargetGroup,
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
            name,
            groupCode,
            description,
            defaultDiscount,
        } = req.body;

        let supplierGroup = SupplierGroup.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!supplierGroup) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhóm nhà cung cấp" });
        }

        if (groupCode) {
            const data = {
                name,
                groupCode,
                description,
                defaultDiscount,
            }

            await SupplierGroup.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm nhà cung cấp thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        } else {
            const groupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const data = {
                name,
                groupCode: groupCodeGenerate,
                description,
                defaultDiscount,
            }

            await CustomerGroup.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm nhà cung cấp thành công",
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
        const supplierDelete = await SupplierGroup.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa nhóm khách hàng thành công",
            data: supplierDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});
module.exports = router;
