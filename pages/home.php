<?php
	$releases = UbuntuReleases::getInstance();
	$ltsRelease = null;
	$ltsReleaseIsCurrent = false;
	$relularRelease = null;
	$latestRelease = null;
	foreach(array_reverse($releases->getReleases()) as $release) {
		if($release->lts && strpos($release->status, "current") !== false) {
			$ltsRelease = $release;
			$ltsReleaseIsCurrent = $release->current;
			break;
		}
		else {
			if(!$relularRelease && strpos($release->status, "current") !== false) {
				$relularRelease = $release;
			}
		}
	}
	$latestRelease = $relularRelease ? $relularRelease : $ltsRelease;
?>


<section class="hero">
	<div class="img-container">
		<div class="bg-container fixed-container top" style="background-image: url('images/wallpaper-18.10.jpg');"></div>
		<div class="wrapper">
			<div class="intro transparent text-white">
				<h1>Ubuntu <?php echo $latestRelease->number; if($ltsReleaseIsCurrent && $ltsRelease) { echo " LTS"; } ?></h1>
				<p>Nové Ubuntu je tady a přináší od základů přepracovaný vzhled, nové ikonky, nejnovější softwarové vybavení a množství oprav a menších vylepšení. <a href="<?php $pagesHolder->getPageUrl("desktop"); ?>" class="text">Zjistěte o Ubuntu více</a></p>
				<a href="<?php $pagesHolder->getPageUrl("desktop-download"); ?>#<?php if($ltsReleaseIsCurrent && $ltsRelease) { echo "lts"; } else { echo "standard"; } ?>" class="button">Stáhnout Ubuntu <?php echo $latestRelease->number; if($ltsReleaseIsCurrent && $ltsRelease) { echo " LTS"; } ?></a>
			</div>
		</div>
	</div>
</section>

<!--
<section class="hero">
	<div class="img-container">
		<div class="bg-container top natural right" style="background-image: url('images/linux-birthday.jpg');"></div>
		<div class="wrapper">
			<div class="intro center transparent text-white">
				<h1>27 let Linuxu</h1>
				<p>Všechno nejlepší nejrozšířejěnšímu operačnímu systému, bez kterého by se dnešní svět IT již dávno neobešel.</p>
				<a href="https://www.linuxfoundation.org/"><img src="images/partners/linux-foundation.png" alt="The Linux Foundation" style="margin: 30px auto; width: auto; max-width: 200px;"></a>
			</div>
		</div>
	</div>
</section>
-->

<section class="padded bordered">
	<div class="wrapper">
		<article class="padded" id="rss-feed"></article>
	</div>
</section>
<section class="center higher-padded beige">
	<div class="wrapper">
		<article class="padded">
			<h2>Ubuntu je&nbsp;otevřená softwarová platforma, která běží na&nbsp;mnoha zařízeních od&nbsp;cloudu, přes osobní počítače <!--a&nbsp;chytré telefony -->až&nbsp;po&nbsp;malá zařízení spadající do&nbsp;kategorie Internet of Things&nbsp;(IoT)</h2>
			<ul class="inline-icons stretched padded">
				<li><img src="images/form-factors/icon-cloud.svg" alt="cloud" title="Cloud" class="dark">Cloud</li>
				<li><img src="images/form-factors/icon-server.svg" alt="server" title="Server" class="dark">Server</li>
				<li><img src="images/form-factors/icon-containers.svg" alt="kontejnery" title="Kontejnery" class="dark">Kontejnery</li>
				<li><img src="images/form-factors/icon-laptop.svg" alt="desktop" title="Desktop" class="dark">Desktop</li>
				<!--
				<li><img src="images/form-factors/icon-intro-phone.svg" alt="telefon" title="Telefon" class="dark">Telefony</li>
				<li><img src="images/form-factors/icon-intro-tablet.svg" alt="tablet" title="Tablet" class="dark">Tablety</li>
				-->
				<li><img src="images/form-factors/icon-iot.svg" alt="internet věcí" title="Internet věcí" class="dark">Internet věcí</li>
			</ul>
		</article>
	</div>
</section>
<section class="grey">
	<div class="wrapper">
		<div class="user-switchable">
			<ul>
				<li class="desktop">
					<a href="<?php $pagesHolder->getPageUrl("desktop"); ?>">
						<div class="content">
							<span>Ubuntu Desktop</span>
						</div>
					</a>
				</li><li class="server">
					<a href="<?php $pagesHolder->getPageUrl("server"); ?>">
						<div class="content">
							<span>Ubuntu Cloud a Server</span>
						</div>
					</a>
				</li><li class="phone">
					<a href="<?php $pagesHolder->getPageUrl("phone"); ?>">
						<div class="content">
							<span>Ubuntu Telefony a Tablety</span>
						</div>
					</a>
				</li><li class="about">
					<a href="<?php $pagesHolder->getPageUrl("about"); ?>">
						<div class="content">
							<span>O Ubuntu</span>
						</div>
					</a>
				</li>
			</ul>
		</div>
	</div>
</section>
<section class="padded bordered">
	<div class="wrapper">
		<article class="padded border-bottom">
			<h3>Nezaplatíte ani korunu</h3>
			<p>Za instalaci ani aktualizace operačního systému Ubuntu nezaplatíte ani korunu. To ale neznamená, že by byl software nepoužitelný či nekvalitní. Model OpenSource funguje jinak, než jak jste zvyklí z ekosystémů Windows a macOS. Peníze na vývoj a údržbu pocházejí především od větších a velkých firem, které si ale také nekupují samotný software, ale platí za podporu, kterou jim společnost <strong>Canonical</strong>, vyvíjející Ubuntu, poskytuje.</p>
			
			<h3>Ubuntu je a vždy bude zdarma</h3>
			<p>Filozofií Ubuntu je poskytovat vyvíjený software zdarma s licencí otevřeného softwaru, který můžete nejen studovat, ale i modifkovat. Pro běžného uživatele je ovšem důležitější, že se může spolehnout na dvouletý cyklus vydání verzí Ubuntu s dlouhodobou podporou, označovaných <strong>LTS</strong> (long term support), <strong>s bezplatnými bezpečnostními aktualizacemi</strong>, v době trvající podpory aktuální verze Ubuntu, která činní 5 let, i <strong>bezplatnými systémovými aktualizacemi</strong> včetně přechodů na novější verze Ubuntu.</p>
		</article>
		<article class="padded">
			<h2>Vyvíjeno společností Canonical</h2>
			<p>Canonical Ltd. je společnost působící po celém světě s hlavním sídlem v Anglii. V březnu roku 2004 ji založil Mark Shuttleworth, který se stal kromě zakladatele firmy také druhým vesmírným turistou.</p>
		</article>
	</div>
</section>
<section class="padded beige bordered">
	<div class="wrapper">
		<article class="padded" id="rss-feed-omgubuntu"></article>
	</div>
</section>
<section class="padded center">
	<div class="wrapper">
		<article class="padded info">
			<h2>Vaše oblíbené aplikace a služby k dispozici</h2>
			<?php include("parts/apps-games-overview.php"); ?>
		</article>
	</div>
</section>

<script src="design/translator.js"></script>
<script src="design/rssES6.js"></script>
<script>
	let translator = new ENCZTranslator({
		capitalizeFirst: true
	});
	new RSS({
		url: "remoteContent/insights.php",
		count: 4,
		translator
	}).appendTo(document.getElementById("rss-feed"));
	new RSS({
		url: "remoteContent/omgubuntu.php",
		count: 4,
		translator
	}).appendTo(document.getElementById("rss-feed-omgubuntu"));
</script>
