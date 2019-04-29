const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const util = require("util");
const jwtSignPromise = util.promisify(jwt.sign);
const jwtVerifyPromise = util.promisify(jwt.verify);
const bookModel = require("./Book");

const jwtKey = process.env.JWT_SECRET || "secretKey";

const saltRounds = 5;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      match: /^[a-zA-Z ]+[a-zA-Z]$/
    },
    email: {
      type: String,
      validate: validator.isEmail,
      unique: [true, "Duplicated"],
      required: true
    },
    password: {
      type: String,
      required: true,
      hidden: true
    },
    photo: {
      type: String,
      default: "N/A"
    },
    books: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Books" }, // Using Population
        rating: { type: String, default: "0" },
        status: { type: String, lowercase: true, enum: ["want to read", "read", "currently reading"] }
      }
    ]
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
userSchema.pre("save", async function() {
  const currentUser = this;
  if (currentUser.isNew) {
    currentUser.password = await hashPassword(currentUser.password);
  }
});
userSchema.pre("findOneAndUpdate", async function() {
  const currentUser = this;
  const updated = currentUser._update;
  const { password } = updated;
  if (password) {
    currentUser._update.password = await hashPassword(password);
  }
});
userSchema.method("verifyPassword", function(password) {
  const currentUser = this;
  return bcrypt.compare(password, currentUser.password);
});
userSchema.method("generateToken", function() {
  const currentUser = this;
  const token = jwt.sign({ _id: currentUser._id }, jwtKey, { expiresIn: "4d" });
  return token;
});
userSchema.static("verifyToken", async function(token) {
  const decoded = await jwtVerifyPromise(token, jwtKey);
  return this.findById(decoded._id);
});

userSchema.options.toJSON.transform = (doc, ret, options) => {
  delete ret.password;
  return ret;
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
