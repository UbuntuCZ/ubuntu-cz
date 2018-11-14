"use strict";

class Breadcrumbs {
	constructor(breadcrumbs) {
		document.addEventListener("DOMContentLoaded", (event) => {
			this.breadcrumbs = breadcrumbs || document.querySelector("nav.breadcrumbs");
			if(this.breadcrumbs) {
				this.init();
			}
		});
		
		return this;
	}
	
	init() {
		document.querySelector("header").classList.add("no-shadow");
		
		this.breadcrumbsNav = this.breadcrumbs.querySelector("ul.sub-menu");
		this.navItems = this.breadcrumbsNav.querySelectorAll("li");
		
		this.makeScrollable();
		this.alignCenter();
		this.highlightBorders();
		
		this.breadcrumbsNav.addEventListener("scroll", () => this.highlightBorders());
		window.addEventListener("resize", () => {
			this.makeScrollable();
			this.alignCenter();
			this.highlightBorders();
		});
	}
	
	alignCenter() {
		let index = 0;
		let totalLeftOffset = 0;
		while(this.navItems[index]) {
			let navItem = this.navItems[index];
			
			if(navItem.classList.contains("current") && !navItem.classList.contains("not-exact")) {
				totalLeftOffset -= (this.breadcrumbsNav.offsetWidth - navItem.offsetWidth) / 2;
				this.breadcrumbsNav.scrollLeft = totalLeftOffset;
				break;
			}
			totalLeftOffset += navItem.offsetWidth;
			index++;
		}
	}
	
	makeScrollable() {
		if(this.breadcrumbsNav.scrollWidth > this.breadcrumbsNav.offsetWidth) {
			this.breadcrumbsNav.classList.add("scroll");
			this.isScrollable = true;
		}
		else {
			this.breadcrumbsNav.classList.remove("scroll");
			this.isScrollable = false;
		}
	}
	
	highlightBorders() {
		let totalLeftOffset = this.breadcrumbsNav.scrollLeft;
		if(totalLeftOffset > 0) {
			this.breadcrumbs.classList.add("shadow-left");
		}
		else {
			this.breadcrumbs.classList.remove("shadow-left");
		}
		
		if(totalLeftOffset + this.breadcrumbsNav.offsetWidth < this.breadcrumbsNav.scrollWidth) {
			this.breadcrumbs.classList.add("shadow-right");
		}
		else {
			this.breadcrumbs.classList.remove("shadow-right");
		}
	}
}
