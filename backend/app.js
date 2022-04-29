const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

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
    "GET, POST, PATCH, DELETE, OPTIONS"
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

app.post("/api/postList/", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then(createdPost => {
    console.log(createdPost)
    res.status(201).json({
    message: "Post Added Successfully",
    postId: createdPost._id
  });
  });

});

app.get("/api/postlist", (req, res, next) => {
  Post.find().then((data) => {
    console.log(data);
    res.status(200).json({
      message: "Posts fetched successfuly",
      postList: data,
    });
  });
});


app.delete("/api/postList/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'})
  })
})

module.exports = app;
