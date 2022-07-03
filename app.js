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

//////////////////////ALL ARTICLES//////////////////////

//updated code with chained route handlers
app
  .route("/articles")
  // Created get request to get all articles from the database
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        //console.log(foundArticles);
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  //Testing POST request data via postman
  .post(function (req, res) {
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
  })
  //Delete all articles from database
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfuly deleted all articles!");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////SPECIFIC ARTICLE//////////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles with that title was found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Updated Successfyly!");
        } else {
          console.log(err);
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfuly updated!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne(
      { title: req.params.articleTitle },

      function (err) {
        if (!err) {
          res.send("Successfuly deleted article!");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
