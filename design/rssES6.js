"use strict";

class RSSItem {
	constructor(item) {
		this.item = item || null;
		this.title = item.getElementsByTagName("title") || null;
		this.link = item.getElementsByTagName("link") || null;
		this.comments = item.getElementsByTagName("comments") || null;
		this.pubDate = item.getElementsByTagName("pubDate") || null;
		this.creator = item.getElementsByTagName("dc:creator") || null;
		this.category = item.getElementsByTagName("category") || null;
		this.description = item.getElementsByTagName("description") || null;
		this.content = item.getElementsByTagName("content:encoded") || null;
		this.image = item.getElementsByTagName("image") || null;
		
		return this;
	}
	
	get titleVal() {
		return this.title[0].childNodes[0].nodeValue;
	}
	get linkVal() {
		return this.link[0].childNodes[0].nodeValue;
	}
	get commentsVal() {
		return this.comments[0].childNodes[0].nodeValue;
	}
	get pubDateVal() {
		return this.pubDate[0].childNodes[0].nodeValue;
	}
	get creatorVal() {
		return this.creator[0].childNodes[0].nodeValue;
	}
	get categoryVal() {
		return this.category[0].childNodes[0].nodeValue;
	}
	get descriptionVal() {
		return this.description[0].childNodes[0].nodeValue;
	}
	get contentVal() {
		return this.content[0].childNodes[0].nodeValue;
	}
	get previewImage() {
		if(this.image && this.image.length > 0) {
			return this.image[0].childNodes[0].nodeValue;
		}
		return null;
	}
}

class RSSChannel {
	constructor(channel) {
		this.channel = channel || null;
		this.title = channel.getElementsByTagName("title") || null;
		this.atom = channel.getElementsByTagName("atom:link") || null;
		this.link = channel.getElementsByTagName("link") || null;
		this.description = channel.getElementsByTagName("description") || null;
		this.lastBuildDate = channel.getElementsByTagName("lastBuildDate") || null;
		this.language = channel.getElementsByTagName("language") || null;
		this.generator = channel.getElementsByTagName("generator") || null;
		
		this.items = [];
		
		return this;
	}
	
	parseChannel() {	
		let items = this.channel.getElementsByTagName("item");
		for(let j = 0; j < items.length; j++) {
			this.items.push(new RSSItem(items[j]));
		}
		return this;
	}
	
	get itemCount() {
		return this.items.length;
	}
	
	get titleVal() {
		return this.title[0].childNodes[0].nodeValue;
	}
	get atomVal() {
		return this.atom[0].childNodes[0].nodeValue;
	}
	get linkVal() {
		/* Google Chrome Fix */
		let index = 0;
		if(this.link[0].nodeName == "atom:link") {
			index = 1;
		}
		return this.link[index].childNodes[0].nodeValue;
	}
	get descriptionVal() {
		return this.description[0].childNodes[0].nodeValue;
	}
	get lastBuildDateVal() {
		return this.lastBuildDate[0].childNodes[0].nodeValue;
	}
	get languageVal() {
		return this.language[0].childNodes[0].nodeValue;
	}
	get generatorVal() {
		return this.generator[0].childNodes[0].nodeValue;
	}
}

class RSS {
	constructor(data) {
		data = data || {};
		this.url = data.url || "remote_content/ubuntu_blog.xml";
		this.xml = null;
		this.object = null;
		this.loadingOverlay = null;
		this.count = data.count || 4;
		this.channels = [];
		
		this.translator = data.translator;
		
		this.loadData().then((response) => {
			this.xml = response;
			let channels = this.xml.getElementsByTagName("channel");
			for(let i = 0; i < channels.length; i++) {
				this.channels.push(new RSSChannel(channels[i]).parseChannel());
			}
			this.list(0, this.count);
			
		}, function(error) {
			console.error("Failed!", error);
		});

		return this;
	}
	
	appendTo(element) {
		this.object = element;
		this.loadingOverlay = document.createElement("div");
		this.loadingOverlay.classList.add("loading-overlay");
		this.object.appendChild(this.loadingOverlay);
		return this;
	}
	
	loadData() {
		let url = this.url;
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.overrideMimeType("text/xml");
			xhr.onreadystatechange = function() {
				if(this.readyState == 4) {
					if(this.status == 200) {
						resolve(this.responseXML);
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
	
	get RSSChannels() {
		return this.channels;
	}
	
	get channelCount() {
		return this.channels.length;
	}
	
	month(number) {
		if(number < 0 || number > 11) {
			number = 0;
		}
		let months = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
		return months[number];
	}
	
	list(channel, count) {
		channel = channel || 0;
		count = count || 5;
		
		if(this.channelCount < channel) {
			channel = this.channelCount;
		}
				
		if(this.channels[channel].itemCount < count) {
			count = this.channels[channel].itemCount;
		}
		
		let rss = document.createElement("div");
		rss.classList.add("rss-feed");
		
		let h2 = document.createElement("h2");
		let a = document.createElement("a");
		a.href = this.channels[channel].linkVal;
		a.textContent = "Nejnovější zprávy z kanálu " + this.channels[channel].titleVal;
		h2.appendChild(a);
		rss.appendChild(h2);
		
		let ul = document.createElement("ul");
		for(let i = 0; i < count; i++) {
			let item = this.channels[channel].items[i];
			let li = document.createElement("li");
			let wrapper = document.createElement("div");
			wrapper.classList.add("item");
			
			let header = document.createElement("h3");
			let itema = document.createElement("a");
			itema.href = item.linkVal;
			
			let title = item.titleVal;
			itema.textContent = title;
			itema.title = title;
			header.appendChild(itema);
			wrapper.appendChild(header);
			
			if(item.previewImage) {
				let previewImage = document.createElement("img");
				previewImage.src = item.previewImage;
				previewImage.alt = "Feed item preview image";
				wrapper.appendChild(previewImage);
			}
			
			let time = document.createElement("time");
			time.setAttribute("datetime", item.pubDateVal);
			let date = new Date(item.pubDateVal);
			time.textContent = date.getDate() + ". " + this.month(date.getMonth()) + " " + date.getFullYear();
			wrapper.appendChild(time);
			
			li.appendChild(wrapper);
			ul.appendChild(li);
			
			/* Local translations - load and apply */
			if(!navigator.language || !navigator.language.match(/en/i)) {
				itema.classList.add("fade-out");
				this.translator.translate(title).then((response) => {
					itema.textContent = response;
					itema.classList.remove("fade-out");
					itema.classList.add("fade-in");
				}).catch((error) => {
					console.error(error, "Couldn't fetch translations from Translator.js");
				});
			}
		}
		rss.appendChild(ul);
		
		if(this.object) {
			if(this.loadingOverlay.parentNode == this.object) {
				this.object.removeChild(this.loadingOverlay);
			}
			this.object.appendChild(rss);
		}
		
		return rss;
	}
}
