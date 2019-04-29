var express = require("express");
const Book = require("../models/Book");
const createError = require("http-errors");
const CategoryModel = require("../models/Category");
const bookModel = require("../models/Book");
const userAuthorization = require("./../middlewares/User_Authentication");
var router = express.Router();

//-----------------------Book Listing ----------------------------------------///
router.get("/GetAll", function(req, res, next) {
  Book.find({})
    .exec()
    .then(books => res.send(books))
    .catch(err => next(createError(500, err.message)));
});

//-----------------------------Get Book ById ----------------------------------//
router.get("/:bookId", (req, res, next) => {
  Book.findById(req.params.bookId)

    .then(book => res.send(book))
    .catch(err => next(createError(404, err.message)));
});

router.post("/search", userAuthorization, async function(req, res, next) {
  bookModel
    .find({})

    .exec()
    .then(all => {
      res.send(
        all.filter(book => {
          if (book.name.toLowerCase().includes(req.body.name.toLowerCase())) return book;
        })
      );
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

//------------------------------Add----------------------------------------------//
router.post("/Add", async (req, res, next) => {
  const { categoryID } = req.body;
  const book = new Book(req.body);
  await res.send(book);
  book
    .save(req.body)
    .then(cat => {
      CategoryModel.updateOne({ _id: categoryID }, { $push: { books: cat._id } }).then();
    })
    .catch(err => next(createError(400, err.message)));
});

//-----------------------------Update Book --------------------------------//
router.patch("/:bookId/edit", (req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true })
    .then(book => {
      res.send(book);
    })
    .catch(err => {
      next(createError(400, err.message));
    });
});

//------------------------------Delete Book ---------------------------//
router.delete("/:bookId/Delete", (req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId, req.body)
    .then(book => {
      res.send(book);
    })
    .catch(err => {
      next(createError(400, err.message));
    });
});

module.exports = router;
