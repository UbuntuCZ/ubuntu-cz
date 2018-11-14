var defaultAppPageDest = typeof defaultAppPage != "undefined" ? defaultAppPage : null;
(function(window) {
	var App = function(data) {
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
		return this;
	}
	
	App.prototype.write = function() {
		var app = document.createElement("div");
		app.className = "app";
		
		if(this.icon_url) {
			var icon = document.createElement("img");
			icon.src = this.icon_url;
			app.appendChild(icon);
		}
		
		var head = document.createElement("div");
		head.className = "head";
		app.appendChild(head);
		
		var price = document.createElement("span");
		price.className = "price";
		price.innerHTML = this.priceParsed;
		head.appendChild(price);
		
		var title = document.createElement("h3");
		title.className = "title";
		title.innerHTML = this.title;
		head.appendChild(title);
		
		var version = document.createElement("span");
		version.className = "version";
		version.innerHTML = "Verze " + this.version;
		head.appendChild(version);
		
		var publisher = document.createElement("span");
		publisher.className = "publisher";
		publisher.innerHTML = this.publisher;
		head.appendChild(publisher);
		
		var rating = document.createElement("div");
		rating.className = "rating";
		for(var i = 0; i < 5; i++) {
			var ratingStar = document.createElement("div");
			ratingStar.className = "star";
			if(i < this.rating) {
				ratingStar.className += " active";
			}
			rating.appendChild(ratingStar);
		}
		head.appendChild(rating);
		
		return app;
	};
	
	function navigationItem(data) {
		var data = data || null;
		if(data) {
			if(data.togo && data.togo.href && data.togo.href != data.self.href) {
				var linkItem = document.createElement("div");
				linkItem.innerHTML = data.text;
				(function(linkItem, wrapper, url) {
					linkItem.addEventListener("click", function() {
						renderApps(wrapper, url, {scroll: true});
					});
				})(linkItem, data.wrapper, data.togo.href);
				data.container.appendChild(linkItem);
				return linkItem;
			}
		}
		return null;
	}
	
	function renderApps(wrapper, url, data) {
		var data = data || {};
		(function(wrapper, url, data) {
			var loadingOverlay = document.createElement("div");
			loadingOverlay.className = "loading-overlay";
			wrapper.appendChild(loadingOverlay);
			
			var xml = new XMLHttpRequest();
			xml.open("GET", url, true);
			xml.onreadystatechange = function() {
				if(xml.readyState != 4) {
					if(loadingOverlay.parentNode == wrapper) {
						wrapper.removeChild(loadingOverlay);
					}
					return;
				}
				wrapper.innerHTML = "";
				var serverResponse = JSON.parse(xml.responseText);
				
				var form = document.createElement("form");
				form.className = "search-app";
				var input = document.createElement("input");
				input.className = "search";
				form.appendChild(input);
				var search = document.createElement("input");
				search.type = "submit";
				search.value = "Vyhledat v obchodě Ubuntu";
				form.appendChild(search);
				form.addEventListener("submit", function(event) {
					var snap = url.match(/(\/snaps)\//);
					renderApps(wrapper, "https://search.apps.ubuntu.com/api/v1" + (snap ? snap[0] : "") + "/search?q=" + input.value);
					event.preventDefault();
				});
				wrapper.appendChild(form);
				
				
				var embedded = serverResponse["_embedded"];
				var empty = true;
				if(embedded) {
					var packages = embedded["clickindex:package"];
					if(packages) {
						var appList = document.createElement("div");
						appList.className = "app-list";
						for(key in packages) {
							var appWrapper = document.createElement("div");
							appWrapper.className = "app-wrapper";
							var app = new App(packages[key]);
							appWrapper.appendChild(app.write());
							appList.appendChild(appWrapper);
						}
						wrapper.appendChild(appList);
						empty = false;
					}
				}
				
				var links = serverResponse["_links"];
				if(empty) {
					if(data && (!data.succesCounter || data.succesCounter < 2)) {
						var succesCounter = data.succesCounter ? data.succesCounter + 1 : 1;
						var appsLink = links.prev ? links.prev.href : (links.next ? links.next.href : (links.first ? links.first.href : ""));
						renderApps(wrapper, appsLink, {
							scroll: true,
							succesCounter: succesCounter
						});
						return true;
					}
					return false;
				}
				
				if(links.self && links.self.href) {
					var navigation = document.createElement("div");
					navigation.className = "navigation";
					navigationItem({
						wrapper: wrapper,
						container: navigation,
						text: "Začátek",
						self: links.self,
						togo: links.first
					});
					navigationItem({
						wrapper: wrapper,
						container: navigation,
						text: "←",
						self: links.self,
						togo: links.prev
					});
					navigationItem({
						wrapper: wrapper,
						container: navigation,
						text: "→",
						self: links.self,
						togo: links.next
					});
					navigationItem({
						wrapper: wrapper,
						container: navigation,
						text: "Konec",
						self: links.self,
						togo: links.last
					});
					wrapper.appendChild(navigation);
				}
				
				if(data && data.scroll) {
					wrapper.scrollIntoView(true);
				}
			};
			xml.send(null);
		})(wrapper, url, data);
	}
	
	function appList(wrapper, url) {
		if(!wrapper) {
			return;
		}
		renderApps(wrapper, url);
	}
	
	if(defaultAppPageDest) {
		window.addEventListener("load", function() {
			appList(document.getElementById("store"), defaultAppPageDest);
		}, false);
	}
})(window);
