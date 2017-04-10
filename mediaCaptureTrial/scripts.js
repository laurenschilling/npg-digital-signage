// Streaming video from https://www.sitepoint.com/introduction-getusermedia-api/
// Capturing video to canvas from: https://www.html5rocks.com/en/tutorials/getusermedia/intro/
// Filter stuff from http://html5-demos.appspot.com/static/css/filters/index.html
// Other filter stuff from https://www.w3schools.com/cssref/css3_pr_filter.asp

var videoStream = null;
var video = document.getElementById('video');

// Test browser support
window.navigator = window.navigator || {};
navigator.getUserMedia = navigator.getUserMedia       ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia    ||
                        null;
if (navigator.getUserMedia === null) {
  document.getElementById('unsupported').classList.remove('hidden');
  document.getElementById('button-play').setAttribute('disabled', 'disabled');
  document.getElementById('button-stop').setAttribute('disabled', 'disabled');
} else {
    var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};
    document.getElementById('button-play').addEventListener('click', function() {
        // reset buttons and images
        document.getElementById("button-play").style.display = "none";
        document.getElementById("button-stop").style.display = "block";
        document.getElementById("snapshot").style.display = "none";
        document.getElementById("video").style.display = "inline";
        // Capture user's audio and video source
        navigator.getUserMedia({
          video: true,
        },
        function(stream) {
          var videoStream = stream;
          // Stream the data
          video.src = createSrc(stream);
          video.play();
        },
        function(error) {
          console.log('Video capture error: ' + error.code);
        });
    });

    document.getElementById('button-stop').addEventListener('click', function() {
      document.getElementById("button-play").style.display = "block";
      document.getElementById("button-stop").style.display = "none";
      // Pause the video
      video.pause();
      // hide video
      document.getElementById("video").style.display = "none";
      // Capture image
      var canvas = document.querySelector('canvas');
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 300, 150);
      document.getElementById("snapshot").src = canvas.toDataURL('image/png');
      // Show image
      document.getElementById("snapshot").style.display = "inline";
    });
};

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

  document.getElementById("snapshot").style.filter =
  "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) invert(" + invert + "%) opacity(" + opacity + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)"; 
};
