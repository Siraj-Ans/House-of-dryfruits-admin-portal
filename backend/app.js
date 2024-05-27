const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");

const authRoutes = require("./routes/auth");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://sirajansari:qhDSRPakhkGE0boR@cluster0.qxmz1zo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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

app.use("/api/login", authRoutes);

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log("Server is running on port:3000");
});
