"use strict";

class App {
	constructor(data) {
		data = data || {};
		
		this.title = data.title || null;
		this.publisher = data.publisher || null;
		this.price = data.price || null;
		this.version = data.version|| null;
		this.rating = data.ratings_average || null;
		this.icon_url = data.icon_url || null;
		this.priceParsed = null;
		if(!this.price) {
			this.priceParsed = "zdarma";
		}
		else {
			this.priceParsed = this.price + "€";
		}
		
		this.appBlock = null;
		
		this.selfUrl = /* data._links.self.href || */ null;
		this.serverResponse = null;
		this.datail = null;
		this.detailOpen = false;
		
		this.wrapper = null;
		
		return this;
	}

	write(wrapper) {
		if(wrapper) {
			this.wrapper = wrapper;
		}
		
		this.appBlock = document.createElement("div");
		this.appBlock.classList.add("app");
		
		if(this.icon_url) {
			let icon = document.createElement("img");
			icon.src = this.icon_url;
			icon.classList.add("icon");
			this.appBlock.appendChild(icon);
		}
		
		let head = document.createElement("div");
		head.classList.add("head");
		this.appBlock.appendChild(head);
		
		let price = document.createElement("span");
		price.classList.add("price");
		price.innerHTML = this.priceParsed;
		head.appendChild(price);
		
		let title = document.createElement("h3");
		title.classList.add("title");
		title.innerHTML = this.title;
		head.appendChild(title);
		
		let version = document.createElement("span");
		version.classList.add("version");
		version.innerHTML = "Verze " + this.version;
		head.appendChild(version);
		
		let publisher = document.createElement("span");
		publisher.classList.add("publisher");
		publisher.innerHTML = this.publisher;
		head.appendChild(publisher);
		
		let rating = document.createElement("div");
		rating.classList.add("rating");
		for(let i = 0; i < 5; i++) {
			let ratingStar = document.createElement("div");
			ratingStar.classList.add("star");
			if(i < this.rating) {
				ratingStar.classList.add("active");
			}
			rating.appendChild(ratingStar);
		}
		head.appendChild(rating);
		
		/*
		(function(instance) {
			instance.appBlock.classList.add("clickable");
			instance.appBlock.addEventListener("click", function() {
				instance.getDetail();
			});
		})(this);
		*/
		return this;
	}
	
	getDetail() {
		if(this.selfUrl && !this.detailOpen) {
			(function(instance) {
				instance.detailOpen = true;
				let appDetailContainer = document.createElement("div");
				appDetailContainer.classList.add("app-detail-container");
				if(instance.wrapper) {
					instance.wrapper.classList.add("app-detail-preview");
					instance.wrapper.appendChild(appDetailContainer);
				}
				else {
					instance.appBlock.appendChild(appDetailContainer);
				}
				
				let close = document.createElement("div");
				close.classList.add("close");
				close.title = "Zavřít";
				close.innerHTML = "X";
				close.addEventListener("click", function(event) {
					appDetailContainer.remove();
					if(instance.wrapper) {
						instance.wrapper.classList.remove("app-detail-preview");
					}
					instance.detailOpen = false;
					event.stopPropagation();
				});
				appDetailContainer.appendChild(close);
				
				let loadingOverlay = document.createElement("div");
				loadingOverlay.classList.add("loading-overlay");
				appDetailContainer.appendChild(loadingOverlay);
				
				let xml = new XMLHttpRequest();
				console.log(instance.selfUrl);
				xml.open("GET", instance.selfUrl, true);
				xml.onreadystatechange = function() {
					if(loadingOverlay.parentNode == appDetailContainer) {
						appDetailContainer.removeChild(loadingOverlay);
					}
					
					if(xml.readyState != 4) {
						return;
					}
					
					instance.serverResponse = JSON.parse(xml.responseText);
					if(instance.serverResponse && instance.serverResponse.result !== "error") {
						let appDetail = document.createElement("div");
						appDetail.classList.add("app-detail");
						appDetailContainer.appendChild(appDetail);
						
						if(instance.icon_url) {
							let icon = document.createElement("img");
							icon.src = instance.icon_url;
							icon.classList.add("icon");
							appDetail.appendChild(icon);
						}
						
						let title = document.createElement("h2");
						title.classList.add("title");
						title.innerHTML = instance.title;
						appDetail.appendChild(title);
						
						if(instance.serverResponse.description) {
							let description = document.createElement("pre");
							description.classList.add("description");
							description.innerHTML = (instance.serverResponse.description);
							appDetail.appendChild(description);
						}
						
						if(instance.serverResponse.screenshot_urls.length > 0) {
							let screenshots = document.createElement("div");
							screenshots.classList.add("screenshots");
							appDetail.appendChild(screenshots);
							for(let i = 0; i < instance.serverResponse.screenshot_urls.length; i++) {
								let screenshot = document.createElement("img");
								screenshot.src = (instance.serverResponse.screenshot_urls[i]);
								screenshots.appendChild(screenshot);
							}
						}
					}
				};
				xml.send(null);
			})(this);
		}
		return this;
	}
}

