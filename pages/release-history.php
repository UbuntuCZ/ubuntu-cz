<section class="hero">
	<div class="img-container">
		<div class="bg-container fixed-container" style="background-image: url('images/sea.jpg');"></div>
		<div class="wrapper">
			<div class="intro">
				<h1>Jednotlivá vydání Ubuntu</h1>
				<p>Projekt Ubuntu započal v roce 2005 jako produkt nově registrované softwarové firmy Canonical. Jeho cílem bylo vytvořit uživatelsky přívětivý operační systém, díky čemuž se Ubuntu stalo velmi krátce hojně instalovaným a oblíbeným systémem.</p>
			</div>
		</div>
	</div>
</section>
<section class="padded">
	<div class="wrapper">
		<article>
			<div class="padded">
				<h2>Seznam vydaných a budoucích verzí Ubuntu</h2>
			</div>
			<div class="row-boxes mobile-reverse">
				<ul>
					<li>
						<div class="box">
							<ol class="releases">
							<?php
								$releases = UbuntuReleases::getInstance();
								$counter = 0;
								foreach(array_reverse($releases->getReleases()) as $release) {
									echo "<li class=\"" . $release->status . "\">" . $release->readableRelDate . " - " . $release->name . ($release->lts ? " LTS" : "");
									if($counter <= 10) {
										echo "<br>Podporováno do " . $release->readableEndMonthVarCS;
									}
									echo "<div class=\"baloon\"></div></li>\n";
									$counter++;
								}
							?>
							</ol>
						</div>
					</li>
					<li>
						<div class="box">
							<h3>Vysvětlivky</h3>
							<ul>
								<li>Aktuálně podporovaná vydání Ubuntu s dostupnými bezpečnostními aktualizacemi jsou označena oranžovou barvou, doprovázena zelenou potvrzovací ikonkou.</li>
								<li>Nadcházející zatím nehotová vydání jsou zařazena v horní části seznamu.</li>
								<li>Předešlá již dále nepodporovaná vydání jsou zobrazeny šedivě a označeny červenou ikonkou.</li>
								<li><strong>LTS vydání s dlouhodobou podporou jsou zvýrazněna tučně.</strong></li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</article>
	</div>
</section>
