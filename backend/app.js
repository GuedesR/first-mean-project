const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Access, X-Auth-Token, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

mongoose
  .connect(
    "mongodb+srv://standard:ZXfhGv3pmmrU0qeG@firstleanproject.5oquu.mongodb.net/first-mean-project?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connection with database established successfully");
  })
  .catch(() => {
    console.log("Error when connecting with database");
  });

app.use("/api/postlist", postRoutes);

module.exports = app;
