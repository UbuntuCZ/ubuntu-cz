"use strict";

/*
 * Generic Translator
 * 
 * Allows to translate using multipe compatible engines
 * currently works with the following engines:
 * 	- default (local translations, regex-based, ideal for repetitive translations, mainly dates, days)
 * 	- google (requires Google Api key and allowed access)
 * 	- yandex (easy to set-up but requires displaying credits)
 * 	- if a script path is provided Translator will assume there is a custom translator there and will try to use it.
 * 	- alternatively an instance of some translator can be passed using loadedTranslator option.
 * 
 * Engine class name must match "TranslationService", or an existing already loaded instance has to be provided on initialization.
 * 
 * If no engine is specified default will be used.
 * Used translators will be loaded automatically if present in the same directory. If not found, default will be used. If default is missing, no translations will be provided.
 */

class Translator {
	constructor(data) {
		data = data || {};
		this.engine = data.engine || "default";
		this.loadedTranslator = data.loadedTranslator || null;
		if(this.loadedTranslator) {
			this.engine = "custom instance";
		}
		this.scriptsPath = data.scriptsPath || "design/translator/";
		
		this.sourceLanguage = data.sourceLanguage || "en";
		this.destinationLanguage = data.destinationLanguage || "cs";
		
		this.ready = false;
		this.resolves = [];
	}
	
	availableTranslators() {
		return {
			default: {
				path: this.scriptsPath + "local-translator.js"
			},
			google: {
				path: this.scriptsPath + "google-translator.js",
				apiKey: null
			},
			yandex: {
				path: this.scriptsPath + "yandex-translator.js",
				apiKey: "trnsl.1.1.20190204T213725Z.9709ed8c8986727b.302abc56d72c7343ae9d3a2405dd4c0ba63a1b53"
			},
		}
	}
	
	load(translator) {
		this.loadInProgress = true;
		return new Promise((resolve, reject) => {
			let meta = this.availableTranslators()[translator];
			if(!meta) {
				if(meta.match(/\.js/)) {
					this.engine = "custom script path";
					meta = translator;
				}
				else {
					console.error("[Translator] Invalid translator definition provided", translator);
					reject(translator);
				}
			}
			this.ready = false;
			
			let script = document.createElement("script");
			
			script.addEventListener("load", (event) => {
				this.loadedTranslator = new TranslationService({
					apiKey: (meta && meta.apiKey ? meta.apiKey : null),
					scriptsPath: this.scriptsPath || null,
					sourceLanguage: this.sourceLanguage,
					destinationLanguage: this.destinationLanguage
				});
				for(let i = 0; i < this.resolves.length; i++) {
					this.resolves[i].resolve();
				}
				this.resolves = [];
				this.ready = true;
				this.loadInProgress = false;
				resolve(translator);
			});
			
			script.addEventListener("error", (event) => {
				console.error("[Translator] Could not load translator", translator);
				for(let i = 0; i < this.resolves.length; i++) {
					this.resolves[i].reject();
				}
				this.resolves = [];
				this.loadInProgress = false;
				reject(translator);
			});
			
			script.src = meta ? meta.path : "";
			
			document.head.appendChild(script);
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
	
	defaultTranslate(string, resolve, reject) {
		if(!this.loadInProgress) {
			this.load("default").then((response) => {
				this.translate(string).then((response) => resolve(response)).catch((reason) => reject(reason));
			}).catch((reason) => {
				console.error("[Translator] Could not load default engine");
			});
		}
		else {
			this.translate(string).then((response) => resolve(response)).catch((reason) => reject(reason));
		}
	}
	
	/*
	 * Abstract translate method - every translator needs to implement this and return a promise with a respective translation
	 * 
	 * Tools need to implement the following:
	 * resolve({
			text: REPLY, // mandatory, contains translated string
			lang: LANG_CODE, // optional, contains source language code, or a combination of source-destination (divided using dash character)
			cached: BOOL, // optional, informing whether the reply has been newly fetched or already taken from a cache. Cache has to be implemented in the specific translators.
			credits: CREDITS_HTML // optional. If available, credits needst to be displayed on site as it may be required by the service terms of use.
		});
	 * 
	 * reject(false); // Will inform this Translator there was an error while processing the translation and it is not available.
	 */
	translate(string) {
		return new Promise((resolve, reject) => {
			if(!this.loadedTranslator && !this.loadInProgress) {
				this.load(this.engine).catch(() => {
					console.error("[Translator] Can't translate", string, "No engine available");
				});
			}
			
			this.onReady().then((response) => {
				if(this.loadedTranslator) {
					this.loadedTranslator.translate(string).then((response) => resolve(response)).catch((reason) => reject(reason));
				}
				else {
					console.error("[Translator] Engine not loaded, could not translate ", string, "using " + this.engine + " engine");
					reject(false);
				}
			}).catch((error) => {
				if(this.engine !== "default") {
					console.error("[Translator] Could not translate string", string, "using " + this.engine + " engine");
					this.defaultTranslate(string, resolve, reject); // Try default engine
				}
				else {
					console.error("[Translator] Could not translate string", string, "using default engine");
					reject(error);
				}
			});
		});
	}
	
}
