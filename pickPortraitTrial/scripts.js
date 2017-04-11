// Click on portrait
$('.portrait').on('click', function(){
  // Make all borders black, make clicked border red
  jQuery("img").css('border-color', 'black');
  jQuery("img", this).css('border-color', 'red');
  // Set all cursors to pointer, set clicked cursor to normal mouse
  jQuery("img").css("cursor","pointer");
  jQuery("img", this).css("cursor","auto");
  // Hide all picture titles and buttons, only display this title and button
  jQuery(".selectPortrait").css('display', 'none');
  jQuery("h3").css('display', 'none');
  jQuery(".selectPortrait", this).css('display', 'block');
  jQuery("h3", this).css('display', 'block');
});

// Select portrait to use
$(".selectPortrait").on('click', function(){
  var x = this.id;
  // Store selection
  localStorage.portraitSelection = x;
});


$(function() {
    var y = "images/" + localStorage.portraitSelection + ".jpg";
    $("#portraitContainer").prepend("<img src=' " + y + "' />")
});
