const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(' ')[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Không tìm thấy token" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: "Token không hợp lệ" });
  }
};

module.exports = verifyToken;
