// Get the video
var video = document.getElementById("myVideo");

// Get the buttons
// var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
// var fullScreenButton = document.getElementById("full-screen");
// var playVideoBtn = document.getElementById("play-video");

// Sliders
// var seekBar = document.getElementById("seek-bar");
// var volumeBar = document.getElementById("volume-bar");


// Audio
var audio = document.getElementById("audio");
// var volumeBarAudio = document.getElementById("volume-bar-audio");
// var seekBarAudio = document.getElementById("seek-bar-audio");
// var playAudioBtn = document.getElementById("play-audio");


//Media
var volumeBar = document.getElementById("volume-bar");
var seekBar = document.getElementById("seek-bar");
var playBtn = document.getElementById("play");
var fullScreenButton = document.getElementById("full-screen");


// Oscillator
var canvasID = null;
var canvasAnimationID = null;

function play(videoName, audioName, canvas) {
	isSourceEmpty = video.getAttribute('src') === "" && audio.getAttribute('src') === ""
	
	if (!audio.paused) {
		stop();
	}

	if (video.getAttribute('src') === "" && audio.getAttribute('src') === "") {
		video.setAttribute("src", './video/' + videoName + '.mp4')
		video.load();

		audio.setAttribute("src", './sound/' + audioName + '.mp3')
		audio.load();

		document.getElementById("controls").style.display = "block";
		playBtn.classList.add("paused");
	}
	
	if (playBtn.classList.contains('paused') && !videoName && !audioName) {
		video.pause();
		audio.pause();
		return
	}
	video.play();
	
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
	video.setAttribute("src", "");
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



// //-------------------VIDEO
// fullScreenButton.addEventListener("click", function() {
//   if (video.requestFullscreen) {
//     video.requestFullscreen();
//   } else if (video.mozRequestFullScreen) {
//     video.mozRequestFullScreen(); // Firefox
//   } else if (video.webkitRequestFullscreen) {
//     video.webkitRequestFullscreen(); // Chrome and Safari
//   }
// });

// seekBar.addEventListener("change", function() {
//   // Calculate the new time
//   var time = video.duration * (seekBar.value / 100);

//   // Update the video time
//   video.currentTime = time;
// });

// // Update the seek bar as the video plays
// video.addEventListener("timeupdate", function() {
//   // Calculate the slider value
//   var value = (100 / video.duration) * video.currentTime;

//   // Update the slider value
//   seekBar.value = value;
// });

// // Event listener for the volume bar
// volumeBar.addEventListener("change", function() {
//   // Update the video volume
//   video.volume = volumeBar.value;
// });



// // Play the video
// function playVideo(videoName) {
// 	document.getElementById("a-controls").style.display = "none";
// 	stopAudio();

// 	if (video.getAttribute('src') === "") {
// 		video.setAttribute("src", './video/' + videoName + '.mp4')
// 		video.load();
// 		document.getElementById("v-controls").style.display = "block";
// 		playVideoBtn.classList.add("paused");

// 	}
// 	else if (playVideoBtn.classList.contains('paused') && !videoName) {
// 		video.pause();
// 		return
// 	}
// 	video.play();

// };

// function pauseVideo(){
// 	video.pause();

// }

// function stopVideo() {
// 	video.pause();
// 	video.setAttribute("src", "");
// 	video.load();
// 	document.getElementById("v-controls").style.display = "none";
// }

// // -------------------------------------- AUDIO

// function playAudio(audioName) {
// 	document.getElementById("v-controls").style.display = "none";
// 	stopVideo();

// 	if (audio.getAttribute('src') === "") {
// 		audio.setAttribute("src", './sound/' + audioName + '.mp3')
// 		audio.load();
// 		document.getElementById("a-controls").style.display = "block";
// 		playAudioBtn.classList.add("paused");
// 	}
// 	else if (playAudioBtn.classList.contains('paused') && !audioName) {
// 		audio.pause();
// 		return
// 	}
	
// 	playOscilator();

// }

function playOscilator(){
	var context = new AudioContext(window.AudioContext || window.webkitAudioContext);
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
	src.connect(analyser);
    analyser.connect(context.destination);

    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext("2d");

    analyser.fftSize = 64;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

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

		if(audio.paused || audio.getAttribute('src') === ""){
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

    var dataArray = [50, 60, 75, 123, 150, 177,199, 180, 190, 188,195, 200,190,195,200,200,200,200,150,160,165,177,177,177,180,177,133,120,105,99,80,50]
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


// function pauseAudio(){
// 	audio.pause();

// }

// function stopAudio() {
// 	audio.pause();
// 	audio.setAttribute("src", "");
// 	audio.load();
// 	document.getElementById("a-controls").style.display = "none";
// }

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

// volumeBarAudio.addEventListener("change", function() {
//   // Update the video volume
// 	audio.volume = volumeBarAudio.value;
// });


// seekBarAudio.addEventListener("change", function() {
//   // Calculate the new time
// 	var time = audio.duration * (seekBarAudio.value / 100);

//   // Update the video time
//  	audio.currentTime = time;
// });

// // Update the seek bar as the video plays
// audio.addEventListener("timeupdate", function() {
//   // Calculate the slider value
//   	var value = (100 / audio.duration) * audio.currentTime;

//   // Update the slider value
//   	seekBarAudio.value = value;
// });

// playAudioBtn.addEventListener("click", function() {
// 	playAudioBtn.classList.toggle("paused");
// 	return false;
// });

// playVideoBtn.addEventListener("click", function() {
// 	playVideoBtn.classList.toggle("paused");
// 	return false;
// });



var unmutedBtns = document.getElementsByClassName("button-mute");
for (var i =0; i< unmutedBtns.length; i++){
	unmutedBtns[i].style.display = "none";
}

initAllCanvas();