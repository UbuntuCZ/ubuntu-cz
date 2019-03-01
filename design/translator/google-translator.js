"use strict";

class TranslationService {
	constructor(data) {
		data = data || {};
		this.url = data.url || "https://translation.googleapis.com/language/translate/v2";
		this.apiKey = data.apiKey || "AIzaSyC9eU5PTMx_RiwijIZzJuLKiyhCJNhLg0c";
		this.sourceLanguage = data.sourceLanguage || "en";
		this.destinationLanguage = data.destinationLanguage || "cs";
		this.dependencies = data.dependencies || [];
		this.fallback = data.fallback || null;
		this.forceFallback = data.forceFallback || false;
		this.credits = null;
		
		this.ready = false;
		this.resolves = [];
		
		this.cachedReplies = {};
		this.loadDependencies();
	}
	
	goReady() {
		this.ready = true;
		for(let i = 0; i < this.resolves.length; i++) {
			this.resolves[i].resolve();
		}
		this.resolves = [];
	}
	
	loadDependencies() {
		if(this.dependencies.length > 0) {
			this.remaining = typeof this.remaining === typeof undefined ? this.dependencies.length : this.remaining;
			let index = this.dependencies.length - this.remaining;
			this.loadScript(this.dependencies[index]).then((src) => {
				if(this.remaining > 0) {
					this.remaining -= 1;
					this.loadDependencies();
					return;
				}
				this.goReady();
			});
			return;
		}
		this.goReady();
	}
	
	loadScript(src) {
		return new Promise((resolve, reject) => {
			let existingScriptTags = document.querySelectorAll("script");
			for(let i = 0; i < existingScriptTags.length; i++) {
				if(existingScriptTags[i].src === src) {
					console.log("script already loaded", src);
					resolve(src);
					return;
				}
			}
			
			let newScript = document.createElement("script");
			newScript.src = src;
			document.head.appendChild(newScript);
			newScript.addEventListener("load", (event) => {
				resolve(src);
			});
		});
	}
	
	onReady() {
		return new Promise((resolve, reject) => {
			if(this.ready) {
				resolve();
			}
			else {
				this.resolves.push({
					resolve,
					reject
				});
			}
		});
	}
	
	serialize(object) {
		var serializedString = [];
		for(let key in object) {
			if(object.hasOwnProperty(key)) {
				serializedString.push((key) + "=" + (object[key]));
			}
		}
		return serializedString.join("&");
	}
	
	fetch(string) {
		let data = {
			q: string,
			source: this.sourceLanguage,
			target: this.destinationLanguage,
			key: this.apiKey
		};
		return fetch(this.url + "?" + this.serialize(data), {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-type": "application/json; charset=utf-8"
			}
		}).then(response => response.json());
	}
	
	translate(string, forceFetch, forceFallback) {
		return new Promise((resolve, reject) => {
			if(!forceFetch && this.cachedReplies[string]) {
				resolve({
					text: this.cachedReplies[string].text,
					lang: this.cachedReplies[string].lang,
					cached: true,
					credits: this.credits
				});
				return;
			}
			
			this.onReady().then(() => {
				this.fetch(string).then((response) => {
					if(response.data && response.data.translations) {
						let translations = response.data.translations;
						for(let key in translations) {
							if(translations[key].translatedText) {
								this.cachedReplies[string] = {
									text: translations[key].translatedText,
									lang: this.destinationLanguage
								};
								resolve({
									text: translations[key].translatedText,
									lang: this.destinationLanguage,
									cached: false,
									credits: this.credits
								});
								return;
							}
						}
					}
					
					console.error("[TranslationService] Couldn't fetch translation for: \"" + string + "\"");
					if(response.error) {
						let keys = Object.keys(response.error);
						for(let i = 0; i < keys.length; i++) {
							let status = response.error[keys[i]];
							if(!Array.isArray(status) && typeof status !== typeof Object) {
								console.error("[TranslationService] " + keys[i], status);
							}
						}
					}
					reject(false);
				});
			}).catch((reason) => {
				reject(reason);
			});
		});
	}
}
