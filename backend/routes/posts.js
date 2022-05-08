const express = require("express");
const Post = require("../models/post");

const multer = require("multer");
const { count } = require("console");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type");

    cb(error, "backend/images" /* path is relative to the server.js file */);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currPage = +req.query.page;
  const postQuery = Post.find();
  let foundPostList;

  if(pageSize && currPage) {
    postQuery
      .skip(pageSize * (currPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then((data) => {
      foundPostList = data;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfuly",
        postList: foundPostList,
        maxPosts: count
      });
    });
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const serverUrl = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: serverUrl + "/images/" + req.file.filename,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post Added Successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
      console.log("Editing Post: ");
      console.log(post);
    } else {
      res.status(404).json({ message: "Post Not Found!" });
    }
  });
});

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const serverUrl = req.protocol + "://" + req.get("host");
      imagePath = serverUrl + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      res.status(200).json({ message: "Update Successful!" });
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router;
