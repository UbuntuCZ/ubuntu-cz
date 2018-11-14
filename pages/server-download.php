<section class="hero">
	<div class="img-container">
		<div class="bg-container fixed-container" style="background-image: url('images/server-livepatch-hero.jpg');"></div>
		<div class="wrapper">
			<div class="intro higher">
				<h1>Stáhnout Ubuntu server</h1>
				<p>Ubuntu Server přináší široké možnosti ekonomického a technického škálování, tedy úprav tak, aby přesně odpovídalo požadavkům vašeho veřejného či privátního datacentra. Ať již chcete provozovat OpenStack cloud, Hadoop cluster nebo farmu sestávající z 50 tisíc jednotek, Ubuntu Server poskytuje nejlepší možnosti v rozmanitosti a výkonu vůbec.</p>
			</div>
		</div>
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

<section class="padded grey">
	<div class="wrapper">
		<article>
			<div class="row-boxes vertical-center two">
				<ul>
					<li>
						<div class="box">
							<h2 id="lts">Ubuntu <?php echo $ltsRelease->number . " LTS"; ?></h2>
							<p>Ubuntu <?php echo $ltsRelease->number . " LTS " . $ltsRelease->name; ?> je vydaní s dlouhodobou podporou, která činí 5 let od 26.4.2018.</p>
							<p><a href="http://releases.ubuntu.com/<?php echo $ltsRelease->number; ?>" id="lts-download-link" class="button green">Stáhnout Ubuntu <?php echo $ltsRelease->number; ?> (64bit)</a></p>
							<p><a href="http://cdimage.ubuntu.com/releases/<?php echo $ltsRelease->number; ?>/release" class="text blue">Alternativní obrazy pro další architektury</a></p>
						</div>
					</li>
					<li>
						<div class="box">
							<img src="images/small/image-server.svg" alt="ubuntu on raspberry-pi" class="responsive">
						</div>
					</li>
				</ul>
			</div>
		</article>
	</div>
</section>

<?php
	}
?>

<?php
	if($relularRelease) {
?>

<section class="padded grey border-top">
	<div class="wrapper">
		<div class="row-boxes two vertical-center">
			<ul>
				<li>
					<div class="box">
						<h2 id="standard">Ubuntu <?php echo $relularRelease->number; ?></h2>
						<p>Nejnovější vydání Ubuntu pro počítače a notebooky. Ubuntu <?php echo $relularRelease->number . " " . $relularRelease->name; ?> přináší 9 měcíců bezpečnostních a údržbových aktualizací.</p>
						<p>Pro konzervativnější a déle podporované vydání stahujte <a href="<?php $pagesHolder->getPageUrl("server-download"); ?>#lts" class="text blue">Ubuntu s dlouhodobou podporou výše</a></p>
						<p><a href="http://releases.ubuntu.com/<?php echo $relularRelease->number; ?>/ubuntu-<?php echo $relularRelease->number; ?>-desktop-amd64.iso" id="standard-download-link" class="button green">Stáhnout Ubuntu <?php echo $relularRelease->number; ?> (64bit)</a></p>
						<p><a href="http://cdimage.ubuntu.com/releases/<?php echo $relularRelease->number; ?>/release" class="text blue">Alternativní obrazy pro další architektury</a></p>
					</div>
				</li>
				<li>
					<div class="box">
						
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>

<?php
	}
?>

<section class="padded">
	<div class="wrapper">
		<article>
			<div class="padded">
				<h2>K čemu můžete Ubuntu server využít</h2>
			</div>
			<div class="row-boxes two">
				<ul>
					<li>
						<div class="box">
							<h3>OpenStack</h3>
							<p>Postavte si vlastní cloud s Autopilotem, nejsnazším způsobem jak vytvořit a spravovat cloud OpenStack.</p>
							<a href="http://www.ubuntu.com/download/cloud" class="text blue">Začněte s Autopilotem</a>
						</div>
					</li>
					<li>
						<div class="box">
							<h3>Ubuntu Server pro ARM</h3>
							<p>Optimalizováno pro obrovská nasazení a certifikováno na mnoha ARM čipsetech - Ubuntu Server pro ARM zahrnuje 64-bitové ARMv8 platformy.</p>
							<a href="http://www.ubuntu.com/download/server/arm" class="button green">Stáhnout Ubuntu Server pro ARM</a>
						</div>
					</li>
					<li>
						<div class="box">
							<h3>Ubuntu pro POWER</h3>
							<p>Ubuntu je nyní dostupné také na platformě IBM POWER, přinášející kompletní Ubuntu a OpenStack ekosystém na IBM POWER.</p>
							<a href="http://www.ubuntu.com/download/server/power" class="text blue">Získat Ubuntu pro POWER</a>
						</div>
					</li>
					<li>
						<div class="box">
							<h3>Ubuntu pro IBM Z a IBM LinuxONE</h3>
							<p>IBM LinuxONE a z Systems využívají otevřená technologická řešení aby naplnily požadavky zadavatelů. Ubuntu je nyní dostupné s Juju a technologii OpenStack.</p>
							<a href="http://www.ubuntu.com/download/server/s390x" class="text blue">Získat Ubuntu pro IBM Z a LinuxONE</a>
						</div>
					</li>
				</ul>
			</div>
		</article>
	</div>
</section>

<script src="design/translator.js"></script>
<script src="design/release.js"></script>
<script>
	"use strict";
	// Update release number and get other data
	let translator = new ENCZTranslator();
	new Release({
		version: "<?php echo $ltsRelease->number; ?>",
		type: "server",
		url: "remoteContent/release.php",
		translator
	}).appendTo(document.querySelector("a#lts-download-link"));
	
	new Release({
		version: "<?php echo $relularRelease->number; ?>",
		type: "server",
		url: "remoteContent/release.php",
		translator
	}).appendTo(document.querySelector("a#standard-download-link"));
</script>
