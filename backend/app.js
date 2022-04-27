const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json())

app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Access"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
})

app.post("/api/postList/", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post Added Successfully"
  })
})

app.get("/api/postlist", (req, res, next) => {
  const postList = [
    {
      id: "asdfdfsf",
      title: "First post Title",
      content: 'Firt post form server',
    },
    {
      id: "asdasdfdfsf",
      title: "Second post Title",
      content: "Second post form server",
	  },
  ];
  res.status(200).json({
    message: 'Posts fetched successfuly',
    postList: postList
  });
});

module.exports = app;
