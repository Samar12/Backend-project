const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
// var indexRouter = require("./routes/index");
const createError = require("http-errors");
require("./db");

const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");
const categoriesRouter = require("./routes/categories");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", usersRouter);
app.use("/admin", adminRouter);

app.use("/api/categories", categoriesRouter);
app.use("/api/Authors", authorsRouter);
app.use("/api/books", booksRouter);

// not found middleware
app.use((req, res, next) => {
  next(createError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
