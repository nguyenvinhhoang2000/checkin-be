const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Products = require("../models/Products");
const ProductGroup = require("../models/ProductGroup");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/all", verifyToken, async (req, res) => {
    try {
        const products = await Products.find({ user: req.userId, status: 'SELLING', isHidden: false })
        .populate([{path: 'unit'}, {path: 'productGroup'}])
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin sản phẩm thành công",
            data: products,
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const { q, limit, page } = req.query;

        const parseLimit = parseInt(limit)
        const parsePage = parseInt(page);
        const skip = (parsePage - 1) * parseLimit;
        
        let products;
        let totalProducts;

        if (q) {
            products = await Products.find({user: req.userId,  $text: {$search: q} })
            .skip(skip).limit(parseLimit)
            .populate([{path: 'unit'}, {path: 'productGroup'}])
            .sort({ createdAt: -1 });

            totalProducts = await Products.find({user: req.userId,  $text: {$search: q} })
        } else {
            products = await Products.find({user: req.userId})
            .skip(skip).limit(parseLimit)
            .populate([{path: 'unit'}, {path: 'productGroup'}])
            .sort({ createdAt: -1 });

            totalProducts = await Products.find({user: req.userId})
        }


        res.status(200).json({
            success: true,
            message: "Lấy thông tin sản phẩm thành công",
            data: {
                list: products,
                total: totalProducts.length,
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

        const getProductGroup = await ProductGroup.findById(productGroup)

        const data = {
            total: Number(getProductGroup.total) + 1,
        }

        await ProductGroup.findByIdAndUpdate(productGroup, data)

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
            const data = {
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
                productCode: groupCodeGenerate,
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
        const getProduct = await Products.findById(req.params.id)
        const getProductGroup = await ProductGroup.findById(getProduct.productGroup)

        if (getProductGroup) {
            const data = {
                total: Number(getProductGroup.total) - 1,
            }

            await ProductGroup.findByIdAndUpdate(getProduct.productGroup, data)
        }

        const customerDelete = await Products.findOneAndDelete({
            user: req.userId,
            _id: req.params.id,
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
