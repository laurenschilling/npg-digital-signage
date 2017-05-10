
///////////////////////////////////////////////////////
// Page 2 "Pick a Portrait"
///////////////////////////////////////////////////////

// Select portrait to use
$('.art').on('click', function(){
    // Visually highlight the selection and restore previous selection to normal
    $('.art').css('filter', 'brightness(100%)');
    $(this).css('filter', 'brightness(30%)');
    // visually indicate that 'next' button can be clicked
    $('#selectPortraitButton').css('background-color', '#b42b33');
    $('#selectPortraitButton').css('opacity', '1');
    $('#selectPortraitButton').css('color', '#fff');
    $('#selectPortraitButton').css('cursor', 'pointer');
    // Store selection
    localStorage.selection = this.id;
});

// Do not let user progress to Page 3 before they make a portrait selection
$('#selectPortraitButton').on('click', function(){
  if (localStorage.selection == undefined) {
    alert("Please click on a portrait to select it");
    return false;
  };
});

// Display Portrait text over image
$('.four').on('click', function(){
	$(".imageTextBox").removeClass("imageTextBox2");
    $(this).find(".imageTextBox").toggleClass("imageTextBox2");
});

//////////////////////////////////////////////////////

// Page 4: Share Buttons (this wouldn't work at the bottom of the script, so it's been moved up here)

// When #sendToEmail button is clicked, display form with email input
$('#sendToEmail').on('click', function(){
	$('#enterEmail').css('display', 'block');
});

// When submit is clicked, display successful message (this doesn't actually determine whether it's a success or not, as we're not actually emailing the recipient in this prototype
$('#submit').on('click', function(){
	$('#submit').attr('value', 'Email sent!');
});

// This doesn't actually send the email anywhere, it just prevents the page from reloading
$(document).ready(function(){
   var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
	  	// action to email the recipient goes here
      },'json');
      return false;
   });
});

//////////////////////////////////////////////////////


///////////////////////////////////////////////////////
// Page 3 "Match the pose"
///////////////////////////////////////////////////////

window.navigator = window.navigator || {};
navigator.getUserMedia = navigator.getUserMedia       ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia    ||
                        null;

// Use Firefox-specific prefix for getUserMedia
// navigator.getUserMedia = navigator.mozGetUserMedia;

var video = $("video")[0];
var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

window.onload = function(){
	console.log('here');
    // Load selected portrait from local storage
    var selectedArtPath = "images/crop/" + localStorage.selection + ".jpg";
    $("#artContainer").prepend("<img id='artContainer' src=' " + selectedArtPath + "' />")
    // Make portrait and pose images square
    // Width is set by css and then height is set here to equal that width
    var squareSide = $('#artContainer')[0].offsetWidth;
    $('#artContainer').css('height', squareSide + 'px');
    $('#squarePose').css('height', squareSide + 'px');
    // Capture user's video source
    navigator.getUserMedia({
      video: true,
    },
    // Stream the data
    function(stream) {
      var videoStream = stream;
      video.src = createSrc(stream);
      video.play();
    },
    function(error) {
      console.log('Video capture error: ' + error.code);
    });
};

// Display the user's 'pose' when user clicks the 'Capture' button
document.getElementById('poseButtonCapture').addEventListener('click', function() {
  // Pause and hide the video
  video.pause();

  // Capture video image on canvas
  //  var ctx = $("#canvas")[0].getContext('2d'); //B: moved to createImage fn

  canvas.width = video.offsetWidth; // need to set width/height here - css can't do it apparently
  canvas.height = video.offsetHeight;

  //B: run createImage function
  createImage(video);

  // ctx.drawImage(video, 0, 0, $("#canvas")[0].width, $("#canvas")[0].height); // B: Moved to createImage fn

  // $('#poseImage').attr('src', $("#canvas")[0].toDataURL('image/jpg')); //K: I don't think we're using poseImage anymore?

  // hide video + capture button + screen 3 content
  $('#poseVideo').css('display', 'none');
  $('#poseButtonCapture').css('display', 'none');
  $('#contentScreen3').css('display', 'none');
  // Show image + filter buttons + share button + screen 4 content
  // $('#poseImage').css('display', 'block'); //K: I don't think we're using poseImage anymore?
  $('.filterButton').css('display', 'block');
  $('#shareButton').css('display', 'block');
  $('#contentScreen4').css('display', 'block');
});


