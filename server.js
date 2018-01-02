var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");



// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MongoScraperDB", {
  useMongoClient: true
});







// Routes

// A GET route for scraping the NEW YORKER website ("The Latest" section only)
app.get("/scrape", function(req, res) {
  console.log('start scrape');
  // First, we grab the body of the html with request
  axios.get("https://www.newyorker.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    console.log("after axios")
    var $ = cheerio.load(response.data);

    let newsArray = [];
    // Now, we grab every h2 within an article tag, and do the following:
    $(".Card__theLatest___2bNJt").each(function(i, element) {

      // Save an empty result object

    //  $('#fruits').find('li').length
      //=> 3
      //$('#fruits').find($('.apple')).length
      //=> 1


      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      console.log("number of h3 length " + $(this).find("h3").length);
      console.log("number of a length " + $(this).find("a").length);

      result.title = $(this).find("h3").text();
      result.link = "https://www.newyorker.com" + $(this).find("a").first().attr("href");
      result.summary = $(this).find("p").first().text();

      newsArray.push(result);

      });
      res.json(newsArray);
    });
  });

  //saving one article to database
  app.post("/article", function(req, res) {
    // Create a new article and pass the req.body to the entry
    db.Article
      .create(req.body)
      .then(function(dbArticle) {
        // If we were able to successfully save an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
