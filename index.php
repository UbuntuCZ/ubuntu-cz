<?php
	require_once("objecvitesite.php");
	$pagesHolder = PagesHolder::getInstance();
	require_once("pages.php");
	
	$currentPage = $pagesHolder->getCurrentPage();
?>

<!DOCTYPE html>

<html lang="cs">
<head>
	<title>Ubuntu<?php if($currentPage != null) { echo " - " . $currentPage->name; } ?> | Česká republika</title>
	<meta charset="utf-8">
	<base href="<?php echo getSitePath(); ?>">
	<link rel="stylesheet" href="design/style.css">
	<link rel="stylesheet" href="design/fonts/fonts.css">
	<meta name="description" content="<?php if($currentPage != null && $currentPage->description) { echo $currentPage->description; } else { echo "Ubuntu je operační systém se svobodnou licencí, který nachází uplatnění na osobních počítačích a serverech stejně jako v cloudu a ve světě internetu věcí."; } ?>">
	<meta name="keywords" content="<?php if($currentPage != null && $currentPage->keywords) { echo $currentPage->keywords; } else { echo "Ubuntu, free, opensource, software, operační systém, Linux, zdarma, bezplatný, windows, náhrada, svižný, bezpečný, inovace, novinky, aktualizace, obchod, bez virů, herní."; } ?>">
	<meta name="author" content="Martin Kozub">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="google-site-verification" content="google98a19569eb1c873d">
	<meta name="theme-color" content="#E95420" />
<?php if($currentPage != null) : ?>
	<link rel="canonical" href="<?= "./" . $currentPage->path; ?>">
	<link rel="alternate" href="<?= "./index.php?page=" . $currentPage->url; ?>">
<?php endif; ?>
	<link rel="shortcut icon" href="design/icon.ico" type="image/x-icon">
	<!-- <link href="https://fonts.googleapis.com/css?family=Ubuntu:400,300,400italic,700&amp;subset=latin,latin-ext" rel="stylesheet" type="text/css"> -->
	<meta property="og:type" content="website">
<?php if($currentPage != null) : ?>
	<meta property="og:title" content="<?= $currentPage->name; ?>">
	<meta property="og:url" content="<?= "./" . $currentPage->path; ?>">
<?php endif; ?>
	<meta property="og:image" content="images/icons/picto-ubuntu.svg"> 
	<meta property="og:site_name" content="iUbuntu.cz">
</head>

