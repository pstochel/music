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

// Modal with poster

var modal = document.getElementById("posterModal");
var modalImg = document.getElementById("poster");

function openPoster(imgSrc) {
	modal.style.display = "block";
	modalImg.src = './img/' + imgSrc;
};

function closePoster() {
	modal.style.display = "none";
};

// INIT

// Show all the pieces of work at init
filterWork("all");

// Set default language to English
document.body.className='en'

// Show pieces of work
document.getElementById('work_pieces').style.display = "block";

