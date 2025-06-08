import jwt from "jsonwebtoken";

export const jwtAuthMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.Admintoken;
    console.log(token);
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("jwt", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.name, error.message);

    let message = "Invalid token";

    if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token signature";
    } else if (error.name === "NotBeforeError") {
      message = "Token is not active yet";
    }

    res.status(403).json({ status: false, message });
  }
};
