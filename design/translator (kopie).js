"use strict";

/* An object definition used for translating English words and sentences to Czech */
class ENCZTranslator {
	constructor(data) {
		data = data || {};
		this.log = data.log || false;
		this.wordDelimiters = "\\s|\\b|\,|\'|\‘|\’|\"";
	}
	
	/* This method finds the best (the longest) match from the DB to replace the passed string */
	findBestStringDbMatches(string) {
		let knownTranslations = this.db;
		let bestMatches = [];
		for(let key in knownTranslations) {
			let regexSearchString = "(<=" + this.wordDelimiters + ")" + key + "(?=" + this.wordDelimiters + ")";
			let translationRegEx = new RegExp(regexSearchString, "gi");
			let stringMatch = string.match(translationRegEx);
			let addNewItem = true;
			if(stringMatch && stringMatch.length > 0) {
				console.log(string, translationRegEx, stringMatch);
				
				for(let i = 0; i < bestMatches.length; i++) {
					let savedMatch = stringMatch[0].match(bestMatches[i].regex);
					if(savedMatch && savedMatch.length > 0) {
						if(savedMatch[0].length < stringMatch[0].length) {
							bestMatches[i] = {
								key: key,
								regex: new RegExp(key, "gi")
							};
							addNewItem = false;
						}
					}
				}
				
				if(addNewItem) {
					bestMatches.push({
						key: key,
						regex: new RegExp(key, "gi")
					});
				}
			}
		}
		return bestMatches;
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
	
	/* This method updates one part of the string from the found matches */
	updateStringSingleMatch(index, translation, bestMatches, match) {
		if(translation && match && match.length > 0) {
			let firstLetter = match[0].charAt(0);
			let isUpperCase = firstLetter === firstLetter.toUpperCase();
			let replacementString = this.db[bestMatches[index].key];
			if(isUpperCase) {
				let firstNonWhitespaceIndex = replacementString.search(/(?!((\$\d+)|\\|\.|\s)).*/);
				if(firstNonWhitespaceIndex >= 0) {
					let p1 = replacementString.substr(0, firstNonWhitespaceIndex);
					let p2 = replacementString.charAt(firstNonWhitespaceIndex).toUpperCase();
					let p3 = replacementString.substr(firstNonWhitespaceIndex + 1);
					//console.log(replacementString, p2);
					replacementString = p1 + p2 + p3;
				}
				
				//replacementString = tmpString.charAt(0).toUpperCase() + replacementString.slice(1);
			}
			/* Force Lower Case for characters beginning with \! */
			replacementString = replacementString.replace(/\\\!(.)/g, "$1".toLowerCase());
			
			//replacementString = this.transportCorrespondingValuesToFinal(replacementString, replacementString.match(/\\(\d+)/g), match);
			
			translation = translation.replace(bestMatches[index].regex, replacementString);
		}
		return translation;
	}
	
	/* This method assigns all the matches to update and passes them one by one to "updateStringSingleMatch" */
	updateString(string, bestMatches) {
		let translation = string;		
		for(let i = 0; i < bestMatches.length; i++) {
			translation = this.updateStringSingleMatch(i, translation, bestMatches, bestMatches[i].regex.exec(translation));
		}
		return translation;
	}
	
	/* This method takes a string and calls all the voodoo methods to translate it */
	translate(string) {
		let bestMatches = this.findBestStringDbMatches(string);
		if(this.log) {
			console.log(bestMatches.length, bestMatches, string);
		}
		let finalString = this.updateString(string, bestMatches);
				
		/* Repeat once agin to complete full translation */
		console.log("second round", finalString);
		let secondRoundBestMatches = this.findBestStringDbMatches(finalString);
		if(this.log) {
			console.log(secondRoundBestMatches.length, secondRoundBestMatches, finalString);
		}
		finalString = this.updateString(finalString, secondRoundBestMatches);
		
		/* Remove special declaration to keep words unchanged \\ */
		finalString = finalString.replace(/\\(.)/g, "$1".toLowerCase());
		
		return finalString;
	}
	
	/* This getter returns month translations */
	get monthsDb() {
		return {
			"january": "leden",
			"february": "únor",
			"april": "březen",
			"march": "duben",
			"may": "květen",
			"june": "červen",
			"july": "červenec",
			"august": "srpen",
			"september": "září",
			"october": "říjen",
			"november": "listopad",
			"december": "prosinec",
			"from january": "z ledna",
			"from february": "z února",
			"from april": "z března",
			"from march": "z dubna",
			"from may": "z května",
			"from june": "z června",
			"from july": "z července",
			"from august": "ze srpna",
			"from september": "ze září",
			"from october": "z října",
			"from november": "z listopadu",
			"from december": "z prosince",
			"(\\d{1,2}) january": "$1. ledna",
			"(\\d{1,2}) february": "$1. února",
			"(\\d{1,2}) april": "$1. března",
			"(\\d{1,2}) march": "$1. dubna",
			"(\\d{1,2}) may": "$1. května",
			"(\\d{1,2}) june": "$1. června",
			"(\\d{1,2}) july": "$1. července",
			"(\\d{1,2}) august": "$1. srpna",
			"(\\d{1,2}) september": "$1. září",
			"(\\d{1,2}) october": "$1. října",
			"(\\d{1,2}) november": "$1. listopadu",
			"(\\d{1,2}) december": "$1. prosince"
		}
	}
	
	/* This getter returns day translations */
	get daysDb() {
		return {
			"monday": "pondělí",
			"tuedsday": "úterý",
			"wednesday": "středa",
			"thursday": "čtvrtek",
			"friday": "pátek",
			"saturday": "sobota",
			"sunday": "neděle"
		}
	}
	
	/* This getter returns all names translations */
	get namesDB() {
		return {
			"London": "\\!Londýn"
		}
	}
	
	/* This getter returns all one-word translations */
	get singleDb() {
		return {
			"abstinence": "abstinace",
			"and": "\\a",
			"applications": "aplikace",
			"as": "jako",
			"available": "dostupné",
			"backup": "záloha",
			"backups": "zálohy",
			"bringing": "přinášet",
			"changes": "změny",
			"casts": "obsazuje",
			"client": "klient",
			"conference": "konverence",
			"create": "vytvořte",
			"detail": "odhalují",
			"details": "podrobnosti",
			"developer": "vývojář",
			"devs": "vývojáři",
			"donation": "dar",
			"easier": "snazžší",
			"easy": "snadné",
			"edition": "edice",
			"fault": "vada",
			"features": "funkce",
			"finally": "konečně",
			"file": "soubor",
			"first": "první",
			"for": "pro",
			"fresh": "čerstvé",
			"from": "z",
			"full(-)?time": "plný úvazek",
			"gains": "získává",
			"game": "hra",
			"games": "hry",
			"gaming": "hraní",
			"gets": "dostává",
			"goes": "\\se stává",
			"government": "vláda",
			"graphical": "grafická",
			"hard": "těžké",
			"hire": "najmout",
			"history": "historii",
			"is": "je",
			"it": "\\t\\o",
			"improvements": "vylepšení",
			"inside": "uvnitř",
			"launches": "vychází",
			"lazy": "líný",
			"lets": "umožňuje",
			"list": "seznam",
			"mystery": "tajemný",
			"national": "národní",
			"new": "nové",
			"now": "nyní",
			"on": "na",
			"other": "ostatní",
			"opinion": "názor",
			"or": "nebo",
			"pre-installed": "již předinstalovaným",
			"prview": "náhled",
			"publish": "zveřejňuje",
			"publishes": "zveřejňuje",
			"recommend": "doporučení",
			"released": "vydán",
			"resizing": "změna velikosti",
			"report": "zpráva",
			"search": "hledání",
			"several": "mnoho",
			"schedule": "naplánovat",
			"ships": "vychází",
			"snaps": "snap balíčky",
			"some": "nějaké",
			"space": "vesmír",
			"staff": "zaměstnanci",
			"store": "obchod",
			"summary": "shrnutí",
			"team": "tým",
			"terminal": "terminál",
			"to": "na",
			"upcoming": "nadcházejících",
			"update(s)?": "aktualizace",
			"uses": "používá",
			"videos": "videa",
			"vulnerabilities": "zranitelnosti",
			"wants": "chce",
			"way": "způsob",
			"with": "s",
			"your": "vaše",
			"’s": "\\!ho"
		}
	}
	
	/* This getter returns all complex translations */
	get startersDb() {
		return {
			"(^|\\s)a ": " ",
			"^([\\w\\s]+)?browser": "prohlížeč$1",
			"^([\\w\\s]+)?(developer|dev)": "vývojář$1",
			"^([\\w\\s]+)?(developers|devs)": "vývojáři$1",
			"(^|\\s)the ": " "
		}
	}
	
	/* This getter returns all complex translations */
	get complexDb() {
		return {
			"added to": "\\!přidán do",
			"added to (\\(?!Ubuntu\\b\\)[\\w\\s]+)? store": "\\!přidán do $1 obchodu",
			"added to (\\(?!Snap\\b\\)[\\w\\s]+)? store": "\\!přidán do $1 obchodu",
			"added to ([\\w\\s]+)? Snap store": "\\!přidán do $1 obchodu s balíčky Snap",
			"added to ([\\w\\s]+)? Ubuntu Snap store": "\\!přidán do $1 obchodu Ubuntu s balíčky Snap",
			"arrives with": "přichází s",
			"arrives with some big changes": "přichází s velkými změnami",
			"available today": "dnes dostupné",
			"available to download now": "nyní k dispozici ke stažení",
			"browser is now available": "prohlížeč je nyní k dispozici",
			"board-based": "na deskách postavený",
			"Cyber Security Centre": "Centrum Kybernetické Bezpečnosti",
			"command line": "příkazová řádka",
			"conference report": "reportáž z konference",
			"deploying([\\w\\s]+)?on public cloud": "nasazování $1 na veřejný cloud",
			"deploying([\\w\\s]+)?on public clouds": "nasazování $1 na veřejné cloudy",
			"design and web team summary": "shrnutí designového \\a webového týmu",
			"developer edition": "vývojářská edice",
			"download links": "odkazy ke stažení",
			"email client": "emailový klient",
			"everything you need to know": "vše, co potřebujete vědět",
			"fault vulnerabilities": "chyby zabezpečení",
			"file backups": "zálohy souborů",
			"for( the)? command line": "pro příkazovou řádku",
			"hire full(-)?time staff": "najmout zaměstnance na plný úvazek",
			"how to": "jak",
			"in seconds": "během pár vteřin",
			"in starring role": "v hlavní roli",
			"in the Snap Store": "v obchodě s balíčky Snap",
			"in the Ubuntu Store": "v obchodě Ubuntu",
			"in the Ubuntu Snap Store": "v obchodě Ubuntu s balíčky Snap",
			"is \\((\\w+)\\) bringing": "$1 přináší",
			"is getting": "dostává",
			"it’s now": "nyní je",
			"(just)? keeps getting better": "\\!se stále zlepšuje",
			"Linux games": "Linuxové hry",
			"Linux users": "\\!uživatele Linuxu",
			"Living the Terminal Life": "život v Terminálu",
			"major changes": "významnými změnami",
			"mystery dontaions": "záhadné dary",
			"new look": "nový vzhled",
			"new\\s(\\w+)?\\sapp": "nová $1 aplikace",
			"now available": "nyní dostupné",
			"of Ubuntu (\\d{1,2}).(\\d{2})(.\\d{1})?( LTS)? security tips": "bezpečnostních tipů pro Ubuntu $1.$2$3$4",
			"on Linux": "na Linuxu",
			"or is it": "Skutečně",
			"out-of-process extensions": "\\!rozšíření běžící mimo hlavní vlákno",
			"point release of": "opravné vydání",
			"retro style games": "hry ve stylu retro",
			"serves up": "přináší",
			"space strategy": "vesmírná strategie",
			"space strategy game": "vesmírná strategická hra",
			"some big changes": "velké změny",
			"task manager": "správce úloh",
			"terminal fault vulnerabilities": "chyby zabezpečení terminálu",
			"to download": "ke stažení",
			"to install": "nainstalovat",
			"to Linux": "na Linux",
			"to millions of": "k milionům",
			"to recommend": "k doporučení",
			"Ubuntu (\\w+) development summary": "Přehled vývoje Ubuntu $1",
			"Ubuntu (\\d{1,2}).(\\d{2})(.\\d{1})?( LTS)? Security Guide": "Průvodce bezpečností pro Ubuntu $1.$2$3$4",
			"Ubuntu (\\d{1,2}).(\\d{2})(.\\d{1})?( LTS)? released": "Vydáno Ubuntu $1.$2$3$4",
			"Ubuntu (\\d{1,2}).(\\d{2})(.\\d{1})?( LTS)? security tips": "bezpečnostní tipy pro Ubuntu $1.$2$3$4",
			"UI polish": "vyčištění rozhraní",
			"video preview resizing": "změna velikosti náhledu videa",
			"wants your opinion on it": "se dotazuje na váš názor",
			"with Ubuntu (\\d{1,2}).(\\d{2})( LTS)? pre-installed": "s předinstalovaným Ubuntu $1.$2$3",
			"web content": "webového obsahu",
			"your browser history": "vaši historii prohlížeče",
			"your Linux development workstation": "vaši Linuxovou pracovní stanici",
			"your opinion": "váš názor",
			"(\\w+)’s([\\w\\s]+)?\\sapp": "aplikace $1$2",
			"(\\w+)?\\sapp": "aplikace $1",
		}
	}
	
	/* This getter returns all translations, joining both one-word and complex translations */
	get db() {
		return Object.assign({}, this.monthsDb, this.daysDb, this.namesDB, this.singleDb, this.startersDb, this.complexDb);
	}
}
