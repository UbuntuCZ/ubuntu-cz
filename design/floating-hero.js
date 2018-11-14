"use strict";

function getImageInfo(img) {
	let blockSize = 5;
	let rgb = {
		r: 0,
		g: 0,
		b: 0
	};
		
	let canvas = document.createElement("canvas");
	let context = canvas.getContext && canvas.getContext("2d");
	if(!context) {
		return rgb;
	}
	
	let data = null;
	let width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
	let height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
	context.drawImage(img, 0, 0);
	
	try {
		data = context.getImageData(0, 0, width, height);
	} catch(error) {
		return defaultRGB;
	}
	
	let i = 0;
	let count = 0;
	while(i < data.data.length) {
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
		
		i += blockSize * 4;
		count++;
	}
	
	rgb.r = Math.ceil(rgb.r / count);
	rgb.g = Math.ceil(rgb.g / count);
	rgb.b = Math.ceil(rgb.b / count);
	
	return {
		color: rgb,
		width,
		height
	};
}


let fixedBackgroundContainerElements = document.querySelectorAll(".bg-container.fixed-container");
let fixedBackgroundContainers = [];
function init() {
	for(let i = 0; i < fixedBackgroundContainerElements.length; i++) {
		let bodyRect = document.body.getBoundingClientRect();
		let heroRect = fixedBackgroundContainerElements[i].getBoundingClientRect();
		let relativeTop = heroRect.top - bodyRect.top;
		let relativeBottom = heroRect.bottom - bodyRect.top - heroRect.height;
		let speed = 1.5;
		let newBgContainerElement = {
			element: fixedBackgroundContainerElements[i],
			bodyRect,
			heroRect,
			relativeTop,
			relativeBottom,
			speed,
			yTopPos: -speed * relativeTop,
			yBottomPos: -speed * relativeBottom,
			img: fixedBackgroundContainers[i] ? fixedBackgroundContainers[i].img : null
		};
		
		fixedBackgroundContainers[i] = newBgContainerElement;
		
		if(!fixedBackgroundContainers[i].img) {
			let bgImage = fixedBackgroundContainerElements[i].style.backgroundImage;
			let bgImageUrl = bgImage.substring(5, bgImage.length - 2);
			
			fixedBackgroundContainers[i].img = new Image;
			let img = fixedBackgroundContainers[i].img;
			img.addEventListener("load", (event) => {
				let data = getImageInfo(img);
				let color = data.color;
				fixedBackgroundContainerElements[i].style.backgroundColor = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
			});
			img.src = bgImageUrl;
		}
	}
}

let scrollPosition = window.scrollY;

function updatePosition() {
	for(let i = 0; i < fixedBackgroundContainers.length; i++) {
		let newScrollPosition = window.scrollY;
		let diff = newScrollPosition - scrollPosition;
		
		let moveBy = Math.ceil(fixedBackgroundContainers[i].speed * diff);
		fixedBackgroundContainers[i].yTopPos -= moveBy;
		fixedBackgroundContainers[i].yBottomPos += moveBy;							
		fixedBackgroundContainers[i].element.style.top = fixedBackgroundContainers[i].yTopPos + "px";
		fixedBackgroundContainers[i].element.style.bottom = fixedBackgroundContainers[i].yBottomPos + "px";
		scrollPosition = newScrollPosition;
	}
}

window.addEventListener("resize", (even) => {
	init();
});
window.addEventListener("scroll", (even) => {
	updatePosition();
});
updatePosition();
init();
