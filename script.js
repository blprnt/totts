let birdMap = {};

function fileBirdSequence(_label) {
	fetch("birds/" + _label + "/schema.json")
    .then((response) => response.json())
    .then((json) => birdMap[_label] = json);
}

function buildBirdSequence(_label, _el, _mirror, _props) {
	let sc = _props ? _props.scale:1.25;
	let j = birdMap[_label];
	//Create the main div
	let birdDiv = document.createElement("div");
	birdDiv.className = "birdCage";
	birdDiv.id = _label;

	if (_props.offset) {

		birdDiv.style.top = _props.offset;
	}
	for (let i = 0; i < j.birds.length; i++) {
		//Place the bird images
		let img = makeBird(j.birds[i], sc, _label)
		img.style.left = (((j.birds[i].properties.x * sc) * 100) )+ "%";
		if (_props.position =="bottom") {
			img.style.bottom = "10px"
		}
		img.style.opacity = 0;


		//{rotation:360, transformOrigin:"left top"}
		birdDiv.appendChild(img);
		//mirror 
		if (_mirror) {
			img = makeBird(j.birds[i], sc, _label);

			img.style.left = ((1 - (j.birds[i].properties.x * sc)) * 100)+ "%";
			if (_props.position =="bottom") {
				img.style.bottom = "10px"
			}
			img.style["transform-origin"] = "left center";
			img.style.transform = "scale(-1, 1)";
			img.style.opacity = 0;

			birdDiv.appendChild(img);
		}

	}
	_el.appendChild(birdDiv);



			anime({
				targets: "#" + _label + " .bird",
				opacity:1,
				rotation:0,
				delay: anime.stagger(30)
			}).play();
}	

function makeBird(bird, sc, label) {

		let img = document.createElement("img");
		img.setAttribute("src", "birds/" + label + "/" + bird.img);
		let w = bird.properties.width * sc * bird.properties.scale;
		let h = bird.properties.height * sc * bird.properties.scale;
		img.setAttribute("width", w);
		img.setAttribute("height", h);
		img.setAttribute("alt", bird.name);
		img.className = "bird";
		img.style.position = "absolute";
		img.style.left = (((bird.properties.x * sc) * 100) )+ "%";
		return(img);
}


function clearBirdSequence(id) {
			anime({
				targets: "#" + id + " .bird",
				opacity:0,
				rotation:0,
				delay: anime.stagger(30)
			}).play();
}


function initBirds() {
	init();
	clearInterval(start);
}

fileBirdSequence("wire_CaliforniaTowhee_15");
fileBirdSequence("wire_CaliforniaThrasher_15");
fileBirdSequence("wire_White-tailedKite_1")
fileBirdSequence("wire_PaintedBunting_1");
fileBirdSequence("wire_VermilionFlycatcher_18");

let start = setInterval(initBirds, 1000);


/**********************************
Scrolling stuff
***************/

function hideHeader(hide) {
	console.log("Hide header");
	
	anime({
		targets:".header",
		height:(hide ? 0:54) +"vh",
		duration:800,
		easing: "easeOutQuad" 
	})

}

document.querySelector(".content").scrollTop = 200;


		// initialize the scrollama
		var scroller = scrollama();

		// scrollama event handlers
		function handleStepEnter(response) {
			console.log("ENTER" + response.index);
			// response = { element, direction, index }
			let cage = document.querySelector("#headerBirds")
			switch(response.index) {
				case 0:
					hideHeader(false);
					
					buildBirdSequence("wire_CaliforniaThrasher_15", cage,  true, {scale:1.25, position:"bottom"});
					buildBirdSequence("wire_CaliforniaTowhee_15", cage, true, {scale:0.45, position:"top"});
					buildBirdSequence("wire_White-tailedKite_1", cage, true, {scale:1.4, position:"top"});
					buildBirdSequence("wire_PaintedBunting_1", cage, true, {scale:1.8, position:"top"});
					break;
				case 1:
					buildBirdSequence("wire_VermilionFlycatcher_18", cage, false, {scale:1., position:"bottom", offset:"640px"});
					break;

			}
		}

		function handleStepExit(response) {
			// response = { element, direction, index }
			console.log("EXIT" + response.index);
			switch(response.index) {
				case 0:
					clearBirdSequence("wire_CaliforniaThrasher_15");
					clearBirdSequence("wire_CaliforniaTowhee_15");
					clearBirdSequence("wire_White-tailedKite_1");
					clearBirdSequence("wire_PaintedBunting_1");
					hideHeader(true);
					break;
				case 1:
					clearBirdSequence("wire_VermilionFlycatcher_18");
					break;
			}

		}

		function init() {
			// 1. setup the scroller with the bare-bones options
			// 		this will also initialize trigger observations
			// 2. bind scrollama event handlers (this can be chained like below)
			scroller
				.setup({
					step: ".content .scrollStep",
					debug: false,
					offset: 0.5
				})
				.onStepEnter(handleStepEnter)
				.onStepExit(handleStepExit);
		}

	 	//init();












