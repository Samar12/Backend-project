const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    lowercase: true
  },
  IsDeleted: {
    type: Boolean,
    default: false,
    required: false
  },
  books: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        default: []
      }
    ]
  }
});

const CategoryModel = mongoose.model("Categories", categorySchema);
module.exports = CategoryModel;
