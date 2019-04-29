const mongoose = require('mongoose');
const integerValidate = require('mongoose-integer');
const CategoryModel = require('./Category')

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        unique:true,
        lowercase:true
    },
    categoryID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Categories',
    },
    authorID:{
        type: String,
        // integer: true
    },
    photo:{
        type:String,
    },
    description:{
        type:String,
        required:true,
        default:'https://greenido.files.wordpress.com/2017/11/ray-dalio-principles-angled-book-ab1a2ff6c873144e545e21f9827a99a14d71bc635f6505ec17ee17bdf59ec742.png'
    },
    IsDeleted:{
        type:Boolean,
        default:false,
    }
    // reviews:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref:'Reviews',
    //   default:''
    // }
}) 

bookSchema.plugin(integerValidate);

const BookModel = mongoose.model('Books', bookSchema);
module.exports = BookModel ;