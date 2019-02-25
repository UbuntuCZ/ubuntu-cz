"use strict";

/* An object definition used for translating English words and sentences to Czech */
class TranslationService {
	constructor(data) {
		data = data || {};
		this.log = data.log || false;
		this.wordCharacters = "\\wÀ-ÖØ-öø-ſ";
		this.nonWordBegining = "(^|[^" + this.wordCharacters + "])";
		this.nonWordEnd = "(?![" + this.wordCharacters + "])";
		this.capitalizeFirst = data.capitalizeFirst || false;
		this.dataLocation = data.dataLocation || data.scriptsPath + "/data.json" || "data.json";
		this.callBacks = [];
	}
	
	/* Make string transformations for characters beginning with \char */
	knownTransform(string) {
		let newString = string.replace(/(\\\!.)/g, (match) => {
			return match.replace(/\\\!/, "").toLowerCase();
		});
		newString = newString.replace(/(\\\^.)/g, (match) => {
			return match.replace(/\\\^/, "").toUpperCase();
		});
		
		return {
			string: newString,
			strict: string !== newString
		};
	}
	
	/* This method finds the best (the longest) match from the DB to replace the passed string */
	findBestStringDbMatches(knownTranslations, string) {
		let bestMatches = [];
		for(let key in knownTranslations) {
			let transformedKey = this.knownTransform(key);
			
			let prefix = "";
			if(!key.match(/^(?!\\\^?).*(\^|\\s(\+)?)/)) {
				prefix = this.nonWordBegining;
			}
			let suffix = "";
			if(!key.match(/^(?!\\\$?).*(\$|\\s(\+)?)$/)) {
				suffix = this.nonWordEnd;
			}
			let regexSearchString = prefix + transformedKey.string + suffix;
			let translationRegEx = new RegExp(regexSearchString, "gi");
			let stringMatch = translationRegEx.exec(string);
			if(stringMatch && stringMatch.length > 0) {
				bestMatches.push({
					key,
					regex: new RegExp(transformedKey.string, transformedKey.strict ? "g" : "gi"),
					substring: stringMatch[0]
				});
			}
		}
		
		bestMatches.sort((a, b) => {
			let regExp = new RegExp("["+ this.wordCharacters + "]", "gi");
			let trimmedA = a.key.match(regExp) || [];
			let trimmedB = b.key.match(regExp) || [];
			if(a.key.match(/\.\*/)) {
				return -trimmedB.length;
			}
			if(b.key.match(/\.\*/)) {
				return trimmedA.length;
			}
			var diff = trimmedB.length - trimmedA.length;
			if(diff === 0) {
				return b.key.length - a.key.length;
			}
			return diff;
		});
		
		let matchesToExclude = [];
		for(let i = 0; i < bestMatches.length; i++) {
			for(let j = i + 1; j < bestMatches.length; j++) {
				if(bestMatches[i].key.match(bestMatches[j].regex)) {
					matchesToExclude.push(bestMatches[j]);
				}
			}
		}
		
		let indexOfMatchToExclude = (match) => {
			return bestMatches.indexOf();
		};
		
		let filteredMatches = [];
		for(let i = 0; i < bestMatches.length; i++) {
			let result = matchesToExclude.find(item => item.key === bestMatches[i].key);
			if(!result) {
				filteredMatches.push(bestMatches[i]);
			}
		}
		
		return filteredMatches;
	}
	
	/* This method finds all template destionation occurances or special notations to replace values from the original string */
	/* It can eg. take a value found with this (\\d{1,2}) in the original string, indexed from 1,
	 * and transport it to the final string replacing \\1, in case of the first group in brackets */
	transportCorrespondingValuesToFinal(replacementString, partsToReplace, match) {
		if(partsToReplace) {
			for(let i = 0; i < partsToReplace.length; i++) {
				var index = Number(partsToReplace[i].replace("\\", ""));
				for(var j = 0; j < match.length; j++) {
					if(index === j) {
						replacementString = replacementString.replace(partsToReplace[i], match[j]);
					}
				}
			}
		}
		return replacementString;
	}
	
