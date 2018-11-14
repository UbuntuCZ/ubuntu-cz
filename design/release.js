"use strict";

class Release {
	constructor(data) {
		data = data || {};
		
		this.type = data.type || "desktop";
		this.version = data.version || "18.04";
		this.arch = data.arch || "amd64";
		this.url = data.url || "remoteContent/release.php";
		this.xml = null;
		this.object = null;
		
		this.init();
		
		this.translator = data.translator || new ENCZTranslator();

		return this;
	}
	
	init() {
		this.loadData().then((response) => {
			let data = JSON.parse(response);
			
			if(this.object && data && data[this.type]) {
				let releaseTypeData = data[this.type];
				
				let currentHref = this.object.href;
				this.object.href = releaseTypeData[this.arch];
				this.object.innerText = this.object.innerText.replace(this.version, releaseTypeData.number);
				
				let date = new Date(releaseTypeData.date + " " + releaseTypeData.time);
				let options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
				let localeDateString = date.toLocaleDateString(navigator.language || navigator.userLanguage || "en-GB", options);
				
				let size = releaseTypeData.size;
				size = size.replace(/g/i, " GB");
				size = size.replace(/m/i, " MB");
				size = size.replace(/k/i, " kB");
										
				let downloadDetails = document.createElement("span");
				downloadDetails.classList.add("download-details");				
				downloadDetails.innerText = localeDateString + " (" + size + ")";
				this.object.appendChild(downloadDetails);
				
				/* Local translations - load and apply */
				if(!navigator.language || !navigator.language.match(/en/i)) {
					downloadDetails.classList.add("fade-out");
					this.translator.translate(downloadDetails.innerText).then((response) => {
						downloadDetails.innerText = response;
						downloadDetails.classList.remove("fade-out");
						downloadDetails.classList.add("fade-in");
					}).catch((error) => {
						console.error(error, "Couldn't fetch translations from Translator.js");
					});
				}
			}
		}, function(error) {
			console.error("Failed!", error);
		});
		return this;
	}
	
	appendTo(element) {
		this.object = element;
		return this;
	}
	
	loadData() {
		let url = this.url;
		if(this.version) {
			url += "?version=" + this.version;
		}
		
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			//xhr.overrideMimeType("text/xml");
			xhr.onreadystatechange = function() {
				if(this.readyState == 4) {
					if(this.status == 200) {
						resolve(this.responseText);
					}
					else {
						reject(Error(this.statusText));
					}
				}
			};
			xhr.onerror = function() {
				reject(Error("Network Error"));
			};
			xhr.open("GET", url, true);
			xhr.send();
		});
	}
}
