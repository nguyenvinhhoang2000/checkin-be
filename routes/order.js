const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Order = require("../models/Order");

// @route POST api/expenditures
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const OrderList = await Order.find({ user: req.userId })
        .populate({ path: 'customer' })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin đơn hàng thành công",
            data: {
                list: OrderList,
                total: OrderList.length,
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
            disscount,
            serviceFee,
            totalOrderCost,
            status,
        } = req.body;

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
            disscount,
            serviceFee,
            totalOrderCost,
            status,
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

module.exports = router;
