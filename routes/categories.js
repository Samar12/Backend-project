var express = require('express');
const Category = require('../models/Category');
const createError = require('http-errors');
var router = express.Router();

//----------------Create category---------------//
router.post('/Add' , (req,res,next)=>{
    debugger;
    Category.create(req.body)
    .then(category=>{
        res.send(category);
    })
    .catch(err=>{
        next(createError(400,err.message));
    }) 
})
//---------------GET Category listing--------------//
router.get('/GetAll', function(req, res, next) {
    Category.find({})
  .exec()
  .then(categories=>res.send(categories))
  .catch(err=>next(createError(500,err.message)))
});
//--------------GetCAtegoryByID-------------------//
router.get('/:categoryId',(req,res,next)=>{
    Category.findById(req.params.categoryId)
    .populate('Books' , req.params._id)
    .then(category=>res.send(category))
    .catch(err=>next(createError(404,err.message)))
    })

//-------------------Update Category-----------------------------//
router.patch('/:id/edit' ,  async function (req,res,next){
   await Category.findByIdAndUpdate({ _id: req.params.id },{ $set: req.body },{ new: true })
    .then(book=>{
        res.send(book);
    })
    .catch(err=>{
        next(createError(400,err.message));
    })
})

//------------------------DELETE CATEGORY 2 ----------------------///
router.delete('/:id/Delete', async function (req, res, next) {
    await Category.findByIdAndDelete(req.params.id, function (error,data) {
            if (error) {
                console.log(req.params.id);

            console.log("Something wrong when updating data!");
        }
    });
    res.json("Deleted success");
});

module.exports = router;