class AppContainer {
	constructor(data) {
		data = data || null;
		if(!data) {
			return false;
		}
		
		this.wrapper = data.wrapper;
		this.navigation = null;
		this.url = data.url;
		this.serverResponse = null;
		this.scroll = data.scroll || false;
		this.successCounter = data.successCounter || 0;
		return this;
	}
	
	navigationItem(data) {
		data = data || null;
		if(data) {
			if(data.togo && data.togo.href && data.togo.href != data.self.href) {
				let linkItem = document.createElement("div");
				linkItem.innerHTML = data.text;
				(function(instance, url) {
					linkItem.addEventListener("click", function() {
						instance.renderApps(url);
					});
				})(this, data.togo.href);
				this.navigation.appendChild(linkItem);
				return linkItem;
			}
		}
		return null;
	}
	
	renderApps(url) {
		let loadingOverlay = document.createElement("div");
		loadingOverlay.classList.add("loading-overlay");
		this.wrapper.appendChild(loadingOverlay);
		
		(function(instance, url) {
			let requestUrl = url || instance.url;
			let xml = new XMLHttpRequest();
			xml.open("GET", requestUrl, true);
			xml.addEventListener("error", function(event) {
				if(loadingOverlay.parentNode == instance.wrapper) {
					instance.wrapper.removeChild(loadingOverlay);
				}
				return;
			});
			xml.addEventListener("load", function(event) {
				instance.wrapper.innerHTML = "";
				instance.serverResponse = JSON.parse(xml.responseText);
				
				let form = document.createElement("form");
				form.classList.add("search-app");
				let input = document.createElement("input");
				input.classList.add("search");
				form.appendChild(input);
				let search = document.createElement("input");
				search.type = "submit";
				search.value = "Vyhledat v obchodě Ubuntu";
				form.appendChild(search);
				form.addEventListener("submit", function(event) {
					let snap = requestUrl.match(/(\/snaps)\//);
					let url = "https://search.apps.ubuntu.com/api/v1" + (snap ? snap[0] : "") + "/search?q=" + input.value;
					let localUrl = "remoteContent/get-remote-content.php?remote-url=" + encodeURIComponent(url);
					instance.renderApps(localUrl);
					event.preventDefault();
				});
				instance.wrapper.appendChild(form);
				
				
				let embedded = instance.serverResponse["_embedded"];
				let empty = true;
				if(embedded) {
					let packages = embedded["clickindex:package"];
					if(packages) {
						let appList = document.createElement("div");
						appList.classList.add("app-list");
						for(let i = 0; i < packages.length; i++) {
							let appWrapper = document.createElement("div");
							appWrapper.classList.add("app-wrapper");
							let app = new App(packages[i]).write(instance.wrapper);
							appWrapper.appendChild(app.appBlock);
							appList.appendChild(appWrapper);
						}
						instance.wrapper.appendChild(appList);
						empty = false;
					}
				}
				
				let links = instance.serverResponse["_links"] || {};
				if(empty) {
					if(instance.succesCounter < 2) {
						instance.succesCounter++;
						let appsLink = links.prev ? links.prev.href : (links.next ? links.next.href : (links.first ? links.first.href : ""));
						instance.renderApps();
						return true;
					}
					return false;
				}
				
				if(links.self && links.self.href) {
					instance.navigation = document.createElement("div");
					instance.navigation.classList.add("navigation");
					instance.navigationItem({
						text: "Začátek",
						self: links.self,
						togo: links.first
					});
					instance.navigationItem({
						text: "←",
						self: links.self,
						togo: links.prev
					});
					instance.navigationItem({
						text: "→",
						self: links.self,
						togo: links.next
					});
					instance.navigationItem({
						text: "Konec",
						self: links.self,
						togo: links.last
					});
					instance.wrapper.appendChild(instance.navigation);
				}
				
				if(this.scroll) {
					instance.wrapper.scrollIntoView(true);
				}
			});
			xml.send(null);
		})(this, url);
	}
}
