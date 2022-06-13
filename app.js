const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// mongoDB connection string
mongoose.connect("mongodb://localhost:27017/wikiDB");

// create schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// creating article model
const Article = mongoose.model("Article", articleSchema);

// Created get request to get all articles from the database
app.get("/articles", function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      //console.log(foundArticles);
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

//Testing POST request data via postman
app.post("/articles", function (req, res) {
  //console.log(req.body.title);
  //console.log(req.body.content);

  //Saving data in the database
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function (err) {
    if (!err) {
      res.send("Successfuly added new article!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
