<section class="hero">
	<div class="img-container">
		<div class="bg-container fixed-container bottom" style="background-image: url('images/desktop-hero-18.04.jpg');"></div>
		<div class="wrapper">
			<div class="intro">
				<h1>Stáhnout Ubuntu pro osobní počítače</h1>
				<p>Na výběr máte mezi dlouhodobě podporovanými verzemi, které vycházejí jednou za 2 roky, a verzemi s kratším, půlročním, vývojovým cyklem, průběžně přinášející novinky, ale na druhou stranu také vyžadující častější přechodové aktualizace.</p>
			</div>
		</div>
	</div>
</section>
<section class="padded orange">
	<div class="wrapper">
		<article class="padded">
			<p>Ubuntu si můžete stáhnout a nainstalovat úplně sami, jednoduše a zcela zdarma.</p>
		</article>
	</div>
</section>

<?php
	$releases = UbuntuReleases::getInstance();
	$ltsRelease = null;
	$relularRelease = null;
	foreach(array_reverse($releases->getReleases()) as $release) {
		if($release->lts && strpos($release->status, "current") !== false) {
			$ltsRelease = $release;
			break;
		}
		else {
			if(!$relularRelease && strpos($release->status, "current") !== false) {
				$relularRelease = $release;
			}
		}
	}
?>

<?php
	if($ltsRelease) {
?>

<section class="padded">
	<div class="wrapper">
		<div class="row-boxes two">
			<ul>
				<li>
					<div class="box">
						<h2 id="lts">Ubuntu <?php echo $ltsRelease->number . " LTS"; ?></h2>
						<p>Ubuntu <?php echo $ltsRelease->number . " LTS " . $ltsRelease->name; ?> je vydaní s dlouhodobou podporou, která činí 5 let počínaje <?php echo $ltsRelease->readableRelDate; ?>.</p>
						<p><a href="http://releases.ubuntu.com/<?php echo $ltsRelease->number; ?>" id="lts-download-link" class="button">Stáhnout Ubuntu <?php echo $ltsRelease->number; ?> (64bit)</a></p>
						<p>Ubuntu již nadále nevydává instalační obrazy pro 32bitové architektury Intel.<br>Pokud stále vlastníte takovýto počítač, můžete standardně provést <a href="<?php $pagesHolder->getPageUrl("desktop-update"); ?>" class="text">aktualizaci</a> z některé z předchozích verzí nebo provést instalaci ručně <a href="http://wiki.ubuntu.cz/instalace/z_minimalcd" class="text">z minimálního obrazu</a>.</p>
						
						<h3>Doporučené systémové požadavky</h3>
						<ul>
							<li>2 GHz dvoujádrový procesor nebo lepší.</li>
							<li>2 GB paměti ram.</li>
							<li>25 GB volného prostoru na disku.</li>
							<li>Port USB nebo DVD mechaniku pro instalační médium.</li>
							<li>Doporučeno je dále také připojení na internet pro možnost instalace dodatečných doplňků jako jsou multimediální kodeky a rovněž současnou instalaci nejnovějších aktualizací.</li>
						</ul>
					</div>
				</li>
				<li>
					<div class="box">
						<img src="images/icons/picto-ubuntu.svg" alt="ubuntu" class="responsive icon right">
						<h3>Aktualizace Ubuntu</h3>
						<p>Pokud již používáte Ubuntu, můžete snadno aktualizovat na nejnovější verzi jen v páru kliknutí.</p>
						<a href="<?php $pagesHolder->getPageUrl("desktop-update"); ?>" class="text">Chcete systém aktualizovat?<br>Následujte jednoduchý postup</a>
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>

<?php
	}
?>

