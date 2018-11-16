"use strict";

class Release {
	constructor(data) {
		data = data || {};
		
		this.type = data.type || "desktop";
		this.version = data.version || "18.04";
		this.arch = data.arch || "amd64";
		this.url = data.url || "remoteContent/release.php";
		this.old = data.old || false;
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
				this.initialObjectText = this.initialObjectText || this.object.innerText;
				this.object.innerText = this.initialObjectText.replace(this.version, releaseTypeData.number);
				
				let date = new Date(releaseTypeData.date + " " + releaseTypeData.time);
				let options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
				let localeDateString = date.toLocaleDateString(navigator.language || navigator.userLanguage || "en-GB", options);
				
				let size = releaseTypeData.size;
				size = size.replace(/g/i, " GB");
				size = size.replace(/m/i, " MB");
				size = size.replace(/k/i, " kB");
				
				this.downloadDetails = this.downloadDetails || document.createElement("span");
				this.downloadDetails.classList.add("download-details");
				this.downloadDetails.innerText = localeDateString + " (" + size + ")";
				this.object.appendChild(this.downloadDetails);
				
				/* Local translations - load and apply */
				if(!navigator.language || !navigator.language.match(/en/i)) {
					this.downloadDetails.classList.add("fade-out");
					this.translator.translate(this.downloadDetails.innerText).then((response) => {
						this.downloadDetails.innerText = response;
						this.downloadDetails.classList.remove("fade-out");
						this.downloadDetails.classList.add("fade-in");
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
	
	refresh(data) {
		data = data || {};
		
		this.type = data.type || this.type;
		this.version = data.version || this.version;
		this.arch = data.arch || this.arch;
		this.url = data.url || this.url;
		this.old = data.old || this.old;
		
		this.init();
		return this;
	}
	
	loadData() {
		let url = this.url;
		if(this.version) {
			url += "?version=" + this.version;
		}
		if(this.old) {
			if(url.match(/\?/)) {
				url += "&old";
			}
			else {
				url += "?old";
			}
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
