<?php
	require_once("objecvitesite.php");
	date_default_timezone_set("Europe/Prague");
	
	function generareMenu() {
		global $pagesHolder;
		$current_section = null;
		$config = parse_ini_file("pages/pages.conf", true);
		
		$out = "<ul class=\"menu\">\n";
		foreach($config as $key => $section) {
			if(!in_array($key, $pagesHolder->getKeysToSkip())) {
				$sectionItem = null;
				$subMenuItems = [];
				
				foreach($section as $pageKey => $page) {
					$pageParts = explode(";", $page);
					$pageItem = $pagesHolder->getPage(array_shift($pageParts));
					
					if($pageItem) {
						if($pageItem->isCurrent) {
							$pageItem->appendClass("current");
							$current_section = $section;
						}
						if($pageKey == "section") {
							$sectionItem = $pageItem;
						}
						else {
							if($pageItem->isCurrent) {
								if($sectionItem) {
									$sectionItem->appendClass("current");
									$sectionItem->appendClass("not-exact");
								}
							}
						}
						if(sizeof($section) > 1) {
							array_push($subMenuItems, $pageItem);
						}
					}
				}
				if(sizeof($section) > 1) {
					$sectionItem->appendClass("top-level");
				}
				
				if($sectionItem) {
					$out .= $sectionItem->generateListItem(true);
					if(sizeof($subMenuItems) > 0) {
						$out .= "\n\t<div class=\"submenu\">\n<ul class=\"menu\">\n\t\t";
						foreach($subMenuItems as $subMenuItem) {
							$out .= $subMenuItem->generateListItem(true, true) . "\n";
						}
						$out .= "\t</ul>\n</div>\n";
					}
					$out .=  "\t</li>";
				}
			}
		}
		$out .=  "</ul>\n";
		echo $out;
		return [$config, $current_section];
	}
	
	function generareSubMenu($section) {
		if($section) {
			$length = count($section);
			if($length >= 2) {
				global $pagesHolder;
				echo "<nav class=\"breadcrumbs\">\n";
				echo "\t<div class=\"wrapper\">\n";			
				echo "\t\t<ul class=\"sub-menu\">\n";
				foreach($section as $pageKey => $page) {
					$pageParts = explode(";", $page);
					$pageItem = $pagesHolder->getPage(array_shift($pageParts));
					if($pageKey == "section") {
						$pageItem->appendClass("current-section");
					}
					echo $pageItem->generateListItem();
				}
				echo "\t\t</ul>\n";
				echo "\t</div>\n";
				echo "</nav>\n";
			}
		}
	}
	
	function generareFooterMenu($config = null) {
		global $pagesHolder;
		if($config) {
			$out = "<ul class=\"footer-menu\">\n";
			foreach($config as $key => $section) {
				if(!in_array($key, $pagesHolder->getKeysToSkip())) {
					$tmpSubList = "";
					if(sizeof($section) > 1) {
						$tmpSubList = "\n\t<ul class=\"footer-menu\">\n\t\t";
						foreach($section as $pageKey => $page) {
							$pageParts = explode(";", $page);
							if($pageKey == "section") {
								$sectionItem = $pagesHolder->getPage(array_shift($pageParts));
								if($sectionItem && $sectionItem->isCurrent) {
									$current_section = $section;
								}
							}
							else {
								$pageItem = $pagesHolder->getPage(array_shift($pageParts));		
								$tmpSubList .= $pageItem->generateListItem();	
								if($pageItem && $pageItem->isCurrent) {
									if($sectionItem) {
										$sectionItem->appendClass("current");
									}
								}
							}
						}
						$tmpSubList .= "\n\t</ul>\n";
						if($sectionItem != null) {
							$out .= $sectionItem->generateListItem(true);
						}
						$out .= $tmpSubList;
						$out .=  "\t</li>";
					}
				}
			}
			$out .=  "</ul>\n";
			echo $out;
		}
	}
	
	function getSitePath() {
		$dir = "/"; dirname(substr(__FILE__, strlen($_SERVER["DOCUMENT_ROOT"])));
		if($dir == "/") {
			return $dir;
		}
		return $dir.DIRECTORY_SEPARATOR;
	}
	
	function getAllPages() {
		return glob("pages/*.{php,html,txt}", GLOB_BRACE);
	}
	
	function listAllPages() {
		foreach(getAllPages() as $page) {
			echo $page."<br>";
		}
	}
	
	function generateHtaccess() {
		$config = parse_ini_file("pages/pages.conf", true);
		$locationPrefix = getSitePath();
		
		$htaccess = "# iubuntu.cz htaccess paths redirect";
		
		$htaccess .= "RewriteRule ^${locationPrefix}?$ index.php\n";
		
		$pagePathsByKeysForRedirects = [];
		
		foreach($config as $key => $section) {
			if($key == "redirects") {
				$htaccess .= "\n#Redirects:\n";
			}
			foreach($section as $page) {
				$lineArray = explode(";", $page);
				$url = array_shift($lineArray);
				$path = array_shift($lineArray);
				$name = array_shift($lineArray);
				
				if($key != "redirects") {
					$htaccess .= "RewriteRule ^${path}/?$ index.php?page=${url}\n";
					if($key != "custom") {
						$pagePathsByKeysForRedirects[$url] = $path;
					}
				}
				else {
					$pagePath = $pagePathsByKeysForRedirects[$url];
					if($pagePath) {
						$htaccess .= "RewriteRule ^${path}/?$ https://%{HTTP_HOST}/${pagePath} [L,R=301]\n";
					}
				}
				
			}
		}
		
		$htaccess .= "\n\nRewriteCond %{REQUEST_FILENAME} !-d\n";
		$htaccess .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
		$htaccess .= "RewriteRule ^ /index.php?page=error [L]\n";
		
		$template = file_get_contents(".htaccess-template");
		
		print(".htaccess generated ... (now beign saved)");
			
		return file_put_contents(".htaccess", $template . "\n\n\n" . $htaccess);
	}
	
	if(isset($_GET["htaccess-redo"])) {
		generateHtaccess();
	}
?>
