$(document).ready(function() {
  $(".new-tweet textarea").on('input', function(){
    let textEntered = this.value.length;
     let sum = 140 - textEntered;

    if(sum < 0){
      $(".new-tweet .counter").css("color", "red");
    }
    else{
      $(".new-tweet .counter").css("color", "#545149");
    }
    $(".new-tweet .counter").text(sum);
  });
});