// Display filter range selector when filter button is pushed
$('.filterButton').on('click', function(){
  // visually highlight the selected filter range
  $('.filterButton').css('background-color', 'rgba(0, 0, 0, 0.5)');
  $(this).css('background-color', '#b42b33');
  // hide all filter ranges
  $('.filterRange').css('display', 'none');
  // show this filter range
  var displayFilter = $(this).attr('data-filterType');
  document.getElementById(displayFilter).style.display = 'block';
});

//Apply filters
function changeValue() {
  var blur = $('#filterBlur').val();
  var brightness = $('#filterBrightness').val();
  var contrast = $('#filterContrast').val();
  var grayscale = $('#filterGrayscale').val();
  var hue = $('#filterHue').val();
  var saturate = $('#filterSaturate').val();
  var sepia = $('#filterSepia').val();

  //B: remove CSS filters - need to update these via the canvas instead
  //  $('#poseImage').css('filter',
  //  "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)");

  //B: Create string of filters to send to updateImage fn
  var filterStr = "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)";
  console.log(filterStr);
  //when we update a filter, go and update the image via a new function
  updateImage(filterStr);

}
//B: Suggested improvment: a reset button - to clear all filters so a user can start again

//B: new function to actually draw the captured video to the canvas
function createImage(video, filterStr) {
    console.log('in createImage function');

    //declare canvas element in here
    var ctx = $("#canvas")[0].getContext('2d');

    //B: check if we have video string, then create image
    if (video != undefined) {
        console.log('we have video');
        ctx.drawImage(video, 0, 0, $("#canvas")[0].width, $("#canvas")[0].height);
    } else (
        console.log('no image')
    )
}

//B: new function to update image when filters are added
function updateImage(filterStr) {
    console.log('in update image function');

    var img = document.getElementById("canvas");
    var ctx = $("#canvas")[0].getContext('2d');

    //output filter string to test
    //console.log(filterStr);

    //B: Add the filters to the canvas
    ctx.filter = filterStr;
    //B: redraw the image on the canvas
    ctx.drawImage(img, 0, 0);
}

// Back button
$('.backButton').on('click', function(){
    localStorage.clear();
});

//////////////////////////////////////////////////////

// share button
$('.testBtn').on('click', function(){
	console.log('testbtn click');

    //B: go get the image again
    var img = document.getElementById("canvas");
    //B: create a dataURL
    var dataURL = img.toDataURL('png/jpeg');

	//console.log(dataURL);
    //Put the dataURL in localStorage so we can access it from the next screen
	localStorage.image = dataURL;

    //Suggest you put the call to page 4 here - you can't move on until the dataURL has been saved!


    //Once the image has been saved then we can go to the next page/process the image
    if (localStorage.getItem('image') != null) {
        console.log('item has been saved');

        //now lets try save the image
        saveImage();
    }
});

//B: function to actually save the image
function saveImage() {
    console.log('in saveImage');

    //Grab the dataURL from localStorage
    var dataURL = localStorage.getItem('image');

    //send it off to the PHP script to convert it to an image
	$.ajax({
	  type: "POST",
	  url: "save-image.php",
	  data: {
		 imgBase64: dataURL
	  }
	}).done(function(o) {
	  console.log('saved');
	  // If you want the file to be visible in the browser
	  // - please modify the callback in javascript. All you
	  // need is to return the url to the file, you just saved
	  // and than put the image in your browser.
	});

};
