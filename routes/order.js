const e = require("cors");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Order = require("../models/Order");
const Products = require("../models/Products");

// @route POST api/expenditures
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const { q, limit, page } = req.query;

        const parseLimit = parseInt(limit)
        const parsePage = parseInt(page);
        const skip = (parsePage - 1) * parseLimit;

        let orders;
        let totalOrders;

        if (q) {
            orders = await Order.find({user: req.userId,  $text: {$search: q} })
            .skip(skip).limit(parseLimit)
            .populate({ path: 'customer' })
            .sort({ createdAt: -1 });

            totalOrders = await Order.find({user: req.userId,  $text: {$search: q} })
        } else {
            orders = await Order.find({user: req.userId})
            .skip(skip).limit(parseLimit)
            .populate({ path: 'customer' })
            .sort({ createdAt: -1 });

            totalOrders = await Order.find({user: req.userId})
        }

        res.status(200).json({
            success: true,
            message: "Lấy thông tin đơn hàng thành công",
            data: {
                list: orders,
                total: totalOrders.length,
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
            customer,
            products,
            shippingUnit,
            COD,
            weightPackage,
            note,
            recieverName,
            phoneNumberOfReciever,
            addressOfReciever,
            province,
            district,
            ward,
            quantitySum,
            totalProductCost,
            discount,
            serviceFee,
            totalOrderCost,
            status,
            pay,
            receipts,
        } = req.body;

        products.forEach(async (element) => {
            const data = {
                inventoryNumber: element.inventoryNumber - element.quantity,
            }

            await Products.findByIdAndUpdate(element._id, data)
        });

        const orderCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

        const newOrder = new Order({
            user: req.userId,
            orderCode: orderCodeGenerate,
            customer,
            products,
            shippingUnit,
            COD,
            weightPackage,
            note,
            recieverName,
            phoneNumberOfReciever,
            addressOfReciever,
            province,
            district,
            ward,
            quantitySum,
            totalProductCost,
            discount,
            serviceFee,
            totalOrderCost,
            status,
            pay,
            receipts,
        })

        await newOrder.save()

        const orderSaved = await Order.find({ user: req.userId, orderCode: orderCodeGenerate })
        .populate({ path: 'customer' })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Thêm đơn hàng thành công",
            data: orderSaved,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route get api/expenditures
// @desc Profile
// @access Public
router.put("/status/:id", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;

        const data = {
            status,
        }

        await Order.findByIdAndUpdate(req.params.id, data)

        const orderSaved = await Order.findById(req.params.id)
        .populate({ path: 'customer' })

        res.status(200).json({
            success: true,
            message: "Chuyển trạng thái đơn hàng thành công",
            data: orderSaved,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route get api/expenditures
// @desc Profile
// @access Public
router.put("/pay/:id", verifyToken, async (req, res) => {
    try {
        const { pay, receipts } = req.body;

        const data = {
            pay,
            receipts,
        }

        await Order.findByIdAndUpdate(req.params.id, data)

        const orderSaved = await Order.findById(req.params.id)
        .populate({ path: 'customer' })

        res.status(200).json({
            success: true,
            message: "Thanh toán đơn hàng thành công",
            data: orderSaved,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

// @route get api/expenditures
// @desc Profile
// @access Public
router.put("/cancel/:id", verifyToken, async (req, res) => {
    try {
        const { 
            reason,
        } = req.body; 

        const getOrder = await Order.findById(req.params.id)

        getOrder.products.forEach(async (element) => {
            await Products.findByIdAndUpdate(element._id, { $inc: { inventoryNumber: element.quantity } })
        });
        
        const data = {
            status: 'CANCELLED',
            reason,
        }

        await Order.findByIdAndUpdate(req.params.id, data);

        const orderSaved = await Order.findById(req.params.id)
        .populate({ path: 'customer' })

        res.status(200).json({
            data: orderSaved,
            success: true,
            message: "Hủy đơn hàng thành công",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;
