const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const CategoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://siraj--ansari:qhDSRPakhkGE0boR@cluster0.qxmz1zo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
app.use("/api/login", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/products", productRoutes);

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log("Server is running on port:3000");
});
