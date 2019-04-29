const createError = require("http-errors");
const adminModel = require("./../models/admin");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return next(createError(401));
    const [, token] = req.headers.authorization.split(" ");
    const admin = await adminModel.verifyToken(token);
    if (!admin) return next(createError(401));
    req.admin = admin;
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};