<?php
	if($relularRelease) {
?>

<section class="padded border-top">
	<div class="wrapper">
		<div class="row-boxes two vertical-center">
			<ul>
				<li>
					<div class="box">
						<h2 id="standard">Ubuntu <?php echo $relularRelease->number; ?></h2>
						<p>Nejnovější vydání Ubuntu pro počítače a notebooky. Ubuntu <?php echo $relularRelease->number . " " . $relularRelease->name; ?> přináší 9 měcíců bezpečnostních a údržbových aktualizací.</p>
						<p>Pro konzervativnější a déle podporované vydání stahujte <a href="<?php $pagesHolder->getPageUrl("desktop-download"); ?>#lts" class="text">Ubuntu s dlouhodobou podporou výše</a></p>
						<p><a href="http://releases.ubuntu.com/<?php echo $relularRelease->number; ?>/ubuntu-<?php echo $relularRelease->number; ?>-desktop-amd64.iso" id="standard-download-link" class="button">Stáhnout Ubuntu <?php echo $relularRelease->number; ?> (64bit)</a></p>
						<p>Pro 32 bitové počítače si můžete stáhnout například některou z <a href="<?php $pagesHolder->getPageUrl("get-flavours"); ?>" class="text">odnoží Ubuntu.</a></p>
					</div>
				</li>
				<li>
					<div class="box">
						<p>Doporučené systémové požadavky jsou stejné, jako pro Ubuntu <?php echo $ltsRelease->number . " LTS"; ?>.</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>

<?php
	}
?>

<section class="padded grey">
	<div class="wrapper">
		<article>
			<div class="padded">
			<h2>Přechod z alternativního operačního systému</h2>
			</div>
			<div class="row-boxes two">
				<ul>
					<li>
						<div class="box">
							<img src="images/icons/picto-windows.svg" alt="windows" class="responsive icon left">
							<h3>Z Windows</h3>
							<p>Jste-li uživatelem Windows, stáhněte si Ubuntu odsud a nainstalujte.<br>K dispozici budete mít přívětivé, intuitivní a responzivní prostředí, připravené pro všechny možné situace.</p>
						</div>
					</li>
					<li>
						<div class="box">
							<img src="images/icons/picto-mac.svg" alt="macos" class="responsive icon left">
							<h3>Z macOS</h3>
							<p>Ubuntu můžete nainstalovat i na váš počítač Apple.<br>Získáte tak otevřenou základnu pro vaši efektivní práci v prostředí, které vás nebude nikdy rušit.</p>
						</div>
					</li>
				</ul>
			</div>
		</article>
	</div>
</section>
<section class="padded">
	<div class="wrapper">
		<article class="padded">
			<h2>Stáhli jste si Ubuntu, ale nevíte, jak postupovat při jeho instalaci?</h2>
			<p>Máte-li uložený .iso obraz Ubuntu na vašem počítači, musíte tento nejprve zapsat na médium typu CD/DVD nebo USB flash disk. Pro více informací o postupu před samotnou instalací si přečtěte <a href="<?php $pagesHolder->getPageUrl("desktop-install"); ?>" class="text">stránku dedikovanou instalaci Ubuntu</a>.</p>
			<p><em>Postup není složitý a je možné ho provést během několika málo minut, včetně zavedení instalátoru.</em></p>
		</article>
	</div>
</section>

<script src="design/translator.js"></script>
<script src="design/release.js"></script>
<script>
	"use strict";
	// Update release number and get other data
	let translator = new ENCZTranslator();
	
	let ltsRelase = new Release({
		version: "<?php echo $ltsRelease->number; ?>",
		type: "desktop",
		url: "remoteContent/release.php",
		old: true,
		translator
	}).appendTo(document.querySelector("a#lts-download-link"));
	
	let standardRelease = new Release({
		version: "<?php echo $relularRelease->number; ?>",
		type: "desktop",
		url: "remoteContent/release.php",
		old: true,
		translator
	}).appendTo(document.querySelector("a#standard-download-link"));
	
	window.setTimeout(() => {
		ltsRelase.refresh({
			old: false
		});
	}, 1000);
	
	window.setTimeout(() => {
		standardRelease.refresh({
			old: false
		});
	}, 2000);
</script>
