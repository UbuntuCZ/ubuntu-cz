<?php
	if(isset($_GET["remote-url"]) && isset($_GET["key"]) && $_GET["key"] === "super-secret-password-hash") {
		$url = urldecode($_GET["remote-url"]);
		$cache_file = basename($url);
		$file = "";
		if(file_exists($cache_file) && (time() - filemtime($cache_file) < (60 * 60 * 24))) {
			$file = file_get_contents($cache_file);
		}
		else {
			$file = file_get_contents($url);
			file_put_contents($cache_file, $file, LOCK_EX);
		}
		echo $file;
	}
?>
