<?php
	if(!isset($basic)) {
		$basic = true;
	}
?>

<?php
	if($basic == false) {
?>
<h3>Internet a komunikace</h3>
<?php
	}
?>
<ul class="inline-icons highlightable">
	<li title="Firefox"><img src="images/icons/firefox.svg" alt="Firefox">Mozilla Firefox</li>
	<li title="Google Chrome" class="no-snap"><a href="https://www.google.com/chrome/"><img src="images/icons/chrome.svg" alt="Google Chrome">Google Chrome</a></li>
<?php
	if($basic == false) {
?>
	<li title="Opera"><img src="images/icons/opera.png" alt="Opera">Opera</li>
<?php
	}
?>
	<li title="Skype"><img src="images/icons/skype.png" alt="Skype">Skype</li>
	<li title="Slack"><img src="images/icons/slack.png" alt="Slack">Slack</li>
<?php
	if($basic === false) {
?>
	<li title="Telegram Desktop"><img src="images/icons/telegram.png" alt="Telegram">Telegram</li>
</ul>
<h3>Zábava</h3>
<ul class="inline-icons highlightable">
<?php
	}
?>
	<li title="Steam" class="no-snap"><a href="https://store.steampowered.com/about/"><img src="images/icons/steam.png" alt="Steam">Steam</a></li>
	<li title="VLC"><img src="images/icons/vlc.png" alt="VLC media player">VLC media player</li>
	<li title="Spotify"><img src="images/icons/spotify.png" alt="Spotify">Spotify</li>
	<li title="Netflix" class="no-snap"><a href="https://www.netflix.com/cz/"><img src="images/icons/netflix.png" alt="Netflix">Netflix</a></li>
</ul>
<?php
	if($basic === false) {
?>
<h3>Produktivita</h3>
<ul class="inline-icons highlightable">
	<li title="Gimp"><img src="images/icons/gimp.png" alt="Gimp">Gimp</li>
	<li title="Inkscape"><img src="images/icons/inkscape.png" alt="Inkscape">Inkscape</li>
	<li title="Android Studio"><img src="images/icons/android-studio.png" alt="Android Studio">Android Studio</li>
	<li title="VSCode"><img src="images/icons/visual-studio-code.png" alt="Visual Studio Code">Visual Studio Code</li>
	<li title="Sublime Text"><img src="images/icons/sublime-text.png" alt="Sublime Text">Sublime Text</li>
	<li title="IntelliJ IDEA Community"><img src="images/icons/idea-community.png" alt="IDEA Community">IDEA Community</li>
</ul>
<?php
	}
?>
<ul class="inline-icons">
	<li title="LibreOffice"><img src="images/icons/libreoffice.png" alt="LibreOffice"></li>
	<!-- <li title="WPS Office"><img src="images/icons/wps.png" alt="WPS-Office"></li> -->
</ul>

<a class="button green" href="https://snapcraft.io/store">Další aplikace naleznete v obchodě s balíčky Snap</a>

<script>
	"use strict";
	let featuredApps = document.querySelectorAll("article.info ul.inline-icons > li");
	for(let i = 0; i < featuredApps.length; i++) {
		if(!featuredApps[i].classList.contains("no-snap")) {			
			let appId = featuredApps[i].title.toLowerCase().replace(/ /g, "-");
			let appIcon = featuredApps[i].querySelector("img")
			let linkTag = document.createElement("a");
			linkTag.href = "https://snapcraft.io/" + appId;
			linkTag.appendChild(appIcon);
			let linkTagLabel = document.createElement("span");
			linkTagLabel.innerText = featuredApps[i].innerText;
			linkTag.appendChild(linkTagLabel);
			featuredApps[i].innerText = "";
			featuredApps[i].appendChild(linkTag);
		}
	}
</script>
