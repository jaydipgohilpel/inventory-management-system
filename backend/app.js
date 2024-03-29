var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const apiResponse = require("./helpers/apiResponse");
const cors = require('cors');
require('dotenv').config();


// var router = express.Router();
// const serverless = require("serverless-http");

require('./config/config');
require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var customerRouter = require('./routes/customer');
var supplierRouter = require('./routes/supplier');
var orderRouter = require('./routes/order');
var orderDetailRouter = require('./routes/orderdetail');
var WarehouseRouter = require('./routes/warehouse');
var auditTrailRouter = require('./routes/audittrail');
var barcodeRouter = require('./routes/barcode');
var alertsRouter = require('./routes/alerts');

var app = express();

const corsOptions = {
  origin: ['https://inventory-management-systemweb.netlify.app', 'http://localhost:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Enable CORS for all routes
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/customer', customerRouter);
app.use('/supplier', supplierRouter);
app.use('/order', orderRouter);
app.use('/orderdetail', orderDetailRouter);
app.use('/warehouse', WarehouseRouter);
app.use('/audittrail', auditTrailRouter);
app.use('/barcode', barcodeRouter);
app.use('/alerts', alertsRouter);


// router.get('/', (req, res) => {
//   res.json({
//     'hello world': 'hi!'
//   })
// })

// router.use('/.netlify/functions/api', router);
// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
