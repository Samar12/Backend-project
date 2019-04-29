const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  FirstName: {
    //index:{unique:true},
    type: String,
    required: true,
    minlength: 3
  },
  LastName: {  
    //index:{unique:true},
    type: String,
    required: true,
    minlength: 3
  },

  DateOfBirth: {
    type: Date,
    required: true
  },
  description: {
    //index:{unique:true},
    type: String,
    required: true,
    minlength: 3
  },
  deleted: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String,
    required: true,
    minlength: 3
  }
});

const AuthorModel = mongoose.model("Authors", AuthorSchema);
module.exports = AuthorModel;
