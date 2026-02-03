const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

module.exports = (req, res, next) => {
  if (req.headers.authorization !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
