const express = require("express");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const AppError = require("./utils/appError");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const reviewRoute = require("./routes/review");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  //  // local Vite dev server
  // deployed frontend
];
app.use(
  cors({
    origin: allowedOrigins, // allow your frontend
    credentials: true,
  })
);

app.use("/api", userRoute);
app.use("/api/product", productRoute);
app.use("/api/review", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/order", orderRoute);

app.all("*catchall", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
