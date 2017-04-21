// Back button
$('.backButton').on('click', function(){
    localStorage.clear();
});

///////////////////////////////////////////////////////
// Page 2 "Pick a Portrait"
///////////////////////////////////////////////////////

// Select portrait to use
$('.art').on('click', function(){
    // Visually highlight the selection and restore previous selection to normal
    $('.art').css('filter', 'brightness(100%)');
    $(this).css('filter', 'brightness(25%)');
    // visually indicate that 'next' button can be clicked
    $('#selectPortraitButton').css('background-color', '#b42b33');
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
  } else {
    return true;
  }
});

///////////////////////////////////////////////////////
// Page 3 "Match the pose"
///////////////////////////////////////////////////////

// Use Firefox-specific prefix for getUserMedia
navigator.getUserMedia = navigator.mozGetUserMedia;

var video = document.getElementById('poseVideo');
var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

window.onload = function(){
    // Load selected portrait from local storage
    var selectedArtPath = "images/crop/" + localStorage.selection + ".jpg";
    $("#artContainer").prepend("<img id='artContainer' src=' " + selectedArtPath + "' />")
    // Make portrait and pose images square
    // Width is set by css and then height is set here to equal that width
    var squareSide = document.getElementById("artContainer").offsetWidth;
    document.getElementById("artContainer").style.height = squareSide + "px";
    document.getElementById("squarePose").style.height = squareSide + "px";
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
  var canvas = document.querySelector('canvas');
  var videoWidth = video.offsetWidth;
  var videoHeight = video.offsetHeight;
  var ctx = canvas.getContext('2d');
  // set canvas width/height (Can't do this with css)
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  document.getElementById("poseImage").src = canvas.toDataURL('image/jpg');
  // Show image
  document.getElementById("poseImage").style.display = "block";
  // hide video
  document.getElementById("poseVideo").style.display = "none";
  // hide capture button
  $('#poseButtonCapture').css('display', 'none');
  // show filters + share button
  $('#filters').css('display', 'block');
  $('#shareButton').css('display', 'block');
});

//Apply filters
function changeValue() {
  var blur = document.getElementById("filterBlur").value;
  var brightness = document.getElementById("filterBrightness").value;
  var contrast = document.getElementById("filterContrast").value;
  var grayscale = document.getElementById("filterGrayscale").value;
  var hue = document.getElementById("filterHue").value;
  var invert = document.getElementById("filterInvert").value;
  var opacity = document.getElementById("filterOpacity").value;
  var saturate = document.getElementById("filterSaturate").value;
  var sepia = document.getElementById("filterSepia").value;

  document.getElementById("poseImage").style.filter =
  "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) invert(" + invert + "%) opacity(" + opacity + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)";
};
