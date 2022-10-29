const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const TargetGroup = require("../models/TargetGroup");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const targetGroups = await TargetGroup.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin cửa hàng thành công",
            data: {
                list: targetGroups,
                total: targetGroups.length,
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
            name,
            groupCode,
            description,
            defaultDiscount,
        } = req.body;

        if (groupCode) {
            const newTargetGroup = new TargetGroup({
                user: req.userId,
                name,
                groupCode,
                description,
                defaultDiscount,
            })

            await newTargetGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm khách hàng thành công",
                data: newTargetGroup,
            })
        } else {
            const groupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newTargetGroup = new TargetGroup({
                user: req.userId,
                name,
                groupCode: groupCodeGenerate,
                description,
                defaultDiscount,
            })

            await newTargetGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm khách hàng thành công",
                data: newTargetGroup,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
