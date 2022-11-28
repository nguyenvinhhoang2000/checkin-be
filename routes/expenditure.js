const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Expenditure = require("../models/Expenditure");

// @route POST api/expenditures
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const expenditureList = await Expenditure.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin loại chi thành công",
            data: {
                list: expenditureList,
                total: expenditureList.length,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route get api/expenditures
// @desc Profile
// @access Public
router.post("/", verifyToken, async (req, res) => {
    try {
        const { 
            name,
            expenditureCode,
            description,
        } = req.body;

        if (expenditureCode) {
            const newExpenditure = new Expenditure({
                user: req.userId,
                name,
                expenditureCode,
                description,
            })

            await newExpenditure.save()

            res.status(200).json({
                success: true,
                message: "Thêm loại chi thành công",
                data: newExpenditure,
            })
        } else {
            const expenditureCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newExpenditure = new Expenditure({
                user: req.userId,
                name,
                expenditureCode: expenditureCodeGenerate,
                description,
            })

            await newExpenditure.save()

            res.status(200).json({
                success: true,
                message: "Thêm loại chi thành công",
                data: newExpenditure,
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
            expenditureCode,
            description,
        } = req.body;

        let revenua = Expenditure.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!revenua) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy loại chi" });
        }

        if (expenditureCode) {
            const data = {
                name,
                expenditureCode,
                description,
            }

            await Expenditure.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa loại chi thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        } else {
            const expenditureCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const data = {
                name,
                expenditureCode: expenditureCodeGenerate,
                description,
            }

            await Expenditure.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa loại chi thành công",
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
        const revenuaDelete = await Expenditure.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa loại chi thành công",
            data: revenuaDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
