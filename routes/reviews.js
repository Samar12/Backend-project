var express = require('express');
const Reviews = require('../models/Reviews');
const createError = require('http-errors');
const CategoryModel = require('../models/Category')
var router = express.Router();

//-----------------------Reviews Listing ----------------------------------------///
router.get('/GetAll', function(req, res, next) {
  Reviews.find({})
  .exec()
  .then(reviews=>res.send(reviews))
  .catch(err=>next(createError(500,err.message)))
});

//-----------------------------Get review ById ----------------------------------//
router.get('/:reviewId',(req,res,next)=>{
Reviews.findById(req.params.reviewId)

.then(review=>res.send(review))
.catch(err=>next(createError(404,err.message)))
})

//-----------------------------Add----------------------------------------------//
router.post("/Add", async (req, res, next) => {
    const { Reviews } = req.body;
    const review = new Book(req.body);
    await res.send(review);
    review
        .save(req.body)
        .then(review => {
            CategoryModel.updateOne({ _id: Reviews }, { $push: { books: review._id } })
                .then()
        })
        .catch(err => next(createError(400, err.message)));
});

//-----------------------------Update review --------------------------------//

//------------------------------Delete review ---------------------------//

module.exports = router;