	makeFirstStringLetterUppercase(string) {
		//replacementString.search(/(?!((\$\d+)|\\|\.|\s)).*/);
		let firstNonWhitespaceIndex = string.search(/(?!((\$\d+)|\\|[\s‘’'"\.])).*/);
		if(firstNonWhitespaceIndex >= 0) {
			let p1 = string.substr(0, firstNonWhitespaceIndex);
			let p2 = string.charAt(firstNonWhitespaceIndex).toUpperCase();
			let p3 = string.substr(firstNonWhitespaceIndex + 1);
			string = p1 + p2 + p3;
		}
		return string;
	}
	
	/* This method updates one part of the string from the found matches */
	updateStringSingleMatch(data) {
		data = data || {};
		let knownTranslations = data.knownTranslations || {};
		let index = data.index || 0;
		let translation = data.translation || "";
		let bestMatches = data.bestMatches || [];
		let match = data.match || [];
		
		if(translation && match && match.length > 0) {
			let firstLetterIndex = match[0].search(/[^\s‘’'"\,]/);
			let firstLetter = match[0].charAt(firstLetterIndex);
			let isUpperCase = firstLetter === firstLetter.toUpperCase();
			let partToUpdate = bestMatches[index].substring;
			let replacementString = partToUpdate.replace(bestMatches[index].regex, knownTranslations[bestMatches[index].key]);
			if(isUpperCase) {
				replacementString = this.makeFirstStringLetterUppercase(replacementString);
			}
			
			replacementString = this.knownTransform(replacementString).string;
			translation = translation.replace(partToUpdate, replacementString);
		}
		return translation;
	}
	
	/* This method assigns all the matches to update and passes them one by one to "updateStringSingleMatch" */
	updateString(knownTranslations, string, bestMatches) {
		let translation = string;
		for(let i = 0; i < bestMatches.length; i++) {
			translation = this.updateStringSingleMatch({
				knownTranslations,
				index: i,
				translation,
				bestMatches,
				match: bestMatches[i].regex.exec(translation)
			});
		}
		return translation;
	}
	
	/* This method takes a string and calls all the voodoo methods to translate it */
	translate(string) {
		return new Promise((resolve, reject) => {
			this.matchesDB.then((knownTranslations) => {
				let bestMatches = this.findBestStringDbMatches(knownTranslations, string);
				if(this.log) {
					console.log("first round", finalString);
					console.log(bestMatches.length, bestMatches, string);
				}
				let finalString = this.updateString(knownTranslations, string, bestMatches);
				
				/* Repeat once agin to complete full translation */
				let secondRoundBestMatches = this.findBestStringDbMatches(knownTranslations, finalString);
				if(this.log) {
					console.log("second round", finalString);
					console.log(secondRoundBestMatches.length, secondRoundBestMatches, finalString);
				}
				finalString = this.updateString(knownTranslations, finalString, secondRoundBestMatches);
				
				/* Remove special declaration to keep words unchanged \\ */
				finalString = finalString.replace(/\\(.)/g, "$1".toLowerCase());
				
				if(this.capitalizeFirst) {
					finalString = this.makeFirstStringLetterUppercase(finalString);
				}
				
				resolve({
					text: finalString.trim()
				});
			}).catch((error) => {
				console.error(error, "In Translator component");
				reject(error);
			});
		});
	}
	
	fetchData(dataLocation) {
		let url = dataLocation || this.dataLocation;
		return new Promise((resolve, reject) => {
			if(!this.fetchInProgress) {
				this.fetchInProgress = true;
				
				const xhr = new XMLHttpRequest();
				xhr.open("GET", url);
				xhr.onload = () => {
					this.fetchInProgress = false;
					resolve(xhr.responseText);
				};
				xhr.onerror = () => reject(xhr.statusText);
				xhr.send();
			}
			else {
				this.callBacks = this.callBacks || [];
				this.callBacks.push(() => {
					resolve();
				});
			}
		});
	}
	
	get matchesDB() {
		return new Promise((resolve, reject) => {
			if(!this.fetchedData) {
				this.fetchData().then((data) => {
					if(data) {
						try {
							let fetchedData = JSON.parse(data);
							let blendedData = {};
							for(let levelKey in fetchedData) {
								for(let itemKey in fetchedData[levelKey]) {
									blendedData[itemKey] = fetchedData[levelKey][itemKey];
								}
							}
							this.fetchedData = blendedData;
							
							for(let i = 0; i < this.callBacks.length; i++) {
								this.callBacks[i]();
							}
							
							delete this.callBacks;
							
							resolve(this.fetchedData);
						}
						catch(error) {
							reject(error);
						}
					}
					else {
						if(this.fetchedData) {
							resolve(this.fetchedData);
						}
						else {
							reject("No data downloaded yet someone was attempting it before this request");
						}
					}
				}).catch((error) => {
					reject(error);
				});
			}
			else {
				resolve(this.fetchedData);
			}
		});
	}
}
