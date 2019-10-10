$(document).ready(function () {
  $("#upButton").hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
      $("#upButton").fadeIn();
      $(".slider-trigger").fadeOut();
    }
    else {
      $("#upButton").fadeOut();
      $(".slider-trigger").fadeIn();
    }
  });



  $("#upButton").click(function () {
    $(window).scrollTop(0);
    $(".new-tweet").slideDown("fast", function () {
      $("textarea").focus();
    });
  });

});