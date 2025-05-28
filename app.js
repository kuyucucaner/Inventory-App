const http = require("http");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sql = require("mssql");
const methodOverride = require("method-override");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const inventoryRouter = require("./routes/inventory");

var app = express();
const config = {
  server: "localhost",
  database: "inventory",
  authentication: {
    type: "default",
    options: {
      userName: "caner",
      password: "12",
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const tedious = require("tedious");
const connection = new tedious.Connection(config);

connection.on("connect", (err) => {
  if (err) {
    console.error("Bağlantı hatası:", err);
  } else {
    console.log("Veritabanına başarıyla bağlandı");
    // Veritabanı işlemlerinizi burada gerçekleştirin
  }
});

connection.connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/inventory", inventoryRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
