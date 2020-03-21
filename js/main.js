// Get the video
var video = document.getElementById("myVideo");

// Get the buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");

// Sliders
var seekBar = document.getElementById("seek-bar");
var volumeBar = document.getElementById("volume-bar");


// Audio
 var audio = document.getElementById("audio");

// Play the video
function playVideo(videoName) {
	if (video.getAttribute('src') === "") {
		video.setAttribute("src", './video/' + videoName + '.mp4')
		video.load();
		document.getElementById("v-controls").style.display = "block";

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

muteButton.addEventListener("click", function() {
  if (video.muted == false) {
    video.muted = true;
    muteButton.innerHTML = "Unmute";

  } else {
    video.muted = false;
    muteButton.innerHTML = "Mute";

  }
});

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


function playAudio(audioName) {
	audio.setAttribute("src", './sound/' + audioName + '.mp3')
	audio.load();
    audio.play();

    var context = new AudioContext(window.AudioContext || window.webkitAudioContext);
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
	src.connect(analyser);
    analyser.connect(context.destination);

    var canvas = document.getElementById("canvas");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
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
        barHeight = (HEIGHT/255) * dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();

}



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
}

// INIT

// Show all the pieces of work at init
filterWork("all");

// Set default language to English
document.body.className='en'

// Show pieces of work
document.getElementById('work_pieces').style.display = "block";