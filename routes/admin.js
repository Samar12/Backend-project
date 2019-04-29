var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const adminModel = require("./../models/admin");
const authMiddleware = require("./../middlewares/admin_Authentication");

router.post("/register", async function(req, res, next) {
  await adminModel.create(req.body, function(err, admin) {
    if (err) return next(createError(400, err.message));
    res.send(admin);
  });
});

router.post("/login", async function(req, res, next) {
  const { name, password } = req.body;
  const Admin = await adminModel.findOne({ name });
  if (!Admin) return next(createError(401));

  const passwordMatch = await Admin.verifyPassword(password);
  if (!passwordMatch) return next(createError(401));
  const adminToken = Admin.generateToken();
  res.send({
    profile: Admin,
    adminToken
  });
});
router.use(authMiddleware);

router.get("/dashboard", function(req, res, next) {
  console.log("admin home page here ...");
});

module.exports = router;
