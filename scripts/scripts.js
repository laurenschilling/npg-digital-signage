
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
  // Pause the video
  video.pause();
  // Capture video image on canvas
  var ctx = $("#canvas")[0].getContext('2d');
  canvas.width = video.offsetWidth; // need to set width/height here - css can't do it apparently
  canvas.height = video.offsetHeight;
  ctx.drawImage(video, 0, 0, $("#canvas")[0].width, $("#canvas")[0].height);
  $('#poseImage').attr('src', $("#canvas")[0].toDataURL('image/jpg'));
  // hide video + capture button + screen 3 content
  $('#poseVideo').css('display', 'none');
  $('#poseButtonCapture').css('display', 'none');
  $('#contentScreen3').css('display', 'none');
  // Show image + filter buttons + share button + screen 4 content
  $('#poseImage').css('display', 'block');
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
  $('#poseImage').css('filter',
  "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)");
};

// Back button
$('.backButton').on('click', function(){
    localStorage.clear();
});

//////////////////////////////////////////////////////

// share button
$('#shareButton').on('click', function(){
    console.log('yep');
	var dataURL = canvas.toDataURL();
	saveImage(dataURL);
});

function saveImage(dataURL) {
	$.ajax({
	  type: "POST",
	  url: "script.php",
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

