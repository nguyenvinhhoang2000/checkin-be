const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const ProductGroup = require("../models/ProductGroup");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const productGourp = await ProductGroup.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin nhóm sản phẩm thành công",
            data: {
                list: productGourp,
                total: productGourp.length,
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
            productGroupCode,
            description,
        } = req.body;

        if (productGroupCode) {
            const newProductGroup = new ProductGroup({
                user: req.userId,
                name,
                productGroupCode,
                description,
            })

            await newProductGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm sản phẩm thành công",
                data: newProductGroup,
            })
        } else {
            const productGroupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newProductGroup = new ProductGroup({
                user: req.userId,
                name,
                productGroupCode: productGroupCodeGenerate,
                description,
            })

            await newProductGroup.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm sản phẩm thành công",
                data: newProductGroup,
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
            productGroupCode,
            description,
        } = req.body;

        let productGroup = ProductGroup.findOne({
            user: req.userId,
            _id: req.params.id,
        })

        if (!productGroup) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhóm sản phẩm" });
        }

        if (groupCode) {
            const data = {
                name,
                productGroupCode,
                description,
            }

            await ProductGroup.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm sản phẩm thành công",
                data: {
                    _id: req.params.id,
                    ...data,
                },
            })
        } else {
            const groupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const data = {
                name,
                productGroupCode: groupCodeGenerate,
                description,
            }

            await ProductGroup.findByIdAndUpdate(req.params.id, data);

            res.status(200).json({
                success: true,
                message: "Sửa nhóm sản phẩm thành công",
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
        const productDelete = await ProductGroup.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })

        res.status(200).json({
            success: true,
            message: "Xóa nhóm sản phẩm thành công",
            data: productDelete,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
