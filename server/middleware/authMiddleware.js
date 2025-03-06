const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Uncomment this line if the token needs to be decrypted
    // const decryptedToken = decrypt(token);
    const decryptedToken = token; // Assuming the token is already in its final form

    console.log("🔓 Decrypted Access Token:", decryptedToken);
    //console.log("🔑 JWT Secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(decryptedToken, process.env.SECRET_KEY);
    //console.log("Decoded:", decoded);
    req.user = decoded;
    //console.log("req.user:", req.user);
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(493).json({ msg: "Token expired or invalid" });
  }
  
};


module.exports = {authMiddleware};