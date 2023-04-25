let birdMap = {};

function fileBirdSequence(_label) {
	fetch("sets/" + _label + ".json")
    .then((response) => response.json())
    .then((json) => birdMap[_label] = json);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

function buildBirdSequence(_label, _el, _mirror, _props, _positioner, _scaleset) {
	let birds = [];
	let sc = _props ? _props.scale:1.25;
	let j = birdMap[_label];
	//Create the main div
	let birdDiv = document.createElement("div");
	birdDiv.className = "birdCage";
	birdDiv.id = _label;


	if (_props.offset.indexOf("px") == -1) {
		console.log("BUILD");
		
		let holder = document.querySelector("#" + _props.offset);
		console.log(getOffset(holder).top);
		birdDiv.style.top = getOffset(holder).top + "px";
	} else {
		birdDiv.style.top = _props.offset;
	}
	for (let i = 0; i < Math.min(j.birds.length, 10); i++) {
		//Place the bird images
		let img = makeBird(j.birds[i], sc, _label);
		if (_scaleset) img.style.scale = _scaleset[i];
		birds.push(img);
		birdDiv.appendChild(img);
	}
	_el.appendChild(birdDiv);

	if (_positioner) _positioner(birds, _props);

	console.log("#" + _label + " .birdy");
	//Animate
	anime({
		targets: ".birdy",
		opacity:1,
		rotation:180,
		delay: anime.stagger(100)
	}).play();
}	


function mirror(_birds, _props) {
	for (let i = 0; i < _birds.length; i+=2) {
		let leftBird = _birds[i];
		let rightBird = _birds[i + 1];
		console.log(leftBird);
		let xOff = i * _props.space ;
		leftBird.style.right = (44 - xOff) + "vw";
		rightBird.style.left = (44 - xOff) + "vw";
		rightBird.style["z-index"] = _props.zoff + (100 - i);
		leftBird.style["z-index"] =  _props.zoff + (99 - i);
		rightBird.classList.add("flip");
		leftBird.style.width = leftBird.style.height = (_props.size - (i * _props.fade ) )+ "px";
		rightBird.style.width = rightBird.style.height = (_props.size - (i * _props.fade) )+ "px";
		leftBird.style.opacity = 0;
		rightBird.style.opacity = 0;

		if (_props.bw) {
			leftBird.classList.add("bw");
			rightBird.classList.add("bw");

		}
	}
}

function centerSpread(_birds, _props) {
	let fullWidth = _birds.length * _props.space;
	for (let i = 0; i < _birds.length; i++) {
		let bird = _birds[i];
		let xOff = i * _props.space;
		bird.style.left = (xOff + (100 - fullWidth)/2) + "vw";
		bird.style["z-index"] =  _props.zoff + (99 + i);
		bird.style.width = bird.style.height = (_props.size - (i * _props.fade ) )+ "px";
		bird.style.opacity = 0;
		bird.style["vertical-align"] = "bottom"; 
	}
}

function makeBird(bird, sc, label) {

		let bd = document.createElement("div");
		let img = document.createElement("img");
		img.setAttribute("src", "images/" + bird.type + "/" + bird.img);
		bd.style.scale = sc;
		if (bird.name) img.setAttribute("alt", bird.name);
		bd.className = "birdy";
		bd.appendChild(img);
		return(bd);
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

fileBirdSequence("pairs_ Greater Roadrunner_30");
fileBirdSequence("pairs_ Bald Eagle (Immature, juvenile)_30");
fileBirdSequence("pairs_ Black-throated Blue Warbler (FemaleImmature male)_30");
fileBirdSequence("pairs_ Indigo Bunting (Adult Male)_30");
fileBirdSequence("pairs_ Summer Tanager (Adult Male)_30");
fileBirdSequence("pairs_ Western Tanager (Breeding Male)_30");
fileBirdSequence("pairs_docs");
fileBirdSequence("pairs_");
fileBirdSequence("pairs_13940679");
fileBirdSequence("pairs_12994082");
fileBirdSequence("pairs_13940681");
fileBirdSequence("pairs_ Downy Woodpecker_30");
fileBirdSequence("wire_ Painted Bunting (Adult Male)_10");
fileBirdSequence("wire_ Vermilion Flycatcher (Adult male)_6")

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
					
					buildBirdSequence("pairs_13940681", cage,  true, {size:300, scale:3, position:"bottom", offset:"0px", space:8, fade:3, zoff:0, bw:true}, mirror);
					buildBirdSequence("pairs_ Indigo Bunting (Adult Male)_30", cage,  true, {size:300, scale:1.2, position:"top", offset:"50px", space:4, fade:10, zoff:100}, mirror);

					break;
				case 1:
					buildBirdSequence("wire_ Vermilion Flycatcher (Adult male)_6", document.body, false, {size:400, scale:1., position:"bottom", offset:"woodpeckers", space:4, fade:0}, centerSpread, [1, 0.475, 0.27, 0.23, 0.23, 0.09]);
					break;

			}
		}

		function handleStepExit(response) {
			// response = { element, direction, index }
			console.log("EXIT" + response.index);
			switch(response.index) {
				case 0:
					//clearBirdSequence("pairs_ Black-throated Blue Warbler (FemaleImmature male)_30");
					hideHeader(true);
					break;
				case 1:
					//clearBirdSequence("pairs_ Greater Roadrunner_30");
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












