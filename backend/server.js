import express from "express";
import products from "./data/products.js";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

config();
connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("sever is running");
});

app.use("/api/products", productRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port:${PORT}`
  );
});
