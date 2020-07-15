// Get the video
document.addEventListener('DOMContentLoaded', prefetchVideo);

function prefetchVideo() {
	if (window.screen.width > 480) {
		video.src = video.getAttribute('data-src');
	}
}

var video = document.getElementById("myVideo");

// Get the buttons
var muteButton = document.getElementById("mute");

// Audio
var audio = document.getElementById("audio");

//Media
var volumeBar = document.getElementById("volume-bar");
var seekBar = document.getElementById("seek-bar");
var playBtn = document.getElementById("play");
var fullScreenButton = document.getElementById("full-screen");

// Oscillator
var canvasID = "";
var canvasAnimationID = "";
var context = '';
var analyser = '';

function play(videoName, audioName, canvas) {
	isSourceEmpty = audio.getAttribute('src') === ""
	isVideoSourceEmpty = video.getAttribute('src') === ""
	isCanvasDifferent = canvas && canvas != canvasID;
	
	// Pause video and audio
	if (playBtn.classList.contains('paused') && !audioName) {
		video.pause();
		audio.pause();
		return
	}

	// If the audio is playing and clicked play on different audio then stop
	if (!audio.paused && isCanvasDifferent) {
		stop();
	}

	// If no src of audio & video or src is changing
	if (isSourceEmpty || isCanvasDifferent) {
		// video.setAttribute("src", './video/' + videoName + '.mp4')
		// video.load();

		audio.setAttribute("src", './sound/' + audioName + '.mp3')
		audio.load();

		document.getElementById("controls").style.display = "block";
		playBtn.classList.add("paused");
	}
	
	if(!isVideoSourceEmpty){
		video.load();
		video.play();
	}
	
	if (canvas) {
		canvasID = canvas;
	}
	playOscilator();

};

function pause() {
	audio.pause();
};

function stop() {
	video.pause();
	// video.setAttribute("src", "");
	video.load();

	audio.pause();
	audio.setAttribute("src", "");
	audio.load();

	canvasID = null;
	document.getElementById("controls").style.display = "none";
};

// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
  // Update the video volume
  audio.volume = volumeBar.value;
});

fullScreenButton.addEventListener("click", function() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome and Safari
  } else if (video.msRequestFullscreen) {
	video.msRequestFullscreen();
  }
});


seekBar.addEventListener("change", function() {
  // Calculate the new time
	var time = audio.duration * (seekBar.value / 100);

  // Update the video time
 	audio.currentTime = time;
});

// Update the seek bar as the video plays
audio.addEventListener("timeupdate", function() {
  // Calculate the slider value
  	var value = (100 / audio.duration) * audio.currentTime;

  // Update the slider value
  	seekBar.value = value;
});

playBtn.addEventListener("click", function() {
	playBtn.classList.toggle("paused");
	return false;
});

audio.onended = function() {

	video.pause();
	video.load();

	playBtn.classList.toggle("paused");
	seekBar.value = 0;
	audio.currentTime = 0;
	initCanvas(document.getElementById(canvasID));
}; 


function playOscilator(){
	if (!context){
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		context = context || new AudioContext();
		var src = src || context.createMediaElementSource(audio);

	    analyser = context.createAnalyser();
		src.connect(analyser);
	    analyser.connect(context.destination);
	}

    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext("2d");

    analyser.fftSize = 64;

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

	var barWidth = ((WIDTH) / (2*bufferLength)) ;
    var barHeight;
    var x = 0;

    function renderFrame() {
		renderId = requestAnimationFrame(renderFrame);
		WIDTH = canvas.width;
		canvas.width = WIDTH;
		x = 0;

		analyser.getByteFrequencyData(dataArray);

		ctx.fillStyle = "rgba(255, 255, 255, 0.001)";
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

		if(canvas.id !== canvasID || audio.paused || audio.getAttribute('src') === ""){
			// initCanvas(canvas);
			cancelAnimationFrame(renderId);
		}
		return renderId;
    }

    audio.play();
    canvasAnimationID = renderFrame();
}

function initCanvas(canvas){
	var canvas = canvas;
    var ctx = canvas.getContext("2d");

    var bufferLength = 32;

    var dataArray = [28, 50, 52, 56, 45, 76, 104, 96, 146, 184, 156, 100, 70, 66, 70, 64, 60, 54, 50, 55, 50, 52, 76, 88, 72, 48, 36, 30, 24, 18, 16, 8]
    var WIDTH = canvas.width;
    canvas.width = WIDTH;
    var HEIGHT = canvas.height;

    var barWidth = ((WIDTH) / (2*bufferLength)) ;
    var barHeight;
    var x = 0;

	WIDTH = canvas.width;

	ctx.fillStyle = "rgba(255, 255, 255, 0.001)";
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

function initAllCanvas(){
	var canvases = document.getElementsByClassName("canvas");
	for (var c=0; c< canvases.length; c++){
		initCanvas(canvases[c]);
	}
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

	changeMute(ismute);
}

var unmutedBtns = document.getElementsByClassName("button-mute");
for (var i =0; i< unmutedBtns.length; i++){
	unmutedBtns[i].style.display = "none";
}

initAllCanvas();