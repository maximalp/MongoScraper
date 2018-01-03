// Grab the articles as a json

$(document).on("click", "#scrapeButton", function() {
  //console.log("scrape page call not coming");
    $.getJSON("/scrape", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page


        let titleLinked = $('<a>').attr('href', data[i].link).text(data[i].title)
        .click(function(){window.open(this.href);
        return false;
        });;

        let button = $("<button>").text("Save Article").addClass("button is-primary");

        //button.addClass("is-primary");
        button.data("article", data[i]);

        let d = $("<div>").addClass("box");
        let p = $("<p>").append(titleLinked).append("<br/>" + "<br/>" + data[i].summary);

        d.append(p).append(button);

        $("#articles").append(d).append("<br>" + "</br>");


      button.on("click", function()
      {
        let article = $(this).data("article");
        let button = this;
        $.ajax({
          method: "POST",
          url: "/article",
          data: article
        })

    // With that done
        .done(function(savedArticleData) {
          // Log the response
          console.log(savedArticleData);

          const index = data.indexOf(article);

          if (index !== -1) {
              data.splice(index, 1);
              }

           let parent = $(button).parent();
           $(parent).remove();

          // Empty the notes section
      //    $("#notes").empty();
        });
      });





  //  jQuery('<div>').append(jQuery('<a>').attr('href', 'url').text('blah')).html()

    //$("#articles").append("<p>")


    //$('#ItemFields').append($('<label></label>')
      //  .attr('for', 'Item["' + count + ']')
        //.value('your label text here'));


    // variable for a title with a link to article

    //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    //$("#articles").append("<div>" + "<br/>" +  "</br>" +  "<br/>" + data[i].summary + "</p>");


    //('<a>').attr('href', 'url').text('blah')



  };
});
});


$(document).on("click", "#deleteButton", function() {

console.log("trying to click button");
let articleId = $(this).attr("data-id");
console.log("articleId is " + articleId);

  $.ajax({
    method: "DELETE",
    url: "/articles/" + articleId
  })
  .done(function(data) {

  console.log("deleted article " + articleId);
  });

});


// Whenever someone clicks a p tag
$("#noteCall").on("click", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
