const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");
const Admin = require("../models/Admin");

// @route GET api/admin/member
// @desc Register User
// @access Public
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const userDetail = await User.findById(req.params.id);
        // Check for exitsting

        res.status(200).json({
            success: true,
            message: "Lấy thông tin thành viên thành công",
            payload: {
                _id: userDetail._id,
                name: userDetail.name,
                email: userDetail.email,
                phoneNumber: userDetail.phoneNumber,
                gender: userDetail.gender,
                note: userDetail.note,
                position: userDetail.position,
                status: userDetail.status,
                avatar: userDetail.avatar,
                adminId: userDetail.adminId,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route GET api/admin/member
// @desc Register User
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const { q, limit, page, status } = req.query;

        const parseLimit = parseInt(limit)
        const parsePage = parseInt(page);
        const skip = (parsePage - 1) * parseLimit;

        let userList
        let totalUser

        if (q) {
            userList = await User.find({ adminId: req.userId, status, $text: { $search: q }})
            .skip(skip).limit(parseLimit);

            totalUser = await User.find({ adminId: req.userId, status, $text: { $search: q }})
        } else {
            userList = await User.find({ adminId: req.userId, status })
            .skip(skip).limit(parseLimit);

            totalUser = await User.find({ adminId: req.userId, status })
        }

        // Check for exitsting

        const userListedited = userList.map((member) => {
            return {
                _id: member._id,
                name: member.name,
                email: member.email,
                phoneNumber: member.phoneNumber,
                gender: member.gender,
                note: member.note,
                position: member.position,
                status: member.status,
                avatar: member.avatar,
                adminId: member.adminId,
            }
        })

        res.status(200).json({
            success: true,
            message: "Lấy thông tin thành viên thành công",
            payload: {
                data: userListedited,
                total: totalUser.length,
            },
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route PUT api/admin/member
// @desc Register Admin
// @access Public
router.put("/:id", async (req, res) => {
    const { email, password, name, phoneNumber, gender, note, position } = req.body;
  
    try {
        let user = User.findById(req.params.id)

        if (!user) {
            res
            .status(400)
            .json({ success: false, message: "Không tìm thấy thành viên" });
        }
      //All good
      const hashedPassword = await argon2.hash(password);
      const data = {
        email: email || user.email,
        password: hashedPassword || user.password,
        name: name || user.name,
        phoneNumber: phoneNumber || user.phoneNumber,
        position: position || user.position,
        gender: gender || user.gender,
        note: note || user.note,
      };

      await User.findByIdAndUpdate(req.params.id, data);
  
      res.status(200).json({
        success: true,
        message: "Chỉnh sửa thành viên thành công",
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  });

// @route DELETE api/admin/member
// @desc Register User
// @access Public
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        // Check for exitsting user
        const newData = {
            status: "DELETED"
        }
        await User.findByIdAndUpdate(req.params.id, newData);

        res.status(200).json({
            success: true,
            message: "Xóa thành viên thành công",
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

// @route PUT api/admin/member
// @desc Register User
// @access Public
router.put("/:id/active", verifyToken, async (req, res) => {
    try {
        // Check for exitsting user
        const newData = {
            status: "ACTIVE"
        }
        await User.findByIdAndUpdate(req.params.id, newData);

        res.status(200).json({
            success: true,
            message: "Kích hoạt thành viên thành công",
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
        })
    }
})

module.exports = router;
