const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const CategoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const accountRoutes = require("./routes/account");
const wishListRoutes = require("./routes/wishlist");
const settingRoutes = require("./routes/setting");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/review");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://siraj--ansari:" +
        process.env.MONGODB_USER +
        "@cluster0.qxmz1zo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "House-of-dryfruits",
      }
    );

    console.log("Connected to mongoDB successfully!");
  } catch (err) {
    console.log(err);
  }
}

connectToMongoDB();

const app = express();

app.use("", express.json());
app.use("", cors());

app.use("/productImages", express.static(path.join("productImages")));
app.use("/api/admins", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/account/", accountRoutes);
app.use("/api/wishlist/", wishListRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/settings/", settingRoutes);
app.use("/api/orders/", orderRoutes);
app.use("/api/reviews/", reviewRoutes);

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log("Server is running on port:3000");
});
