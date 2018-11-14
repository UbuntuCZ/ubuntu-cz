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
		
		this.selfUrl = data._links.self.href || null;
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
			var icon = document.createElement("img");
			icon.src = this.icon_url;
			icon.classList.add("icon");
			this.appBlock.appendChild(icon);
		}
		
		var head = document.createElement("div");
		head.classList.add("head");
		this.appBlock.appendChild(head);
		
		var price = document.createElement("span");
		price.classList.add("price");
		price.innerHTML = this.priceParsed;
		head.appendChild(price);
		
		var title = document.createElement("h3");
		title.classList.add("title");
		title.innerHTML = this.title;
		head.appendChild(title);
		
		var version = document.createElement("span");
		version.classList.add("version");
		version.innerHTML = "Verze " + this.version;
		head.appendChild(version);
		
		var publisher = document.createElement("span");
		publisher.classList.add("publisher");
		publisher.innerHTML = this.publisher;
		head.appendChild(publisher);
		
		var rating = document.createElement("div");
		rating.classList.add("rating");
		for(var i = 0; i < 5; i++) {
			var ratingStar = document.createElement("div");
			ratingStar.classList.add("star");
			if(i < this.rating) {
				ratingStar.classList.add("active");
			}
			rating.appendChild(ratingStar);
		}
		head.appendChild(rating);
		
		(function(instance) {
			instance.appBlock.classList.add("clickable");
			instance.appBlock.addEventListener("click", function() {
				instance.getDetail();
			});
		})(this);
		
		return this;
	}
	
	getDetail() {
		if(this.selfUrl && !this.detailOpen) {
			(function(instance) {
				instance.detailOpen = true;
				var appDetailContainer = document.createElement("div");
				appDetailContainer.classList.add("app-detail-container");
				if(instance.wrapper) {
					instance.wrapper.classList.add("app-detail-preview");
					instance.wrapper.appendChild(appDetailContainer);
				}
				else {
					instance.appBlock.appendChild(appDetailContainer);
				}
				
				var close = document.createElement("div");
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
				
				var loadingOverlay = document.createElement("div");
				loadingOverlay.classList.add("loading-overlay");
				appDetailContainer.appendChild(loadingOverlay);
				
				var xml = new XMLHttpRequest();
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
						var appDetail = document.createElement("div");
						appDetail.classList.add("app-detail");
						appDetailContainer.appendChild(appDetail);
						
						if(instance.icon_url) {
							var icon = document.createElement("img");
							icon.src = instance.icon_url;
							icon.classList.add("icon");
							appDetail.appendChild(icon);
						}
						
						var title = document.createElement("h2");
						title.classList.add("title");
						title.innerHTML = instance.title;
						appDetail.appendChild(title);
						
						if(instance.serverResponse.description) {
							var description = document.createElement("pre");
							description.classList.add("description");
							description.innerHTML = (instance.serverResponse.description);
							appDetail.appendChild(description);
						}
						
						if(instance.serverResponse.screenshot_urls.length > 0) {
							var screenshots = document.createElement("div");
							screenshots.classList.add("screenshots");
							appDetail.appendChild(screenshots);
							for(var i = 0; i < instance.serverResponse.screenshot_urls.length; i++) {
								var screenshot = document.createElement("img");
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
		var data = data || null;
		if(data) {
			if(data.togo && data.togo.href && data.togo.href != data.self.href) {
				var linkItem = document.createElement("div");
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
		var loadingOverlay = document.createElement("div");
		loadingOverlay.classList.add("loading-overlay");
		this.wrapper.appendChild(loadingOverlay);
		
		(function(instance, url) {
			var requestUrl = url || instance.url;
			var xml = new XMLHttpRequest();
			xml.open("GET", requestUrl, true);
			xml.onreadystatechange = function() {
				if(xml.readyState != 4) {
					if(loadingOverlay.parentNode == instance.wrapper) {
						instance.wrapper.removeChild(loadingOverlay);
					}
					return;
				}
				instance.wrapper.innerHTML = "";
				instance.serverResponse = JSON.parse(xml.responseText);
				
				var form = document.createElement("form");
				form.classList.add("search-app");
				var input = document.createElement("input");
				input.classList.add("search");
				form.appendChild(input);
				var search = document.createElement("input");
				search.type = "submit";
				search.value = "Vyhledat v obchodě Ubuntu";
				form.appendChild(search);
				form.addEventListener("submit", function(event) {
					var snap = requestUrl.match(/(\/snaps)\//);
					instance.renderApps("https://search.apps.ubuntu.com/api/v1" + (snap ? snap[0] : "") + "/search?q=" + input.value);
					event.preventDefault();
				});
				instance.wrapper.appendChild(form);
				
				
				var embedded = instance.serverResponse["_embedded"];
				var empty = true;
				if(embedded) {
					var packages = embedded["clickindex:package"];
					if(packages) {
						var appList = document.createElement("div");
						appList.classList.add("app-list");
						for(var i = 0; i < packages.length; i++) {
							var appWrapper = document.createElement("div");
							appWrapper.classList.add("app-wrapper");
							var app = new App(packages[i]).write(instance.wrapper);
							appWrapper.appendChild(app.appBlock);
							appList.appendChild(appWrapper);
						}
						instance.wrapper.appendChild(appList);
						empty = false;
					}
				}
				
				var links = instance.serverResponse["_links"];
				if(empty) {
					if(instance.succesCounter < 2) {
						instance.succesCounter++;
						var appsLink = links.prev ? links.prev.href : (links.next ? links.next.href : (links.first ? links.first.href : ""));
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
			};
			xml.send(null);
		})(this, url);
	}
}
