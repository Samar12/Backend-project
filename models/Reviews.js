const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    // minlength: 3,
    // unique: true,
    lowercase: true
  },
  date:{
    type: Date,
     default: Date.now
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:'User',
  //   default: '',
  //   // required: true
  // },
  bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        default: ''
  },
});

const ReviewModel = mongoose.model("Reviews", ReviewSchema);
module.exports = ReviewModel;
