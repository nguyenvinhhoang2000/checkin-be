const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Revenua = require("../models/Revenua");

// @route POST api/revenua
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const revenuaList = await Revenua.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin loại thu thành công",
            data: {
                list: revenuaList,
                total: revenuaList.length,
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
            revenuaCode,
            description,
        } = req.body;

        if (revenuaCode) {
            const newRevenua = new Revenua({
                user: req.userId,
                name,
                revenuaCode,
                description,
            })

            await newRevenua.save()

            res.status(200).json({
                success: true,
                message: "Thêm loại thu thành công",
                data: newRevenua,
            })
        } else {
            const revenuaCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newRevenua = new Revenua({
                user: req.userId,
                name,
                revenuaCode: revenuaCodeGenerate,
                description,
            })

            await newRevenua.save()

            res.status(200).json({
                success: true,
                message: "Thêm loại thu thành công",
                data: newRevenua,
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
            revenuaCode,
            description,
        } = req.body;

        let revenua = Revenua.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!revenua) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy loại thu" });
        }

        if (revenuaCode) {
            const data = {
                name,
                revenuaCode,
                description,
            }

            await Revenua.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa loại thu thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        } else {
            const revenuaCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const data = {
                name,
                revenuaCode: revenuaCodeGenerate,
                description,
            }

            await Revenua.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa loại thu thành công",
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
        const revenuaDelete = await Revenua.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa loại thu thành công",
            data: revenuaDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