<body>
	<header>
		<div class="wrapper">
			<a href="." class="title">Ubuntu</a>
			
			<nav>
				<?php
					$menuData = generareMenu();
					$section = array_pop($menuData);
				?>
			</nav>
			
			<div class="menuHide" onclick="toggleClassName(this.parentNode.parentNode, 'show');">
				<span></span><span></span><span></span><span></span>
			</div>
		</div>
	</header>
	
	<?php generareSubMenu($section); ?>
	
	<main>
		<div id="pager"></div>
		
		<?php
			if(isset($_GET["page"])) {
				$page = $_GET["page"];
				if(file_exists("pages/${page}.php")) {
					include("pages/${page}.php");
				}
				else {
					include("pages/error.php");
				}
			}
			else {
				include("pages/home.php");
			}
		?>
	</main>
	
	<footer>
		<div class="section">
			<div class="wrapper">
				<nav>
					<?php
						$config = array_pop($menuData);
						generareFooterMenu($config);
					?>
				</nav>
			</div>
		</div>
		<div class="section white">
			<div class="wrapper">
				<nav>
					<ul class="custom">
						<li><span>Externí odkazy:</span></li>
						<li><a href="https://www.ubuntu.com">Oficiální stránky projektu Ubuntu</a>
							<ul>
								<li><a href="https://tutorials.ubuntu.com/">Tutoriály pro vývojáře</a></li>
								<li><a href="https://help.ubuntu.com">Dokumentace</a></li>
								<li><a href="https://askubuntu.com">Ask Ubuntu</a></li>
							</ul>
						</li>
						<li><a href="https://www.ubuntu.cz">Oficiální české stránky</a>
							<ul>
								<li><a href="http://wiki.ubuntu.cz/">Pomoc (návody)</a></li>
								<li><a href="http://forum.ubuntu.cz/">Fórum</a></li>
							</ul>
						</li>
						<li class="social"><span>Sledujte Ubuntu na sociálních sítích</span>
							<ul>
								<li class="twitter"><a href="https://twitter.com/ubuntu">Twitter<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><defs></defs><g><path class="icon" d="M21.996-.002c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22z"></path></g><path class="logo" d="M25.18 10.95c-2.06.636-4.04 3.464-3.42 6.664-6.834-.42-9.852-4.144-11.667-5.926-1.85 3.32.048 6.55 1.704 7.594-.874.05-1.932-.335-2.457-.67-.2 3.064 2.255 5.188 4.344 5.738-.668.203-1.297.23-2.373.067.917 3.082 3.378 3.907 5.21 4.042-2.36 2.082-5.192 2.536-8.274 2.383 7.99 4.97 16.056 1.912 19.983-1.99 3.296-3.275 4.77-8.18 4.82-12.57.756-.623 2.282-1.945 2.696-2.98-.6.236-1.792.796-3.034.846 1.023-.683 2.195-2.05 2.318-3.117-1.133.627-2.444 1.17-3.567 1.344-2.117-2.078-4.178-2.076-6.284-1.426z"></path></svg></a></li>
								<li class="facebook"><a href="https://www.facebook.com/ubuntulinux/">Facebook<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs></defs><g><path class="icon" d="M15.947 0C7.14 0 0 7.143 0 15.95 0 24.76 7.142 31.9 15.95 31.9s15.948-7.14 15.948-15.95c0-4.23-1.68-8.286-4.672-11.277C24.234 1.68 20.176 0 15.946 0z"></path></g><path class="logo" d="M18.632 5.102c-2.91 0-4.904 1.776-4.904 5.04v2.55h-3.293v3.814h3.293V26.87c1.353-.18 2.678-.53 3.942-1.045v-9.31h3.285l.492-3.812h-3.784v-2.18c0-1.104.357-2.238 1.894-1.855h2.02V5.252c-.978-.103-1.96-.154-2.943-.15h-.002z"></path></svg></a></li>
								<li class="linkedin"><a href="https://www.linkedin.com/company/canonical-ltd-/">LinkedIn<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33"><defs></defs><g><path class="icon" d="M16.26 0C7.28 0 0 7.28 0 16.26s7.28 16.262 16.26 16.262 16.262-7.28 16.262-16.26C32.522 7.28 25.242 0 16.262 0z"></path></g><path class="logo" d="M7 8.512v16.38c0 .758.63 1.37 1.404 1.37h16.192c.775 0 1.404-.612 1.404-1.37V8.512c0-.755-.63-1.37-1.404-1.37H8.404C7.63 7.143 7 7.757 7 8.513zm5.76 14.636H9.89v-8.634h2.87v8.634zm-1.435-9.812h-.02c-.962 0-1.585-.663-1.585-1.492 0-.847.642-1.492 1.624-1.492s1.586.645 1.604 1.492c0 .83-.623 1.492-1.623 1.492zm3.022 9.812s.038-7.824 0-8.634h2.87v1.252h-.02c.38-.59 1.058-1.454 2.607-1.454 1.888 0 3.303 1.234 3.303 3.885v4.95h-2.87V18.53c0-1.162-.415-1.953-1.453-1.953-.793 0-1.265.534-1.472 1.05-.076.184-.095.44-.095.7v4.82h-2.87z"></path></svg></a></li>
								<li class="google-plus"><a href="https://plus.google.com/+Ubuntu">Google+<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137.56 137.56"><defs></defs><g><path class="icon" d="M68.78 0a68.78 68.78 0 1 0 68.78 68.78A68.78 68.78 0 0 0 68.78 0z"></path></g><path class="logo" d="M82.85 62.62H53.29v12.32H70a17.29 17.29 0 1 1-5-19.35l8.59-8.86a29.57 29.57 0 1 0 9.2 15.89zM117.28 63.41h-10.33V53.08H99.4v10.33H89.06v7.56H99.4V81.3h7.55V70.97h10.33v-7.56z"></path></svg></a></li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		<div class="section white">
			<p>2012 - <?php echo date("Y"); ?> iubuntu.cz, &copy; Canonical Ltd. Ubuntu a Canonical jsou registrovanými známkami společnosti Canonical Ltd.</p>
		</div>
	</footer>
	
	<link rel="stylesheet" href="design/core-elements.css">
	<script>
		"use strict";
		function toggleClassName(element, className) {
			if(element.className === className) {
				element.className = "";
			}
			else {
				element.className = className;
			}
		}
	</script>
	
	<script src="design/header.js"></script>
	<script>
		new Header();
	</script>
	
	<script src="design/breadcrumbs.js"></script>
	<script>
		new Breadcrumbs();
	</script>
	
	<script src="design/pagerES6.js"></script>
	<script>
		new Pager({
			container: document.getElementById("pager"),
			sections: document.querySelectorAll("section.anchor")
		}).generatePager();
	</script>
</body>

</html>
