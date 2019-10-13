$(document).ready(function() {


  //renders the tweets on the page with the HTML code generated through the createTweetElement function
  const renderTweets = function(tweets) {
    $(".tweets").empty();
    for (let i = 0; i < tweets.length; i++) {
      const $tweet = createTweetElement(tweets[i]);
      console.log($tweet);
      $('.tweets').append($tweet);
    }
  };
  //handles tweet loading
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      dataType: "json",
      type: "GET",
      success: function(data) {
        renderTweets(data.reverse());
      }
    });
  };
  //finds the difference between the current time and the time was tweet submitted
  //this is then appended to the footer of the tweet in the CreateTweetElement function
  const timeCalculator = function(date) {
    let date1 = new Date(date);
    let date2 = new Date();
    let diffTime = Math.abs(date2 - date1) / 1000; //converts difference between two dates from milliseconds to seconds

    let timeUnits = {
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2630000,
      year: 31536000
    };

    if (diffTime <= 1) {
      return "Just now";
    } else if (diffTime / timeUnits.minute < 1) {
      return Math.floor(diffTime) + " seconds ago";
    } else if (diffTime / timeUnits.hour < 1) {
      diffTime = Math.floor(diffTime / timeUnits.minute);
      return diffTime + " minutes ago";
    } else if (diffTime / timeUnits.day < 1) {
      diffTime = Math.floor(diffTime / timeUnits.hour);
      return diffTime + " hours ago";
    } else if (diffTime / timeUnits.week < 1) {
      diffTime = Math.floor(diffTime / timeUnits.day);
      return diffTime + " days ago";
    } else if (diffTime / timeUnits.month < 1) {
      diffTime = Math.floor(diffTime / timeUnits.week);
      return diffTime + " weeks ago";
    } else if (diffTime / timeUnits.year < 1) {
      diffTime = Math.floor(diffTime / timeUnits.month);
      return diffTime + " months ago";
    } else if (diffTime / timeUnits.year > 2) {
      diffTime = Math.floor(diffTime / timeUnits.year);
      return diffTime + " years ago";
    }
  };


  //cross site scripting prevention
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //generates the required html code for a given tweet
  //also ensures that nobody tries injecting any JS code into the submission field that could potentially break the site through the escape function above
  const createTweetElement = function(tweet) {
    let timeCreated = timeCalculator(tweet.created_at);
    let $tweet = $('<article>').addClass('tweet-container');
    let markup = `
        <div class = "tweet-header">
          <div class = "userInfo">
            <img src=${escape(tweet.user.avatars)}>
          <div class = "username" style = "padding-bottom: 5px">${escape(tweet.user.name)}</div>
          
          </div>
          <div class ="handle">${escape(tweet.user.handle)}</div>
        </div>
        <div class = "tweet-content">${escape(tweet.content.text)}</div>
        <div class ="tweet-footer">
          <span class ="datePosted">${escape(timeCreated)}</span>
          <div class= "buttons">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
        </div>
  `;
    $tweet = $tweet.append(markup);
    return $tweet;
  };

  //handles tweet posting
  //checks that the user isn't attempting to submit an empty tweet or exceeding the 140 character limit
  //will reload the tweets without refreshing the page upon successful submission
  //otherwise, the user is prompted with the appropriate error message
  const $form = $('form');
  $form.on('submit', function(event) {
    event.preventDefault();
    if ($("textarea").val().length <= 0) {
      $(".length-error .error-text").text("You can't submit an empty tweet.");
      $(".length-error").slideDown("fast");
    } else if ($("textarea").val().length > 140) {
      $(".length-error .error-text").text("Too long. Please keep your tweets under 140 characters.");
      $(".length-error").slideDown("fast");
    } else {
      $(".length-error").slideUp();
      $.ajax({
        url: "/tweets",
        type: "POST",
        data: $form.serialize()
      }).then(function() {
        loadTweets();
        $("textarea").val("");
        $(".new-tweet .counter").text(140);
      });
    }
  });

  //handles all the sliders on the page
  //ensures that the compose tweet slider responds to clicks as expected
  $(".length-error").hide();
  $(".new-tweet").hide();
  $(".slider-trigger").on("click", function() {
    $(".new-tweet").slideToggle("fast", function() {
      $("textarea").focus();
    });
  });



  //loads all tweets upon page load
  loadTweets();

});
