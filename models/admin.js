const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const util = require("util");

const verifyToken = util.promisify(jwt.verify);
const saltRounds = 10;
const secretKey = "secretkey";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"]
    },
    password: {
      type: String,
      required: [true, "password required"],
      hidden: true
    }
  },
  {
    toJSON: {
      transform: true
    }
  }
);

const hashPassword = password => {
  return bcrypt.hash(password, saltRounds);
};
adminSchema.pre("save", async function() {
  const Admin = this;
  if (Admin.isNew) {
    Admin.password = await hashPassword(Admin.password);
  }
});
adminSchema.pre("findOneAndUpdate", async function() {
  const currentAdmin = this;
  const updates = currentAdmin._update;
  const { password } = updates;
  if (password) {
    currentAdmin._update.password = await hashPassword(password);
  }
});
adminSchema.method("verifyPassword", function(password) {
  const Admin = this;
  return bcrypt.compare(password, Admin.password);
});
adminSchema.method("generateToken", function() {
  const Admin = this;
  const token = jwt.sign(Admin.id, secretKey);
  return token;
});
adminSchema.static("verifyToken", async function(token) {
  const decoded = await verifyToken(token, secretKey);
  return this.findById(decoded);
});

adminSchema.options.toJSON.transform = (doc, ret, options) => {
  delete ret.password;
  return ret;
};
const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;
