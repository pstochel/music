// Get the video
var video = document.getElementById("myVideo");

// Get the buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");
var playVideoBtn = document.getElementById("play-video");

// Sliders
var seekBar = document.getElementById("seek-bar");
var volumeBar = document.getElementById("volume-bar");


// Audio
var audio = document.getElementById("audio");
var volumeBarAudio = document.getElementById("volume-bar-audio");
var seekBarAudio = document.getElementById("seek-bar-audio");
var playAudioBtn = document.getElementById("play-audio");


// Play the video
function playVideo(videoName) {
	document.getElementById("a-controls").style.display = "none";
	stopAudio();

	if (video.getAttribute('src') === "") {
		video.setAttribute("src", './video/' + videoName + '.mp4')
		video.load();
		document.getElementById("v-controls").style.display = "block";
		playVideoBtn.classList.add("paused");

	}
	else if (playVideoBtn.classList.contains('paused') && !videoName) {
		video.pause();
		return
	}
	video.play();
}


function pauseVideo(){
	video.pause();

}

function stopVideo() {
	video.pause();
	video.setAttribute("src", "");
	video.load();
	document.getElementById("v-controls").style.display = "none";
}

// muteButton.addEventListener("click", function() {
//   if (video.muted == false) {
//     video.muted = true;
//     muteButton.innerHTML = "Unmute";

//   } else {
//     video.muted = false;
//     muteButton.innerHTML = "Mute";

//   }
// });

fullScreenButton.addEventListener("click", function() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome and Safari
  }
});

seekBar.addEventListener("change", function() {
  // Calculate the new time
  var time = video.duration * (seekBar.value / 100);

  // Update the video time
  video.currentTime = time;
});

// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Calculate the slider value
  var value = (100 / video.duration) * video.currentTime;

  // Update the slider value
  seekBar.value = value;
});

// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
  // Update the video volume
  video.volume = volumeBar.value;
});


// -------------------------------------- AUDIO

function playAudio(audioName, canvasID) {
	document.getElementById("v-controls").style.display = "none";
	stopVideo();

	if (audio.getAttribute('src') === "") {
		audio.setAttribute("src", './sound/' + audioName + '.mp3')
		audio.load();
		document.getElementById("a-controls").style.display = "block";
		playAudioBtn.classList.add("paused");
	}
	else if (playAudioBtn.classList.contains('paused') && !audioName) {
		audio.pause();
		return
	}
	
    audio.play();

    var context = new AudioContext(window.AudioContext || window.webkitAudioContext);
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
	src.connect(analyser);
    analyser.connect(context.destination);

    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext("2d");

    analyser.fftSize = 32;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

	var barWidth = ((WIDTH) / (2*bufferLength)) ;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);
		WIDTH = canvas.width;
      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = (HEIGHT/255/2) * dataArray[i];
        
        var r = 255 - (100* barHeight/150);
        var g = 255 - (100* barHeight/150);
        var b = 255 - (100* barHeight/150);

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
		ctx.fillRect(x, (0.5 * HEIGHT) - barHeight, barWidth, 2*barHeight);

        x += barWidth * 2;
      }
    }

    audio.play();
    renderFrame();

}


function initCanvas(){
	var canvases = document.getElementsByClassName("canvas");
	for (var c=0; c< canvases.length; c++){
		var canvas = canvases[c];
	    var ctx = canvas.getContext("2d");

	    var bufferLength = 32;

	    var dataArray = [50, 60, 75, 123, 150, 177,199, 180, 190, 188,195, 200,190,195,200,200,200,200,150,160,165,177,177,177,180,177,133,120,105,99,80,50]
	    var WIDTH = canvas.width;
	    var HEIGHT = canvas.height;

	    var barWidth = ((WIDTH) / (2*bufferLength)) ;
	    var barHeight;
	    var x = 0;

		WIDTH = canvas.width;

		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		for (var i = 0; i < bufferLength; i++) {
			barHeight = (HEIGHT/255/2) * dataArray[i];

			var r = 255 - (100* barHeight/150);
			var g = 255 - (100* barHeight/150);
			var b = 255 - (100* barHeight/150);

			ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			ctx.fillRect(x, (0.5 * HEIGHT) - barHeight, barWidth, 2*barHeight);

			x += barWidth *2;
		}
	}
}


function pauseAudio(){
	audio.pause();

}

function stopAudio() {
	audio.pause();
	audio.setAttribute("src", "");
	audio.load();
	document.getElementById("a-controls").style.display = "none";
}

function changeMute(ismute) {
	mutedBtns = document.getElementsByClassName("button-mute");
	unmutedBtns = document.getElementsByClassName("button-unmute");

	for (var i =0; i< mutedBtns.length; i++){
		mutedBtns[i].style.display = ismute ? "inline":  "none";
	}

	for (var i =0; i< unmutedBtns.length; i++){
		unmutedBtns[i].style.display = ismute ? "none" : "inline";
	}
}

function mute(ismute) {
	if (audio.muted == false) {
		audio.muted = true;


	}
	else if (audio.muted == true) {
		audio.muted = false;
	} 
	if (video.muted == false) {
		video.muted = true;

	} 
	else if (video.muted == true) {
		video.muted = false;
	}
	changeMute(ismute)
}

volumeBarAudio.addEventListener("change", function() {
  // Update the video volume
	audio.volume = volumeBarAudio.value;
});


seekBarAudio.addEventListener("change", function() {
  // Calculate the new time
	var time = audio.duration * (seekBarAudio.value / 100);

  // Update the video time
 	audio.currentTime = time;
});

// Update the seek bar as the video plays
audio.addEventListener("timeupdate", function() {
  // Calculate the slider value
  	var value = (100 / audio.duration) * audio.currentTime;

  // Update the slider value
  	seekBarAudio.value = value;
});

playAudioBtn.addEventListener("click", function() {
	playAudioBtn.classList.toggle("paused");
	return false;
});

playVideoBtn.addEventListener("click", function() {
	playVideoBtn.classList.toggle("paused");
	return false;
});



// --------------------------------------

// Fuilter work pieces
function filterWork(c) {
  var x, i;
  x = document.getElementsByClassName("work_piece");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}


// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}


// Add active class to the current control button (highlight it)
var btns = document.getElementsByClassName("filter");
for (var i = 0; i < btns.length; i++) {
	btns[i].addEventListener("click", function() {
		var current = document.getElementsByClassName("filter active");
		current[0].className = current[0].className.replace("active", "");
		this.className += " active"; 
	});
}

// Change language of the website
function changeLanguage(evt, language) {
	document.body.className = language;
	
	langBtns = document.getElementsByClassName("langBtn");
	for (i = 0; i < langBtns.length; i++) {
		langBtns[i].className = langBtns[i].className.replace(" active", "");
	}

	evt.currentTarget.className += " active";

}

// Open chosen tab
function openTab(evt, tabName) {
	stopVideo()	
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabContent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tab");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

	filters = document.getElementsByClassName("work_filters");
	for (i = 0; i < filters.length; i++) {
		filters[i].style.display = tabName === "work_pieces" ? "block" : "none";
	}
	

}

// INIT

// Show all the pieces of work at init
filterWork("all");

// Set default language to English
document.body.className='en'

// Show pieces of work
document.getElementById('work_pieces').style.display = "block";

var unmutedBtns = document.getElementsByClassName("button-mute");
for (var i =0; i< unmutedBtns.length; i++){
	unmutedBtns[i].style.display = "none";
}

initCanvas();