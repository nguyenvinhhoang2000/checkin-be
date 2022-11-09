const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Customer = require("../models/Customer");

// @route POST api/target-group
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const customer = await Customer.find({ user: req.userId }).populate({ path: 'customerGroup'}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy danh sách khách hàng thành công",
            data: {
                list: customer,
                total: customer.length,
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
            phoneNumber,
            name,
            customerCode,
            birthday,
            status,
            customerGroup,
            sex,
            address,
            province,
            district,
            ward,
            link,
            note,
            avatar,
            cloudinary_id,
        } = req.body;

        if (customerCode) {
            const newCustomer = new Customer({
                user: req.userId,
                phoneNumber,
                name,
                customerCode,
                birthday,
                status,
                customerGroup,
                sex,
                address,
                province,
                district,
                ward,
                link,
                note,
                avatar,
                cloudinary_id,
            })

            await newCustomer.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm khách hàng thành công",
                data: newCustomer,
            })
        } else {
            const groupCodeGenerate = `${Math.floor(10000 + Math.random() * 90000)}`

            const newCustomer = new Customer({
                user: req.userId,
                phoneNumber,
                name,
                customerCode: groupCodeGenerate,
                birthday,
                status,
                customerGroup,
                sex,
                address,
                province,
                district,
                ward,
                link,
                note,
                avatar,
                cloudinary_id,
            })

            await newCustomer.save()

            res.status(200).json({
                success: true,
                message: "Thêm nhóm khách hàng thành công",
                data: newCustomer,
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

        let customerGroup = Customer.findOne({
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

            await Customer.findByIdAndUpdate(req.params.id, data);

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

            await Customer.findByIdAndUpdate(req.params.id, data);

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
        const customerDelete = await Customer.findOneAndDelete({
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
