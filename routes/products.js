const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Products = require("../models/Products");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const products = await Products.find({ user: req.userId })
        .populate([{path: 'unit'}, {path: 'user'}, {path: 'productGroup'}])
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin sản phẩm thành công",
            data: {
                list: products,
                total: products.length,
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
            productCode,
            productGroup,
            status,
            description,
            isHidden,
            price,
            costPrice,
            inventoryNumber,
            mass,
            unit,
            avatar,
            cloudinary_id,
        } = req.body;

        if (productCode) {
            const product = new Products({
                user: req.userId,
                name,
                productCode,
                productGroup,
                status,
                description,
                isHidden,
                price,
                costPrice,
                inventoryNumber,
                mass,
                unit,
                avatar,
                cloudinary_id,
            })

            await product.save()

            res.status(200).json({
                success: true,
                message: "Thêm sản phẩm thành công",
                data: product,
            })
        } else {
            const productCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const product = new Products({
                user: req.userId,
                name,
                productCode: productCodeGenerate,
                productGroup,
                status,
                description,
                isHidden,
                price,
                costPrice,
                inventoryNumber,
                mass,
                unit,
                avatar,
                cloudinary_id,
            })

            await product.save()

            res.status(200).json({
                success: true,
                message: "Thêm sản phẩm thành công",
                data: product,
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

        let customerGroup = Products.findOne({
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

            await Products.findByIdAndUpdate(req.params.id, data);

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

            await Products.findByIdAndUpdate(req.params.id, data);

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
        const customerDelete = await Products.findOneAndDelete({
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
