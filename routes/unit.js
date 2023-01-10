const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Unit = require("../models/Unit");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const { q, limit, page } = req.query;

        const parseLimit = parseInt(limit)
        const parsePage = parseInt(page);
        const skip = (parsePage - 1) * parseLimit;
        
        let units;
        let totalUnits;

        if (q) {
            units = await Unit.find({user: req.userId,  $text: {$search: q} })
            .skip(skip).limit(parseLimit)
            .sort({ createdAt: -1 });

            totalUnits = await Unit.find({user: req.userId,  $text: {$search: q} })
        } else {
            units = await Unit.find({user: req.userId})
            .skip(skip).limit(parseLimit)
            .sort({ createdAt: -1 });

            totalUnits = await Unit.find({user: req.userId})
        }


        res.status(200).json({
            success: true,
            message: "Lấy thông tin đơn vị thành công",
            data: {
                list: units,
                total: totalUnits.length,
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
            unitCode,
            description,
            unit,
        } = req.body;

        if (unitCode) {
            const Unit = new Unit({
                user: req.userId,
                name,
                unitCode,
                description,
                unit,
            })

            await Unit.save()

            res.status(200).json({
                success: true,
                message: "Thêm đơn vị thành công",
                data: Unit,
            })
        } else {
            const unitCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newUnit = new Unit({
                user: req.userId,
                name,
                unitCode: unitCodeGenerate,
                description,
                unit,
            })

            await newUnit.save()

            res.status(200).json({
                success: true,
                message: "Thêm đơn vị thành công",
                data: newUnit,
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

        let customerGroup = Unit.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!customerGroup) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhóm khách hàng" });
        }

        if (groupCode) {
            const data = {
                name,
                groupCode,
                description,
                defaultDiscount,
            }

            await Unit.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm khách hàng thành công",
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

            await Unit.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm khách hàng thành công",
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
        const customerDelete = await Unit.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa nhóm khách hàng thành công",
            data: customerDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
