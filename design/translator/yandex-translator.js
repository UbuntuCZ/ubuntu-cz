"use strict";

class TranslationService {
	constructor(data) {
		data = data || {};
		this.url = data.url || "https://translate.yandex.net/api/v1.5/tr.json/translate";
		this.apiKey = data.apiKey || "";
		this.sourceLanguage = data.sourceLanguage || "en";
		this.destinationLanguage = data.destinationLanguage || "cs";
		this.fallback = data.fallback || null;
		this.forceFallback = data.forceFallback || false;
		this.credits = "<a href=\"http://translate.yandex.com/\">Powered by Yandex.Translate</a>";
		
		this.cachedReplies = {};
	}
	
	serialize(object) {
		var serializedString = [];
		for(let key in object) {
			if(object.hasOwnProperty(key)) {
				serializedString.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
			}
		}
		return serializedString.join("&");
	}
	
	fetch(string) {
		let data = {
			key: this.apiKey,
			text: string,
			format: "plain",
			lang: this.sourceLanguage + "-" + this.destinationLanguage,
			options: 1
		};
		return fetch(this.url, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			body: this.serialize(data)
		}).then(response => response.json());
	}
	
	fallbackTranslate(string) {
		console.log("fallbackTranslate");
		return new Promise((resolve, reject) => {
			if(this.fallBackTranslator) {
				this.fallBackTranslator.translate(string).then((data) => resolve(data)).catch((error) => reject(error));
			}
			else if(this.fallback) {
				this.scriptTag = this.scriptTag || document.createElement("script");
				this.scriptTag.src = this.fallback;
				document.head.appendChild(this.scriptTag);
				
				this.scriptTag.addEventListener("load", (event) => {
					this.fallBackTranslator = new ENCZTranslator({
						capitalizeFirst: true
					});
					resolve(this.fallBackTranslator.translate(string));
				});
			}
		});
	}
	
	translate(string, forceFetch, forceFallback) {
		return new Promise((resolve, reject) => {
			if(this.forceFallback || forceFallback) {
				this.fallbackTranslate(string).then((data) => resolve(data)).catch((error) => reject(error));
				return;
			}
			
			if(!forceFetch && this.cachedReplies[string]) {
				resolve({
					text: this.cachedReplies[string].text,
					lang: this.cachedReplies[string].lang,
					cached: true,
					credits: this.credits
				});
				return;
			}
			
			this.fetch(string).then((response) => {
				if(response.code === 200) {
					if(response.text) {
						this.cachedReplies[string] = {
							text: response.text.join("\n"),
							lang: response.lang
						};
						resolve({
							text: response.text.join("\n"),
							lang: response.lang,
							cached: false,
							credits: this.credits
						});
					}
				}
				else {
					console.error("[TranslationService] Couldn't fetch translation for: " + string);
					console.error("[TranslationService] Error Code:", response.code);
					
					if(this.fallBackTranslator) {
						this.fallbackTranslate(string).then((data) => resolve(data)).catch((error) => reject(error));
					}
					else if(this.fallback) {
						this.fallbackTranslate(string).then((data) => resolve(data)).catch((error) => reject(error));
					}
					else {
						reject(false);
					}
				}
			});
		});
	}
}
