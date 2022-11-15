const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

router.post("/", verifyToken, upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "OM-media",
        })

        res.status(200).json({
            success: true,
            message: "Tải lên hình ảnh thành công",
            data: {
                avatar: result.secure_url,
                cloudinary_id: result.public_id,
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có gì đó sai sai!" });
    }
});

module.exports = router;