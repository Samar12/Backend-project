var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const userModel = require("../models/user");
const authMiddleware = require("../middlewares/User_Authentication");

router.post("/register", async function(req, res, next) {
  await userModel.create(req.body, function(err, user) {
    if (err) return next(createError(400, err.message));
    res.send(user);
  });
});

router.post("/login", async function(req, res, next) {
  const { name, password } = req.body;
  const currentUser = await userModel.findOne({ name });
  if (!currentUser) return next(createError(401));
  const passwordMatch = await currentUser.verifyPassword(password);
  if (!passwordMatch) return next(createError(401));
  const token = currentUser.generateToken();
  // console.log(token);
  // debugger;
  res.send({
    profile: currentUser,
    token
  });
});

router.use(authMiddleware);

router.get("/profile", async function(req, res, next) {
  // debugger;
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(current);
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});
router.get("/books/:pageNum", async function(req, res, next) {
  var perPage = 4;
  var page = req.params.pageNum || 1;
  var result = [];
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(b => {
      result = b.books.slice(perPage * page - perPage, perPage * page);
      // console.log(result);
      res.send(result);
    })
    .catch(err => next(createError(500, err.message)));
});
router.get("/all-Books/:pageNum", async function(req, res, next) {
  var perPage = 4;
  var page = req.params.pageNum || 1;
  var result = [];
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      result = current.books.slice(perPage * page - perPage, perPage * page);
      let amount = current.books.length;
      if (result.length == 0) {
        return true;
      } else {
        res.send({
          result: result,
          amount
        });
      }
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/read-Books/:pageNum", async function(req, res, next) {
  var perPage = 4;
  var page = req.params.pageNum || 1;
  var result = [];
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      result = current.books.filter(book => {
        if (book.status === "read") return book;
      });
      let amount = result.length;
      res.send({
        result: result.slice(perPage * page - perPage, perPage * page),
        amount
      });
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/wanttoread-Books/:pageNum", async function(req, res, next) {
  var perPage = 4;
  var page = req.params.pageNum || 1;
  var result = [];
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      result = current.books.filter(book => {
        if (book.status === "want to read") return book;
      });
      let amount = result.length;
      res.send({
        result: result.slice(perPage * page - perPage, perPage * page),
        amount
      });
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/currentlyreading-Books/:pageNum", async function(req, res, next) {
  var perPage = 4;
  var page = req.params.pageNum || 1;
  var result = [];
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      result = current.books.filter(book => {
        if (book.status === "currently reading") return book;
      });
      let amount = result.length;
      res.send({
        result: result.slice(perPage * page - perPage, perPage * page),
        amount
      });
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.post("/book/edit/:id", async function(req, res, next) {
  const { status, rate } = req.body;

  if (status) {
    req.user.books.find(book => {
      if (req.params.id == book.bookId._id.toString()) book["status"] = status;
    });
  }
  if (rate) {
    req.user.books.find(book => {
      if (book.bookId._id.toString() == req.params.id) book["rating"] = rate;
    });
  }
  userModel.findByIdAndUpdate(req.user._id, { books: req.user.books }, { new: true }, (err, result) => {
    if (err) next(createError(404, err.message));
    res.send(result);
  });
});

module.exports = router;
