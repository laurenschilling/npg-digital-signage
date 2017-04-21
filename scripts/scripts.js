// Use Firefox-specific prefix for getUserMedia
navigator.getUserMedia = navigator.mozGetUserMedia;

var video = document.getElementById('poseVideo');
var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

window.onload = function(){
    // Make portrait and pose images square
    // Width is set by css and then height is set here to equal that width
    var squareSide = document.getElementById("selectedPortrait").offsetWidth;
    document.getElementById("selectedPortrait").style.height = squareSide + "px";
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
  // Can't set canvas width/height with css
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  document.getElementById("poseImage").src = canvas.toDataURL('image/jpg');
  // Show image
  document.getElementById("poseImage").style.display = "block";
  // hide video
  document.getElementById("poseVideo").style.display = "none";
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
