"use strict";

class Pager {
	constructor(data) {
		data = data || {};
		
		this.sections = data.sections || {};
		this.container = data.container || document.body;
		this.pageAnchors = [];
		return this;
	}
	
	getSectionName(section) {
		var headers = section.querySelector("h1, h2, h3, h4");
		if(headers) {
			return headers.innerText;
		}
		return null;
	}
	
	generateList(level, anchor, className) {
		var sectionName = this.getSectionName(level);
		if(anchor && sectionName) {
			var levelList = document.createElement("li");
			levelList.classList.add(className || "level-list");
			
			var levelLink = document.createElement("a");
			levelLink.href = window.location.pathname + "#" + anchor;
			levelLink.innerText = this.getSectionName(level).replace(/^(.{90}[^\s]*).*/, "$1");
			levelList.appendChild(levelLink);
			
			if(level.id != anchor) {
				level.id = anchor;
			}
			
			return levelList;
		}
		return null;
	}
	
	generatePager() {		
		var pager = document.createElement("ul");
		pager.classList.add("pager");
		this.container.appendChild(pager);
		
		var toggle = document.createElement("div");
		toggle.innerHTML = "&gt;";
		toggle.classList.add("toggle");
		toggle.addEventListener("click", () => {
			pager.parentNode.classList.toggle("active");
		});
		this.container.appendChild(toggle);
		
		var listItems = [];
		var count = 0;
		for(var i = 0; i < this.sections.length; i++) {
			var id = this.sections[i].id || "section" + i;
			var list = this.generateList(this.sections[i], id, "first-level-list");
			if(list) {
				pager.appendChild(list);
				count++;
			}
			listItems.push(list || null);
		}
		
		if(count <= 2) {
			this.container.removeChild(pager);
			return false;
		}
		
		window.addEventListener("scroll", () => {
			for(var i = 0; i < this.sections.length; i++) {
				if(listItems[i]) {
					listItems[i].classList.remove("current");
					if(this.isScrolledIntoView(this.sections[i])) {
						listItems[i].classList.add("current");
					}
				}
			}
		});
		
		return this;
	}
	
	isScrolledIntoView(elm) {
		var rect = elm.getBoundingClientRect();
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	}
}
