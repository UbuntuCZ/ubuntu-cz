"use strict";

class Header {
	constructor(header) {
		document.addEventListener("DOMContentLoaded", (event) => {
			this.header = header || document.querySelector("header");
			this.mobileScreenLimit = 960;
			if(this.header) {
				this.init();
			}
		});
		
		return this;
	}
	
	init() {
		this.menuItems = this.header.querySelectorAll("nav li.top-level");
		for(let i = 0; i < this.menuItems.length; i++) {
			this.menuItemAction(i);
			if(this.convertStringToAscii(decodeURI(window.location.hash.replace(/^#/, ""))) === this.getMenuItemHash(i)) {
				this.openSubMenu(i);
			}
		}
		
		document.body.addEventListener("click", (event) => {
			if(window.innerWidth > this.mobileScreenLimit) {
				if(!this.header.contains(event.target)) {
					this.closeAllSubMenus();
					this.removeHashFromUrl();
				}
			}
		});
	}
	
	menuItemAction(index) {
		let menuItem = this.menuItems[index];
		menuItem.addEventListener("click", (event) => {
			if(window.innerWidth > this.mobileScreenLimit) {
				if(!event.target.closest(".submenu")) {
					event.preventDefault();
					event.stopPropagation();
					
					this.closeAllSubMenus(index);				
					menuItem.classList.toggle("open");
					
					if(menuItem.classList.contains("open")) {
						this.addHashToUrl(this.getMenuItemHash(index));
					}
					else {
						this.removeHashFromUrl();
					}
				}
			}
		});
	}
	
	closeAllSubMenus(exceptIndex = -1) {
		for(var i = 0; i < this.menuItems.length; i++) {
			if(i !== exceptIndex) {
				this.menuItems[i].classList.remove("open");
			}
		}
	}
	
	openSubMenu(index) {
		this.menuItems[index].classList.add("open");
	}
	
	convertStringToAscii(string) {
		if(string.normalize) {
			return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		}
		return string;
	}
	
	getMenuItemHash(index) {
		let menuItemHref = this.menuItems[index].querySelector("a").href;
		let baseName = menuItemHref.substring(menuItemHref.lastIndexOf("/") + 1);
		return baseName;
	}
	
	addHashToUrl(hash) {
		history.pushState("", document.title, window.location.pathname + window.location.search + "#" + hash);
	}
	
	removeHashFromUrl() {
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}
}
