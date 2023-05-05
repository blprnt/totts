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

function buildBirdSequence(_label, _el, _mirror, _props, _positioner, _scaleset, _annotations) {
	let birds = [];
	let sc = _props ? _props.scale:1.25;
	let j = birdMap[_label];
	//Create the main div
	let birdDiv = document.createElement("div");
	birdDiv.className = "birdCage";
	birdDiv.id = _label;
	if (_props.reverse) {
		j.birds.reverse();
	}

	if (_props.overflow) {
		birdDiv.style.overflow = "hidden";
	}

	if (_props.offset.indexOf("px") == -1) {
		console.log("BUILDY BUILD");
		console.log("#" + _props.offset);
		
		let holder = document.querySelector("#" + _props.offset);
		birdDiv.style.top = ((_props.ybump ? _props.ybump:0) + getOffset(holder).top) + "px";
	} else {
		birdDiv.style.top = _props.offset;
	}


	let doubleTest = [];
	let deDubbed = [];

	for (let i = 0; i < Math.min(j.birds.length, 100); i++) {
		if (!doubleTest[j.birds[i].img]) {
			//Place the bird images
			let img = makeBird(j.birds[i], sc, _label);
			if (_scaleset) img.style.scale = _scaleset[i];
			birds.push(img);
			birdDiv.appendChild(img);
			if (_annotations && _annotations[i]) {
				annotate(img, _annotations[i]);
			}
			doubleTest[j.birds[i].img] = true;
			//deDubbed.push(birds[i]);
		}
	}
	_el.appendChild(birdDiv);

	if (_positioner) _positioner(birds, _props);



	console.log("#" + _label + " .birdy");
	//Animate
	anime({
		targets: ".birdy",
		opacity:1,
		rotation:180,
		delay: anime.stagger(50)
	}).play();
}	


function mirror(_birds, _props) {
	for (let i = 0; i < _birds.length; i+=2) {
		try {
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
		} catch (_e) {

		}
	}
}

function centerSpread(_birds, _props) {
	let fullWidth = _birds.length * _props.space;
	for (let i = 0; i < _birds.length; i++) {
		let bird = _birds[i];
		let xOff = i * _props.space;
		bird.style.left = (xOff + (50 - (fullWidth))) + "vw";
		bird.style["z-index"] =  _props.zoff + (99 + i);
		bird.style.width = bird.style.height = (_props.size - (i * _props.fade ) )+ "px";
		bird.style.opacity = 0;
		bird.style["vertical-align"] = "bottom"; 
	}
}

function annotate(_target, _obj) {
	//_obj = 
	let r = _target.querySelector("img").getBoundingClientRect();
	let d = document.createElement("div");
	d.classList.add("diagonal");
	d.style.top = _obj.start.y + "px";
	d.style.left = _obj.start.x + "px";
	d.style.width = (_obj.end.x - _obj.start.x) + "px";
	d.style.height = (_obj.end.y - _obj.start.y) + "px";
	console.log(_target.style.scale);
	d.style.scale = 1.0 / _target.style.scale;
	let td = document.createElement("div");
	td.innerHTML = _obj.label;
	td.classList.add("annotation");
	td.style.top = d.style.top;
	td.style.left = d.style.right;
	d.appendChild(td);
	_target.appendChild(d);

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


fileBirdSequence("pairs_12570889");
fileBirdSequence("pairs_15206521");
fileBirdSequence("pairs_6926887");
fileBirdSequence("pairs_13940681");
fileBirdSequence("pairs_9953409");
fileBirdSequence("pairs_9953415");
fileBirdSequence("wire_ Vermilion Flycatcher (Adult male)_6");
fileBirdSequence("pairs_ Indigo Bunting (Adult Male)_30");

let start = setInterval(initBirds, 1000);


/**********************************
Scrolling stuff
***************/

function hideHeader(hide, _instant) {
	console.log("Hide header");
	
	anime({
		targets:".header",
		height:(hide ? 0:54) +"vh",
		duration:(_instant? 1:800),
		easing: "easeOutQuad" 
	})

}

window.onload = function() {
	console.log("LOADED");
	console.log(window.scrollY);
	
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
					
					buildBirdSequence("pairs_13940681", cage,  true, {size:300, scale:2.5, position:"bottom", offset:"0px", space:7, fade:2, zoff:0, bw:true, overflow:true}, mirror);
					buildBirdSequence("pairs_ Indigo Bunting (Adult Male)_30", cage,  true, {size:300, scale:1.2, position:"top", offset:"50px", space:4, fade:10, zoff:100}, mirror);

					break;
				case 1:
					buildBirdSequence("wire_ Vermilion Flycatcher (Adult male)_6", document.body, false, {size:400, scale:1., position:"bottom", offset:"LAION", ybump:100, space:6, fade:0}, centerSpread, [1, 0.475, 0.27, 0.23, 0.23, 0.09],
						[{
							start:{x:80, y:-50},
							end:{x:130, y:80},
							label:"SmugMug: 18%.5"
						},{
							start:{x:80, y:-50},
							end:{x:100, y:100},
							label:"WordPress: 8.8%"
						},{
							start:{x:90, y:-50},
							end:{x:100, y:0},
							label:"Flickr: 5%"
						},{
							start:{x:110, y:-20},
							end:{x:130, y:50},
							label:"PBase.com: 4.3%"
						},{
							start:{x:130, y:-60},
							end:{x:150, y:40},
							label:"Fine Art America: 4.2%"
						}
						]
						);
					break;
				case 2:
					buildBirdSequence("pairs_12570889", document.body,  true, {size:300, scale:1, position:"bottom", offset:"imagenetCollage", space:1, fade:1, zoff:0, bw:false, overflow:true, reverse:false}, mirror);



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
			if (window.scrollY > 0) {
				hideHeader(true, true);
			}
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












