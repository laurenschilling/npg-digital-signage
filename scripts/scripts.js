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
// Page 4: Share Buttons (this wouldn't work at the bottom of the script, so it's been moved up here)
///////////////////////////////////////////////////////

// When #sendToEmail oor #sendToPhone button is clicked, display form with appropriate input

	// Email
	$('#sendToEmail').on('click', function(){
		$('#enterPhone').css('display', 'none');
		$('#enterEmail').css('display', 'block');
	});
	
	// Phone
	$('#sendToPhone').on('click', function(){
		$('#enterEmail').css('display', 'none');	
		$('#enterPhone').css('display', 'block');
	});

// When submit is clicked, display successful message (this doesn't actually determine whether it's a success or not, as we're not actually emailing the recipient in this prototype
	
	// Email
	$('#submitEmail').on('click', function(){
			// Email validation code goes here
			$('#submitEmail').attr('value', 'Email sent!'); 
	});
	
	// Phone
	$('#submitPhone').on('click', function(){		
			// Phone number validation code goes here
			$('#submitPhone').attr('value', 'Text sent!'); 
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

///////////////////////////////////////////////////////
// Page 3 - "Match the pose" Screen
///////////////////////////////////////////////////////

// Use browser-specific prefix for retrieving video media
window.navigator = window.navigator || {};
navigator.getUserMedia = navigator.getUserMedia       ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia    ||
                        null;

// Video Starts playing automatically
var video = $("video")[0];
var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

// Load user's chosen artwork into #artcontainter if #artcontainter is on screen (I.e. if user is on page 3)
window.onload = function() {
	if ($('#artContainer')[0] != null) {
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
  }
};

// 'Take Portrait' button: Display the user's 'pose' when user clicks the button
$('#poseButtonCapture').on('click', function() {
  // Hide button
  $('#poseButtonCapture').css('display', 'none');
  //Start count down
  $('#cameraCountdown3').css('display', 'block');
  $('#cameraCountdown3').fadeOut(1500, function() {
    $('#cameraCountdown2').css('display', 'block');
    $('#cameraCountdown2').fadeOut(1500, function() {
      $('#cameraCountdown1').css('display', 'block');
      $('#cameraCountdown1').fadeOut(1500, function() {
        // Pause the video
        video.pause();
        // Set canvas width/height
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        // B: run createImage function
        createImage(video);
        // Capture canvas image on an intermediate image that user can use to try out filters before committing to canvas via updateImage function
        $('#poseDynamicFilters').attr('src', $("#canvas")[0].toDataURL('image/jpg'));
        // HIDE CONTENT: video + screen 3 content
        $('#poseVideo').css('display', 'none');
        //SHOW CONTENT: Options to retake or accept the photo
        $('#retakePhoto').css('display', 'block');
      });
    });
  });
});

// Retake photo
$('#retakePhotoButton').on('click', function() {
  // Restart video
    $('#poseVideo').css('display', 'block');
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
  // Hide buttons
  $('#retakePhoto').css('display', 'none');
  //Start count down
  $('#cameraCountdown3').css('display', 'block');
  $('#cameraCountdown3').fadeOut(1500, function() {
    $('#cameraCountdown2').css('display', 'block');
    $('#cameraCountdown2').fadeOut(1500, function() {
      $('#cameraCountdown1').css('display', 'block');
      $('#cameraCountdown1').fadeOut(1500, function() {
        // Pause the video
        video.pause();
        // Set canvas width/height
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        // B: run createImage function
        createImage(video);
        // Capture canvas image on an intermediate image that user can use to try out filters before committing to canvas via updateImage function
        $('#poseDynamicFilters').attr('src', $("#canvas")[0].toDataURL('image/jpg'));
        // HIDE CONTENT: video + screen 3 content
        $('#poseVideo').css('display', 'none');
        //SHOW CONTENT: Options to retake or accept the photo
        $('#retakePhoto').css('display', 'block');
      });
    });
  });
});

// Accept Photo
$('#acceptPhotoButton').on('click', function() {
  // HIDE CONTENT: video + screen 3 content
  $('#poseVideo').css('display', 'none');
  $('#contentScreen3').css('display', 'none');
  $('#retakePhoto').css('display', 'none');
  // SHOW CONTENT: image + filter buttons + share button + screen 4 content
  $('#poseDynamicFilters').css('display', 'block');
  $('.filterButton').css('display', 'block');
  $('#shareButton').css('display', 'block');
  $('#contentScreen4').css('display', 'block');
});

// B: Draw the captured video to the canvas
function createImage(video, filterStr) {
  // B: Declare canvas element
  var ctx = $("#canvas")[0].getContext('2d');
  // B: check if we have video string, then create image
  if (video != undefined) {
    ctx.drawImage(video, 0, 0, $("#canvas")[0].width, $("#canvas")[0].height);
  } else {
    console.log('No image - from createImage function')
  };
};

///////////////////////////////////////////////////////
// Page 3 - "Add Filters" Screen
///////////////////////////////////////////////////////

// Display filter range selector and reset button when filter button is pushed
$('.filterButton').on('click', function() {
  // Show reset button
  $('#filterResetRow').css('display', 'block');
  // visually highlight the selected filter range
  $('.filterButton').css('background-color', 'rgba(0, 0, 0, 0.5)');
  $(this).css('background-color', '#b42b33');
  // hide all filter ranges
  $('.filterRange').css('display', 'none');
  // show this filter range
  var displayFilter = $(this).attr('data-filterType');
  document.getElementById(displayFilter).style.display = 'block';
});

// Apply filters to #poseDynamicFilters image everytime the user changes a filter value
function changeValue() {
  var blur = $('#filterBlur').val();
  var brightness = $('#filterBrightness').val();
  var contrast = $('#filterContrast').val();
  var grayscale = $('#filterGrayscale').val();
  var hue = $('#filterHue').val();
  var saturate = $('#filterSaturate').val();
  var sepia = $('#filterSepia').val();
  // Use above values to create a filter string
  $('#poseDynamicFilters').css('filter',
  "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)");
};

// Reset Filters
$('#filterResetButton').on('click', function() {
  $('#filterBlur').val("0");
  $('#filterBrightness').val("100");
  $('#filterContrast').val("100");
  $('#filterGrayscale').val("0");
  $('#filterHue').val("0");
  $('#filterSaturate').val("100");
  $('#filterSepia').val("0");
  $('#poseDynamicFilters').css('filter',
  'blur(0px) brightness(100%) contrast(100%) grayscale(0%) saturate(100%) sepia(0%) hue-rotate(0deg)');
});

// Share button
$('#shareButton').on('click', function() {
  // cw: hide/show functions so that when the user is finished taking their photos the share functions show up
  $('#sharePortrait').css('display', 'block');
	$('#shareButton').css('display', 'none');
	$('#filterButtons').css('display', 'none');
	$('#filters').css('display', 'none');
  $('#filterResetRow').css('display', 'none');
  $('#contentScreen4').css('display', 'none');
  $('#contentScreen5').css('display', 'block');
  // K: Update canvas with user's chosen filters
    var blur = $('#filterBlur').val();
    var brightness = $('#filterBrightness').val();
    var contrast = $('#filterContrast').val();
    var grayscale = $('#filterGrayscale').val();
    var hue = $('#filterHue').val();
    var saturate = $('#filterSaturate').val();
    var sepia = $('#filterSepia').val();
    // B: Create string of filters to send to updateImage fn
    var filterStr = "blur(" + blur + "px) brightness(" + brightness + "%) contrast(" + contrast + "%) grayscale(" + grayscale + "%) saturate(" + saturate + "%) sepia(" + sepia + "%) hue-rotate(" + hue + "deg)";
    // Update the image
    updateImage(filterStr);
  //B: go get the image again
  var img = document.getElementById("canvas");
  //B: create a dataURL
  var dataURL = img.toDataURL('png/jpeg');
  //Put the dataURL in localStorage so we can access it from the next screen
	localStorage.image = dataURL;
  console.log(dataURL);
  // If we end up using Page 4, put the call to page 4 here - you can't move on until the dataURL has been saved!
	  // window.location.href = "page4.html";
  //Once the image has been saved then we can go to the next page/process the image
  if (localStorage.getItem('image') != null) {
    saveImage();
  };
});

// B: Update the filters that are applied to the canvas
function updateImage(filterStr) {
  var img = document.getElementById("canvas");
  var ctx = $("#canvas")[0].getContext('2d');
  // B: Add the filters to the canvas
  ctx.filter = filterStr;
  // B: redraw the image on the canvas
  ctx.drawImage(img, 0, 0);
  console.log("Image updated with: " + filterStr)
};

// Save image
function saveImage() {
  //Grab the dataURL from localStorage
  var dataURL = localStorage.getItem('image');
  //send it off to the PHP script to convert it to an image
	$.ajax({
	  type: "POST",
	  url: "save-image.php",
	  data: {imgBase64: dataURL}
	}).done(function(o) {
	  console.log('Image has been saved');
	  // Once it has been saved then you can go off and do the other things to it
	});
};


//help button WIP bonney

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function giveHelp() {
    document.getElementById("myHelpbtn").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.helpbtn')) {

    var helpbuttons = document.getElementsByClassName("help-content");
    var i;
    for (i = 0; i < helpbuttons.length; i++) {
      var openHelp = helpbuttons[i];
      if (openHelp.classList.contains('show')) {
        openHelp.classList.remove('show');
      }
    }
  }
};
