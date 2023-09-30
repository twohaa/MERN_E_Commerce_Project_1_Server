const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const { errorResponse } = require("./controllers/responseContoller");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: "Too many request from this IP, Please try again letter.",
});

app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome,Get Api is working fine.",
  });
});

app.post("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome,Post Api is working fine.",
  });
});

app.put("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome,Put Api is working fine.",
  });
});

app.delete("/test", (req, res) => {
  res.status(200).send({
    message: "Welcome,Delete Api is working fine.",
  });
});

// Client Error handaling
app.use((req, res, next) => {
  //   res.status(404).json({ message: "Route not found" });
  next(createError(404, "Route not found"));
});
// Server Error handaling --> all the error will come here
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
