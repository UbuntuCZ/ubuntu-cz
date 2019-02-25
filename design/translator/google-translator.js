"use strict";

class TranslationService {
	constructor(data) {
		data = data || {};
		this.url = data.url || "https://translation.googleapis.com/language/translate/v2";
		this.apiKey = data.apiKey || "";
		this.sourceLanguage = data.sourceLanguage || "en";
		this.destinationLanguage = data.destinationLanguage || "cs";
		this.dependencies = data.dependencies || [];
		this.dependencies.push("https://apis.google.com/js/platform.js?onload=loadAuthClient");
		this.fallback = data.fallback || null;
		this.forceFallback = data.forceFallback || false;
		this.credits = "<a href=\"https://translate.google.com/\">Powered by Google Translate</a>";
		
		this.ready = false;
		this.resolves = [];
		
		this.clientId = data.clientId || "36f3d9c9569b048082e990528f6af65d26f8e36c";
		this.idToken = null;
		
		this.cachedReplies = {};
		
		this.loadDependencies();
	}
	
	logIn() {
		return new Promise((resolve, reject) => {
			this.gapi.auth2.init({
				client_id: this.clientId,
				scope: "https://www.googleapis.com/auth/userinfo.email"
			}).then((status) => {
				console.log("gapi ok", status);
				
				this.gapi.auth2.getAuthInstance().signIn().then(() => {
					let user = this.gapi.auth2.getAuthInstance().currentUser.get();
					this.idToken = user.getAuthResponse().id_token;
					resolve(this.idToken);
				}).catch((error) => {
					console.log(error);
					reject(error);
				});
			}).catch((error) => {
				console.error(error);
				reject(error);
			});
		});
	}
	
	loadDependencies() {
		this.remaining = typeof this.remaining === typeof undefined ? this.dependencies.length : this.remaining;
		let index = this.dependencies.length - this.remaining;
		this.loadScript(this.dependencies[index]).then((src) => {
			this.remaining -= 1;
			if(this.remaining > 0) {
				this.loadDependencies();
			}
			else {
				this.gapi = this.gapi || window.gapi;
				this.gapi.load("auth2", () => {
					this.logIn().then(() => {
						this.ready = true;
						
						for(let i = 0; i < this.resolves.length; i++) {
							this.resolves[i].resolve();
						}
						this.resolves = [];
					}).catch(() => {
						for(let i = 0; i < this.resolves.length; i++) {
							this.resolves[i].reject();
						}
						this.resolves = [];
					});
				});
			}
		});
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
				serializedString.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
			}
		}
		return serializedString.join("&");
	}
	
	fetch(string) {
		let data = {
			q: string,
			source: this.sourceLanguage,
			target: this.destinationLanguage
		};
		return fetch(this.url, {
			method: "POST",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.idToken,
				"Content-type": "application/json; charset=utf-8"
			},
			body: this.serialize(data)
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
					console.log("response", response);
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
					}
				});
			}).catch((reason) => {
				reject(reason);
			});
		});
	}
}
